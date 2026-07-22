'use strict';

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5.6';
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 8;
const RATE_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT = 15;
const rateBuckets = new Map();

const SYSTEM_PROMPT = `You are Pavan, the helpful AI travel assistant inside the Beyond The Map website.

Keep answers clear, practical and normally under 180 words. Answer travel questions and general questions. Use the web_search tool before answering anything likely to have changed, including visa or entry rules, transport schedules, prices, opening hours, weather, current events and official application links. Prefer government, embassy, transport-operator and official tourism sources. Never present a visa outcome as guaranteed. Make it clear when a price or itinerary is only an estimate.

Website reference:
- Main routes include India to the United Kingdom; UK-Türkiye-UK; UK-France-Belgium-Netherlands-UK; UK-Poland-Czechia-Austria-Slovakia-Slovenia-Hungary-UK; and UK-Italy-Switzerland-Italy-Spain-Portugal-Sweden.
- The saved six-day Türkiye planning total is £1,585 including contingency. It is a planning figure, not a live quote.
- The website contains country pages, budgets, visa checklists, blog stories, photos and videos.
- For Schengen or Türkiye visa questions, remind the user to confirm the current rule and personalised document checklist with the official authority before applying.

Stay in character as Pavan. Do not say that you are the official ChatGPT website. You are an assistant powered through the OpenAI API inside Beyond The Map.`;

function normaliseOrigin(value){
  return String(value || '').trim().replace(/\/$/, '');
}

function allowedOrigins(){
  const configured = String(process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(normaliseOrigin)
    .filter(Boolean);
  if(process.env.VERCEL_URL) configured.push(`https://${process.env.VERCEL_URL}`);
  configured.push('http://localhost:3000', 'http://localhost:8000', 'http://127.0.0.1:8000');
  return new Set(configured);
}

function setCors(req, res){
  const origin = normaliseOrigin(req.headers.origin);
  const allowed = allowedOrigins();
  if(!origin || !allowed.has(origin)) return false;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
  return true;
}

function sendJson(res, status, body){
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

function clientIp(req){
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}

function withinRateLimit(req){
  const now = Date.now();
  const key = clientIp(req);
  const existing = rateBuckets.get(key);
  if(!existing || now - existing.startedAt >= RATE_WINDOW_MS){
    rateBuckets.set(key, {startedAt:now, count:1});
    return true;
  }
  existing.count += 1;
  if(rateBuckets.size > 5000){
    for(const [bucketKey, bucket] of rateBuckets){
      if(now - bucket.startedAt >= RATE_WINDOW_MS) rateBuckets.delete(bucketKey);
    }
  }
  return existing.count <= RATE_LIMIT;
}

function cleanText(value, maxLength){
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function parseBody(req){
  if(req.body && typeof req.body === 'object') return req.body;
  if(typeof req.body === 'string'){
    try{return JSON.parse(req.body);}catch(_error){return {};}
  }
  return {};
}

function cleanHistory(value){
  if(!Array.isArray(value)) return [];
  return value.slice(-MAX_HISTORY_MESSAGES).flatMap(item => {
    const role = item && (item.role === 'assistant' || item.role === 'user') ? item.role : '';
    const content = cleanText(item && item.content, MAX_MESSAGE_LENGTH);
    return role && content ? [{role, content}] : [];
  });
}

function extractAnswer(response){
  let text = '';
  const citations = [];
  const output = Array.isArray(response.output) ? response.output : [];
  for(const item of output){
    if(!item || item.type !== 'message' || !Array.isArray(item.content)) continue;
    for(const part of item.content){
      if(!part || part.type !== 'output_text' || typeof part.text !== 'string') continue;
      const offset = text.length + (text ? 1 : 0);
      if(text) text += '\n';
      text += part.text;
      const annotations = Array.isArray(part.annotations) ? part.annotations : [];
      for(const annotation of annotations){
        if(!annotation || annotation.type !== 'url_citation') continue;
        const source = annotation.url_citation || annotation;
        if(typeof source.url !== 'string' || !/^https:\/\//i.test(source.url)) continue;
        citations.push({
          type:'url_citation',
          url:source.url,
          title:cleanText(source.title, 200) || 'Source',
          startIndex:Number(source.start_index) + offset,
          endIndex:Number(source.end_index) + offset
        });
      }
    }
  }
  return {reply:text.trim(), citations:citations.slice(0, 12)};
}

module.exports = async function handler(req, res){
  if(!setCors(req, res)){
    return sendJson(res, 403, {error:'This website origin is not allowed.'});
  }
  if(req.method === 'OPTIONS'){
    res.statusCode = 204;
    return res.end();
  }
  if(req.method !== 'POST') return sendJson(res, 405, {error:'Method not allowed.'});
  if(!withinRateLimit(req)) return sendJson(res, 429, {error:'Too many questions. Please wait a few minutes.'});
  if(!process.env.OPENAI_API_KEY) return sendJson(res, 503, {error:'The assistant is not configured yet.'});

  const body = parseBody(req);
  const message = cleanText(body.message, MAX_MESSAGE_LENGTH);
  if(!message) return sendJson(res, 400, {error:'Please enter a question.'});

  const history = cleanHistory(body.history);
  const pageTitle = cleanText(body.page && body.page.title, 160);
  const pagePath = cleanText(body.page && body.page.path, 240);
  const pageContext = pageTitle || pagePath ? `Current website page: ${pageTitle || 'Beyond The Map'} (${pagePath || '/'}).\n\n` : '';
  const input = [...history, {role:'user', content:pageContext + message}];

  try{
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method:'POST',
      headers:{
        'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL || DEFAULT_MODEL,
        instructions:SYSTEM_PROMPT,
        input,
        tools:[{type:'web_search', search_context_size:'low'}],
        tool_choice:'auto',
        reasoning:{effort:'low'},
        max_output_tokens:900,
        store:false
      })
    });

    const data = await openaiResponse.json().catch(() => ({}));
    if(!openaiResponse.ok){
      console.error('OpenAI API error', openaiResponse.status, data && data.error && data.error.code);
      return sendJson(res, 502, {error:'The live assistant could not answer right now.'});
    }
    const result = extractAnswer(data);
    if(!result.reply) return sendJson(res, 502, {error:'The assistant returned an empty answer.'});
    return sendJson(res, 200, result);
  }catch(error){
    console.error('Chat endpoint failure', error && error.name);
    return sendJson(res, 502, {error:'The live assistant could not answer right now.'});
  }
};

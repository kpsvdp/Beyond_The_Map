(function(){
  const countries = [
    ['turkey','🇹🇷 Türkiye','TRY','Istanbul, Cappadocia, Antalya, Pamukkale, Bosphorus, bazaars'],
    ['france','🇫🇷 France','EUR','Paris, Eiffel Tower, Louvre, Nice, Lyon'],
    ['belgium','🇧🇪 Belgium','EUR','Brussels, Bruges, Ghent, Grand Place'],
    ['netherlands','🇳🇱 Netherlands','EUR','Amsterdam, canals, museums, windmills'],
    ['poland','🇵🇱 Poland','PLN','Krakow, Warsaw, Auschwitz day trip, old towns'],
    ['czechia','🇨🇿 Czech Republic','CZK','Prague, Charles Bridge, Old Town, castle area'],
    ['austria','🇦🇹 Austria','EUR','Vienna, Salzburg, palaces, Alpine routes'],
    ['slovakia','🇸🇰 Slovakia','EUR','Bratislava, old town, Danube, castle area'],
    ['hungary','🇭🇺 Hungary','HUF','Budapest, thermal baths, Danube, ruin bars'],
    ['slovenia','🇸🇮 Slovenia','EUR','Ljubljana, Lake Bled, caves, nature routes'],
    ['italy','🇮🇹 Italy','EUR','Milan, Pisa, Rome, Venice, Florence'],
    ['switzerland','🇨🇭 Switzerland','CHF','Interlaken, Grindelwald, Zurich, Alps'],
    ['spain','🇪🇸 Spain','EUR','Barcelona, Madrid, beaches, Gothic Quarter'],
    ['portugal','🇵🇹 Portugal','EUR','Lisbon, Porto, viewpoints, coastal walks'],
    ['sweden','🇸🇪 Sweden','SEK','Stockholm, Gamla Stan, archipelago, museums']
  ];

  const routeText = 'Route 1: 🇮🇳 India → 🇬🇧 United Kingdom → 🇹🇷 Turkey → 🇬🇧 United Kingdom. Route 2: 🇬🇧 UK → 🇫🇷 France → 🇧🇪 Belgium → 🇳🇱 Netherlands → 🇬🇧 UK. Route 3: 🇬🇧 UK → 🇵🇱 Poland → 🇨🇿 Czech Republic → 🇦🇹 Austria → 🇸🇰 Slovakia → 🇸🇮 Slovenia → 🇭🇺 Hungary → 🇬🇧 UK. Route 4: 🇬🇧 UK → 🇮🇹 Italy → 🇨🇭 Switzerland → 🇮🇹 Italy → 🇪🇸 Spain → 🇵🇹 Portugal → 🇸🇪 Sweden.';
  const budgetText = 'Use the Budget page for country-wise amounts. The site supports GBP, INR, USD, EUR, CHF, TRY, PLN, CZK, HUF and SEK. Keep a safety buffer for food, local transport, lockers, toilets and missed connections.';
  const visaText = 'For Türkiye, an Indian passport holder may qualify for a conditional e-Visa with a valid UK, US, Irish or Schengen visa/residence permit. Use evisa.gov.tr and meet every displayed condition. For Schengen, prepare passport validity, UK status, bookings, financial evidence, insurance and a cover letter.';
  const docsText = 'Document order: passport copy, UK residence/eVisa/share code, application form, appointment proof, cover letter, itinerary, flights/trains/ferry proof, accommodation proof, employment letter, payslips, bank statements, insurance and old Schengen visa copies if available.';
  const packingText = 'For cabin baggage: wear black shoes, black jeans, jacket and cap. Pack light tops, shorts/pants, underwear, socks, sleepwear, swimwear, adapter, charger, allowed power bank, medicines and document copies.';
  const quickQuestions = ['What is my route?','What documents do I need?','Budget in INR?','What should I pack?','Tell me about Italy','Türkiye 6-day route'];
  const conversation = [];
  let configPromise;
  let requestInProgress = false;

  function basePath(){
    const path = location.pathname;
    if(path.includes('/countries/') || path.includes('/budget/') || path.includes('/visa/') || path.includes('/blog/')) return '../';
    return '';
  }

  function offlineAnswer(input){
    const q = input.toLowerCase().trim();
    if(!q) return 'Ask me about route, budget, visa documents, countries, packing, hotels, flights or activities.';
    const turkeyQuery = q.includes('turkey') || q.includes('türkiye');
    if(turkeyQuery && (q.includes('budget') || q.includes('cost') || q.includes('money'))) return 'The default six-day Türkiye planning total is £1,585 for one traveller with cabin baggage. It includes flights £266, buses £38, rooms £560, activities £316, food £180, local transport £80 and a £145 contingency. You can enter your own food price for every day on the Turkey Details or Budget page.';
    if(turkeyQuery && q.includes('visa')) return 'An Indian ordinary-passport holder needs a Türkiye visa. You may qualify for a conditional e-Visa if your UK, US, Irish or Schengen visa/residence permit is valid and you meet every condition on evisa.gov.tr. It is not a Schengen visa or a guaranteed visa on arrival.';
    if(turkeyQuery) return 'Six-day Türkiye route: 🇬🇧 London → Istanbul → Cappadocia → Antalya → Pamukkale → Antalya → 🇬🇧 London. It uses 1 Istanbul night, 2 Cappadocia nights and 2 Antalya nights. Planning total: £1,585 including contingency.';
    if(q.includes('route') || q.includes('journey') || q.includes('travel list') || q.includes('direction')) return routeText;
    if(q.includes('budget') || q.includes('cost') || q.includes('money') || q.includes('inr') || q.includes('usd') || q.includes('gbp') || q.includes('currency')) return budgetText;
    if(q.includes('visa') || q.includes('schengen') || q.includes('appointment') || q.includes('vfs')) return visaText;
    if(q.includes('document') || q.includes('passport') || q.includes('brp') || q.includes('share code') || q.includes('cover letter') || q.includes('insurance')) return docsText;
    if(q.includes('pack') || q.includes('bag') || q.includes('luggage') || q.includes('clothes') || q.includes('adapter')) return packingText;
    if(q.includes('hotel') || q.includes('hostel') || q.includes('room') || q.includes('accommodation')) return 'Add hotel/hostel name, address, booking proof, check-in/check-out dates and refundable booking note. Accommodation dates must match your travel route.';
    if(q.includes('flight') || q.includes('train') || q.includes('ferry') || q.includes('transport')) return 'Keep flight, train and ferry PDFs offline. The route proof should clearly show entry and exit dates for each country.';
    if(q.includes('activity') || q.includes('places') || q.includes('visit')) return 'Use the Countries page for activities: city walks, museums, old towns, viewpoints, beaches, food streets and adventure activities.';
    for(const c of countries){
      const plainName = c[1].split(' ').slice(1).join(' ').toLowerCase();
      if(q.includes(c[0]) || q.includes(plainName)) return `${c[1]} uses ${c[2]}. Good ideas: ${c[3]}. Add room, flights/train proof, activities, day-wise budget and visa notes on that country page.`;
    }
    return 'I can answer trip doubts about route, budget, Schengen visa documents, countries, packing, hotels, flights, trains and activities.';
  }

  function validApiUrl(value){
    if(typeof value !== 'string' || !value.trim() || value.includes('YOUR-VERCEL-PROJECT')) return '';
    try{
      const url = new URL(value.trim(), location.href);
      const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      if(url.protocol !== 'https:' && !local) return '';
      return url.href;
    }catch(_error){
      return '';
    }
  }

  function loadConfig(){
    if(configPromise) return configPromise;
    configPromise = fetch(`${basePath()}chatbot-config.json`, {cache:'no-store'})
      .then(response => response.ok ? response.json() : {})
      .then(config => validApiUrl(config.apiUrl))
      .catch(() => '');
    return configPromise;
  }

  function normaliseCitations(citations, text){
    if(!Array.isArray(citations)) return [];
    return citations
      .filter(item => item && item.type === 'url_citation' && typeof item.url === 'string')
      .map(item => ({
        url: item.url,
        title: typeof item.title === 'string' ? item.title : 'Source',
        startIndex: Number(item.startIndex),
        endIndex: Number(item.endIndex)
      }))
      .filter(item => /^https:\/\//i.test(item.url) && Number.isInteger(item.startIndex) && Number.isInteger(item.endIndex) && item.startIndex >= 0 && item.endIndex > item.startIndex && item.endIndex <= text.length)
      .sort((a,b) => a.startIndex - b.startIndex);
  }

  function renderBotText(message, text, citations){
    const links = normaliseCitations(citations, text);
    if(!links.length){
      message.textContent = text;
      return;
    }
    let cursor = 0;
    links.forEach(citation => {
      if(citation.startIndex < cursor) return;
      message.appendChild(document.createTextNode(text.slice(cursor, citation.startIndex)));
      const link = document.createElement('a');
      link.href = citation.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'btm-chat-citation';
      link.textContent = text.slice(citation.startIndex, citation.endIndex);
      link.title = citation.title;
      message.appendChild(link);
      cursor = citation.endIndex;
    });
    message.appendChild(document.createTextNode(text.slice(cursor)));
  }

  function addMessage(role, text, citations){
    const body = document.querySelector('.btm-chat-body');
    if(!body) return null;
    const msg = document.createElement('div');
    msg.className = 'btm-chat-msg ' + role;
    if(role === 'bot') renderBotText(msg, text, citations);
    else msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
    return msg;
  }

  async function askLiveAssistant(input){
    const apiUrl = await loadConfig();
    if(!apiUrl){
      const error = new Error('not-configured');
      error.code = 'not-configured';
      throw error;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try{
      const response = await fetch(apiUrl, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          message:input,
          history:conversation.slice(-8),
          page:{title:document.title, path:location.pathname}
        }),
        signal:controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if(!response.ok || typeof data.reply !== 'string' || !data.reply.trim()) throw new Error('request-failed');
      return {text:data.reply.trim(), citations:Array.isArray(data.citations) ? data.citations : []};
    }finally{
      clearTimeout(timeout);
    }
  }

  function setBusy(root, busy){
    requestInProgress = busy;
    root.classList.toggle('assistant-speaking', busy);
    root.querySelector('.btm-chat-body').setAttribute('aria-busy', String(busy));
    root.querySelectorAll('.btm-chat-form input,.btm-chat-form button,.btm-chat-quick button').forEach(control => {
      control.disabled = busy;
    });
  }

  async function sendQuestion(root, input){
    const text = input.trim();
    if(!text || requestInProgress) return;
    addMessage('user', text);
    setBusy(root, true);
    const pending = addMessage('bot', 'Searching for the best answer…');
    try{
      const result = await askLiveAssistant(text);
      if(pending) pending.remove();
      addMessage('bot', result.text, result.citations);
      conversation.push({role:'user', content:text}, {role:'assistant', content:result.text});
      if(conversation.length > 12) conversation.splice(0, conversation.length - 12);
    }catch(error){
      if(pending) pending.remove();
      const fallback = offlineAnswer(text);
      const setupNote = error && error.code === 'not-configured' ? '\n\nLive ChatGPT search is ready in the files but still needs the secure API URL from GITHUB_PAGES_SETUP.md.' : '\n\nLive search is temporarily unavailable, so I used the website’s saved travel information.';
      addMessage('bot', fallback + setupNote);
    }finally{
      setBusy(root, false);
      const field = root.querySelector('.btm-chat-form input');
      if(field) field.focus();
    }
  }

  function initChat(){
    if(document.querySelector('.btm-chat-widget')) return;
    const root = document.createElement('section');
    root.className = 'btm-chat-widget btm-face-bag-style';
    root.innerHTML = `
      <button class="btm-chat-launch face-bag-launch" aria-label="Open trip assistant">
        <span class="assistant-halo"></span>
        <img src="${basePath()}assets/images/pavan-face-bag.png" alt="Pavan travel assistant face and backpack">
        <span class="floating-hi">Hi, I'm Pavan 👋</span>
      </button>
      <div class="btm-chat-panel face-bag-panel" aria-live="polite">
        <div class="face-bag-top">
          <div class="face-bag-mini">
            <img src="${basePath()}assets/images/pavan-face-bag.png" alt="Pavan assistant">
          </div>
          <div><strong>Hi, I'm Pavan</strong><small>Ask any trip doubt</small></div>
          <button class="btm-chat-close" aria-label="Close chatbot">×</button>
        </div>
        <div class="btm-chat-body"></div>
        <div class="btm-chat-quick"></div>
        <form class="btm-chat-form face-bag-form">
          <input type="text" placeholder="Ask me anything about your trip..." autocomplete="off" />
          <button type="submit" aria-label="Send message">➤</button>
        </form>
      </div>`;
    document.body.appendChild(root);
    const launch = root.querySelector('.btm-chat-launch');
    const panel = root.querySelector('.btm-chat-panel');
    const close = root.querySelector('.btm-chat-close');
    const form = root.querySelector('.btm-chat-form');
    const input = form.querySelector('input');
    const quick = root.querySelector('.btm-chat-quick');

    quickQuestions.forEach(q=>{
      const b=document.createElement('button');
      b.type='button'; b.textContent=q;
      b.addEventListener('click',()=>sendQuestion(root,q));
      quick.appendChild(b);
    });
    function open(){panel.classList.add('open'); launch.classList.add('hide'); setTimeout(()=>input.focus(),120);}
    function shut(){panel.classList.remove('open'); launch.classList.remove('hide');}
    launch.addEventListener('click', open);
    close.addEventListener('click', shut);
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const text=input.value.trim();
      if(!text) return;
      input.value='';
      sendQuestion(root,text);
    });
    addMessage('bot',"Hi, I'm Pavan 👋\nAsk me about your route, budget, Türkiye e-Visa, Schengen documents, packing, flights, trains, hotels or activities.");
    loadConfig();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initChat); else initChat();
})();

# Beyond The Map: GitHub Pages + live Pavan AI

GitHub Pages can host the website and the original Pavan chatbot design. It cannot safely store or run an OpenAI API key, so the included `api/chat.js` must be deployed as a small Vercel backend.

## 1. Upload the website to GitHub

Create a GitHub repository and upload everything in this folder. Do not add an API key to any file or GitHub Pages setting.

## 2. Create the private API key

Create an API key in the [OpenAI API dashboard](https://platform.openai.com/api-keys) and enable API billing. ChatGPT Plus and OpenAI API billing are separate.

## 3. Deploy the secure backend on Vercel

1. Import the same GitHub repository into Vercel.
2. Add these Vercel environment variables:
   - `OPENAI_API_KEY`: your private OpenAI API key.
   - `ALLOWED_ORIGINS`: `https://YOUR-GITHUB-USERNAME.github.io`
   - `OPENAI_MODEL`: `gpt-5.6`
3. Deploy the project.
4. Test `https://YOUR-VERCEL-PROJECT.vercel.app/api/chat`. Opening it directly should not reveal the key and may show an origin or method error; that is expected.

Set a sensible project budget and usage alerts in the OpenAI API dashboard. The included rate limit reduces casual abuse, but no public website endpoint can guarantee zero unwanted usage.

If you use a custom website domain, add its origin to `ALLOWED_ORIGINS`. Multiple origins must be separated with commas. Use only the origin, without a repository path or trailing slash.

Examples:

- Correct: `https://pavan.github.io`
- Correct: `https://pavan.github.io,https://beyondthemap.example`

## 4. Connect the original chatbot

Open `chatbot-config.json` and replace:

```text
https://YOUR-VERCEL-PROJECT.vercel.app/api/chat
```

with your real Vercel function URL. Commit that change to GitHub.

The API key goes only in Vercel. Never put it in `chatbot-config.json`, `chatbot.js`, HTML, CSS or the GitHub repository.

## 5. Turn on GitHub Pages

In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select the main branch and the root folder, then save. GitHub will provide the public website URL.

## What is already included

- The original “Hi, I'm Pavan” face, backpack, animation, quick questions and chat window.
- Live OpenAI Responses API answers inside that same window.
- Web search for information that may have changed.
- Clickable source citations when web search is used.
- Server-side API key protection, origin checking, message limits and basic rate limiting.
- Saved website answers as a fallback if the live service is unavailable.

OpenAI's [web-search guide](https://developers.openai.com/api/docs/guides/tools-web-search) requires visible, clickable citations for web-derived answers. OpenAI also says API keys must not be placed in browser code; requests should go through a private backend: [API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

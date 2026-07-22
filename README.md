# 🌍 Beyond The Map

### A personal AI-powered travel planning dashboard

![Beyond The Map AI journey control room](assets/images/ai-journey-control-room.png)

Beyond The Map brings itineraries, country guides, budgets, visa preparation, travel stories and media into one responsive website. It is designed around an Indian traveller based in the United Kingdom and covers completed journeys alongside future three-day trip ideas.

> **Planning notice:** Prices, transport schedules and entry rules can change. Confirm live information with airlines, transport operators, embassies and official government websites before paying or applying.

## ✨ Main features

- **Global journey dashboard** with an interactive route map and trip summaries.
- **31 country guides** covering transport, accommodation, food, activities and planning notes.
- **Detailed itineraries** for Türkiye, Paris–Brussels–Amsterdam, Central Europe, and Italy–Switzerland–Spain–Sweden.
- **Country and trip budgets** with GBP, INR, USD, EUR and other supported currencies.
- **Visa preparation pages** with document checklists, financial evidence and official application links.
- **Travel blog and media sections** for stories, photos and videos.
- **Responsive interface** for desktop, tablet and mobile, with light and dark modes.
- **Pavan AI travel assistant** with saved travel answers, optional live OpenAI responses, web search and clickable sources.

## 🧭 Website sections

| Section | What it includes |
| --- | --- |
| Dashboard | Routes, trip totals, country statistics and featured journeys |
| Countries | Destination details, flights, rooms, transport, food and activities |
| Budget | Country breakdowns, trip totals and currency conversion |
| Schengen Visa | Application routes, supporting documents and checklists |
| Photos & Videos | Travel media gallery |
| Blogger | Country and multi-country travel stories |
| Account | A browser-based traveller profile for this personal demo |

## 🤖 Pavan AI assistant

The original **“Hi, I’m Pavan”** chatbot interface is included throughout the travel pages.

- Without a backend, it uses saved answers from the website.
- With the included Vercel function, it can use the OpenAI Responses API and search the web for current information.
- Web-search answers display clickable source links.
- The OpenAI API key stays on the server and is never stored in the public website files.

GitHub Pages hosts only the static website. Live AI answers require the separate Vercel function included in [`api/chat.js`](api/chat.js). Full instructions are in [`GITHUB_PAGES_SETUP.md`](GITHUB_PAGES_SETUP.md).

## 🛠️ Built with

- HTML5
- CSS3
- Vanilla JavaScript
- Leaflet interactive maps
- GitHub Pages
- Vercel serverless functions
- OpenAI Responses API with web search

No frontend framework or database is required for the static travel website.

## 🚀 Run locally

Opening the files through a local server is more reliable than double-clicking `index.html`, especially for the chatbot configuration.

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use the **Live Server** extension in Visual Studio Code.

## 🌐 Publish with GitHub Pages

1. Extract the website ZIP.
2. Create a GitHub repository, for example `beyond-the-map`.
3. Upload the **extracted files**, not the ZIP. Keep `index.html` at the repository root.
4. Open **Settings → Pages**.
5. Select **Deploy from a branch → main → /(root)** and save.

The project URL will normally be:

```text
https://YOUR-USERNAME.github.io/beyond-the-map/
```

## 🔐 Connect live AI answers

1. Import the GitHub repository into Vercel.
2. Add these private Vercel environment variables:

   ```text
   OPENAI_API_KEY=your_private_api_key
   ALLOWED_ORIGINS=https://YOUR-USERNAME.github.io
   OPENAI_MODEL=your_supported_model
   ```

3. Deploy the Vercel project.
4. Replace the placeholder URL in [`chatbot-config.json`](chatbot-config.json) with your deployed `/api/chat` URL.
5. Commit and push that change to GitHub.

Never put an API key in HTML, JavaScript, `chatbot-config.json` or the GitHub repository. OpenAI API usage is billed separately from a ChatGPT subscription. See [OpenAI API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety) and the [OpenAI web search guide](https://developers.openai.com/api/docs/guides/tools-web-search).

## 📁 Project structure

```text
.
├── index.html                  # Sign-in page
├── dashboard.html              # Main journey dashboard
├── countries.html              # Country directory
├── budget.html                 # Budget dashboard
├── visa.html                   # Visa dashboard
├── blog.html                   # Travel stories
├── media.html                  # Photos and videos
├── assets/
│   ├── css/                    # Website styling
│   ├── images/                 # Country, page and chatbot images
│   └── js/                     # Maps, currency, account and chatbot logic
├── countries/                  # Individual country guides
├── budget/                     # Country and route budgets
├── visa/                       # Visa guides and checklists
├── blog/                       # Individual travel stories
├── api/chat.js                 # Secure Vercel AI endpoint
├── chatbot-config.json         # Public backend URL only
└── GITHUB_PAGES_SETUP.md       # Complete deployment guide
```

## ⚠️ Important limitations

- The sign-in and account pages store details only in the browser using `localStorage`. They are a personal demo, not secure production authentication. Do not store sensitive information there.
- Budget figures are planning estimates, not live quotes.
- Visa pages are preparation guides, not legal advice or a guarantee of approval.
- A public AI endpoint can create API costs. Set usage limits, billing alerts and an appropriate project budget.

---

**Beyond The Map** — plan the route, understand the cost and prepare the journey.

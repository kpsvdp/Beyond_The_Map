
(() => {
  const data = window.TRIP_DATA;
  const dayId = window.ACTIVE_DAY;
  const elTheme = document.getElementById("themeToggle");
  const fmt = (n) => window.Currency.format(n);

function applyTheme(theme){
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pb_theme", theme);
    if (elTheme) elTheme.textContent = theme === "dark" ? "🌙 Theme" : "☀️ Theme";
  }
  applyTheme(localStorage.getItem("pb_theme") || "dark");
  elTheme?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  const day = data.days.find(d => d.id === dayId);
  if (!day) return;

  const poolsTotal = (Number(data.pools.paris_transport_total)||0) + (Number(data.pools.paris_food_total)||0);
  const poolSplit = data.days.length ? poolsTotal / data.days.length : 0;
  const dayItemsTotal = day.items.reduce((a,it)=>a+(Number(it.price)||0),0);
  const dayTotal = dayItemsTotal + poolSplit;

  const bg = document.getElementById("dayBg");
  if (bg) bg.style.backgroundImage = `url("${day.hero}")`;

  document.getElementById("daySubtitle").textContent = day.title;
  document.getElementById("dayTotal").textContent = `Day total: ${fmt(dayTotal)}`;
  document.getElementById("poolSplit").textContent = `Pools split/day: ${fmt(poolSplit)}`;

  const cards = document.getElementById("cards");
  cards.innerHTML = day.items.map(it => {
    const p = Number(it.price)||0;
    return `
      <article class="card">
        <div class="cardImg" style="background-image:url('${it.image || day.hero}')"></div>
        <div class="cardBody">
          <div class="cardTop">
            <div class="time">⏰ ${it.time || "—"}</div>
            <div class="price ${p<=0 ? "zero":""}">${p>0 ? fmt(p) : "—"}</div>
          </div>
          <div class="title">${it.activity}</div>
          <div class="meta">
            <span>📍 ${it.location || "—"}</span>
            <span class="tag">${it.type || "Item"}</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
})();

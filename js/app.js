
(() => {
  const data = window.TRIP_DATA;
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

  const heroBg = document.getElementById("heroBg");
  if (heroBg) heroBg.style.backgroundImage = `url("${data.landing.background}")`;

  const sumItemsForDay = (day) => day.items.reduce((a,it)=>a+(Number(it.price)||0),0);
  const fixedTotal = data.days.reduce((a,d)=>a+sumItemsForDay(d),0);
  const poolsTotal = (Number(data.pools.paris_transport_total)||0) + (Number(data.pools.paris_food_total)||0);
  const grandTotal = fixedTotal + poolsTotal;

  const g = document.getElementById("grandTotal");
  const f = document.getElementById("fixedTotal");
  const p = document.getElementById("poolsTotal");
  if (g) g.textContent = fmt(grandTotal);
  if (f) f.textContent = fmt(fixedTotal);
  if (p) p.textContent = fmt(poolsTotal);

  const parisText = document.getElementById("parisText");
  const parisImages = document.getElementById("parisImages");
  if (parisText) parisText.innerHTML = data.landing.paris.history.map(x=>`<p>${x}</p>`).join("");
  if (parisImages) parisImages.innerHTML = data.landing.paris.images.map((src,i)=>`
    <div class="imgCard">
      <div class="img" style="background-image:url('${src}')"></div>
      <div class="caption">Paris image #${i+1}</div>
    </div>
  `).join("");

  const brText = document.getElementById("brusselsText");
  const brImages = document.getElementById("brusselsImages");
  if (brText) brText.innerHTML = data.landing.brussels.history.map(x=>`<p>${x}</p>`).join("");
  if (brImages) brImages.innerHTML = data.landing.brussels.images.map((src,i)=>`
    <div class="imgCard">
      <div class="img" style="background-image:url('${src}')"></div>
      <div class="caption">Brussels image #${i+1}</div>
    </div>
  `).join("");
})();



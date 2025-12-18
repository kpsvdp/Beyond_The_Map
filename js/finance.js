
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

  const sumItemsForDay = (day) => day.items.reduce((a,it)=>a+(Number(it.price)||0),0);
  const fixedTotal = data.days.reduce((a,d)=>a+sumItemsForDay(d),0);
  const poolsTotal = (Number(data.pools.paris_transport_total)||0) + (Number(data.pools.paris_food_total)||0);
  const grandTotal = fixedTotal + poolsTotal;
  const poolSplit = data.days.length ? poolsTotal / data.days.length : 0;

  document.getElementById("grandTotal").textContent = fmt(grandTotal);
  document.getElementById("fixedTotal").textContent = fmt(fixedTotal);
  document.getElementById("poolsTotal").textContent = fmt(poolsTotal);

  const dayRows = data.days.map(d => ({
    day: `${d.label} • ${d.date}`,
    bookings: sumItemsForDay(d),
    pools: poolSplit,
    total: sumItemsForDay(d) + poolSplit
  }));

  document.getElementById("dayTotals").innerHTML = `
    <table>
      <thead><tr><th>Day</th><th>Bookings/Tickets</th><th>Pools split</th><th>Total</th></tr></thead>
      <tbody>
        ${dayRows.map(r=>`
          <tr>
            <td>${r.day}</td>
            <td class="num">${fmt(r.bookings)}</td>
            <td class="num">${fmt(r.pools)}</td>
            <td class="num">${fmt(r.total)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  const priced = [];
  data.days.forEach(d => d.items.forEach(it => {
    const p = Number(it.price)||0;
    if (p>0) priced.push({day:`${d.label} • ${d.date}`, time:it.time||"", item:it.activity||"", type:it.type||"", price:p});
  }));

  document.getElementById("priceList").innerHTML = `
    <table>
      <thead><tr><th>Day</th><th>Time</th><th>Item</th><th>Type</th><th>Price</th></tr></thead>
      <tbody>
        ${priced.map(x=>`
          <tr>
            <td>${x.day}</td>
            <td>${x.time}</td>
            <td>${x.item}</td>
            <td>${x.type}</td>
            <td class="num">${fmt(x.price)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
})();

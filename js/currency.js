
/* Currency switcher (base amounts stored in GBP) */
(() => {
  const RATES = {
    GBP: 1,
    EUR: 1.17,   // 1 GBP ≈ 1.17 EUR (edit anytime)
    USD: 1.27,   // 1 GBP ≈ 1.27 USD
    INR: 105.00  // 1 GBP ≈ 105 INR
  };

  const LOCALES = {
    GBP: "en-GB",
    EUR: "fr-FR",
    USD: "en-US",
    INR: "en-IN"
  };

  function getCurrency(){
    return localStorage.getItem("pb_currency") || "GBP";
  }

  function setCurrency(code){
    localStorage.setItem("pb_currency", code);
  }

  function convert(amountGBP, toCode){
    const code = toCode || getCurrency();
    const rate = RATES[code] ?? 1;
    return (Number(amountGBP) || 0) * rate;
  }

  function format(amountGBP, toCode){
    const code = toCode || getCurrency();
    const locale = LOCALES[code] || "en-GB";
    const value = convert(amountGBP, code);
    return new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(value);
  }

  function bindSelect(selectId="currencySelect"){
    const el = document.getElementById(selectId);
    if (!el) return;
    el.value = getCurrency();
    el.addEventListener("change", () => {
      setCurrency(el.value);
      // easiest + safest: reload current page so all totals/cards rerender
      window.location.reload();
    });
  }

  window.Currency = { RATES, getCurrency, setCurrency, convert, format, bindSelect };
})();

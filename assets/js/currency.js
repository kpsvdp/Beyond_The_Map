
(function(){
 const rates={"GBP": 1, "INR": 106, "USD": 1.27, "EUR": 1.18, "CHF": 1.12, "TRY": 41.0, "PLN": 5.05, "CZK": 29.5, "HUF": 465, "SEK": 13.4};
 const symbols={"GBP": "\u00a3", "INR": "\u20b9", "USD": "$", "EUR": "\u20ac", "CHF": "CHF ", "TRY": "\u20ba", "PLN": "z\u0142 ", "CZK": "K\u010d ", "HUF": "Ft ", "SEK": "kr "};
 function fmt(code,val){const n=Math.round(val*rates[code]); return (symbols[code]||code+' ')+n.toLocaleString();}
 function apply(code){localStorage.setItem('btm_currency',code);document.querySelectorAll('[data-money]').forEach(el=>{const gbp=parseFloat(el.getAttribute('data-money')); if(!isNaN(gbp)) el.textContent=fmt(code,gbp);});document.querySelectorAll('#globalCurrency').forEach(s=>s.value=code);}
 document.addEventListener('DOMContentLoaded',()=>{const code=localStorage.getItem('btm_currency')||'GBP';document.querySelectorAll('#globalCurrency').forEach(s=>s.addEventListener('change',e=>apply(e.target.value)));apply(code);});
})();

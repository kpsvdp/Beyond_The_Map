(function(){
  const storageKey = 'btm_turkey_food_budget_v1';
  const defaultFood = [30, 30, 30, 30, 30, 30];
  const dayBaseWithoutFood = [310, 254, 315, 118, 151, 112];
  const subtotalWithoutFood = 1260;

  function cleanValues(values){
    return defaultFood.map((fallback, index) => {
      const value = Number(values[index]);
      return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) / 100 : fallback;
    });
  }

  function loadValues(){
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(saved) ? cleanValues(saved) : defaultFood.slice();
    } catch (error) {
      return defaultFood.slice();
    }
  }

  function saveValues(values){
    try { localStorage.setItem(storageKey, JSON.stringify(values)); } catch (error) {}
  }

  function setMoney(selector, value){
    const safeValue = Math.round(value * 100) / 100;
    document.querySelectorAll(selector).forEach(element => {
      element.setAttribute('data-money', String(safeValue));
    });
  }

  function refreshCurrency(){
    const selector = document.getElementById('globalCurrency');
    if(selector) selector.dispatchEvent(new Event('change', {bubbles:true}));
  }

  function updateBudget(values){
    const foodTotal = values.reduce((sum, value) => sum + value, 0);
    const subtotal = subtotalWithoutFood + foodTotal;
    const contingency = Math.ceil((subtotal * 0.10) / 5) * 5;
    const tripTotal = subtotal + contingency;

    setMoney('[data-food-total]', foodTotal);
    setMoney('[data-food-average]', foodTotal / 6);
    setMoney('[data-subtotal]', subtotal);
    setMoney('[data-contingency]', contingency);
    setMoney('[data-trip-total]', tripTotal);
    setMoney('[data-all-attraction-total]', tripTotal + 139);
    setMoney('[data-low-total]', Math.max(0, tripTotal - 280));

    values.forEach((foodPrice, index) => {
      setMoney(`[data-food-day-total="${index}"]`, dayBaseWithoutFood[index] + foodPrice);
      document.querySelectorAll(`[data-food-component="${index}"]`).forEach(element => {
        const fixedPart = Number(element.getAttribute('data-food-component-base')) || 0;
        element.setAttribute('data-money', String(Math.round((fixedPart + foodPrice) * 100) / 100));
      });
    });

    document.querySelectorAll('[data-food-status]').forEach(element => {
      element.textContent = 'Saved automatically and used on both Turkey Details and Budget pages.';
    });
    saveValues(values);
    refreshCurrency();
  }

  function init(){
    const inputs = Array.from(document.querySelectorAll('[data-food-input]'));
    if(!inputs.length) return;
    let values = loadValues();

    inputs.forEach(input => {
      const index = Number(input.getAttribute('data-food-input'));
      input.value = values[index];
      input.addEventListener('input', () => {
        const entered = Number(input.value);
        values[index] = Number.isFinite(entered) && entered >= 0 ? Math.round(entered * 100) / 100 : 0;
        updateBudget(values);
      });
    });

    document.querySelectorAll('[data-food-reset]').forEach(button => {
      button.addEventListener('click', () => {
        values = defaultFood.slice();
        inputs.forEach(input => {
          const index = Number(input.getAttribute('data-food-input'));
          input.value = values[index];
        });
        updateBudget(values);
      });
    });

    updateBudget(values);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

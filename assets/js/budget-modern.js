(function(){
  document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('.budget-card').forEach(function(card){
      var total=card.querySelector('.price,.range-price');
      if(total) total.setAttribute('aria-label','Estimated trip total '+total.textContent.trim());
    });
  });
})();

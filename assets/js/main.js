
(function(){
  const saved=localStorage.getItem('btm_theme'); if(saved==='light') document.body.classList.add('light');
  const btn=document.getElementById('modeToggle'); if(btn) btn.addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('btm_theme',document.body.classList.contains('light')?'light':'dark')});
  const current=location.pathname.split('/').pop()||'index.html'; document.querySelectorAll('.sidebar a').forEach(a=>{if(a.getAttribute('href')===current) a.classList.add('active')});
})();

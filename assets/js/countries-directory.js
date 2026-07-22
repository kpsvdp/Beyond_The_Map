(function(){
  const cards=[...document.querySelectorAll('.countries-grid .country-card')];
  const search=document.getElementById('countrySearch');
  const result=document.getElementById('countryResultText');
  const clear=document.getElementById('countrySearchClear');
  const filters=[...document.querySelectorAll('[data-country-filter]')];
  const group=document.querySelector('.future-group-title');
  if(!cards.length||!search||!result)return;
  cards.forEach(card=>card.dataset.group=card.classList.contains('future-country-card')?'future':'planned');
  let active='all';
  function update(){
    const term=search.value.trim().toLowerCase();
    let visible=0;
    cards.forEach(card=>{
      const groupMatch=active==='all'||card.dataset.group===active;
      const textMatch=!term||card.textContent.toLowerCase().includes(term);
      const show=groupMatch&&textMatch;
      card.hidden=!show;
      if(show)visible++;
    });
    if(group)group.hidden=active==='planned'||!cards.some(card=>card.dataset.group==='future'&&!card.hidden);
    const label=active==='planned'?'planned':active==='future'?'future':'matching';
    result.textContent=visible===cards.length&&!term?`Showing all ${visible} destinations`:`Showing ${visible} ${label} destination${visible===1?'':'s'}`;
    if(clear)clear.hidden=!search.value;
    let empty=document.querySelector('.country-empty');
    if(!visible&&!empty){empty=document.createElement('div');empty.className='country-empty';empty.textContent='No destination matches your search.';document.querySelector('.countries-grid').appendChild(empty)}
    if(empty)empty.hidden=visible>0;
  }
  search.addEventListener('input',update);
  search.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&search.value){search.value='';update();}
  });
  if(clear)clear.addEventListener('click',()=>{search.value='';search.focus();update();});
  filters.forEach(button=>button.addEventListener('click',()=>{
    active=button.dataset.countryFilter;
    filters.forEach(item=>{
      const selected=item===button;
      item.classList.toggle('active',selected);
      item.setAttribute('aria-pressed',String(selected));
    });
    update();
  }));
  update();
})();

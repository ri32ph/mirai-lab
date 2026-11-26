(() => {
  const button=document.querySelector('#breast-font');
  const header=document.querySelector('header');
  button.addEventListener('click',()=>{
    const large=document.documentElement.classList.toggle('site-large');
    button.setAttribute('aria-pressed',String(large));
    button.textContent=large?'文字を元に戻す':'文字を大きく';
  });
  const measure=()=>document.documentElement.style.setProperty('--header-offset',Math.ceil(header.getBoundingClientRect().height+12)+'px');
  measure();if('ResizeObserver'in window)new ResizeObserver(measure).observe(header);
})();

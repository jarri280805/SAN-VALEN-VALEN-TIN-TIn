document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card'));

  cards.forEach(card => {
    card.addEventListener('click', (ev) => {
      ev.stopPropagation();
      card.classList.toggle('flipped');
    });
    // touch-friendly: same behavior
    card.addEventListener('touchstart', (ev) => {
      ev.stopPropagation();
      card.classList.toggle('flipped');
    }, {passive:true});
  });

  // click outside to close all
  document.addEventListener('click', () => {
    cards.forEach(c => c.classList.remove('flipped'));
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') cards.forEach(c => c.classList.remove('flipped'));
  });

  // === MÚSICA DE FONDO ===
  const bgMusic = document.getElementById('bgMusic');
  const musicPlayBtn = document.getElementById('musicPlayBtn');
  const volumeSlider = document.getElementById('volumeSlider');

  if(bgMusic && musicPlayBtn){
    // Volumen inicial
    bgMusic.volume = 0.3;
    
    // Intentar autoplay
    bgMusic.play().catch(err => {
      console.log('Autoplay bloqueado. Usuario puede hacer click para reproducir:', err);
    });
    
    // Play/Pause
    musicPlayBtn.addEventListener('click', ()=>{
      if(bgMusic.paused){
        bgMusic.play();
        musicPlayBtn.classList.add('playing');
      } else {
        bgMusic.pause();
        musicPlayBtn.classList.remove('playing');
      }
    });
    
    // Control de volumen
    if(volumeSlider){
      volumeSlider.addEventListener('input', (e)=>{
        bgMusic.volume = e.target.value / 100;
      });
    }
    
    // Actualizar estado del botón
    bgMusic.addEventListener('play', ()=>{
      musicPlayBtn.classList.add('playing');
    });
    bgMusic.addEventListener('pause', ()=>{
      musicPlayBtn.classList.remove('playing');
    });
  }
});

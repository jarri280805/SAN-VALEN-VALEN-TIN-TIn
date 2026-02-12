document.addEventListener('DOMContentLoaded', () => {
  // Fecha de inicio: 30 junio 2024 11:59 (mes en Date es 0-index)
  const start = new Date(2024, 5, 30, 11, 59, 0);
  const out = document.getElementById('elapsed');

  function pad(n){return String(n).padStart(2,'0')}

  function updateCounter(){
    const now = new Date();
    let diff = Math.floor((now - start) / 1000);
    if(diff < 0) diff = 0;
    const days = Math.floor(diff / 86400);
    diff %= 86400;
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    out.textContent = `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  // Generar estrellas aleatorias
  const starsContainer = document.querySelector('.stars');
  const STAR_COUNT = 90;
  const w = window.innerWidth;
  const h = window.innerHeight;

  for(let i=0;i<STAR_COUNT;i++){
    const s = document.createElement('span');
    s.className = 'star';
    const size = Math.random()*3 + 1; // 1px - 4px
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${Math.random()*100}%`;
    s.style.top = `${Math.random()*100}%`;
    const dur = (Math.random()*3 + 2).toFixed(2) + 's';
    s.style.animationDuration = dur;
    s.style.opacity = (Math.random()*0.6+0.25).toFixed(2);
    starsContainer.appendChild(s);
  }

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

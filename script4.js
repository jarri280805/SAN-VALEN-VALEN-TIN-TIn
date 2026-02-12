// === PAGE 4: PROPUESTA INTERACTIVA ===

// Generar estrellas animadas
document.addEventListener('DOMContentLoaded', () => {
  const starsContainer = document.querySelector('.stars');
  const STAR_COUNT = 90;

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
});

const letter = document.getElementById('letter');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const flowersContainer = document.querySelector('.flowers-container');

// Abrir/cerrar la carta
if(letter){
  letter.addEventListener('click', (e)=>{
    // No abrir si hacemos click en los botones
    if(e.target.closest('.buttons-container')) return;
    letter.classList.toggle('open');
    letter.setAttribute('aria-expanded', letter.classList.contains('open'));
  });

  // Soporte con teclado
  letter.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      if(!letter.classList.contains('open')){
        e.preventDefault();
        letter.click();
      }
    }
  });
}

// Botón "Sí 💖" - crear flores que caen
if(btnYes){
  btnYes.addEventListener('click', (e)=>{
    e.stopPropagation();
    
    // Crear 30-40 flores
    for(let i = 0; i < 35; i++){
      setTimeout(()=>{
        const flower = document.createElement('div');
        flower.className = 'flower';
        
        // Emojis de flores variados
        const flowers = ['🌹', '🌸', '🌺', '🌻', '💐', '🌷'];
        flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
        
        // Posición horizontal aleatoria
        const startX = Math.random() * window.innerWidth;
        flower.style.left = startX + 'px';
        flower.style.top = '-40px';
        
        // Movimiento horizontal aleatorio
        const tx = (Math.random() - 0.5) * 200;
        flower.style.setProperty('--tx', tx + 'px');
        
        // Rotación inicial aleatoria
        const rotation = Math.random() * 360;
        flower.style.transform = `rotate(${rotation}deg)`;
        
        // Velocidad aleatoria (3-5s)
        const duration = 3 + Math.random() * 2;
        flower.style.animationDuration = duration + 's';
        
        // Delay para efecto más natural
        const delay = Math.random() * 0.5;
        flower.style.animationDelay = delay + 's';
        
        flowersContainer.appendChild(flower);
        
        // Remover elemento después de la animación
        setTimeout(()=>{
          flower.remove();
        }, (duration + delay) * 1000);
      }, i * 50);
    }
    
    // Efecto visual en el botón
    btnYes.style.transform = 'scale(0.95)';
    setTimeout(()=>{
      btnYes.style.transform = '';
    }, 150);
  });
}

// Botón "No 😅" - que se escapa del cursor
if(btnNo){
  btnNo.addEventListener('mouseenter', ()=>{
    moveButtonRandomly();
  });
  
  // También en mobile: cuando intenten hacer click
  btnNo.addEventListener('click', (e)=>{
    e.preventDefault();
    e.stopPropagation();
    moveButtonRandomly();
  });
}

function moveButtonRandomly(){
  // Obtener posición actual
  const rect = btnNo.getBoundingClientRect();
  const containerRect = letter.getBoundingClientRect();
  
  // Calcular rango disponible (dentro de la letra)
  const maxX = containerRect.width - rect.width - 40;
  const maxY = containerRect.height - rect.height - 40;
  
  // Posición aleatoria cercana pero no en el mismo lugar
  let newX, newY;
  let attempts = 0;
  
  do {
    newX = Math.random() * maxX;
    newY = Math.random() * maxY;
    attempts++;
  } while(
    Math.abs(newX - (rect.left - containerRect.left)) < 80 && 
    attempts < 5
  );
  
  // Aplicar la nueva posición
  btnNo.style.position = 'absolute';
  btnNo.style.left = newX + 'px';
  btnNo.style.top = newY + 'px';
  
  // Animación suave
  btnNo.style.transition = 'all 300ms ease';
  btnNo.style.transform = 'scale(1.05)';
  
  setTimeout(()=>{
    btnNo.style.transform = '';
  }, 300);
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

console.log('🎭 Page 4 loaded - Propuesta interactiva lista con música');


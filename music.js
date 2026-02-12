// Script universal para manejar música en todas las páginas
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bgMusic');
  const musicPlayBtn = document.getElementById('musicPlayBtn');
  const volumeSlider = document.getElementById('volumeSlider');

  if(!bgMusic) return; // No hay audio en esta página

  // Volumen inicial
  bgMusic.volume = 0.3;

  // Flag para saber si ya intentamos reproducir
  let playAttempted = false;

  // Función para reproducir música
  function playMusic() {
    if(playAttempted) return;
    playAttempted = true;

    bgMusic.play().then(() => {
      console.log('✅ Música reproduciendo automáticamente');
      if(musicPlayBtn) musicPlayBtn.classList.add('playing');
    }).catch(err => {
      console.warn('⚠️ Autoplay bloqueado por navegador. Esperando interacción del usuario...', err);
      // Se intentará reproducir al hacer click
    });
  }

  // Intentar reproducir de inmediato
  setTimeout(() => {
    playMusic();
  }, 500);

  // Reproducir al primer click/interacción en cualquier parte de la página
  const playOnInteraction = () => {
    if(!playAttempted && bgMusic.paused) {
      playMusic();
    }
    // Remover listeners después de primer intento
    document.removeEventListener('click', playOnInteraction);
    document.removeEventListener('touchstart', playOnInteraction);
  };

  document.addEventListener('click', playOnInteraction);
  document.addEventListener('touchstart', playOnInteraction);

  // Control del botón Play/Pause (si existe)
  if(musicPlayBtn) {
    musicPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if(bgMusic.paused) {
        bgMusic.play();
        musicPlayBtn.classList.add('playing');
      } else {
        bgMusic.pause();
        musicPlayBtn.classList.remove('playing');
      }
    });
  }

  // Control de volumen (si existe)
  if(volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      bgMusic.volume = e.target.value / 100;
    });
  }

  // Actualizar estado del botón cuando cambia reproducción
  bgMusic.addEventListener('play', () => {
    if(musicPlayBtn) musicPlayBtn.classList.add('playing');
  });
  bgMusic.addEventListener('pause', () => {
    if(musicPlayBtn) musicPlayBtn.classList.remove('playing');
  });

  console.log('🎵 Sistema de música inicializado');
});

// Juego Snake romántico con corazones - script3.js
(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const overlay = document.getElementById('overlay');
  const restartBtn = document.getElementById('restart');
  const finalPoints = document.getElementById('finalPoints');
  const nextFromGame = document.getElementById('nextFromGame');
  const nextOverlay = document.getElementById('nextOverlay');
  const nextOverlayBtn = document.getElementById('nextOverlayBtn');

  const STORAGE_KEY = 'romantic-snake-best';
  let bestScore = Number(localStorage.getItem(STORAGE_KEY) || 0);
  bestEl.textContent = bestScore;

  // configuración del tablero
  let cols = 20; // base
  let rows = 20;
  let cellSize = 20;

  let snake = [];
  let dir = {x:1,y:0};
  let nextDir = {x:1,y:0};
  let heart = {x:5,y:5};
  let score = 0;
  let lastTime = 0;
  let tickInterval = 140; // ms entre movimientos (se puede reducir con score)
  let running = false;

  // ajustar tamaño canvas y grid
  function resize(){
    const wrap = canvas.parentElement.getBoundingClientRect();
    const w = Math.min(wrap.width - 24, 920);
    // mantener cuadrícula relativamente cuadrada
    canvas.width = Math.floor(w);
    canvas.height = Math.floor(Math.min(window.innerHeight * 0.6, 640));
    // definir cols según anchura para responsividad
    cols = Math.max(12, Math.floor(canvas.width / 28));
    rows = Math.max(12, Math.floor(canvas.height / 28));
    cellSize = Math.floor(Math.min(canvas.width / cols, canvas.height / rows));
  }

  function resetGame(){
    resize();
    snake = [];
    const startX = Math.floor(cols/2);
    const startY = Math.floor(rows/2);
    for(let i=0;i<4;i++) snake.push({x:startX - i, y:startY});
    dir = {x:1,y:0}; nextDir = {x:1,y:0};
    score = 0; scoreEl.textContent = score;
    tickInterval = 140;
    placeHeart();
    running = true;
    overlay.classList.add('hidden');
    // hide next button at start
    if(nextFromGame){ nextFromGame.classList.remove('show'); }
    if(nextOverlay){ nextOverlay.classList.remove('show'); }
  }

  function placeHeart(){
    let tries = 0;
    while(true){
      const x = Math.floor(Math.random()*cols);
      const y = Math.floor(Math.random()*rows);
      const coll = snake.some(s => s.x===x && s.y===y);
      if(!coll){ heart = {x,y}; break; }
      if(++tries>200) break;
    }
  }

  function draw(){
    // fondo
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // gentle background gradient
    const g = ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,'#02111f'); g.addColorStop(1,'#00121b');
    ctx.fillStyle = g; ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw heart
    drawHeartCell(heart.x, heart.y);

    // draw snake
    for(let i=0;i<snake.length;i++){
      const s = snake[i];
      const glow = i===0 ? 16 : 6;
      drawSnakeCell(s.x,s.y,i===0,glow);
    }
  }

  function drawSnakeCell(cx,cy,isHead,glow){
    const x = Math.floor(cx*cellSize + (canvas.width - cols*cellSize)/2);
    const y = Math.floor(cy*cellSize + (canvas.height - rows*cellSize)/2);
    const r = Math.max(4, cellSize*0.18);
    ctx.save();
    ctx.shadowBlur = glow; ctx.shadowColor = 'rgba(120,190,255,0.9)';
    ctx.fillStyle = isHead ? '#dff6ff' : 'rgba(180,220,255,0.95)';
    roundRect(ctx, x+2, y+2, cellSize-4, cellSize-4, r, true, false);
    ctx.restore();
  }

  function drawHeartCell(cx,cy){
    const x = Math.floor(cx*cellSize + (canvas.width - cols*cellSize)/2 + cellSize/2);
    const y = Math.floor(cy*cellSize + (canvas.height - rows*cellSize)/2 + cellSize/2);
    const s = Math.max(6, cellSize*0.38);
    // small glowing heart
    ctx.save();
    ctx.translate(x,y);
    ctx.scale(s/30, s/30);
    ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,80,120,0.6)';
    ctx.fillStyle = '#ff2d6d';
    drawHeartPath(ctx);
    ctx.restore();
  }

  function drawHeartPath(ctx){
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(-12,-28, -36,-6, 0,24);
    ctx.bezierCurveTo(36,-6, 12,-28, 0,-8);
    ctx.closePath();
    ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke){
    if (typeof r === 'undefined') r = 5;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function gameOver(){
    running = false;
    finalPoints.textContent = score;
    overlay.classList.remove('hidden');
    if(score > bestScore){ bestScore = score; localStorage.setItem(STORAGE_KEY, bestScore); bestEl.textContent = bestScore; }
  }

  function step(timestamp){
    if(!lastTime) lastTime = timestamp;
    const elapsed = timestamp - lastTime;
    if(elapsed > tickInterval){
      lastTime = timestamp;
      // advance
      dir = nextDir;
      const head = snake[0];
      const nx = head.x + dir.x;
      const ny = head.y + dir.y;
      // check wall collision
      if(nx<0 || nx>=cols || ny<0 || ny>=rows){ return gameOver(); }
      // check self collision
      if(snake.some(s=>s.x===nx && s.y===ny)) return gameOver();
      snake.unshift({x:nx,y:ny});
      // eat heart?
      if(nx===heart.x && ny===heart.y){ score++; scoreEl.textContent = score; placeHeart();
        // speed up slightly
        tickInterval = Math.max(60, 140 - Math.floor(score*3));
        // al alcanzar 5 puntos, pausar inmediatamente y mostrar overlay grande
        if(score >= 5){
          running = false; // detener movimiento en el momento exacto
          if(nextOverlay) nextOverlay.classList.add('show');
          if(nextFromGame) nextFromGame.classList.add('show');
        }
      }else{
        snake.pop();
      }
    }
    draw();
    if(running) requestAnimationFrame(step); 
  }

  // input
  window.addEventListener('keydown', (e)=>{
    const k = e.key.toLowerCase();
    const mapping = {
      'arrowup':'up','w':'up','arrowdown':'down','s':'down','arrowleft':'left','a':'left','arrowright':'right','d':'right'
    };
    const dirName = mapping[k];
    if(!dirName) return;
    e.preventDefault();
    const dirs = {up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}};
    const nd = dirs[dirName];
    // prevent reversing
    if(nd.x === -dir.x && nd.y === -dir.y) return;
    nextDir = nd;
  });

  restartBtn.addEventListener('click', ()=>{ resetGame(); requestAnimationFrame(step); });

  // Si existe el botón 'Siguiente' en la página del juego, interceptar su click
  if(nextFromGame){
    nextFromGame.addEventListener('click', (e)=>{
      e.preventDefault();
      // pausar el juego inmediatamente
      running = false;
      // pequeña espera para asegurar pausa visual y de lógica, luego navegar
      const href = nextFromGame.getAttribute('href');
      setTimeout(()=> { window.location.href = href; }, 80);
    });
  }

  if(nextOverlayBtn){
    nextOverlayBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      running = false;
      const href = nextOverlayBtn.getAttribute('href');
      window.location.href = href;
    });
  }

  // start
  function start(){ resetGame(); requestAnimationFrame(step); }

  // make canvas responsive on resize
  window.addEventListener('resize', ()=>{ resize(); draw(); });

  // kick off
  start();

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

})();

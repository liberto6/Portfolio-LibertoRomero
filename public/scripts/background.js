
// Crear y configurar el canvas
let canvas = document.getElementById("oak-canvas");
if (!canvas) {
  canvas = document.createElement("canvas");
  canvas.id = "oak-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.zIndex = -1;
  document.body.appendChild(canvas);
}

const ctx = canvas.getContext("2d");
let W = window.innerWidth;
let H = window.innerHeight;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.scale(dpr, dpr);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Cargar la imagen de la hoja
const oakImg = new Image();
oakImg.src = "/oak.svg";

// Cargar la imagen de fondo
const bgImg = new Image();
bgImg.src = "/layered-waves-haikei.svg";

// Parámetros de hojas
const NUM_oakS = 50;
const oak_SIZE = 24; // Más pequeñas
const oaks = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < NUM_oakS; i++) {
  const size = random(oak_SIZE * 0.7, oak_SIZE * 1.3);
  const vy = random(0.18, 0.32);

  // Relacionar opacidad con tamaño (más pequeña = menos opaca)
  const minSize = oak_SIZE * 0.7;
  const maxSize = oak_SIZE * 1.3;
  const opacity = 0.4 + ((size - minSize) / (maxSize - minSize)) * 0.6;

  oaks.push({
    x: random(0, W),
    y: random(-H, 0),
    vx: random(-0.4, 0.4),
    vy,
    angle: random(0, 360),
    vangle: random(-1, 1) * vy,
    size,
    swayPhase: random(0, Math.PI * 2),
    swaySpeed: random(0.008, 0.018),
    swayAmplitude: random(8, 18),
    opacity,
    suelo: random(H * 0.83, H * 0.92)
  });
}


let mouse = { x: -1000, y: -1000 };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
  mouse.x = -1000;
  mouse.y = -1000;
});



function animate() {
  // Dibujar la imagen de fondo si está cargada
  if (bgImg.complete && bgImg.naturalWidth !== 0) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    // Si no está cargada, limpiar con fondo blanco
    ctx.clearRect(0, 0, W, H);
  }
  for (const f of oaks) {
    // Repulsión con el mouse (aún más suave y menor radio)
    const dx = f.x - mouse.x;
    const dy = f.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) {
      const force = (30 - dist) / 30;
      f.vx += (dx / dist) * force * 0.15;
      f.vy += (dy / dist) * force * 0.15;
    }
    // Movimiento tipo hoja (oscilación horizontal)
    f.swayPhase += f.swaySpeed;
    const sway = Math.sin(f.swayPhase) * f.swayAmplitude;
    // Movimiento natural
    if (f.y < f.suelo - f.size / 2) {
      f.x += f.vx + Math.sin(f.swayPhase) * f.swayAmplitude * 0.05;
      f.y += f.vy;
      f.angle += f.vangle;
    } else {
      // Toca el suelo: se detiene y pierde movimiento horizontal y sway
      f.y = f.suelo - f.size / 2;
      f.vy = 0;
      f.vx = 0;
      // No sumar sway ni vx a f.x
      // Interactividad: si el mouse la empuja hacia arriba, vuelve a caer
      if (f.y + f.vy < f.suelo - f.size / 2) {
        f.y += f.vy;
      }
    }
    if (f.x < -40) f.x = W + 40;
    if (f.x > W + 40) f.x = -40;
    // Dibujar pluma
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.rotate((f.angle * Math.PI) / 180);
    ctx.globalAlpha = f.opacity;
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 8;
    ctx.drawImage(oakImg, -f.size / 2, -f.size / 2, f.size, f.size);
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  requestAnimationFrame(animate);
}

oakImg.onload = animate;

import QRCode from "qrcode";

// Genera una "tarjeta memorial" 1080x1920 (formato Historia de Instagram)
// con foto, nombre, fechas, reseña y QR. Devuelve un PNG (Blob).

const W = 1080;
const H = 1920;
const GOLD = "#c9a24a";
const CREAM = "#efe9df";
const MUTE = "#b7afa1";

export interface MemorialCardArgs {
  photoUrl: string;
  fullName: string;
  birth: string;
  death: string;
  summary: string;
  url: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Dibuja la imagen tipo object-fit: cover dentro del rectángulo. */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const ir = img.width / img.height;
  const rr = w / h;
  let sw = img.width;
  let sh = img.height;
  let sx = 0;
  let sy = 0;
  if (ir > rr) {
    sw = img.height * rr;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / rr;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length >= max) return lines;
    } else {
      line = test;
    }
  }
  if (line && lines.length < max) lines.push(line);
  return lines;
}

export async function generateMemorialStory(a: MemorialCardArgs): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");

  // Fondo oscuro elegante
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#1d1b1a");
  bg.addColorStop(1, "#2b2825");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Foto (4:5)
  const pw = 620;
  const ph = 775;
  const px = (W - pw) / 2;
  const py = 150;
  try {
    const photo = await loadImage(a.photoUrl);
    ctx.save();
    roundRect(ctx, px, py, pw, ph, 28);
    ctx.clip();
    drawCover(ctx, photo, px, py, pw, ph);
    ctx.restore();
  } catch {
    ctx.fillStyle = "#3a3632";
    roundRect(ctx, px, py, pw, ph, 28);
    ctx.fill();
  }
  ctx.lineWidth = 4;
  ctx.strokeStyle = GOLD;
  roundRect(ctx, px, py, pw, ph, 28);
  ctx.stroke();

  ctx.textAlign = "center";
  let y = py + ph + 90;

  // Eyebrow
  ctx.fillStyle = GOLD;
  ctx.font = "600 30px Georgia, 'Times New Roman', serif";
  ctx.fillText("E N   M E M O R I A   D E", W / 2, y);
  y += 82;

  // Nombre (envuelve si es largo)
  ctx.fillStyle = CREAM;
  ctx.font = "600 76px Georgia, 'Times New Roman', serif";
  const nameLines = wrapLines(ctx, a.fullName, 920, 2);
  for (const line of nameLines) {
    ctx.fillText(line, W / 2, y);
    y += 86;
  }
  y += 4;

  // Fechas
  const dates = [a.birth, a.death].filter(Boolean).join("  —  ");
  if (dates) {
    ctx.fillStyle = GOLD;
    ctx.font = "400 40px Georgia, 'Times New Roman', serif";
    ctx.fillText(dates, W / 2, y);
    y += 64;
  }

  // Divisor dorado
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 60, y);
  ctx.lineTo(W / 2 + 60, y);
  ctx.stroke();
  y += 66;

  // Reseña
  if (a.summary) {
    ctx.fillStyle = MUTE;
    ctx.font = "400 37px Arial, Helvetica, sans-serif";
    const lines = wrapLines(ctx, a.summary, 840, 6);
    for (const line of lines) {
      ctx.fillText(line, W / 2, y);
      y += 52;
    }
  }

  // Pie: QR + marca
  const qrDataUrl = await QRCode.toDataURL(a.url, {
    margin: 1,
    width: 240,
    color: { dark: "#1d1b1a", light: "#ffffff" },
  });
  const qr = await loadImage(qrDataUrl);
  const qrSize = 180;
  const qy = H - 250;
  const qx = 100;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qx - 14, qy - 14, qrSize + 28, qrSize + 28, 18);
  ctx.fill();
  ctx.drawImage(qr, qx, qy, qrSize, qrSize);

  ctx.textAlign = "left";
  ctx.fillStyle = CREAM;
  ctx.font = "600 46px Georgia, 'Times New Roman', serif";
  ctx.fillText("Funeraria Valderrama", qx + qrSize + 50, qy + 78);
  ctx.fillStyle = MUTE;
  ctx.font = "400 30px Arial, Helvetica, sans-serif";
  ctx.fillText("Escanea para ver su memorial", qx + qrSize + 50, qy + 128);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo generar la imagen"))), "image/png");
  });
}

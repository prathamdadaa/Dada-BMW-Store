(() => {
'use strict';
const $ = s => document.querySelector(s);
const M = [
  {n:'BMW M4 Competition', hp:510, s:3.5, t:290, d:'3.0L Twin-Turbo I6 · RWD', p:'$87,900', r:94, L:1},
  {n:'BMW i8 Roadster', hp:374, s:4.4, t:250, d:'Plug-in Hybrid · AWD', p:'$163,000', r:84, L:1.03},
  {n:'BMW M5 CS', hp:627, s:3.0, t:305, d:'4.4L Twin-Turbo V8 · M xDrive', p:'$142,000', r:106, L:1.06},
  {n:'BMW X7 M60i', hp:523, s:4.7, t:250, d:'4.4L Twin-Turbo V8 · xDrive', p:'$112,000', r:134, L:1.08},
  {n:'BMW i7 xDrive60', hp:536, s:4.5, t:240, d:'Dual-Motor Electric · AWD', p:'$124,000', r:118, L:1.1},
  {n:'BMW M340i', hp:382, s:4.4, t:250, d:'3.0L Turbo I6 · xDrive', p:'$58,000', r:104, L:.98}
];
const P = [['Isle of Man Green','#0f5a45'],['Alpine White','#eceef1'],['Black Sapphire','#161c2e'],['Frozen Portimao Blue','#2f78e0'],['Toronto Red','#b3121a'],['Brooklyn Grey','#7b7f87']];
const R = [['Silver','#c9ccd1'],['Jet Black','#16171b'],['Bronze','#a2763e']];
let i = 0, pc = 0, rc = 0, slide = 0, t = 0, driving = false, cam = 0;

/* ---------- Showroom ---------- */
const cv = $('#car'), cx = cv.getContext('2d');
function fit(c, d) { const b = c.getBoundingClientRect(); c.width = b.width * d; c.height = b.height * d; }
const fitAll = () => { fit(cv, Math.min(devicePixelRatio || 1, 2)); fit($('#world'), 1); };
addEventListener('resize', fitAll);

function swatches(el, arr, get, set) {
  el.innerHTML = '';
  arr.forEach((a, k) => {
    const b = document.createElement('button');
    b.style.background = a[1]; b.title = a[0]; b.setAttribute('aria-label', a[0]);
    b.onclick = () => { set(k); render(); };
    el.appendChild(b);
  });
}
function render() {
  const m = M[i];
  $('#name').textContent = m.n;
  $('#idx').textContent = `0${i + 1} / 0${M.length}`;
  $('#specs').innerHTML =
    `<div><small>Power</small><b>${m.hp} <em>HP</em></b></div>
     <div><small>0–100 km/h</small><b>${m.s.toFixed(1)} <em>s</em></b></div>
     <div><small>Top speed</small><b>${m.t} <em>km/h</em></b></div>
     <div><small>Price</small><b>${m.p}</b></div>
     <div><small>Engine / Drivetrain</small><b style="font-size:15px">${m.d}</b></div>`;
  $('#paintName').textContent = P[pc][0];
  $('#rimName').textContent = R[rc][0];
  document.querySelectorAll('#paints button').forEach((b, k) => b.classList.toggle('on', k === pc));
  document.querySelectorAll('#rims button').forEach((b, k) => b.classList.toggle('on', k === rc));
}
const go = n => { i = (n + M.length) % M.length; slide = 1; render(); };
$('#prev').onclick = () => go(i - 1);
$('#next').onclick = () => go(i + 1);
addEventListener('keydown', e => { if (!driving && !$('#modal').classList.contains('show')) { if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'ArrowRight') go(i + 1); } });

function drawShow() {
  const W = cv.width, H = cv.height, m = M[i], col = P[pc][1];
  cx.clearRect(0, 0, W, H);
  const k = Math.min(W / 560, H / 250);
  cx.save(); cx.translate(W / 2, H * .72);
  const g = cx.createRadialGradient(0, 0, 10, 0, 0, W * .42);
  g.addColorStop(0, col + '77'); g.addColorStop(1, col + '00');
  cx.fillStyle = g; cx.fillRect(-W / 2, -H * .7, W, H);
  cx.translate(slide * W * .3, 0); cx.globalAlpha = 1 - slide;
  cx.scale(k * m.L, k);
  const r = m.r;
  cx.fillStyle = 'rgba(0,0,0,.65)'; cx.beginPath(); cx.ellipse(0, 6, 235, 12, 0, 0, 7); cx.fill();
  // body
  cx.beginPath(); cx.moveTo(-205, -14); cx.lineTo(-208, -40);
  cx.bezierCurveTo(-200, -62, -170, -66, -150, -68);
  cx.bezierCurveTo(-120, -r - 6, -90, -r, -50, -r); cx.lineTo(10, -r);
  cx.bezierCurveTo(50, -r, 75, -70, 100, -62);
  cx.bezierCurveTo(150, -56, 190, -52, 203, -38); cx.lineTo(206, -14); cx.closePath();
  cx.fillStyle = col; cx.fill();
  const sh = cx.createLinearGradient(0, -r, 0, -10);
  sh.addColorStop(0, 'rgba(255,255,255,.35)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,0,0,.45)');
  cx.fillStyle = sh; cx.fill();
  // glass
  cx.beginPath(); cx.moveTo(-138, -66); cx.lineTo(-92, -r + 7); cx.lineTo(8, -r + 7); cx.lineTo(64, -66); cx.closePath();
  cx.fillStyle = 'rgba(8,12,22,.88)'; cx.fill();
  cx.fillStyle = col; cx.fillRect(-46, -r + 7, 7, r - 73);
  // M stripes + lights
  [['#0066B1',-27],['#1C69D4',-24],['#E2231A',-21]].forEach(([c, y]) => { cx.fillStyle = c; cx.fillRect(-196, y, 392, 2); });
  cx.fillStyle = '#f4f8ff'; cx.beginPath(); cx.ellipse(190, -44, 12, 3.5, -.2, 0, 7); cx.fill();
  cx.fillStyle = '#E2231A'; cx.fillRect(-207, -48, 6, 8);
  cx.fillStyle = '#0a0a0a'; cx.fillRect(194, -36, 10, 14);
  // wheels
  [-128, 132].forEach(wx => {
    cx.save(); cx.translate(wx, -30);
    cx.fillStyle = '#080808'; cx.beginPath(); cx.arc(0, 0, 34, 0, 7); cx.fill();
    cx.rotate(t);
    cx.fillStyle = R[rc][1]; cx.beginPath(); cx.arc(0, 0, 23, 0, 7); cx.fill();
    cx.fillStyle = '#0c0c0e';
    for (let s = 0; s < 5; s++) { cx.rotate(1.2566); cx.beginPath(); cx.moveTo(4, -3); cx.lineTo(20, -8); cx.arc(0, 0, 20, -.4, .4); cx.lineTo(4, 3); cx.fill(); }
    cx.fillStyle = '#0066B1'; cx.beginPath(); cx.arc(0, 0, 4, 0, 7); cx.fill();
    cx.restore();
  });
  cx.restore();
}

/* ---------- Audio ---------- */
let au = null;
function audioOn() {
  try {
    if (!au) {
      const A = new (window.AudioContext || window.webkitAudioContext)();
      const o1 = A.createOscillator(), o2 = A.createOscillator(), f = A.createBiquadFilter(), g = A.createGain();
      o1.type = 'sawtooth'; o2.type = 'square'; f.type = 'lowpass'; g.gain.value = 0;
      o1.connect(f); o2.connect(f); f.connect(g); g.connect(A.destination); o1.start(); o2.start();
      au = {A, o1, o2, f, g};
    }
    au.A.resume();
  } catch (e) { au = null; }
}
function audioSet(rpm, th) {
  if (!au) return; const n = au.A.currentTime, fr = rpm / 60 * 2.2;
  au.o1.frequency.setTargetAtTime(fr, n, .05); au.o2.frequency.setTargetAtTime(fr * .5, n, .05);
  au.f.frequency.setTargetAtTime(350 + th * 1500 + rpm * .15, n, .05);
  au.g.gain.setTargetAtTime(.04 + th * .07, n, .05);
}

/* ---------- Test drive ---------- */
const wv = $('#world'), wx = wv.getContext('2d');
const key = {};
const D = {x: 0, y: 0, a: -Math.PI / 2, vx: 0, vy: 0};
const OB = []; let seed = 7;
const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
while (OB.length < 70) { const o = [(rnd() - .5) * 5600, (rnd() - .5) * 5600]; if (Math.hypot(o[0], o[1]) > 250) OB.push(o); }
const map = {KeyW:'u', ArrowUp:'u', KeyS:'d', ArrowDown:'d', KeyA:'l', ArrowLeft:'l', KeyD:'r', ArrowRight:'r', Space:'h'};
addEventListener('keydown', e => {
  if (!driving) return;
  if (e.code === 'KeyC') return toggleCam();
  if (map[e.code]) { key[map[e.code]] = 1; e.preventDefault(); }
});
addEventListener('keyup', e => { if (map[e.code]) key[map[e.code]] = 0; });
document.querySelectorAll('.touch button').forEach(b => {
  const k = b.dataset.k;
  b.onpointerdown = e => { key[k] = 1; b.setPointerCapture(e.pointerId); };
  b.onpointerup = b.onpointercancel = () => key[k] = 0;
});
const toggleCam = () => { cam ^= 1; $('#cam').textContent = 'Camera: ' + (cam ? 'Cockpit' : 'Chase') + ' (C)'; };
$('#cam').onclick = toggleCam;

function start() {
  const m = M[i];
  Object.assign(D, {x: 0, y: 0, a: -Math.PI / 2, vx: 0, vy: 0});
  $('#carName').textContent = m.n + ' · ' + P[pc][0];
  $('#showroom').style.display = 'none';
  $('#drive').hidden = false; driving = true; fitAll(); audioOn();
}
function exit() {
  driving = false; $('#drive').hidden = true; $('#showroom').style.display = '';
  Object.keys(key).forEach(k => key[k] = 0);
  if (au) au.g.gain.setTargetAtTime(0, au.A.currentTime, .05);
  fitAll();
}
$('#go').onclick = start; $('#exit').onclick = exit;

let gear = 'N', kmh = 0, rpm = 900;
function step(dt) {
  const m = M[i], vmax = m.t * 4, acc = 400 / m.s * 1.7;
  const c = Math.cos(D.a), s = Math.sin(D.a);
  let vF = D.vx * c + D.vy * s, vL = -D.vx * s + D.vy * c;
  const th = key.u ? 1 : 0;
  if (key.u) vF += acc * (1 - Math.max(0, vF) / vmax) * dt;
  if (key.d) vF -= (vF > 8 ? 900 : acc * .5 * (1 + vF / (vmax * .25))) * dt;
  vF -= vF * .25 * dt;
  const hb = key.h ? 1 : 0;
  if (hb) vF *= Math.exp(-.5 * dt);
  const steer = (key.r ? 1 : 0) - (key.l ? 1 : 0);
  const sp = Math.hypot(vF, vL);
  D.a += steer * Math.min(1, sp / 140) * (hb ? 3.2 : 2.4) / (1 + sp / 900) * Math.sign(vF || 1) * dt;
  vL *= Math.exp(-(hb ? 1.4 : 7) * dt);
  const c2 = Math.cos(D.a), s2 = Math.sin(D.a);
  D.vx = c2 * vF - s2 * vL; D.vy = s2 * vF + c2 * vL;
  D.x += D.vx * dt; D.y += D.vy * dt;
  for (const o of OB) {
    const dx = D.x - o[0], dy = D.y - o[1], d = Math.hypot(dx, dy);
    if (d < 50) { const nx = dx / d, ny = dy / d, dot = D.vx * nx + D.vy * ny;
      D.x = o[0] + nx * 50; D.y = o[1] + ny * 50;
      if (dot < 0) { D.vx = (D.vx - 1.5 * dot * nx) * .6; D.vy = (D.vy - 1.5 * dot * ny) * .6; } }
  }
  for (const k of ['x', 'y']) if (Math.abs(D[k]) > 3000) { D[k] = Math.sign(D[k]) * 3000; D['v' + k] *= -.3; }
  kmh = Math.hypot(D.vx, D.vy) / 4;
  const band = m.t / 8, g = Math.min(8, 1 + Math.floor(kmh / band));
  gear = vF < -2 ? 'R' : kmh < 1 ? 'N' : g;
  rpm = Math.min(7000, 900 + ((kmh - (g - 1) * band) / band) * 5400 + th * 400);
  audioSet(rpm, th);
  $('#spd').textContent = Math.round(kmh); $('#gear').textContent = gear;
  $('#rpmBar').style.width = rpm / 70 + '%';
}
function drawWorld() {
  const W = wv.width, H = wv.height, m = M[i], z = (cam ? 1.9 : .85) * Math.min(1, W / 900 + .3);
  wx.fillStyle = '#07080b'; wx.fillRect(0, 0, W, H);
  wx.save(); wx.translate(W / 2, H * (cam ? .88 : .66)); wx.scale(z, z); wx.rotate(-D.a - Math.PI / 2); wx.translate(-D.x, -D.y);
  const R0 = 1500 / z * .9;
  wx.strokeStyle = 'rgba(0,102,177,.22)'; wx.lineWidth = 2; wx.beginPath();
  for (let g = Math.floor((D.x - R0) / 250) * 250; g < D.x + R0; g += 250) { wx.moveTo(g, D.y - R0); wx.lineTo(g, D.y + R0); }
  for (let g = Math.floor((D.y - R0) / 250) * 250; g < D.y + R0; g += 250) { wx.moveTo(D.x - R0, g); wx.lineTo(D.x + R0, g); }
  wx.stroke();
  wx.strokeStyle = '#E2231A'; wx.lineWidth = 10; wx.strokeRect(-3030, -3030, 6060, 6060);
  OB.forEach((o, k) => {
    if (Math.abs(o[0] - D.x) > R0 || Math.abs(o[1] - D.y) > R0) return;
    wx.fillStyle = k % 2 ? '#1C69D4' : '#f2f4f7'; wx.beginPath(); wx.arc(o[0], o[1], 26, 0, 7); wx.fill();
    wx.fillStyle = '#E2231A'; wx.beginPath(); wx.arc(o[0], o[1], 12, 0, 7); wx.fill();
  });
  wx.save(); wx.translate(D.x, D.y); wx.rotate(D.a); wx.scale(m.L, 1);
  wx.fillStyle = '#090909';
  [[22, -25], [22, 18], [-38, -25], [-38, 18]].forEach(w => wx.fillRect(w[0], w[1], 16, 7));
  wx.fillStyle = P[pc][1]; wx.beginPath(); wx.roundRect(-46, -20, 92, 40, 11); wx.fill();
  wx.fillStyle = 'rgba(8,12,22,.9)'; wx.fillRect(-30, -16, 54, 32);
  wx.fillStyle = P[pc][1]; wx.fillRect(-21, -17, 34, 34);
  wx.fillStyle = 'rgba(255,255,255,.18)'; wx.fillRect(-21, -17, 34, 8);
  wx.fillStyle = '#fff6c8'; wx.fillRect(41, -18, 5, 8); wx.fillRect(41, 10, 5, 8);
  wx.fillStyle = key.d ? '#ff3b30' : '#a01810'; wx.fillRect(-47, -18, 4, 8); wx.fillRect(-47, 10, 4, 8);
  wx.fillStyle = '#0a0a0a'; wx.fillRect(44, -5, 3, 10);
  wx.restore(); wx.restore();
}

/* ---------- Booking modal ---------- */
$('#bm').innerHTML = M.map(m => `<option>${m.n}</option>`).join('');
const modal = $('#modal');
document.querySelectorAll('[data-book]').forEach(b => b.onclick = () => {
  $('#form').hidden = false; $('#ok').hidden = true; $('#bm').selectedIndex = i; modal.classList.add('show');
});
$('#close').onclick = () => modal.classList.remove('show');
modal.onclick = e => { if (e.target === modal) modal.classList.remove('show'); };
$('#form').onsubmit = e => {
  e.preventDefault();
  const f = e.target;
  $('#ok').innerHTML = `<b>Booking confirmed ✓</b><br>Thank you, ${f.n.value.replace(/[<>&]/g, '')}.<br>${$('#bm').value} · ${f.d.value}<br><small>A Dada BMW Store specialist will contact ${f.e.value.replace(/[<>&]/g, '')} shortly.</small>`;
  f.hidden = true; $('#ok').hidden = false; f.reset();
};

/* ---------- Main loop ---------- */
let last = performance.now();
function loop(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (driving) { step(dt); drawWorld(); }
  else if (!document.hidden) { t += dt * 1.5; slide *= .88; if (slide < .005) slide = 0; drawShow(); }
  requestAnimationFrame(loop);
}
swatches($('#paints'), P, 0, k => pc = k);
swatches($('#rims'), R, 0, k => rc = k);
fitAll(); render(); requestAnimationFrame(loop);
})();

/* ═══════════════════════════════════════════
Cannot DNM — bg.js
Canvas背景: 有機的渦巻き + 四方から触手
═══════════════════════════════════════════ */

(function() {

/* ── Canvas セットアップ ── */
var canvas = document.createElement(‘canvas’);
canvas.id = ‘bgCanvas’;
canvas.style.cssText = [
‘position:fixed’, ‘inset:0’, ‘z-index:0’,
‘pointer-events:none’, ‘width:100%’, ‘height:100%’
].join(’;’);
document.body.insertBefore(canvas, document.body.firstChild);

var ctx = canvas.getContext(‘2d’);
var W, H, cx, cy;
var t = 0;

function resize() {
W = canvas.width  = window.innerWidth;
H = canvas.height = window.innerHeight;
cx = W / 2;
cy = H / 2;
}
window.addEventListener(‘resize’, resize);
resize();

/* ── カラー定数 ── */
var GREEN      = ‘0,255,136’;
var GREEN_DIM  = ‘0,180,90’;

/* ═══════════════════════════════════════════
渦巻き描画
密集した有機的曲線・中心に引き込まれる感
═══════════════════════════════════════════ */
function drawVortex() {
var numArms   = 6;       /* 渦の腕の数 */
var linesPerArm = 40;    /* 腕ごとの線数 */
var maxR = Math.min(W, H) * 0.52;

```
for (var arm = 0; arm < numArms; arm++) {
  var armOffset = (arm / numArms) * Math.PI * 2;

  for (var li = 0; li < linesPerArm; li++) {
    var progress = li / linesPerArm;
    /* 螺旋の開始角度にゆっくり時間を加える */
    var startAngle = armOffset + progress * Math.PI * 3.5 + t * 0.12;
    var startR = maxR * (0.08 + progress * 0.92);

    /* ランダムシード（固定）でブレを作る */
    var seed   = arm * 1000 + li * 7;
    var wobble = Math.sin(seed * 0.3 + t * 0.4) * 0.18
               + Math.cos(seed * 0.7 + t * 0.25) * 0.09;

    var x0 = cx + Math.cos(startAngle + wobble) * startR;
    var y0 = cy + Math.sin(startAngle + wobble) * startR;

    /* 内側の終点 */
    var endAngle = startAngle + Math.PI * 0.35 + wobble * 0.5;
    var endR     = startR * (0.62 + Math.sin(t * 0.3 + seed) * 0.06);
    var x1 = cx + Math.cos(endAngle) * endR;
    var y1 = cy + Math.sin(endAngle) * endR;

    /* 制御点 */
    var cpAngle = (startAngle + endAngle) * 0.5 + 0.4;
    var cpR     = (startR + endR) * 0.5 * (1.1 + Math.sin(t * 0.2 + seed) * 0.12);
    var cpx = cx + Math.cos(cpAngle) * cpR;
    var cpy = cy + Math.sin(cpAngle) * cpR;

    /* 外側ほど細く・透明に */
    var alpha = (0.055 + progress * 0.035) * (0.7 + Math.sin(t * 0.5 + seed) * 0.3);
    var lw    = 0.4 + (1 - progress) * 0.9;

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cpx, cpy, x1, y1);
    ctx.strokeStyle = 'rgba(' + GREEN + ',' + alpha + ')';
    ctx.lineWidth   = lw;
    ctx.stroke();
  }
}
```

}

/* ═══════════════════════════════════════════
触手クラス
四辺・四隅から伸びる・S字うねり・吸盤付き
═══════════════════════════════════════════ */
function Tentacle(originFunc, baseAngle, seed) {
this.originFunc = originFunc; /* 起点関数（画面端に追従） */
this.baseAngle  = baseAngle;
this.seed       = seed;
this.phase      = Math.random() * Math.PI * 2;
this.speed      = 0.008 + Math.random() * 0.006;
this.length     = 0.28 + Math.random() * 0.18; /* 画面短辺に対する割合 */
this.thickness  = 3.5 + Math.random() * 3;
this.segments   = 24;
}

Tentacle.prototype.draw = function(t) {
var origin = this.originFunc();
var ox = origin[0], oy = origin[1];
var L  = Math.min(W, H) * this.length;
var s  = this.seed;
var ph = this.phase + t * this.speed;

```
/* セグメントを分割して描画 */
var pts = [];
for (var i = 0; i <= this.segments; i++) {
  var frac = i / this.segments;
  /* 基本方向に進みながらsin波でうねる */
  var ang = this.baseAngle
          + Math.sin(ph + frac * Math.PI * 2.2) * 0.55
          + Math.cos(ph * 0.7 + frac * Math.PI * 1.4 + s) * 0.28
          + Math.sin(ph * 1.3 + frac * Math.PI * 3.1 + s * 0.3) * 0.14;

  var dist = frac * L;
  var px = ox + Math.cos(ang) * dist;
  var py = oy + Math.sin(ang) * dist;
  pts.push([px, py]);
}

/* 触手本体 */
for (var j = 0; j < pts.length - 1; j++) {
  var frac2  = j / (pts.length - 1);
  var taper  = Math.pow(1 - frac2, 0.55); /* 先端に向かって細く */
  var alpha2 = (0.10 + taper * 0.09) * (0.8 + Math.sin(ph + j * 0.4) * 0.2);
  var lw2    = this.thickness * taper;
  if (lw2 < 0.3) lw2 = 0.3;

  ctx.beginPath();
  ctx.moveTo(pts[j][0], pts[j][1]);
  ctx.lineTo(pts[j+1][0], pts[j+1][1]);
  ctx.strokeStyle = 'rgba(' + GREEN + ',' + alpha2 + ')';
  ctx.lineWidth   = lw2;
  ctx.lineCap     = 'round';
  ctx.stroke();
}

/* 吸盤（点列） */
var suckerSpacing = 3; /* 何セグメントごとに吸盤 */
for (var k = suckerSpacing; k < pts.length - 2; k += suckerSpacing) {
  var frac3  = k / (pts.length - 1);
  var taper3 = Math.pow(1 - frac3, 0.55);
  var sr     = this.thickness * taper3 * 0.35;
  if (sr < 0.5) continue;

  var alpha3 = 0.14 * taper3;
  ctx.beginPath();
  ctx.arc(pts[k][0], pts[k][1], sr, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(' + GREEN_DIM + ',' + alpha3 + ')';
  ctx.fill();

  /* 吸盤の縁 */
  ctx.beginPath();
  ctx.arc(pts[k][0], pts[k][1], sr, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(' + GREEN + ',' + (alpha3 * 1.4) + ')';
  ctx.lineWidth   = 0.4;
  ctx.stroke();
}

/* 先端の丸まり */
var last = pts[pts.length - 1];
var prev = pts[pts.length - 4];
var tipAng = Math.atan2(last[1] - prev[1], last[0] - prev[0]);
var tipR   = this.thickness * 0.18;
if (tipR > 0.8) {
  ctx.beginPath();
  ctx.arc(
    last[0] + Math.cos(tipAng + Math.PI * 0.5) * tipR,
    last[1] + Math.sin(tipAng + Math.PI * 0.5) * tipR,
    tipR, 0, Math.PI * 2
  );
  ctx.fillStyle = 'rgba(' + GREEN + ',0.07)';
  ctx.fill();
}
```

};

/* ── 触手インスタンス生成 ── */
/* 各辺・角から複数本 */
var tentacles = [];

function makeTentacles() {
tentacles = [];
/* 上辺 */
for (var i = 0; i < 3; i++) {
(function(ii) {
var frac = 0.2 + ii * 0.3;
tentacles.push(new Tentacle(
function() { return [W * frac, 0]; },
Math.PI * 0.5 + (Math.random() - 0.5) * 0.4,
ii * 13
));
})(i);
}
/* 下辺 */
for (var i = 0; i < 3; i++) {
(function(ii) {
var frac = 0.15 + ii * 0.35;
tentacles.push(new Tentacle(
function() { return [W * frac, H]; },
-Math.PI * 0.5 + (Math.random() - 0.5) * 0.4,
ii * 17 + 100
));
})(i);
}
/* 左辺 */
for (var i = 0; i < 3; i++) {
(function(ii) {
var frac = 0.2 + ii * 0.3;
tentacles.push(new Tentacle(
function() { return [0, H * frac]; },
(Math.random() - 0.5) * 0.4,
ii * 11 + 200
));
})(i);
}
/* 右辺 */
for (var i = 0; i < 3; i++) {
(function(ii) {
var frac = 0.25 + ii * 0.25;
tentacles.push(new Tentacle(
function() { return [W, H * frac]; },
Math.PI + (Math.random() - 0.5) * 0.4,
ii * 19 + 300
));
})(i);
}
/* 四隅 */
var corners = [
[function(){return[0,0];},       Math.PI * 0.25, 400],
[function(){return[W,0];},       Math.PI * 0.75, 410],
[function(){return[0,H];},       -Math.PI * 0.25, 420],
[function(){return[W,H];},       -Math.PI * 0.75, 430]
];
corners.forEach(function(c) {
tentacles.push(new Tentacle(c[0], c[1], c[2]));
tentacles.push(new Tentacle(c[0], c[1] + 0.3, c[2] + 5));
});
}
makeTentacles();
window.addEventListener(‘resize’, makeTentacles);

/* ═══════════════════════════════════════════
アニメーションループ
═══════════════════════════════════════════ */
function draw() {
ctx.clearRect(0, 0, W, H);

```
/* 渦巻き */
drawVortex();

/* 触手 */
tentacles.forEach(function(ten) {
  ten.draw(t);
});

t += 0.016;
requestAnimationFrame(draw);
```

}

draw();

})();

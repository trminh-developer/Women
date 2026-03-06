/*  CURSOR  */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

(function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
})();

/*  FALLING PETALS  */
(function () {
    const canvas = document.getElementById('petal-canvas');
    const ctx = canvas.getContext('2d');
    const EMOJIS = ['🌸', '🌺', '🌷', '💮', '🌼', '💖', '✿', '❀'];
    let W, H, petals = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function Petal() {
        this.reset = function (init) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H * -1 : -40;
            this.size = 14 + Math.random() * 16;
            this.sp = 0.6 + Math.random() * 1.2;
            this.wind = (Math.random() - .5) * .8;
            this.rot = Math.random() * Math.PI * 2;
            this.rotS = (Math.random() - .5) * .04;
            this.emo = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
            this.alpha = .55 + Math.random() * .4;
        };
        this.reset(true);
        this.update = function () {
            this.y += this.sp;
            this.x += this.wind;
            this.rot += this.rotS;
            if (this.y > H + 40) this.reset(false);
        };
        this.draw = function () {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.font = this.size + 'px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emo, 0, 0);
            ctx.restore();
        };
    }

    for (let i = 0; i < 28; i++) petals.push(new Petal());

    (function loop() {
        ctx.clearRect(0, 0, W, H);
        petals.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    })();
})();

/*  SCROLL REVEAL  */
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .15 });
sections.forEach(s => observer.observe(s));

/*  SPARKLE ON CLICK  */
document.addEventListener('click', e => {
    const colors = ['#f2587e', '#c9a7d8', '#fde8f0', '#f9afc7', '#9b6fb5'];
    for (let i = 0; i < 7; i++) {
        const sp = document.createElement('div');
        sp.className = 'sparkle';
        sp.style.cssText = `
      left:${e.clientX + (Math.random() - 0.5) * 40}px;
      top:${e.clientY + (Math.random() - 0.5) * 40}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      width:${5 + Math.random() * 7}px;
      height:${5 + Math.random() * 7}px;
    `;
        document.body.appendChild(sp);
        setTimeout(() => sp.remove(), 700);
    }
});

/*  CONFETTI  */
const confCanvas = document.getElementById('confetti-canvas');
const cctx = confCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

function launchConfetti() {
    confCanvas.width = window.innerWidth;
    confCanvas.height = window.innerHeight;
    confCanvas.style.display = 'block';
    confettiActive = true;
    confettiPieces = [];
    const SHAPES = ['circle', 'rect', 'triangle'];
    const COLORS = ['#f2587e', '#c9a7d8', '#fde8f0', '#9b6fb5', '#ffd6e7', '#fff', '#f9afc7', '#6b3a7d'];
    for (let i = 0; i < 180; i++) {
        confettiPieces.push({
            x: Math.random() * confCanvas.width,
            y: -20 - Math.random() * confCanvas.height * .5,
            vx: (Math.random() - .5) * 4,
            vy: 2 + Math.random() * 5,
            size: 6 + Math.random() * 9,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            rot: Math.random() * Math.PI * 2,
            rotS: (Math.random() - .5) * .14,
            alpha: 1,
        });
    }
    animateConfetti();
}

function animateConfetti() {
    if (!confettiActive) return;
    cctx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    let alive = false;
    confettiPieces.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += .06;
        p.rot += p.rotS;
        if (p.y < confCanvas.height + 30) { alive = true; }
        else { return; }
        cctx.save();
        cctx.globalAlpha = p.alpha;
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot);
        cctx.fillStyle = p.color;
        if (p.shape === 'circle') {
            cctx.beginPath();
            cctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            cctx.fill();
        } else if (p.shape === 'rect') {
            cctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
            cctx.beginPath();
            cctx.moveTo(0, -p.size / 2);
            cctx.lineTo(p.size / 2, p.size / 2);
            cctx.lineTo(-p.size / 2, p.size / 2);
            cctx.closePath();
            cctx.fill();
        }
        cctx.restore();
    });
    if (alive) requestAnimationFrame(animateConfetti);
    else { confCanvas.style.display = 'none'; confettiActive = false; }
}

/*  POPUP  */
const btnWish = document.getElementById('btn-wish');
const overlay = document.getElementById('popup-overlay');
const popupClose = document.getElementById('popup-close');
const popupX = document.getElementById('popup-x');

function openPopup() {
    overlay.classList.add('active');
    launchConfetti();
}
function closePopup() { overlay.classList.remove('active'); }

btnWish.addEventListener('click', openPopup);
popupClose.addEventListener('click', closePopup);
popupX.addEventListener('click', closePopup);
overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });

/*  RESIZE CONFETTI  */
window.addEventListener('resize', () => {
    confCanvas.width = window.innerWidth;
    confCanvas.height = window.innerHeight;
});
const DELAY = 10000;                     // ms of blank page before the eyes appear
const AWAY_TITLE = 'Ich sehe dich noch.'; // tab title while the visitor looks elsewhere
const FAVICON = 'data:image/svg+xml,' + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>" +
    "<ellipse cx='8' cy='8' rx='7' ry='4.5' fill='white' stroke='black' stroke-width='1.5'/>" +
    "<circle cx='8' cy='8' r='2.5'/></svg>"
);

const container = document.getElementById('eyes');
const eyes = [...container.querySelectorAll('.eye')];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const title = document.title;

let target = null;   // last pointer position; null = stare straight at the viewer
let glance = null;   // brief look elsewhere while the visitor is idle
let lastMove = performance.now();
let awake = false;   // eyes are visible
let ready = false;   // wake-up animation finished
let blinking = false;
let open = 0;
let frame = 0;

function setOpen(value, speed = '0.09s') {
    open = value;
    container.style.setProperty('--lid-speed', calm ? '0s' : speed);
    container.style.setProperty('--open', value);
}

function look() {
    frame = 0;
    const point = glance || target;

    eyes.forEach(eye => {
        const rect = eye.getBoundingClientRect();
        let x = 0;
        let y = 0;

        if (point) {
            const dx = point.x - (rect.left + rect.width / 2);
            const dy = point.y - (rect.top + rect.height / 2);
            const distance = Math.hypot(dx, dy) || 1;
            const reach = Math.min(1, distance / 150) / distance;
            x = dx * reach * rect.width * 0.2;
            y = dy * reach * rect.width * 0.15;
        }

        eye.style.setProperty('--x', `${x}px`);
        eye.style.setProperty('--y', `${y}px`);
    });

    // Narrow the eyes when the pointer comes close
    if (ready && !blinking) {
        const rect = container.getBoundingClientRect();
        const margin = rect.height;
        const near = target &&
            target.x > rect.left - margin && target.x < rect.right + margin &&
            target.y > rect.top - margin && target.y < rect.bottom + margin;
        const wanted = near ? 0.5 : 1;
        if (wanted !== open) setOpen(wanted, '0.25s');
    }
}

function requestLook() {
    if (!frame) frame = requestAnimationFrame(look);
}

function blink() {
    if (!awake || calm) return;

    const restore = open;
    const double = Math.random() < 0.2;
    blinking = true;
    setOpen(0, '0.07s');
    setTimeout(() => {
        setOpen(restore, '0.12s');
        if (double) {
            setTimeout(() => setOpen(0, '0.07s'), 160);
            setTimeout(() => setOpen(restore, '0.12s'), 300);
        }
        setTimeout(() => { blinking = false; }, double ? 420 : 120);
    }, 140);

    setTimeout(blink, 2500 + Math.random() * 5000);
}

function wake() {
    // Don't waste the moment on a background tab
    if (document.hidden) {
        document.addEventListener('visibilitychange', () => setTimeout(wake, 1200), { once: true });
        return;
    }

    awake = true;
    container.classList.add('visible');
    document.querySelector('link[rel=icon]').href = FAVICON;
    look();
    setOpen(1, '2.4s');
    setTimeout(() => { ready = true; requestLook(); }, calm ? 0 : 2400);
    setTimeout(blink, 4000);
}

function follow(event) {
    target = { x: event.clientX, y: event.clientY };
    lastMove = performance.now();
    glance = null;
    requestLook();
}

document.addEventListener('pointermove', follow);
document.addEventListener('pointerdown', follow);
window.addEventListener('resize', requestLook);

document.addEventListener('visibilitychange', () => {
    if (!awake) return;
    if (document.hidden) {
        document.title = AWAY_TITLE;
    } else {
        document.title = title;
        target = null;  // waiting for you when you come back
        requestLook();
    }
});

// When left alone, the eyes sometimes glance away — and come back
setInterval(() => {
    if (!ready || calm || glance || performance.now() - lastMove < 6000 || Math.random() > 0.15) return;
    glance = { x: Math.random() * innerWidth, y: Math.random() * innerHeight };
    requestLook();
    setTimeout(() => { glance = null; requestLook(); }, 700);
}, 1000);

setTimeout(wake, DELAY);

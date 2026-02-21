// --- 1. STARFIELD SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('starfield'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(3000 * 3);
for (let i = 0; i < 9000; i++) starPos[i] = (Math.random() - 0.5) * 1000;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 }));
scene.add(stars);
camera.position.z = 1;

let warp = 0.2;
function animate() {
    requestAnimationFrame(animate);
    const pos = starGeo.attributes.position.array;
    for (let i = 2; i < pos.length; i += 3) {
        pos[i] += warp;
        if (pos[i] > 500) pos[i] = -500;
    }
    starGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}
animate();

// --- 2. INTRO TIMELINE ---
const tl = gsap.timeline();
tl.to("#intro-msg", { opacity: 1, duration: 1, delay: 0.5 });
tl.to({}, { duration: 2, onUpdate: () => { warp += 0.6; } });
tl.to("#intro-overlay", { backgroundColor: "white", duration: 0.2 });
tl.to("#intro-overlay", { opacity: 0, display: "none", duration: 1, onStart: () => {
    document.body.style.overflow = "auto";
    gsap.to("#sidebar", { x: 0, duration: 0.8, ease: "back.out" });
    gsap.to("#homepage", { opacity: 1, duration: 1 });
    lucide.createIcons();
}});

// --- 3. NAVIGATION FUNCTIONS ---
function openProfile() {
    const profile = document.getElementById('profile-overlay');
    profile.style.display = 'block';
    gsap.fromTo(profile, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.5 });
}

function openAchievements() {
    const badgeMod = document.getElementById('achievement-overlay');
    badgeMod.style.display = 'block';
    gsap.fromTo(badgeMod, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 });
}

function openPractice() {
    // This is where you will add your practice module logic
    console.log("Practice Mode Activated");
    gsap.to(".nav-icon[onclick='openPractice()']", { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
}

function closeOverlays() {
    const overlays = document.querySelectorAll('.overlay');
    overlays.forEach(o => {
        if(o.style.display === 'block') {
            gsap.to(o, { opacity: 0, duration: 0.3, onComplete: () => {
                o.style.display = 'none';
                o.style.opacity = '1';
            }});
        }
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
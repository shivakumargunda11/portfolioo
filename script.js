// Initialize Lenis Smooth Scroll with Safeguard
let lenis;
try {
    lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
} catch (e) {
    console.error("Lenis failed to initialize:", e);
}

// Initialize ScrollReveal with Safeguard
try {
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 1000,
        delay: 200,
        reset: false
    });
    sr.reveal('.reveal-up', { origin: 'bottom' });
    sr.reveal('.reveal-left', { origin: 'left' });
    sr.reveal('.reveal-right', { origin: 'right' });
} catch (e) {
    console.error("ScrollReveal failed to initialize:", e);
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active Link Highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinksUl = document.querySelector('.nav-links');

if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinksUl.classList.toggle('show-mobile');
    });
}


// Form Submission handling with Nodemailer Backend
async function handleFormSubmit(event) {
    event.preventDefault();
    console.log("Submit button clicked - sending message via local backend...");
    
    const form = event.target;
    const status = document.getElementById("form-status");
    const submitBtn = document.getElementById("contact-submit");
    const initialBtnText = submitBtn.innerHTML;
    
    // Basic email validation
    const emailField = form.querySelector('input[name="email"]');
    if (emailField && !emailField.value.includes('@')) {
        status.innerHTML = '<p style="color: #ef4444; margin-top: 10px;">Please enter a valid email address.</p>';
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    status.innerHTML = "";

    try {
        const response = await fetch("https://portfolioo-4qkt.onrender.com/api/contact", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            status.innerHTML = '<p style="color: #10b981; margin-top: 10px; font-weight: 600;"><i class="fas fa-check-circle"></i> Sent Successfully!</p>';
            form.reset();
            console.log("Success: Message sent successfully.");
        } else {
            const result = await response.json();
            console.error("Backend Error Response:", result);
            status.innerHTML = `<p style="color: #ef4444; margin-top: 10px;">Submission Error: ${result.error || 'Failed to send message.'}</p>`;
        }
    } catch (error) {
        console.error("Network/Fetch Error:", error);
        status.innerHTML = '<p style="color: #ef4444; margin-top: 10px;">Oops! Connection failed. Please check your internet or try again later.</p>';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = initialBtnText;
    }
}

// Custom Cursor Logic
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");
const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .skill-tag, .copy-email');

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    if(cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
    }

    if(cursorOutline) {
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    }
});

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.background = 'rgba(249, 115, 22, 0.1)';
        cursorOutline.style.borderColor = 'transparent';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.background = 'transparent';
        cursorOutline.style.borderColor = 'var(--primary)';
    });
});

// Three.js Background Implementation
function initThreeBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0xf97316,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Movement Effect
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        particlesMesh.position.x += (mouseX - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY - particlesMesh.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Counter Animation Logic
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounter = (counter) => {
        const targetStr = counter.getAttribute('data-target');
        const hasPlus = targetStr.includes('+');
        const target = parseFloat(targetStr);
        let count = 0;
        const inc = target / speed;

        const updateCount = () => {
            count += inc;

            if (count < target) {
                counter.innerText = count.toFixed(target % 1 === 0 ? 0 : 1);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + (hasPlus ? '+' : '');
            }
        };
        counter.innerText = "0"; // Start from 0 regardless of HTML content
        updateCount();
    };

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// Copy Email Functionality
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const email = "gundashivakumar11@gmail.com";
        navigator.clipboard.writeText(email).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = 'Copied! <i class="fas fa-check"></i>';
            copyBtn.classList.add('active');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('active');
            }, 2000);
        });
    });
}

// Typing effect simulation for hero
const heroTitle = document.querySelector('.hero-text-area h2');
const phrases = ['Full-stack Web Developer', 'CSE Enthusiast', 'Problem Solver', 'SIH Finalist'];
let i = 0;
let j = 0;
let currentPhrase = [];
let isDeleting = false;
let isEnd = false;

function loop() {
    if (!heroTitle) return;
    isEnd = false;
    if (i < phrases.length) {
        if (!isDeleting && j <= phrases[i].length) {
            currentPhrase.push(phrases[i][j]);
            j++;
        }
        if (isDeleting && j <= phrases[i].length) {
            currentPhrase.pop();
            j--;
        }
        heroTitle.innerHTML = currentPhrase.join('') + '<span class="cursor-blink">|</span>';

        if (j == phrases[i].length) {
            isEnd = true;
            isDeleting = true;
        }
        if (isDeleting && j == 0) {
            currentPhrase = [];
            isDeleting = false;
            i++;
            if (i == phrases.length) i = 0;
        }
    }
    const speedUp = Math.random() * (60 - 40) + 40;
    const normalSpeed = Math.random() * (120 - 80) + 80;
    const time = isEnd ? 2000 : isDeleting ? speedUp : normalSpeed;
    setTimeout(loop, time);
}

// Global scope initialization
document.addEventListener('DOMContentLoaded', () => {
    loop();
    initThreeBackground();
    initCounters();
    initCopyEmail();
    
    // Project Card 3D Tilt
    document.querySelectorAll('.project-card, .service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height/2) / 15;
            const rotateY = (rect.width/2 - x) / 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0)`;
        });
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // GSAP Reveal Animations for specific sections
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.from(".hero-text-area > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
    
    gsap.from(".hero-image-area", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
    });
});

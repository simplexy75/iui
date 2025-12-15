// ==========================================
// PARTICLE SYSTEM
// ==========================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx -= (dx / distance) * force * 0.2;
                particle.vy -= (dy / distance) * force * 0.2;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Keep within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// CURSOR FOLLOWER
// ==========================================
class CursorFollower {
    constructor() {
        this.follower = document.getElementById('cursorFollower');
        this.posX = 0;
        this.posY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.animate();
    }
    
    animate() {
        const diffX = this.mouseX - this.posX;
        const diffY = this.mouseY - this.posY;
        
        this.posX += diffX * 0.1;
        this.posY += diffY * 0.1;
        
        this.follower.style.left = `${this.posX}px`;
        this.follower.style.top = `${this.posY}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// COUNTDOWN TIMER
// ==========================================
class CountdownTimer {
    constructor(targetDate) {
        this.targetDate = new Date(targetDate).getTime();
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        this.update();
        setInterval(() => this.update(), 1000);
    }
    
    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        
        if (distance < 0) {
            this.elements.days.textContent = '00';
            this.elements.hours.textContent = '00';
            this.elements.minutes.textContent = '00';
            this.elements.seconds.textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.animateValue(this.elements.days, days);
        this.animateValue(this.elements.hours, hours);
        this.animateValue(this.elements.minutes, minutes);
        this.animateValue(this.elements.seconds, seconds);
    }
    
    animateValue(element, value) {
        const formattedValue = value.toString().padStart(2, '0');
        if (element.textContent !== formattedValue) {
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.textContent = formattedValue;
                element.style.transform = 'scale(1)';
            }, 150);
        }
    }
}

// ==========================================
// EMAIL NOTIFICATION FORM
// ==========================================
class NotificationForm {
    constructor() {
        this.form = document.getElementById('notifyForm');
        this.input = document.getElementById('emailInput');
        this.message = document.getElementById('formMessage');
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const email = this.input.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showMessage('Per favore inserisci un indirizzo email valido.', 'error');
            return;
        }
        
        // Simulate API call
        this.showMessage('Attendere...', 'loading');
        this.input.disabled = true;
        
        setTimeout(() => {
            // In a real scenario, you would send the email to your backend
            console.log('Email submitted:', email);
            
            this.showMessage('✓ Grazie! Ti terremo aggiornato.', 'success');
            this.form.reset();
            this.input.disabled = false;
            
            // Clear message after 5 seconds
            setTimeout(() => {
                this.message.textContent = '';
            }, 5000);
        }, 1500);
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    showMessage(text, type) {
        this.message.textContent = text;
        this.message.style.color = type === 'error' ? '#ff4444' : 
                                   type === 'success' ? '#00ff88' : 
                                   '#00d4ff';
    }
}

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
class AnimationObserver {
    constructor() {
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.options);
        
        this.observe();
    }
    
    observe() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => this.observer.observe(el));
    }
}

// ==========================================
// CAR IMAGE PARALLAX EFFECT
// ==========================================
class ParallaxEffect {
    constructor() {
        this.carImage = document.getElementById('carImage');
        this.logo = document.getElementById('mainLogo');
        
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (this.carImage) {
            this.carImage.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(${1 + scrolled * 0.0001})`;
        }
        
        if (this.logo) {
            this.logo.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }
    
    handleMouseMove(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        if (this.carImage) {
            this.carImage.style.transform = `
                perspective(1000px)
                rotateY(${mouseX * 5}deg)
                rotateX(${-mouseY * 5}deg)
                scale(1.02)
            `;
        }
    }
}

// ==========================================
// HEADLIGHT GLOW EFFECT
// ==========================================
class HeadlightEffect {
    constructor() {
        this.glowEffect = document.querySelector('.glow-effect');
        this.intensity = 0.6;
        this.direction = 1;
        
        this.animate();
    }
    
    animate() {
        this.intensity += 0.005 * this.direction;
        
        if (this.intensity >= 1) this.direction = -1;
        if (this.intensity <= 0.6) this.direction = 1;
        
        if (this.glowEffect) {
            this.glowEffect.style.opacity = this.intensity;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
function optimizeAnimations() {
    // Reduce particle count on mobile
    if (window.innerWidth < 768) {
        const canvas = document.getElementById('particles');
        const particleSystem = new ParticleSystem(canvas);
        particleSystem.particleCount = 50;
        particleSystem.init();
    }
    
    // Disable parallax on mobile for better performance
    if (window.innerWidth < 768 || 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0) {
        document.body.classList.add('mobile-device');
    }
}

// ==========================================
// PRELOADER
// ==========================================
function hidePreloader() {
    // Ensure all images are loaded
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    document.body.classList.add('loaded');
                }
            });
        }
    });
    
    if (loadedImages === images.length) {
        document.body.classList.add('loaded');
    }
}

// ==========================================
// INTERACTIVE SOCIAL LINKS
// ==========================================
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
        
        link.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '100%';
            ripple.style.height = '100%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ==========================================
// EASTER EGG - KONAMI CODE
// ==========================================
function initKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let position = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === code[position]) {
            position++;
            if (position === code.length) {
                activateEasterEgg();
                position = 0;
            }
        } else {
            position = 0;
        }
    });
}

function activateEasterEgg() {
    // Create special effect
    const body = document.body;
    body.style.animation = 'rainbow 2s ease-in-out';
    
    // Add rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        body.style.animation = '';
        style.remove();
    }, 2000);
    
    console.log('🎉 Easter Egg Activated! IUI Team says Hi! 🚗');
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particles');
    new ParticleSystem(canvas);
    
    // Initialize cursor follower (only on desktop)
    if (window.innerWidth > 768) {
        new CursorFollower();
    }
    
    // Initialize countdown (set target date to 90 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 90);
    new CountdownTimer(targetDate);
    
    // Initialize notification form
    new NotificationForm();
    
    // Initialize animation observer
    new AnimationObserver();
    
    // Initialize parallax effect
    new ParallaxEffect();
    
    // Initialize headlight glow effect
    new HeadlightEffect();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Optimize animations for performance
    optimizeAnimations();
    
    // Hide preloader
    hidePreloader();
    
    // Initialize social links interactions
    initSocialLinks();
    
    // Initialize easter egg
    initKonamiCode();
    
    console.log('%c IUI - The Future is Coming ', 'background: #00d4ff; color: #0a0a0a; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Made with ❤️ and cutting-edge web technologies ', 'background: #0a0a0a; color: #00d4ff; font-size: 12px; padding: 5px;');
});

// ==========================================
// SERVICE WORKER REGISTRATION (PWA Support)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you want to add PWA support
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}


// ==========================================
// JOURNEY PAGE - Interactive Storytelling
// ==========================================

class JourneyPage {
    constructor() {
        this.sections = document.querySelectorAll('.journey-section');
        this.dots = document.querySelectorAll('.dot');
        this.progressFill = document.querySelector('.progress-fill');
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        // Set initial active section
        this.updateActiveSection(0);
        
        // Scroll event listener (with debounce)
        window.addEventListener('wheel', (e) => this.handleScroll(e), { passive: false });
        
        // Touch events for mobile
        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.goToSection(this.currentSection + 1);
                } else {
                    this.goToSection(this.currentSection - 1);
                }
            }
        }, { passive: true });
        
        // Navigation dots click
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSection(index);
            });
        });
        
        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                this.goToSection(this.currentSection + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                this.goToSection(this.currentSection - 1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.goToSection(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.goToSection(this.sections.length - 1);
            }
        });
        
        // Update progress on scroll
        window.addEventListener('scroll', () => {
            this.updateProgress();
        });
        
        // Intersection Observer for section animations
        this.setupIntersectionObserver();
        
        // Hide scroll indicator after first scroll
        this.setupScrollIndicator();
    }
    
    handleScroll(e) {
        if (this.isScrolling) return;
        
        const delta = Math.sign(e.deltaY);
        
        if (delta > 0) {
            // Scroll down
            this.goToSection(this.currentSection + 1);
        } else {
            // Scroll up
            this.goToSection(this.currentSection - 1);
        }
        
        e.preventDefault();
    }
    
    goToSection(index) {
        if (index < 0 || index >= this.sections.length || this.isScrolling) {
            return;
        }
        
        this.isScrolling = true;
        this.currentSection = index;
        
        // Smooth scroll to section
        this.sections[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        this.updateActiveSection(index);
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }
    
    updateActiveSection(index) {
        // Update sections
        this.sections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
                this.animateSection(section);
            } else {
                section.classList.remove('active');
            }
        });
        
        // Update dots
        this.dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update progress bar
        const progress = ((index + 1) / this.sections.length) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    animateSection(section) {
        // Reset animations
        const elements = section.querySelectorAll('.tappa-number, .tappa-title, .tappa-subtitle, .claim, .text-content');
        elements.forEach(el => {
            el.style.animation = 'none';
            // Force reflow
            void el.offsetWidth;
            el.style.animation = null;
        });
    }
    
    updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(this.sections).indexOf(entry.target);
                    if (index !== this.currentSection) {
                        this.currentSection = index;
                        this.updateActiveSection(index);
                    }
                }
            });
        }, options);
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    setupScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        if (!indicator) return;
        
        let hasScrolled = false;
        
        const hideIndicator = () => {
            if (!hasScrolled) {
                hasScrolled = true;
                indicator.style.opacity = '0';
                indicator.style.transition = 'opacity 0.5s ease';
            }
        };
        
        window.addEventListener('wheel', hideIndicator, { once: true });
        window.addEventListener('touchstart', hideIndicator, { once: true });
        window.addEventListener('keydown', hideIndicator, { once: true });
    }
}

// ==========================================
// PARALLAX EFFECT
// ==========================================
class ParallaxEffect {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Parallax for backgrounds
            document.querySelectorAll('.section-bg').forEach((bg, index) => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                bg.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// ==========================================
// CURSOR EFFECT
// ==========================================
class CursorEffect {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            width: 40px;
            height: 40px;
            border: 2px solid rgba(241, 5, 68, 0.5);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.15s ease-out;
            transform: translate(-50%, -50%);
            mix-blend-mode: difference;
        `;
        
        document.body.appendChild(this.cursor);
        
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
        
        this.cursor.style.left = `${this.posX}px`;
        this.cursor.style.top = `${this.posY}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================
// BACKGROUND ANIMATIONS
// ==========================================
class BackgroundAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Animate LED lines
        this.animateLEDLines();
        
        // Animate dual lights
        this.animateDualLights();
    }
    
    animateLEDLines() {
        const ledLines = document.querySelectorAll('.led-lines');
        ledLines.forEach(line => {
            setInterval(() => {
                line.style.opacity = Math.random() * 0.5 + 0.2;
            }, 2000);
        });
    }
    
    animateDualLights() {
        const dualLights = document.querySelectorAll('.dual-light');
        dualLights.forEach(light => {
            const blueLight = light.querySelector('.light-blue');
            const redLight = light.querySelector('.light-red');
            
            if (blueLight) {
                setInterval(() => {
                    const intensity = Math.sin(Date.now() / 1000) * 0.2 + 0.3;
                    blueLight.style.opacity = intensity;
                }, 50);
            }
            
            if (redLight) {
                setInterval(() => {
                    const intensity = Math.cos(Date.now() / 1000) * 0.2 + 0.3;
                    redLight.style.opacity = intensity;
                }, 50);
            }
        });
    }
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize journey page
    new JourneyPage();
    
    // Initialize parallax (only on desktop)
    if (window.innerWidth > 768) {
        new ParallaxEffect();
    }
    
    // Initialize custom cursor (only on desktop with mouse)
    if (window.innerWidth > 768 && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        new CursorEffect();
    }
    
    // Initialize background animations
    new BackgroundAnimations();
    
    // Console message
    console.log('%c IUI - Il Viaggio ', 'background: #f10544; color: #ffffff; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Un percorso di consapevolezza ', 'background: #0a0a0a; color: #9bccda; font-size: 12px; padding: 5px;');
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


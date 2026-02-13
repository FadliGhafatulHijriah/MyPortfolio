// STEP 2: Splash Screen Loading Animation
// STEP 1: Icon-Only Sidebar Navigation

document.addEventListener('DOMContentLoaded', () => {
    startSplashScreen();
});

function startSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const loadingMessage = document.getElementById('loadingMessage');

    const messages = [
        'Initializing adventure...',
        'Loading pixel world...',
        'Preparing character...',
        'Setting up controls...',
        'Generating terrain...',
        'Almost ready...',
        'Welcome to the adventure!'
    ];

    let progress = 0;
    let messageIndex = 0;

    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Complete loading
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    initNavigation();
                    startTypingEffect();
                    console.log('✅ Splash screen complete!');
                    console.log('✅ Step 1: Icon-only sidebar initialized!');
                    console.log('✅ Step 3: Hero section with animated FADLI!');
                }, 500);
            }, 500);
        }

        // Update progress bar
        progressFill.style.width = progress + '%';
        progressPercent.textContent = Math.floor(progress) + '%';

        // Update message
        const newMessageIndex = Math.floor((progress / 100) * messages.length);
        if (newMessageIndex !== messageIndex && newMessageIndex < messages.length) {
            messageIndex = newMessageIndex;
            loadingMessage.textContent = messages[messageIndex];
            loadingMessage.style.animation = 'none';
            setTimeout(() => {
                loadingMessage.style.animation = 'blink 1.5s ease-in-out infinite';
            }, 10);
        }
    }, 200);
}

// STEP 3: Typing Effect for Hero Subtitle
function startTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const texts = [
        'Informatics Student | Tech Enthusiast',
        'Full Stack Developer | Problem Solver',
        'Game Developer | Creative Coder',
        'Always Learning, Always Growing 🚀'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingElement.textContent = currentText.substring(0, charIndex);

        let typeSpeed = isDeleting ? 40 : 80; // Slower for smoother feel

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2500; // Longer pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 800; // Longer pause before next text
        }

        setTimeout(type, typeSpeed);
    }

    // Start with small delay for smooth entrance
    setTimeout(type, 500);
}

function initNavigation() {
    const navButtons = document.querySelectorAll('.icon-btn');
    const pages = document.querySelectorAll('.page');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-section');

            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active page
            pages.forEach(page => {
                page.classList.remove('active');
            });

            const targetPage = document.getElementById(targetSection);
            if (targetPage) {
                targetPage.classList.add('active');
            }

            // Smooth scroll effect
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Add smooth hover sound effect (optional)
    navButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

// Keyboard navigation (bonus feature)
document.addEventListener('keydown', (e) => {
    const navButtons = Array.from(document.querySelectorAll('.icon-btn'));
    const activeIndex = navButtons.findIndex(btn => btn.classList.contains('active'));

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % navButtons.length;
        navButtons[nextIndex].click();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (activeIndex - 1 + navButtons.length) % navButtons.length;
        navButtons[prevIndex].click();
    }
});

console.log('🎮 Loading adventure...');

// STEP 4: Free-roaming Character with Missions & Interactions
class FreeRoamingCharacter {
    constructor() {
        this.character = document.getElementById('pixelCharacter');
        if (!this.character) return;
        
        // Position
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.speed = 5;
        
        // Velocity
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Controls
        this.keys = {};
        this.isWalking = false;
        
        // Eye tracking
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Collision detection
        this.radius = 50; // Increased from 30 for easier interaction
        this.nearbyElement = null;
        
        // Mission system
        this.discovered = new Set();
        this.missions = [
            { id: 'home', selector: '.hero-name', text: 'Discover your name' },
            { id: 'about', selector: '[data-section="about"]', text: 'Visit About section' },
            { id: 'skills', selector: '[data-section="skills"]', text: 'Check Skills' },
            { id: 'projects', selector: '[data-section="projects"]', text: 'Explore Projects' },
            { id: 'contact', selector: '[data-section="contact"]', text: 'Find Contact info' },
            { id: 'cta1', selector: '.cta-btn.primary', text: 'Touch a button' },
            { id: 'card', selector: '.info-card', text: 'Inspect info cards' }
        ];
        
        this.init();
        this.updatePosition();
        this.gameLoop();
    }
    
    init() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;
            this.highlightKey(key);
            
            // Interaction key (E)
            if (key === 'e' && this.nearbyElement) {
                this.interact();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
            this.unhighlightKey(key);
        });
        
        // Mouse tracking for eyes
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateEyes();
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.constrainPosition();
        });
    }
    
    highlightKey(key) {
        const keys = document.querySelectorAll('.control-key');
        keys.forEach(el => {
            if (el.textContent.toLowerCase() === key) {
                el.classList.add('pressed');
            }
        });
    }
    
    unhighlightKey(key) {
        const keys = document.querySelectorAll('.control-key');
        keys.forEach(el => {
            if (el.textContent.toLowerCase() === key) {
                el.classList.remove('pressed');
            }
        });
    }
    
    update() {
        // Reset velocity
        this.velocityX = 0;
        this.velocityY = 0;
        this.isWalking = false;
        
        // Movement
        if (this.keys['w']) {
            this.velocityY = -this.speed;
            this.isWalking = true;
        }
        if (this.keys['s']) {
            this.velocityY = this.speed;
            this.isWalking = true;
        }
        if (this.keys['a']) {
            this.velocityX = -this.speed;
            this.isWalking = true;
        }
        if (this.keys['d']) {
            this.velocityX = this.speed;
            this.isWalking = true;
        }
        
        // Diagonal movement (slower)
        if (this.velocityX !== 0 && this.velocityY !== 0) {
            this.velocityX *= 0.707;
            this.velocityY *= 0.707;
        }
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Auto-scroll viewport
        this.autoScroll();
        
        // Check collisions/interactions
        this.checkNearbyElements();
        
        // Walking animation
        if (this.isWalking) {
            this.character.classList.add('walking');
        } else {
            this.character.classList.remove('walking');
        }
    }
    
    autoScroll() {
        const scrollMargin = 200; // Increased margin for less sensitivity
        const scrollSpeed = 3; // Reduced from 5 to 3 for smoother scroll
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        // Only scroll if moving (not when standing still)
        if (!this.isWalking) return;
        
        // Auto scroll up (smoother)
        if (this.y < scrollMargin && scrollTop > 0) {
            window.scrollBy({ 
                top: -scrollSpeed, 
                behavior: 'auto'
            });
        }
        
        // Auto scroll down (smoother)
        if (this.y > viewportHeight - scrollMargin) {
            const maxScroll = document.documentElement.scrollHeight - viewportHeight;
            if (scrollTop < maxScroll) {
                window.scrollBy({ 
                    top: scrollSpeed, 
                    behavior: 'auto'
                });
            }
        }
        
        // Constrain after scrolling
        this.constrainPosition();
    }
    
    constrainPosition() {
        const margin = 50;
        const maxX = window.innerWidth - margin;
        const maxY = window.innerHeight - margin;
        
        if (this.x < margin) this.x = margin;
        if (this.x > maxX) this.x = maxX;
        if (this.y < margin) this.y = margin;
        if (this.y > maxY) this.y = maxY;
    }
    
    checkNearbyElements() {
        // Get all interactive elements
        const elements = document.querySelectorAll('.icon-btn, .info-card, .cta-btn, .hero-name, [data-section]');
        let closestElement = null;
        let closestDistance = this.radius;
        
        // Remove all hover states
        elements.forEach(el => el.classList.remove('character-hover'));
        
        // Find closest element
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(this.x - centerX, 2) + 
                Math.pow(this.y - centerY, 2)
            );
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestElement = el;
            }
        });
        
        // Update nearby element and excited state
        if (closestElement) {
            closestElement.classList.add('character-hover');
            this.nearbyElement = closestElement;
            this.character.classList.add('excited'); // Eyes glow!
            this.showInteractionHint(true);
            
            // Check for mission completion
            this.checkMissionCompletion(closestElement);
        } else {
            this.nearbyElement = null;
            this.character.classList.remove('excited');
            this.showInteractionHint(false);
        }
    }
    
    updateEyes() {
        // Calculate eye direction based on mouse position
        const headRect = this.character.getBoundingClientRect();
        const headCenterX = headRect.left + headRect.width / 2;
        const headCenterY = headRect.top + headRect.height / 2;
        
        // Get angle to mouse
        const dx = this.mouseX - headCenterX;
        const dy = this.mouseY - headCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Limit eye movement (max 2px in each direction)
        const maxMove = 2;
        let eyeX = (dx / distance) * maxMove;
        let eyeY = (dy / distance) * maxMove;
        
        // Clamp values
        eyeX = Math.max(-maxMove, Math.min(maxMove, eyeX));
        eyeY = Math.max(-maxMove, Math.min(maxMove, eyeY));
        
        // Apply to character
        this.character.style.setProperty('--eye-x', eyeX + 'px');
        this.character.style.setProperty('--eye-y', eyeY + 'px');
    }
    
    checkMissionCompletion(element) {
        this.missions.forEach(mission => {
            if (!this.discovered.has(mission.id)) {
                if (element.matches(mission.selector) || element.closest(mission.selector)) {
                    this.discovered.add(mission.id);
                    element.classList.add('discovered');
                    this.updateMissionProgress();
                    console.log(`✓ Mission complete: ${mission.text}`);
                }
            }
        });
    }
    
    updateMissionProgress() {
        const total = this.missions.length;
        const completed = this.discovered.size;
        const percentage = (completed / total) * 100;
        
        const progressBar = document.getElementById('missionProgress');
        const percentText = document.getElementById('missionPercent');
        const missionText = document.getElementById('missionText');
        
        if (progressBar) progressBar.style.width = percentage + '%';
        if (percentText) percentText.textContent = `${completed}/${total}`;
        
        if (completed === total) {
            if (missionText) {
                missionText.textContent = '🎉 All missions completed! You are a true explorer!';
                missionText.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
            }
        } else {
            const remaining = this.missions.filter(m => !this.discovered.has(m.id));
            if (missionText && remaining.length > 0) {
                missionText.textContent = `Next: ${remaining[0].text}`;
            }
        }
    }
    
    showInteractionHint(show) {
        const hint = document.getElementById('interactionHint');
        if (hint) {
            hint.style.display = show ? 'block' : 'none';
        }
    }
    
    interact() {
        if (!this.nearbyElement) return;
        
        // If it's a navigation button, click it
        if (this.nearbyElement.hasAttribute('data-section')) {
            this.nearbyElement.click();
        }
        // If it's a CTA button, click it
        else if (this.nearbyElement.classList.contains('cta-btn')) {
            this.nearbyElement.click();
        }
        // Generic interaction feedback
        else {
            this.nearbyElement.style.animation = 'popIn 0.3s ease';
            setTimeout(() => {
                if (this.nearbyElement) {
                    this.nearbyElement.style.animation = '';
                }
            }, 300);
        }
    }
    
    updatePosition() {
        this.character.style.left = this.x + 'px';
        this.character.style.top = this.y + 'px';
    }
    
    gameLoop() {
        this.update();
        this.updatePosition();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize character
let freeCharacter = null;

// Parallax Background Effect
function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        layers.forEach((layer, index) => {
            const speed = (index + 1) * 20;
            const xMove = x * speed;
            const yMove = y * speed;
            
            layer.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });
}

// Update splash screen to init character and parallax
const originalStartTyping = startTypingEffect;
startTypingEffect = function() {
    originalStartTyping();
    
    // Init free-roaming character
    setTimeout(() => {
        freeCharacter = new FreeRoamingCharacter();
        console.log('🎮 Character ready! Use WASD to move, E to interact!');
        console.log('🎯 Mission: Discover all 7 elements!');
    }, 500);
    
    // Init parallax
    initParallax();
    console.log('🌌 3D Parallax background active!');
};
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

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }

        setTimeout(type, typeSpeed);
    }

    type();
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

// STEP 4: Free-roaming Pixel Character
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
        });
        
        document.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
            this.unhighlightKey(key);
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
            this.velocityX *= 0.707; // sqrt(2)/2
            this.velocityY *= 0.707;
        }
        
        // Update position
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Constrain to viewport
        this.constrainPosition();
        
        // Walking animation
        if (this.isWalking) {
            this.character.classList.add('walking');
        } else {
            this.character.classList.remove('walking');
        }
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

// Update splash screen to init character
const originalStartTyping = startTypingEffect;
startTypingEffect = function() {
    originalStartTyping();
    
    // Init free-roaming character
    setTimeout(() => {
        freeCharacter = new FreeRoamingCharacter();
        console.log('🎮 Character ready! Use WASD to move anywhere!');
    }, 500);
};
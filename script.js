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

// Keyboard navigation (bonus feature) - Only arrow keys, not WASD
document.addEventListener('keydown', (e) => {
    // Don't interfere with WASD controls
    if (['w', 'a', 's', 'd', 'e'].includes(e.key.toLowerCase())) {
        return;
    }
    
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
        
        // Mouse tracking for eyes - throttled for performance
        let eyeTicking = false;
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (!eyeTicking) {
                window.requestAnimationFrame(() => {
                    this.updateEyes();
                    eyeTicking = false;
                });
                eyeTicking = true;
            }
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
        // Use translate3d for GPU acceleration
        this.character.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
    }
    
    gameLoop() {
        this.update();
        this.updatePosition();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize character
let freeCharacter = null;

// Parallax Background Effect - Optimized
function initParallax() {
    const layers = document.querySelectorAll('.parallax-layer');
    let isHome = true;
    let ticking = false;
    
    // Check if we're on home page
    function checkSection() {
        const homeSection = document.getElementById('home');
        isHome = homeSection && homeSection.classList.contains('active');
    }
    
    // Throttled mousemove for better performance
    document.addEventListener('mousemove', (e) => {
        if (!ticking && !isHome) {
            window.requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth) - 0.5;
                const y = (e.clientY / window.innerHeight) - 0.5;
                
                layers.forEach((layer, index) => {
                    const speed = (index + 1) * 15; // Reduced from 20
                    const xMove = x * speed;
                    const yMove = y * speed;
                    
                    layer.style.transform = `translate(${xMove}px, ${yMove}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
    
    // Update section check on navigation
    document.addEventListener('click', () => {
        setTimeout(checkSection, 100);
    });
    
    checkSection();
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
/* 
=============================================================================
   ABOUT SECTION JAVASCRIPT
   Features: Language Switcher, Parallax Gallery, Photo Upload
=============================================================================
*/

// ===== LANGUAGE SWITCHER (EN/ID) =====
// Allows user to switch between English and Indonesian
let currentLang = 'en';

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Switch all text elements to selected language
function switchLanguage(lang) {
    currentLang = lang;
    
    // Get all elements with language attributes (data-en and data-id)
    const elements = document.querySelectorAll('[data-en][data-id]');
    
    elements.forEach(el => {
        if (lang === 'en') {
            el.textContent = el.getAttribute('data-en');
        } else {
            el.textContent = el.getAttribute('data-id');
        }
    });
    
    console.log(`🌐 Language switched to: ${lang.toUpperCase()}`);
}

// ===== PARALLAX SCROLL EFFECT FOR PHOTO GALLERY =====
// Makes photos move at different speeds when scrolling (depth effect)
function initParallaxScroll() {
    const galleryItems = document.querySelectorAll('.gallery-item[data-scroll-speed]');
    
    if (galleryItems.length === 0) {
        console.log('No gallery items found for parallax');
        return;
    }
    
    console.log(`Found ${galleryItems.length} gallery items for parallax effect`);
    
    function updateParallax() {
        // Get current scroll position
        const scrolled = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
        
        galleryItems.forEach((item, index) => {
            // Get speed from data attribute (0.5 - 0.9)
            const speed = parseFloat(item.getAttribute('data-scroll-speed')) || 0.5;
            
            // Get item's position relative to viewport
            const rect = item.getBoundingClientRect();
            const itemTop = rect.top + scrolled;
            
            // Calculate parallax offset
            // Formula: (scroll position - item position) * speed * damping
            const yPos = (scrolled - itemTop) * speed * 0.3;
            
            // Apply transform for smooth parallax movement
            item.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Throttle scroll event for better performance (60 FPS)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call to set starting positions
    updateParallax();
    console.log('✅ Parallax scroll effect initialized!');
}

// ===== PHOTO UPLOAD HANDLER =====
// Allows adding photos to gallery dynamically
function setupPhotoUpload() {
    const photoGrid = document.getElementById('aboutPhotoGrid');
    if (!photoGrid) return;
    
    // Function to add a photo to the gallery
    // Usage: window.addAboutPhoto('url.jpg', 'Caption text')
    window.addAboutPhoto = function(photoUrl, caption = '') {
        const placeholder = photoGrid.querySelector('.photo-placeholder');
        if (placeholder && photoGrid.children.length === 1) {
            placeholder.remove();
        }
        
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `<img src="${photoUrl}" alt="${caption}">`;
        
        // Click to open lightbox modal
        photoItem.addEventListener('click', () => {
            openPhotoModal(photoUrl, caption);
        });
        
        photoGrid.appendChild(photoItem);
    };
}

// Open photo in full-screen modal
function openPhotoModal(photoUrl, caption) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    modal.innerHTML = `
        <div onclick="this.parentElement.remove()" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
        <div style="position: relative; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center;">
            <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: -50px; right: 0; background: var(--accent-primary); border: none; color: var(--bg-dark); width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">×</button>
            <img src="${photoUrl}" alt="${caption}" style="max-width: 100%; max-height: 80vh; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 217, 255, 0.5);">
            ${caption ? `<p style="color: white; margin-top: 1rem; text-align: center;">${caption}</p>` : ''}
        </div>
    `;
    document.body.appendChild(modal);
}

// ===== PROFILE PHOTO UPLOAD =====
// Set the main profile photo
// Usage: window.setProfilePhoto('url.jpg')
function setupProfilePhotoUpload() {
    window.setProfilePhoto = function(photoUrl) {
        const profilePhoto = document.getElementById('profilePhoto');
        if (profilePhoto) {
            profilePhoto.innerHTML = `<img src="${photoUrl}" alt="Fadli Ghafatul Hijriah">`;
        }
    };
}

// ===== INITIALIZE ALL ABOUT SECTION FEATURES =====
function initAboutSection() {
    setupPhotoUpload();
    setupProfilePhotoUpload();
    initParallaxScroll();
    console.log('✅ About section initialized!');
}

// Export functions for global use
window.initLanguageSwitcher = initLanguageSwitcher;
window.initAboutSection = initAboutSection;
window.switchLanguage = switchLanguage;

/* 
=============================================================================
   ACHIEVEMENTS SECTION JAVASCRIPT
   Animated timeline line that grows/shrinks based on scroll position
=============================================================================
*/

// ===== ANIMATED TIMELINE LINE =====
// Line connects when scrolling down, disconnects when scrolling up
function initAnimatedTimeline() {
    const timelineLine = document.getElementById('timelineLine');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineEnd = document.querySelector('.timeline-end');
    const timelineContainer = document.querySelector('.timeline-container');
    const curvePath = document.getElementById('curvePath');
    const curveSvg = document.getElementById('timelineCurve');
    
    if (!timelineLine || timelineItems.length === 0) {
        console.log('Timeline elements not found');
        return;
    }
    
    console.log(`Found ${timelineItems.length} timeline items`);
    
    // Generate curved path for SVG
    function generateCurvedPath(height) {
        if (!curvePath || !curveSvg) return;
        
        const centerX = 50; // Center of SVG (100px wide)
        const segments = Math.floor(height / 100); // Create curve segment every 100px
        let pathData = `M ${centerX} 0`; // Start at top center
        
        // Generate wavy path with quadratic curves
        for (let i = 0; i < segments; i++) {
            const y1 = (i + 0.5) * 100;
            const y2 = (i + 1) * 100;
            const curve = (i % 2 === 0) ? 10 : -10; // Alternate left/right curves
            
            // Quadratic curve: Q controlX controlY endX endY
            pathData += ` Q ${centerX + curve} ${y1}, ${centerX} ${y2}`;
        }
        
        // Final segment if height doesn't match exactly
        const remaining = height - (segments * 100);
        if (remaining > 0) {
            const curve = (segments % 2 === 0) ? 10 : -10;
            pathData += ` Q ${centerX + curve} ${height - remaining/2}, ${centerX} ${height}`;
        }
        
        curvePath.setAttribute('d', pathData);
        curveSvg.style.height = height + 'px';
    }
    
    // Function to update timeline line height based on scroll
    function updateTimelineLine() {
        const containerRect = timelineContainer.getBoundingClientRect();
        const containerTop = containerRect.top + window.pageYOffset;
        const scrolled = window.pageYOffset + window.innerHeight / 2;
        
        // Calculate how much of the timeline should be visible
        const relativeScroll = scrolled - containerTop;
        
        // Get the position of the end marker
        let maxHeight = containerRect.height - 100; // Default to near container bottom
        
        if (timelineEnd) {
            const endMarker = timelineEnd.querySelector('.timeline-marker.end');
            if (endMarker) {
                const endRect = endMarker.getBoundingClientRect();
                const endTop = endRect.top + window.pageYOffset;
                const endCenter = endTop + (endRect.height / 2);
                maxHeight = endCenter - containerTop; // Reach exact center of end marker
            }
        }
        
        // Clamp between 0 and max height
        let lineHeight = Math.max(0, Math.min(relativeScroll, maxHeight));
        
        // Apply height to line (smooth growth/shrink)
        timelineLine.style.height = lineHeight + 'px';
        
        // Update curved SVG path
        generateCurvedPath(lineHeight);
    }
    
    // Function to reveal timeline items when scrolled into view
    function revealTimelineItems() {
        const windowHeight = window.innerHeight;
        const triggerBottom = windowHeight * 0.8;
        
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            
            if (itemTop < triggerBottom) {
                item.classList.add('in-view');
            } else {
                // Optional: Remove class when scrolling back up
                // item.classList.remove('in-view');
            }
        });
    }
    
    // Throttled scroll event for performance (60 FPS)
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateTimelineLine();
                revealTimelineItems();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial calls
    updateTimelineLine();
    revealTimelineItems();
    
    console.log('✅ Animated timeline with curved path initialized!');
}

// ===== ACHIEVEMENT PHOTO UPLOAD =====
// Function to add photos to timeline items
// Usage: window.addAchievementPhoto(itemIndex, 'url.jpg', 'caption')
function setupAchievementPhotoUpload() {
    window.addAchievementPhoto = function(itemIndex, photoUrl, caption = '') {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (itemIndex < 0 || itemIndex >= timelineItems.length) {
            console.error('Invalid timeline item index');
            return;
        }
        
        const item = timelineItems[itemIndex];
        const placeholder = item.querySelector('.timeline-photo-placeholder');
        
        if (placeholder) {
            // Replace placeholder with actual photo
            const photoDiv = document.createElement('div');
            photoDiv.className = 'timeline-photo';
            photoDiv.innerHTML = `<img src="${photoUrl}" alt="${caption}">`;
            
            placeholder.replaceWith(photoDiv);
            console.log(`✅ Photo added to timeline item ${itemIndex}`);
        }
    };
}

// ===== INITIALIZE ACHIEVEMENTS SECTION =====
function initAchievementsSection() {
    initAnimatedTimeline();
    setupAchievementPhotoUpload();
    console.log('✅ Achievements section initialized!');
}

// Export for global use
window.initAchievementsSection = initAchievementsSection;

/* 
=============================================================================
   END OF ACHIEVEMENTS SECTION JAVASCRIPT
=============================================================================
*/

/* 
=============================================================================
   END OF ABOUT SECTION JAVASCRIPT
=============================================================================
*/

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
            
            // Update active state
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    
    // Get all elements with language attributes
    const elements = document.querySelectorAll('[data-en][data-id]');
    
    elements.forEach(el => {
        if (lang === 'en') {
            el.textContent = el.getAttribute('data-en');
        } else {
            el.textContent = el.getAttribute('data-id');
        }
    });
    
    console.log(`🌐 Language switched to: ${lang.toUpperCase()}`);
}

// Initialize About Section
function initAboutSection() {
    setupPhotoUpload();
    setupProfilePhotoUpload();
    initParallaxScroll();
    console.log('✅ About section initialized!');
}

// Parallax Scroll Effect for Gallery - FIXED
function initParallaxScroll() {
    const galleryItems = document.querySelectorAll('.gallery-item[data-scroll-speed]');
    
    if (galleryItems.length === 0) {
        console.log('No gallery items found for parallax');
        return;
    }
    
    console.log(`Found ${galleryItems.length} gallery items for parallax effect`);
    
    function updateParallax() {
        // Get scroll position relative to viewport
        const scrolled = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;
        
        galleryItems.forEach((item, index) => {
            const speed = parseFloat(item.getAttribute('data-scroll-speed')) || 0.5;
            
            // Get item's position relative to viewport
            const rect = item.getBoundingClientRect();
            const itemTop = rect.top + scrolled;
            
            // Calculate parallax offset
            const yPos = (scrolled - itemTop) * speed * 0.3;
            
            // Apply transform
            item.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Throttle scroll event for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateParallax();
    console.log('✅ Parallax scroll effect initialized!');
}

// Photo Upload Handler
function setupPhotoUpload() {
    const photoGrid = document.getElementById('aboutPhotoGrid');
    if (!photoGrid) return;
    
    // This will be used to add photos
    window.addAboutPhoto = function(photoUrl, caption = '') {
        const placeholder = photoGrid.querySelector('.photo-placeholder');
        if (placeholder && photoGrid.children.length === 1) {
            placeholder.remove();
        }
        
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `<img src="${photoUrl}" alt="${caption}">`;
        
        photoItem.addEventListener('click', () => {
            // Open lightbox or modal
            openPhotoModal(photoUrl, caption);
        });
        
        photoGrid.appendChild(photoItem);
    };
}

function openPhotoModal(photoUrl, caption) {
    // Simple modal for photo viewing
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;
    
    modal.innerHTML = `
        <div onclick="this.parentElement.remove()" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
        <div style="position: relative; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center;">
            <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: -50px; right: 0; background: var(--accent-primary); border: none; color: var(--bg-dark); width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">×</button>
            <img src="${photoUrl}" alt="${caption}" style="max-width: 100%; max-height: 80vh; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 217, 255, 0.5);">
            ${caption ? `<p style="color: white; margin-top: 1rem; text-align: center;">${caption}</p>` : ''}
        </div>
    `;
    document.body.appendChild(modal);
}

// Export functions for use
window.initLanguageSwitcher = initLanguageSwitcher;
window.initAboutSection = initAboutSection;
window.switchLanguage = switchLanguage;
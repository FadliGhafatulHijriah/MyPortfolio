/* ========================================
   LANGUAGE SWITCHER & ABOUT SECTION JS
   ======================================== */

// Language Switcher
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

// Parallax Scroll Effect for Gallery
function initParallaxScroll() {
    const galleryItems = document.querySelectorAll('.gallery-item[data-scroll-speed]');
    
    if (galleryItems.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        galleryItems.forEach(item => {
            const speed = parseFloat(item.getAttribute('data-scroll-speed')) || 0.5;
            const yPos = -(scrolled * speed);
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
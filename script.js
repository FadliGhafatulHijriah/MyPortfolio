/* ==========================================
   MAIN PORTFOLIO SCRIPT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  startSplashScreen();
  if (typeof initLanguageSwitcher === "function") initLanguageSwitcher();
  if (typeof initAboutSection === "function") initAboutSection();
  if (typeof initAchievementsSection === "function") initAchievementsSection();
});

// ===== STEP 1 & 2: Splash Screen Loading & Character Progress =====
function startSplashScreen() {
  const splashScreen = document.getElementById("splash-screen");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const splashWalker = document.getElementById("splashWalker");
  const loadingMessage = document.getElementById("loadingMessage");

  const messages = [
    "Initializing adventure...",
    "Loading pixel world...",
    "Preparing character...",
    "Setting up controls...",
    "Generating terrain...",
    "Almost ready...",
    "Welcome to the adventure!",
  ];

  let progress = 0;
  let messageIndex = 0;

  const loadingInterval = setInterval(() => {
    // Penambahan persentase bertahap
    progress += Math.floor(Math.random() * 6) + 3;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      // Sync UI ke 100%
      if (progressFill) progressFill.style.width = "100%";
      if (progressPercent) progressPercent.textContent = "100%";
      if (splashWalker) {
        splashWalker.style.left = "100%";
        splashWalker.classList.add("completed"); // Berbalik menghadap depan saat 100%
      }

      // Sembunyikan Splash Screen & jalankan animasi halaman utama
      setTimeout(() => {
        if (splashScreen) splashScreen.classList.add("hidden");

        setTimeout(() => {
          if (splashScreen) splashScreen.style.display = "none";
          initNavigation();
          startTypingEffect();
          triggerHeroAnimation();
          console.log("✅ Splash screen complete!");
          console.log("✅ Step 1: Sidebar initialized!");
          console.log("✅ Step 3: Hero section character animated!");
        }, 500);
      }, 1000);
    } else {
      // Update presisi posisi karakter dan fill bar secara bersamaan
      if (progressFill) progressFill.style.width = progress + "%";
      if (progressPercent)
        progressPercent.textContent = Math.floor(progress) + "%";
      if (splashWalker) splashWalker.style.left = progress + "%";

      // Update pesan loading
      const newMessageIndex = Math.floor((progress / 100) * messages.length);
      if (
        newMessageIndex !== messageIndex &&
        newMessageIndex < messages.length
      ) {
        messageIndex = newMessageIndex;
        if (loadingMessage) {
          loadingMessage.textContent = messages[messageIndex];
          loadingMessage.style.animation = "none";
          setTimeout(() => {
            loadingMessage.style.animation = "blink 1.5s ease-in-out infinite";
          }, 10);
        }
      }
    }
  }, 120);
}

// Restart animasi karakter jalan di Hero Section saat splash screen tutup
function triggerHeroAnimation() {
  const walkerRig = document.querySelector(".walker-rig");
  const frontPhoto = document.querySelector(".front-view-photo");

  if (walkerRig && frontPhoto) {
    walkerRig.style.animation = "none";
    frontPhoto.style.animation = "none";

    // Trigger Reflow
    void walkerRig.offsetWidth;

    walkerRig.style.animation = "";
    frontPhoto.style.animation = "";
  }
}

// ===== STEP 3: Typing Effect for Hero Subtitle =====
function startTypingEffect() {
  const typingElement = document.getElementById("typingText");
  if (!typingElement) return;

  const texts = [
    "Informatics Student | Tech Enthusiast",
    "Full Stack Developer | Problem Solver",
    "AI & Machine Learning Enthusiast 🚀",
    "Always Learning, Always Growing",
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

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 800;
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 500);
}

// ===== Navigation Handling =====
function initNavigation() {
  const navButtons = document.querySelectorAll(".icon-btn");
  const pages = document.querySelectorAll(".page");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSection = btn.getAttribute("data-section");

      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      pages.forEach((page) => {
        page.classList.remove("active");
      });

      const targetPage = document.getElementById(targetSection);
      if (targetPage) {
        targetPage.classList.add("active");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  navButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transition = "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });
}

// Keyboard Navigation (Arrow Keys)
document.addEventListener("keydown", (e) => {
  if (["w", "a", "s", "d", "e"].includes(e.key.toLowerCase())) {
    return;
  }

  const navButtons = Array.from(document.querySelectorAll(".icon-btn"));
  const activeIndex = navButtons.findIndex((btn) =>
    btn.classList.contains("active"),
  );

  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    e.preventDefault();
    const nextIndex = (activeIndex + 1) % navButtons.length;
    navButtons[nextIndex].click();
  } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault();
    const prevIndex = (activeIndex - 1 + navButtons.length) % navButtons.length;
    navButtons[prevIndex].click();
  }
});

// ===== STEP 4: Free-roaming Character & Interaction =====
class FreeRoamingCharacter {
  constructor() {
    this.character = document.getElementById("pixelCharacter");
    if (!this.character) return;

    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.speed = 5;

    this.velocityX = 0;
    this.velocityY = 0;

    this.keys = {};
    this.isWalking = false;

    this.mouseX = 0;
    this.mouseY = 0;

    this.radius = 50;
    this.nearbyElement = null;

    this.discovered = new Set();
    this.missions = [
      { id: "home", selector: ".hero-name", text: "Discover your name" },
      {
        id: "about",
        selector: '[data-section="about"]',
        text: "Visit About section",
      },
      {
        id: "skills",
        selector: '[data-section="skills"]',
        text: "Check Skills",
      },
      {
        id: "projects",
        selector: '[data-section="projects"]',
        text: "Explore Projects",
      },
      {
        id: "contact",
        selector: '[data-section="contact"]',
        text: "Find Contact info",
      },
      { id: "cta1", selector: ".cta-btn.primary", text: "Touch a button" },
      { id: "card", selector: ".info-card", text: "Inspect info cards" },
    ];

    this.init();
    this.updatePosition();
    this.gameLoop();
  }

  init() {
    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = true;
      this.highlightKey(key);

      if (key === "e" && this.nearbyElement) {
        this.interact();
      }
    });

    document.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = false;
      this.unhighlightKey(key);
    });

    let eyeTicking = false;
    document.addEventListener("mousemove", (e) => {
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

    window.addEventListener("resize", () => {
      this.constrainPosition();
    });
  }

  highlightKey(key) {
    const keys = document.querySelectorAll(".control-key");
    keys.forEach((el) => {
      if (el.textContent.toLowerCase() === key) {
        el.classList.add("pressed");
      }
    });
  }

  unhighlightKey(key) {
    const keys = document.querySelectorAll(".control-key");
    keys.forEach((el) => {
      if (el.textContent.toLowerCase() === key) {
        el.classList.remove("pressed");
      }
    });
  }

  update() {
    this.velocityX = 0;
    this.velocityY = 0;
    this.isWalking = false;

    if (this.keys["w"]) {
      this.velocityY = -this.speed;
      this.isWalking = true;
    }
    if (this.keys["s"]) {
      this.velocityY = this.speed;
      this.isWalking = true;
    }
    if (this.keys["a"]) {
      this.velocityX = -this.speed;
      this.isWalking = true;
    }
    if (this.keys["d"]) {
      this.velocityX = this.speed;
      this.isWalking = true;
    }

    if (this.velocityX !== 0 && this.velocityY !== 0) {
      this.velocityX *= 0.707;
      this.velocityY *= 0.707;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;

    this.autoScroll();
    this.checkNearbyElements();

    if (this.isWalking) {
      this.character.classList.add("walking");
    } else {
      this.character.classList.remove("walking");
    }
  }

  autoScroll() {
    const scrollMargin = 200;
    const scrollSpeed = 3;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;

    if (!this.isWalking) return;

    if (this.y < scrollMargin && scrollTop > 0) {
      window.scrollBy({ top: -scrollSpeed, behavior: "auto" });
    }

    if (this.y > viewportHeight - scrollMargin) {
      const maxScroll = document.documentElement.scrollHeight - viewportHeight;
      if (scrollTop < maxScroll) {
        window.scrollBy({ top: scrollSpeed, behavior: "auto" });
      }
    }

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
    const elements = document.querySelectorAll(
      ".icon-btn, .info-card, .cta-btn, .hero-name, [data-section]",
    );
    let closestElement = null;
    let closestDistance = this.radius;

    elements.forEach((el) => el.classList.remove("character-hover"));

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2),
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = el;
      }
    });

    if (closestElement) {
      closestElement.classList.add("character-hover");
      this.nearbyElement = closestElement;
      this.character.classList.add("excited");
      this.showInteractionHint(true);
      this.checkMissionCompletion(closestElement);
    } else {
      this.nearbyElement = null;
      this.character.classList.remove("excited");
      this.showInteractionHint(false);
    }
  }

  updateEyes() {
    const headRect = this.character.getBoundingClientRect();
    const headCenterX = headRect.left + headRect.width / 2;
    const headCenterY = headRect.top + headRect.height / 2;

    const dx = this.mouseX - headCenterX;
    const dy = this.mouseY - headCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxMove = 2;
    let eyeX = (dx / distance) * maxMove;
    let eyeY = (dy / distance) * maxMove;

    eyeX = Math.max(-maxMove, Math.min(maxMove, eyeX));
    eyeY = Math.max(-maxMove, Math.min(maxMove, eyeY));

    this.character.style.setProperty("--eye-x", eyeX + "px");
    this.character.style.setProperty("--eye-y", eyeY + "px");
  }

  checkMissionCompletion(element) {
    this.missions.forEach((mission) => {
      if (!this.discovered.has(mission.id)) {
        if (
          element.matches(mission.selector) ||
          element.closest(mission.selector)
        ) {
          this.discovered.add(mission.id);
          element.classList.add("discovered");
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

    const progressBar = document.getElementById("missionProgress");
    const percentText = document.getElementById("missionPercent");
    const missionText = document.getElementById("missionText");

    if (progressBar) progressBar.style.width = percentage + "%";
    if (percentText) percentText.textContent = `${completed}/${total}`;

    if (completed === total) {
      if (missionText) {
        missionText.textContent = "🎉 All missions completed!";
        missionText.style.color = getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-primary")
          .trim();
      }
    } else {
      const remaining = this.missions.filter((m) => !this.discovered.has(m.id));
      if (missionText && remaining.length > 0) {
        missionText.textContent = `Next: ${remaining[0].text}`;
      }
    }
  }

  showInteractionHint(show) {
    const hint = document.getElementById("interactionHint");
    if (hint) {
      hint.style.display = show ? "block" : "none";
    }
  }

  interact() {
    if (!this.nearbyElement) return;

    if (this.nearbyElement.hasAttribute("data-section")) {
      this.nearbyElement.click();
    } else if (this.nearbyElement.classList.contains("cta-btn")) {
      this.nearbyElement.click();
    } else {
      this.nearbyElement.style.animation = "popIn 0.3s ease";
      setTimeout(() => {
        if (this.nearbyElement) {
          this.nearbyElement.style.animation = "";
        }
      }, 300);
    }
  }

  updatePosition() {
    this.character.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
  }

  gameLoop() {
    this.update();
    this.updatePosition();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// ===== Parallax Background Effect =====
function initParallax() {
  const layers = document.querySelectorAll(".parallax-layer");
  let isHome = true;
  let ticking = false;

  function checkSection() {
    const homeSection = document.getElementById("home");
    isHome = homeSection && homeSection.classList.contains("active");
  }

  document.addEventListener("mousemove", (e) => {
    if (!ticking && !isHome) {
      window.requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;

        layers.forEach((layer, index) => {
          const speed = (index + 1) * 15;
          const xMove = x * speed;
          const yMove = y * speed;
          layer.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  document.addEventListener("click", () => {
    setTimeout(checkSection, 100);
  });

  checkSection();
}

// Hook extra init to typing effect trigger
const originalStartTyping = startTypingEffect;
startTypingEffect = function () {
  originalStartTyping();

  setTimeout(() => {
    new FreeRoamingCharacter();
    console.log("🎮 Free-roaming character initialized!");
  }, 500);

  initParallax();
};

// ===== LANGUAGE SWITCHER (EN/ID) =====
let currentLang = "en";

function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll(".lang-btn");

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      switchLanguage(lang);

      langButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function switchLanguage(lang) {
  currentLang = lang;
  const elements = document.querySelectorAll("[data-en][data-id]");

  elements.forEach((el) => {
    if (lang === "en") {
      el.textContent = el.getAttribute("data-en");
    } else {
      el.textContent = el.getAttribute("data-id");
    }
  });

  console.log(`🌐 Language switched to: ${lang.toUpperCase()}`);
}

// ===== ABOUT SECTION FEATURES =====
function initAboutSection() {
  setupPhotoUpload();
  setupProfilePhotoUpload();
  initParallaxScroll();
  console.log("✅ About section initialized!");
}

function initParallaxScroll() {
  const galleryItems = document.querySelectorAll(
    ".gallery-item[data-scroll-speed]",
  );
  if (galleryItems.length === 0) return;

  function updateParallax() {
    const scrolled =
      window.pageYOffset ||
      window.scrollY ||
      document.documentElement.scrollTop;

    galleryItems.forEach((item) => {
      const speed = parseFloat(item.getAttribute("data-scroll-speed")) || 0.5;
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + scrolled;
      const yPos = (scrolled - itemTop) * speed * 0.3;

      item.style.transform = `translateY(${yPos}px)`;
    });
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateParallax();
}

function setupPhotoUpload() {
  const photoGrid = document.getElementById("aboutPhotoGrid");
  if (!photoGrid) return;

  window.addAboutPhoto = function (photoUrl, caption = "") {
    const placeholder = photoGrid.querySelector(".photo-placeholder");
    if (placeholder && photoGrid.children.length === 1) {
      placeholder.remove();
    }

    const photoItem = document.createElement("div");
    photoItem.className = "photo-item";
    photoItem.innerHTML = `<img src="${photoUrl}" alt="${caption}">`;

    photoItem.addEventListener("click", () => {
      openPhotoModal(photoUrl, caption);
    });

    photoGrid.appendChild(photoItem);
  };
}

function setupProfilePhotoUpload() {
  window.setProfilePhoto = function (photoUrl) {
    const profilePhoto = document.getElementById("profilePhoto");
    if (profilePhoto) {
      profilePhoto.innerHTML = `<img src="${photoUrl}" alt="Fadli Ghafatul Hijriah">`;
    }
  };
}

function openPhotoModal(photoUrl, caption) {
  const modal = document.createElement("div");
  modal.className = "photo-modal";
  modal.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        padding: 2rem;
    `;

  modal.innerHTML = `
        <div onclick="this.parentElement.remove()" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
        <div style="position: relative; max-width: 90%; max-height: 90%; display: flex; flex-direction: column; align-items: center;">
            <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: -50px; right: 0; background: var(--accent-primary, #00f2fe); border: none; color: #000; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">×</button>
            <img src="${photoUrl}" alt="${caption}" style="max-width: 100%; max-height: 80vh; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 242, 254, 0.4);">
            ${caption ? `<p style="color: white; margin-top: 1rem; text-align: center;">${caption}</p>` : ""}
        </div>
    `;
  document.body.appendChild(modal);
}

// ===== ACHIEVEMENTS TIMELINE =====
function initAchievementsSection() {
  initAnimatedTimeline();
  setupAchievementPhotoUpload();
  console.log("✅ Achievements section initialized!");
}

function initAnimatedTimeline() {
  const timelineLine = document.getElementById("timelineLine");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineEnd = document.querySelector(".timeline-end");
  const timelineContainer = document.querySelector(".timeline-container");
  const curvePath = document.getElementById("curvePath");
  const curveSvg = document.getElementById("timelineCurve");

  if (!timelineLine || timelineItems.length === 0) return;

  function generateCurvedPath(height) {
    if (!curvePath || !curveSvg) return;

    const centerX = 50;
    const segments = Math.floor(height / 100);
    let pathData = `M ${centerX} 0`;

    for (let i = 0; i < segments; i++) {
      const y1 = (i + 0.5) * 100;
      const y2 = (i + 1) * 100;
      const curve = i % 2 === 0 ? 10 : -10;
      pathData += ` Q ${centerX + curve} ${y1}, ${centerX} ${y2}`;
    }

    const remaining = height - segments * 100;
    if (remaining > 0) {
      const curve = segments % 2 === 0 ? 10 : -10;
      pathData += ` Q ${centerX + curve} ${height - remaining / 2}, ${centerX} ${height}`;
    }

    curvePath.setAttribute("d", pathData);
    curveSvg.style.height = height + "px";
  }

  function updateTimelineLine() {
    if (!timelineContainer) return;
    const containerRect = timelineContainer.getBoundingClientRect();
    const containerTop = containerRect.top + window.pageYOffset;
    const scrolled = window.pageYOffset + window.innerHeight / 2;

    const relativeScroll = scrolled - containerTop;
    let maxHeight = containerRect.height - 100;

    if (timelineEnd) {
      const endMarker = timelineEnd.querySelector(".timeline-marker.end");
      if (endMarker) {
        const endRect = endMarker.getBoundingClientRect();
        const endTop = endRect.top + window.pageYOffset;
        const endCenter = endTop + endRect.height / 2;
        maxHeight = endCenter - containerTop;
      }
    }

    let lineHeight = Math.max(0, Math.min(relativeScroll, maxHeight));
    timelineLine.style.height = lineHeight + "px";
    generateCurvedPath(lineHeight);
  }

  function revealTimelineItems() {
    const windowHeight = window.innerHeight;
    const triggerBottom = windowHeight * 0.8;

    timelineItems.forEach((item) => {
      const itemTop = item.getBoundingClientRect().top;
      if (itemTop < triggerBottom) {
        item.classList.add("in-view");
      }
    });
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateTimelineLine();
        revealTimelineItems();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateTimelineLine();
  revealTimelineItems();
}

function setupAchievementPhotoUpload() {
  window.addAchievementPhoto = function (itemIndex, photoUrl, caption = "") {
    const timelineItems = document.querySelectorAll(".timeline-item");
    if (itemIndex < 0 || itemIndex >= timelineItems.length) return;

    const item = timelineItems[itemIndex];
    const placeholder = item.querySelector(".timeline-photo-placeholder");

    if (placeholder) {
      const photoDiv = document.createElement("div");
      photoDiv.className = "timeline-photo";
      photoDiv.innerHTML = `<img src="${photoUrl}" alt="${caption}">`;
      placeholder.replaceWith(photoDiv);
    }
  };
}

// Global Export Functions
window.initLanguageSwitcher = initLanguageSwitcher;
window.initAboutSection = initAboutSection;
window.initAchievementsSection = initAchievementsSection;
window.switchLanguage = switchLanguage;

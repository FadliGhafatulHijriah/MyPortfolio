/* ==========================================
   MAIN PORTFOLIO SCRIPT (ONE PIECE EDITION)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  startSplashScreen();
  initThemeToggle();
  if (typeof initLanguageSwitcher === "function") initLanguageSwitcher();
  if (typeof initAboutSection === "function") initAboutSection();
  if (typeof initAchievementsSection === "function") initAchievementsSection();
});

// ===== Theme Toggle (Pirate Night / Sunny Day) =====
function initThemeToggle() {
  const themeBtn = document.getElementById("themeToggleBtn");
  if (!themeBtn) return;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem("portfolio-theme") || "theme-dark";
  document.body.className = savedTheme;

  themeBtn.addEventListener("click", () => {
    if (document.body.classList.contains("theme-dark")) {
      document.body.className = "theme-light";
      localStorage.setItem("portfolio-theme", "theme-light");
      console.log("☀️ Switched to Sunny Day Theme (Light Mode)");
    } else {
      document.body.className = "theme-dark";
      localStorage.setItem("portfolio-theme", "theme-dark");
      console.log("🏴‍☠️ Switched to Pirate Night Theme (Dark Mode)");
    }
  });
}

// ===== Splash Screen Loading & Character Progress =====
function startSplashScreen() {
  const splashScreen = document.getElementById("splash-screen");
  const progressFill = document.getElementById("progressFill");
  const progressPercent = document.getElementById("progressPercent");
  const splashWalker = document.getElementById("splashWalker");
  const loadingMessage = document.getElementById("loadingMessage");

  const messages = [
    "Entering the Grand Line...",
    "Raising Straw Hat Sails...",
    "Consulting Log Pose...",
    "Navigating Sea Current...",
    "Approaching Treasure Island...",
    "Welcome Aboard!",
  ];

  let progress = 0;
  let messageIndex = 0;

  const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 6) + 3;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      if (progressFill) progressFill.style.width = "100%";
      if (progressPercent) progressPercent.textContent = "100%";
      if (splashWalker) {
        splashWalker.style.left = "100%";
        splashWalker.classList.add("completed");
      }

      setTimeout(() => {
        if (splashScreen) splashScreen.classList.add("hidden");

        setTimeout(() => {
          if (splashScreen) splashScreen.style.display = "none";
          initNavigation();
          startTypingEffect();
          triggerHeroAnimation();
        }, 500);
      }, 1000);
    } else {
      if (progressFill) progressFill.style.width = progress + "%";
      if (progressPercent)
        progressPercent.textContent = Math.floor(progress) + "%";
      if (splashWalker) splashWalker.style.left = progress + "%";

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

function triggerHeroAnimation() {
  const walkerRig = document.querySelector(".walker-rig");
  const frontPhoto = document.querySelector(".front-view-photo");

  if (walkerRig && frontPhoto) {
    walkerRig.style.animation = "none";
    frontPhoto.style.animation = "none";
    void walkerRig.offsetWidth;
    walkerRig.style.animation = "";
    frontPhoto.style.animation = "";
  }
}

// ===== Typing Effect =====
function startTypingEffect() {
  const typingElement = document.getElementById("typingText");
  if (!typingElement) return;

  const texts = [
    "Informatics Student | Tech Enthusiast",
    "Full Stack Developer | Problem Solver",
    "AI & Machine Learning Specialist 🚀",
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

// ===== Navigation =====
function initNavigation() {
  const navButtons = document.querySelectorAll(".icon-btn");
  const pages = document.querySelectorAll(".page");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSection = btn.getAttribute("data-section");

      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      pages.forEach((page) => page.classList.remove("active"));

      const targetPage = document.getElementById(targetSection);
      if (targetPage) targetPage.classList.add("active");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
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

// ===== LANGUAGE SWITCHER =====
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
  document.querySelectorAll("[data-en][data-id]").forEach((el) => {
    el.textContent =
      lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-id");
  });
}

// ===== ABOUT & ACHIEVEMENTS FEATURES =====
function initAboutSection() {
  initParallaxScroll();
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

function initAchievementsSection() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  function revealTimelineItems() {
    const triggerBottom = window.innerHeight * 0.8;
    timelineItems.forEach((item) => {
      if (item.getBoundingClientRect().top < triggerBottom) {
        item.classList.add("in-view");
      }
    });
  }

  window.addEventListener("scroll", revealTimelineItems);
  revealTimelineItems();
}

window.initLanguageSwitcher = initLanguageSwitcher;
window.initAboutSection = initAboutSection;
window.initAchievementsSection = initAchievementsSection;
window.switchLanguage = switchLanguage;

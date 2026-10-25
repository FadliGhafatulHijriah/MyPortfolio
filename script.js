/* ==========================================
   MAIN PORTFOLIO SCRIPT (ONE PIECE EDITION)
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  startSplashScreen();
  initThemeToggle();
  initInstagramStory();
  initVoyageMarquee();
  initAchievementsBoard();
  initNavigation();
  initHamburgerMenu(); // <--- Tambahkan baris ini
  initScrollAnimations();
  if (typeof initLanguageSwitcher === "function") initLanguageSwitcher();
  if (typeof initAchievementsSection === "function") initAchievementsSection();
});

// ===== Theme Toggle (Pirate Night / Sunny Day) =====
function initThemeToggle() {
  const themeBtn = document.getElementById("themeToggleBtn");
  if (!themeBtn) return;

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

// ===== INSTAGRAM STORY CAROUSEL LOGIC =====
function initInstagramStory() {
  const slides = document.querySelectorAll(".story-slide");
  const bars = document.querySelectorAll(".story-bar");
  const prevBtn = document.getElementById("prevStoryBtn");
  const nextBtn = document.getElementById("nextStoryBtn");

  if (slides.length === 0) return;

  let currentIndex = 0;
  let storyTimer = null;
  const storyDuration = 4000; // 4 Detik per story slide

  function showStory(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;

    // Reset slides & bars
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentIndex);
    });

    bars.forEach((bar, i) => {
      const progress = bar.querySelector(".story-progress");
      bar.classList.remove("active");
      if (i < currentIndex) {
        progress.style.width = "100%";
      } else if (i === currentIndex) {
        progress.style.width = "0%";
        setTimeout(() => {
          progress.style.width = "100%";
        }, 20);
      } else {
        progress.style.width = "0%";
      }
    });

    // Restart timer
    clearInterval(storyTimer);
    storyTimer = setInterval(() => {
      showStory(currentIndex + 1);
    }, storyDuration);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showStory(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showStory(currentIndex + 1);
    });
  }

  // Start Story Auto Play
  showStory(0);
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

// Memulai Animasi Hero Tepat Setelah Splash Screen Tutup
function triggerHeroAnimation() {
  const heroName = document.querySelector(".hero-name");
  if (heroName) {
    heroName.classList.remove("animated");
    void heroName.offsetWidth; // Trigger Reflow
    heroName.classList.add("animated");
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

// ===== VOYAGE MARQUEE =====
// ===== VOYAGE MARQUEE =====
function initVoyageMarquee() {
  const track = document.getElementById("voyageTrack");
  const modal = document.getElementById("voyageModal");
  if (!track || !modal) return;

  // 1. Tambah selotip di setiap kartu asli
  const originals = Array.from(track.children);
  originals.forEach((card) => {
    card.insertAdjacentHTML("afterbegin", '<span class="voyage-tape"></span>');
  });

  // 2. Gandakan kartu secukupnya supaya barisan selalu penuh
  const setWidth = track.offsetWidth || 1;
  const needed = Math.max(window.screen.width, track.parentElement.offsetWidth);
  const half = Math.max(1, Math.ceil(needed / setWidth));
  for (let i = 0; i < half * 2 - 1; i++) {
    originals.forEach((card) => {
      track.appendChild(card.cloneNode(true));
    });
  }

  // 3. Kecepatan gerak (piksel per detik), ubah angka ini kalau mau
  const speed = 40;
  track.style.animationDuration = (half * setWidth) / speed + "s";

  // 4. Atur kemiringan dan posisi tiap kartu mengikuti urutan kartu asli
  const tilts = [-3, 2, -1.5, 3, -2, 1.5];
  const lifts = [12, -14, 6, -6, 10, -10];
  Array.from(track.children).forEach((card, index) => {
    const pos = (index % originals.length) % tilts.length;
    card.style.setProperty("--tilt", tilts[pos] + "deg");
    card.style.setProperty("--lift", lifts[pos] + "px");
  });

  // 5. Jendela detail saat kartu diklik
  const img = document.getElementById("voyageModalImg");
  const badge = document.getElementById("voyageModalBadge");
  const title = document.getElementById("voyageModalTitle");
  const desc = document.getElementById("voyageModalDesc");

  track.addEventListener("click", (e) => {
    const card = e.target.closest(".voyage-card");
    if (!card) return;
    img.src = card.querySelector("img").src;
    badge.textContent = card.querySelector(".story-badge").textContent;
    title.textContent = card.querySelector("h3").textContent;
    desc.textContent = card.querySelector("p").textContent;
    modal.classList.add("open");
  });

  function closeModal() {
    modal.classList.remove("open");
  }

  document.getElementById("voyageModalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// ===== ACHIEVEMENTS BOARD =====
function initAchievementsBoard() {
  // 1. Filter kartu
  const buttons = document.querySelectorAll(".ach-filter");
  const cards = document.querySelectorAll(".ach-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      cards.forEach((card) => {
        const show =
          filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("hide", !show);
      });
    });
  });

  // 2. Angka berhitung naik saat terlihat di layar
  const stats = document.querySelector(".ach-stats");
  if (!stats) return;

  function countUp(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0");
    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = (target * progress).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stats.querySelectorAll(".ach-stat-num").forEach(countUp);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 },
  );
  observer.observe(stats);
}

// ===== Navigation =====
function initNavigation() {
  const navButtons = document.querySelectorAll(".icon-btn");
  const sections = document.querySelectorAll(".page-section");

  if (navButtons.length === 0 || sections.length === 0) return;

  // 1. Klik navbar untuk melakukan smooth scroll dengan memperhitungkan tinggi navbar atas
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSectionId = btn.getAttribute("data-section");
      const targetSection = document.getElementById(targetSectionId || "");

      if (targetSection) {
        // Sesuaikan angka ini jika tinggi navbar Anda ingin lebih/kurang (misal: 85px - 90px)
        const navbarHeight = 90;
        const elementPosition =
          targetSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 2. Scroll Spy: Tombol sidebar menyala otomatis sesuai posisi layar saat di-scroll
  window.addEventListener("scroll", () => {
    let scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navButtons.forEach((btn) => {
          btn.classList.remove("active");
          if (btn.getAttribute("data-section") === sectionId) {
            btn.classList.add("active");
          }
        });
      }
    });
  });
}

// ===== Hamburger Menu Logic for Mobile =====
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const topNavbar = document.getElementById("topNavbar");

  if (!hamburgerBtn || !topNavbar) return;

  // Toggle buka/tutup menu saat tombol hamburger diklik
  hamburgerBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Mencegah event bubbling ke document
    topNavbar.classList.toggle("mobile-open");
    
    const iconSpan = hamburgerBtn.querySelector(".iconify");
    if (topNavbar.classList.contains("mobile-open")) {
      iconSpan.setAttribute("data-icon", "carbon:close");
    } else {
      iconSpan.setAttribute("data-icon", "carbon:menu");
    }
  });

  // Tutup menu saat salah satu link/tombol di dalam menu diklik
  const navButtons = topNavbar.querySelectorAll(".icon-btn");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      topNavbar.classList.remove("mobile-open");
      const iconSpan = hamburgerBtn.querySelector(".iconify");
      if (iconSpan) {
        iconSpan.setAttribute("data-icon", "carbon:menu");
      }
    });
  });

  // Tutup menu otomatis ketika pengguna mengklik di luar area hamburger & navbar
  document.addEventListener("click", (event) => {
    const isClickInsideMenu = topNavbar.contains(event.target);
    const isClickOnButton = hamburgerBtn.contains(event.target);

    if (topNavbar.classList.contains("mobile-open") && !isClickInsideMenu && !isClickOnButton) {
      topNavbar.classList.remove("mobile-open");
      const iconSpan = hamburgerBtn.querySelector(".iconify");
      if (iconSpan) {
        iconSpan.setAttribute("data-icon", "carbon:menu");
      }
    }
  });
}

// ===== Scroll Animation: Smooth Fade-In & Fade-Out Observer =====
function initScrollAnimations() {
  const sections = document.querySelectorAll(".page-section");

  const observerOptions = {
    root: null,
    rootMargin: "-10% 0px -10% 0px", // Memicu sedikit sebelum elemen masuk penuh ke layar
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view"); // Muncul perlahan saat di-scroll ke bawah
      } else {
        entry.target.classList.remove("in-view"); // Menghilang halus saat di-scroll ke atas/keluar layar
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
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

  switchLanguage(currentLang);
}

function switchLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll("[data-en][data-id]").forEach((el) => {
    el.textContent =
      lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-id");
  });
}

// ===== ACHIEVEMENTS TIMELINE =====
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
window.initAchievementsSection = initAchievementsSection;
window.switchLanguage = switchLanguage;

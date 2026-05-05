// ===== theme.js =====
(() => {
  const STORAGE_KEY = "theme";
  const btn = document.getElementById("themeToggleBtn");
  const icon = document.getElementById("themeIcon");

  function apply(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    if (icon)
      icon.className =
        theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    localStorage.setItem(STORAGE_KEY, theme);
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme } })
    );
  }

  document.addEventListener("DOMContentLoaded", () => {
    apply(localStorage.getItem(STORAGE_KEY) || "light");
    btn &&
      btn.addEventListener("click", () => {
        const next =
          (localStorage.getItem(STORAGE_KEY) || "light") === "light"
            ? "dark"
            : "light";
        apply(next);
      });
  });
})();

// ===== mobile-menu.js =====
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu overlay
    const mobileMenuOverlay = document.createElement('div');
    mobileMenuOverlay.className = 'mobile-menu-overlay';
    mobileMenuOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    // Create mobile menu container
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.style.cssText = `
        position: fixed;
        top: 0;
        right: -300px;
        width: 280px;
        height: 100%;
        background: var(--white);
        z-index: 1000;
        padding: 80px 20px 20px;
        transition: right 0.3s ease;
        overflow-y: auto;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    `;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--dark-color);
        cursor: pointer;
    `;
    
    // Add navigation links to mobile menu
    const nav = document.querySelector('.nav');
    if (nav) {
        const navClone = nav.cloneNode(true);
        navClone.style.cssText = `
            display: block !important;
        `;
        
        const navList = navClone.querySelector('ul');
        if (navList) {
            navList.style.cssText = `
                flex-direction: column;
                gap: 0;
            `;
            
            const navItems = navList.querySelectorAll('li');
            navItems.forEach(item => {
                item.style.margin = '0';
                item.style.width = '100%';
                
                const link = item.querySelector('a');
                if (link) {
                    link.style.cssText = `
                        display: block;
                        padding: 15px 0;
                        border-bottom: 1px solid #eee;
                        font-size: 1.1rem;
                        color: var(--dark-color);
                        text-decoration: none;
                    `;
                    
                    // Add active class styling
                    if (link.classList.contains('active')) {
                        link.style.color = 'var(--primary-color)';
                        link.style.fontWeight = 'bold';
                    }
                }
            });
        }
        
        mobileMenu.appendChild(navClone);
    }
    
    // Add auth buttons to mobile menu if they exist
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        const authClone = authButtons.cloneNode(true);
        authClone.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
        `;
        
        const buttons = authClone.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.width = '100%';
            btn.style.textAlign = 'center';
        });
        
        mobileMenu.appendChild(authClone);
    }
    
    // Add close button to mobile menu
    mobileMenu.appendChild(closeBtn);
    
    // Add elements to DOM
    document.body.appendChild(mobileMenuOverlay);
    document.body.appendChild(mobileMenu);
    
    // Toggle mobile menu function
    function toggleMobileMenu() {
        const isOpen = mobileMenu.style.right === '0px';
        
        if (isOpen) {
            mobileMenu.style.right = '-300px';
            mobileMenuOverlay.style.opacity = '0';
            mobileMenuOverlay.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        } else {
            mobileMenu.style.right = '0';
            mobileMenuOverlay.style.opacity = '1';
            mobileMenuOverlay.style.visibility = 'visible';
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Add event listeners
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    closeBtn.addEventListener('click', toggleMobileMenu);
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 768) {
            mobileMenu.style.right = '-300px';
            mobileMenuOverlay.style.opacity = '0';
            mobileMenuOverlay.style.visibility = 'hidden';
            document.body.style.overflow = 'auto';
        }
    }
    
    window.addEventListener('resize', handleResize);
});

// ===== animations.js =====
(() => {
  const hasGSAP = () => typeof window.gsap !== "undefined";
  const hasScrollTrigger = () =>
    hasGSAP() && typeof window.ScrollTrigger !== "undefined";
  const hasLoco = () => typeof window.LocomotiveScroll !== "undefined";
  const prefersReduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initLocomotive() {
    const container = document.querySelector("[data-scroll-container]");
    if (!container || !hasLoco()) return null;
    try {
      const loco = new LocomotiveScroll({
        el: container,
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true },
        lerp: 0.08,
      });

      if (hasScrollTrigger()) {
        const { ScrollTrigger, gsap } = window;
        ScrollTrigger.scrollerProxy(container, {
          scrollTop(value) {
            return arguments.length
              ? loco.scrollTo(value, { duration: 0 })
              : loco.scroll.instance.scroll.y;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
        });
        loco.on("scroll", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", () => loco.update());
        ScrollTrigger.refresh();
      }
      return loco;
    } catch {
      return null;
    }
  }

  function initGSAP() {
    if (!hasGSAP()) return;
    const scrollerEl =
      document.querySelector("[data-scroll-container]") || window;
    const { gsap, ScrollTrigger } = window;

    // Hero entrance
    gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .from(".hero__title", { y: 24, opacity: 0, duration: 0.6 })
      .from(".hero__subtitle", { y: 16, opacity: 0, duration: 0.5 }, "-=0.2")
      .from(
        ".hero__cta .btn",
        { y: 12, opacity: 0, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      );

    // Section reveals
    if (hasScrollTrigger()) {
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            scroller: scrollerEl,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }

    // Card hover micro-interactions
    document
      .querySelectorAll(".card,.chooser-card,.feature-card")
      .forEach((card) => {
        card.addEventListener("mouseenter", () =>
          gsap.to(card, {
            duration: 0.2,
            scale: 1.02,
            boxShadow: "0 12px 24px rgba(0,0,0,.12)",
          })
        );
        card.addEventListener("mouseleave", () =>
          gsap.to(card, { duration: 0.2, scale: 1, boxShadow: "var(--shadow)" })
        );
      });

    // Stats count up
    gsap.utils.toArray("[data-count]").forEach((el) => {
      const target = +el.getAttribute("data-count") || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.2,
        ease: "power1.out",
        onUpdate: () => (el.textContent = Math.floor(obj.v).toLocaleString()),
        ...(hasScrollTrigger()
          ? {
              scrollTrigger: {
                trigger: el,
                scroller: scrollerEl,
                start: "top 85%",
              },
            }
          : {}),
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (prefersReduced()) return;
    const loco = initLocomotive();
    initGSAP();
    // Optional for debugging
    window.__loco = loco;
  });
})();

// ===== page-loader.js =====
window.addEventListener("load", function () {
  const loader = document.getElementById("pageloader");
  if (loader) {
    loader.classList.add("fade-out");
  }
});

/* ===== Hero Slider JavaScript ===== */

(function () {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const images = slider.querySelectorAll("img");
  const dotsContainer = document.getElementById("sliderDots");

  // Create dots
  images.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  let currentIndex = 0;
  let interval = setInterval(nextSlide, 4000);

  function goToSlide(index) {
    images[currentIndex].classList.remove("active");
    dotsContainer.children[currentIndex].classList.remove("active");
    currentIndex = index;
    images[currentIndex].classList.add("active");
    dotsContainer.children[currentIndex].classList.add("active");
    resetInterval();
  }

  function nextSlide() {
    const next = (currentIndex + 1) % images.length;
    goToSlide(next);
  }

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 4000);
  }
})();

/* ===== Index Page Animations ===== */

/* Animated Counter for stats section */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.getAttribute("data-target");
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current < target) {
              el.textContent = Math.ceil(current);
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target;
            }
          };

          updateCounter();
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* GSAP Scroll Animations */
function initScrollAnimations() {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Animate all elements with data-animate
  gsap.utils.toArray("[data-animate]").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  });

  // Stagger effect for cards
  gsap.utils
    .toArray(".chooser-card, .step-card, .testimonial-card")
    .forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card.closest("section"),
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    });

  // Hero section staggered reveal
  gsap.fromTo(
    ".hero-title",
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: ".hero", start: "top 70%" },
    },
  );

  gsap.fromTo(
    ".hero-subtitle",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
      scrollTrigger: { trigger: ".hero", start: "top 70%" },
    },
  );

  gsap.fromTo(
    ".hero-buttons",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.4,
      ease: "power2.out",
      scrollTrigger: { trigger: ".hero", start: "top 70%" },
    },
  );
}

/* Initialize animations on DOM ready */
document.addEventListener("DOMContentLoaded", function () {
  initCounters();
  initScrollAnimations();
});

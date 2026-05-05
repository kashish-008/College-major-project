// ===== public-index.js (merged) =====
// ===== hero-slider.js =====
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

// ===== index-animations.js =====
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

// ===== public-about.js (merged) =====
// ===== counter-animation.js =====
/* ===== Counter Animation JavaScript ===== */

function initCounterAnimation() {
  const counters = document.querySelectorAll(".counter");

  if (counters.length === 0) return;

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

/* Initialize on DOM ready */
document.addEventListener("DOMContentLoaded", initCounterAnimation);

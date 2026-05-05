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

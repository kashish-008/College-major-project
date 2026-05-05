// Optional: GSAP + ScrollTrigger + LocomotiveScroll integration for index.html.
// Safe to include site-wide; does nothing if those libraries aren’t present.
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

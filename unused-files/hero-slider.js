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

// Carousel data
const carouselData = [
  {
    img: "images/image1.jpg",
    alt: "Head of Year",
    title: "Head of Year 11 Message",
    message: "[Insert heartfelt message here]"
  },
  {
    img: "images/image2.jpg",
    alt: "Head of Secondary",
    title: "Head of Secondary message",
    message: "[Insert inspirational message here]"
  }
];

// Carousel logic with smooth fade/slide animation
document.addEventListener("DOMContentLoaded", function() {
  // Fade-in on scroll
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      appearOnScroll.unobserve(entry.target);
    });
  }, appearOptions);
  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Carousel setup
  const carouselSlide = document.querySelector('.carousel-slide');
  const leftArrow = document.querySelector('.carousel-arrow.left');
  const rightArrow = document.querySelector('.carousel-arrow.right');
  const indicators = document.querySelector('.carousel-indicators');

  let current = 0;
  let animating = false;

  function renderSlides(direction = 0) {
    // Remove old slides with animation
    const oldSlide = carouselSlide.querySelector('.carousel-item.active');
    if (oldSlide) {
      oldSlide.classList.remove('active');
      if (direction === -1) oldSlide.classList.add('exit-left');
      else if (direction === 1) oldSlide.classList.add('exit-right');
      setTimeout(() => {
        if (oldSlide.parentNode) oldSlide.parentNode.removeChild(oldSlide);
      }, 500);
    }

    // Add new slide
    const item = carouselData[current];
    const div = document.createElement('div');
    div.className = 'carousel-item active';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.alt}" class="carousel-image">
      <div class="carousel-message">
        <h2>${item.title}</h2>
        <p>${item.message}</p>
      </div>
    `;
    carouselSlide.appendChild(div);

    renderIndicators();
    animating = false;
  }

  function renderIndicators() {
    indicators.innerHTML = '';
    carouselData.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (idx === current ? ' active' : '');
      dot.addEventListener('click', () => {
        if (animating || idx === current) return;
        animating = true;
        let direction = idx > current ? 1 : -1;
        current = idx;
        renderSlides(direction);
      });
      indicators.appendChild(dot);
    });
  }

  leftArrow.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    current = (current - 1 + carouselData.length) % carouselData.length;
    renderSlides(-1);
  });

  rightArrow.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    current = (current + 1) % carouselData.length;
    renderSlides(1);
  });

  // Initial render
  renderSlides();
});

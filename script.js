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

// Carousel logic
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

  function renderSlides() {
    carouselSlide.innerHTML = '';
    carouselData.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'carousel-item' + (idx === current ? ' active' : '');
      div.innerHTML = `
        <img src="${item.img}" alt="${item.alt}" class="carousel-image">
        <div class="carousel-message">
          <h2>${item.title}</h2>
          <p>${item.message}</p>
        </div>
      `;
      carouselSlide.appendChild(div);
    });
    renderIndicators();
  }

  function renderIndicators() {
    indicators.innerHTML = '';
    carouselData.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (idx === current ? ' active' : '');
      dot.addEventListener('click', () => {
        current = idx;
        renderSlides();
      });
      indicators.appendChild(dot);
    });
  }

  leftArrow.addEventListener('click', () => {
    current = (current - 1 + carouselData.length) % carouselData.length;
    renderSlides();
  });

  rightArrow.addEventListener('click', () => {
    current = (current + 1) % carouselData.length;
    renderSlides();
  });

  renderSlides();
});

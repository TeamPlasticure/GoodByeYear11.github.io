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

// Card stack carousel logic
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

  // Card stack carousel
  const stack = document.querySelector('.carousel-stack');
  const leftArrow = document.querySelector('.carousel-arrow.left');
  const rightArrow = document.querySelector('.carousel-arrow.right');
  const indicators = document.querySelector('.carousel-indicators');

  let current = 0;
  let animating = false;

  function renderStack(direction = 0) {
    stack.innerHTML = '';

    // Front card
    const front = document.createElement('div');
    front.className = 'carousel-card front';
    front.innerHTML = `
      <img src="${carouselData[current].img}" alt="${carouselData[current].alt}">
      <div class="carousel-message">
        <h2>${carouselData[current].title}</h2>
        <p>${carouselData[current].message}</p>
      </div>
    `;
    stack.appendChild(front);

    // Back card (the other one)
    const backIdx = (current + 1) % carouselData.length;
    const back = document.createElement('div');
    back.className = 'carousel-card back';
    back.innerHTML = `
      <img src="${carouselData[backIdx].img}" alt="${carouselData[backIdx].alt}">
      <div class="carousel-message">
        <h2>${carouselData[backIdx].title}</h2>
        <p>${carouselData[backIdx].message}</p>
      </div>
    `;
    stack.appendChild(back);

    // Animation: if direction, animate cards
    if (direction !== 0) {
      // Animate out
      const movingOut = direction === 1 ? front : back;
      movingOut.style.transition = 'none';
      movingOut.style.transform = direction === 1
        ? 'translate(-50%, -50%) scale(1) rotateY(0deg)'
        : 'translate(-50%, -50%) scale(0.82) rotateY(-30deg)';
      setTimeout(() => {
        movingOut.style.transition = '';
        movingOut.style.transform = direction === 1
          ? 'translate(-50%, -50%) scale(0.82) rotateY(-30deg)'
          : 'translate(-50%, -50%) scale(1) rotateY(0deg)';
      }, 30);
    }
    animating = false;
    renderIndicators();
  }

  function renderIndicators() {
    indicators.innerHTML = '';
    carouselData.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (idx === current ? ' active' : '');
      dot.addEventListener('click', () => {
        if (animating || idx === current) return;
        animating = true;
        current = idx;
        renderStack(1);
      });
      indicators.appendChild(dot);
    });
  }

  leftArrow.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    current = (current - 1 + carouselData.length) % carouselData.length;
    renderStack(-1);
  });

  rightArrow.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    current = (current + 1) % carouselData.length;
    renderStack(1);
  });

  // Initial render
  renderStack();
});

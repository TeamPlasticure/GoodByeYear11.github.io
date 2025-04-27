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

    // Indices for front and back cards
    const frontIdx = current;
    const backIdx = (current + 1) % carouselData.length;

    // Create both cards
    const front = document.createElement('div');
    front.className = 'carousel-card front';
    front.innerHTML = `
      <img src="${carouselData[frontIdx].img}" alt="${carouselData[frontIdx].alt}">
      <div class="carousel-message">
        <h2>${carouselData[frontIdx].title}</h2>
        <p>${carouselData[frontIdx].message}</p>
      </div>
    `;

    const back = document.createElement('div');
    back.className = 'carousel-card back';
    back.innerHTML = `
      <img src="${carouselData[backIdx].img}" alt="${carouselData[backIdx].alt}">
      <div class="carousel-message">
        <h2>${carouselData[backIdx].title}</h2>
        <p>${carouselData[backIdx].message}</p>
      </div>
    `;

    // Add to DOM
    stack.appendChild(back);
    stack.appendChild(front);
    renderIndicators();

    // Animate if needed
    if (direction !== 0) {
      // Animate front card to back, and back card to front
      setTimeout(() => {
        if (direction === 1) {
          front.classList.add('animate-to-back');
          back.classList.add('animate-to-front');
        } else {
          front.classList.add('animate-to-back');
          back.classList.add('animate-to-front');
        }
      }, 20);

      // After animation, swap current and re-render
      setTimeout(() => {
        animating = false;
        if (direction === 1) {
          current = (current + 1) % carouselData.length;
        } else {
          current = (current - 1 + carouselData.length) % carouselData.length;
        }
        renderStack(0);
      }, 700);
    } else {
      animating = false;
    }
  }

  function renderIndicators() {
    indicators.innerHTML = '';
    carouselData.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (idx === current ? ' active' : '');
      dot.addEventListener('click', () => {
        if (animating || idx === current) return;
        animating = true;
        // Figure out direction
        let direction = (idx > current || (current === carouselData.length - 1 && idx === 0)) ? 1 : -1;
        current = idx;
        renderStack(direction);
      });
      indicators.appendChild(dot);
    });
  }

  leftArrow.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    renderStack(-1);
  });

  rightArrow.addEventListener('click', () => {
    if (animating) return;
    animating = true;
    renderStack(1);
  });

  // Initial render
  renderStack(0);
});

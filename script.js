// Carousel data
const carouselData = [
  {
    img: "images/image1.jpg",
    alt: "Head of Year",
    title: "Head of Year 11 Message",
    message: "This is the heartfelt message for Head of Year 11. You can make this as long as you want! The card will grow as the message is typed out."
  },
  {
    img: "images/image2.jpg",
    alt: "Head of Secondary",
    title: "Head of Secondary message",
    message: "This is the inspirational message for Head of Secondary. It will be typed out when the card comes forward, and the card will expand to fit the message."
  }
];

// Typing animation helper
function typeText(element, text, speed = 14, done) {
  element.textContent = "";
  let i = 0;
  function type() {
    if (i <= text.length) {
      element.textContent = text.slice(0, i);
      // Grow the message container as text appears
      element.parentElement.style.minHeight = (element.scrollHeight + 30) + "px";
      i++;
      setTimeout(type, speed);
    } else if (done) {
      done();
    }
  }
  type();
}

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

  let current = 1; // right card index (front)
  let animating = false;

  function renderStack(direction = 0) {
    stack.innerHTML = '';

    // Indices for left and right cards
    const leftIdx = (current - 1 + carouselData.length) % carouselData.length;
    const rightIdx = current;

    // Create left card (back)
    const left = document.createElement('div');
    left.className = 'carousel-card left';
    left.innerHTML = `
      <img src="${carouselData[leftIdx].img}" alt="${carouselData[leftIdx].alt}">
      <div class="carousel-message"></div>
    `;

    // Create right card (front)
    const right = document.createElement('div');
    right.className = 'carousel-card right';
    right.innerHTML = `
      <img src="${carouselData[rightIdx].img}" alt="${carouselData[rightIdx].alt}">
      <div class="carousel-message">
        <h2>${carouselData[rightIdx].title}</h2>
        <p></p>
      </div>
    `;

    stack.appendChild(left);
    stack.appendChild(right);

    // Typing animation for the right card's message
    setTimeout(() => {
      const msg = right.querySelector('.carousel-message p');
      typeText(msg, carouselData[rightIdx].message, 13, () => {
        // After typing, ensure the card height fits the message
        right.style.minHeight = (right.scrollHeight + 10) + "px";
      });
    }, 350);

    // Animate cards
    left.classList.add('animating');
    right.classList.add('animating');
    setTimeout(() => {
      left.classList.remove('animating');
      right.classList.remove('animating');
    }, 700);

    renderIndicators();
    animating = false;
  }

  function animate(direction) {
    if (animating) return;
    animating = true;
    const cards = stack.querySelectorAll('.carousel-card');
    cards.forEach(card => card.classList.add('animating'));

    // Wait for half the animation, then change indices and re-render
    setTimeout(() => {
      if (direction === 1) {
        current = (current + 1) % carouselData.length;
      } else {
        current = (current - 1 + carouselData.length) % carouselData.length;
      }
      renderStack(direction);
    }, 350);
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

  leftArrow.addEventListener('click', () => animate(-1));
  rightArrow.addEventListener('click', () => animate(1));

  // Initial render
  renderStack();
});

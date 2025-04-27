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
      element.parentElement.style.minHeight = (element.scrollHeight + 30) + "px";
      element.closest('.carousel-card').style.minHeight = (element.closest('.carousel-card').scrollHeight + 10) + "px";
      i++;
      setTimeout(type, speed);
    } else if (done) {
      done();
    }
  }
  type();
}

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

  // Carousel
  const row = document.querySelector('.carousel-row');
  const leftArrow = document.querySelector('.carousel-arrow.left');
  const rightArrow = document.querySelector('.carousel-arrow.right');
  const indicators = document.querySelector('.carousel-indicators');

  let front = 1; // right card index (front)
  let animating = false;

  function renderRow(direction = 0) {
    row.innerHTML = '';

    // Indices for left and right cards
    const leftIdx = (front - 1 + carouselData.length) % carouselData.length;
    const rightIdx = front;

    // Left card (back)
    const left = document.createElement('div');
    left.className = 'carousel-card back';
    left.innerHTML = `
      <img src="${carouselData[leftIdx].img}" alt="${carouselData[leftIdx].alt}">
      <div class="carousel-message"></div>
    `;

    // Right card (front)
    const right = document.createElement('div');
    right.className = 'carousel-card front';
    right.innerHTML = `
      <img src="${carouselData[rightIdx].img}" alt="${carouselData[rightIdx].alt}">
      <div class="carousel-message">
        <h2>${carouselData[rightIdx].title}</h2>
        <p></p>
      </div>
    `;

    // Animate if needed
    if (direction === 1) {
      left.classList.add('fade-out-left');
      right.classList.add('bounce-in-right');
    } else if (direction === -1) {
      right.classList.add('fade-out-right');
      left.classList.add('bounce-in-left');
    }

    row.appendChild(left);
    row.appendChild(right);

    // Typing animation for the right card's message
    setTimeout(() => {
      const msg = right.querySelector('.carousel-message p');
      typeText(msg, carouselData[rightIdx].message, 13, () => {
        right.style.minHeight = (right.scrollHeight + 10) + "px";
        row.style.minHeight = (right.scrollHeight + 10) + "px";
      });
    }, 350);

    renderIndicators();
    animating = false;
  }

  function animate(direction) {
    if (animating) return;
    animating = true;
    setTimeout(() => {
      if (direction === 1) {
        front = (front + 1) % carouselData.length;
      } else {
        front = (front - 1 + carouselData.length) % carouselData.length;
      }
      renderRow(direction);
    }, 400);
  }

  function renderIndicators() {
    indicators.innerHTML = '';
    carouselData.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (idx === front ? ' active' : '');
      dot.addEventListener('click', () => {
        if (animating || idx === front) return;
        animating = true;
        front = idx;
        renderRow(1);
      });
      indicators.appendChild(dot);
    });
  }

  leftArrow.addEventListener('click', () => animate(-1));
  rightArrow.addEventListener('click', () => animate(1));

  // Initial render
  renderRow();
});

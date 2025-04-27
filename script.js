// Smooth animations setup
gsap.registerPlugin(ScrollTrigger);

// Header animation
gsap.to("h1", {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power4.out"
});

// Section animations
gsap.utils.toArray(".animate-section").forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top center+=100"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power4.out"
    });
});

// Card hover effects
document.querySelectorAll('.head-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0) rotateX(0)';
    });
});

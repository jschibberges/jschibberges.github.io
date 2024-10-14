window.onload = function() {
    setTimeout(() => {
        const eyesContainer = document.getElementById('eyes-container');
        eyesContainer.style.display = 'flex';
    }, 30000); // 30-second delay

    const eyes = document.querySelectorAll('.eye');

    // Mouse movement
    document.addEventListener('mousemove', (event) => {
        eyes.forEach(eye => {
            const pupil = eye.querySelector('.pupil');
            movePupil(event.clientX, event.clientY, eye, pupil);
        });
    });

    // Random curious movements when mouse is idle
    setInterval(() => {
        eyes.forEach(eye => {
            const pupil = eye.querySelector('.pupil');
            const randomX = Math.random() * 10 - 5; // Random move within small range
            const randomY = Math.random() * 10 - 5;

            pupil.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
    }, 3000); // Every 3 seconds

    function movePupil(mouseX, mouseY, eye, pupil) {
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
        const distance = Math.min(eyeRect.width / 6, Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY));

        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }
};

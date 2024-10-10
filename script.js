window.onload = function() {
    setTimeout(() => {
        const eyesContainer = document.getElementById('eyes-container');
        eyesContainer.style.display = 'flex';
    }, 30000); // 30-second delay

    document.addEventListener('mousemove', (event) => {
        const eyes = document.querySelectorAll('.eye');
        eyes.forEach(eye => {
            const pupil = eye.querySelector('.pupil');
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;

            const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX);
            const distance = Math.min(eyeRect.width / 4, Math.hypot(event.clientX - eyeCenterX, event.clientY - eyeCenterY));

            const pupilX = Math.cos(angle) * distance;
            const pupilY = Math.sin(angle) * distance;

            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
    });
};

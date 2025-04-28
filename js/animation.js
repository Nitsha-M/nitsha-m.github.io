// Анимация котика
var animationStart = function() {
    const svgCanvas = document.querySelectorAll('.calendar__section .catIcon');
    const maxDistance = 6;
    const maxAngle = 5;
    document.addEventListener('mousemove', (event) => {
        svgCanvas.forEach(svgC => {
            let eyesGroup = svgC.querySelector('.eyesGroup');
            let catFace = svgC.querySelector('.faceGroup');

            let mouseX = event.clientX;
            let mouseY = event.clientY;

            // Получаем центр группы глаз
            let groupRect = svgC.getBoundingClientRect();
            let centerX = groupRect.left + (groupRect.width / 2);
            let centerY = groupRect.top + (groupRect.height / 2);

            // Вычисляем смещение для глаз
            let deltaX = mouseX - centerX;
            let deltaY = mouseY - centerY;

            // Ограничиваем движение глаз
            let distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), maxDistance);

            // Нормализуем и вычисляем новые координаты для глаз
            let angle = Math.atan2(deltaY, deltaX);
            let offsetX = distance * Math.cos(angle);
            let offsetY = distance * Math.sin(angle);

            // Рассчитываем нормализованные координаты мыши
            let normalizedX = (mouseX / window.innerWidth) * 2 - 1;
            let normalizedY = (mouseY / window.innerHeight) * 2 - 1;

            // Задаем углы вращения по осям
            let rotateX = normalizedY * maxAngle;
            let rotateY = (normalizedX * -1) * maxAngle;

            eyesGroup.setAttribute('transform', `translate(${offsetX}, ${offsetY})`);
            catFace.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}
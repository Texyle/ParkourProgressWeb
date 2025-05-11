document.addEventListener("DOMContentLoaded", function() {
    const eyeIcon = document.querySelector('.eye-icon');
    const content = document.querySelector('#content');
    const bgDarken = document.querySelector('body::before');
    eyeIcon.addEventListener('mouseover', function() {
        content.style.opacity = '0';
        eyeIcon.style.fontSize = '27px';
        document.body.classList.remove('darken');
    });

    eyeIcon.addEventListener('mouseout', function() {
        content.style.opacity = '1';
        eyeIcon.style.fontSize = '24px';
        document.body.classList.add('darken');
    });
});
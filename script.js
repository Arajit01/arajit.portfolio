// Initialize EmailJS
(function(){
    emailjs.init('jx3isFO17H8uIbius');
})();

// Contact form submission
const contactForm = document.getElementById('contactForm');
const contactMsg = document.getElementById('contact-msg');
contactForm.addEventListener('submit', function(e){
    e.preventDefault();

    emailjs.send('service_d34z2l8','template_mcod6qm',{
        from_name: contactForm.from_name.value,
        reply_to: contactForm.reply_to.value,
        message: contactForm.message.value
    }).then(function(response){
        contactMsg.innerHTML = 'Message sent successfully!';
        contactForm.reset();
    }, function(error){
        contactMsg.innerHTML = 'Oops! Something went wrong. Please try again.';
    });
});

// Custom cursor
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if(top < windowHeight - 50){
            el.classList.add('active');
        }
    });
});

// Typing effect for hero section
const typedText = document.getElementById('typed-text');
const textArray = ['A Creative Designer', 'A Futuristic Designer', 'A Visual Storyteller'];
let textArrayIndex = 0;
let charIndex = 0;

function type(){
    if(charIndex < textArray[textArrayIndex].length){
        typedText.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 150);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase(){
    if(charIndex > 0){
        typedText.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, 100);
    } else {
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if(textArray.length) setTimeout(type, 1000);
});

// Hide typing cursor when not in hero
window.addEventListener('scroll', function(){
    const hero = document.getElementById('home');
    const heroRect = hero.getBoundingClientRect();
    if(heroRect.bottom < 0 || heroRect.top > window.innerHeight){
        typedText.style.borderRight = 'none';
    } else {
        typedText.style.borderRight = '2px solid #0ff';
    }
});

// Smooth scrolling for anchor links
const scrollArrow = document.querySelector('.scroll-arrow');
if(scrollArrow){
    scrollArrow.addEventListener('click', () => {
        const nextSection = document.getElementById('portfolio'); // scroll to portfolio section
        if(nextSection){
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}
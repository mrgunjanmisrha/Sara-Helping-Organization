// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if(targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation on scroll
function checkVisibility() {
    const introSection = document.querySelector('.intro');
    const serviceCards = document.querySelectorAll('.service-card');
    const statCards = document.querySelectorAll('.stat-card');
    const founderSection = document.querySelector('.founder');

    if (introSection) {
        const introPosition = introSection.getBoundingClientRect();
        if(introPosition.top < window.innerHeight - 100) {
            introSection.classList.add('visible');
        }
    }

    serviceCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect();
        if(cardPosition.top < window.innerHeight - 100) {
            card.classList.add('visible');
        }
    });

    statCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect();
        if(cardPosition.top < window.innerHeight - 100) {
            card.classList.add('visible');
        }
    });

    if (founderSection) {
        const founderPosition = founderSection.getBoundingClientRect();
        if(founderPosition.top < window.innerHeight - 100) {
            founderSection.classList.add('visible');
        }
    }
}

window.addEventListener('scroll', checkVisibility);
window.addEventListener('load', checkVisibility);

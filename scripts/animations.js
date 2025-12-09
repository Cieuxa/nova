// ============================================
// ANIMATIONS ET EFFETS VISUELS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Animation au défilement (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Éléments à animer
    const animatedElements = document.querySelectorAll(
        '.feature-card, .product-card, .benefit, .value-card, .leader-card, .article-card'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
        element.classList.add('animated-element');
    });
    
    // Effet de parallaxe pour les sections hero
    const heroSections = document.querySelectorAll('.hero-section, .company-hero');
    
    function handleParallax() {
        heroSections.forEach(section => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            section.style.backgroundPosition = `center ${rate}px`;
        });
    }
    
    if (heroSections.length > 0) {
        window.addEventListener('scroll', handleParallax);
    }
    
    // Effet de hover sur les cartes
    const cards = document.querySelectorAll('.card, .feature-card, .product-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Compteurs animés
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
            }
        }, 16);
    }
    
    // Observer pour déclencher les compteurs quand ils sont visibles
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-counter]');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-counter'));
                    if (!counter.classList.contains('animated')) {
                        counter.classList.add('animated');
                        animateCounter(counter, target);
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    // Observer les sections avec compteurs
    const counterSections = document.querySelectorAll('.company-hero, .impact-section');
    counterSections.forEach(section => {
        counterObserver.observe(section);
    });
    
    // Animation de typewriter pour les titres
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Observer pour déclencher l'effet typewriter
    const typewriterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                entry.target.classList.add('typed');
                const text = entry.target.textContent;
                typeWriter(entry.target, text);
            }
        });
    }, { threshold: 0.5 });
    
    // Observer les titres principaux
    const mainTitles = document.querySelectorAll('h1, .section-title');
    mainTitles.forEach(title => {
        typewriterObserver.observe(title);
    });
});

// Styles pour les animations
const animationStyles = `
    .animated-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animated-element.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    .floating {
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    
    .pulse {
        animation: pulse 2s ease-in-out infinite;
    }
`;

// Injecter les styles d'animation
const animationStyleElement = document.createElement('style');
animationStyleElement.textContent = animationStyles;
document.head.appendChild(animationStyleElement);
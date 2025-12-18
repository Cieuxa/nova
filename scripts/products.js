// ============================================
// FONCTIONNALITÉS SPÉCIFIQUES À LA PAGE PRODUITS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Navigation par onglets produits
    const productTabs = document.querySelectorAll('.product-nav-link');
    const productSections = document.querySelectorAll('.product-section');
    
    if (productTabs.length > 0) {
        // Activer le premier onglet par défaut
        if (productTabs[0]) {
            productTabs[0].classList.add('active');
        }
        if (productSections[0]) {
            productSections[0].classList.add('active');
        }
        
        productTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Retirer la classe active de tous les onglets
                productTabs.forEach(t => t.classList.remove('active'));
                
                // Ajouter la classe active à l'onglet cliqué
                this.classList.add('active');
                
                // Masquer toutes les sections
                productSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Afficher la section correspondante
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.classList.add('active');
                    
                    // Scroll doux vers la section
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const sectionPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: sectionPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Activer la section correspondante au scroll
        function activateTabOnScroll() {
            const scrollPosition = window.scrollY + 100;
            
            productSections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    
                    // Mettre à jour l'onglet actif
                    productTabs.forEach(tab => {
                        tab.classList.remove('active');
                        if (tab.getAttribute('href') === `#${sectionId}`) {
                            tab.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', activateTabOnScroll);
        activateTabOnScroll(); // Initial check
    }
    
    // Animation des cartes de produits
    const productCards = document.querySelectorAll('.product-card, .pricing-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const button = this.querySelector('.button');
            if (button) {
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = 'var(--shadow-lg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const button = this.querySelector('.button');
            if (button) {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'var(--shadow-sm)';
            }
        });
    });
    
    // Fonctionnalité de sélection de plan
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('click', function() {
            // Retirer la classe selected de toutes les cartes
            pricingCards.forEach(c => c.classList.remove('selected'));
            
            // Ajouter la classe selected à la carte cliquée
            this.classList.add('selected');
            
            // Mettre à jour le bouton CTA principal
            const planName = this.querySelector('h4').textContent;
            const price = this.querySelector('.price').textContent;
            updateMainCTA(planName, price);
        });
    });
    
    function updateMainCTA(planName, price) {
        const mainCTA = document.querySelector('.products-cta .btn-primary');
        if (mainCTA) {
            mainCTA.textContent = `Choisir ${planName} - ${price}/mois`;
        }
    }
    
    // Animation du nuage de données
    const cloudVisual = document.querySelector('.cloud-visual');
    if (cloudVisual) {
        const dataNodes = cloudVisual.querySelectorAll('.data-node');
        
        dataNodes.forEach((node, index) => {
            node.style.animationDelay = `${index * 0.5}s`;
            node.classList.add('floating');
        });
    }
    
    // Simulation de dashboard
    const dashboardWidgets = document.querySelectorAll('.dashboard-widget');
    
    if (dashboardWidgets.length > 0) {
        let values = [1247, 45, 99.8];
        let targets = [1500, 60, 100];
        
        dashboardWidgets.forEach((widget, index) => {
            if (index < 3) { // Pour les widgets avec valeurs numériques
                const valueElement = widget.querySelector('.widget-value');
                if (valueElement) {
                    // Animer le compteur
                    animateValue(valueElement, 0, values[index], 2000);
                    
                    // Mettre à jour périodiquement
                    setInterval(() => {
                        const newValue = Math.min(values[index] + Math.random() * 50, targets[index]);
                        animateValue(valueElement, values[index], newValue, 1000);
                        values[index] = newValue;
                    }, 5000);
                }
            }
        });
    }
    
    // Fonction d'animation de valeur
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            if (element.classList.contains('widget-value')) {
                element.textContent = value + (element.textContent.includes('%') ? '%' : '');
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Effet de survol sur les visuels de produit
    const productVisuals = document.querySelectorAll('.product-visual');
    
    productVisuals.forEach(visual => {
        visual.addEventListener('mouseenter', function() {
            const elements = this.querySelectorAll('.data-node, .mockup-screen, .account-card');
            elements.forEach(el => {
                el.style.transform = 'scale(1.05)';
                el.style.transition = 'transform 0.3s ease';
            });
        });
        
        visual.addEventListener('mouseleave', function() {
            const elements = this.querySelectorAll('.data-node, .mockup-screen, .account-card');
            elements.forEach(el => {
                el.style.transform = 'scale(1)';
            });
        });
    });
});

// Styles spécifiques aux produits
const productsStyles = `
    .product-section {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .product-section.active {
        opacity: 1;
        transform: translateY(0);
    }
    
    .pricing-card.selected {
        border-color: var(--nova-blue);
        box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
    }
    
    .pricing-card-featured {
        position: relative;
        transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
        .pricing-card-featured {
            transform: scale(1);
        }
    }
`;

// Injecter les styles
const productsStyleElement = document.createElement('style');
productsStyleElement.textContent = productsStyles;
document.head.appendChild(productsStyleElement);
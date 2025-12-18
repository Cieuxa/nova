// ============================================
// FONCTIONNALITÉS SPÉCIFIQUES À LA PAGE SÉCURITÉ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Onglets de technologie
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Retirer la classe active de tous les onglets et panneaux
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Ajouter la classe active à l'onglet et au panneau correspondants
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // FAQ interactive
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            // Fermer toutes les autres réponses
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                    q.querySelector('.faq-icon').textContent = '+';
                }
            });
            
            // Basculer la réponse actuelle
            this.classList.toggle('active');
            answer.classList.toggle('active');
            
            // Changer l'icône
            icon.textContent = this.classList.contains('active') ? '−' : '+';
        });
    });
    
    // Animation du bouclier de sécurité
    const shieldAnimation = document.querySelector('.shield-animation');
    if (shieldAnimation) {
        const shieldLayers = shieldAnimation.querySelectorAll('.shield-layer');
        
        shieldLayers.forEach((layer, index) => {
            layer.style.animationDelay = `${index * 0.5}s`;
        });
        
        // Ajouter un effet de survol
        shieldAnimation.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        shieldAnimation.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    // Animation du radar de surveillance
    const radar = document.querySelector('.radar');
    if (radar) {
        const threats = radar.querySelectorAll('.threat');
        
        // Animer les menaces
        threats.forEach((threat, index) => {
            threat.style.animationDelay = `${index * 1}s`;
            threat.classList.add('pulse');
        });
        
        // Animation du balayage radar
        const sweep = radar.querySelector('.radar-sweep');
        if (sweep) {
            setInterval(() => {
                sweep.style.transform = 'rotate(0deg)';
                setTimeout(() => {
                    sweep.style.transition = 'none';
                    sweep.style.transform = 'rotate(360deg)';
                    setTimeout(() => {
                        sweep.style.transition = 'transform 2s linear';
                    }, 50);
                }, 50);
            }, 2000);
        }
    }
    
    // Visualisation du chiffrement
    const encryptionVisual = document.querySelector('.encryption-visual');
    if (encryptionVisual) {
        const dataBlock = encryptionVisual.querySelector('.data-block.encrypted');
        const processSteps = encryptionVisual.querySelectorAll('.process-step');
        
        // Animation de l'effet de chiffrement
        function animateEncryption() {
            if (dataBlock) {
                dataBlock.style.transform = 'translateY(-10px)';
                dataBlock.style.boxShadow = 'var(--shadow-lg)';
                
                setTimeout(() => {
                    dataBlock.style.transform = 'translateY(0)';
                    dataBlock.style.boxShadow = 'var(--shadow-md)';
                }, 500);
            }
            
            // Animer les étapes du processus
            processSteps.forEach((step, index) => {
                setTimeout(() => {
                    step.style.backgroundColor = 'var(--nova-blue)';
                    step.style.color = 'var(--text-light)';
                    
                    setTimeout(() => {
                        step.style.backgroundColor = '';
                        step.style.color = '';
                    }, 500);
                }, index * 300);
            });
        }
        
        // Démarrer l'animation
        setTimeout(animateEncryption, 1000);
        
        // Répéter l'animation
        setInterval(animateEncryption, 5000);
    }
    
    // Badges de certification interactifs
    const certBadges = document.querySelectorAll('.cert-badge');
    
    certBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            const certName = this.textContent;
            
            // Afficher une infobulle
            const tooltip = document.createElement('div');
            tooltip.className = 'cert-tooltip';
            tooltip.textContent = `Certification ${certName} - Vérifiée indépendamment`;
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'var(--bg-dark)';
            tooltip.style.color = 'var(--text-light)';
            tooltip.style.padding = 'var(--space-sm) var(--space-md)';
            tooltip.style.borderRadius = 'var(--border-radius-sm)';
            tooltip.style.fontSize = 'var(--font-size-xs)';
            tooltip.style.zIndex = '1000';
            tooltip.style.boxShadow = 'var(--shadow-md)';
            
            this.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        });
    });
    
    // Animation des documents de transparence
    const docCards = document.querySelectorAll('.doc-card');
    
    docCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animated-element');
        
        // Effet de survol amélioré
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.doc-icon');
            const link = this.querySelector('.doc-link');
            
            if (icon) {
                icon.style.transform = 'rotate(10deg) scale(1.1)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            if (link) {
                link.style.gap = 'var(--space-md)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.doc-icon');
            const link = this.querySelector('.doc-link');
            
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1)';
            }
            
            if (link) {
                link.style.gap = 'var(--space-xs)';
            }
        });
    });
    
    // Affichage des spécifications de sécurité
    const techSpecs = document.querySelectorAll('.tech-specs');
    
    techSpecs.forEach(specs => {
        const specItems = specs.querySelectorAll('.spec');
        
        specItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animated-element');
        });
    });
});

// Styles spécifiques à la sécurité
const securiteStyles = `
    .tab-pane {
        display: none;
        animation: fadeIn 0.5s ease;
    }
    
    .tab-pane.active {
        display: block;
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .faq-answer.active {
        max-height: 500px;
    }
    
    .shield-layer {
        animation: pulse 3s ease-in-out infinite;
    }
    
    .radar-sweep {
        transition: transform 2s linear;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .cert-badge {
        cursor: pointer;
        position: relative;
    }
    
    .cert-tooltip {
        animation: tooltipFade 0.3s ease;
    }
    
    @keyframes tooltipFade {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Injecter les styles
const securiteStyleElement = document.createElement('style');
securiteStyleElement.textContent = securiteStyles;
document.head.appendChild(securiteStyleElement);
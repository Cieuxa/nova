// ============================================
// FONCTIONNALITÉS SPÉCIFIQUES À LA PAGE ENTREPRISE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Timeline interactive
    const timelineMilestones = document.querySelectorAll('.timeline-milestone');
    
    timelineMilestones.forEach(milestone => {
        milestone.addEventListener('mouseenter', function() {
            const dot = this.querySelector('.milestone-dot');
            if (dot) {
                dot.style.transform = 'scale(1.5)';
                dot.style.boxShadow = '0 0 0 8px rgba(0, 102, 255, 0.3)';
            }
        });
        
        milestone.addEventListener('mouseleave', function() {
            const dot = this.querySelector('.milestone-dot');
            if (dot) {
                dot.style.transform = 'scale(1)';
                dot.style.boxShadow = '';
                
                // Réappliquer le style pour le point actif
                if (dot.classList.contains('active')) {
                    dot.style.boxShadow = '0 0 0 5px rgba(0, 102, 255, 0.3)';
                }
            }
        });
        
        // Cliquer sur un point de la timeline
        milestone.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            showMilestoneDetails(year);
        });
    });
    
    function showMilestoneDetails(year) {
        const milestones = {
            '2004': {
                title: 'Fondation de Nova Systems',
                description: 'Alexandre Chen fonde Nova Systems avec une vision : créer une technologie qui sert l\'humain plutôt que de le complexifier.',
                achievements: [
                    'Premier bureau à Paris',
                    'Équipe de 5 personnes',
                    'Capital de démarrage : 500k€'
                ]
            },
            '2010': {
                title: 'Lancement de NovaOS',
                description: 'Sortie de la première version de NovaOS, un système d\'exploitation révolutionnaire centré sur l\'utilisateur.',
                achievements: [
                    '100 000 téléchargements en 24h',
                    'Meilleure note sur TechReview',
                    'Équipe de 50 personnes'
                ]
            },
            '2015': {
                title: 'NovaCloud et Internationalisation',
                description: 'Lancement de NovaCloud et expansion à l\'international avec des bureaux à Berlin et San Francisco.',
                achievements: [
                    '1 million d\'utilisateurs',
                    'Ouverture de 3 bureaux internationaux',
                    'Levée de fonds de 50M€'
                ]
            },
            '2020': {
                title: 'Écosystème Complet',
                description: 'Achèvement de l\'écosystème Nova avec NovaAccount et lancement des solutions entreprise.',
                achievements: [
                    'Équipe de 500 personnes',
                    'Présence dans 150 pays',
                    'Neutralité carbone atteinte'
                ]
            },
            '2024': {
                title: 'Nova Systems Aujourd\'hui',
                description: 'Leader mondial de l\'expérience numérique avec une suite complète de produits intégrés.',
                achievements: [
                    '50 millions d\'utilisateurs',
                    '500+ employés',
                    '100% énergies renouvelables'
                ]
            }
        };
        
        const milestone = milestones[year];
        if (!milestone) return;
        
        // Créer une modal pour afficher les détails
        const modal = document.createElement('div');
        modal.className = 'milestone-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${year} : ${milestone.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${milestone.description}</p>
                    <div class="achievements">
                        <h4>Principales réalisations :</h4>
                        <ul>
                            ${milestone.achievements.map(achievement => 
                                `<li>${achievement}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Styles pour la modal
        const modalStyles = `
            .milestone-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
                backdrop-filter: blur(5px);
            }
            
            .milestone-modal .modal-content {
                background: linear-gradient(135deg, var(--nova-dark) 0%, #1a365d 100%);
                color: var(--text-light);
                border-radius: var(--border-radius-xl);
                padding: var(--space-2xl);
                max-width: 500px;
                width: 90%;
                animation: slideUp 0.3s ease;
                box-shadow: var(--shadow-2xl);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .milestone-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-xl);
                padding-bottom: var(--space-md);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .milestone-modal .modal-header h3 {
                margin: 0;
                color: var(--text-light);
                font-size: var(--font-size-xl);
            }
            
            .milestone-modal .modal-close {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-light);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                font-size: var(--font-size-xl);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .milestone-modal .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }
            
            .milestone-modal .modal-body {
                line-height: var(--line-height-relaxed);
            }
            
            .milestone-modal .achievements {
                margin-top: var(--space-xl);
                padding-top: var(--space-xl);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .milestone-modal .achievements h4 {
                color: var(--text-light);
                margin-bottom: var(--space-md);
            }
            
            .milestone-modal .achievements ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .milestone-modal .achievements li {
                margin-bottom: var(--space-sm);
                padding-left: var(--space-lg);
                position: relative;
            }
            
            .milestone-modal .achievements li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: var(--nova-blue);
                font-weight: bold;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = modalStyles;
        document.head.appendChild(styleElement);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Gérer la fermeture
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', function() {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }, 300);
        });
        
        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
        
        // Fermer avec Échap
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                closeBtn.click();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    // Filtrage des offres d'emploi
    const filterSelect = document.querySelector('.filter-select');
    const jobCards = document.querySelectorAll('.job-card');
    
    if (filterSelect && jobCards.length > 0) {
        filterSelect.addEventListener('change', function() {
            const selectedDepartment = this.value;
            
            jobCards.forEach(card => {
                const department = card.getAttribute('data-department');
                
                if (selectedDepartment === 'all' || department === selectedDepartment) {
                    card.style.display = 'block';
                    
                    // Animation d'apparition
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Afficher un message si aucun résultat
            setTimeout(() => {
                const visibleJobs = Array.from(jobCards).filter(card => 
                    card.style.display !== 'none'
                );
                
                const jobsList = document.querySelector('.jobs-list');
                let noResultsMessage = jobsList.querySelector('.no-jobs-message');
                
                if (visibleJobs.length === 0) {
                    if (!noResultsMessage) {
                        noResultsMessage = document.createElement('div');
                        noResultsMessage.className = 'no-jobs-message';
                        noResultsMessage.innerHTML = `
                            <div style="text-align: center; padding: var(--space-2xl);">
                                <div style="font-size: 3rem; margin-bottom: var(--space-md);">👨‍💻</div>
                                <h3 style="margin-bottom: var(--space-sm); color: var(--text-primary);">
                                    Aucune offre disponible
                                </h3>
                                <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">
                                    Aucune offre d'emploi n'est actuellement disponible dans le département sélectionné.
                                </p>
                                <button class="btn-secondary" id="reset-filter">
                                    Réinitialiser le filtre
                                </button>
                            </div>
                        `;
                        jobsList.appendChild(noResultsMessage);
                        
                        // Gérer le bouton de réinitialisation
                        document.getElementById('reset-filter').addEventListener('click', function() {
                            filterSelect.value = 'all';
                            filterSelect.dispatchEvent(new Event('change'));
                        });
                    }
                } else if (noResultsMessage) {
                    noResultsMessage.remove();
                }
            }, 350);
        });
    }
    
    // Animation des cartes de valeur
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animated-element');
        
        // Effet de survol amélioré
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.value-icon');
            const points = this.querySelectorAll('.value-points li');
            
            if (icon) {
                icon.style.transform = 'rotate(10deg) scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            // Animer les points un par un
            points.forEach((point, i) => {
                setTimeout(() => {
                    point.style.transform = 'translateX(10px)';
                    point.style.transition = 'transform 0.3s ease';
                }, i * 100);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.value-icon');
            const points = this.querySelectorAll('.value-points li');
            
            if (icon) {
                icon.style.transform = 'rotate(0) scale(1)';
            }
            
            points.forEach(point => {
                point.style.transform = 'translateX(0)';
            });
        });
    });
    
    // Animation de la mission
    const missionIllustration = document.querySelector('.mission-illustration');
    if (missionIllustration) {
        const circles = missionIllustration.querySelectorAll('.illustration-circle');
        
        circles.forEach((circle, index) => {
            circle.style.animationDelay = `${index * 1}s`;
            circle.classList.add('floating');
        });
    }
    
    // Interaction avec les leaders
    const leaderCards = document.querySelectorAll('.leader-card');
    
    leaderCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const photo = this.querySelector('.photo-placeholder');
            const socialLinks = this.querySelectorAll('.social-link');
            
            if (photo) {
                photo.style.transform = 'scale(1.1)';
                photo.style.transition = 'transform 0.3s ease';
            }
            
            // Animer les liens sociaux
            socialLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.transform = 'translateY(-5px)';
                    link.style.transition = 'transform 0.3s ease';
                }, index * 100);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const photo = this.querySelector('.photo-placeholder');
            const socialLinks = this.querySelectorAll('.social-link');
            
            if (photo) {
                photo.style.transform = 'scale(1)';
            }
            
            socialLinks.forEach(link => {
                link.style.transform = 'translateY(0)';
            });
        });
        
        // Cliquer sur un leader
        card.addEventListener('click', function() {
            const name = this.querySelector('.leader-name').textContent;
            const role = this.querySelector('.leader-role').textContent;
            const bio = this.querySelector('.leader-bio').textContent;
            
            showLeaderDetails(name, role, bio);
        });
    });
    
    function showLeaderDetails(name, role, bio) {
        const modal = document.createElement('div');
        modal.className = 'leader-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="leader-header">
                    <div class="leader-avatar">${name.substring(0, 2)}</div>
                    <div class="leader-info">
                        <h3>${name}</h3>
                        <p class="leader-role">${role}</p>
                    </div>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="leader-details">
                    <h4>Biographie</h4>
                    <p>${bio}</p>
                    <div class="leader-achievements">
                        <h4>Principales réalisations</h4>
                        <ul>
                            <li>Contribution majeure à la stratégie produit</li>
                            <li>Leadership d'équipes techniques innovantes</li>
                            <li>Expertise reconnue dans le domaine</li>
                        </ul>
                    </div>
                    <div class="leader-contact">
                        <h4>Contact</h4>
                        <p>Pour toute question professionnelle, contactez-nous via notre page de support.</p>
                    </div>
                </div>
            </div>
        `;
        
        // Styles similaires à la modal de timeline
        const modalStyles = `
            .leader-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            
            .leader-modal .modal-content {
                background: var(--bg-primary);
                border-radius: var(--border-radius-xl);
                padding: var(--space-2xl);
                max-width: 600px;
                width: 90%;
                animation: slideUp 0.3s ease;
                box-shadow: var(--shadow-2xl);
            }
            
            .leader-modal .leader-header {
                display: flex;
                align-items: center;
                gap: var(--space-lg);
                margin-bottom: var(--space-xl);
                padding-bottom: var(--space-xl);
                border-bottom: 1px solid var(--border-light);
            }
            
            .leader-modal .leader-avatar {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, var(--nova-blue) 0%, var(--nova-blue-light) 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-2xl);
                font-weight: bold;
                color: var(--text-light);
            }
            
            .leader-modal .leader-info {
                flex: 1;
            }
            
            .leader-modal .leader-info h3 {
                margin: 0 0 var(--space-xs) 0;
                color: var(--text-primary);
            }
            
            .leader-modal .leader-role {
                color: var(--nova-blue);
                margin: 0;
                font-weight: var(--font-weight-medium);
            }
            
            .leader-modal .modal-close {
                background: var(--bg-tertiary);
                color: var(--text-secondary);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                font-size: var(--font-size-xl);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .leader-modal .modal-close:hover {
                background: var(--bg-secondary);
                transform: rotate(90deg);
            }
            
            .leader-modal .leader-details {
                line-height: var(--line-height-relaxed);
            }
            
            .leader-modal .leader-details h4 {
                margin: var(--space-xl) 0 var(--space-md) 0;
                color: var(--text-primary);
            }
            
            .leader-modal .leader-details p {
                color: var(--text-secondary);
                margin-bottom: var(--space-md);
            }
            
            .leader-modal .leader-achievements ul {
                list-style: none;
                padding: 0;
                margin: 0 0 var(--space-xl) 0;
            }
            
            .leader-modal .leader-achievements li {
                margin-bottom: var(--space-sm);
                padding-left: var(--space-lg);
                position: relative;
                color: var(--text-secondary);
            }
            
            .leader-modal .leader-achievements li::before {
                content: '•';
                position: absolute;
                left: 0;
                color: var(--nova-blue);
                font-size: var(--font-size-xl);
            }
            
            .leader-modal .leader-contact {
                padding-top: var(--space-xl);
                border-top: 1px solid var(--border-light);
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = modalStyles;
        document.head.appendChild(styleElement);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Gérer la fermeture
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', function() {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
            }, 300);
        });
        
        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
        
        // Fermer avec Échap
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                closeBtn.click();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    // Animation des statistiques d'impact
    const impactStats = document.querySelectorAll('.impact-stat');
    
    if (impactStats.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numberElement = entry.target.querySelector('.impact-number');
                    const target = parseInt(numberElement.textContent);
                    
                    if (!numberElement.classList.contains('animated')) {
                        numberElement.classList.add('animated');
                        animateCounter(numberElement, 0, target, 2000);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        impactStats.forEach(stat => observer.observe(stat));
    }
    
    // Fonction d'animation de compteur
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            element.textContent = value + (element.textContent.includes('%') ? '%' : '');
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Interaction avec les articles de presse
    const pressCards = document.querySelectorAll('.press-card');
    
    pressCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.press-title').textContent;
            const source = this.querySelector('.source-name').textContent;
            const date = this.querySelector('.press-date').textContent;
            
            // Simuler l'ouverture d'un article
            const modal = document.createElement('div');
            modal.className = 'press-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="press-source">
                            <div class="source-logo">${source.substring(0, 1)}</div>
                            <div class="source-info">
                                <div class="source-name">${source}</div>
                                <div class="press-date">${date}</div>
                            </div>
                        </div>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <h3>${title}</h3>
                        <div class="article-content">
                            <p>En production, cet article s'ouvrirait dans une nouvelle fenêtre ou afficherait le contenu complet de l'article.</p>
                            <p>Pour lire l'article complet, vous seriez redirigé vers le site web de ${source}.</p>
                            <div class="article-excerpt">
                                <p>Extrait de l'article : "Nova Systems continue d'innover dans le domaine de la sécurité numérique avec des solutions qui redéfinissent les standards de l'industrie..."</p>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button class="btn-primary" id="read-full">
                                Lire l'article complet
                            </button>
                            <button class="btn-secondary" id="close-modal">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';
            
            // Gérer les boutons
            modal.querySelector('#read-full').addEventListener('click', function() {
                alert(`Redirection vers ${source}...\n\nEn production, vous seriez redirigé vers l'article complet.`);
                modal.querySelector('.modal-close').click();
            });
            
            modal.querySelector('#close-modal').addEventListener('click', function() {
                modal.querySelector('.modal-close').click();
            });
            
            // Gérer la fermeture
            modal.querySelector('.modal-close').addEventListener('click', function() {
                modal.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.body.style.overflow = '';
                }, 300);
            });
            
            // Fermer en cliquant à l'extérieur
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.querySelector('.modal-close').click();
                }
            });
        });
    });
});

// Styles pour la page entreprise
const entrepriseStyles = `
    .timeline-milestone {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .timeline-milestone:hover .milestone-dot:not(.active) {
        transform: scale(1.3);
        box-shadow: 0 0 0 6px rgba(0, 102, 255, 0.2);
    }
    
    .job-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .value-card:hover .value-icon {
        transform: rotate(10deg) scale(1.2);
        transition: transform 0.3s ease;
    }
    
    .leader-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .leader-card:hover .photo-placeholder {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
    
    .press-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .press-card:hover {
        transform: translateY(-5px) scale(1.02);
    }
    
    .press-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    }
    
    .press-modal .modal-content {
        background: var(--bg-primary);
        border-radius: var(--border-radius-xl);
        padding: var(--space-2xl);
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }
    
    .press-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-xl);
    }
    
    .press-modal .press-source {
        display: flex;
        align-items: center;
        gap: var(--space-md);
    }
    
    .press-modal .source-logo {
        width: 40px;
        height: 40px;
        background: var(--nova-blue);
        color: var(--text-light);
        border-radius: var(--border-radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: var(--font-size-lg);
    }
    
    .press-modal .source-info {
        display: flex;
        flex-direction: column;
    }
    
    .press-modal .source-name {
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
    }
    
    .press-modal .press-date {
        color: var(--text-tertiary);
        font-size: var(--font-size-sm);
    }
    
    .press-modal .modal-close {
        background: var(--bg-tertiary);
        color: var(--text-secondary);
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        font-size: var(--font-size-xl);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .press-modal .modal-close:hover {
        background: var(--bg-secondary);
        transform: rotate(90deg);
    }
    
    .press-modal .modal-body h3 {
        margin: 0 0 var(--space-lg) 0;
        color: var(--text-primary);
        line-height: var(--line-height-tight);
    }
    
    .press-modal .article-content {
        color: var(--text-secondary);
        line-height: var(--line-height-relaxed);
        margin-bottom: var(--space-xl);
    }
    
    .press-modal .article-excerpt {
        margin-top: var(--space-xl);
        padding: var(--space-lg);
        background: var(--bg-secondary);
        border-radius: var(--border-radius-lg);
        border-left: 4px solid var(--nova-blue);
        font-style: italic;
    }
    
    .press-modal .modal-actions {
        display: flex;
        gap: var(--space-md);
        margin-top: var(--space-xl);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Injecter les styles
const entrepriseStyleElement = document.createElement('style');
entrepriseStyleElement.textContent = entrepriseStyles;
document.head.appendChild(entrepriseStyleElement);
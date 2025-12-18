// ============================================
// FONCTIONNALITÉS SPÉCIFIQUES À LA PAGE SUPPORT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Recherche intelligente
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');
    
    if (searchInput && searchForm) {
        // Suggestions de recherche
        const suggestions = [
            'installer NovaOS',
            'récupérer fichiers supprimés',
            'authentification à deux facteurs',
            'changer mot de passe',
            'synchroniser NovaCloud',
            'problème de connexion',
            'facturation et paiement',
            'sécurité du compte',
            'mises à jour NovaOS',
            'support technique'
        ];
        
        let suggestionIndex = 0;
        
        function showNextSuggestion() {
            searchInput.placeholder = `Rechercher : ${suggestions[suggestionIndex]}`;
            suggestionIndex = (suggestionIndex + 1) % suggestions.length;
        }
        
        // Changer la suggestion toutes les 3 secondes
        setInterval(showNextSuggestion, 3000);
        showNextSuggestion(); // Afficher la première suggestion
        
        // Soumission du formulaire
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                // Simulation de recherche
                simulateSearch(query);
            }
        });
    }
    
    function simulateSearch(query) {
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchResults.innerHTML = `
            <div class="results-header">
                <h3>Résultats pour "${query}"</h3>
                <span class="results-count">3 articles trouvés</span>
            </div>
            <div class="results-list">
                <div class="result-item">
                    <h4>Comment ${query.toLowerCase()}</h4>
                    <p>Guide complet étape par étape</p>
                    <span class="result-category">NovaOS</span>
                </div>
                <div class="result-item">
                    <h4>Dépannage : ${query.toLowerCase()}</h4>
                    <p>Solutions aux problèmes courants</p>
                    <span class="result-category">Support</span>
                </div>
                <div class="result-item">
                    <h4>FAQ : ${query.toLowerCase()}</h4>
                    <p>Questions fréquentes et réponses</p>
                    <span class="result-category">Documentation</span>
                </div>
            </div>
        `;
        
        // Styles pour les résultats
        const resultsStyles = `
            .search-results {
                margin-top: var(--space-lg);
                background: var(--bg-primary);
                border-radius: var(--border-radius-lg);
                padding: var(--space-xl);
                box-shadow: var(--shadow-lg);
                animation: slideDown 0.3s ease;
            }
            
            .results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-lg);
                padding-bottom: var(--space-md);
                border-bottom: 1px solid var(--border-light);
            }
            
            .results-header h3 {
                margin: 0;
                font-size: var(--font-size-lg);
            }
            
            .results-count {
                color: var(--text-tertiary);
                font-size: var(--font-size-sm);
            }
            
            .results-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
            }
            
            .result-item {
                padding: var(--space-md);
                background: var(--bg-secondary);
                border-radius: var(--border-radius-md);
                border: 1px solid var(--border-light);
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .result-item:hover {
                border-color: var(--nova-blue);
                transform: translateY(-2px);
            }
            
            .result-item h4 {
                margin: 0 0 var(--space-xs) 0;
                font-size: var(--font-size-base);
                color: var(--text-primary);
            }
            
            .result-item p {
                margin: 0 0 var(--space-xs) 0;
                color: var(--text-secondary);
                font-size: var(--font-size-sm);
            }
            
            .result-category {
                display: inline-block;
                padding: 2px 8px;
                background: var(--bg-tertiary);
                color: var(--text-tertiary);
                border-radius: var(--border-radius-sm);
                font-size: var(--font-size-xs);
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        // Injecter les styles
        const styleElement = document.createElement('style');
        styleElement.textContent = resultsStyles;
        document.head.appendChild(styleElement);
        
        // Supprimer les anciens résultats
        const oldResults = document.querySelector('.search-results');
        if (oldResults) {
            oldResults.remove();
        }
        
        // Ajouter les nouveaux résultats après le formulaire
        searchForm.parentNode.appendChild(searchResults);
        
        // Supprimer les résultats après 10 secondes
        setTimeout(() => {
            if (searchResults.parentNode) {
                searchResults.style.opacity = '0';
                searchResults.style.transform = 'translateY(-10px)';
                searchResults.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    if (searchResults.parentNode) {
                        searchResults.remove();
                    }
                }, 300);
            }
        }, 10000);
    }
    
    // Catégories interactives
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.category-icon');
            const count = this.querySelector('.article-count');
            
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            if (count) {
                count.style.backgroundColor = 'var(--nova-blue)';
                count.style.color = 'var(--text-light)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.category-icon');
            const count = this.querySelector('.article-count');
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
            
            if (count) {
                count.style.backgroundColor = '';
                count.style.color = '';
            }
        });
        
        // Cliquer sur une catégorie
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('.category-title').textContent;
            
            // Filtrer les articles par catégorie
            filterArticlesByCategory(category);
            
            // Scroll vers les articles
            const articlesSection = document.querySelector('.popular-articles');
            if (articlesSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const sectionPosition = articlesSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: sectionPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    function filterArticlesByCategory(category) {
        const articles = document.querySelectorAll('.article-card');
        let found = false;
        
        articles.forEach(article => {
            const articleCategory = article.querySelector('.article-category').textContent;
            
            if (category === 'Tous' || articleCategory === category) {
                article.style.display = 'block';
                article.classList.add('filter-match');
                found = true;
                
                // Animation d'apparition
                setTimeout(() => {
                    article.style.opacity = '1';
                    article.style.transform = 'translateY(0)';
                }, 100);
            } else {
                article.style.display = 'none';
                article.classList.remove('filter-match');
            }
        });
        
        // Afficher un message si aucun résultat
        const articlesGrid = document.querySelector('.articles-grid');
        let noResultsMessage = articlesGrid.querySelector('.no-results');
        
        if (!found) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results';
                noResultsMessage.innerHTML = `
                    <div style="text-align: center; padding: var(--space-xl);">
                        <div style="font-size: 3rem; margin-bottom: var(--space-md);">🔍</div>
                        <h3 style="margin-bottom: var(--space-sm);">Aucun article trouvé</h3>
                        <p style="color: var(--text-secondary);">
                            Aucun article disponible dans la catégorie "${category}".
                            Essayez une autre catégorie ou utilisez la recherche.
                        </p>
                    </div>
                `;
                articlesGrid.appendChild(noResultsMessage);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }
    
    // Options de support interactives
    const optionButtons = document.querySelectorAll('.option-button');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const option = this.closest('.option-card');
            const optionTitle = option.querySelector('.option-title').textContent;
            
            // Simulation d'ouverture de canal de support
            simulateSupportChannel(optionTitle);
        });
    });
    
    function simulateSupportChannel(channel) {
        const modal = document.createElement('div');
        modal.className = 'support-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${channel}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Connexion au canal ${channel}...</p>
                    <div class="loading">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                    <p class="modal-hint">Simulation - En production, vous seriez redirigé vers le support réel</p>
                </div>
            </div>
        `;
        
        // Styles pour la modal
        const modalStyles = `
            .support-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: var(--bg-primary);
                border-radius: var(--border-radius-lg);
                padding: var(--space-xl);
                max-width: 500px;
                width: 90%;
                animation: slideUp 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-xl);
            }
            
            .modal-header h3 {
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                cursor: pointer;
                color: var(--text-secondary);
            }
            
            .modal-body {
                text-align: center;
            }
            
            .loading {
                display: flex;
                justify-content: center;
                gap: var(--space-sm);
                margin: var(--space-xl) 0;
            }
            
            .loading-dot {
                width: 12px;
                height: 12px;
                background: var(--nova-blue);
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out;
            }
            
            .loading-dot:nth-child(1) { animation-delay: -0.32s; }
            .loading-dot:nth-child(2) { animation-delay: -0.16s; }
            
            .modal-hint {
                color: var(--text-tertiary);
                font-size: var(--font-size-sm);
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
            
            @keyframes bounce {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }
        `;
        
        // Injecter les styles
        const styleElement = document.createElement('style');
        styleElement.textContent = modalStyles;
        document.head.appendChild(styleElement);
        
        // Ajouter la modal au document
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Fermer la modal
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
        
        // Fermer avec la touche Échap
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                closeBtn.click();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
        
        // Simuler une connexion
        setTimeout(() => {
            const modalBody = modal.querySelector('.modal-body');
            modalBody.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: var(--space-md);">✅</div>
                <h3 style="margin-bottom: var(--space-sm);">Connecté !</h3>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-xl);">
                    Vous êtes maintenant connecté au support ${channel}.
                    Un agent vous répondra dans les plus brefs délais.
                </p>
                <button class="btn-primary" style="width: 100%;">Commencer la conversation</button>
            `;
        }, 2000);
    }
    
    // Statut des services en temps réel
    function updateServiceStatus() {
        const services = document.querySelectorAll('.status-service');
        
        services.forEach(service => {
            // 95% de chance d'être opérationnel, 5% de chance d'avoir un problème
            const isOperational = Math.random() > 0.05;
            const statusDot = service.querySelector('.status-dot');
            const statusText = service.querySelector('.service-status span:last-child');
            const uptime = service.querySelector('.service-uptime');
            
            if (isOperational) {
                statusDot.className = 'status-dot operational';
                statusText.textContent = 'Opérationnel';
                
                // Mettre à jour le taux de disponibilité (entre 99.9% et 100%)
                if (uptime) {
                    const newUptime = (99.9 + Math.random() * 0.1).toFixed(2) + '%';
                    uptime.textContent = newUptime;
                }
            } else {
                statusDot.className = 'status-dot degraded';
                statusText.textContent = 'Problèmes détectés';
                
                if (uptime) {
                    uptime.textContent = '99.5%';
                }
                
                // Réinitialiser après 30 secondes
                setTimeout(() => {
                    statusDot.className = 'status-dot operational';
                    statusText.textContent = 'Opérationnel';
                    if (uptime) {
                        uptime.textContent = '99.9%';
                    }
                }, 30000);
            }
        });
        
        // Mettre à jour le timestamp
        const statusUpdate = document.querySelector('.status-update');
        if (statusUpdate) {
            const now = new Date();
            statusUpdate.textContent = `Dernière mise à jour : ${now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        }
    }
    
    // Mettre à jour le statut toutes les 10 secondes
    setInterval(updateServiceStatus, 10000);
    
    // Animation des tutoriels
    const tutorialCards = document.querySelectorAll('.tutorial-card');
    
    tutorialCards.forEach(card => {
        const thumbnail = card.querySelector('.tutorial-thumbnail');
        const playButton = card.querySelector('.play-button');
        
        if (thumbnail && playButton) {
            thumbnail.addEventListener('mouseenter', function() {
                playButton.style.transform = 'scale(1.2)';
                playButton.style.backgroundColor = 'var(--text-light)';
                playButton.style.color = 'var(--nova-blue)';
            });
            
            thumbnail.addEventListener('mouseleave', function() {
                playButton.style.transform = 'scale(1)';
                playButton.style.backgroundColor = '';
                playButton.style.color = '';
            });
            
            // Cliquer sur un tutoriel
            thumbnail.addEventListener('click', function() {
                const title = card.querySelector('.tutorial-title').textContent;
                alert(`Lecture du tutoriel : ${title}\n\nEn production, cette fonctionnalité ouvrirait la vidéo.`);
            });
        }
    });
});

// Styles pour la page support
const supportStyles = `
    .category-card:hover .category-icon {
        transform: scale(1.2) rotate(5deg);
        transition: transform 0.3s ease;
    }
    
    .article-card.filter-match {
        animation: highlight 1s ease;
    }
    
    @keyframes highlight {
        0% {
            background-color: var(--bg-primary);
        }
        50% {
            background-color: rgba(0, 102, 255, 0.1);
        }
        100% {
            background-color: var(--bg-primary);
        }
    }
    
    .status-dot.operational {
        background-color: var(--success);
        animation: pulse 2s infinite;
    }
    
    .status-dot.degraded {
        background-color: var(--warning);
        animation: pulse 1s infinite;
    }
    
    .status-dot.outage {
        background-color: var(--error);
        animation: pulse 0.5s infinite;
    }
`;

// Injecter les styles
const supportStyleElement = document.createElement('style');
supportStyleElement.textContent = supportStyles;
document.head.appendChild(supportStyleElement);
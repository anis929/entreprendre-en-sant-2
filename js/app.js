/* ========================================
   Entreprendre en Santé - Application
   ======================================== */
(function () {
    'use strict';

    // ========================================
    // STORAGE HELPER (gestion d'erreur localStorage)
    // ========================================
    const Storage = {
        get(key, fallback) {
            try {
                const value = localStorage.getItem(key);
                if (value === null) return fallback;
                return JSON.parse(value);
            } catch {
                return fallback;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },

        getRaw(key) {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        },

        setRaw(key, value) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch {
                return false;
            }
        }
    };

    // ========================================
    // TOAST NOTIFICATIONS
    // ========================================
    function showToast(message, duration) {
        duration = duration || 3000;
        var container = document.getElementById('toastContainer');
        if (!container) return;

        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 400);
        }, duration);
    }

    // ========================================
    // PAGE MAPPING
    // ========================================
    var PAGE_MAP = {
        'home': 'homePage',
        'how': 'howPage',
        'pricing': 'pricingPage',
        'aiAgents': 'aiAgents',
        'videos': 'videosPage',
        'ideaFinder': 'ideaFinderPage',
        'marketStudy': 'marketStudyPage',
        'competitionAnalysis': 'competitionAnalysisPage',
        'valueProposition': 'valuePropositionPage',
        'part1': 'part1Page',
        'part2': 'part2Page',
        'part3': 'part3Page',
        'part4': 'part4Page',
        'part5': 'part5Page',
        'part6': 'part6Page',
        'part7': 'part7Page',
        'part8': 'part8Page',
        'aiClarificateur': 'aiAgents',
        'aiGuide': 'aiAgents',
        'aiStratege': 'aiAgents',
        'aiArchitecte': 'aiAgents',
        'aiMarketing': 'aiAgents',
        'aiCoach': 'aiAgents',
        'aiVigie': 'aiAgents'
    };

    // ========================================
    // NAVIGATION
    // ========================================
    function showPage(pageName) {
        // Remove active from all nav links
        document.querySelectorAll('.nav-item a').forEach(function (link) {
            link.classList.remove('active');
        });

        // Hide all pages
        document.querySelectorAll('.page').forEach(function (page) {
            page.classList.remove('active');
        });

        // Show target page
        var pageId = PAGE_MAP[pageName] || 'homePage';
        var targetPage = document.getElementById(pageId);

        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update active nav link
        var navSelector = null;
        if (pageName === 'home' || pageName.indexOf('part') === 0 || pageName === 'ideaFinder' || pageName === 'marketStudy' || pageName === 'competitionAnalysis' || pageName === 'valueProposition') {
            navSelector = '[data-page="home"]';
        } else if (pageName === 'how') {
            navSelector = '[data-page="how"]';
        } else if (pageName === 'pricing') {
            navSelector = '[data-page="pricing"]';
        } else if (pageName.indexOf('ai') === 0) {
            navSelector = '[data-page="aiAgents"]';
        } else if (pageName === 'videos') {
            navSelector = '[data-page="videos"]';
        }

        if (navSelector) {
            var navLink = document.querySelector('.nav-item ' + navSelector);
            if (navLink) navLink.classList.add('active');
        }

        // Show/hide progress tracker
        var tracker = document.getElementById('progressTracker');
        if (pageName.indexOf('part') === 0) {
            tracker.classList.add('active');
            updateProgressTracker(pageName);
        } else {
            tracker.classList.remove('active');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Save last visited page
        Storage.setRaw('lastPage', pageName);

        // Update bookmark status
        checkBookmark();

        // Close mobile menu if open
        document.querySelector('.nav-menu').classList.remove('active');
    }

    // ========================================
    // PROGRESS TRACKER
    // ========================================
    function updateProgressTracker(pageName) {
        var partNumber = parseInt(pageName.replace('part', ''), 10);
        document.querySelectorAll('.progress-step').forEach(function (step, index) {
            if (index + 1 <= partNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // ========================================
    // SCROLL EFFECTS
    // ========================================
    window.addEventListener('scroll', function () {
        var scrollIndicator = document.getElementById('scrollIndicator');
        var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (window.scrollY / windowHeight) * 100;
        scrollIndicator.style.width = scrolled + '%';

        var nav = document.querySelector('.top-nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ========================================
    // BOOKMARKS
    // ========================================
    function toggleBookmark() {
        var btn = document.getElementById('bookmarkBtn');
        var activePage = document.querySelector('.page.active');
        if (!activePage) return;

        var currentPage = activePage.id;
        var bookmarks = Storage.get('bookmarks', []);

        var index = bookmarks.indexOf(currentPage);
        if (index !== -1) {
            bookmarks.splice(index, 1);
            btn.classList.remove('bookmark-active');
            showToast('Marque-page retiré');
        } else {
            bookmarks.push(currentPage);
            btn.classList.add('bookmark-active');
            showToast('Page ajoutée aux marque-pages');
        }

        Storage.set('bookmarks', bookmarks);
    }

    function checkBookmark() {
        var btn = document.getElementById('bookmarkBtn');
        var activePage = document.querySelector('.page.active');
        if (!activePage || !btn) return;

        var currentPage = activePage.id;
        var bookmarks = Storage.get('bookmarks', []);

        if (bookmarks.indexOf(currentPage) !== -1) {
            btn.classList.add('bookmark-active');
        } else {
            btn.classList.remove('bookmark-active');
        }
    }

    // ========================================
    // NOTES SYSTEM
    // ========================================
    function openNotes() {
        var modal = document.getElementById('notesModal');
        var textarea = document.getElementById('notesTextarea');
        var activePage = document.querySelector('.page.active');
        if (!activePage) return;

        var currentPage = activePage.id;
        var notes = Storage.get('notes', {});
        textarea.value = notes[currentPage] || '';

        modal.classList.add('active');
    }

    function closeNotes() {
        document.getElementById('notesModal').classList.remove('active');
    }

    function saveNotes() {
        var textarea = document.getElementById('notesTextarea');
        var activePage = document.querySelector('.page.active');
        if (!activePage) return;

        var currentPage = activePage.id;
        var notes = Storage.get('notes', {});
        notes[currentPage] = textarea.value;

        if (Storage.set('notes', notes)) {
            showToast('Notes sauvegardées !');
        } else {
            showToast('Erreur : impossible de sauvegarder');
        }
        closeNotes();
    }

    // ========================================
    // SCROLL TO TOP
    // ========================================
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ========================================
    // MOBILE MENU
    // ========================================
    function toggleMobileMenu() {
        document.querySelector('.nav-menu').classList.toggle('active');
    }

    // ========================================
    // INLINE CALCULATORS
    // ========================================
    function showCalcResult(resultId, mainId, labelId, detailId, alertId, main, label, detail, alertHtml) {
        var r = document.getElementById(resultId);
        if (!r) return;
        document.getElementById(mainId).textContent = main;
        document.getElementById(labelId).textContent = label;
        document.getElementById(detailId).innerHTML = detail;
        document.getElementById(alertId).innerHTML = alertHtml || '';
        r.classList.add('visible');
    }

    window.calcRunway = function () {
        var cash = parseFloat(document.getElementById('cr_cash').value) || 0;
        var burn = parseFloat(document.getElementById('cr_burn').value) || 0;
        var revenue = parseFloat(document.getElementById('cr_revenue').value) || 0;
        if (!cash || !burn) { showToast('Remplissez la trésorerie et les dépenses mensuelles.'); return; }
        var netBurn = Math.max(burn - revenue, 0);
        var runway = netBurn > 0 ? (cash / netBurn) : Infinity;
        var runwayDisplay = netBurn === 0 ? '∞' : runway.toFixed(1);
        var label = netBurn === 0 ? 'Vous êtes à l\'équilibre ou en excédent' : 'de runway restant (Burn net: ' + netBurn.toLocaleString('fr-FR') + ' €/mois)';
        var detail = '<strong>Trésorerie :</strong> ' + cash.toLocaleString('fr-FR') + ' €' +
            '<br><strong>Dépenses brutes :</strong> ' + burn.toLocaleString('fr-FR') + ' €/mois' +
            '<br><strong>Revenus :</strong> ' + revenue.toLocaleString('fr-FR') + ' €/mois' +
            '<br><strong>Burn net :</strong> ' + (netBurn === 0 ? 'Équilibré' : netBurn.toLocaleString('fr-FR') + ' €/mois');
        var alertHtml = '';
        if (runway !== Infinity) {
            if (runway < 6) {
                alertHtml = '<div class="calc-result-alert danger">⚠️ Runway critique — Lancez immédiatement une levée de fonds ou réduisez vos coûts. Moins de 6 mois est une zone de danger.</div>';
            } else if (runway < 12) {
                alertHtml = '<div class="calc-result-alert warning">🟡 Runway serré — Préparez votre prochaine levée maintenant. Visez 18 mois minimum avant de lever.</div>';
            } else if (runway < 24) {
                alertHtml = '<div class="calc-result-alert success">✅ Runway confortable — Concentrez-vous sur la croissance. Anticipez votre prochaine levée à partir du mois ' + Math.round(runway - 9) + '.</div>';
            } else {
                alertHtml = '<div class="calc-result-alert success">🚀 Excellent runway — Vous avez le temps de construire. Restez rigoureux sur vos métriques et évitez d\'overstaffer trop vite.</div>';
            }
        }
        showCalcResult('cr_result', 'cr_main', 'cr_label', 'cr_detail', 'cr_alert',
            runway === Infinity ? '∞ mois' : runway.toFixed(1) + ' mois', label, detail, alertHtml);
    };

    window.calcROI = function () {
        var users = parseFloat(document.getElementById('roi_users').value) || 0;
        var timeMin = parseFloat(document.getElementById('roi_time').value) || 0;
        var costPerHour = parseFloat(document.getElementById('roi_cost').value) || 0;
        var price = parseFloat(document.getElementById('roi_price').value) || 0;
        if (!users || !timeMin || !costPerHour || !price) { showToast('Veuillez remplir tous les champs.'); return; }
        var workDays = 220;
        var timeSavedHours = (users * timeMin * workDays) / 60;
        var moneySaved = timeSavedHours * costPerHour;
        var roi = ((moneySaved - price) / price) * 100;
        var paybackMonths = price / (moneySaved / 12);
        var detail = '<strong>Temps économisé/an :</strong> ' + Math.round(timeSavedHours).toLocaleString('fr-FR') + ' heures' +
            '<br><strong>Valeur du temps économisé :</strong> ' + Math.round(moneySaved).toLocaleString('fr-FR') + ' €' +
            '<br><strong>Coût de la solution :</strong> ' + price.toLocaleString('fr-FR') + ' €/an' +
            '<br><strong>Gain net :</strong> ' + Math.round(moneySaved - price).toLocaleString('fr-FR') + ' €/an' +
            '<br><strong>Retour sur investissement :</strong> ' + Math.round(roi) + ' %' +
            '<br><strong>Payback :</strong> ' + paybackMonths.toFixed(1) + ' mois';
        var alertHtml = '';
        if (roi < 0) {
            alertHtml = '<div class="calc-result-alert danger">⚠️ ROI négatif — Le coût dépasse les économies générées. Revoir le prix ou identifier d\'autres bénéfices (qualité, sécurité, conformité).</div>';
        } else if (roi < 50) {
            alertHtml = '<div class="calc-result-alert warning">🟡 ROI modéré — Complétez votre argumentaire avec d\'autres bénéfices quantifiables (réduction erreurs, satisfaction soignants, conformité).</div>';
        } else if (roi < 200) {
            alertHtml = '<div class="calc-result-alert success">✅ ROI solide — Argument commercial fort. Présentez ce calcul dès le premier RDV avec le Directeur Financier.</div>';
        } else {
            alertHtml = '<div class="calc-result-alert success">🚀 ROI exceptionnel — Mettez ce chiffre en avant dans tous vos supports. Proposez un audit de terrain pour valider les hypothèses avec le client.</div>';
        }
        showCalcResult('roi_result', 'roi_main', 'roi_label', 'roi_detail', 'roi_alert',
            Math.round(roi) + ' %', 'de ROI estimé pour l\'établissement', detail, alertHtml);
    };

    window.calcConformite = function () {
        var fields = ['conf_dm', 'conf_hds', 'conf_rgpd', 'conf_cgu', 'conf_anticadeaux'];
        var maxScore = 15;
        var score = 0;
        var missing = [];
        var labels = ['Qualification DM', 'Hébergement HDS', 'AIPD/PIA', 'CGU/CGV', 'Loi anti-cadeaux'];
        fields.forEach(function (id, i) {
            var el = document.getElementById(id);
            if (!el || el.value === '') { missing.push(labels[i]); return; }
            score += parseInt(el.value, 10);
        });
        if (missing.length > 0) { showToast('Répondez à toutes les questions pour obtenir votre score.'); return; }
        var pct = Math.round((score / maxScore) * 100);
        var detail = '<strong>Score obtenu :</strong> ' + score + ' / ' + maxScore +
            '<br><strong>Niveau :</strong> ' + (pct >= 80 ? 'Conforme' : pct >= 50 ? 'En progression' : 'Exposition réglementaire élevée');
        var alertHtml = '';
        if (pct < 40) {
            alertHtml = '<div class="calc-result-alert danger">⚠️ Exposition réglementaire élevée — Consultez un avocat spécialisé en droit de la santé et un DPO dès que possible. Un audit CNIL ou une mise en demeure ANSM pourrait bloquer votre développement commercial.</div>';
        } else if (pct < 70) {
            alertHtml = '<div class="calc-result-alert warning">🟡 Des lacunes à combler — Identifiez les 2-3 points critiques et mettez en place un plan d\'action sur 90 jours. Priorisez HDS et AIPD si vous hébergez des données de santé.</div>';
        } else if (pct < 90) {
            alertHtml = '<div class="calc-result-alert success">✅ Bonne conformité — Finalisez les derniers points et planifiez un audit annuel. Vous pouvez rassurer vos clients institutionnels sur votre niveau de conformité.</div>';
        } else {
            alertHtml = '<div class="calc-result-alert success">🚀 Excellent niveau de conformité — Valorisez cet atout dans votre pitch commercial. La conformité est un différenciateur majeur dans le secteur santé.</div>';
        }
        showCalcResult('conf_result', 'conf_main', 'conf_label', 'conf_detail', 'conf_alert',
            pct + ' %', 'de conformité réglementaire estimée', detail, alertHtml);
    };

    window.calcMarketing = function () {
        var revenue = parseFloat(document.getElementById('mkt_revenue').value) || 0;
        var arpu = parseFloat(document.getElementById('mkt_arpu').value) || 0;
        var ltvMonths = parseFloat(document.getElementById('mkt_ltv_months').value) || 0;
        var margin = parseFloat(document.getElementById('mkt_margin').value) || 0;
        if (!revenue || !arpu || !ltvMonths || !margin) { showToast('Veuillez remplir tous les champs.'); return; }
        var clientsNeeded = Math.ceil(revenue / arpu);
        var ltv = (arpu * (margin / 100)) * (ltvMonths / 12);
        // Rule: CAC ≤ LTV/3 for healthy SaaS
        var maxCac = ltv / 3;
        // Typical marketing budget: 10-20% of revenue for B2B SaaS health
        var budgetLow = revenue * 0.10;
        var budgetHigh = revenue * 0.20;
        var detail = '<strong>Clients à acquérir :</strong> ' + clientsNeeded + ' clients/an' +
            '<br><strong>LTV estimée par client :</strong> ' + Math.round(ltv).toLocaleString('fr-FR') + ' €' +
            '<br><strong>CAC maximum recommandé (LTV/3) :</strong> ' + Math.round(maxCac).toLocaleString('fr-FR') + ' €' +
            '<br><strong>Budget marketing conseillé :</strong> ' + Math.round(budgetLow).toLocaleString('fr-FR') + ' € à ' + Math.round(budgetHigh).toLocaleString('fr-FR') + ' €/an' +
            '<br><strong>Ratio LTV/CAC cible :</strong> ≥ 3 (seuil de viabilité pour SaaS santé B2B)';
        var alertHtml = '';
        if (maxCac < 2000) {
            alertHtml = '<div class="calc-result-alert warning">🟡 CAC max faible — Privilégiez le marketing organique (contenu, référencement, réseau), moins coûteux que la publicité payante. Le content marketing + personal branding LinkedIn sont vos meilleurs leviers.</div>';
        } else if (maxCac < 10000) {
            alertHtml = '<div class="calc-result-alert success">✅ Économie saine — Vous pouvez combiner marketing organique + événements (congrès) + un budget LinkedIn Ads ciblé. Suivez votre CAC réel chaque mois.</div>';
        } else {
            alertHtml = '<div class="calc-result-alert success">🚀 Bonne marge de manœuvre — Vous pouvez investir dans les congrès médicaux, les KOLs, et des campagnes multi-canaux. Attention à ne pas dépasser LTV/3 en CAC réel.</div>';
        }
        showCalcResult('mkt_result', 'mkt_main', 'mkt_label', 'mkt_detail', 'mkt_alert',
            Math.round(maxCac).toLocaleString('fr-FR') + ' €', 'de CAC maximum recommandé (LTV/3)', detail, alertHtml);
    };

    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    var SEARCH_INDEX = [
        // Home / parcours
        { page: 'home', icon: '🏠', tag: 'Accueil', title: 'Accueil — Entreprendre en santé', keywords: 'accueil mission parcours professionnel santé entrepreneur' },
        { page: 'how', icon: '📖', tag: 'Comment ça marche', title: 'Comment ça marche', keywords: 'fonctionnement parcours étapes agents ia modules' },
        { page: 'pricing', icon: '💳', tag: 'Tarifs', title: 'Tarifs et formules', keywords: 'tarif prix formule gratuit accompagné premium paiement' },
        { page: 'aiAgents', icon: '🤖', tag: 'Agents IA', title: 'Agents IA spécialisés santé', keywords: 'intelligence artificielle agents ia clarificateur guide stratège architecte marketing coach vigie' },
        { page: 'videos', icon: '🎬', tag: 'Vidéos', title: 'Vidéos Bonus', keywords: 'vidéos bonus ressources complémentaires' },
        // Tools
        { page: 'ideaFinder', icon: '💡', tag: 'Outil', title: 'Trouveur d\'idée innovante', keywords: 'idée innovation outil trouveur brainstorming génération' },
        { page: 'marketStudy', icon: '📊', tag: 'Outil', title: 'Étude de marché', keywords: 'étude marché analyse demande offre segments' },
        { page: 'competitionAnalysis', icon: '🏆', tag: 'Outil', title: 'Analyse concurrentielle', keywords: 'concurrence analyse concurrentielle positionnement benchmark' },
        { page: 'valueProposition', icon: '💎', tag: 'Outil', title: 'Proposition de valeur', keywords: 'valeur proposition canvas unique selling point USP' },
        // Part 1
        { page: 'part1', icon: '1️⃣', tag: 'Partie 1', title: 'Partie 1 — Idée et validation', keywords: 'idée validation problème solution besoins patients problème design thinking lean startup mvp hypothèse' },
        { page: 'part1', icon: '1️⃣', tag: 'Partie 1', title: 'Identifier un vrai problème de santé', keywords: 'problème terrain observation médecin infirmier pharmacien patient parcours de soins' },
        { page: 'part1', icon: '1️⃣', tag: 'Partie 1', title: 'MVP et test d\'hypothèses', keywords: 'mvp minimum viable product test hypothèse pivot prototypage validation' },
        // Part 2
        { page: 'part2', icon: '2️⃣', tag: 'Partie 2', title: 'Partie 2 — Modèle économique', keywords: 'business model canvas revenus coûts flux monétisation financement' },
        { page: 'part2', icon: '2️⃣', tag: 'Partie 2', title: 'Sources de revenus en santé', keywords: 'revenus b2b b2c paiement freemium abonnement acte licence saas' },
        { page: 'part2', icon: '2️⃣', tag: 'Partie 2', title: 'Structures de coûts', keywords: 'coûts charges fixes variables burn rate trésorerie budget prévisionnel' },
        // Part 3
        { page: 'part3', icon: '3️⃣', tag: 'Partie 3', title: 'Partie 3 — Structure juridique', keywords: 'statut juridique sas sarl sasu eurl sci holding société structure légale' },
        { page: 'part3', icon: '3️⃣', tag: 'Partie 3', title: 'Choisir son statut juridique', keywords: 'sas sarl eurl auto-entrepreneur micro-entreprise médecin libéral scp sci' },
        { page: 'part3', icon: '3️⃣', tag: 'Partie 3', title: 'Financement et levée de fonds', keywords: 'financement capital risque venture capital bpi france prêt bancaire crowdfunding business angels amorçage série a' },
        // Part 4
        { page: 'part4', icon: '4️⃣', tag: 'Partie 4', title: 'Partie 4 — Équipe et RH', keywords: 'équipe recrutement rh associés co-fondateurs cto médecin directeur commercial' },
        { page: 'part4', icon: '4️⃣', tag: 'Partie 4', title: 'Recrutement et contrats', keywords: 'cdi cdd stage alternance freelance consultant contrat de travail period essai' },
        { page: 'part4', icon: '4️⃣', tag: 'Partie 4', title: 'Culture d\'entreprise et leadership', keywords: 'culture entreprise leadership management équipe motivation onboarding' },
        // Part 5
        { page: 'part5', icon: '5️⃣', tag: 'Partie 5', title: 'Partie 5 — Marketing et communication', keywords: 'marketing communication branding identité visuelle réseaux sociaux content marketing' },
        { page: 'part5', icon: '5️⃣', tag: 'Partie 5', title: 'Marketing santé et déontologie', keywords: 'communication médicale déontologie publicité réglementation congrès médecins' },
        { page: 'part5', icon: '5️⃣', tag: 'Partie 5', title: 'Stratégie digitale', keywords: 'seo référencement linkedin twitter site web landing page email marketing inbound' },
        // Part 6
        { page: 'part6', icon: '6️⃣', tag: 'Partie 6', title: 'Partie 6 — Vente en santé', keywords: 'vente commerciale chu hôpital libéral mutuelle b2b cycle de vente prospection' },
        { page: 'part6', icon: '6️⃣', tag: 'Partie 6', title: 'Cycle de vente hospitalier (CHU/GHT)', keywords: 'chu ght appel offres marché public daf dsi comité éthique validation institutionnelle' },
        { page: 'part6', icon: '6️⃣', tag: 'Partie 6', title: 'Méthode MEDDIC en santé', keywords: 'meddic méthode commerciale metrics economic buyer decision champion pain' },
        { page: 'part6', icon: '6️⃣', tag: 'Partie 6', title: 'Pilote clinique et preuves', keywords: 'pilote clinique preuve étude données probantes validation terrain roi calcul' },
        { page: 'part6', icon: '6️⃣', tag: 'Partie 6', title: 'Objections fréquentes et scripts', keywords: 'objection réponse script not invented here budget délai concurrent données personnelles' },
        { page: 'part6', icon: '6️⃣', tag: 'Partie 6', title: 'Fidélisation et churn', keywords: 'fidélisation churn churning rétention onboarding qbr kol key opinion leader' },
        // Part 7
        { page: 'part7', icon: '7️⃣', tag: 'Partie 7', title: 'Partie 7 — Financement et croissance', keywords: 'financement croissance investisseurs scale scalabilité international expansion' },
        { page: 'part7', icon: '7️⃣', tag: 'Partie 7', title: 'Levée de fonds série A et B', keywords: 'levée fonds série a b investisseurs vc venture capital term sheet valorisation' },
        { page: 'part7', icon: '7️⃣', tag: 'Partie 7', title: 'Indicateurs et tableaux de bord', keywords: 'kpi indicateurs dashboard tableau de bord mrr arr ltv cac nps churn' },
        // Part 8
        { page: 'part8', icon: '8️⃣', tag: 'Partie 8', title: 'Partie 8 — Aspects légaux', keywords: 'légal juridique conformité réglementation droit santé contrats propriété intellectuelle' },
        { page: 'part8', icon: '8️⃣', tag: 'Partie 8', title: 'ANSM et dispositif médical', keywords: 'ansm dispositif médical dm marquage ce mdr 2017 745 qualification logiciel imdrf' },
        { page: 'part8', icon: '8️⃣', tag: 'Partie 8', title: 'RGPD et données de santé', keywords: 'rgpd données santé cnil hds hébergement agrément article 9 dpo pia aipd pseudonymisation' },
        { page: 'part8', icon: '8️⃣', tag: 'Partie 8', title: 'Propriété intellectuelle et brevets', keywords: 'brevet propriété intellectuelle pi logiciel secret commercial nda confidentialité inpi' },
        { page: 'part8', icon: '8️⃣', tag: 'Partie 8', title: 'Contrats et anti-cadeaux', keywords: 'contrat cgv cgu saas sous-traitance anti-cadeaux loi sunshine act conventions hospitalières' },
        { page: 'part8', icon: '8️⃣', tag: 'Partie 8', title: 'Éthique et déontologie médicale', keywords: 'éthique déontologie code médecin infirmier ordre professionnel conseil national' }
    ];

    function openSearch() {
        var modal = document.getElementById('searchModal');
        var input = document.getElementById('searchInput');
        modal.classList.add('active');
        setTimeout(function () { input.focus(); }, 50);
        renderSearchResults('');
    }

    function closeSearch() {
        var modal = document.getElementById('searchModal');
        modal.classList.remove('active');
        document.getElementById('searchInput').value = '';
    }

    function normalizeStr(str) {
        return str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9 ]/g, ' ');
    }

    function renderSearchResults(query) {
        var container = document.getElementById('searchResults');
        var q = normalizeStr(query.trim());

        if (!q) {
            container.innerHTML = '<p class="search-empty">Tapez votre recherche pour explorer le contenu…</p>';
            return;
        }

        var terms = q.split(/\s+/).filter(Boolean);
        var results = SEARCH_INDEX.filter(function (item) {
            var haystack = normalizeStr(item.title + ' ' + item.keywords + ' ' + item.tag);
            return terms.every(function (term) { return haystack.indexOf(term) !== -1; });
        });

        // Deduplicate by page+title
        var seen = {};
        results = results.filter(function (item) {
            var key = item.page + '|' + item.title;
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        });

        if (results.length === 0) {
            container.innerHTML = '<p class="search-empty">Aucun résultat pour "<strong>' + query.replace(/</g, '&lt;') + '</strong>"</p>';
            return;
        }

        var html = results.slice(0, 12).map(function (item) {
            return '<div class="search-result-item" data-page="' + item.page + '">' +
                '<div class="search-result-icon">' + item.icon + '</div>' +
                '<div class="search-result-content">' +
                '<span class="search-result-tag">' + item.tag + '</span>' +
                '<h4>' + item.title + '</h4>' +
                '</div></div>';
        }).join('');

        container.innerHTML = html + '<p class="search-hint">Appuyez sur Échap pour fermer • ' + results.length + ' résultat' + (results.length > 1 ? 's' : '') + '</p>';

        container.querySelectorAll('.search-result-item').forEach(function (el) {
            el.addEventListener('click', function () {
                showPage(el.dataset.page);
                closeSearch();
            });
        });
    }

    // ========================================
    // EVENT DELEGATION (remplace tous les onclick inline)
    // ========================================
    var actions = {
        toggleBookmark: toggleBookmark,
        openNotes: openNotes,
        closeNotes: closeNotes,
        saveNotes: saveNotes,
        scrollToTop: scrollToTop,
        toggleMobileMenu: toggleMobileMenu,
        openSearch: openSearch,
        closeSearch: closeSearch,
        comingSoon: function () {
            showToast('Fonctionnalité bientôt disponible');
        },
        toggleFaq: function (e) {
            var faqItem = e.closest('.faq-item');
            if (faqItem) {
                faqItem.classList.toggle('open');
            }
        }
    };

    document.addEventListener('click', function (e) {
        // Handle navigation via data-page
        var pageTarget = e.target.closest('[data-page]');
        if (pageTarget) {
            e.preventDefault();
            showPage(pageTarget.dataset.page);
            return;
        }

        // Handle actions via data-action
        var actionTarget = e.target.closest('[data-action]');
        if (actionTarget) {
            e.preventDefault();
            var actionName = actionTarget.dataset.action;
            if (actions[actionName]) {
                actions[actionName](actionTarget);
            }
        }
    });

    // Close modal on outside click
    document.getElementById('notesModal').addEventListener('click', function (e) {
        if (e.target.id === 'notesModal') {
            closeNotes();
        }
    });

    // Close search on outside click or Escape
    document.getElementById('searchModal').addEventListener('click', function (e) {
        if (e.target.id === 'searchModal') {
            closeSearch();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeSearch();
            closeNotes();
        }
        // Open search with Ctrl+K / Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
    });

    // Live search input listener (set up after DOM ready)
    document.addEventListener('DOMContentLoaded', function () {
        var searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                renderSearchResults(searchInput.value);
            });
        }
    });

    // ========================================
    // MEDIA SECTION FUNCTIONALITY
    // ========================================

    // Initialize media content from JSON data
    function initializeMedia() {
        var mediaDataElement = document.getElementById('mediaContentData');
        if (!mediaDataElement) return;

        try {
            var mediaData = JSON.parse(mediaDataElement.textContent);
            var mediaContent = mediaData.content || [];

            // Populate media grid
            populateMediaGrid(mediaContent);

            // Setup media modal handlers
            setupMediaModal();
        } catch (e) {
            console.error('Error loading media content:', e);
        }
    }

    // Populate media grid with cards from data
    function populateMediaGrid(content) {
        var mediaGrid = document.getElementById('mediaGrid');
        if (!mediaGrid) return;

        // Sort by order
        content.sort(function(a, b) {
            return (a.order || 0) - (b.order || 0);
        });

        // Clear existing content
        mediaGrid.innerHTML = '';

        // Create cards for each media item
        content.forEach(function(item, index) {
            var card = createMediaCard(item, index);
            mediaGrid.appendChild(card);
        });
    }

    // Create individual media card element
    function createMediaCard(item, index) {
        var card = document.createElement('div');
        card.className = 'media-card';

        // Determine badge color based on type
        var badgeClass = '';
        var badgeText = '';
        switch(item.type) {
            case 'podcast':
                badgeClass = 'podcast';
                badgeText = 'Podcast';
                break;
            case 'editorial':
                badgeClass = 'editorial';
                badgeText = 'Editorial';
                break;
            case 'video':
            default:
                badgeText = 'Vidéo';
                break;
        }

        // Get YouTube thumbnail if available
        var thumbnail = '';
        if (item.youtubeId) {
            thumbnail = 'https://img.youtube.com/vi/' + item.youtubeId + '/maxresdefault.jpg';
        }

        var html = '<div class="media-thumbnail">' +
                   (thumbnail ? '<img src="' + thumbnail + '" alt="' + escapeHtml(item.title) + '" />' :
                    '<div class="video-placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h3V9h4v3h3l-5 5z"/></svg></div>') +
                   '</div>' +
                   '<div class="media-content">' +
                   '<div class="media-badge' + (badgeClass ? ' ' + badgeClass : '') + '">' + badgeText + '</div>' +
                   '<h3>' + escapeHtml(item.title) + '</h3>' +
                   '<p>' + escapeHtml(item.description) + '</p>' +
                   '<a href="#" class="media-cta" data-media="' + index + '" data-type="' + item.type + '">Regarder</a>' +
                   '</div>';

        card.innerHTML = html;

        // Add click handler for CTA
        var cta = card.querySelector('.media-cta');
        if (cta) {
            cta.addEventListener('click', function(e) {
                e.preventDefault();
                openMediaModal(item);
            });
        }

        return card;
    }

    // Setup media modal event handlers
    function setupMediaModal() {
        var modal = document.getElementById('mediaModal');
        if (!modal) return;

        // Close button
        var closeBtn = modal.querySelector('.media-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeMediaModal();
            });
        }

        // Click overlay to close
        var overlay = modal.querySelector('.media-modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeMediaModal();
            });
        }

        // Keyboard escape to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                closeMediaModal();
            }
        });
    }

    // Open media modal and create embed
    function openMediaModal(item) {
        var modal = document.getElementById('mediaModal');
        if (!modal) return;

        var embedWrapper = document.getElementById('embedWrapper');
        if (!embedWrapper) return;

        // Clear previous embed
        embedWrapper.innerHTML = '';

        // Create appropriate embed based on type
        if (item.type === 'video' && item.youtubeId) {
            var iframe = document.createElement('iframe');
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('src', 'https://www.youtube.com/embed/' + item.youtubeId + '?autoplay=1');
            iframe.setAttribute('title', escapeHtml(item.title));
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'allowfullscreen');
            embedWrapper.appendChild(iframe);
        }
        // Add podcast or other embed types here as needed
        else if (item.type === 'podcast' && item.podcastUrl) {
            var podcastEmbed = document.createElement('iframe');
            podcastEmbed.setAttribute('src', item.podcastUrl);
            podcastEmbed.setAttribute('height', '152');
            podcastEmbed.setAttribute('width', '100%');
            podcastEmbed.setAttribute('frameborder', 'no');
            podcastEmbed.setAttribute('scrolling', 'no');
            embedWrapper.appendChild(podcastEmbed);
        }

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Close media modal
    function closeMediaModal() {
        var modal = document.getElementById('mediaModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Utility: Escape HTML for safe display
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    document.addEventListener('DOMContentLoaded', function () {
        // Initialize media section
        initializeMedia();

        // Restore last visited page
        var lastPage = Storage.getRaw('lastPage');
        if (lastPage && lastPage !== 'home') {
            showPage(lastPage);
        }

        checkBookmark();

        // Welcome toast (first visit)
        if (!Storage.getRaw('visited')) {
            Storage.setRaw('visited', 'true');
            setTimeout(function () {
                showToast('Bienvenue sur Entreprendre en santé !', 5000);
            }, 1000);
        }
    });

})();

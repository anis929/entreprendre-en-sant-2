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
        'aiAgents': 'aiAgents',
        'videos': 'videosPage',
        'ideaFinder': 'ideaFinderPage',
        'part1': 'part1Page',
        'part2': 'part2Page',
        'part3': 'part3Page',
        'part4': 'part4Page',
        'part5': 'part5Page',
        'part6': 'part6Page',
        'part7': 'part7Page',
        'part8': 'part8Page',
        'aiClarificateur': 'aiClarificateur',
        'aiGuide': 'aiGuide',
        'aiStratege': 'aiStratege',
        'aiArchitecte': 'aiArchitecte',
        'aiMarketing': 'aiMarketing',
        'aiCoach': 'aiCoach',
        'aiVigie': 'aiVigie'
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
        if (pageName === 'home' || pageName.indexOf('part') === 0) {
            navSelector = '[data-page="home"]';
        } else if (pageName === 'how') {
            navSelector = '[data-page="how"]';
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
    // EVENT DELEGATION (remplace tous les onclick inline)
    // ========================================
    var actions = {
        toggleBookmark: toggleBookmark,
        openNotes: openNotes,
        closeNotes: closeNotes,
        saveNotes: saveNotes,
        scrollToTop: scrollToTop,
        toggleMobileMenu: toggleMobileMenu,
        comingSoon: function () {
            showToast('Fonctionnalité bientôt disponible');
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
                actions[actionName]();
            }
        }
    });

    // Close modal on outside click
    document.getElementById('notesModal').addEventListener('click', function (e) {
        if (e.target.id === 'notesModal') {
            closeNotes();
        }
    });

    // ========================================
    // INITIALIZATION
    // ========================================
    document.addEventListener('DOMContentLoaded', function () {
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

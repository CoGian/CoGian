(function () {
    'use strict';

    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });

        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });
    }

    var fadeEls = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window && fadeEls.length > 0) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        fadeEls.forEach(function (el) { observer.observe(el); });
    } else if (fadeEls.length > 0) {
        fadeEls.forEach(function (el) { el.classList.add('visible'); });
    }

    var nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
            } else {
                nav.style.boxShadow = 'none';
            }
        }, { passive: true });
    }
})();

// Mininio: Carb & Insulin Calc - GitHub Pages
// Smooth scroll, mobile nav, fade-in animations, changelog interactions

(function () {
    'use strict';

    // ---- Mobile Navigation Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });

        // Close nav when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
            });
        });

        // Close nav when clicking outside
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }

    // ---- Fade-in on Scroll (Intersection Observer) ----
    var fadeEls = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window && fadeEls.length > 0) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        fadeEls.forEach(function (el) { observer.observe(el); });
    } else if (fadeEls.length > 0) {
        // Fallback: show all elements immediately
        fadeEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // ---- Changelog Show More / Show Less ----
    var changelogContainer = document.getElementById('changelogContainer');
    if (changelogContainer) {
        var entries = changelogContainer.querySelectorAll('.changelog-entry');
        var INITIAL_SHOW = 5;

        if (entries.length > INITIAL_SHOW) {
            // Hide entries beyond initial count
            for (var i = INITIAL_SHOW; i < entries.length; i++) {
                entries[i].style.display = 'none';
            }

            // Create toggle wrapper
            var toggleWrapper = document.createElement('div');
            toggleWrapper.className = 'changelog-skip';

            var toggleLink = document.createElement('a');
            toggleLink.href = '#';
            toggleLink.textContent = 'Show all ' + entries.length + ' releases';
            toggleWrapper.appendChild(toggleLink);
            changelogContainer.appendChild(toggleWrapper);

            var expanded = false;

            toggleLink.addEventListener('click', function (e) {
                e.preventDefault();
                expanded = !expanded;

                for (var j = INITIAL_SHOW; j < entries.length; j++) {
                    entries[j].style.display = expanded ? '' : 'none';
                }

                toggleLink.textContent = expanded
                    ? 'Show less'
                    : 'Show all ' + entries.length + ' releases';

                // Smooth scroll to the newly shown first entry
                if (expanded) {
                    setTimeout(function () {
                        entries[INITIAL_SHOW].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
        }
    }

    // ---- Nav bar shadow on scroll ----
    var nav = document.getElementById('nav');
    if (nav) {
        var scrollHandler = function () {
            if (window.scrollY > 10) {
                nav.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
            } else {
                nav.style.boxShadow = 'none';
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

})();

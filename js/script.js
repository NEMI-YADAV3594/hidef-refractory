(function() {
    'use strict';

    // ===== Navbar Scroll =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ===== Mobile Menu =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', function() {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // ===== Active Nav Link =====
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 130;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(function(anchor) {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === '#' + current) {
                anchor.classList.add('active');
            }
        });
    }, { passive: true });

    // ===== FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            faqItems.forEach(function(el) {
                el.classList.remove('active');
                el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.counter');
    const statsContainer = document.getElementById('statsContainer');
    let animationFrame = null;
    let currentCounts = {};

    counters.forEach(function(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        currentCounts[counter] = 0;
    });

    function animateCounters() {
        counters.forEach(function(counter) {
            counter.textContent = '0';
            currentCounts[counter] = 0;
        });

        const duration = 1800;
        const startTime = performance.now();

        function updateCounters(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            counters.forEach(function(counter) {
                const target = parseInt(counter.getAttribute('data-target'));
                const currentVal = Math.round(eased * target);
                counter.textContent = currentVal;
                currentCounts[counter] = currentVal;
            });

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateCounters);
            } else {
                counters.forEach(function(counter) {
                    const target = parseInt(counter.getAttribute('data-target'));
                    counter.textContent = target;
                    currentCounts[counter] = target;
                });
                animationFrame = null;
            }
        }

        animationFrame = requestAnimationFrame(updateCounters);
    }

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = null;
                }
                counters.forEach(function(counter) {
                    counter.textContent = '0';
                    currentCounts[counter] = 0;
                });
                animateCounters();
            } else {
                counters.forEach(function(counter) {
                    counter.textContent = '0';
                    currentCounts[counter] = 0;
                });
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = null;
                }
            }
        });
    }, { threshold: 0.2 });

    observer.observe(statsContainer);

    window.addEventListener('load', function() {
        const rect = statsContainer.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
            counters.forEach(function(counter) {
                counter.textContent = '0';
                currentCounts[counter] = 0;
            });
            animateCounters();
        }
    });

    // ===== Modal System =====
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const modalCloses = document.querySelectorAll('.modal-close');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function closeAllModals() {
        modalOverlays.forEach(function(overlay) {
            overlay.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    modalTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    modalCloses.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    modalOverlays.forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    const modalActionLinks = document.querySelectorAll('.modal-action-link');
    modalActionLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // ===== Contact Form =====
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !email) {
            alert('Please fill in your name and email.');
            return;
        }

        const waMsg = encodeURIComponent(
            'Hi HiDef Refractory,\n\n' +
            'Name: ' + name + '\n' +
            'Email: ' + email + '\n' +
            'Phone: ' + (phone || 'N/A') + '\n' +
            'Service: ' + (service || 'N/A') + '\n' +
            'Message: ' + (message || 'N/A')
        );

        window.open('https://wa.me/917073964398?text=' + waMsg, '_blank');
        alert('Your message has been prepared. You will be redirected to WhatsApp to send it.');
        contactForm.reset();
    });

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

})();
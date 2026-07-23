document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // MOBILE NAV / HAMBURGER MENU
    // ==========================================================================
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Burger Animation
            burger.classList.toggle('burger-toggle');
        });

        // Close menu on link click (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('burger-toggle');
            });
        });
    }

    // ==========================================================================
    // PRECISION SCROLL SNAPPING (DESKTOP ONLY) & ACTIVE LINK HIGHLIGHTER
    // ==========================================================================
    const snapContainer = document.querySelector('.snap-container');
    const snapSections = document.querySelectorAll('.snap-section');
    const menuLinks = document.querySelectorAll('.nav-links a');

    if (snapContainer && snapSections.length > 0) {
        let currentSectionIndex = 0;
        let isMoving = false;

        const isDesktop = () => window.innerWidth > 900;

        // Function to update active link in navbar
        const updateActiveLink = (id) => {
            menuLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}` || link.getAttribute('href').endsWith(`#${id}`)) {
                    link.classList.add('active');
                }
            });
        };

        // Function to scroll to a specific index on desktop
        const scrollToSection = (index) => {
            if (index < 0 || index >= snapSections.length) return;
            isMoving = true;
            currentSectionIndex = index;

            const targetSection = snapSections[index];
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update Active Link
            const id = targetSection.getAttribute('id');
            updateActiveLink(id);

            // Lock scrolling for 850ms to allow animation to complete
            setTimeout(() => {
                isMoving = false;
            }, 850);
        };

        // Intercept wheel scroll events ONLY on desktop
        snapContainer.addEventListener('wheel', (e) => {
            if (!isDesktop()) return; // Allow natural scroll on mobile

            e.preventDefault(); // Prevent native browser scroll jitter on desktop
            if (isMoving) return;

            if (e.deltaY > 0) {
                if (currentSectionIndex < snapSections.length - 1) {
                    scrollToSection(currentSectionIndex + 1);
                }
            } else if (e.deltaY < 0) {
                if (currentSectionIndex > 0) {
                    scrollToSection(currentSectionIndex - 1);
                }
            }
        }, { passive: false });

        // Sync anchor links clicks with navigation (works for desktop & mobile)
        menuLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        if (isDesktop()) {
                            const targetIndex = Array.from(snapSections).indexOf(targetSection);
                            if (targetIndex !== -1) {
                                scrollToSection(targetIndex);
                            }
                        } else {
                            targetSection.scrollIntoView({ behavior: 'smooth' });
                            updateActiveLink(targetId);
                        }
                    }
                }
            });
        });

        // Highlight active navigation links on mobile scrolling using IntersectionObserver
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -50% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            if (isDesktop()) return; // On desktop, scrollToSection updates active link
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    updateActiveLink(id);
                }
            });
        }, observerOptions);

        snapSections.forEach(section => observer.observe(section));
    }

    // ==========================================================================
    // PROJECTS GALLERY FILTER
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        const categories = card.getAttribute('data-category').split(' ');
                        if (categories.includes(filterValue)) {
                            card.style.display = 'block';
                            card.style.animation = 'fadeIn 0.4s ease forwards';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }

    // ==========================================================================
    // CONTACT FORM INTERACTIVE SUBMIT
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'ENVIANDO...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '¡MENSAJE ENVIADO!';
                btn.style.borderColor = 'var(--accent-green)';
                btn.style.backgroundColor = 'var(--accent-green)';
                btn.style.color = 'var(--bg-black)';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.borderColor = 'var(--accent-green)';
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = 'var(--text-white)';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});

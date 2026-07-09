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
    // JS-BASED PRECISSIVE SCROLL SNAPPING & ACTIVE LINK HIGHLIGHTER
    // ==========================================================================
    const snapContainer = document.querySelector('.snap-container');
    const snapSections = document.querySelectorAll('.snap-section');
    const menuLinks = document.querySelectorAll('.nav-links a');

    if (snapContainer && snapSections.length > 0) {
        let currentSectionIndex = 0;
        let isMoving = false;

        // Function to scroll to a specific index and sync active links
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
            menuLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}` || link.getAttribute('href').endsWith(`#${id}`)) {
                    link.classList.add('active');
                }
            });

            // Lock scrolling for 850ms to allow animation to complete
            setTimeout(() => {
                isMoving = false;
            }, 850);
        };

        // Intercept wheel scroll events
        snapContainer.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent native browser scroll jitter
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

        // Touch swipe support for mobile
        let touchStartY = 0;
        snapContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        snapContainer.addEventListener('touchmove', (e) => {
            if (isMoving) {
                e.preventDefault();
                return;
            }

            const touchEndY = e.touches[0].clientY;
            const difference = touchStartY - touchEndY;

            if (Math.abs(difference) > 60) { // swipe threshold
                if (difference > 0) {
                    if (currentSectionIndex < snapSections.length - 1) {
                        e.preventDefault();
                        scrollToSection(currentSectionIndex + 1);
                    }
                } else {
                    if (currentSectionIndex > 0) {
                        e.preventDefault();
                        scrollToSection(currentSectionIndex - 1);
                    }
                }
            }
        }, { passive: false });

        // Sync anchor links clicks with JS snap engine
        menuLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    const targetIndex = Array.from(snapSections).indexOf(targetSection);
                    if (targetIndex !== -1) {
                        scrollToSection(targetIndex);
                    }
                }
            });
        });
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

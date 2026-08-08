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

    // ==========================================================================
    // PDF & MEDIA LIGHTBOX VIEWER SYSTEM
    // ==========================================================================
    // Configure PDF.js worker if PDF.js library is loaded
    if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // Inject Lightbox HTML Structure dynamically if not present
    function ensureLightboxDOM() {
        if (document.querySelector('.pdf-modal-overlay')) return;

        const lightboxHTML = `
        <div class="pdf-modal-overlay" id="pdfLightbox">
            <div class="pdf-modal-wrapper">
                <div class="pdf-viewport-container">
                    <div class="pdf-scroll-area" id="pdfScrollArea">
                        <div class="pdf-canvas-wrapper" id="pdfCanvasWrapper"></div>
                    </div>
                </div>
                <div class="pdf-toolbar-panel">
                    <div class="pdf-toolbar-group">
                        <button class="pdf-btn" id="pdfZoomBtn" title="Zoom"><i class="fa-solid fa-magnifying-glass"></i></button>
                        <button class="pdf-btn" id="pdfPrevBtn" title="Página Anterior"><i class="fa-solid fa-chevron-up"></i></button>
                        <span class="pdf-page-num" id="pdfPageNum">1 / 1</span>
                        <button class="pdf-btn" id="pdfNextBtn" title="Página Siguiente"><i class="fa-solid fa-chevron-down"></i></button>
                        
                        <!-- Zoom Popover -->
                        <div class="pdf-zoom-popover" id="pdfZoomPopover">
                            <div class="pdf-zoom-title">
                                <span>ZOOM</span>
                                <span class="pdf-zoom-val" id="pdfZoomVal">100%</span>
                            </div>
                            <input type="range" min="100" max="300" step="10" value="100" class="pdf-zoom-slider" id="pdfZoomSlider">
                        </div>
                    </div>

                    <div class="pdf-toolbar-group">
                        <button class="pdf-btn" id="pdfShareBtn" title="Compartir"><i class="fa-solid fa-share-nodes"></i></button>
                        <button class="pdf-btn" id="pdfCloseBtn" title="Cerrar"><i class="fa-solid fa-xmark"></i></button>

                        <!-- Share Popover -->
                        <div class="pdf-share-popover" id="pdfSharePopover">
                            <a href="#" class="pdf-share-item wa" id="shareWA" target="_blank" title="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                            <a href="#" class="pdf-share-item tw" id="shareTW" target="_blank" title="X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>
                            <a href="#" class="pdf-share-item fb" id="shareFB" target="_blank" title="Facebook"><i class="fa-brands fa-facebook"></i></a>
                            <a href="#" class="pdf-share-item ig" id="shareIG" title="Instagram (Copiar Enlace)"><i class="fa-brands fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    ensureLightboxDOM();

    // DOM Elements
    const lightbox = document.getElementById('pdfLightbox');
    const scrollArea = document.getElementById('pdfScrollArea');
    const canvasWrapper = document.getElementById('pdfCanvasWrapper');
    const zoomBtn = document.getElementById('pdfZoomBtn');
    const zoomPopover = document.getElementById('pdfZoomPopover');
    const zoomSlider = document.getElementById('pdfZoomSlider');
    const zoomVal = document.getElementById('pdfZoomVal');
    const prevBtn = document.getElementById('pdfPrevBtn');
    const nextBtn = document.getElementById('pdfNextBtn');
    const pageNumSpan = document.getElementById('pdfPageNum');
    const shareBtn = document.getElementById('pdfShareBtn');
    const sharePopover = document.getElementById('pdfSharePopover');
    const closeBtn = document.getElementById('pdfCloseBtn');

    let currentPdfDoc = null;
    let totalPages = 1;
    let currentPage = 1;
    let currentZoom = 100;
    let pageObserver = null;
    let mediaUrl = '';
    let mediaTitle = '';

    // Drag / Pan state
    let isDragging = false;
    let startX = 0, startY = 0;
    let scrollLeftStart = 0, scrollTopStart = 0;

    // Open Viewer Function
    async function openMediaViewer(url, title = 'Arte / Documento', fileType = '') {
        ensureLightboxDOM();
        mediaUrl = url;
        mediaTitle = title;
        canvasWrapper.innerHTML = '<div style="color:var(--text-muted); font-size:1.1rem;"><i class="fa-solid fa-spinner fa-spin"></i> Cargando contenido...</div>';
        
        // Reset state
        currentZoom = 100;
        zoomSlider.value = 100;
        zoomVal.textContent = '100%';
        canvasWrapper.style.transform = 'scale(1)';
        scrollArea.classList.remove('zoomed-mode');
        zoomPopover.classList.remove('active');
        sharePopover.classList.remove('active');
        zoomBtn.classList.remove('active');
        shareBtn.classList.remove('active');
        prevBtn.disabled = false;
        nextBtn.disabled = false;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Check if PDF or Image — supports blob: URLs via data-type hint
        const isPdf = fileType === 'pdf' || url.toLowerCase().endsWith('.pdf') || url.includes('data:application/pdf');

        if (isPdf && window.pdfjsLib) {
            try {
                const loadingTask = window.pdfjsLib.getDocument(url);
                currentPdfDoc = await loadingTask.promise;
                totalPages = currentPdfDoc.numPages;
                currentPage = 1;
                updatePageCounter();

                canvasWrapper.innerHTML = '';
                
                // Render pages vertically
                for (let i = 1; i <= totalPages; i++) {
                    const page = await currentPdfDoc.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });

                    const canvas = document.createElement('canvas');
                    canvas.dataset.pageNumber = i;
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    await page.render(renderContext).promise;

                    const pageContainer = document.createElement('div');
                    pageContainer.className = 'pdf-page-container';
                    pageContainer.appendChild(canvas);
                    
                    canvasWrapper.appendChild(pageContainer);
                }

                setupIntersectionObserver();
                updateNavButtons();
            } catch (err) {
                console.error("Error loading PDF:", err);
                canvasWrapper.innerHTML = `<div style="color:var(--accent-orange); font-size:1.1rem; text-align:center;"><i class="fa-solid fa-triangle-exclamation"></i> No se pudo cargar el archivo PDF.<br><small style="color:var(--text-muted);">${err.message || ''}</small></div>`;
            }
        } else {
            // Render Image
            currentPdfDoc = null;
            totalPages = 1;
            currentPage = 1;
            updatePageCounter();
            prevBtn.disabled = true;
            nextBtn.disabled = true;

            const img = document.createElement('img');
            img.src = url;
            img.alt = title;
            img.onload = () => {
                canvasWrapper.innerHTML = '';
                const pageContainer = document.createElement('div');
                pageContainer.className = 'pdf-page-container';
                pageContainer.appendChild(img);
                canvasWrapper.appendChild(pageContainer);
            };
            img.onerror = () => {
                canvasWrapper.innerHTML = `<div style="color:var(--accent-orange); font-size:1.1rem;"><i class="fa-solid fa-triangle-exclamation"></i> Error al cargar la imagen.</div>`;
            };
        }

        updateShareLinks();
    }

    // Close Viewer Function
    function closeMediaViewer() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        zoomPopover.classList.remove('active');
        sharePopover.classList.remove('active');
        zoomBtn.classList.remove('active');
        shareBtn.classList.remove('active');
        if (pageObserver) pageObserver.disconnect();
    }

    // Page Counter update
    function updatePageCounter() {
        pageNumSpan.textContent = `${currentPage} / ${totalPages}`;
    }

    // Button states
    function updateNavButtons() {
        if (currentZoom > 100) {
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        } else {
            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages;
        }
    }

    // IntersectionObserver for tracking page in scroll
    function setupIntersectionObserver() {
        if (pageObserver) pageObserver.disconnect();

        const canvases = canvasWrapper.querySelectorAll('canvas');
        if (canvases.length === 0) return;

        pageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    currentPage = parseInt(entry.target.dataset.pageNumber);
                    updatePageCounter();
                    updateNavButtons();
                }
            });
        }, {
            root: scrollArea,
            threshold: 0.5
        });

        canvases.forEach(canvas => pageObserver.observe(canvas));
    }

    // Event Delegation for View Media Buttons across the site
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.view-media-btn');
        if (btn) {
            e.preventDefault();
            const src = btn.getAttribute('href') || btn.getAttribute('data-src');
            const title = btn.getAttribute('data-title') || 'Arte / Documento';
            const fileType = btn.getAttribute('data-type') || ''; // 'pdf' or 'image'
            if (src) {
                openMediaViewer(src, title, fileType);
            }
        }
    });

    // Zoom Toggle Button
    if (zoomBtn) {
        zoomBtn.addEventListener('click', () => {
            zoomPopover.classList.toggle('active');
            zoomBtn.classList.toggle('active');
            sharePopover.classList.remove('active');
            shareBtn.classList.remove('active');
        });
    }

    // Share Toggle Button
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            sharePopover.classList.toggle('active');
            shareBtn.classList.toggle('active');
            zoomPopover.classList.remove('active');
            zoomBtn.classList.remove('active');
        });
    }

    // Close Button & Overlay click
    if (closeBtn) closeBtn.addEventListener('click', closeMediaViewer);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeMediaViewer();
        });
    }

    // Zoom Slider Control
    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            currentZoom = parseInt(e.target.value);
            zoomVal.textContent = `${currentZoom}%`;
            canvasWrapper.style.transform = `scale(${currentZoom / 100})`;

            if (currentZoom > 100) {
                scrollArea.classList.add('zoomed-mode');
                prevBtn.disabled = true;
                nextBtn.disabled = true;
            } else {
                scrollArea.classList.remove('zoomed-mode');
                updateNavButtons();
            }
        });
    }

    // Previous Page Button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentZoom > 100 || currentPage <= 1) return;
            const targetCanvas = canvasWrapper.querySelector(`canvas[data-page-number="${currentPage - 1}"]`);
            if (targetCanvas) {
                targetCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Next Page Button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentZoom > 100 || currentPage >= totalPages) return;
            const targetCanvas = canvasWrapper.querySelector(`canvas[data-page-number="${currentPage + 1}"]`);
            if (targetCanvas) {
                targetCanvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Pan / Hand Drag Logic when Zoom > 100%
    if (scrollArea) {
        scrollArea.addEventListener('mousedown', (e) => {
            if (currentZoom <= 100) return;
            isDragging = true;
            scrollArea.classList.add('grabbing');
            startX = e.pageX - scrollArea.offsetLeft;
            startY = e.pageY - scrollArea.offsetTop;
            scrollLeftStart = scrollArea.scrollLeft;
            scrollTopStart = scrollArea.scrollTop;
        });

        scrollArea.addEventListener('mouseleave', () => {
            isDragging = false;
            scrollArea.classList.remove('grabbing');
        });

        scrollArea.addEventListener('mouseup', () => {
            isDragging = false;
            scrollArea.classList.remove('grabbing');
        });

        scrollArea.addEventListener('mousemove', (e) => {
            if (!isDragging || currentZoom <= 100) return;
            e.preventDefault();
            const x = e.pageX - scrollArea.offsetLeft;
            const y = e.pageY - scrollArea.offsetTop;
            const walkX = (x - startX) * 1.5;
            const walkY = (y - startY) * 1.5;
            scrollArea.scrollLeft = scrollLeftStart - walkX;
            scrollArea.scrollTop = scrollTopStart - walkY;
        });
    }

    // Update Social Share Links
    function updateShareLinks() {
        const fullUrl = window.location.origin + window.location.pathname;
        const text = `Mira esta increíble obra: "${mediaTitle}" en el Portafolio de Jhonsons González`;
        
        const shareWA = document.getElementById('shareWA');
        const shareTW = document.getElementById('shareTW');
        const shareFB = document.getElementById('shareFB');
        const shareIG = document.getElementById('shareIG');

        if (shareWA) shareWA.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + fullUrl)}`;
        if (shareTW) shareTW.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`;
        if (shareFB) shareFB.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        
        if (shareIG) {
            shareIG.onclick = (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(fullUrl).then(() => {
                    alert('¡Enlace copiado al portapapeles! Puedes pegarlo en Instagram.');
                });
            };
        }
    }
});


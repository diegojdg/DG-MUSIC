        document.addEventListener("DOMContentLoaded", () => {

            // 1. Initial State for Entry Sequence
            gsap.set(".gsap-in", { autoAlpha: 0 }); // Prevents Flash of Unstyled Content

            // Entry Sequence Definitions
            const elements = document.querySelectorAll('.gsap-in');
            elements.forEach(el => {
                const type = el.getAttribute('data-gsap');
                const delay = parseFloat(el.getAttribute('data-gsap-delay') || '0');

                if (type === 'fadeUp') {
                    gsap.fromTo(el,
                        { y: 30, autoAlpha: 0, filter: "blur(8px)" },
                        { y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.2, delay: delay, ease: "power3.out" }
                    );
                } else if (type === 'scaleUp') {
                    gsap.fromTo(el,
                        { scale: 0.8, autoAlpha: 0, y: 50, rotation: 0 },
                        { scale: 1, autoAlpha: 1, y: 0, duration: 1.5, delay: delay, ease: "back.out(1.2)" }
                    );
                } else if (type === 'fadeDown') {
                    gsap.fromTo(el,
                        { y: -30, autoAlpha: 0 },
                        { y: 0, autoAlpha: 1, duration: 1, delay: delay, ease: "power2.out" }
                    );
                } else if (type === 'fadeLeft') {
                    gsap.fromTo(el,
                        { x: 30, autoAlpha: 0 },
                        { x: 0, autoAlpha: 1, duration: 1.2, delay: delay, ease: "power2.out" }
                    );
                }
            });

            // 2. Continuous Fluid Aurora Borealis Emulation
            // Using pure GSAP transforms onto blurred DOM elements replaces Three.js 
            // entirely, keeping payload negligible while maintaining a perfect premium atmospheric effect.
            gsap.to("#aurora-blob1", {
                x: "15vw", y: "10vh", rotation: 20, scale: 1.2,
                duration: 18, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
            gsap.to("#aurora-blob2", {
                x: "-20vw", y: "-15vh", rotation: -15, scale: 1.1,
                duration: 22, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
            gsap.to("#aurora-blob3", {
                x: "10vw", y: "-15vh", rotation: 10, scale: 1.3,
                duration: 26, repeat: -1, yoyo: true, ease: "sine.inOut"
            });

            // 3. Immersive Mouse Parallax effect
            const heroWrapper = document.querySelector('.hero-wrapper');
            const layers1 = document.querySelectorAll(".parallax-layer-1");
            const layers2 = document.querySelectorAll(".parallax-layer-2");
            const layers3 = document.querySelectorAll(".parallax-layer-3");
            const textWrapper = document.querySelector(".hero-text-wrapper");

            if (window.innerWidth > 768) { // Only animate heavily on desktop
                heroWrapper.addEventListener("mousemove", (e) => {
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;

                    // Map coordinates closely to -1 -> 1 range
                    const posX = (e.clientX - centerX) / centerX;
                    const posY = (e.clientY - centerY) / centerY;

                    // Subtle translation shifts per visual depth layer
                    gsap.to(layers1, { x: posX * 30, y: posY * 30, rotationX: posY * -4, rotationY: posX * 4, duration: 1.5, ease: "power2.out" });
                    gsap.to(layers2, { x: posX * 15, y: posY * 15, rotationX: posY * -2, rotationY: posX * 2, duration: 1.5, ease: "power2.out" });
                    gsap.to(layers3, { x: posX * 45, y: posY * 45, rotationX: posY * -6, rotationY: posX * 6, duration: 1.5, ease: "power2.out" });

                    // Counter-shift text for added dimensional feeling
                    gsap.to(textWrapper, { x: posX * -15, y: posY * -15, duration: 1.8, ease: "power2.out" });
                });

                heroWrapper.addEventListener("mouseleave", () => {
                    const combined = Array.from(layers1).concat(Array.from(layers2), Array.from(layers3), [textWrapper]);
                    gsap.to(combined, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 1.5, ease: "power2.out" });
                });
            }



            // 4. Modal Interactions for Motion Gallery
            const videoModal = document.getElementById('video-modal');
            const modalVideo = document.getElementById('modal-video-element');
            const modalSrc = document.getElementById('modal-video-source');
            const modalTitle = document.getElementById('modal-title');
            const modalCategory = document.getElementById('modal-category');
            const modalCloseBtn = document.getElementById('modal-close-btn');

            const modalIframe = document.getElementById('modal-iframe-element');

            const motionTriggers = document.querySelectorAll('#motion-gallery .group button, #motion-gallery .group img, #motion-gallery .group .absolute.inset-0');
            motionTriggers.forEach(el => {
                if (el.tagName === 'BUTTON' && el.textContent.trim() !== "View") return;
                
                el.style.cursor = 'pointer';
                el.addEventListener('click', (e) => {
                    const card = e.target.closest('.group');
                    if (!card) return;

                        const iframeEl = card.querySelector('iframe.lazy-iframe');
                        const videoSource = card.querySelector('video source');
                        const title = card.querySelector('h3').textContent;
                        const category = card.querySelector('p').textContent;

                        if (iframeEl) {
                            // Vimeo card → show iframe, hide video
                            modalVideo.classList.add('hidden');
                            modalVideo.pause();
                            modalSrc.src = '';
                            if (modalIframe) {
                                modalIframe.classList.remove('hidden');
                                modalIframe.src = iframeEl.getAttribute('data-modal-src') || '';
                            }
                        } else if (videoSource) {
                            // Local video card → show video element, hide iframe
                            if (modalIframe) { modalIframe.classList.add('hidden'); modalIframe.src = ''; }
                            modalVideo.classList.remove('hidden');
                            modalSrc.src = videoSource.getAttribute('src') || videoSource.getAttribute('data-src') || '';
                            modalVideo.load();
                        }

                        modalTitle.textContent = title;
                        modalCategory.textContent = category;

                        // Animate modal in
                        videoModal.classList.remove('hidden');
                        videoModal.classList.add('flex');

                        setTimeout(() => {
                            videoModal.classList.remove('opacity-0');
                            document.getElementById('modal-content-wrapper').classList.remove('scale-95');
                            if (!iframeEl) modalVideo.play().catch(e => console.log('Autoplay prevented', e));
                        }, 50);

                        // Disable body scroll
                        document.body.style.overflow = 'hidden';
                    });
            });

            if (modalCloseBtn) {
                const closeModal = () => {
                    videoModal.classList.add('opacity-0');
                    document.getElementById('modal-content-wrapper').classList.add('scale-95');

                    // Re-enable body scroll
                    document.body.style.overflow = '';

                    setTimeout(() => {
                        videoModal.classList.add('hidden');
                        videoModal.classList.remove('flex');
                        modalVideo.pause();
                        modalSrc.src = "";
                        modalVideo.load();
                        if (modalIframe) { modalIframe.src = ""; modalIframe.classList.add('hidden'); }
                        modalVideo.classList.add('hidden');
                    }, 500);
                };

                modalCloseBtn.addEventListener('click', closeModal);

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
                        closeModal();
                    }
                });
            }

            // 5. Intelligent Lazy Loading for Vimeo Iframes
            // Keeps the initial payload light and only loads the vimeo player
            // when the gallery section intersects the viewport
            if ('IntersectionObserver' in window) {
                const iframeObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const iframe = entry.target;
                            const srcToLoad = iframe.getAttribute('data-src');
                            if (srcToLoad && !iframe.getAttribute('src')) {
                                iframe.setAttribute('src', srcToLoad);
                            }
                            observer.unobserve(iframe); // Stop observing once loaded
                        }
                    });
                }, { rootMargin: "0px 0px 400px 0px" }); // start loading early before it's on screen
                
                document.querySelectorAll('iframe.lazy-iframe').forEach(iframe => {
                    iframeObserver.observe(iframe);
                });
            } else {
                // Fallback for older browsers
                document.querySelectorAll('iframe.lazy-iframe').forEach(iframe => {
                    const srcToLoad = iframe.getAttribute('data-src');
                    if (srcToLoad) iframe.setAttribute('src', srcToLoad);
                });
            }

            // 6. Language Translation Logic
            const i18nDict = {
                pt: {
                    logoText: 'DIEGO JAQUES <span class="text-neutral-600 font-light group-hover:text-white/50 transition-colors">// DSGN</span>',
                    navFlyers: 'Flyers',
                    navVisual: 'Visual Experience',
                    navCover: 'Cover Art',
                    navAbout: 'Quem Sou eu',
                    heroPre: 'ART + MOTION + VIDEO',
                    heroTitle1: 'PORTFÓLIO',
                    heroTitle2: 'ONLINE',
                    heroDesc: 'A música gera emoções, o visual cria memórias.',
                    heroBtnExplore: 'Explore Portfolio',
                    heroBtnQuote: 'Orçamento',
                    motionPre: 'VISUAL EXPERIENCES',
                    motionTitle: 'MOTION <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/50">VIDEOS</span>',
                    flyersPre: 'FLYERS',
                    flyersTitle: 'EVENTOS E <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/50">ARTISTAS</span>',
                    aboutPre: 'QUEM SOU EU',
                    aboutTitle: 'Designer gráfico, Motion designer<br/>e <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/70 font-medium">Editor de Vídeo</span>',
                    aboutP1: 'Transformo ideias em experiências visuais para música, eventos e artistas que querem se destacar.',
                    aboutP2: 'Antes do design, eu vivi esse mercado. Fui DJ por mais de 15 anos — do open format à produção musical — entendendo na prática o universo dos eventos, a importância dos bastidores e o nível de dedicação que tudo isso exige.',
                    aboutP3: 'O visual sempre fez parte dessa jornada. Desde cedo, eu já criava capas, flyers e vídeos como forma de expressar minha identidade além da música. Com a pandemia e o nascimento do meu filho, decidi focar totalmente no design e no audiovisual.',
                    aboutP4: 'Hoje, uno essa vivência para dar vida a projetos únicos.',
                    aboutTag1: 'EXPERIÊNCIA VISUAL',
                    aboutTag2: 'IDENTIDADE DE ARTISTAS',
                    aboutBtnCreate: 'Vamos criar algo?',
                    statProjects: 'PROJETOS',
                    statClients: 'CLIENTES',
                    statYears: 'ANOS DE EXPERIÊNCIA'
                },
                en: {
                    logoText: 'DIEGO JAQUES <span class="text-neutral-600 font-light group-hover:text-white/50 transition-colors">// DSGN</span>',
                    navFlyers: 'Flyers',
                    navVisual: 'Visual Experience',
                    navCover: 'Cover Art',
                    navAbout: 'About me',
                    heroPre: 'ART + MOTION + VIDEO',
                    heroTitle1: 'ONLINE',
                    heroTitle2: 'PORTFOLIO',
                    heroDesc: 'Music creates emotions, visuals create memories.',
                    heroBtnExplore: 'Explore Portfolio',
                    heroBtnQuote: 'Quote',
                    motionPre: 'VISUAL EXPERIENCES',
                    motionTitle: 'MOTION <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/50">VIDEOS</span>',
                    flyersPre: 'FLYERS',
                    flyersTitle: 'EVENTS & <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/50">ARTISTS</span>',
                    aboutPre: 'ABOUT ME',
                    aboutTitle: 'Graphic designer, Motion designer<br/>& <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/70 font-medium">Video Editor</span>',
                    aboutP1: 'I transform ideas into visual experiences for music, events, and artists who want to stand out.',
                    aboutP2: 'Before design, I lived in this market. I was a DJ for over 15 years — from open format to music production — understanding in practice the event universe, the importance of backstage, and the level of dedication it requires.',
                    aboutP3: 'Visuals have always been part of this journey. Early on, I was already creating covers, flyers, and videos to express my identity beyond music. During the pandemic and with the birth of my son, I decided to fully focus on design and audiovisuals.',
                    aboutP4: 'Today, I combine this experience to bring unique projects to life.',
                    aboutTag1: 'VISUAL EXPERIENCE',
                    aboutTag2: 'ARTIST IDENTITY',
                    aboutBtnCreate: 'Let\'s create something?',
                    statProjects: 'PROJECTS',
                    statClients: 'CLIENTS',
                    statYears: 'YEARS OF EXPERIENCE'
                },
                es: {
                    logoText: 'DIEGO JAQUES <span class="text-neutral-600 font-light group-hover:text-white/50 transition-colors">// DSGN</span>',
                    navFlyers: 'Flyers',
                    navVisual: 'Experiencia Visual',
                    navCover: 'Cover Art',
                    navAbout: 'Sobre mi',
                    heroPre: 'ARTE + MOTION + VIDEO',
                    heroTitle1: 'PORTAFOLIO',
                    heroTitle2: 'EN LÍNEA',
                    heroDesc: 'La música genera emociones, lo visual crea recuerdos.',
                    heroBtnExplore: 'Explorar Portafolio',
                    heroBtnQuote: 'Presupuesto',
                    motionPre: 'EXPERIENCIAS VISUALES',
                    motionTitle: 'VIDEOS <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/50">MOTION</span>',
                    flyersPre: 'FLYERS',
                    flyersTitle: 'EVENTOS Y <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/50">ARTISTAS</span>',
                    aboutPre: 'SOBRE MÍ',
                    aboutTitle: 'Diseñador gráfico, Motion designer<br/>y <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/70 font-medium">Editor de Video</span>',
                    aboutP1: 'Transformo ideas en experiencias visuales para música, eventos y artistas que quieren destacar.',
                    aboutP2: 'Antes del diseño, viví este mercado. Fui DJ durante más de 15 años — desde open format hasta producción musical — entendiendo en la práctica el universo de los eventos, la importancia del backstage y el nivel de dedicación que todo esto exige.',
                    aboutP3: 'Lo visual siempre formó parte de este viaje. Desde temprano ya creaba portadas, flyers y videos como forma de expresar mi identidad más allá de la música. Con la pandemia y el nacimiento de mi hijo, decidí enfocarme totalmente en el diseño y lo audiovisual.',
                    aboutP4: 'Hoy, combino esta vivencia para dar vida a proyectos únicos.',
                    aboutTag1: 'EXPERIENCIA VISUAL',
                    aboutTag2: 'IDENTIDAD DE ARTISTA',
                    aboutBtnCreate: '¿Vamos a crear algo?',
                    statProjects: 'PROYECTOS',
                    statClients: 'CLIENTES',
                    statYears: 'AÑOS DE EXPERIENCIA'
                }
            };

            const langButtons = document.querySelectorAll('[data-lang-btn]');
            langButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const selectedLang = e.currentTarget.getAttribute('data-lang-btn');
                    
                    // Update visual state of buttons
                    langButtons.forEach(b => {
                        b.classList.remove('text-[#00FFFF]');
                        b.classList.add('text-white/50');
                    });
                    e.currentTarget.classList.add('text-[#00FFFF]');
                    e.currentTarget.classList.remove('text-white/50');

                    // Translate elements
                    document.querySelectorAll('[data-i18n]').forEach(el => {
                        const key = el.getAttribute('data-i18n');
                        if (i18nDict[selectedLang] && i18nDict[selectedLang][key]) {
                            el.innerHTML = i18nDict[selectedLang][key]; // innerHTML supports nested span injections
                        }
                    });
                });
            });

        });

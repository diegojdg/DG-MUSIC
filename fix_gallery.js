const fs = require('fs');

const filePath = "d:/01 - CURSOS/ASIMOV/Portfolio Inicial/DGMUSIC/index.html";
let content = fs.readFileSync(filePath, 'utf8');

// ─── Helper to build a gallery card ─────────────────────────────────────────
function card(vimeoId, title, cat) {
    return `
                <!-- ${title} -->
                <div class="relative w-full mb-6 break-inside-avoid rounded-sm overflow-hidden border border-white/10 shadow-lg floating-card bg-[#0A0A0A] group">
                    <div class="relative w-full" style="padding-top:56.25%">
                        <img src="https://vumbnail.com/${vimeoId}.jpg"
                            class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            loading="lazy" alt="${title}" />
                        <iframe data-src="https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0"
                            data-modal-src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&byline=0&title=0"
                            class="lazy-iframe absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            frameborder="0" allow="autoplay; fullscreen; picture-in-picture"></iframe>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/20 to-transparent pointer-events-none"></div>
                    <div class="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end z-10">
                        <div class="flex-1 pr-4">
                            <h3 class="font-orbitron font-bold text-white text-xl tracking-wide group-hover:text-[#00FFFF] transition-colors line-clamp-1">${title}</h3>
                            <p class="text-[10px] text-neutral-400 font-mono uppercase tracking-widest mt-2">${cat}</p>
                        </div>
                        <button class="bg-black/50 border border-white/20 hover:border-[#00FFFF] text-white hover:text-[#00FFFF] text-xs px-4 py-2 rounded-sm backdrop-blur-md transition-colors glow-on-hover shrink-0 cursor-pointer">View</button>
                    </div>
                </div>`;
}

// ─── Full Motion Gallery Section ─────────────────────────────────────────────
const motionGallerySection = `
    <!-- MOTION GALLERY SECTION -->
    <section id="motion-gallery"
        class="py-24 w-full relative z-10 overflow-hidden bg-[#050505] border-t border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">

        <!-- Background Elements -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 via-[#050505] to-[#050505] z-[0] pointer-events-none"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[#00FFFF] rounded-[100%] opacity-[0.05] pointer-events-none blur-[120px] mix-blend-screen aurora-mask z-[0]"></div>
        <div class="absolute inset-0 crt-scanlines pointer-events-none z-[1] opacity-20"></div>

        <div class="w-full lg:w-[80%] max-w-[100rem] mx-auto px-6 lg:px-0 relative z-10 flex flex-col items-center justify-center">

            <div class="text-center mb-16 max-w-2xl gsap-in px-6 lg:px-0" data-gsap="fadeUp">
                <p class="font-orbitron text-xs uppercase tracking-[0.4em] text-[#00FFFF] mb-3 flex items-center justify-center gap-3">
                    <span class="w-8 h-[1px] bg-[#00FFFF]"></span> VIDEO EXPERIENCES <span class="w-8 h-[1px] bg-[#00FFFF]"></span>
                </p>
                <h2 class="font-orbitron lg:text-5xl text-4xl font-medium text-white tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(0,255,255,0.15)]">
                    MOTION <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-white/50">GALLERY</span>
                </h2>
            </div>

            <!-- Masonry Gallery -->
            <div class="columns-1 md:columns-2 lg:columns-3 gap-6 w-full gsap-in" data-gsap="fadeUp" data-gsap-delay="0.2">
${card("1006742054", "Skazi — Israel Vibes", "SOCIAL REELS")}
${card("1006747710", "Private Floripa — Festival Onboard", "VIDEO COVERAGE")}
${card("1180788887", "Agenda Mochakk", "MOTION GRAPHICS")}
${card("1180790528", "Cover Art — Vintage Culture", "COVER ART")}
${card("1180790879", "Motion — Agenda Kolombo", "PROMO VIDEO")}
${card("1180791309", "Motion — Flyer Illuzionize", "EVENT FLYER")}
${card("1180792245", "Motion — Flyer Vegas", "EVENT FLYER")}
${card("1180792444", "Motion — Flyer Mc Cabelinho", "MOTION GRAPHICS")}
${card("1180792478", "Motion — Minimal Return", "3D COMPOSITION")}
${card("1180792508", "Motion — Chihiro [GABBEH & DAUDT REMIX]", "3D COMPOSITION")}
${card("1180792546", "Motion — So You Know [GABBEH & DAUDT]", "MOTION GRAPHICS")}
${card("1180792581", "Motion — Tão Gostosa — Di Jones", "COVER ART")}
            </div>

        </div>
        <div class="beam-border-h z-10" style="bottom: 0px; top: auto; animation-delay: 1.2s; animation-duration: 9s;"></div>
    </section>
`;

// ─── Hero video component (right-side parallax preview) ──────────────────────
const heroVideoBlock =
    `<div class="relative w-full h-full overflow-hidden">` +
    `<iframe src="https://player.vimeo.com/video/1180790528?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0" ` +
    `class="absolute inset-0 w-full h-full scale-[1.05] opacity-90 mix-blend-luminosity brightness-75 contrast-125 pointer-events-none" ` +
    `frameborder="0" allow="autoplay; fullscreen; picture-in-picture"></iframe>` +
    `</div>`;

// ─── 1. Fix hero "Video Right Component" ─────────────────────────────────────
// It currently has a big corrupted block from lines 394-596.
// Strategy: Find the "Video Right Component" div opening and its proper closing </div>,
// then strip all the misplaced cards after it.

// The hero structure ends with:
//   </div>          <- closes the col-span-7 parallax container
//   </main>
//   </section>      <- closes #hero

// Find the corrupted region: from "<!-- Card 2 -->" up to the end of the hero </section>
// And replace with a clean hero ending + the motion gallery section.

// Locate the end of the hero section (parallax-layer-2 for "Video Right Component")
// The parallax-layer-2 ends at line 411 (</div>)
// Then Card 2..N follow (corrupted), then the section #motion-gallery still present or not

// Strategy: replace from "<!-- Video Right Component -->" down to "<!-- ABOUT ME"
// with the corrected hero block + fresh motion gallery + about-me start

const corruptedHeroStart = `                <!-- Video Right Component -->
                <div class="parallax-layer-2 absolute top-[45%] lg:top-[25%] right-[5%] lg:right-[8%] w-[55%] lg:w-[19rem] aspect-square bg-neutral-900 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.95)] floating-card z-[10] transform rotate-[4deg] glow-on-hover gsap-in"
                    data-gsap="scaleUp" data-gsap-delay="0.5">`;

// Find the position of the corrupted block start
const startIdx = content.indexOf(corruptedHeroStart);
if (startIdx === -1) {
    console.error('Could not find the corrupted hero block start!');
    process.exit(1);
}

// Find where the section#motion-gallery already starts (if it exists after the corruption)
let motionIdx = content.indexOf('<!-- MOTION GALLERY SECTION -->');
let aboutIdx  = content.indexOf('<!-- ABOUT ME / QUEM SOU EU SECTION -->');

let endIdx;
if (motionIdx !== -1 && motionIdx > startIdx) {
    endIdx = motionIdx;
    console.log('Found existing motion gallery section — will replace from there');
} else if (aboutIdx !== -1 && aboutIdx > startIdx) {
    endIdx = aboutIdx;
    console.log('No existing motion gallery — will insert before About Me');
} else {
    console.error('Could not find an anchor point after the corrupted block!');
    process.exit(1);
}

const goodHeroVideoComponent = `                <!-- Video Right Component -->
                <div class="parallax-layer-2 absolute top-[45%] lg:top-[25%] right-[5%] lg:right-[8%] w-[55%] lg:w-[19rem] aspect-square bg-neutral-900 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.95)] floating-card z-[10] transform rotate-[4deg] glow-on-hover gsap-in"
                    data-gsap="scaleUp" data-gsap-delay="0.5">
                    ${heroVideoBlock}
                </div>

            </div>
        </main>
    </section>

`;

content = content.slice(0, startIdx) + goodHeroVideoComponent + motionGallerySection + '\n    ' + content.slice(endIdx);

// ─── 2. Update IntersectionObserver ──────────────────────────────────────────
const oldObserverStr = `// 5. Lazy Load Intersection Observer for Motion Gallery Videos
            const lazyVideos = document.querySelectorAll('.lazy-video');`;
const newObserverStr = `// 5. Lazy Load for Motion Gallery (Videos + Vimeo iframes)
            const lazyMedia = document.querySelectorAll('.lazy-video, .lazy-iframe');`;

if (content.includes(oldObserverStr)) {
    content = content.replace(oldObserverStr, newObserverStr);
    // Also update the references inside the observer
    content = content.replace(
        `lazyVideos.forEach(video => {
                    videoObserver.observe(video);
                });`,
        `lazyMedia.forEach(m => videoObserver.observe(m));`
    );
    // Update inside the observer callback
    content = content.replace(
        `entries.forEach(entry => {
                        const video = entry.target;
                        if (entry.isIntersecting) {
                            const source = video.querySelector('source');
                            if (source && source.hasAttribute('data-src')) {
                                source.src = source.getAttribute('data-src');
                                source.removeAttribute('data-src');
                                video.load();
                            }
                            video.play().catch(err => console.log('Observer Autoplay Prevented:', err));
                        } else {
                            // Pause when off-screen to save severe memory/battery load
                            video.pause();
                        }
                    });`,
        `entries.forEach(entry => {
                        const el = entry.target;
                        if (entry.isIntersecting) {
                            if (el.tagName === 'VIDEO') {
                                const source = el.querySelector('source');
                                if (source && source.hasAttribute('data-src')) {
                                    source.src = source.getAttribute('data-src');
                                    source.removeAttribute('data-src');
                                    el.load();
                                }
                                el.play().catch(() => {});
                            } else if (el.tagName === 'IFRAME' && el.dataset.src) {
                                el.src = el.dataset.src;
                                el.removeAttribute('data-src');
                            }
                        } else {
                            if (el.tagName === 'VIDEO') el.pause();
                        }
                    });`
    );
    // Fallback
    content = content.replace(
        `lazyVideos.forEach(video => {
                    const src = video.querySelector('source');
                    if (src && src.hasAttribute('data-src')) {
                        src.src = src.getAttribute('data-src');
                    }
                    video.load();
                });`,
        `lazyMedia.forEach(el => {
                    if (el.tagName === 'VIDEO') {
                        const src = el.querySelector('source');
                        if (src && src.hasAttribute('data-src')) { src.src = src.getAttribute('data-src'); }
                        el.load();
                    } else if (el.tagName === 'IFRAME' && el.dataset.src) {
                        el.src = el.dataset.src;
                    }
                });`
    );
    console.log('  [OK] IntersectionObserver updated');
} else {
    console.log('  [SKIP] Observer already updated or not found');
}

// ─── 3. Update modal HTML ─────────────────────────────────────────────────────
if (!content.includes('modal-iframe-element')) {
    content = content.replace(
        /<video id="modal-video-element"[\s\S]*?<\/video>/,
        `<video id="modal-video-element" controls autoplay playsinline
                    class="hidden max-w-full max-h-[65vh] md:max-h-[75vh] object-contain w-auto mx-auto border-none outline-none">
                    <source id="modal-video-source" src="" type="video/mp4" />
                </video>
                <iframe id="modal-iframe-element" src=""
                    class="hidden w-full" style="height:70vh"
                    frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
    );
    console.log('  [OK] Modal HTML updated');
} else {
    console.log('  [SKIP] Modal HTML already has iframe element');
}

// ─── 4. Update modal click handler ───────────────────────────────────────────
const oldClickFrag = `if (videoSource) {
                            modalSrc.src = videoSource.getAttribute("src") || videoSource.getAttribute("data-src") || "";
                            modalVideo.load();
                        }`;
const newClickFrag = `const iframeEl = card.querySelector('iframe.lazy-iframe');
                        const modalVideoEl = document.getElementById('modal-video-element');
                        const modalIframeEl = document.getElementById('modal-iframe-element');

                        if (iframeEl) {
                            modalVideoEl.classList.add('hidden');
                            modalVideoEl.pause();
                            modalSrc.src = '';
                            modalIframeEl.classList.remove('hidden');
                            modalIframeEl.src = iframeEl.getAttribute('data-modal-src') || '';
                        } else if (videoSource) {
                            modalIframeEl.classList.add('hidden');
                            modalIframeEl.src = '';
                            modalVideoEl.classList.remove('hidden');
                            modalSrc.src = videoSource.getAttribute('src') || videoSource.getAttribute('data-src') || '';
                            modalVideoEl.load();
                        }`;

if (content.includes(oldClickFrag)) {
    content = content.replace(oldClickFrag, newClickFrag);
    console.log('  [OK] Modal click handler updated');
} else {
    console.log('  [SKIP] Click handler already updated');
}

// ─── 5. Update modal close handler ───────────────────────────────────────────
const oldCloseFrag = `modalVideo.pause();
            modalSrc.src = "";`;
const newCloseFrag = `modalVideo.pause();
            modalSrc.src = "";
            if (document.getElementById('modal-iframe-element')) document.getElementById('modal-iframe-element').src = "";`;

if (content.includes(oldCloseFrag)) {
    content = content.replace(oldCloseFrag, newCloseFrag);
    console.log('  [OK] Modal close handler updated');
} else {
    console.log('  [SKIP] Close handler already updated');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ index.html fixed and saved!');
console.log(`   Lines: ~${content.split('\n').length}`);


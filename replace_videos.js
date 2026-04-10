const fs = require('fs');

const vimeoData = {
    "Agenda Mochakk - Out Nov 2023.mp4": { id: "1180788887", title: "Agenda Mochakk", cat: "MOTION GRAPHICS" },
    "Capa animada.mp4": { id: "1180790528", title: "Cover Art - Vintage Culture", cat: "COVER ART" },
    "Motion - Agenda Kolombo.mp4": { id: "1180790879", title: "Motion - Agenda Kolombo", cat: "PROMO VIDEO" },
    "Motion - Flyer Illuzionize.mp4": { id: "1180791309", title: "Motion - Flyer Illuzionize", cat: "EVENT FLYER" },
    "Motion - Flyer Vegas.mp4": { id: "1180792245", title: "Motion - Flyer Vegas", cat: "EVENT FLYER" },
    "Motion - Mc Cabelinho 2.mp4": { id: "1180792444", title: "Motion - Flyer Mc Cabelinho", cat: "MOTION GRAPHICS" },
    "Motion - Minimal Return.mp4": { id: "1180792478", title: "Motion - Minimal Return", cat: "3D COMPOSITION" },
    "Motion 15s - Chihiro - Gabbeh, Daudt ( Remix ).mp4": { id: "1180792508", title: "Motion - Chihiro - Gabbeh, Daudt [REMIX]", cat: "3D COMPOSITION" },
    "Motion 15s - So You Know - GABBEH &amp; DAUDT.mp4": { id: "1180792546", title: "Motion - So You Know - GABBEH &amp; DAUDT", cat: "MOTION GRAPHICS" },
    "Motion 1350 Cover Art - Tão Gostosa - Di Jones.mp4": { id: "1180792581", title: "Tão Gostosa - Di Jones", cat: "COVER ART" },
    "Reels - Israel Vibes - 21-02.mp4": { id: "1006742054", title: "Skazi - Israel Vibes - Life Club", cat: "SOCIAL REELS" },
    "Video Private - Festival On Board.mp4": { id: "1006747710", title: "Private Floripa - Festival Onboard", cat: "VIDEO COVERAGE" },
};

const filePath = "d:/01 - CURSOS/ASIMOV/Portfolio Inicial/DGMUSIC/index.html";
let content = fs.readFileSync(filePath, 'utf8');

// ─── 1. Replace each <video> card block with a Vimeo iframe ──────────────────
for (const [mp4File, data] of Object.entries(vimeoData)) {
    if (!content.includes(mp4File)) {
        console.log(`  [MISS] ${mp4File}`);
        continue;
    }

    // Match the <video … > … </video> block that contains this mp4 filename
    const escapedFile = mp4File.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const videoRegex = new RegExp(
        `<video[\\s\\S]*?<source[\\s\\S]*?${escapedFile}[\\s\\S]*?<\\/video>`,
        'g'
    );

    const iframeBlock =
        `<div class="relative w-full" style="padding-top:56.25%">` +
        `<img src="https://vumbnail.com/${data.id}.jpg" class="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" loading="lazy" alt="${data.title}" />` +
        `<iframe data-src="https://player.vimeo.com/video/${data.id}?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0" ` +
        `data-modal-src="https://player.vimeo.com/video/${data.id}?autoplay=1&byline=0&title=0" ` +
        `class="lazy-iframe absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500" ` +
        `frameborder="0" allow="autoplay; fullscreen; picture-in-picture"></iframe>` +
        `</div>`;

    content = content.replace(videoRegex, iframeBlock);
    console.log(`  [OK]   ${mp4File}  →  vimeo/${data.id}`);
}

// ─── 2. Update IntersectionObserver to handle both video and iframes ──────────
const oldObserverPattern = /const lazyVideos = document\.querySelectorAll\('\.lazy-video'\);[\s\S]*?\/\/ 4\. Modal Interactions/;

const newObserver = `// 5. Lazy Load for Motion Gallery (Videos + Vimeo iframes)
            const lazyMedia = document.querySelectorAll('.lazy-video, .lazy-iframe');
            if ('IntersectionObserver' in window) {
                const mediaObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        const el = entry.target;
                        if (entry.isIntersecting) {
                            if (el.tagName === 'VIDEO') {
                                const source = el.querySelector('source');
                                if (source && source.dataset.src) {
                                    source.src = source.dataset.src;
                                    delete source.dataset.src;
                                    el.load();
                                }
                                el.play().catch(() => {});
                            } else if (el.tagName === 'IFRAME' && el.dataset.src) {
                                el.src = el.dataset.src;
                                delete el.dataset.src;
                            }
                        } else {
                            if (el.tagName === 'VIDEO') el.pause();
                        }
                    });
                }, { rootMargin: '0px 0px 400px 0px' });

                lazyMedia.forEach(m => mediaObserver.observe(m));
            } else {
                // Fallback for legacy browsers
                lazyMedia.forEach(el => {
                    if (el.tagName === 'VIDEO') {
                        const src = el.querySelector('source');
                        if (src && src.dataset.src) { src.src = src.dataset.src; }
                        el.load();
                    } else if (el.tagName === 'IFRAME' && el.dataset.src) {
                        el.src = el.dataset.src;
                    }
                });
            }
            // 4. Modal Interactions`;

if (oldObserverPattern.test(content)) {
    content = content.replace(oldObserverPattern, newObserver);
    console.log('  [OK]   IntersectionObserver updated');
} else {
    console.log('  [WARN] IntersectionObserver block not found — may already be updated');
}

// ─── 3. Update modal HTML to support both video and iframe ────────────────────
const oldModalVideo = /<video id="modal-video-element"[\s\S]*?<\/video>/;

const newModalMedia =
    `<video id="modal-video-element" controls autoplay playsinline ` +
    `class="hidden max-w-full max-h-[65vh] md:max-h-[75vh] object-contain w-auto mx-auto border-none outline-none">` +
    `<source id="modal-video-source" src="" type="video/mp4" /></video>` +
    `<iframe id="modal-iframe-element" src="" ` +
    `class="hidden w-full" style="height:70vh" ` +
    `frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;

if (oldModalVideo.test(content)) {
    content = content.replace(oldModalVideo, newModalMedia);
    console.log('  [OK]   Modal HTML updated');
} else {
    console.log('  [WARN] Modal video element not found — may already be updated');
}

// ─── 4. Update the "View" button click handler ────────────────────────────────
const oldClickBlock = /if \(videoSource\) \{\s*modalSrc\.src[\s\S]*?modalVideo\.load\(\);\s*\}/;

const newClickBlock =
    `const iframeEl = card.querySelector('iframe.lazy-iframe');
                        const modalVideoEl = document.getElementById('modal-video-element');
                        const modalIframeEl = document.getElementById('modal-iframe-element');

                        if (iframeEl) {
                            // Vimeo card
                            modalVideoEl.classList.add('hidden');
                            modalVideoEl.pause();
                            modalSrc.src = '';
                            modalIframeEl.classList.remove('hidden');
                            modalIframeEl.src = iframeEl.getAttribute('data-modal-src') || iframeEl.getAttribute('src') || '';
                        } else if (videoSource) {
                            // Local video card
                            modalIframeEl.classList.add('hidden');
                            modalIframeEl.src = '';
                            modalVideoEl.classList.remove('hidden');
                            modalSrc.src = videoSource.getAttribute('src') || videoSource.getAttribute('data-src') || '';
                            modalVideoEl.load();
                        }`;

if (oldClickBlock.test(content)) {
    content = content.replace(oldClickBlock, newClickBlock);
    console.log('  [OK]   View button click handler updated');
} else {
    console.log('  [WARN] Click handler block not found — may already be updated');
}

// ─── 5. Update modal close handler ───────────────────────────────────────────
const oldClose = /modalVideo\.pause\(\);\s*modalSrc\.src = "";/;
const newClose =
    `modalVideo.pause();
            modalSrc.src = "";
            document.getElementById('modal-iframe-element').src = "";`;

if (oldClose.test(content)) {
    content = content.replace(oldClose, newClose);
    console.log('  [OK]   Modal close handler updated');
} else {
    console.log('  [WARN] Close handler not found — may already be updated');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✅ index.html saved successfully!');


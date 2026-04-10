/**
 * Script definitivo para substituir vídeos locais por iframes Vimeo.
 * Baseado na estrutura real do arquivo (git HEAD).
 * Encontra cada <video> no range da Motion Gallery e substitui pela
 * estrutura Vimeo correspondente.
 */
const fs = require('fs');
const path = 'DGMUSIC/index.html';
let content = fs.readFileSync(path, 'utf8');
const originalLines = content.split('\r\n');
console.log(`Total lines: ${originalLines.length}`);

// ─── Mapa de substituição: string da source → dados Vimeo ────────────────────
// Cada entrada: [trecho único do src, vimeoId]
const videoMap = [
    ["Agenda Mochakk - Out Nov 2023.mp4",              "1180788887"],
    ["Capa animada.mp4",                               "1180790528"],
    ["Motion - Agenda Kolombo.mp4",                    "1180790879"],
    ["Motion - Flyer Illuzionize.mp4",                 "1180791309"],
    ["Motion - Flyer Vegas.mp4",                       "1180792245"],
    ["Motion - Mc Cabelinho 2.mp4",                    "1180792444"],
    ["Motion - Minimal Return.mp4",                    "1180792478"],
    ["Victor Lou - Egito 3.mp4",                       null],         // sem vimeo
    ["Reels - Israel Vibes - 21-02.mp4",               "1006742054"],
    ["Video Djonga",                                   null],         // sem vimeo
    ["Video Private - Festival On Board.mp4",          "1006747710"],
    ["CANVAS.mp4",                                     null],         // sem vimeo no gallery scope
    ["Motion-%20LUDICY.mp4",                           null],         // sem vimeo
    ["The%20Begin%20Video.mp4",                        null],         // sem vimeo
    ["Chihiro - Gabbeh, Daudt",                        "1180792508"],
    ["So You Know - GABBEH",                           "1180792546"],
    ["Tão Gostosa - Di Jones.mp4",                     "1180792581"],
    ["Reels Motion - Barbie",                          null],         // sem vimeo
];

// ─── Substituição por regex dentro do range da seção Motion Gallery ───────────
// A seção vai de "<!-- MOTION GALLERY SECTION -->" até "</section>"
const galleryStartMarker = '<!-- MOTION GALLERY SECTION -->';
const galleryStart = content.indexOf(galleryStartMarker);

// Find this section's </section> (first one after galleryStart)
const sectionCloseTag = '</section>';
let galleryEnd = content.indexOf(sectionCloseTag, galleryStart);
// Move galleryEnd past the </section>
galleryEnd += sectionCloseTag.length;

let galleryContent = content.slice(galleryStart, galleryEnd);
const beforeGallery = content.slice(0, galleryStart);
let afterGallery = content.slice(galleryEnd);

console.log(`Gallery section: ${galleryStart} → ${galleryEnd} (${galleryEnd - galleryStart} chars)`);

// Replace each video block within gallery
for (const [srcMatch, vimeoId] of videoMap) {
    if (!galleryContent.includes(srcMatch)) {
        console.log(`  [MISS] "${srcMatch}"`);
        continue;
    }
    
    if (!vimeoId) {
        console.log(`  [SKIP] "${srcMatch}" — no Vimeo ID`);
        continue;
    }
    
    // Find the <video ...> block containing this source
    // Pattern: find the <video tag that appears before our source url
    const srcPos = galleryContent.indexOf(srcMatch);
    
    // Walk backwards to find <video
    let videoStart = srcPos;
    while (videoStart > 0 && !galleryContent.slice(videoStart, videoStart + 6).startsWith('<video')) {
        videoStart--;
    }
    
    // Walk forwards to find </video>
    const videoEndTag = '</video>';
    const videoEnd = galleryContent.indexOf(videoEndTag, srcPos) + videoEndTag.length;
    
    if (videoStart < 0 || videoEnd <= 0) {
        console.log(`  [ERR] Could not find <video>...</video> for "${srcMatch}"`);
        continue;
    }
    
    const oldVideoBlock = galleryContent.slice(videoStart, videoEnd);
    
    // Build the Vimeo replacement
    const newBlock = `<div class="relative w-full" style="padding-top:56.25%">
                        <img src="https://vumbnail.com/${vimeoId}.jpg"
                            class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                            loading="lazy" alt="${srcMatch.split('/').pop().replace('.mp4','')}" />
                        <iframe
                            data-src="https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0"
                            data-modal-src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&byline=0&title=0"
                            class="lazy-iframe absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            frameborder="0" allow="autoplay; fullscreen; picture-in-picture"></iframe>
                    </div>`;
    
    galleryContent = galleryContent.slice(0, videoStart) + newBlock + galleryContent.slice(videoEnd);
    console.log(`  [OK] "${srcMatch}" → vimeo/${vimeoId}`);
}

// Reassemble
content = beforeGallery + galleryContent + afterGallery;

// ─── 2. Update Modal HTML ─────────────────────────────────────────────────────
// Add iframe to modal, hide video by default
if (!content.includes('modal-iframe-element')) {
    content = content.replace(
        '<video id="modal-video-element" controls autoplay playsinline class="max-w-full',
        '<video id="modal-video-element" controls autoplay playsinline class="hidden max-w-full'
    );
    content = content.replace(
        '<source id="modal-video-source" src="" type="video/mp4" />\r\n                </video>',
        '<source id="modal-video-source" src="" type="video/mp4" />\r\n                </video>\r\n                <iframe id="modal-iframe-element" src=""\r\n                    class="hidden w-full" style="height:70vh"\r\n                    frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
    );
    console.log('  [OK] Modal iframe element added');
} else {
    console.log('  [SKIP] Modal iframe already exists');
}

// ─── 3. Update IntersectionObserver ──────────────────────────────────────────
// Update querySelector
content = content.replace(
    "querySelectorAll('video.lazy-video')",
    "querySelectorAll('.lazy-video, .lazy-iframe')"
);
content = content.replace(
    "const lazyVideos = document.querySelectorAll('.lazy-video')",
    "const lazyMedia = document.querySelectorAll('.lazy-video, .lazy-iframe')"
);

// Refactor all references to lazyVideos → lazyMedia
content = content.replace(/\blazyVideos\b/g, 'lazyMedia');

// Update the observer callback to handle iframes
content = content.replace(
    `const video = entry.target;`,
    `const el = entry.target;`
);
content = content.replace(
    /const source = video\.querySelector\('source'\);\s*if \(source && source\.hasAttribute\('data-src'\)\) \{\s*source\.src = source\.getAttribute\('data-src'\);\s*source\.removeAttribute\('data-src'\);\s*video\.load\(\);\s*\}\s*video\.play\(\)\.catch/g,
    `if (el.tagName === 'VIDEO') {
                                const source = el.querySelector('source');
                                if (source && source.hasAttribute('data-src')) {
                                    source.src = source.getAttribute('data-src');
                                    source.removeAttribute('data-src');
                                    el.load();
                                }
                                el.play().catch`
);
content = content.replace(
    /video\.pause\(\);\s*\/\/ Pause when off-screen/g,
    `if (el.tagName === 'VIDEO') el.pause();
                        } else if (el.tagName === 'IFRAME' && el.dataset.src) {
                            el.src = el.dataset.src;
                            el.removeAttribute('data-src');
                        }
                        // Pause when off-screen`
);

// ─── 4. Update Modal Click Handler ───────────────────────────────────────────
const oldClickHandlerPart = "if (videoSource) {\r\n                            modalSrc.src = videoSource.getAttribute(\"src\") || videoSource.getAttribute(\"data-src\") || \"\";\r\n                            modalVideo.load();\r\n                        }";
const newClickHandler = `const iframeEl = card.querySelector("iframe.lazy-iframe");
                        const modalVideoEl = document.getElementById("modal-video-element");
                        const modalIframeEl = document.getElementById("modal-iframe-element");

                        if (iframeEl) {
                            modalVideoEl.classList.add("hidden");
                            modalVideoEl.pause();
                            modalSrc.src = "";
                            if (modalIframeEl) { modalIframeEl.classList.remove("hidden"); modalIframeEl.src = iframeEl.getAttribute("data-modal-src") || ""; }
                        } else if (videoSource) {
                            if (modalIframeEl) { modalIframeEl.classList.add("hidden"); modalIframeEl.src = ""; }
                            modalVideoEl.classList.remove("hidden");
                            modalSrc.src = videoSource.getAttribute("src") || videoSource.getAttribute("data-src") || "";
                            modalVideo.load();
                        }`;

if (content.includes(oldClickHandlerPart)) {
    content = content.replace(oldClickHandlerPart, newClickHandler);
    console.log('  [OK] Modal click handler updated');
} else {
    console.log('  [WARN] Could not find exact click handler text - skipping');
}

// ─── 5. Update Modal Close Handler ───────────────────────────────────────────
content = content.replace(
    'modalVideo.pause();\r\n                modalSrc.src = "";',
    'modalVideo.pause();\r\n                modalSrc.src = "";\r\n                const mif = document.getElementById("modal-iframe-element"); if (mif) mif.src = "";'
);

// ─── Save ─────────────────────────────────────────────────────────────────────
fs.writeFileSync(path, content, 'utf8');
const finalLines = content.split('\r\n').length;
console.log(`\n✅ Done! Written ${finalLines} lines`);

// Verification
const vimeoCount = (content.match(/player\.vimeo\.com/g) || []).length;
const localVideoCount = (content.match(/VIDEOS E MOTION/g) || []).length;
console.log(`   Vimeo iframes: ${vimeoCount}`);
console.log(`   Remaining local VIDEOS E MOTION refs: ${localVideoCount}`);


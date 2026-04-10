import re

vimeo_data = {
    "Agenda Mochakk - Out Nov 2023.mp4": {"id": "1180788887", "title": "Agenda Mochakk", "cat": "MOTION GRAPHICS"},
    "Capa animada.mp4": {"id": "1180790528", "title": "Cover Art - Vintage Culture", "cat": "COVER ART"},
    "Motion - Agenda Kolombo.mp4": {"id": "1180790879", "title": "Motion - Agenda Kolombo", "cat": "PROMO VIDEO"},
    "Motion - Flyer Illuzionize.mp4": {"id": "1180791309", "title": "Motion - Flyer Illuzionize", "cat": "EVENT FLYER"},
    "Motion - Flyer Vegas.mp4": {"id": "1180792245", "title": "Motion - Flyer Vegas", "cat": "EVENT FLYER"},
    "Motion - Mc Cabelinho 2.mp4": {"id": "1180792444", "title": "Motion - Flyer Mc Cabelinho", "cat": "MOTION GRAPHICS"},
    "Motion - Minimal Return.mp4": {"id": "1180792478", "title": "Motion - Minimal Return", "cat": "3D COMPOSITION"},
    "Motion 15s - Chihiro - Gabbeh, Daudt ( Remix ).mp4": {"id": "1180792508", "title": "Motion - Chihiro - Gabbeh, Daudt [REMIX]", "cat": "3D COMPOSITION"},
    "Motion 15s - So You Know - GABBEH & DAUDT.mp4": {"id": "1180792546", "title": "Motion - So You Know - GABBEH & DAUDT", "cat": "MOTION GRAPHICS"},
    "Motion 1350 Cover Art - Tão Gostosa - Di Jones.mp4": {"id": "1180792581", "title": "Cover Art - Tão Gostosa", "cat": "COVER ART"},
    "Reels - Israel Vibes - 21-02.mp4": {"id": "1006742054", "title": "Skazi - Israel Vibes - Life Club", "cat": "SOCIAL REELS"},
    "Video Private - Festival On Board.mp4": {"id": "1006747710", "title": "Private Floripa - Festival Onboard", "cat": "VIDEO COVERAGE"},
}

with open("d:/01 - CURSOS/ASIMOV/Portfolio Inicial/DGMUSIC/index.html", "r", encoding="utf-8") as f:
    content = f.read()

# For each key, we find the <video> block and replace it
# The block looks like:
# <video loop muted playsinline preload="none"
#     class="lazy-video w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500">
#     <source data-src="assets/raw_files/VIDEOS E MOTION/Agenda Mochakk - Out Nov 2023.mp4"
#         type="video/mp4" />
# </video>

# Regex to find these videos and their surrounding titles
for mp4_file, data in vimeo_data.items():
    # 1. Replace the <video> tag
    # Escape the filename for regex
    escaped_file = re.escape(mp4_file)
    pattern_video = r'<video[^>]*>[\s\S]*?<source[^>]*' + escaped_file + r'[^>]*>[\s\S]*?<\/video>'
    
    replacement_video = f'''<img src="https://vumbnail.com/{data["id"]}.jpg" class="w-full h-auto object-cover opacity-50" />
                    <iframe data-src="https://player.vimeo.com/video/{data["id"]}?background=1&autoplay=1&loop=1&byline=0&title=0" data-modal-src="https://player.vimeo.com/video/{data["id"]}?autoplay=1" class="lazy-iframe absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" frameborder="0" allow="autoplay; fullscreen"></iframe>'''
    
    # Check if the file is in content
    if mp4_file in content:
        # Before replacing video, let's also fix the title. The title is in the next <h3> block.
        # But doing it with regex over multiple lines is tricky. Let's do it in one pass per card if possible.
        # Actually, let's just replace the video, and then search and replace the title manually if needed.
        # Let's write a targeted function to find the block of the card.
        pass

# A better approach: find each card group, see if it has the MP4, if so, rewrite the whole card.
cards_pattern = re.compile(r'(<div\s+class="[^"]*group[^"]*">)([\s\S]*?)(</div>\s*<!-- Card \d+ -->|</div>\s*</div>)', re.IGNORECASE)

new_content = ""
last_end = 0

# Actually, splitting by '<!-- Card ' is easier.
cards = re.split(r'(<!-- Card \d+ -->)', content)
for i in range(len(cards)):
    part = cards[i]
    for mp4_file, data in vimeo_data.items():
        if mp4_file in part:
            # Replace video
            escaped_file = re.escape(mp4_file)
            part = re.sub(r'<video[\s\S]*?<\/video>', f'''<img src="https://vumbnail.com/{data["id"]}.jpg" class="w-full h-auto object-cover opacity-50" />
                    <iframe data-src="https://player.vimeo.com/video/{data["id"]}?background=1&autoplay=1&loop=1&byline=0&title=0" data-modal-src="https://player.vimeo.com/video/{data["id"]}?autoplay=1" class="lazy-iframe absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" frameborder="0" allow="autoplay; fullscreen"></iframe>''', part)
            
            # Replace title
            part = re.sub(r'<h3[^>]*>[\s\S]*?<\/h3>', f'''<h3
                                class="font-orbitron font-bold text-white text-xl tracking-wide group-hover:text-[#00FFFF] transition-colors line-clamp-1">
                                {data["title"]}</h3>''', part)
    cards[i] = part

content = "".join(cards)

# Now we need to update the Javascript
# 1. Update IntersectionObserver
#    Find: const lazyVideos = document.querySelectorAll('.lazy-video');
#    Replace with: const lazyMedia = document.querySelectorAll('.lazy-video, .lazy-iframe');
js_update_1 = """const lazyMedia = document.querySelectorAll('.lazy-video, .lazy-iframe');
            if ('IntersectionObserver' in window) {
                const videoObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        const el = entry.target;
                        if (entry.isIntersecting) {
                            if (el.tagName === 'VIDEO') {
                                const source = el.querySelector('source');
                                if (source && source.hasAttribute('data-src')) {
                                    source.src = source.getAttribute('data-src');
                                    source.removeAttribute('data-src');
                                    el.load();
                                }
                                el.play().catch(err => console.log('Observer Autoplay Prevented:', err));
                            } else if (el.tagName === 'IFRAME') {
                                if (el.hasAttribute('data-src')) {
                                    el.src = el.getAttribute('data-src');
                                    el.removeAttribute('data-src');
                                }
                            }
                        } else {
                            if (el.tagName === 'VIDEO') {
                                el.pause();
                            }
                        }
                    });
                }, { rootMargin: "0px 0px 300px 0px" });

                lazyMedia.forEach(media => {
                    videoObserver.observe(media);
                });
            } else {
                lazyMedia.forEach(media => {
                    if (media.tagName === 'VIDEO') {
                        const src = media.querySelector('source');
                        if (src && src.hasAttribute('data-src')) {
                            src.src = src.getAttribute('data-src');
                        }
                        media.load();
                    } else if (media.tagName === 'IFRAME') {
                        if (media.hasAttribute('data-src')) {
                            media.src = media.getAttribute('data-src');
                        }
                    }
                });
            }"""

old_js_1 = re.compile(r"const lazyVideos = document\.querySelectorAll\('\.lazy-video'\);[\s\S]*?\}\s*// 4\. Modal Interactions", re.MULTILINE)
content = old_js_1.sub(js_update_1 + "\n            // 4. Modal Interactions", content)

# 2. Update Modal HTML structure
# Find: <video id="modal-video-element" ...> ... </video>
old_modal_html = re.compile(r'<video id="modal-video-element"[\s\S]*?<\/video>', re.MULTILINE)
new_modal_html = """<video id="modal-video-element" controls autoplay playsinline
                    class="max-w-full max-h-[65vh] md:max-h-[75vh] object-contain w-auto mx-auto border-none outline-none hidden">
                    <source id="modal-video-source" src="" type="video/mp4" />
                </video>
                <iframe id="modal-iframe-element" src="" class="hidden w-full h-[65vh] md:h-[75vh]" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>"""

content = old_modal_html.sub(new_modal_html, content)

# 3. Update Modal JS Logic
# btn.addEventListener('click', (e) => { ... modalSrc.src ... modalVideo.load(); ...
old_modal_js = re.compile(r'if \(videoSource\) \{[\s\S]*?modalVideo\.load\(\);[\s\S]*?\}', re.MULTILINE)
new_modal_js = """const iframeSource = card.querySelector('iframe.lazy-iframe');
                        
                        const modalVideoEl = document.getElementById('modal-video-element');
                        const modalIframeEl = document.getElementById('modal-iframe-element');

                        if (iframeSource) {
                            modalVideoEl.classList.add('hidden');
                            modalIframeEl.classList.remove('hidden');
                            
                            // Stop any playing video
                            modalVideoEl.pause();
                            modalSrc.src = "";
                            
                            modalIframeEl.src = iframeSource.getAttribute("data-modal-src") || "";
                        } else if (videoSource) {
                            modalIframeEl.classList.add('hidden');
                            modalVideoEl.classList.remove('hidden');
                            
                            // Stop iframe
                            modalIframeEl.src = "";
                            
                            modalSrc.src = videoSource.getAttribute("src") || videoSource.getAttribute("data-src") || "";
                            modalVideoEl.load();
                        }"""
content = old_modal_js.sub(new_modal_js, content)

# close modal logic:
# modalVideo.pause(); modalSrc.src = "";
old_modal_close = re.compile(r'modalVideo\.pause\(\);\s*modalSrc\.src = "";')
new_modal_close = """modalVideo.pause();
            modalSrc.src = "";
            document.getElementById('modal-iframe-element').src = "";"""
content = old_modal_close.sub(new_modal_close, content)


with open("d:/01 - CURSOS/ASIMOV/Portfolio Inicial/DGMUSIC/index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")


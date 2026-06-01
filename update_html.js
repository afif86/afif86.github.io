const fs = require('fs');
const path = require('path');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let customCssToAppend = '\n/* ==========================================================================\n   Page-Specific Styles (Moved from HTML files)\n   ========================================================================== */\n';
let customJsToAppend = '\n/* ==========================================================================\n   Page-Specific Scripts (Moved from HTML files)\n   ========================================================================== */\n';

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. FOUC Style
  const foucStyleRegex = /<style>[\s\n]*html\.w-mod-js:not\(\.w-mod-ix3\) :is\(\.master-navigation, \[cms-overlay\]\) {[\s\n]*visibility: hidden !important;[\s\n]*}[\s\n]*<\/style>/g;
  content = content.replace(foucStyleRegex, '<!-- Boilerplate FOUC Style moved to custom.css -->');

  // 2. Typography Style
  const typoStyleRegex = /<style>[\s\n]*\* {[\s\n]*-webkit-font-smoothing: antialiased;[\s\n]*\/\* For WebKit \(Safari, Chrome\) \*\/[\s\n]*-moz-osx-font-smoothing: grayscale;[\s\n]*\/\* For macOS Firefox \*\/[\s\n]*font-smoothing: antialiased;[\s\n]*\/\* Non-standard, fallback \*\/[\s\n]*text-rendering: optimizeLegibility;[\s\n]*\/\* Improves kerning and ligatures \*\/[\s\n]*}[\s\n]*<\/style>/g;
  content = content.replace(typoStyleRegex, '<!-- Boilerplate Typography Style moved to custom.css -->');

  // 3. FOUC Script (matches both minified and unminified versions)
  const foucScriptRegex = /<script type="text\/javascript">[\s\n]*!\(function \(o, c\) {[\s\n]*var n = c\.documentElement,[\s\n]*t = " w-mod-";[\s\n]*\(n\.className \+= t \+ "js"\), \("ontouchstart" in o \|\| \(o\.DocumentTouch && c instanceof DocumentTouch\)\) && \(n\.className \+= t \+ "touch"\);[\s\n]*}\)\(window, document\);[\s\n]*<\/script>/g;
  content = content.replace(foucScriptRegex, '<!-- Boilerplate FOUC Script moved to main.js -->');
  
  const foucScriptRegexMin = /<script type="text\/javascript">!function\(o,c\){var n=c\.documentElement,t=" w-mod-";n\.className\+=t\+"js",\("ontouchstart"in o\|\|o\.DocumentTouch&&c instanceof DocumentTouch\)&&\(n\.className\+=t\+"touch"\)}\(window,document\);<\/script>/g;
  content = content.replace(foucScriptRegexMin, '<!-- Boilerplate FOUC Script moved to main.js -->');

  // 4. GSAP Init
  const gsapRegex = /<script type="text\/javascript">[\s\n]*gsap\.registerPlugin\(Observer, SplitText, ScrollTrigger\);[\s\n]*<\/script>/g;
  content = content.replace(gsapRegex, '<!-- Global GSAP Initialization moved to main.js -->');

  // 5. Lenis Init
  const lenisRegex = /<script>[\s\n]*let lenis = new Lenis\({[\s\n]*lerp: 0\.1,[\s\n]*wheelMultiplier: 0\.7,[\s\n]*gestureOrientation: "vertical",[\s\n]*normalizeWheel: false,[\s\n]*smoothTouch: false,[\s\n]*}\);[\s\n]*function raf\(time\) {[\s\n]*lenis\.raf\(time\);[\s\n]*requestAnimationFrame\(raf\);[\s\n]*}[\s\n]*requestAnimationFrame\(raf\);[\s\n]*<\/script>/g;
  content = content.replace(lenisRegex, '<!-- Global Lenis Initialization moved to main.js -->');

  // Extract page specific stuff
  if (file === 'index.html') {
    // Extract video CSS
    const indexCssRegex = /<style>[\s\n]*\[data-wf-bgvideo-fallback-img\] {[\s\n]*display: none;[\s\n]*}[\s\n]*@media \(prefers-reduced-motion: reduce\) {[\s\n]*\[data-wf-bgvideo-fallback-img\] {[\s\n]*position: absolute;[\s\n]*z-index: -100;[\s\n]*display: inline-block;[\s\n]*height: 100%;[\s\n]*width: 100%;[\s\n]*object-fit: cover;[\s\n]*}[\s\n]*}[\s\n]*<\/style>/g;
    
    let match = indexCssRegex.exec(content);
    if (match) {
      customCssToAppend += '\n/* index.html background video fallback */\n';
      customCssToAppend += match[0].replace(/<style>|<\/style>/g, '').trim() + '\n';
      content = content.replace(indexCssRegex, '<!-- Index video style moved to custom.css -->');
    }

    // Extract video JS
    const indexJsRegex = /<script>[\s\n]*\$\(document\)\.ready\(function \(\) {[\s\n]*\/\/ Make sure all videos start paused[\s\n]*\$\("\.video-slider"\)\.each\(function \(\) {[\s\n]*\$\(this\)\[0\]\.pause\(\);[\s\n]*}\);[\s\n]*\/\/ Autoplay the video in the first slide[\s\n]*var firstVideo = \$\("\.w-slider-slide:first-child \.video-slider"\)\[0\];[\s\n]*if \(firstVideo\) {[\s\n]*firstVideo\.play\(\);[\s\n]*}[\s\n]*\/\/ Play\/pause videos on slide change[\s\n]*\$\("\.slider-events"\)\.on\("click", "\.w-slider-arrow-left, \.w-slider-arrow-right, \.w-slider-dot", function \(\) {[\s\n]*\/\/ Pause all videos[\s\n]*\$\("\.video-slider"\)\.each\(function \(\) {[\s\n]*\$\(this\)\[0\]\.pause\(\);[\s\n]*}\);[\s\n]*\/\/ Get the active slide and play its video[\s\n]*setTimeout\(function \(\) {[\s\n]*var activeVideo = \$\("\.w-slider-slide\.w-active \.video-slider"\)\[0\];[\s\n]*if \(activeVideo\) {[\s\n]*activeVideo\.play\(\);[\s\n]*}[\s\n]*}, 100\); \/\/ Timeout ensures the active class has been updated[\s\n]*}\);[\s\n]*}\);[\s\n]*<\/script>/g;
    
    match = indexJsRegex.exec(content);
    if (match) {
      customJsToAppend += '\n/* index.html video slider script */\n';
      customJsToAppend += match[0].replace(/<script>|<\/script>/g, '').trim() + '\n';
      content = content.replace(indexJsRegex, '<!-- Index video script moved to main.js -->');
    }
  }

  if (file === 'detail_classes.html') {
    const detailJsRegex = /<script>[\s\n]*\(function \(\) {[\s\n]*const lightbox = document\.getElementById\('galleryLightbox'\);[\s\n]*const lightboxImg = document\.getElementById\('lightboxImg'\);[\s\n]*const closeLightbox = document\.getElementById\('closeLightbox'\);[\s\n]*const galleryImages = document\.querySelectorAll\('\.image-gallery'\);[\s\n]*if \(!lightbox \|\| !lightboxImg \|\| !closeLightbox \|\| galleryImages\.length === 0\) return;[\s\n]*galleryImages\.forEach\(\(img\) => {[\s\n]*img\.addEventListener\('click', \(\) => {[\s\n]*lightboxImg\.src = img\.src;[\s\n]*lightbox\.classList\.add\('active'\);[\s\n]*}\);[\s\n]*}\);[\s\n]*closeLightbox\.addEventListener\('click', \(\) => {[\s\n]*lightbox\.classList\.remove\('active'\);[\s\n]*}\);[\s\n]*lightbox\.addEventListener\('click', \(e\) => {[\s\n]*if \(e\.target === lightbox\) {[\s\n]*lightbox\.classList\.remove\('active'\);[\s\n]*}[\s\n]*}\);[\s\n]*}\)\(\);[\s\n]*<\/script>/g;

    let match = detailJsRegex.exec(content);
    if (match) {
      customJsToAppend += '\n/* detail_classes.html lightbox script */\n';
      customJsToAppend += match[0].replace(/<script>|<\/script>/g, '').trim() + '\n';
      content = content.replace(detailJsRegex, '<!-- Detail classes lightbox script moved to main.js -->');
    }
  }

  // Write file back
  fs.writeFileSync(file, content, 'utf8');
});

fs.appendFileSync('css/custom.css', customCssToAppend, 'utf8');
fs.appendFileSync('js/main.js', customJsToAppend, 'utf8');
console.log('Update complete.');

const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let customCssToAppend = '';
let customJsToAppend = '';

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Minified GSAP
  content = content.replace(/<script type="text\/javascript">[\s\n]*gsap\.registerPlugin\(Observer,SplitText,ScrollTrigger\);[\s\n]*<\/script>/g, '<!-- Global GSAP Initialization moved to main.js -->');
  
  // Corporate GSAP with comments
  content = content.replace(/<script type="text\/javascript">[\s\n]*gsap\.registerPlugin\(Observer, SplitText, ScrollTrigger\);[\s\n]*\/\/ Select the accordion wrap and list items[\s\S]*?<\/script>/g, (match) => {
    // wait, corporate has custom GSAP script!
    customJsToAppend += '\n/* corporate.html GSAP accordion script */\n' + match.replace(/<\/?script[^>]*>/g, '').trim() + '\n';
    return '<!-- Corporate accordion script moved to main.js -->';
  });

  // Typography Style generic catch-all (matches the font-smoothing logic)
  content = content.replace(/<style>[\s\n]*\* {[\s\S]*?optimizeLegibility;[\s\S]*?}[\s\n]*<\/style>/g, '<!-- Boilerplate Typography Style moved to custom.css -->');

  if (file === 'detail_classes.html') {
    const detailJsRegex = /<script>[\s\n]*\(function \(\) {[\s\n]*const lightbox = document\.getElementById[\s\S]*?}\)\(\);[\s\n]*<\/script>/g;
    let match = detailJsRegex.exec(content);
    if (match) {
      customJsToAppend += '\n/* detail_classes.html lightbox script */\n' + match[0].replace(/<\/?script>/g, '').trim() + '\n';
      content = content.replace(detailJsRegex, '<!-- Detail classes lightbox script moved to main.js -->');
    }
  }

  if (file === 'index.html') {
    const indexJsRegex = /<script>[\s\n]*\$\(document\)\.ready\(function \(\) {[\s\n]*\/\/ Make sure all videos start paused[\s\S]*?}\);[\s\n]*<\/script>/g;
    let match = indexJsRegex.exec(content);
    if (match) {
      customJsToAppend += '\n/* index.html video slider script */\n' + match[0].replace(/<\/?script>/g, '').trim() + '\n';
      content = content.replace(indexJsRegex, '<!-- Index video script moved to main.js -->');
    }
  }

  if (file === '401.html') {
    const passRegex = /<script type="application\/javascript">\(function _handlePasswordPageOnload\(\) {[\s\S]*?}\)\(\);<\/script>/g;
    let match = passRegex.exec(content);
    if (match) {
      customJsToAppend += '\n/* 401.html password page script */\n' + match[0].replace(/<\/?script[^>]*>/g, '').trim() + '\n';
      content = content.replace(passRegex, '<!-- 401 password script moved to main.js -->');
    }
  }

  fs.writeFileSync(file, content, 'utf8');
});

if (customCssToAppend) fs.appendFileSync('css/custom.css', customCssToAppend, 'utf8');
if (customJsToAppend) fs.appendFileSync('js/main.js', customJsToAppend, 'utf8');
console.log('Update 2 complete.');

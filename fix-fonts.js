const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

// Fix 1: Wrap char splitting in document.fonts.ready
content = content.replace(
  /if \(titleLine1 && titleLine2\) \{\s*\n\s*chars1 = splitTextToChars\(titleLine1\);\s*\n\s*chars2 = splitTextToChars\(titleLine2\);\s*\n\}/,
  `// Wait for fonts to load before splitting text to prevent broken character positions
const fontsSplit = document.fonts.ready.then(() => {
  if (titleLine1 && titleLine2) {
    chars1 = splitTextToChars(titleLine1);
    chars2 = splitTextToChars(titleLine2);
  }
});`
);

// Fix 2: Wrap heroTl creation to wait for fontsSplit
content = content.replace(
  /const heroTl = gsap\.timeline\(\{ delay: 0\.3 \}\);/,
  `// Wait for fonts + char split before running hero animation
fontsSplit.then(() => {
const heroTl = gsap.timeline({ delay: 0.3 });`
);

// Fix 3: Close the fontsSplit.then block after heroTl.call(createLightSweep)
content = content.replace(
  /heroTl\.call\(createLightSweep\);/,
  `heroTl.call(createLightSweep);
}); // end fontsSplit.then`
);

fs.writeFileSync('main.js', content, 'utf8');
console.log('DONE - fonts fix applied');

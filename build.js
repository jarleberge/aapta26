/* Bygger en selvstendig HTML-fil (dist/index.html) med CSS og JS inlinet.
   Kjør: node build.js   */
const fs = require('fs');
const path = require('path');

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

let html = read('index.html');

html = html.replace(
  '<link rel="stylesheet" href="styles.css">',
  '<style>\n' + read('styles.css') + '\n</style>'
);

html = html.replace(
  '<script src="data.js"></script>\n<script src="app.js"></script>',
  '<script>\n' + read('data.js') + '\n</script>\n<script>\n' + read('app.js') + '\n</script>'
);

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), html);
console.log('dist/index.html skrevet (' + Math.round(html.length / 1024) + ' kB)');

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '..', '..', '..', 'articles');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images');

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];

function copyImages(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    return 0;
  }

  let count = 0;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);

    if (entry.isDirectory()) {
      count += copyImages(srcPath, destDir);
    } else if (IMAGE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(srcPath, path.join(destDir, entry.name));
      count++;
    }
  }

  return count;
}

function main() {
  console.log('Copying images from articles/ to public/images/...');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const count = copyImages(ARTICLES_DIR, OUTPUT_DIR);
  console.log(`Done. Copied ${count} image(s).`);
}

main();

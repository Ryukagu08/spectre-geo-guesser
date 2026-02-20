import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ASSETS_DIR = 'static/assets';

async function processDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (entry.isFile() && /\.(png|jpg|jpeg)$/i.test(entry.name)) {
            const ext = path.extname(entry.name);
            const name = path.basename(entry.name, ext);
            const targetPath = path.join(dir, `${name}.webp`);

            if (!fs.existsSync(targetPath)) {
                console.log(`Converting: ${entry.name} -> ${name}.webp`);
                try {
                    await sharp(fullPath)
                        .webp({ quality: 80 }) // Reasonable quality/size balance
                        .toFile(targetPath);
                } catch (e) {
                    console.error(`Failed to convert ${entry.name}:`, e.message);
                }
            } else {
                // console.log(`Skipping: ${entry.name} (WebP exists)`);
            }
        }
    }
}

console.log('Starting WebP conversion...');
if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Directory not found: ${ASSETS_DIR}`);
    process.exit(1);
}

processDirectory(ASSETS_DIR).then(() => {
    console.log('Conversion complete!');
}).catch(err => {
    console.error('Error:', err);
});

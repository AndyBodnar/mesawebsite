import fs from 'fs';
import path from 'path';
import dxt from 'dxt-js';
import sharp from 'sharp';

const DDS_DIR = 'D:/five m/oulsen_satmap-main/nogrid/dds';
const OUTPUT_DIR = 'D:/blkms/web/public';

const ALL_TILES = [
  'minimap_sea_0_0.dds',
  'minimap_sea_1_0.dds',
  'minimap_sea_2_0.dds',
  'minimap_sea_0_1.dds',
  'minimap_sea_1_1.dds',
  'minimap_sea_2_1.dds',
];

function parseDDSHeader(buffer) {
  const magic = buffer.toString('ascii', 0, 4);
  if (magic !== 'DDS ') throw new Error('Not a DDS file');
  const height = buffer.readUInt32LE(12);
  const width = buffer.readUInt32LE(16);
  return { width, height };
}

function decodeDXT5(buffer, width, height) {
  const headerSize = 128;
  const imageData = buffer.slice(headerSize);
  const flags = dxt.flags.DXT5;
  return dxt.decompress(imageData, width, height, flags);
}

async function main() {
  console.log('Saving individual tiles for inspection...\n');

  for (const filename of ALL_TILES) {
    const filePath = path.join(DDS_DIR, filename);
    console.log(`Processing ${filename}...`);

    const buffer = fs.readFileSync(filePath);
    const { width, height } = parseDDSHeader(buffer);
    const rgba = decodeDXT5(buffer, width, height);

    // Extract coordinates from filename (minimap_sea_X_Y.dds)
    const match = filename.match(/minimap_sea_(\d+)_(\d+)\.dds/);
    const x = match[1];
    const y = match[2];

    const outputName = `debug_tile_x${x}_y${y}.jpg`;
    await sharp(Buffer.from(rgba), {
      raw: { width, height, channels: 4 }
    })
    .resize(1024) // Smaller for quick viewing
    .jpeg({ quality: 85 })
    .toFile(path.join(OUTPUT_DIR, outputName));

    console.log(`  Saved ${outputName}`);
  }

  console.log('\nDone! Check debug_tile_xX_yY.jpg files in public folder.');
  console.log('Identify which tile shows which area of the map.');
}

main();

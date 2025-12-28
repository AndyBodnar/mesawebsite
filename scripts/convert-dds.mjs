import fs from 'fs';
import path from 'path';
import dxt from 'dxt-js';
import sharp from 'sharp';

const DDS_DIR = 'D:/five m/oulsen_satmap-main/nogrid/dds';
const OUTPUT_DIR = 'D:/blkms/web/public';

// Tile layout: 2 columns x 3 rows
// Interpretation: X_Y in filename means row X, column Y
const TILES = [
  ['minimap_sea_0_0.dds', 'minimap_sea_0_1.dds'],  // Row 0 (top)
  ['minimap_sea_1_0.dds', 'minimap_sea_1_1.dds'],  // Row 1 (middle)
  ['minimap_sea_2_0.dds', 'minimap_sea_2_1.dds'],  // Row 2 (bottom)
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

async function processTile(filename) {
  const filePath = path.join(DDS_DIR, filename);
  console.log(`  Processing ${filename}...`);

  const buffer = fs.readFileSync(filePath);
  const { width, height } = parseDDSHeader(buffer);
  const rgba = decodeDXT5(buffer, width, height);

  const pngBuffer = await sharp(Buffer.from(rgba), {
    raw: { width, height, channels: 4 }
  }).png().toBuffer();

  return { pngBuffer, width, height };
}

async function main() {
  try {
    console.log('Converting GTA V map tiles...\n');

    const numRows = TILES.length;
    const numCols = TILES[0].length;

    // Process all tiles
    const tileBuffers = [];
    let tileWidth = 0;
    let tileHeight = 0;

    for (let row = 0; row < numRows; row++) {
      const rowBuffers = [];
      for (let col = 0; col < numCols; col++) {
        const tile = await processTile(TILES[row][col]);
        rowBuffers.push(tile.pngBuffer);
        tileWidth = tile.width;
        tileHeight = tile.height;
      }
      tileBuffers.push(rowBuffers);
    }

    console.log(`\nTile size: ${tileWidth}x${tileHeight}`);
    const finalWidth = tileWidth * numCols;
    const finalHeight = tileHeight * numRows;
    console.log(`Layout: ${numCols} columns x ${numRows} rows`);
    console.log(`Final map size: ${finalWidth}x${finalHeight}`);

    console.log('\nStitching rows...');

    // Stitch each row horizontally
    const rowImages = [];
    for (let row = 0; row < numRows; row++) {
      const composites = [];
      for (let col = 0; col < numCols; col++) {
        composites.push({ input: tileBuffers[row][col], left: col * tileWidth, top: 0 });
      }

      const rowImage = await sharp({
        create: {
          width: finalWidth,
          height: tileHeight,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        }
      })
      .composite(composites)
      .png()
      .toBuffer();

      rowImages.push(rowImage);
      console.log(`  Row ${row + 1} done`);
    }

    console.log('\nCombining rows...');

    // Combine all rows vertically
    const composites = [];
    for (let row = 0; row < numRows; row++) {
      composites.push({ input: rowImages[row], left: 0, top: row * tileHeight });
    }

    const outputPath = path.join(OUTPUT_DIR, 'gtav-map.jpg');
    await sharp({
      create: {
        width: finalWidth,
        height: finalHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(outputPath);

    console.log(`\nSaved: ${outputPath}`);

    // Create smaller version
    const smallPath = path.join(OUTPUT_DIR, 'gtav-map-small.jpg');
    await sharp(outputPath)
      .resize(2048)
      .jpeg({ quality: 85 })
      .toFile(smallPath);

    console.log(`Saved smaller version: ${smallPath}`);

    console.log('\nDone!');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();

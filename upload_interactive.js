const fs = require('fs');
const path = require('path');
const readline = require('readline');
let sharp;

try {
  sharp = require('sharp');
} catch (e) {
  console.warn('Advertencia: No se pudo cargar la librería "sharp". Las conversiones automáticas no estarán disponibles.');
}

const ACCOUNT_ID = '8026bf76e439e5df731c363ac4a1c4c9';
const API_TOKEN = 'cfut_nN9Jvs8EPWAfeAA8WGsb7yYyIPKSOFhujn62Fgd49a40733c';
const IMAGE_PATH = 'C:\\Users\\efagu\\OneDrive\\Fotos\\Clasificados\\lentesRaibanFerrari.avif';

// Formatos aceptados por Cloudflare Images
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/svg+xml'
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.svg'];

// Función para obtener tipo MIME aproximado por extensión
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.heic':
      return 'image/heic';
    case '.svg':
      return 'image/svg+xml';
    case '.avif':
      return 'image/avif';
    default:
      return 'application/octet-stream';
  }
}

// Función para subir una imagen a Cloudflare Images
async function uploadToCloudflare(fileBuffer, fileName, mimeType) {
  console.log(`\nSubiendo "${fileName}" (${mimeType}) a Cloudflare Images...`);
  const boundary = '----CloudflareImagesUploadBoundary' + Math.random().toString(16);
  
  const header = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: ${mimeType}\r\n\r\n`;
  const footer = `\r\n--${boundary}--\r\n`;

  const bodyBuffer = Buffer.concat([
    Buffer.from(header, 'utf-8'),
    fileBuffer,
    Buffer.from(footer, 'utf-8')
  ]);

  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length
      },
      body: bodyBuffer
    });

    const result = await response.json();
    if (result.success) {
      console.log('\n==================================================');
      console.log('¡ÉXITO! Imagen subida correctamente.');
      console.log('ID de Imagen:', result.result.id);
      console.log('Enlace Público:', result.result.variants[0]);
      console.log('==================================================\n');
    } else {
      console.error('\nError devuelto por Cloudflare:', result.errors);
    }
  } catch (error) {
    console.error('Error de red al realizar la subida:', error);
  }
}

// Lógica principal
async function main() {
  if (!fs.existsSync(IMAGE_PATH)) {
    console.error(`El archivo no existe en la ruta especificada: ${IMAGE_PATH}`);
    return;
  }

  const fileName = path.basename(IMAGE_PATH);
  const ext = path.extname(IMAGE_PATH).toLowerCase();
  const originalMime = getMimeType(IMAGE_PATH);

  console.log(`Archivo detectado: ${fileName}`);
  console.log(`Tipo MIME: ${originalMime}`);

  // Verificar si es un formato permitido
  if (ALLOWED_MIME_TYPES.includes(originalMime)) {
    console.log('El formato es compatible con Cloudflare Images. Procediendo a subir directamente...');
    const fileBuffer = fs.readFileSync(IMAGE_PATH);
    await uploadToCloudflare(fileBuffer, fileName, originalMime);
  } else {
    // Formato no aceptado
    console.log('\n⚠️ ADVERTENCIA ⚠️');
    console.log(`El formato "${ext}" (${originalMime}) NO es soportado directamente por Cloudflare Images.`);
    console.log('Cloudflare Images solo acepta: JPEG, PNG, WEBP, GIF, HEIC y SVG.');

    if (!sharp) {
      console.error('No se puede proceder con la conversión porque la librería "sharp" no está instalada.');
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\n¿Desea convertir automáticamente la imagen a formato WEBP para poder subirla? (s/n): ', async (answer) => {
      rl.close();
      if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\nConvirtiendo imagen a WEBP...');
        try {
          const convertedBuffer = await sharp(IMAGE_PATH)
            .webp({ quality: 85 })
            .toBuffer();

          const newFileName = fileName.replace(path.extname(fileName), '.webp');
          console.log(`Conversión completada. Nuevo archivo virtual: ${newFileName}`);
          
          await uploadToCloudflare(convertedBuffer, newFileName, 'image/webp');
        } catch (err) {
          console.error('Error al realizar la conversión de la imagen:', err);
        }
      } else {
        console.log('Operación cancelada por el usuario. No se subió la imagen.');
      }
    });
  }
}

main();

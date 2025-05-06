const fs = require('fs');
const path = require('path');

// Colores para la salida en consola
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🚀 Copiando assets para GitHub Pages...${colors.reset}`);

// Directorio de assets
const assetsDir = path.join(__dirname, '../attached_assets');
const distAssetsDir = path.join(__dirname, '../dist/assets');

// Crear directorio de assets en dist si no existe
if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir, { recursive: true });
}

// Leer todos los archivos en el directorio de assets
try {
  const files = fs.readdirSync(assetsDir);
  
  // Filtrar solo archivos de video
  const videoFiles = files.filter(file => 
    file.endsWith('.mp4') || 
    file.endsWith('.webm') || 
    file.endsWith('.ogg')
  );
  
  console.log(`${colors.yellow}🎬 Copiando ${videoFiles.length} archivos de video...${colors.reset}`);
  
  // Copiar cada archivo de video
  videoFiles.forEach(file => {
    const sourcePath = path.join(assetsDir, file);
    const destPath = path.join(distAssetsDir, file);
    
    console.log(`${colors.reset}  - ${file}`);
    fs.copyFileSync(sourcePath, destPath);
  });
  
  console.log(`${colors.green}✅ Todos los assets copiados correctamente.${colors.reset}`);
  
} catch (error) {
  console.error(`${colors.red}❌ Error al copiar assets:${colors.reset}`, error);
}
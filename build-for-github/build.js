const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🚀 Iniciando construcción para GitHub Pages...${colors.reset}`);

// Create dist directory if it doesn't exist
console.log(`${colors.yellow}📁 Creando directorios...${colors.reset}`);
if (!fs.existsSync(path.join(__dirname, '../dist'))) {
  fs.mkdirSync(path.join(__dirname, '../dist'));
}

// Run build command
try {
  console.log(`${colors.yellow}🔨 Construyendo aplicación estática...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log(`${colors.green}✅ Construcción completada!${colors.reset}`);
  
  // Copy files for GitHub Pages
  console.log(`${colors.yellow}📋 Copiando archivos para GitHub Pages...${colors.reset}`);
  
  // Create index.html for GitHub Pages root
  const indexHtml = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');
  fs.writeFileSync(path.join(__dirname, '../dist/index.html'), indexHtml);
  
  // Create .nojekyll file to disable Jekyll processing
  fs.writeFileSync(path.join(__dirname, '../dist/.nojekyll'), '');
  
  console.log(`${colors.green}✅ ¡Listo para GitHub Pages!${colors.reset}`);
  console.log(`${colors.blue}📝 Instrucciones:${colors.reset}`);
  console.log(`${colors.reset}1. Copia todo el contenido de la carpeta 'dist' a tu repositorio de GitHub`);
  console.log(`${colors.reset}2. Activa GitHub Pages en la configuración del repositorio`);
  console.log(`${colors.reset}3. Selecciona la rama main/master y la carpeta raíz como fuente`);
  
} catch (error) {
  console.error(`${colors.red}❌ Error durante la construcción:${colors.reset}`, error);
  process.exit(1);
}
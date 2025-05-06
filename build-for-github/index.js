const { execSync } = require('child_process');

// Colores para la salida en consola
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}==============================================${colors.reset}`);
console.log(`${colors.blue}   CONSTRUYENDO APP PARA GITHUB PAGES${colors.reset}`);
console.log(`${colors.blue}==============================================${colors.reset}`);

try {
  // Paso 1: Construcción principal
  console.log(`\n${colors.yellow}[PASO 1/3] Construyendo la aplicación${colors.reset}`);
  execSync('node build-for-github/githubBuild.js', { stdio: 'inherit' });
  
  // Paso 2: Copiar assets
  console.log(`\n${colors.yellow}[PASO 2/3] Copiando assets${colors.reset}`);
  execSync('node build-for-github/copyAssets.js', { stdio: 'inherit' });
  
  // Paso 3: Generar reporte
  console.log(`\n${colors.yellow}[PASO 3/3] Generando reporte${colors.reset}`);
  
  // Verificar tamaño de la carpeta dist
  execSync('du -sh dist', { stdio: 'inherit' });
  
  // Mensaje final
  console.log(`\n${colors.green}==============================================${colors.reset}`);
  console.log(`${colors.green}   ¡CONSTRUCCIÓN COMPLETADA CON ÉXITO!${colors.reset}`);
  console.log(`${colors.green}==============================================${colors.reset}`);
  console.log(`\n${colors.blue}Instrucciones para GitHub Pages:${colors.reset}`);
  console.log(`${colors.reset}1. Copia el contenido de la carpeta 'dist' a la raíz de tu repositorio de GitHub`);
  console.log(`${colors.reset}2. Ve a la configuración de tu repositorio > Pages`);
  console.log(`${colors.reset}3. En "Source", selecciona "Deploy from a branch"`);
  console.log(`${colors.reset}4. Selecciona tu rama principal (main/master) y la carpeta raíz (/)`);
  console.log(`${colors.reset}5. Haz clic en "Save" y espera a que se despliegue`);
  
} catch (error) {
  console.error(`\n${colors.red}❌ ERROR: La construcción ha fallado${colors.reset}`);
  console.error(error);
  process.exit(1);
}
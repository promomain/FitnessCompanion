import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para la salida en consola
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🚀 Iniciando construcción para GitHub Pages...${colors.reset}`);

// Crear directorio dist si no existe
console.log(`${colors.yellow}📁 Creando directorios...${colors.reset}`);
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

try {
  // Copiar archivos de GitHub Pages
  console.log(`${colors.yellow}📋 Copiando archivos para la compilación...${colors.reset}`);
  
  // Copiar archivos de configuración temporales
  fs.copyFileSync(
    path.join(__dirname, 'vite.github.config.ts'),
    path.join(__dirname, '../vite.github.config.ts')
  );
  
  // Copiar versiones modificadas de queryClient y mockStorage
  const clientLibDir = path.join(__dirname, '../client/src/lib');
  if (!fs.existsSync(path.join(clientLibDir, 'backup'))) {
    fs.mkdirSync(path.join(clientLibDir, 'backup'));
  }
  
  // Hacer respaldo de queryClient.ts
  if (fs.existsSync(path.join(clientLibDir, 'queryClient.ts'))) {
    fs.copyFileSync(
      path.join(clientLibDir, 'queryClient.ts'),
      path.join(clientLibDir, 'backup/queryClient.original.ts')
    );
  }
  
  // Copiar versión de GitHub Pages
  fs.copyFileSync(
    path.join(__dirname, 'queryClient.github.ts'),
    path.join(clientLibDir, 'queryClient.ts')
  );
  
  // Copiar mockStorage.ts al mismo directorio
  fs.copyFileSync(
    path.join(__dirname, 'mockStorage.ts'),
    path.join(clientLibDir, 'mockStorage.ts')
  );
  
  // Ejecutar comando de compilación
  console.log(`${colors.yellow}🔨 Construyendo aplicación estática...${colors.reset}`);
  execSync('npx vite build --config vite.github.config.ts', { stdio: 'inherit' });
  
  // Crear archivo .nojekyll para GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  
  // Restaurar archivos originales
  console.log(`${colors.yellow}🔄 Restaurando archivos originales...${colors.reset}`);
  if (fs.existsSync(path.join(clientLibDir, 'backup/queryClient.original.ts'))) {
    fs.copyFileSync(
      path.join(clientLibDir, 'backup/queryClient.original.ts'),
      path.join(clientLibDir, 'queryClient.ts')
    );
  }
  
  // Eliminar mockStorage.ts si existe
  if (fs.existsSync(path.join(clientLibDir, 'mockStorage.ts'))) {
    fs.unlinkSync(path.join(clientLibDir, 'mockStorage.ts'));
  }
  
  // Eliminar archivo de configuración temporal
  if (fs.existsSync(path.join(__dirname, '../vite.github.config.ts'))) {
    fs.unlinkSync(path.join(__dirname, '../vite.github.config.ts'));
  }
  
  // Eliminar directorio de respaldo
  if (fs.existsSync(path.join(clientLibDir, 'backup'))) {
    fs.rmSync(path.join(clientLibDir, 'backup'), { recursive: true, force: true });
  }
  
  console.log(`${colors.green}✅ ¡Listo para GitHub Pages!${colors.reset}`);
  console.log(`${colors.blue}📝 Instrucciones:${colors.reset}`);
  console.log(`${colors.reset}1. Copia todo el contenido de la carpeta 'dist' a tu repositorio de GitHub`);
  console.log(`${colors.reset}2. Activa GitHub Pages en la configuración del repositorio`);
  console.log(`${colors.reset}3. Selecciona la rama main/master y la carpeta raíz como fuente`);
  
} catch (error) {
  console.error(`${colors.red}❌ Error durante la construcción:${colors.reset}`, error);
  process.exit(1);
}
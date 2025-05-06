import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Colores para mensajes
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const NC = '\x1b[0m'; // No Color

console.log(`${BLUE}🚀 Iniciando la compilación para GitHub Pages...${NC}`);

try {
  // Asegurarse de que exista el directorio para los videos
  const videosDir = path.join('client', 'public', 'videos');
  if (!fs.existsSync(videosDir)) {
    console.log(`${YELLOW}📁 Creando directorio para videos...${NC}`);
    fs.mkdirSync(videosDir, { recursive: true });
  }

  // Copiar los videos al directorio público
  console.log(`${YELLOW}🎬 Copiando videos a la carpeta pública...${NC}`);
  const videoFiles = fs.readdirSync('attached_assets').filter(file => file.startsWith('video') && file.endsWith('.mp4'));
  
  for (const videoFile of videoFiles) {
    const sourcePath = path.join('attached_assets', videoFile);
    const destinationPath = path.join(videosDir, videoFile);
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(`  - Copiado: ${videoFile}`);
  }

  // Crear una copia temporal de exercise-data.ts
  const exerciseDataPath = path.join('client', 'src', 'lib', 'exercise-data.ts');
  const backupPath = exerciseDataPath + '.bak';
  
  console.log(`${YELLOW}🔄 Creando copia de seguridad de exercise-data.ts...${NC}`);
  fs.copyFileSync(exerciseDataPath, backupPath);
  
  // Modificar las rutas de video en el archivo
  console.log(`${YELLOW}🔄 Actualizando rutas de video para la versión web...${NC}`);
  let exerciseData = fs.readFileSync(exerciseDataPath, 'utf8');
  exerciseData = exerciseData.replace(/@assets\/video/g, 'videos/video');
  fs.writeFileSync(exerciseDataPath, exerciseData);
  
  // Crear un componente temporal de Toaster
  console.log(`${YELLOW}🔄 Creando componentes compatibles con build...${NC}`);
  
  const toasterPath = path.join('client', 'src', 'components', 'toaster.tsx');
  const toasterContent = `
// Versión simplificada para build
import { useToast } from "../hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
`;
  fs.writeFileSync(toasterPath, toasterContent);

  // Actualizar App.tsx temporalmente
  const appPath = path.join('client', 'src', 'App.tsx');
  const appBackupPath = appPath + '.bak';
  
  console.log(`${YELLOW}🔄 Creando copia de seguridad de App.tsx...${NC}`);
  fs.copyFileSync(appPath, appBackupPath);
  
  // Modificar App.tsx para usar el componente local
  let appContent = fs.readFileSync(appPath, 'utf8');
  appContent = appContent.replace(
    'import { Toaster } from "@/components/ui/toaster";', 
    'import { Toaster } from "./components/toaster";'
  );
  fs.writeFileSync(appPath, appContent);

  // Construir la aplicación
  console.log(`${YELLOW}🔨 Compilando la aplicación...${NC}`);
  
  // Usar execSync para ejecutar el comando de construcción
  execSync('cd client && npx vite build --base="./" --outDir="../dist"', { stdio: 'inherit' });
  
  // Crear archivo .nojekyll para GitHub Pages
  fs.writeFileSync(path.join('dist', '.nojekyll'), '');
  
  // Restaurar los archivos originales
  console.log(`${YELLOW}🔄 Restaurando archivos originales...${NC}`);
  fs.copyFileSync(backupPath, exerciseDataPath);
  fs.unlinkSync(backupPath);
  
  fs.copyFileSync(appBackupPath, appPath);
  fs.unlinkSync(appBackupPath);
  
  // Eliminar el archivo temporal de Toaster
  if (fs.existsSync(toasterPath)) {
    fs.unlinkSync(toasterPath);
  }
  
  console.log(`${GREEN}✅ ¡Construcción completada con éxito!${NC}`);
  console.log(`${BLUE}📝 Instrucciones para GitHub Pages:${NC}`);
  console.log(`1. Sube todo el contenido de la carpeta 'dist' a tu repositorio de GitHub`);
  console.log(`2. Configura GitHub Pages para usar la rama principal y la carpeta raíz`);
  console.log(`3. Tu aplicación estará disponible en https://TU_USUARIO.github.io/TU_REPOSITORIO`);
  
} catch (error) {
  console.error(`${RED}❌ Error en la compilación:${NC}`, error);
  
  // Intentar restaurar los archivos en caso de error
  const exerciseDataPath = path.join('client', 'src', 'lib', 'exercise-data.ts');
  const backupPath = exerciseDataPath + '.bak';
  
  if (fs.existsSync(backupPath)) {
    console.log(`${YELLOW}🔄 Restaurando archivo exercise-data.ts desde backup...${NC}`);
    fs.copyFileSync(backupPath, exerciseDataPath);
    fs.unlinkSync(backupPath);
  }
  
  const appPath = path.join('client', 'src', 'App.tsx');
  const appBackupPath = appPath + '.bak';
  
  if (fs.existsSync(appBackupPath)) {
    console.log(`${YELLOW}🔄 Restaurando archivo App.tsx desde backup...${NC}`);
    fs.copyFileSync(appBackupPath, appPath);
    fs.unlinkSync(appBackupPath);
  }
  
  const toasterPath = path.join('client', 'src', 'components', 'toaster.tsx');
  if (fs.existsSync(toasterPath)) {
    fs.unlinkSync(toasterPath);
  }
  
  process.exit(1);
}
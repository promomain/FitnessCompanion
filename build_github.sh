#!/bin/bash

# Colores para mensajes
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando la compilación para GitHub Pages...${NC}"

# Asegurarse de que exista el directorio para los videos
if [ ! -d "client/public/videos" ]; then
  echo -e "${YELLOW}📁 Creando directorio para videos...${NC}"
  mkdir -p client/public/videos
fi

# Copiar los videos al directorio público de la aplicación para que se incluyan en el build
echo -e "${YELLOW}🎬 Copiando videos a la carpeta pública...${NC}"
cp -v attached_assets/video*.mp4 client/public/videos/

# Modificar temporalmente las rutas de video en el archivo de datos
echo -e "${YELLOW}🔄 Actualizando rutas de video para la versión web...${NC}"
sed -i.bak 's|@assets/video|videos/video|g' client/src/lib/exercise-data.ts

# Construir la aplicación con base relativa para GitHub Pages
echo -e "${YELLOW}🔨 Compilando la aplicación...${NC}"
cd client && npx vite build --base="./" --outDir="../dist"
BUILD_RESULT=$?

# Restaurar el archivo original
echo -e "${YELLOW}🔄 Restaurando archivos originales...${NC}"
mv client/src/lib/exercise-data.ts.bak client/src/lib/exercise-data.ts

# Crear archivo .nojekyll para GitHub Pages
touch dist/.nojekyll

if [ $BUILD_RESULT -eq 0 ]; then
  echo -e "${GREEN}✅ ¡Construcción completada con éxito!${NC}"
  echo -e "${BLUE}📝 Instrucciones para GitHub Pages:${NC}"
  echo -e "1. Sube todo el contenido de la carpeta 'dist' a tu repositorio de GitHub"
  echo -e "2. Configura GitHub Pages para usar la rama principal y la carpeta raíz"
  echo -e "3. Tu aplicación estará disponible en https://TU_USUARIO.github.io/TU_REPOSITORIO"
else
  echo -e "${RED}❌ Error en la compilación${NC}"
fi
# Instrucciones para desplegar en GitHub Pages

Este directorio contiene scripts para preparar la aplicación para ser desplegada en GitHub Pages.

## Pasos para el despliegue

1. **Preparar la aplicación:**
   ```bash
   node build-for-github/index.js
   ```
   Este comando construirá la aplicación y la preparará para GitHub Pages, copiando todos los assets necesarios.

2. **Copiar los archivos:**
   - Copia el contenido de la carpeta `dist` a la raíz de tu repositorio de GitHub.
   - Asegúrate de incluir el archivo `.nojekyll` para que GitHub no procese el sitio con Jekyll.

3. **Configurar GitHub Pages:**
   - Ve a la configuración del repositorio > Pages
   - En "Source", selecciona "Deploy from a branch" 
   - Selecciona la rama principal (main/master) y la carpeta raíz (/)
   - Haz clic en "Save" y espera a que se despliegue

La aplicación se desplegará en la URL: `https://tu-usuario.github.io/tu-repositorio/`

## Requisitos

- Node.js 14 o superior
- Un repositorio de GitHub

## Estructura de archivos generados

```
dist/
├── .nojekyll           # Evita el procesamiento de Jekyll
├── index.html          # Página principal
├── assets/             # Archivos estáticos (videos, imágenes)
└── ...                 # Otros archivos de la aplicación
```

## Solución de problemas

Si tienes problemas con los videos, asegúrate de que:
1. Los archivos de video se encuentren correctamente en la carpeta `dist/assets/`
2. Las rutas en el código estén correctamente referenciadas
3. No existan restricciones CORS en GitHub Pages
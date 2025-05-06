import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuración específica para GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: "./", // Base path para URLs relativas
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../client/src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  define: {
    // Definir que se está construyendo para GitHub Pages
    'process.env.GITHUB_PAGES': JSON.stringify(true),
  },
  assetsInclude: ['**/*.mp4'], // Incluir archivos de video en el build
  publicDir: path.resolve(__dirname, '../attached_assets'), // Para copiar los videos
  // Establecer directorio raíz
  root: path.resolve(__dirname, ".."),
  build: {
    outDir: path.resolve(__dirname, "../dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, '../client/index.html'), // Especificar el archivo de entrada explícitamente
      output: {
        manualChunks: {
          // Separar en chunks para mejor rendimiento
          'vendor': ['react', 'react-dom'],
          'ui': ['@/components/ui/'] 
        }
      }
    }
  },
});
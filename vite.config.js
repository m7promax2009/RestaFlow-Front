<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
>>>>>>> origin/feature/madina-dashboard-cashier

export default defineConfig({
  plugins: [react(), tailwindcss()],
<<<<<<< HEAD
})
=======
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/features/cashier/utils'),
      '@components': path.resolve(__dirname, 'src/features/cashier/components'),
    },
  },
});
>>>>>>> origin/feature/madina-dashboard-cashier

// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ggg/', // 👈 仓库名，必须以 `/` 开头和结尾
});

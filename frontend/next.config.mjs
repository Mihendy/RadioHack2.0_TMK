/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Игнорировать ошибки ESLint при сборке, чтобы билд не падал
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Игнорировать ошибки TypeScript при сборке (не рекомендуется для продакшна)
    ignoreBuildErrors: true,
  },
  images: {
    // Отключить оптимизацию изображений Next.js (например, для локальной разработки)
    unoptimized: true,
  },
};

export default nextConfig;

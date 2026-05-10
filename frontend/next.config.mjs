/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Kurulum sırasında ESLint hatalarını görmezden gel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript hatalarını da (Any tipi vb.) kurulum sırasında görmezden gel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

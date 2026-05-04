/** @type {import('next').NextConfig} */
const nextConfig = {
  // productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Add experimental ESM support
  experimental: {
    esmExternals: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pixabay.com',
      },
    ],
  },
  
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/homepage',
  //       permanent: false,
  //     },
  //   ];
  // },
  
  webpack(config, { isServer }) {
    // Only apply this loader on the client side to avoid ESM issues
    if (!isServer) {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: [/node_modules/],
        use: [{
          loader: '@dhiwise/component-tagger/nextLoader',
        }],
      });
    }
    
    // Ensure proper handling of file URLs on Windows
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
};

export default nextConfig;
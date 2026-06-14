/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.DIST_DIR || '.next',

  // Compress responses with gzip
  compress: true,

  // Don't expose the X-Powered-By: Next.js header
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    esmExternals: true,
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'lucide-react',
      '@heroicons/react',
      'react-icons',
      '@mui/icons-material',
    ],
  },

  images: {
    // Enable WebP/AVIF for all remote images
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '**' },
      { protocol: 'https', hostname: 'images.pixabay.com', pathname: '**' },
      { protocol: 'https', hostname: 'img.rocket.new', pathname: '**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '**' },
    ],
    // Cache optimized images for 60 days
    minimumCacheTTL: 60 * 60 * 24 * 60,
  },

  webpack(config, { isServer, dev }) {
    // Only apply the design-tool component tagger in development on the client side
    if (!isServer && dev) {
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
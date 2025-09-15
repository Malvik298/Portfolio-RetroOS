
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  basePath: '/portfolio',
  output: 'export',
  assetPrefix: '/portfolio',
  env: {
    basePath: '/portfolio',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/portfolio',
        basePath: false,
        permanent: true,
      },
    ]
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    compiler: {
      // Enables the styled-components SWC transform
      styledComponents: true
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'aocthgqmtpklqubodylf.supabase.co',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
  module.exports = nextConfig;
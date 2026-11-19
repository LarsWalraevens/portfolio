/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin')
const nextConfig = nextTranslate({
  reactStrictMode: true,
  async redirects() {
    return [
      // The myJobbox project used to live under its old company name.
      { source: '/projects/wisepeople', destination: '/projects/myjobbox', permanent: true },
    ]
  },
});

module.exports = nextConfig

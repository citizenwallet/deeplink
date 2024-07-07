/** @type {import('next').NextConfig} */
const nextConfig = {

  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'content-type',
            value: 'application/json; charset=utf-8',
          }
        ]
      }]
    }

};

export default nextConfig;

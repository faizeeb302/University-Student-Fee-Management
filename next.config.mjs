/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
      bodyParser: {
        sizeLimit: '5mb', // Set the body size limit to 5 MB (you can adjust as needed)
      },
    },
  };
  
  export default nextConfig;
  
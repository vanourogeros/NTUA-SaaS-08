/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ["developers.google.com", "lh3.googleusercontent.com"],
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/welcome",
                permanent: true,
            },
        ];
    },
};

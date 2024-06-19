/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [{ protocol: "https", hostname: "a.ppy.sh", port: "", pathname: "/**/*" }],
	},
};

module.exports = nextConfig;

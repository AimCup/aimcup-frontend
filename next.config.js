/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
			},
		],
	},
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
	},
	experimental: {
		// Don't keep dynamic route segments (schedule, bracket, teams, …) in the client-side Router
		// Cache across navigations. Without this, after an admin edits/deletes data a viewer could see a
		// stale page on client navigation until the cache expired or they hard-refreshed (Ctrl+F5), because
		// server-side revalidatePath cannot reach another user's browser cache. 0 = always refetch on nav.
		staleTimes: {
			dynamic: 0,
		},
	},
};

module.exports = nextConfig;

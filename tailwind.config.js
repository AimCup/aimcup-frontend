/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
	content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: {
					light: "#FFFFFF",
					DEFAULT: "#f5f5f5",
					dark: "#151120",
				},
			},
			// Bare `border` (no color) defaults to a subtle white instead of `currentColor`
			// (which previously rendered as a harsh solid-white border on the dark theme).
			borderColor: {
				DEFAULT: "rgba(255, 255, 255, 0.08)",
			},
		},
		colors: {
			// Keep the essential keyword colors so opacity utilities like `border-white/5`,
			// `text-white/40`, `bg-white/5` actually resolve (without `white` defined they
			// silently fell back to currentColor — the source of the harsh white borders).
			transparent: "transparent",
			current: "currentColor",
			white: "#ffffff",
			black: "#000000",
			deepCharcoal: "#151120",
			deepRed: "#CA191B",
			flatRed: "rgb(239 55 57)",
			mintGreen: "#00CC99",
			tuned: "#241e38",
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				aimcup: {
					primary: "#CA191B",
					secondary: "#00CC99",
					accent: "#00CC99",
					neutral: "#241e38",
					"base-100": "#151120",
					"base-200": "#1c172b",
					"base-300": "#241e38",
					info: "#3abff8",
					success: "#00CC99",
					warning: "#fbbd23",
					error: "#CA191B",
				},
			},
		],
	},
};

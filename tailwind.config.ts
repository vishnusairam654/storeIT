import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#6750A4', // M3 Deep Purple
					'100': '#EADDFF',   // M3 Surface Container Low/High equivalent for brand
					'200': '#21005D',   // On Primary Container
				},
				// Material 3 Surface Tones
				'surface-dim': '#DED8E1',
				'surface': '#FEF7FF',
				'surface-bright': '#FEF7FF',
				'surface-container-lowest': '#FFFFFF',
				'surface-container-low': '#F7F2FA',
				'surface-container': '#F3EDF7',
				'surface-container-high': '#ECE6F0',
				'surface-container-highest': '#E6E0E9',

				'on-surface': '#1D1B20',
				'on-surface-variant': '#49454F',
				outline: '#79747E',
				'outline-variant': '#CAC4D0',

				red: '#B3261E', // M3 Error
				error: '#B3261E',
				green: '#3DD9B3', // Keeping original for continuity if needed, or switch to M3 green
				blue: '#56B8FF',
				pink: '#EEA8FD',
				orange: '#F9AB72',
				light: {
					'100': '#1D1B20', // On Surface
					'200': '#49454F', // On Surface Variant
					'300': '#E6E0E9', // Surface Container Highest
					'400': '#F3EDF7'  // Surface Container
				},
				dark: {
					'100': '#04050C',
					'200': '#131524'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				poppins: ["var(--font-poppins)"]
			},
			boxShadow: {
				'elevation-1': '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
				'elevation-2': '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)',
				'elevation-3': '0 4px 8px 3px rgba(60, 64, 67, 0.15), 0 1px 3px 0 rgba(60, 64, 67, 0.3)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'caret-blink': {
					'0%,70%,100%': {
						opacity: '1'
					},
					'20%,50%': {
						opacity: '0'
					}
				}
			},
			animation: {
				'caret-blink': 'caret-blink 1.25s ease-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;

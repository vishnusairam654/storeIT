import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./lib/**/*.{js,ts,jsx,tsx,mdx}",
		"./constants/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// New Brand Color Palette
				brand: {
					DEFAULT: '#0755BD', // Deep Trust Blue - Brand/Headers
					'100': '#34A8DA',   // Sky Blue - Secondary
					'200': '#043A7A',   // Darker blue for depth
				},
				// Primary Action - Vibrant Green
				'primary-action': '#51AD13',
				// Surface Tones based on Cloud White
				'surface-dim': '#E8E9EB',
				'surface': '#F8F9FA',              // Cloud White
				'surface-bright': '#FFFFFF',
				'surface-container-lowest': '#FFFFFF',
				'surface-container-low': '#F8F9FA', // Cloud White
				'surface-container': '#F1F3F4',
				'surface-container-high': '#E8EAED',
				'surface-container-highest': '#DFE1E5',

				'on-surface': '#2C3E50',            // Slate Dark
				'on-surface-variant': '#5D6D7E',
				outline: '#85929E',
				'outline-variant': '#BDC3C7',

				// Utility Colors
				red: '#E74C3C',
				error: '#E74C3C',
				green: '#51AD13',    // Vibrant Green
				blue: '#34A8DA',     // Sky Blue
				pink: '#EEA8FD',
				orange: '#F39C12',   // Vibrant Orange
				light: {
					'100': '#2C3E50', // Slate Dark - Main text
					'200': '#5D6D7E', // Secondary text
					'300': '#E8EAED', // Surface Container High
					'400': '#F1F3F4'  // Surface Container
				},
				dark: {
					'100': '#1A252F',
					'200': '#2C3E50'  // Slate Dark
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
			spacing: {
				'1': '4px',
				'2': '8px',
				'3': '12px',
				'4': '16px',
				'5': '20px',
				'6': '24px',
				'7': '28px',
				'8': '32px',
				'9': '36px',
				'10': '40px',
				'12': '48px',
				'14': '56px',
				'16': '64px',
				'20': '80px',
				'24': '96px',
			},
			borderRadius: {
				'none': '0',
				'sm': 'calc(var(--radius) - 4px)',
				'md': 'calc(var(--radius) - 2px)',
				'lg': 'var(--radius)',
				'xl': '1.75rem',
				'2xl': '2rem',
				'3xl': '28px',
				'4xl': '32px',
				'full': '9999px'
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

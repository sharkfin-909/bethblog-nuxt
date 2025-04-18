export default defineNuxtConfig({
	devServer: {
		host: '0.0.0.0', // allow access from network
		port: 3000,
	},
	vite: {
		server: {
			hmr: {
				host: '192.168.101.252', // replace with your actual IP
			},
		},
	},
	components: [
		{ path: '~/components', pathPrefix: false },
		{ path: '~/components/block', pathPrefix: false },
		{ path: '~/components/shared', pathPrefix: false },
		{ path: '~/components/base', pathPrefix: false },
		{ path: '~/components/forms', pathPrefix: false },
	],

	ssr: true,
	future: {
		compatibilityVersion: 4,
	},
	modules: [
		'@nuxt/image',
		'@nuxt/scripts',
		'@vueuse/nuxt',
		'nuxt-security',
		'@nuxtjs/tailwindcss',
		'shadcn-nuxt',
		'@nuxt/icon',
		'@nuxtjs/color-mode',
		'@nuxtjs/seo',
		'@nuxtjs/google-fonts',
	],

	css: ['~/assets/css/tailwind.css'],

	runtimeConfig: {
		public: {
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL as string,
			directusUrl: process.env.DIRECTUS_URL as string,
			enableVisualEditing: process.env.NUXT_PUBLIC_ENABLE_VISUAL_EDITING !== 'false',
		},
		directusServerToken: process.env.DIRECTUS_SERVER_TOKEN,
	},

	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: '',
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: './app/components/ui',
	},

	security: {
		headers: {
			contentSecurityPolicy: {
				'img-src': ["'self'", 'data:', '*'],
				'script-src': ["'self'", "'unsafe-inline'", '*'],
				'connect-src': ["'self'", process.env.DIRECTUS_URL || ''],
				'frame-ancestors': ["'self'", process.env.DIRECTUS_URL || ''],
			},
		},
	},

	devtools: { enabled: true },

	// Image Configuration - https://image.nuxt.com/providers/directus
	image: {
		providers: {
			directus: {
				provider: 'directus',
				options: {
					baseURL: `${process.env.DIRECTUS_URL}/assets/`,
				},
			},
			local: {
				provider: 'ipx',
			},
		},
	},

	colorMode: {
		preference: 'system',
		classSuffix: '',
		storage: 'cookie',
	},

	site: {
		url: process.env.NUXT_PUBLIC_SITE_URL as string,
	},
	vue: {
		propsDestructure: true,
	},

	sitemap: {
		sources: ['/api/sitemap'],
	},

	compatibilityDate: '2025-01-16',

	googleFonts: {
		families: {
			Tinos: [400, 500, 600],
			'Alumni+Sans+Pinstripe': [400, 700],
		},
		display: 'swap', // optional but recommended
	},
});

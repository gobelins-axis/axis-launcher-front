export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'Axis Hub',

        htmlAttrs: {
            lang: 'en',
        },

        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
        ],

        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        ],
    },

    // Loading
    loading: {
        height: '0',
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['@/assets/styles/app.scss'],

    /*
     ** CSS Style Resources
     */
    styleResources: {
        scss: [
            '@/assets/styles/resources/_root.scss',
            '@/assets/styles/resources/_variables.scss',
            '@/assets/styles/resources/_mixins.scss',
            '@/assets/styles/resources/_functions.scss',
            '@/assets/styles/resources/_breakpoints.scss',
        ],
    },

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        // Server and client side
        '@/plugins/context.js',
        '@/plugins/firebase.js',
        // Client Side
        '@/plugins/init.client.js',
        '@/plugins/browser.client.js',
        '@/plugins/device.client.js',
        '@/plugins/breakpoints.client.js',
        '@/plugins/windowResizeObserver.client.js',
        '@/plugins/axis.client.js',
    ],

    router: {
        middleware: ['checkQueries'],
    },

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: false,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // Doc: https://github.com/nuxt-community/stylelint-module
        '@nuxtjs/stylelint-module',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@nuxtjs/style-resources',
        '@nuxtjs/svg',
        'nuxt-i18n',
    ],

    stylelint: {
        configFile: './stylelint.config.js',
        files: '**/*.scss',
        failOnError: false,
    },

    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        vueI18n: {
            fallbackLocale: 'en',
            messages: {
                en: require('./locales/en'),
            },
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        babel: {
            plugins: ['@babel/plugin-proposal-optional-chaining'],
        },

        extend(config) {
            /**
             * GLSL loader
             */
            config.module.rules.push({
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader', 'glslify-loader'],
            });
        },

        transpile: ['three', 'three-bmfont-text'],

        chainWebpack: (config) => {
            if (process.env.NODE_ENV === 'development') {
                config
                    .output
                    .filename('[name].[hash].js')
                    .end();
            }
        },
    },

    server: {
        host: '0.0.0.0',
        port: 8000,
    },

    env: {
        NODE_ENV: process.env.NODE_ENV,
    },
};

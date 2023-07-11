// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/algolia'
  ],
  algolia: {
    apiKey: 'B7mDVZr4lFfk4qakjwZeHGUv0s508GAE',
    applicationId: 'typesense',
    instantSearch: {
      theme: 'satellite'
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})

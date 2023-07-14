// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/algolia'
  ],
  algolia: {
    apiKey: 'xf3EOyUrqUehUeqKiveKiVdv1wZu5fTi',
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

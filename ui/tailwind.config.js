/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        datatrackerLight: {
          primary: '#2563eb',
          secondary: '#7c3aed',
          accent: '#22d3ee',
          neutral: '#2b3440',
          'base-100': '#FFFFFF',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272'
        },
      },
    ],
  }
}

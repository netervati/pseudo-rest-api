// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'PseudoRESTAPI is a web application that helps developers create fake API endpoints for their projects.',
        },
      ],
      title: 'PseudoRESTAPI',
      noscript: [{ children: 'JavaScript is required' }],
    },
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/supabase', '@pinia/nuxt'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});

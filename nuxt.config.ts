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
  content: {
    highlight: {
      theme: 'github-light',
    },
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/content',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@vueuse/nuxt',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      onMaintenance: process.env.NUXT_PUBLIC_ON_MAINTENANCE || 'false',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      testUrl: process.env.NUXT_PUBLIC_TEST_URL,
    },
  },
  telemetry: false,
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
});

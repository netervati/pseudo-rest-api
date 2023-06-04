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
  modules: ['@nuxtjs/supabase', '@pinia/nuxt', '@vee-validate/nuxt'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      onMaintenance: process.env.NUXT_PUBLIC_ON_MAINTENANCE || false,
    },
  },
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

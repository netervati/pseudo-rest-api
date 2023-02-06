import GithubProvider from 'next-auth/providers/github';
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  secret: process.env.NUXT_SECRET,
  pages: {
    signIn: '/login',
  },
  providers: [
    // @ts-ignore
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});

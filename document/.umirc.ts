import { defineConfig } from 'dumi'

export default defineConfig({
  title: 'automs',
  mode: 'site',
  publicPath: '/automs/',
  base: '/automs',
  hash: true,
  logo: '/logo.png',
  favicon: '/favicon.ico',
  theme: {
    '@c-primary': '#0ADAAC',
  },
  styles: [
    `html .__dumi-default-layout-hero h1 {
      background: url('/logo.png') center 0 no-repeat;
      background-size: 100px auto;
      padding-top: 100px;
    }`,
  ],
  // more config: https://d.umijs.org/config
});

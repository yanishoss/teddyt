import { Config } from '@stencil/core';
import { sass } from "@stencil/sass";

// https://stenciljs.com/docs/config

export const config: Config = {
  namespace: "Teddyt",
  globalStyle: 'src/global/app.scss',
  plugins: [
    sass()
  ],
  enableCache: false
};

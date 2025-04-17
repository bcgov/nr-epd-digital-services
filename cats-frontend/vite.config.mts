import { readFileSync } from 'node:fs';
import {
  defineConfig,
  loadEnv,
  Plugin,
  createFilter,
  transformWithEsbuild,
} from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
const DEFAULT_PORT = 3000;

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      port: DEFAULT_PORT,
    },
    preview: {
      port: DEFAULT_PORT,
    },
    plugins: [react(), tsconfigPaths(), sourcemapPlugin(), svgrPlugin()],
    resolve: {
      alias: {
        '@cats': path.resolve(__dirname, './src/app'),
      },
    },
  };
});

function sourcemapPlugin(): Plugin {
  return {
    name: 'sourcemap-plugin',
    config(_, { mode }) {
      const { GENERATE_SOURCEMAP } = loadEnv(mode, '.', ['GENERATE_SOURCEMAP']);
      return {
        build: {
          sourcemap: GENERATE_SOURCEMAP === 'true',
        },
      };
    },
  };
}

// In Create React App, SVGs can be imported directly as React components. This is achieved by svgr libraries.
// https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs
function svgrPlugin(): Plugin {
  const filter = createFilter('**/*.svg');
  const postfixRE = /[?#].*$/s;

  return {
    name: 'svgr-plugin',
    async transform(code, id) {
      if (filter(id)) {
        const { transform } = await import('@svgr/core');
        const { default: jsx } = await import('@svgr/plugin-jsx');

        const filePath = id.replace(postfixRE, '');
        const svgCode = readFileSync(filePath, 'utf8');

        const componentCode = await transform(svgCode, undefined, {
          filePath,
          caller: {
            previousExport: code,
            defaultPlugins: [jsx],
          },
        });

        const res = await transformWithEsbuild(componentCode, id, {
          loader: 'jsx',
        });

        return {
          code: res.code,
          map: null,
        };
      }
    },
  };
}

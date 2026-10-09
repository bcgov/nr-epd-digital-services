import {
  defineConfig,
  loadEnv,
  Plugin,
  createFilter,
  transformWithEsbuild,
  type Connect,
  type ViteDevServer,
} from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from 'fs';
import path from 'path';
const DEFAULT_PORT = 3000;

const CHEFS_FORMIO_DIR = path.resolve(__dirname, 'vendor/chefs-formio');
const CHEFS_FORMIO_URL = '/chefs-formio';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      port: DEFAULT_PORT,
    },
    preview: {
      port: DEFAULT_PORT,
    },
    plugins: [
      react(),
      tsconfigPaths(),
      sourcemapPlugin(),
      svgrPlugin(),
      chefsFormioStaticPlugin(),
    ],
    resolve: {
      alias: {
        '@cats': path.resolve(__dirname, './src/app'),
        formiojs: path.resolve(__dirname, './node_modules/formiojs'),
      },
    },
  };
});

/** Serve the vendored CHEFS UMD at /chefs-formio so we do not duplicate it in public/. */
function chefsFormioStaticPlugin(): Plugin {
  const attach = (server: ViteDevServer | { middlewares: Connect.Server }) => {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split('?')[0] ?? '';
      if (!url.startsWith(`${CHEFS_FORMIO_URL}/`)) {
        return next();
      }

      const rel = decodeURIComponent(url.slice(CHEFS_FORMIO_URL.length + 1));
      if (!rel || rel.includes('..')) {
        return next();
      }

      const file = path.normalize(path.join(CHEFS_FORMIO_DIR, rel));
      if (
        !file.startsWith(CHEFS_FORMIO_DIR + path.sep) ||
        !existsSync(file) ||
        !statSync(file).isFile()
      ) {
        return next();
      }

      const types: Record<string, string> = {
        '.js': 'application/javascript; charset=utf-8',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.css': 'text/css; charset=utf-8',
      };
      res.setHeader(
        'Content-Type',
        types[path.extname(file)] || 'application/octet-stream',
      );
      createReadStream(file).pipe(res);
    });
  };

  return {
    name: 'chefs-formio-static',
    configureServer: attach,
    configurePreviewServer: attach,
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist/chefs-formio');
      mkdirSync(outDir, { recursive: true });
      for (const name of readdirSync(CHEFS_FORMIO_DIR)) {
        if (/\.(js|png|svg)$/.test(name)) {
          copyFileSync(path.join(CHEFS_FORMIO_DIR, name), path.join(outDir, name));
        }
      }
    },
  };
}

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

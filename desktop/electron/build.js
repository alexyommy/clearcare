const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: ['src/renderer/index.tsx'],
  bundle: true,
  outfile: 'src/renderer/bundle.js',
  platform: 'browser',
  target: 'chrome120',
  jsx: 'automatic',
  loader: { '.tsx': 'tsx', '.ts': 'ts' },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

console.log('Build complete → src/renderer/bundle.js');

module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  env: {
    test: {
      plugins: ['babel-plugin-transform-import-meta'],
    },
  },
};

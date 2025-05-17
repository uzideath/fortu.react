module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '@': './src',
              '@components': './src/components',
              '@screens': './src/screens',
              '@assets': './assets',
              '@utils': './src/utils',
              '@services': './src/services',
              '@styles': './src/styles',
              '@types': './src/types',
              '@images': './assets/images',
            },
          },
        ],
      ],
    };
  };
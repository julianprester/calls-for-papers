module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('src/data.json');
    eleventyConfig.addPassthroughCopy('src/favicon');
    eleventyConfig.addPassthroughCopy({
      './node_modules/alpinejs/dist/cdn.min.js': './js/alpine.min.js',
    });
    eleventyConfig.addPassthroughCopy({
      './node_modules/moment/min/moment.min.js': './js/moment.min.js'
    });
  
    return {
      htmlTemplateEngine: "njk",
      dir: {
        input: 'src',
        output: 'public',
        layouts: 'layouts',
        includes: 'includes',
        data: 'data',
      }
    }
  }
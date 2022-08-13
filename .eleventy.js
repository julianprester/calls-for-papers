module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('www/data.json');
    eleventyConfig.addPassthroughCopy('www/feed.rss');
    eleventyConfig.addPassthroughCopy('www/favicon');
    eleventyConfig.addPassthroughCopy({
      './node_modules/alpinejs/dist/cdn.min.js': './js/alpine.min.js',
    });
    eleventyConfig.addPassthroughCopy({
      './node_modules/moment/min/moment.min.js': './js/moment.min.js'
    });
  
    return {
      htmlTemplateEngine: "njk",
      dir: {
        input: 'www',
        output: 'public',
        layouts: 'layouts',
        includes: 'includes',
        data: 'data',
      }
    }
  }
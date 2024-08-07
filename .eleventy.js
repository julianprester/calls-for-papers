const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("relativeTime", function (timestamp) {
    const dateTime = DateTime.fromMillis(timestamp);
    return dateTime.toRelative();
  });

  eleventyConfig.addFilter("isActiveCall", function (calls) {
    return calls.filter(call => call.active || (call.gracePeriod && DateTime.now() < DateTime.fromMillis(call.gracePeriod)));
  });

  eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

  eleventyConfig.addPassthroughCopy('www/rss.xml');
  eleventyConfig.addPassthroughCopy('www/favicon');
  eleventyConfig.addPassthroughCopy({
    './node_modules/alpinejs/dist/cdn.min.js': './js/alpine.min.js',
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
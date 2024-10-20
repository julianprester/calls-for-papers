import { DateTime } from "luxon";

export default async function (eleventyConfig) {
    eleventyConfig.addFilter("relativeTime", function (timestamp) {
        const dateTime = DateTime.fromISO(timestamp);
        return dateTime.toRelative();
    });

    eleventyConfig.addFilter("isActiveCall", function (calls) {
        return calls.filter(call => call.active || (call.gracePeriod && DateTime.now() < DateTime.fromMillis(call.gracePeriod)));
    });

    eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

    eleventyConfig.addPassthroughCopy('www/rss.xml');
    eleventyConfig.addPassthroughCopy('www/public/favicon');
    eleventyConfig.addPassthroughCopy({
        './node_modules/alpinejs/dist/cdn.min.js': './public/js/alpine.min.js',
    });
}

export const config = {
    htmlTemplateEngine: "njk",
    dir: {
        input: "www",
        includes: "_includes",
        data: "_data",
        output: "public"
    },
}
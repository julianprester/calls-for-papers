import { DateTime } from "luxon";

export default async function (eleventyConfig) {
    eleventyConfig.addFilter("urlEncode", function (str) {
        return encodeURIComponent(str);
    });

    eleventyConfig.addFilter("relativeTime", function (timestamp) {
        const dateTime = DateTime.fromISO(timestamp);
        return dateTime.toRelative();
    });

    eleventyConfig.addFilter("addDay", function (timestamp) {
        const dateTime = DateTime.fromISO(timestamp);
        return dateTime.plus({ days: 1 }).toISODate();
    });

    eleventyConfig.addFilter("dateOnly", function (timestamp) {
        const dateTime = DateTime.fromISO(timestamp);
        return dateTime.setLocale('en-us').toLocaleString(DateTime.DATE_FULL);
    });

    eleventyConfig.addFilter("isoDate", function (timestamp) {
        const dateTime = DateTime.fromISO(timestamp);
        return dateTime.toISODate().replace(/-/g, '');
    });

    eleventyConfig.addFilter("isInPast", function (timestamp) {
        const dateTime = DateTime.fromISO(timestamp);
        const today = DateTime.now();
        return dateTime < today;
    });

    eleventyConfig.addFilter("isActiveCall", function (calls) {
        return calls.filter(call => call.active || (!call.active && Date.now() < new Date(call.gracePeriod)));
    });

    eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

    eleventyConfig.addPassthroughCopy('www/rss.xml');
    eleventyConfig.addPassthroughCopy('www/journal/*.xml');
    eleventyConfig.addPassthroughCopy('www/tag/*.xml');
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
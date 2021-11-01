const { SitemapStream } = require("sitemap");
const { createGzip } = require("zlib");

/*
 * Returns a gzipped stream for a sitemap containing the paths. Google specifies
 * a sitemap can be max 50MB or 50000 urls. If there ever would be more than 50k
 * posts, the sitemap needs to be split up into multiple sitemaps.
 * More info:
 * https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap#:~:text=All%20formats%20limit%20a%20single,single%20index%20file%20to%20Google.
 * How to split up the sitemap:
 * https://github.com/ekalinin/sitemap.js#create-sitemap-and-index-files-from-one-large-list
 */
const createStream = (paths) => {
  const smStream = new SitemapStream({
    hostname: "https://www.flaschenpiraten.de",
  });
  const pipeline = smStream.pipe(createGzip());

  smStream.write({ url: "", changefreq: "daily", priority: 1 });
  paths.forEach((path) => {
    smStream.write({ url: path, changefreq: "daily", priority: 0.7 });
  });

  smStream.end();
  return pipeline;
};

module.exports = { createStream };

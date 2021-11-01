const functions = require("firebase-functions");
const fetch = require("node-fetch")
const admin = require("firebase-admin");
const Post = require("./src/post.js");
const Storage = require("./src/storage.js");
const Log = require("./src/logging.js");
const Sitemap = require("./src/sitemap.js");

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

////////////////////////////////////////////////////////////////////////////////
// Post Storage Firebase Functions

/*
 * Streams an html file from storage
 * /posts/anything => this function
 */
module.exports.streamHTMLFromStorage = functions.https.onRequest(async (req, res) => {
  Log.info("Streaming post from storage", { path: req.path });
  const filename = "public/" + req.path.substring(1);

  res.set({
    "Cache-Control": "max-age=300, s-maxage=300",
    "Content-Type": "text/html; charset=utf-8",
  });
  Storage.pipeStream(storage, filename, res);
});

/*
 * Responds a generated sitemap stream containing links to all posts.
 */
module.exports.getSitemap = functions.https.onRequest(async (req, res) => {
  Log.info("Generating Sitemap");
  try {
    const paths = await Post.allPaths(db);
    res.set({
      "Cache-Control": "max-age=3600, s-maxage=3600",
      "Content-Type": "application/xml",
      "Content-Encoding": "gzip",
    });
    await Sitemap.createStream(paths).pipe(res);
  } catch (err) {
    Log.error(err);
    res.status(500).end();
  }
});

/*
 * The hook to be ran whenever a post is added or changed. This will:
 * - Fetch the post, render the template and upload it to storage.
 * - Refresh the sitemap.xml to include all post urls
 */
module.exports.onPostWritten = functions.firestore
  .document("Feed/{id}")
  .onWrite(async (_change, context) => {
    await Post.renderAndUpload(db, storage, context.params.id);
  });

/*
 * Temporary / utility function to (re)render all existing posts.
 * Useful for initial rendering or to refresh all static files when after making
 * changes to the template.
 */
module.exports.renderAll = functions.https.onRequest(async (req, res) => {
  const posts = await Post.listDocuments(db);
  Post.setDocumentsCache(posts);

  for (const post of posts) {
    await Post.renderAndUpload(db, storage, post.id);
  }
  Post.clearDocumentsCache();

  res.send("Ok");
});

////////////////////////////////////////////////////////////////////////////////
// Dev functions

if (process.env.NODE_ENV == "development") {
  const Dev = require("./dev.js");

  module.exports.seedData = functions.https.onRequest(async (req, res) => {
    await Dev.seedData(db);
    res.send("Ok");
  });

  module.exports.liveRender = functions.https.onRequest(async (req, res) => {
    Dev.liveRender(req, res, db);
  });
}

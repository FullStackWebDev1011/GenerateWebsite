const Eta = require("eta");
const Storage = require("./storage.js");
const Log = require("./logging.js");

////////////////////////////////////////////////////////////////////////////////
// DB Queries

const findById = async (db, id) => {
  const post = await db.collection("Feed").doc(id).get();
  return post.data();
};

/*
 * Improves performance of `renderAll` function. Calling getRandom to populate
 * related posts of every post rendered is too slow for firbase functions, and
 * because of a maximum timeout of 9 minutes we need to speed up the rendering.
 * Keeping a cache of all documents would be a big win in performance as it's
 * the same list over and over again.
 */
let documentsCache = null;
const setDocumentsCache = (posts) => (documentsCache = posts);
const clearDocumentsCache = () => (documentsCache = null);

const listDocuments = async (db) =>
  documentsCache || (await db.collection("Feed").listDocuments());

/*
 * Fetches `n` random posts from the database. Firestore has no support for
 * ordering by random, fetching random documents, or any kind of meaningful
 * querying such as by number of likes or comments. So in this approach we list
 * out the documents and pick random ones using javascript. Might scale poorly
 * inefficient when feed grows big (maybe 10k+?), so another method of filling
 * the extra posts section will be desirable at that point.
 */
const getRandom = async (db, n) => {
  let docs = await listDocuments(db);
  const randompostIDs = docs
    .sort(() => 0.5 - Math.random())
    .slice(0, n)
    .map((doc) => doc.id);
  const postsRef = await db
    .collection("Feed")
    .where("__name__", "in", randompostIDs)
    .get();
  return postsRef.docs.map((d) => d.data());
};

const allPaths = async (db) => {
  const tuples = await db
    .collection("Feed")
    .select("postID", "postTitle")
    .get();
  return tuples.docs
    .filter((doc) => doc.data().postTitle)
    .map((doc) => postUrl(doc.data()));
};

////////////////////////////////////////////////////////////////////////////////
// HTML rendering

Eta.configure({ views: "./src/views/" });

const extraKeywords =
  "flaschenpiraten bottlepirates wein wine vino marktplatz marketplace";

const buildSeo = (post) => {
  return {
    title: post.postTitle,
    description: post.postDescription,
    keywords: post.postTitle + " " + extraKeywords,
    image: post.postImages[0],
    pageUrl: postUrl(post),
  };
};

const isValid = (post) => {
  const valid = post && post.postTitle !== undefined;
  if (!valid) {
    Log.error("Invalid post", post);
  }
  return valid;
};

const preparePost = (post) => {
  return {
    ...post,
    url: postUrl(post),
    categories: post.categories || [],
    postImages: post.postImages || [post.postImage || "/assets/logo.png"],
  };
};

/*
 * Fetches post and related data and prepares the data to be consumed by the
 * template.
 */
const getViewData = async (db, postID) => {
  const post = await findById(db, postID);

  if (isValid(post)) {
    let relatedPosts = await getRandom(db, 10);
    let preparedPost = preparePost(post);

    return {
      post: preparedPost,
      relatedPosts: relatedPosts.filter(isValid).map(preparePost),
      seo: buildSeo(preparedPost),
    };
  } else {
    Log.error("Unknown or invalid post " + postID);
  }
};

const render = (data) => Eta.renderFile("./post.eta", data);

////////////////////////////////////////////////////////////////////////////////
// Storage

/*
 * Cleans a post title and makes it suitable for a URL component.
 * Example: "Some Title! :)" => "some-title"
 */
const titleAsUrlComponent = (title) => {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .join("-")
    .toLowerCase();
};

const postUrl = (post) =>
  `/posts/${post.postID}-${titleAsUrlComponent(post.postTitle)}`;

const storageFilePath = (post) => `public${postUrl(post)}`;

/*
 * This is the main functionality. Given a postID, fetch the post and related
 * data, render the html template and upload it to storage at the correct
 * filepath.
 */
const renderAndUpload = async (db, storage, postID) => {
  const viewData = await getViewData(db, postID);

  if (viewData) {
    Log.info("Rendering " + postID);
    const html = await render(viewData);
    Log.info("Uploading " + postID);
    await Storage.upload(storage, storageFilePath(viewData.post), html);
  }
};

module.exports = {
  setDocumentsCache,
  clearDocumentsCache,
  listDocuments,
  allPaths,
  render,
  getViewData,
  storageFilePath,
  renderAndUpload,
};

const Post = require("./src/post.js");

const SEED_POSTS = [
  {
    postID: "495W1hBkX7Ix0FBFoze9",
    postDescription:
      "Ich suche Blanc de Blancs Sekt Brut Nature von Moritz Kissinger.",
    postImages: [
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/2021-04-27%2015:09:52.975512%C2%A7FullSizeRender.jpg?alt=media&token=449e367c-6078-4c64-91a2-04eb14f66dc5",
    ],
    postPrice: "",
    postTitle: "SUCHE: Kissinger, Blanc de Blancs Sekt Brut Nature",
    likes: ["a", "b", "c", "d", "e", "f"],
    comments: ["a", "b", "c", "d", "e", "f"],
  },
  {
    postID: "F6EFM0Rp8SX0fbMQpqGE",
    postDescription: `1 x Vina Tondonia Gran Reserva 1995
4 x Vina Tondonia Reserva 2007
1 x Vina Tondonia Blanco Reserva 2007
Preis plus 10 Euro Versand nach DE,, AT, BE, NL, IT, ES, FR.
Resteuropa auf Anfrage`,
    postID: "04HybMaEBg5F0wzouz2s",
    postImages: [
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/2021-06-08%2019%3A28%3A58.847389Z%C2%A720210608_212434.jpg?alt=media&token=9fd2439d-adf6-4f98-92e5-75d390149137",
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/2021-05-10%2015:58:41.519379%C2%A7IMG_7452.HEIC?alt=media&token=c826a09e-5d1d-4e59-8a7a-ee0658b9c798",
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/2021-05-10%2015:58:34.780689%C2%A7IMG_7453.HEIC?alt=media&token=6f939be1-5132-4352-a664-a72825563543",
    ],
    categories: ["#rotwein", "#weinpakete"],
    postPrice: "290",
    postTitle: "Tondonia Paket😋",
    likes: ["a", "b", "c", "d"],
    comments: ["a", "b", "c", "d", "e", "f"],
  },
  {
    postID: "MSBbwTVpa9G91rqDW3ea",
    postDescription:
      "Aufgrund der geringen Menge auf dem Markt so gut wie nicht zu bekommen.",
    postImages: [
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/2021-05-20%2008:41:07.103406%C2%A7IMG_0090.HEIC?alt=media&token=5742abf4-93c9-4e97-a47d-451fe4dac928",
    ],
    categories: ["#süsswein"],
    postPrice: "450",
    postTitle: "Michel Niellon - Chevalier-Montrachet 2017",
    likes: ["a", "b", "c", "d"],
    comments: ["a", "b", "c", "d", "e", "f"],
  },
  {
    postID: "O2I9RjvTTAej94kbrC6u",
    postDescription:
      "2 Flaschen 15er 3* Goldkapsel Auslese von Markus Molitor aus der Kinnheimer Hubertuslay: 119€ für beide. Von Stephan Reinhard mit unglaublichen 99 Punkten bewertet beim Robert Parker.",
    postImages: [
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/00744906-d03c-4e4c-8ad0-a2b0dd4584da.jpe?alt=media&token=2d3c2024-be5f-47e7-826e-21c7770b4126",
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/6e4ba7d9-4382-4506-9d07-fa9b918f4d33.jpe?alt=media&token=bbdd4246-34b5-4b5f-b6b9-3c969049e8d0",
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/e799c5fe-834c-4cc2-b247-ce2d0054a8d4.jpe?alt=media&token=a08c912d-00b2-4789-895a-b7c645593ad3",
      "https://firebasestorage.googleapis.com/v0/b/flaschenpiraten-2.appspot.com/o/b6c8fce5-861a-4d82-ba56-f4bf7f26e300.jpe?alt=media&token=6df210bf-9bad-4d9d-a030-ab8285506bdf",
    ],
    categories: ["#süsswein"],
    postPrice: "59,50",
    postTitle: "Molitor_99 PP!!",
    likes: ["a", "b", "c", "d"],
    comments: ["a", "b", "c", "d", "e", "f"],
  },
];

module.exports.seedData = async (db) => {
  const feeds = db.collection("Feed");
  SEED_POSTS.forEach(async (post) => await feeds.add(post));
};

module.exports.liveRender = async (req, res, db) => {
  const viewData = await Post.getViewData(db, req.path.substring(1));

  if (viewData) {
    res.set({ "Content-Type": "text/html" });
    res.send(await Post.render(viewData));
  } else {
    res.send("NOT FOUND");
  }
};

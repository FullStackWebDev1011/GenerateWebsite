/*
 * Streams a file from storage to the output stream.
 * If out is a response object, make sure to set the content type headers
 * correctly, like text/html for HTML files.
 */
module.exports.pipeStream = async (storage, filename, res) => {
  const file = storage.bucket().file(filename);

  if ((await file.exists())[0]) {
    // In emulator environment,  storage throws an error without disabling
    // validation. See:
    // https://github.com/firebase/firebase-tools/issues/3469
    const validation = process.env.NODE_ENV === "development" ? false : "crc32c"
    file.createReadStream({ validation }).pipe(res);
  } else {
    res.status(404);
    res.send("Not Found");
  }
};

/*
 * Uploads contents (string) to a file in a storage bucket.
 */
module.exports.upload = (storage, filename, contents) => {
  const bucket = storage.bucket();
  return bucket.file(filename).save(contents, { gzip: true });
};

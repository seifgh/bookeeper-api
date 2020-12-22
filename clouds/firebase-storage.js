const path = require("path"),
  { Storage } = require("@google-cloud/storage"),
  { GCLOUD_SOTRAGE, GCLOUD_STORAGE_BUCKET_URL } = require("../config"),
  storage = new Storage(GCLOUD_SOTRAGE),
  bucket = storage.bucket(GCLOUD_STORAGE_BUCKET_URL);

class FirebaseUploder {
  constructor(file) {
    this.file = file;
    this.renameFile();
    this.setFileUrl();
  }
  renameFile() {
    const extension = path.extname(this.file.originalname);
    this.file.originalname = this.file.originalname
      .replace(" ", "")
      .replace(extension, `-${Date.now()}${extension}`);
  }
  setFileUrl() {
    this.fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
      bucket.name
    }/o/${encodeURI(this.file.originalname)}?alt=media`;
  }
  upload() {
    const blob = bucket.file(this.file.originalname),
      blobWriter = blob.createWriteStream({
        metadata: {
          contentType: this.file.mimetype,
        },
      });
    // blobWriter.on("err", (err) => callback(err));
    // blobWriter.on("finish", () => {
    //   callback(null, this.getFileUrl(file));
    // });
    blobWriter.end(this.file.buffer);
  }
}

module.exports = FirebaseUploder;

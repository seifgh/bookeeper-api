require("dotenv").config();
module.exports = {
  DEBUG: process.env.NODE_ENV !== "production",
  PORT: process.env.PORT,
  MONGO_DB_URI: process.env.MONGODB_URI || "mongodb://localhost/bookeeper",
  SECRET_JWT_CODE: process.env.SECRET_JWT_CODE,
  GCLOUD_SOTRAGE: {
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS,
  },
  GCLOUD_STORAGE_BUCKET_URL: process.env.GCLOUD_STORAGE_BUCKET_URL,
};

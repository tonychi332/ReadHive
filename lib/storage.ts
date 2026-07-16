import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type StorageConfig = {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
};

function getStorageConfig(): StorageConfig | null {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const bucket = process.env.S3_BUCKET_NAME;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
    return null;
  }

  return { endpoint, accessKeyId, secretAccessKey, bucket };
}

export function isStorageConfigured() {
  return getStorageConfig() !== null;
}

function getClient(config: StorageConfig) {
  return new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

const STORAGE_NOT_CONFIGURED_MESSAGE =
  "File storage is not configured. Set S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_BUCKET_NAME.";

/**
 * Returns a presigned URL the browser can PUT a file to directly, plus the
 * public URL to store on the Book record once the upload completes.
 */
export async function createUploadUrl(key: string, contentType: string) {
  const config = getStorageConfig();
  if (!config) {
    throw new Error(STORAGE_NOT_CONFIGURED_MESSAGE);
  }

  const client = getClient(config);
  const command = new PutObjectCommand({ Bucket: config.bucket, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 5 * 60 });
  // R2 public URLs: https://pub-XXX.r2.dev/{key}  — bucket is implied by the subdomain, NOT in the path
  const publicBase = (process.env.S3_PUBLIC_URL_BASE ?? config.endpoint).replace(/\/$/, "");
  const publicUrl = `${publicBase}/${key}`;

  return { uploadUrl, publicUrl, key };
}

/**
 * Returns a short-lived signed URL for downloading a purchased ebook file.
 */
export async function createDownloadUrl(key: string) {
  const config = getStorageConfig();
  if (!config) {
    throw new Error(STORAGE_NOT_CONFIGURED_MESSAGE);
  }

  const client = getClient(config);
  const command = new GetObjectCommand({ Bucket: config.bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 5 * 60 });
}

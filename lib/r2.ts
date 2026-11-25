// Cloudflare R2 helpers (S3-compatible). Server-only.
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export function hasR2() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET
  );
}

function getClient() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

/** Returns a presigned PUT URL and the public URL of the future object. */
export async function presignUpload(key: string, contentType: string, ttlSeconds = 300) {
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket:      process.env.R2_BUCKET!,
    Key:         key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: ttlSeconds });
  const publicUrl = `${process.env.R2_PUBLIC_URL!.replace(/\/$/, '')}/${key}`;
  return { uploadUrl, publicUrl };
}

export async function deleteObject(key: string) {
  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
}

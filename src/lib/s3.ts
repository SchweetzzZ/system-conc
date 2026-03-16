import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "us-east-1", // us-east-1 é o padrão mais seguro para compatibilidade v4 no R2
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";

export async function getPresignedUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    // Removendo o ContentType da assinatura para evitar conflitos de headers no navegador
  });

  // URL válida por 5 minutos
  return await getSignedUrl(s3Client, command, { expiresIn: 300 });
}

export async function deleteFromS3(key: string) {
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Erro ao deletar do S3:", error);
    // Não jogamos erro aqui para não travar o delete do banco se o S3 falhar
  }
}

export function getFileUrl(key: string) {
  if (!key) return "";
  
  const bucket = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION || "us-east-1";
  const endpoint = process.env.AWS_ENDPOINT;

  // Se estiver usando R2 ou endpoint customizado
  if (endpoint && (endpoint.includes("r2.cloudflarestorage.com") || process.env.PUBLIC_IMAGE_URL)) {
    return `${process.env.PUBLIC_IMAGE_URL}/${key}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

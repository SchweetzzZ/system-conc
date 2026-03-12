import { auth } from "@/auth";
import { getPresignedUploadUrl, getFileUrl } from "@/lib/s3";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { fileName, contentType, fileSize } = await req.json();

    // Validação de tipo
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use JPEG, PNG, WEBP, GIF ou PDF." },
        { status: 400 }
      );
    }

    // Validação de tamanho (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (fileSize > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. O limite é 10MB." },
        { status: 400 }
      );
    }

    const extension = fileName.split(".").pop();
    const key = `uploads/${session.user.id}/${randomUUID()}.${extension}`;

    const uploadUrl = await getPresignedUploadUrl(key, contentType);
    const fileUrl = getFileUrl(key);

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl,
        fileUrl,
        fileKey: key,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar URL presignada:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar upload" },
      { status: 500 }
    );
  }
}

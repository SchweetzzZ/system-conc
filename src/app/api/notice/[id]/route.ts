import { NextResponse } from "next/server";
import { updateNoticeSchema } from "../notice.schema";
import { getNoticeById, updateNotice, deleteNotice } from "../service";
import { adminGuard } from "@/lib/api-guard";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }) {
  const guard = await adminGuard()

  if (!guard.authorized) {
    return guard.response
  }
  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = updateNoticeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const notice = await updateNotice(id, parsed.data);
    return NextResponse.json(notice);
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar notícia" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }) {

  const guard = await adminGuard()

  if (!guard.authorized) {
    return guard.response
  }
  const { id } = await params;

  try {
    await deleteNotice(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar notícia:", error);
    return NextResponse.json(
      { error: "Erro interno ao deletar notícia" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  try {
    const notice = await getNoticeById(id);
    if (!notice) {
      return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
    }
    return NextResponse.json(notice);
  } catch (error) {
    console.error("Erro ao buscar notícia:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar notícia" },
      { status: 500 }
    );
  }
}

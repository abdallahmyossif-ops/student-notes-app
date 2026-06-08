export const runtime = "nodejs";

import { NextResponse } from "next/server";

type Note = {
  id: string;
  title: string;
  content: string;
};

const notes: Note[] = [];

export async function GET() {
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const note: Note = {
    id: crypto.randomUUID(),
    title,
    content,
  };

  notes.unshift(note);
  return NextResponse.json(note, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Note id is required" }, { status: 400 });
  }

  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  notes.splice(index, 1);
  return NextResponse.json({ success: true });
}

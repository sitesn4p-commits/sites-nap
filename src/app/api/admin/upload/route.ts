import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createHash, randomUUID } from "crypto";

import { NextResponse, type NextRequest } from "next/server";

import { badRequest, requireAdminRequest, unauthorized } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxFileSize = 5 * 1024 * 1024;

function cloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function cloudinarySignature(params: Record<string, string>) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${payload}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex");
}

async function uploadToCloudinary(file: File, folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const timestamp = Math.round(Date.now() / 1000).toString();
  const targetFolder = process.env.CLOUDINARY_FOLDER || folder;
  const params = { folder: targetFolder, timestamp };
  const form = new FormData();

  form.append("file", new Blob([await file.arrayBuffer()], { type: file.type }), file.name);
  form.append("api_key", String(apiKey));
  form.append("timestamp", timestamp);
  form.append("folder", targetFolder);
  form.append("signature", cloudinarySignature(params));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Cloudinary upload failed: ${message}`);
  }

  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Cloudinary upload did not return a secure URL.");
  }

  return data.secure_url;
}

export async function POST(request: NextRequest) {
  const session = requireAdminRequest(request);
  if (!session) return unauthorized();

  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "misc").replace(/[^a-z0-9-_]/gi, "").toLowerCase() || "misc";

  if (!file || typeof file === "string") {
    return badRequest("Image file is required.");
  }

  if (!file.type.startsWith("image/")) {
    return badRequest("Only image uploads are allowed.");
  }

  if (file.size > maxFileSize) {
    return badRequest("Image must be under 5MB.");
  }

  if (cloudinaryConfigured()) {
    try {
      return NextResponse.json({ url: await uploadToCloudinary(file, folder) });
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : "Cloud upload failed.");
    }
  }

  const extension = path.extname(file.name).toLowerCase() || `.${file.type.split("/")[1] || "jpg"}`;
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${folder}/${fileName}` });
}

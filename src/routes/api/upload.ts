import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { requireAdminSession } from "@/lib/server/admin-access.server";

type UploadInput = {
  base64: string;
  mimeType: string;
};

export const uploadImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: UploadInput) => data)
  .handler(async ({ data }: { data: UploadInput }) => {
    requireAdminSession();
    if (!data.base64 || !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(data.mimeType)) {
      throw new Error("Upload a PNG, JPEG, WebP, or GIF image.");
    }
    const bytes = Buffer.from(data.base64, "base64");
    if (!bytes.length || bytes.length > 5 * 1024 * 1024) {
      throw new Error("Images must be smaller than 5 MB.");
    }
    const dataUrl = `data:${data.mimeType};base64,${data.base64}`;
    return { url: dataUrl };
  });


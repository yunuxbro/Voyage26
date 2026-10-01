import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BCxQLEMm.mjs";
import { n as requireAdminSession, t as createServerRpc } from "./admin-access.server-DNFrjnXp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/upload-D_9cfsM7.js
var uploadImage_createServerFn_handler = createServerRpc({
	id: "0c5cfd404d205fdcd558981c9394fe457590f74443743c1ae9eec62d43ce1741",
	name: "uploadImage",
	filename: "src/routes/api/upload.ts"
}, (opts) => uploadImage.__executeServer(opts));
var uploadImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(uploadImage_createServerFn_handler, async ({ data }) => {
	requireAdminSession();
	if (!data.base64 || ![
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/gif"
	].includes(data.mimeType)) throw new Error("Upload a PNG, JPEG, WebP, or GIF image.");
	const bytes = Buffer.from(data.base64, "base64");
	if (!bytes.length || bytes.length > 5242880) throw new Error("Images must be smaller than 5 MB.");
	return { url: `data:${data.mimeType};base64,${data.base64}` };
});
//#endregion
export { uploadImage_createServerFn_handler };

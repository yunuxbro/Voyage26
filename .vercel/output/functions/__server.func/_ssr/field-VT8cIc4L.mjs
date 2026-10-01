import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-Dw4aI9KJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/field-VT8cIc4L.js
var import_jsx_runtime = require_jsx_runtime();
var fieldClass = "h-11 w-full rounded-[10px] bg-ink-2 px-3.5 text-sm text-parchment shadow-[0_0_0_1px_rgb(201_164_76_/_0.22)] outline-none transition-[box-shadow] duration-150 placeholder:text-muted/70 focus:shadow-[0_0_0_1px_rgb(201_164_76_/_0.7)]";
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn(fieldClass, className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn(fieldClass, "h-auto min-h-28 py-3", className),
		...props
	});
}
function Select({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn(fieldClass, className),
		...props,
		children
	});
}
//#endregion
export { Textarea as i, Label as n, Select as r, Input as t };

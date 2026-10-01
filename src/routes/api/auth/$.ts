import { createFileRoute } from "@tanstack/react-router";
import { auth, authConfigured } from "@/lib/auth/server";

async function handleAuth(request: Request): Promise<Response> {
  if (authConfigured && !process.env.MONGODB_URI?.trim()) {
    return new Response("Authentication storage is not configured.", { status: 503 });
  }
  return auth.handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAuth(request),
      POST: ({ request }) => handleAuth(request),
    },
  },
});

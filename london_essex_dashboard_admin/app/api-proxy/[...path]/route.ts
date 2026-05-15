import { NextRequest, NextResponse } from "next/server";

const upstreamBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, "") ??
  "https://unirenic-twittery-cammie.ngrok-free.dev/api";

function buildUpstreamUrl(pathSegments: string[], request: NextRequest) {
  const upstreamUrl = new URL(
    `${upstreamBaseUrl}/${pathSegments.map(encodeURIComponent).join("/")}`,
  );

  request.nextUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.append(key, value);
  });

  return upstreamUrl;
}

function buildHeaders(request: NextRequest) {
  const headers = new Headers();
  const authorization = request.headers.get("authorization");
  const accept = request.headers.get("accept");
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");

  if (authorization) {
    headers.set("authorization", authorization);
  }

  if (accept) {
    headers.set("accept", accept);
  }

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (cookie) {
    headers.set("cookie", cookie);
  }

  headers.set("ngrok-skip-browser-warning", "true");

  return headers;
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const upstreamUrl = buildUpstreamUrl(path, request);
  const method = request.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  const upstreamResponse = await fetch(upstreamUrl, {
    method,
    headers: buildHeaders(request),
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const contentType = upstreamResponse.headers.get("content-type");

  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

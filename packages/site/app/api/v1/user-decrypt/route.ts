import { NextRequest, NextResponse } from "next/server";
import { ZAMA_RELAYER_ENDPOINT } from "@/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${ZAMA_RELAYER_ENDPOINT}/v1/user-decrypt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

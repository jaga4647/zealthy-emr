// app/health/route.ts
export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Server is running",
      time: new Date().toISOString(),
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

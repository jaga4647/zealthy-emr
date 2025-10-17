export async function GET() {
  return Response.json({
    status: "ok",
    message: "Server and database are awake 🚀",
    time: new Date().toISOString(),
  });
}

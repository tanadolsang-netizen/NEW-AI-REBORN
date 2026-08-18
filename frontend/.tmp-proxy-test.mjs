const http = require("http");

const PROXY = "http://localhost:3000";
const BACKEND = "http://127.0.0.1:8000";

function request(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve({ status: res.statusCode, body: d }));
    }).on("error", reject);
  });
}

(async () => {
  const paths = [
    "/ready",
    "/api/ready",
    "/api/natal/compute",
    "/api/transit/now",
    "/api/synastry/cross-aspects",
    "/api/branches/list",
  ];

  for (const p of paths) {
    const url = new URL(p, PROXY).toString();
    const { status, body } = await request(url);
    console.log(p, "=>", status, body.slice(0, 80).replace(/\n/g, " "));
  }
})();

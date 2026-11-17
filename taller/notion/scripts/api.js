const fs = require("fs");
const ck = fs.readFileSync(__dirname + "/nt.txt", "utf8").split("\n").filter((l) => l && !l.startsWith("# ")).map((l) => l.replace(/^#HttpOnly_/, "").split("\t")).filter((c) => c.length >= 7 && /(^|\.)app\.notion\.com$|^\.notion\.com$/.test(c[0]));
const cookie = ck.map((c) => `${c[5]}=${c[6]}`).join("; ");
exports.uid = (ck.find((c) => c[5] === "notion_user_id") || [])[6];
exports.api = async (ep, body) => {
  const r = await fetch("https://app.notion.com/api/v3/" + ep, { method: "POST", headers: { "content-type": "application/json", cookie, "x-notion-active-user-header": exports.uid || "", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140 Safari/537.36" }, body: JSON.stringify(body) });
  const t = await r.text();
  if (!r.ok) throw new Error(ep + " " + r.status + " " + t.slice(0, 300));
  return t ? JSON.parse(t) : {};
};

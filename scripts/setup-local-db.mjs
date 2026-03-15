/**
 * Tworzy lokalną bazę SQLite dla devu.
 * Uruchom: node scripts/setup-local-db.mjs
 */
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const DB_URL = "file:./prisma/dev.db";
const SCHEMA = "prisma/schema.dev.prisma";

const env = { ...process.env, DATABASE_URL: DB_URL };
const opts = { env, stdio: "inherit", cwd: root };

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, opts);
};

console.log("🗄️  Tworzenie lokalnej bazy SQLite...\n");
run(`npx prisma generate --schema=${SCHEMA}`);
run(`npx prisma db push --schema=${SCHEMA}`);
run(`npx prisma db seed`);
console.log("\n✅ Lokalna baza gotowa! Uruchom: npm run dev");
console.log("   Login: tester  |  Hasło: Test1234!");

import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE "WithdrawalRequest"
        ADD COLUMN IF NOT EXISTS "bankName"      TEXT,
        ADD COLUMN IF NOT EXISTS "accountNumber" TEXT,
        ADD COLUMN IF NOT EXISTS "accountName"   TEXT,
        ADD COLUMN IF NOT EXISTS "adminNote"     TEXT;
    `);
    console.log("Migration complete — WithdrawalRequest columns added.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

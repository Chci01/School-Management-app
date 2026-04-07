const bcrypt = require('bcrypt');
async function run() {
  const hash = await bcrypt.hash('admin123', 10);
  console.log(`INSERT INTO "User" ("id", "role", "matricule", "password", "firstName", "lastName", "email", "updatedAt") VALUES (gen_random_uuid()::text, 'SUPER_ADMIN', 'SUPER_ADMIN_001', '${hash}', 'Global', 'Administrator', 'admin@kalansira.com', now());`);
}
run();

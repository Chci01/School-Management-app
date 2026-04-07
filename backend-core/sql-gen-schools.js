const { v4: uuidv4 } = require('uuid');
async function run() {
  const school1Id = uuidv4();
  const school2Id = uuidv4();
  
  console.log(`
-- 1. Create Schools
INSERT INTO "School" ("id", "name", "address", "email", "phone", "licenseKey", "isActive", "licenseExpiresAt", "updatedAt") 
VALUES 
('${school1Id}', 'Lycée d''Excellence Bamako', 'ACI 2000, Bamako', 'contact@lycee-excellence.ml', '+223 70 00 00 01', '${uuidv4()}', true, now() + interval '1 year', now()),
('${school2Id}', 'School Management-Mali', 'Kalaban Coro, Bamako', 'info@school-management.ml', '+223 70 00 00 02', '${uuidv4()}', true, now() + interval '1 year', now());

-- 2. Create Academic Years
INSERT INTO "AcademicYear" ("id", "name", "isActive", "schoolId", "updatedAt") 
VALUES 
('${uuidv4()}', '2023-2024', false, '${school1Id}', now()),
('${uuidv4()}', '2024-2025', true, '${school1Id}', now()),
('${uuidv4()}', '2024-2025', true, '${school2Id}', now());

-- 3. Create Settings (Badge Templates)
INSERT INTO "BadgeTemplate" ("id", "schoolId", "primaryColor", "secondaryColor", "updatedAt") 
VALUES 
('${uuidv4()}', '${school1Id}', '#2563eb', '#ffffff', now()),
('${uuidv4()}', '${school2Id}', '#10b981', '#ffffff', now());
`);
}
run();

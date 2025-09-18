const fs = require('fs');
const path = require('path');
require('dotenv').config();

const candidates = [
  path.join(__dirname, '..', 'dist', 'typeorm-datasource.js'),
  path.join(__dirname, '..', 'dist', 'src', 'typeorm-datasource.js'),
];

const found = candidates.find((p) => fs.existsSync(p));
if (!found) {
  console.error(
    ' Could not find compiled datasource. Tried:\n' + candidates.join('\n'),
  );
  process.exit(1);
}

(async () => {
  try {
    const ds = require(found).default;
    if (!ds) {
      console.error(' Datasource export "default" not found in:', found);
      process.exit(1);
    }

    console.log('Using datasource:', found);
    console.log(' DB host:', process.env.DB_HOST, 'DB:', process.env.DB_NAME);

    await ds.initialize();
    console.log('DataSource initialized');

    const migrations = await ds.runMigrations();
    console.log(
      'Migrations run:',
      migrations.map((m) => m.name),
    );

    await ds.destroy();
    console.log('Connection closed');
    process.exit(0);
  } catch (e) {
    console.error(' Migration failed:', e.code || e.name || e.message);
    if (e.sqlMessage) console.error('sqlMessage:', e.sqlMessage);
    if (e.sql) console.error('sql:', e.sql);
    process.exit(1);
  }
})();

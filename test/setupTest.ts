import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'db-test.sqlite'));
  } catch (error) {}
});

// global.afterEach(async () => {
//   const conn = getConnection();
//   await conn.close();
// });

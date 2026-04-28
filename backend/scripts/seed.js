#!/usr/bin/env node
require('dotenv').config();
const { seed } = require('../src/utils/seedData');
const db = require('../src/models');

const args = process.argv.slice(2);
const force = args.includes('--force') || args.includes('-f');

async function run() {
  console.log('================================================');
  console.log('🌱 Student Manager - Database Seeder');
  console.log('================================================');
  console.log(`Database: ${process.env.DB_NAME || 'student_manager'}`);
  console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`Force reset: ${force ? 'YES' : 'NO'}`);
  console.log('');

  const ok = await seed({ force, sync: true });

  await db.sequelize.close();
  process.exit(ok ? 0 : 1);
}

run();

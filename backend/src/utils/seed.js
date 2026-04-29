require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../models');


async function seed() {
  try {
    await db.sequelize.sync();
    console.log('Database synced.');

    // Seed roles
    const roles = [
      { name: 'admin', description: 'Quản trị viên toàn hệ thống' },
      { name: 'chi_huy', description: 'Chỉ huy đơn vị' },
      { name: 'hoc_vien', description: 'Học viên' },
    ];
    for (const r of roles) {
      await db.role.findOrCreate({ where: { name: r.name }, defaults: r });
    }
    console.log('Roles seeded.');

    // Seed admin user
    const adminRole = await db.role.findOne({ where: { name: 'admin' } });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const [adminUser, created] = await db.user.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        email: 'admin@studentmanager.local',
        password: hashedPassword,
        fullName: 'Quản trị viên',
        phone: '0900000000',
        roleId: adminRole.id,
        isActive: true,
      },
    });
    console.log(created ? 'Admin user created.' : 'Admin user already exists.');

    // Seed a sample university
    await db.university.findOrCreate({
      where: { code: 'NEU' },
      defaults: { code: 'NEU', name: 'Đại học Kinh tế Quốc dân', address: '207 Giải Phóng, Hà Nội' },
    });
    console.log('Sample university seeded.');

    // Seed a sample academic year
    await db.academicYear.findOrCreate({
      where: { name: '2024-2025' },
      defaults: { name: '2024-2025', startYear: 2024, endYear: 2025 },
    });
    console.log('Sample academic year seeded.');

    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();

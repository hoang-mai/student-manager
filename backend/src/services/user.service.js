const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../models');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');
const { findStudentUserByCode } = require('../utils/studentLookup');

const User = db.user;
const Profile = db.profile;

const PROFILE_FIELDS = [
  'code', 'fullName', 'email', 'gender', 'birthday', 'hometown', 'ethnicity',
  'religion', 'currentAddress', 'placeOfBirth', 'phoneNumber', 'cccd',
  'partyMemberCardNumber', 'unit', 'rank', 'positionGovernment', 'positionParty',
  'fullPartyMember', 'probationaryPartyMember', 'dateOfEnlistment', 'avatar',
  'enrollment', 'graduationDate', 'currentCpa4', 'currentCpa10', 'familyMember',
  'foreignRelations', 'startWork', 'organization', 'classId', 'organizationId',
  'universityId', 'educationLevelId',
];

const _generateCode = (prefix) => `${prefix}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

const _hashPassword = (password) => bcrypt.hash(password || '123456', 10);

const normalizeHeader = (value) => String(value || '').trim().toLowerCase();

const getCellValue = (row, headerMap, names) => {
  for (const name of names) {
    const index = headerMap.get(normalizeHeader(name));
    if (!index) continue;
    const value = row.getCell(index).value;
    if (value && typeof value === 'object' && 'text' in value) return value.text;
    if (value && typeof value === 'object' && 'result' in value) return value.result;
    return value;
  }
  return undefined;
};

const toText = (value) => {
  if (value === null || value === undefined) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value).trim();
  return text || undefined;
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const normalizeRole = (value) => {
  const role = String(value || '').trim().toUpperCase();
  const roleMap = {
    'HOC VIEN': 'STUDENT',
    'HỌC VIÊN': 'STUDENT',
    STUDENT: 'STUDENT',
    'CHI HUY': 'COMMANDER',
    'CHỈ HUY': 'COMMANDER',
    COMMANDER: 'COMMANDER',
    'QUAN TRI VIEN': 'ADMIN',
    'QUẢN TRỊ VIÊN': 'ADMIN',
    ADMIN: 'ADMIN',
  };
  return roleMap[role] || role || 'STUDENT';
};

const _checkRoleHierarchy = (requester, targetRole) => {
  if (!requester) return;
  if (requester.role === 'COMMANDER' && (targetRole === 'ADMIN' || targetRole === 'COMMANDER')) {
    throw new ForbiddenError('Chỉ huy không thể quản lý tài khoản chỉ huy hoặc admin');
  }
};

const _createProfile = async (data, requester) => {
  if (data.role === 'ADMIN' && requester && requester.role !== 'ADMIN') {
    throw new ForbiddenError('Chỉ admin mới có thể tạo tài khoản admin');
  }
  if (data.role === 'COMMANDER' && requester && requester.role === 'COMMANDER') {
    throw new ForbiddenError('Chỉ huy không thể tạo tài khoản chỉ huy');
  }

  if ((data.role === 'STUDENT' || data.role === 'COMMANDER') && data.fullName) {
    if (data.code) {
      const existing = await Profile.findOne({ where: { code: data.code } });
      if (existing) throw new BadRequestError(`Mã ${data.code} đã tồn tại`);
    }

    const prefix = data.role === 'COMMANDER' ? 'CH' : 'HV';
    const code = data.code || _generateCode(prefix);

    const profileData = { code, fullName: data.fullName, email: data.email };
    for (const field of PROFILE_FIELDS) {
      if (data[field] !== undefined && field !== 'code' && field !== 'fullName' && field !== 'email') {
        profileData[field] = data[field];
      }
    }

    const profile = await Profile.create(profileData);
    data.profileId = profile.id;
  }

  for (const field of PROFILE_FIELDS) {
    delete data[field];
  }

  return data;
};

const create = async (data, requester) => {
  await _createProfile(data, requester);

  if (data.password) {
    data.password = await _hashPassword(data.password);
  }

  data.isAdmin = data.role === 'ADMIN';

  return User.create(data);
};

const getAll = async (query) => {
  const where = {};
  const profileWhere = {};

  for (const field of ['username', 'role', 'isAdmin', 'isActive']) {
    if (query[field] !== undefined) where[field] = query[field];
  }

  if (query.code) profileWhere.code = query.code;
  if (query.fullName) profileWhere.fullName = { [db.Sequelize.Op.iLike]: `%${query.fullName}%` };

  return paginateQuery(User, query, {
    where,
    include: [
      {
        model: Profile,
        ...(Object.keys(profileWhere).length > 0 ? { where: profileWhere, required: true } : {}),
        include: [
          { model: db.university },
          { model: db.class },
          { model: db.organization },
          { model: db.educationLevel },
        ],
      },
    ],
  });
};

const getDetail = async (id) => {
  const record = await User.findByPk(id, {
    include: [
      {
        model: Profile,
        include: [
          { model: db.university },
          { model: db.class },
          { model: db.organization },
          { model: db.educationLevel },
        ],
      },
    ],
  });
  if (!record) throw new NotFoundError('Không tìm thấy người dùng');
  return record;
};

const update = async (id, data, requester) => {
  const record = await getDetail(id);
  _checkRoleHierarchy(requester, record.role);
  if (data.role) {
    _checkRoleHierarchy(requester, data.role);
  }
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const hasProfileFields = PROFILE_FIELDS.some((f) => data[f] !== undefined);
  if (hasProfileFields && record.Profile) {
    const profileUpdate = {};
    for (const field of PROFILE_FIELDS) {
      if (data[field] !== undefined) {
        profileUpdate[field] = data[field];
        delete data[field];
      }
    }
    await record.Profile.update(profileUpdate);
  }

  return record.update(data);
};

const deleteRecord = async (id, requester) => {
  const record = await getDetail(id);
  _checkRoleHierarchy(requester, record.role);
  await record.destroy();
  return { deleted: true };
};

const createBatchUsers = async (users, requester) => {
  const results = [];
  for (const u of users) {
    const exist = await User.findOne({ where: { username: u.username } });
    if (exist) {
      results.push({ username: u.username, status: 'SKIPPED', message: 'Tên đăng nhập đã tồn tại' });
      continue;
    }

    try {
      await _createProfile(u, requester);

      const hashedPassword = await _hashPassword(u.password);
      await User.create({
        username: u.username,
        password: hashedPassword,
        role: u.role || 'STUDENT',
        isAdmin: u.role === 'ADMIN',
        profileId: u.profileId || null,
      });
      results.push({ username: u.username, status: 'CREATED' });
    } catch (err) {
      results.push({ username: u.username, status: 'ERROR', message: err.message });
    }
  }
  return results;
};

const resetPassword = async (userId, newPassword, requester) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('Không tìm thấy người dùng');
  _checkRoleHierarchy(requester, user.role);

  const hashedPassword = await bcrypt.hash(newPassword || '123456', 10);
  await user.update({ password: hashedPassword });
  return { message: 'Đặt lại mật khẩu thành công' };
};

const toggleActive = async (userId, requester) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('Không tìm thấy người dùng');
  _checkRoleHierarchy(requester, user.role);

  const newStatus = !user.isActive;
  await user.update({ isActive: newStatus });
  return { isActive: newStatus };
};

const getMyProfile = async (userId) => {
  const user = await User.findByPk(userId, { include: [{ model: Profile }] });
  if (!user || !user.Profile) throw new NotFoundError('Không tìm thấy hồ sơ');
  return user.Profile;
};

const updateMyProfile = async (userId, data) => {
  const user = await User.findByPk(userId, { include: [{ model: Profile }] });
  if (!user || !user.Profile) throw new NotFoundError('Không tìm thấy hồ sơ');
  const updateData = {};
  for (const field of PROFILE_FIELDS) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }
  await user.Profile.update(updateData);
  return user.Profile;
};

const uploadAvatar = async (userId, avatarUrl) => {
  const user = await User.findByPk(userId, { include: [{ model: Profile }] });
  if (!user || !user.Profile) throw new NotFoundError('Không tìm thấy hồ sơ');
  await user.Profile.update({ avatar: avatarUrl });
  return { avatar: avatarUrl };
};

const createBatchUsersProfiles = async (users, requester) => {
  const results = [];
  for (const u of users) {
    const exist = await User.findOne({ where: { username: u.username } });
    if (exist) {
      results.push({ username: u.username, status: 'SKIPPED', message: 'Tên đăng nhập đã tồn tại' });
      continue;
    }
    try {
      await _createProfile(u, requester);
      const hashedPassword = await _hashPassword(u.password || '123456');
      const user = await User.create({
        username: u.username,
        password: hashedPassword,
        role: u.role || 'STUDENT',
        isAdmin: u.role === 'ADMIN',
        profileId: u.profileId || null,
      });
      results.push({ id: user.id, username: u.username, profileId: u.profileId, status: 'CREATED' });
    } catch (err) {
      results.push({ username: u.username, status: 'ERROR', message: err.message });
    }
  }
  return results;
};

const createImportTemplate = async () => {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Nguoi dung');

  worksheet.columns = [
    { header: 'Tên đăng nhập', key: 'username', width: 18 },
    { header: 'Mật khẩu', key: 'password', width: 16 },
    { header: 'Vai trò', key: 'role', width: 16 },
    { header: 'Mã', key: 'code', width: 14 },
    { header: 'Họ và tên', key: 'fullName', width: 26 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Số điện thoại', key: 'phoneNumber', width: 18 },
    { header: 'Giới tính', key: 'gender', width: 12 },
    { header: 'Ngày sinh', key: 'birthday', width: 14 },
    { header: 'Quê quán', key: 'hometown', width: 24 },
    { header: 'Khóa học', key: 'enrollment', width: 12 },
    { header: 'Đơn vị', key: 'unit', width: 20 },
    { header: 'Cấp bậc', key: 'rank', width: 16 },
  ];

  worksheet.addRows([
    {
      username: 'hv011',
      password: 'hocvien123',
      role: 'STUDENT',
      code: 'HV011',
      fullName: 'Nguyễn Văn A',
      email: 'vana@example.com',
      phoneNumber: '0123456789',
      gender: 'MALE',
      birthday: '2005-01-01',
      hometown: 'Hà Nội',
      enrollment: 2025,
      unit: 'Đại đội 1',
      rank: 'Binh nhất',
    },
    {
      username: 'chihuy03',
      password: 'chihuy123',
      role: 'COMMANDER',
      code: 'CH003',
      fullName: 'Trần Văn B',
      email: 'vanb@example.com',
      phoneNumber: '0987654321',
      gender: 'MALE',
      birthday: '1990-02-02',
      hometown: 'Đà Nẵng',
      unit: 'Ban chỉ huy',
      rank: 'Đại úy',
    },
  ]);

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  worksheet.getColumn('birthday').numFmt = 'yyyy-mm-dd';

  return workbook.xlsx.writeBuffer();
};

const parseExcelImport = async (file) => {
  if (!file?.buffer) throw new BadRequestError('Vui lòng tải lên file Excel');

  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file.buffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new BadRequestError('File Excel không có sheet dữ liệu');

  const headerMap = new Map();
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap.set(normalizeHeader(cell.value), colNumber);
  });

  const users = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const username = toText(getCellValue(row, headerMap, ['Tên đăng nhập', 'username']));
    if (!username) return;

    users.push({
      username,
      password: toText(getCellValue(row, headerMap, ['Mật khẩu', 'password'])),
      role: normalizeRole(getCellValue(row, headerMap, ['Vai trò', 'role'])),
      code: toText(getCellValue(row, headerMap, ['Mã', 'code'])),
      fullName: toText(getCellValue(row, headerMap, ['Họ và tên', 'fullName'])),
      email: toText(getCellValue(row, headerMap, ['Email', 'email'])),
      phoneNumber: toText(getCellValue(row, headerMap, ['Số điện thoại', 'phoneNumber'])),
      gender: toText(getCellValue(row, headerMap, ['Giới tính', 'gender'])),
      birthday: toText(getCellValue(row, headerMap, ['Ngày sinh', 'birthday'])),
      hometown: toText(getCellValue(row, headerMap, ['Quê quán', 'hometown'])),
      enrollment: toNumber(getCellValue(row, headerMap, ['Khóa học', 'enrollment'])),
      unit: toText(getCellValue(row, headerMap, ['Đơn vị', 'unit'])),
      rank: toText(getCellValue(row, headerMap, ['Cấp bậc', 'rank'])),
    });
  });

  if (!users.length) throw new BadRequestError('File Excel không có dòng người dùng hợp lệ');

  return users;
};

const updateBatchProfiles = async (profiles) => {
  const results = [];
  for (const p of profiles) {
    try {
      const profile = await Profile.findOne({ where: { code: p.code } });
      if (!profile) {
        results.push({ code: p.code, status: 'ERROR', message: 'Không tìm thấy hồ sơ' });
        continue;
      }
      const updateData = {};
      for (const field of PROFILE_FIELDS) {
        if (p[field] !== undefined) updateData[field] = p[field];
      }
      await profile.update(updateData);
      results.push({ code: p.code, status: 'UPDATED' });
    } catch (err) {
      results.push({ code: p.code, status: 'ERROR', message: err.message });
    }
  }
  return results;
};

const graduateBatchProfiles = async (data) => {
  const graduationDate = data.graduationDate;
  const students = data.students || data.studentCodes.map((code) => ({ code, graduationDate }));
  const results = [];

  for (const item of students) {
    const code = item.code || item.studentCode;
    try {
      const { profile } = await findStudentUserByCode(code);
      await profile.update({ graduationDate: item.graduationDate || graduationDate });
      results.push({ code, status: 'UPDATED' });
    } catch (err) {
      results.push({ code, status: 'ERROR', message: err.message });
    }
  }

  return {
    total: results.length,
    updated: results.filter((item) => item.status === 'UPDATED').length,
    errors: results.filter((item) => item.status === 'ERROR').length,
    results,
  };
};

module.exports = {
  create,
  getAll,
  getDetail,
  update,
  delete: deleteRecord,
  createBatchUsers,
  resetPassword,
  toggleActive,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  createBatchUsersProfiles,
  parseExcelImport,
  createImportTemplate,
  updateBatchProfiles,
  graduateBatchProfiles,
};

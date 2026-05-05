const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../models');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../utils/apiError');
const { paginateQuery } = require('../utils/response');

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

const _createProfile = async (data, requester) => {
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

const getAll = async (query) => paginateQuery(User, query, {
  filterFields: ['username', 'role', 'isAdmin', 'isActive'],
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

const update = async (id, data) => {
  const record = await getDetail(id);
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

const deleteRecord = async (id) => {
  const record = await getDetail(id);
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

const resetPassword = async (userId, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('Không tìm thấy người dùng');

  const hashedPassword = await bcrypt.hash(newPassword || '123456', 10);
  await user.update({ password: hashedPassword });
  return { message: 'Đặt lại mật khẩu thành công' };
};

const toggleActive = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('Không tìm thấy người dùng');

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
  updateBatchProfiles,
};

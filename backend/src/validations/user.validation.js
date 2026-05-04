const yup = require('yup');

const profileFields = {
  code: yup.string().max(50),
  fullName: yup.string().max(100),
  email: yup.string().max(100).email('Email không hợp lệ'),
  gender: yup.string().max(20),
  birthday: yup.date(),
  hometown: yup.string().max(255),
  ethnicity: yup.string().max(50),
  religion: yup.string().max(50),
  currentAddress: yup.string().max(255),
  placeOfBirth: yup.string().max(255),
  phoneNumber: yup.string().max(20),
  cccd: yup.string().max(20),
  partyMemberCardNumber: yup.string().max(50),
  unit: yup.string().max(255),
  rank: yup.string().max(50),
  positionGovernment: yup.string().max(100),
  positionParty: yup.string().max(100),
  fullPartyMember: yup.date(),
  probationaryPartyMember: yup.date(),
  dateOfEnlistment: yup.date(),
  avatar: yup.string().max(255),
  enrollment: yup.number().integer(),
  graduationDate: yup.date(),
  currentCpa4: yup.number(),
  currentCpa10: yup.number(),
  familyMember: yup.mixed(),
  foreignRelations: yup.mixed(),
  startWork: yup.number().integer(),
  organization: yup.string().max(255),
  classId: yup.string().max(36),
  organizationId: yup.string().max(36),
  universityId: yup.string().max(36),
  educationLevelId: yup.string().max(36),
};

const create = yup.object({
  username: yup.string().max(50).required('Trường này là bắt buộc'),
  password: yup.string().max(255).required('Trường này là bắt buộc'),
  isAdmin: yup.boolean(),
  role: yup.string().max(50).oneOf(['STUDENT', 'COMMANDER', 'ADMIN'], 'Vai trò không hợp lệ'),
  refreshToken: yup.string(),
  deleteAt: yup.date(),
  ...profileFields,
});

const update = yup.object({
  username: yup.string().max(50),
  password: yup.string().max(255),
  isAdmin: yup.boolean(),
  role: yup.string().max(50),
  refreshToken: yup.string(),
  deleteAt: yup.date(),
  ...profileFields,
});

const batch = yup.object({
  username: yup.string().max(50).required('Trường này là bắt buộc'),
  password: yup.string().max(255),
  isAdmin: yup.boolean(),
  role: yup.string().max(50),
  refreshToken: yup.string(),
  deleteAt: yup.date(),
  ...profileFields,
});

const resetPassword = yup.object({
  newPassword: yup.string().min(6).required('Trường này là bắt buộc'),
});

module.exports = { create, update, batch, resetPassword };

const yup = require('yup');

const create = yup.object({
  studentId: yup.string().max(50).required('Trường này là bắt buộc'),
  fullName: yup.string().max(100),
  gender: yup.string().max(20),
  birthday: yup.date(),
  hometown: yup.string().max(255),
  ethnicity: yup.string().max(50),
  religion: yup.string().max(50),
  currentAddress: yup.string().max(255),
  placeOfBirth: yup.string().max(255),
  phoneNumber: yup.string().max(20),
  email: yup.string().max(100).email('Email không hợp lệ'),
  cccdNumber: yup.string().max(20),
  partyMemberCardNumber: yup.string().max(50),
  enrollment: yup.number().integer().min(0),
  graduationDate: yup.date(),
  unit: yup.string().max(255),
  rank: yup.string().max(50),
  positionGovernment: yup.string().max(100),
  positionParty: yup.string().max(100),
  fullPartyMember: yup.date(),
  probationaryPartyMember: yup.date(),
  dateOfEnlistment: yup.date(),
  avatar: yup.string().max(255),
  currentCpa4: yup.number().min(0).max(4),
  currentCpa10: yup.number().min(0).max(10),
  familyMember: yup.object(),
  foreignRelations: yup.object(),
  classId: yup.string().uuid('classId không hợp lệ'),
  organizationId: yup.string().uuid('organizationId không hợp lệ'),
  universityId: yup.string().uuid('universityId không hợp lệ'),
  educationLevelId: yup.string().uuid('educationLevelId không hợp lệ'),
});

const update = yup.object({
  studentId: yup.string().max(50),
  fullName: yup.string().max(100),
  gender: yup.string().max(20),
  birthday: yup.date(),
  hometown: yup.string().max(255),
  ethnicity: yup.string().max(50),
  religion: yup.string().max(50),
  currentAddress: yup.string().max(255),
  placeOfBirth: yup.string().max(255),
  phoneNumber: yup.string().max(20),
  email: yup.string().max(100).email('Email không hợp lệ'),
  cccdNumber: yup.string().max(20),
  partyMemberCardNumber: yup.string().max(50),
  enrollment: yup.number().integer().min(0),
  graduationDate: yup.date(),
  unit: yup.string().max(255),
  rank: yup.string().max(50),
  positionGovernment: yup.string().max(100),
  positionParty: yup.string().max(100),
  fullPartyMember: yup.date(),
  probationaryPartyMember: yup.date(),
  dateOfEnlistment: yup.date(),
  avatar: yup.string().max(255),
  currentCpa4: yup.number().min(0).max(4),
  currentCpa10: yup.number().min(0).max(10),
  familyMember: yup.object(),
  foreignRelations: yup.object(),
  classId: yup.string().uuid('classId không hợp lệ'),
  organizationId: yup.string().uuid('organizationId không hợp lệ'),
  universityId: yup.string().uuid('universityId không hợp lệ'),
  educationLevelId: yup.string().uuid('educationLevelId không hợp lệ'),
});

const profileUpdate = yup.object({
  currentAddress: yup.string().max(255),
  phoneNumber: yup.string().max(20),
  email: yup.string().max(100).email('Email không hợp lệ'),
  avatar: yup.string().max(255),
  rank: yup.string().max(50),
  unit: yup.string().max(255),
  positionGovernment: yup.string().max(100),
  positionParty: yup.string().max(100),
});

const timetable = yup.object({
  schedules: yup.array().of(
    yup.object({
      day: yup.string().required('Trường này là bắt buộc'),
      startTime: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ không hợp lệ').required('Trường này là bắt buộc'),
      endTime: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ không hợp lệ').required('Trường này là bắt buộc'),
      room: yup.string().required('Trường này là bắt buộc'),
    }),
  ),
});

const cutRiceSchema = yup.object({
  weekly: yup.object().required('Trường này là bắt buộc'),
  notes: yup.string().max(255),
});

module.exports = { create, update, profileUpdate, timetable, cutRice: cutRiceSchema };

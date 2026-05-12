const yup = require('yup');
const { RANKS } = require('../utils/constants');

const create = yup.object({
  fullName: yup.string().max(100).nullable(),
  rank: yup.string().oneOf(RANKS, 'Cấp bậc không hợp lệ').nullable(),
  phoneNumber: yup.string().max(20).nullable(),
  position: yup.string().max(100).nullable(),
  workDay: yup.date().nullable(),
});

const update = yup.object({
  fullName: yup.string().max(100).nullable(),
  rank: yup.string().oneOf(RANKS, 'Cấp bậc không hợp lệ').nullable(),
  phoneNumber: yup.string().max(20).nullable(),
  position: yup.string().max(100).nullable(),
  workDay: yup.date().nullable(),
});

module.exports = { create, update };

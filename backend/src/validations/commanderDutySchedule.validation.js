const yup = require('yup');

const create = yup.object({
  fullName: yup.string().max(100).nullable(),
  rank: yup.string().max(50).nullable(),
  phoneNumber: yup.string().max(20).nullable(),
  position: yup.string().max(100).nullable(),
  workDay: yup.date().nullable(),
});

const update = yup.object({
  fullName: yup.string().max(100).nullable(),
  rank: yup.string().max(50).nullable(),
  phoneNumber: yup.string().max(20).nullable(),
  position: yup.string().max(100).nullable(),
  workDay: yup.date().nullable(),
});

module.exports = { create, update };

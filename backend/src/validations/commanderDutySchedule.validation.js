const yup = require('yup');

const create = yup.object({
  fullName: yup.string().max(100),
  rank: yup.string().max(50),
  phoneNumber: yup.string().max(20),
  position: yup.string().max(100),
  workDay: yup.date(),
});

const update = yup.object({
  fullName: yup.string().max(100),
  rank: yup.string().max(50),
  phoneNumber: yup.string().max(20),
  position: yup.string().max(100),
  workDay: yup.date(),
});

module.exports = { create, update };

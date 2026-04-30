const db = require('../models');
const { NotFoundError } = require('../utils/apiError');

const CommanderDutySchedule = db.commanderDutySchedule;

const create = async (data) => CommanderDutySchedule.create(data);
const getAll = async () => CommanderDutySchedule.findAll();

const getDetail = async (id) => {
  const record = await CommanderDutySchedule.findByPk(id);
  if (!record) throw new NotFoundError('Không tìm thấy lịch trực');
  return record;
};

const update = async (id, data) => {
  const record = await getDetail(id);
  return record.update(data);
};

const deleteRecord = async (id) => {
  const record = await getDetail(id);
  await record.destroy();
  return { deleted: true };
};

module.exports = { create, getAll, getDetail, update, delete: deleteRecord };

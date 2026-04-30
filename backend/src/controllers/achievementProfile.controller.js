const service = require('../services/achievementProfile.service');
const { success } = require('../utils/response');

const create = async (req, res) => {
  const result = await service.create(req.body);
  return success(res, result, 'Created successfully', 201);
};

const getAll = async (req, res) => {
  const result = await service.getAll();
  return success(res, result);
};

const getDetail = async (req, res) => {
  const result = await service.getDetail(req.params.id);
  return success(res, result);
};

const update = async (req, res) => {
  const result = await service.update(req.params.id, req.body);
  return success(res, result, 'Updated successfully');
};

const deleteRecord = async (req, res) => {
  await service.delete(req.params.id);
  return success(res, null, 'Deleted successfully');
};

module.exports = { create, getAll, getDetail, update, delete: deleteRecord };

const asyncHandler = require('express-async-handler');
const service = require('../services/fileStorage.service');

const getFile = asyncHandler(async (req, res) => {
  const objectName = req.params[0];
  const { stream, stat } = await service.getObjectStream(req.params.bucket, objectName);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  if (stat?.metaData?.['content-type']) {
    res.setHeader('Content-Type', stat.metaData['content-type']);
  }
  return stream.pipe(res);
});

module.exports = { getFile };

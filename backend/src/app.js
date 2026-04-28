const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-handler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
morgan.token('body', (req) => {
  const body = { ...req.body };
  if (body.password) body.password = '***';
  if (body.oldPassword) body.oldPassword = '***';
  if (body.newPassword) body.newPassword = '***';
  return JSON.stringify(body) || '-';
});
morgan.token('query', (req) => JSON.stringify(req.query) || '-');
const logFormat = '[:date[iso]] :method :url :status :res[content-length] - :response-time ms | Query: :query | Body: :body';
app.use(morgan(logFormat));

// Routes
const routes = require('./routes');
app.use('/api', routes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;

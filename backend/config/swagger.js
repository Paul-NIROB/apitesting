const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A REST API for task management with authentication and role-based access control',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'COMPLETED'] },
            userId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/api/v1/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    role: { type: 'string', enum: ['USER', 'ADMIN'] },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthResponse',
                  },
                },
              },
            },
            400: {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthResponse',
                  },
                },
              },
            },
            401: {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User data retrieved successfully',
            },
            401: {
              description: 'Unauthorized',
            },
          },
        },
      },
      '/api/v1/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'Get all tasks',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of tasks',
            },
            401: {
              description: 'Unauthorized',
            },
          },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a new task',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['PENDING', 'COMPLETED'] },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Task created successfully',
            },
            400: {
              description: 'Bad request',
            },
          },
        },
      },
      '/api/v1/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get task by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Task retrieved successfully',
            },
            404: {
              description: 'Task not found',
            },
          },
        },
        put: {
          tags: ['Tasks'],
          summary: 'Update task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    status: { type: 'string', enum: ['PENDING', 'COMPLETED'] },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Task updated successfully',
            },
            404: {
              description: 'Task not found',
            },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete task',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            200: {
              description: 'Task deleted successfully',
            },
            404: {
              description: 'Task not found',
            },
          },
        },
      },
    },
  },
  apis: [],
};

const specs = swaggerJsdoc(options);

module.exports = specs;

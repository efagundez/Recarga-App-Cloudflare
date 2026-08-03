import { NextResponse } from 'next/server';

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Recarga App API',
    description:
      'API REST para la plataforma de recargas telefÃ³nicas y lÃ­neas virtuales para Venezuela.\n\n' +
      '### AutenticaciÃ³n\n' +
      'La mayorÃ­a de los endpoints requieren un **Bearer Token** en la cabecera `Authorization`.\n' +
      'ObtÃ©n tu token con `POST /api/auth/login` o `POST /api/auth/register`.',
    version: '1.0.0',
    contact: {
      name: 'Recarga App Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Registro e inicio de sesiÃ³n' },
    { name: 'Recargas', description: 'Operaciones CRUD de recargas telefÃ³nicas' },
    { name: 'Health', description: 'Endpoints de salud / prueba' },
  ],
  paths: {
    '/api/hello': {
      get: {
        tags: ['Health'],
        summary: 'Endpoint de prueba',
        description: 'Retorna un mensaje de saludo para verificar que la API estÃ¡ activa.',
        responses: {
          '200': {
            description: 'Saludo exitoso',
            content: {
              'text/plain': {
                schema: { type: 'string', example: 'Hello, from API!' },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un nuevo usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Usuario registrado exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Datos invÃ¡lidos o correo ya registrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesiÃ³n',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'SesiÃ³n iniciada exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Faltan email o contraseÃ±a',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Credenciales invÃ¡lidas',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/recargas': {
      get: {
        tags: ['Recargas'],
        summary: 'Listar recargas del usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de recargas obtenida',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 2 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Recharge' },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Recargas'],
        summary: 'Crear una nueva recarga',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RechargeCreate' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Recarga creada exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Recharge' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Datos incompletos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/recargas/{id}': {
      get: {
        tags: ['Recargas'],
        summary: 'Obtener una recarga por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID de la recarga (MongoDB ObjectId)',
          },
        ],
        responses: {
          '200': {
            description: 'Recarga obtenida',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Recharge' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Prohibido â€“ no es dueÃ±o ni admin',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Recarga no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Recargas'],
        summary: 'Actualizar estado de una recarga (solo ADMIN)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID de la recarga',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RechargeUpdateStatus' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Estado actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Recharge' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Estado invÃ¡lido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Solo administradores',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Recarga no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Recargas'],
        summary: 'Eliminar una recarga (solo ADMIN)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID de la recarga',
          },
        ],
        responses: {
          '200': {
            description: 'Recarga eliminada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Recarga eliminada correctamente',
                    },
                  },
                },
              },
            },
          },
          '403': {
            description: 'Solo administradores',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Recarga no encontrada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtenido en /api/auth/login o /api/auth/register',
      },
    },
    schemas: {
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
          password: { type: 'string', format: 'password', example: 'miContraseÃ±a123' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          name: { type: 'string', example: 'Juan PÃ©rez' },
          email: { type: 'string', format: 'email', example: 'juan@ejemplo.com' },
          password: { type: 'string', format: 'password', example: 'miContraseÃ±a123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
              name: { type: 'string', example: 'Juan PÃ©rez' },
              email: { type: 'string', example: 'juan@ejemplo.com' },
              role: {
                type: 'string',
                enum: ['ADMIN', 'CLIENT', 'DISTRIBUTOR'],
                example: 'CLIENT',
              },
            },
          },
        },
      },
      RechargeCreate: {
        type: 'object',
        required: ['phoneNumber', 'operator', 'amount'],
        properties: {
          phoneNumber: { type: 'string', example: '0412-1234567' },
          operator: {
            type: 'string',
            enum: ['Movistar', 'Digitel', 'Movilnet'],
            example: 'Movistar',
          },
          amount: { type: 'number', minimum: 1, example: 500 },
        },
      },
      RechargeUpdateStatus: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['PENDING', 'COMPLETED', 'FAILED'],
            example: 'COMPLETED',
          },
        },
      },
      Recharge: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
          userId: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0e' },
          phoneNumber: { type: 'string', example: '0412-1234567' },
          operator: {
            type: 'string',
            enum: ['Movistar', 'Digitel', 'Movilnet'],
            example: 'Movistar',
          },
          amount: { type: 'number', example: 500 },
          status: {
            type: 'string',
            enum: ['PENDING', 'COMPLETED', 'FAILED'],
            example: 'PENDING',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-07-23T12:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-07-23T12:00:00.000Z',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'DescripciÃ³n del error' },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}



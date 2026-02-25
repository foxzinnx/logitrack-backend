export const swaggerConfig = {
  openapi: {
    openapi: '3.1.0',
    info: {
      title: 'API de Logística e Rastreamento',
      description: 'API RESTful para gerenciamento de entregas e rastreamento de encomendas',
      version: '1.0.0',
      contact: {
        name: 'Bryan Gomes',
        email: 'contato@exemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Desenvolvimento'
      }
    ],
    tags: [
      { name: 'Admin', description: 'Endpoints de administração' },
      { name: 'Deliverer', description: 'Endpoints de entregadores' },
      { name: 'Package', description: 'Endpoints de encomendas' },
      { name: 'Health', description: 'Health check' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no login'
        }
      }
    }
  }
};

export const swaggerUiConfig = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true
};
import type { FastifyInstance } from 'fastify';
import { adminSectController } from './sect.controller.js';
import { authenticate, requireRole } from '../../../shared/middleware/auth.middleware.js';

export async function adminSectRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', requireRole('ADMIN', 'GM'));

  fastify.get('/sects', { handler: adminSectController.getList.bind(adminSectController) });
  fastify.get('/sects/stats', { handler: adminSectController.getStats.bind(adminSectController) });
  fastify.get('/sects/:id/members', { handler: adminSectController.getMembers.bind(adminSectController) });
  fastify.delete('/sects/:id', { handler: adminSectController.disband.bind(adminSectController) });
  fastify.delete('/sects/:id/members/:playerId', { handler: adminSectController.kickMember.bind(adminSectController) });
}

export default adminSectRoutes;

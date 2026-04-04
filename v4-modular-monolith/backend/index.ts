/**
 * SkinMinder Backend (Modular Monolith)
 * Entry point for all modules.
 */

import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Core Plugin Loading
// fastify.register(import('./core/database'));
// fastify.register(import('./modules/scans'));
// fastify.register(import('./modules/ai-analysis'));
// fastify.register(import('./modules/outcomes'));

fastify.get('/health', async () => ({ status: 'modular-monolith-active' }));

const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

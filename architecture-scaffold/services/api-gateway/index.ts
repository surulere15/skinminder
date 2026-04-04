/**
 * SkinMinder API Gateway
 * Entry point for all product surfaces.
 */

import Fastify from 'fastify';
import { ScanResultSchema } from '../../packages/schemas/scan.schema';

const fastify = Fastify({ logger: true });

// Health Check
fastify.get('/health', async () => ({ status: 'optimal', network: 'ready' }));

// Consumer Scan Upload
fastify.post('/v1/user/scans/upload-url', async (request, reply) => {
  // Logic to generate S3 Signed URL
  return { uploadUrl: 'https://s3.amazonaws.com/temp-scan-bucket/uuid?signed=true', scanId: 'uuid' };
});

// Scan Polling
fastify.get('/v1/user/scans/:id', async (request, reply) => {
  // Logic to fetch scan status from Redis/Postgres
  return { id: request.params.id, status: 'processing' };
});

// Brand Widget Config
fastify.get('/v1/widget/config/:key', async (request, reply) => {
  return {
    brandName: 'GlowCosmetics',
    primaryColor: '#7C6CFF',
    allowGuestScans: true,
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

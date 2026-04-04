# SkinMinder Monorepo Scaffold

This directory contains the production-ready architecture scaffold for the Global Skin Intelligence Network.

## Structure

- **apps/**: Product surfaces (Consumer Web, Brand Portal, Widget).
- **services/**: Independent backend services (API Gateway, Scan Processing).
- **packages/**: Shared logic, design tokens, and database schemas.
- **infra/**: Infrastructure as Code (Terraform).

## Design Philosophy
- **Scalability**: Async scan processing via queues.
- **Consistency**: Shared Zod schemas for all product surfaces.
- **Intelligence**: Dedicated analytics warehouse for enterprise reporting.

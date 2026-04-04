# SkinMinder v3.1: Global Skin Intelligence Network

This monorepo contains the production-ready architecture for the SkinMinder ecosystem, designed to scale to millions of scans through clean, service-oriented boundaries.

## 🌟 The North Star Principles

To ensure long-term scalability and manageability, SkinMinder adheres to these three core principles:

1.  **One Intelligence Engine**: All product surfaces and features consume the same unified AI analysis and logic core (`packages/scan-engine`, `packages/ingredient-engine`).
2.  **Three Product Interfaces**: Specialized surfaces for **Consumers** (Web/Mobile), **Brands** (Embedded Widget), and **Enterprise** (SaaS Analytics) operate independently but share the same underlying intelligence.
3.  **Clean Data Pipeline**: An asynchronous, event-driven processing loop ensuring high throughput, reliable outcomes (PPI), and population-scale research data.

---

## 🏗️ Repository Structure

- **apps/**: Product surfaces (Web, Mobile, Widget, Dashboard).
- **services/**: Highly-granular microservices (Upload, Preprocess, AI, Recs, Outcome, Analytics).
- **packages/**: Shared logic engines and UI components.
- **database/**: Prisma-based operational schema and analytics paths.
- **infrastructure/**: Cloud-native containerization and deployment logic.
- **docs/**: Comprehensive system architecture and API documentation.

## 🚀 Scaling Philosophy
Designed for **Developer Scales** (parallel teams), **Service Scales** (independent clusters), and **Data Scales** (population-level biological mapping).

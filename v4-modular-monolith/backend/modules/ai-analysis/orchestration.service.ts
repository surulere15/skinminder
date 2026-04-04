import { runFullSkinOrchestration } from '@/services/ai/orchestrator';

/**
 * AI Analysis Module - Orchestration Service
 * 
 * High-level orchestration for skin analysis. 
 * This service mediates between raw vision data and deep skin intelligence.
 */
export class OrchestrationService {
    async analyze(params: {
        userId: string;
        imageUrl: string;
        bodyArea: string;
        userProfile: any;
        concerns: string[];
        previousScan?: any;
        partnerId?: string;
    }) {
        console.log(`[Monolith:AI-Analysis] Starting orchestration for user ${params.userId}`);
        
        // Create metadata with partner attribution
        const metadata = {
            ...((params as any).metadata || {}),
            partner_id: params.partnerId
        };

        return runFullSkinOrchestration({
            ...params,
            metadata: metadata
        } as any);
    }
}

export interface Partner {
  id: string;
  name: string;
  settings: Record<string, any>;
}

export interface PartnerStats {
  totalViews: number;
  totalMatches: number;
  totalConversions: number;
  conversionRate: number;
}

export class PartnerService {
  async getPartnerByApiKey(_key: string): Promise<Partner | null> { return null; }
  async getPartnerStats(_partnerId: string): Promise<PartnerStats> {
    return { totalViews: 0, totalMatches: 0, totalConversions: 0, conversionRate: 0 };
  }
}

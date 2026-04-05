export interface Partner {
  id: string;
  name: string;
  settings: Record<string, any>;
}

export class PartnerService {
  async getPartnerByApiKey(_key: string): Promise<Partner | null> { return null; }
}

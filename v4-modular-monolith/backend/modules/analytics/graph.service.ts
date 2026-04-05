export class GraphService {
  async linkScanToProducts(_scanId: string, _userId: string, _phase: string) { return; }
  async recordEnvironment(_env: any) { return ""; }
  async recordEdge(_edge: { fromId: string; toId: string; type: string; weight?: number; metadata?: Record<string, any> }) { return; }
}

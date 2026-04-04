# Technical Debt Documentation

## Known Technical Debt

### High Priority

1. **Job Queue Worker**
   - Status: Infrastructure added (lib/job-queue.ts), but no actual worker running
   - Impact: AI analysis runs synchronously, blocking requests
   - Solution: Implement cron job or Edge Function to process background_jobs table

2. **Test Coverage**
   - Status: 1 test file only (repeatability_test.test.ts)
   - Impact: No safety net for regressions
   - Solution: Add tests for interpretation layer, ingredient conflicts, routine versioning

3. **Mock Mode Production Safety**
   - Status: App runs with mock data in production if ANTHROPIC_API_KEY not set
   - Impact: Users see fake data without realizing it's not real
   - Solution: Add prominent banner/log when in mock mode; require API key in production

### Medium Priority

4. **Latency Telemetry**
   - Status: No explicit latency measurement for API endpoints
   - Impact: Can't measure performance improvements
   - Solution: Add timing middleware to log request duration

5. **Image Upload Resilience**
   - Status: No chunked upload for poor networks
   - Impact: Large uploads may fail on mobile
   - Solution: Implement resumable uploads with retry logic

6. **API Versioning**
   - Status: All endpoints at /api/* without version
   - Impact: Breaking changes affect all users simultaneously
   - Solution: Add /api/v1/* prefix for future backwards compatibility

### Low Priority

7. **Analytics Pipeline**
   - Status: graph.service.ts exists but aggregation runs in-memory
   - Impact: No historical analytics rollups
   - Solution: Implement scheduled aggregation jobs

8. **Skin Twin Algorithm**
   - Status: Uses simple < 10% variance matching
   - Impact: Limited accuracy
   - Solution: Implement ML-based skin twin matching

9. **Ingredient Knowledge Base**
   - Status: Partial coverage, some ingredient relationships missing
   - Impact: Incomplete safety warnings
   - Solution: Expand ingredients table with more relationships

## Deprecated/Removed

- v3-scaffold/ - Deprecated architecture scaffold
- architecture-scaffold/ - Old architecture patterns
- v4-modular-monolith/backend/jobs/scan-worker.ts - Not used, queued for rewrite

## Dependencies to Update

- @anthropic-ai/sdk - Keep updated for AI model improvements
- @supabase/supabase-js - Keep updated for auth improvements
- next - Keep updated for security patches

## Security Considerations

- VAPID keys for push need rotation annually
- Supabase service role key should never be exposed to client
- Rate limiting should be tuned based on production traffic patterns
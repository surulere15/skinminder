# Release Rollback Plan

## Emergency Rollback Procedures

### 1. Deployment Rollback (Vercel)

**Instant Rollback (Recommended)**
```bash
# Via Vercel CLI
vercel --rollback

# Or via Dashboard
# Deployments → Select previous deployment → "Promote to Production"
```

**Rollback Trigger Criteria**
- Error rate > 5% on core flows
- API latency > 10s on /api/scan
- Critical Sentry errors (Sentry alert: "Error: High volume")
- Conversion drop > 20%

### 2. Database Rollback

**Supabase Migrations**
```bash
# View migration history
supabase migration list

# Rollback last migration (use with caution)
supabase db push --dry-run  # Preview changes first

# If catastrophic, restore from point-in-time
# Supabase Dashboard → Settings → Database → Point in time recovery
```

**Critical Tables to Protect**
- `skin_scans` - Contains user scan history (DO NOT DROP)
- `profiles` - User data (DO NOT DROP)
- `background_jobs` - Async job queue (safe to truncate if needed)

### 3. Feature Flags for Quick Toggle

Current feature flags in code:
- `MOCK_MODE` - Toggle mock AI responses
- `NEXT_PUBLIC_ANALYTICS_PROVIDER` - Disable analytics

**Adding Emergency Flags**
For future: Add `/api/flags` endpoint to check feature states.

### 4. Communication Plan

**If Rollback Needed:**
1. Notify #engineering Slack channel
2. Update status page (if implemented)
3. Document incident in #incidents
4. Post-mortem within 48 hours

### 5. Health Check Endpoints

```bash
# Core health
GET /api/health

# Database connectivity
GET /api/health?check=db

# AI service availability  
GET /api/health?check=ai
```

### 6. Known Issues to Monitor

| Issue | Impact | Rollback Action |
|-------|--------|-----------------|
| Mock mode accidentally enabled in prod | Users see fake data | Check ANTHROPIC_API_KEY env var |
| Rate limit too aggressive | Users blocked | Increase RATE_LIMIT_SCAN_MAX |
| Quality thresholds too strict | High rejection rate | Adjust QUALITY_MIN_* env vars |
| New prompt breaks output | Invalid recommendations | Revert to previous prompt version |

### 7. Rollback Checklist

- [ ] Deploy previous version
- [ ] Verify /api/health returns 200
- [ ] Test scan flow in staging
- [ ] Check Sentry for new errors
- [ ] Monitor rate limit metrics
- [ ] Notify team of resolution

### 8. Contacts

- **Engineering Lead**: [To be filled]
- **On-Call**: [To be filled]
- **Supabase Support**: support@supabase.com
- **Vercel Support**: vercel.com/support

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | Initial | Post-audit release |
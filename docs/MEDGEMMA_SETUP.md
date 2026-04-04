# MedGemma Self-Hosting Setup

## Quick Start

```bash
# Install Ollama (Mac/Linux/Windows)
curl -fsSL https://ollama.com/install.sh | sh

# Pull fast model (2B = fastest, 4B = better quality)
ollama pull gemma:2b

# Start server
ollama serve
```

## Environment Variables

Add to `.env.local`:
```env
# Use Ollama instead of Anthropic
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma:2b

# Remove or comment out:
# ANTHROPIC_API_KEY=...
```

## Performance Tuning (Sub-3s Latency)

### 1. Keep Model Loaded
```typescript
// Ollama keeps model in memory with keep_alive: -1
keep_alive: -1  // Infinite, or set to "5m" for 5 minutes
```

### 2. Use Structured Outputs (Faster Parsing)
```typescript
const schema = {
  type: "object",
  properties: {
    observations: { type: "string", maxLength: 150 },
    interpretation: { type: "string", maxLength: 150 },
    routine: { type: "string", maxLength: 150 },
    safety: { type: "string", maxLength: 100 },
  },
  required: ["observations", "interpretation", "routine", "safety"],
};
```

### 3. Tight Generation Settings
```typescript
options: {
  num_predict: 120,    // Cap output tokens
  temperature: 0.2,   // Lower = more deterministic
  stop: ['---', '---END---'],
}
```

### 4. Stream for Perceived Speed
```typescript
stream: true  // Shows output as it arrives
```

## Benchmarking

Ollama returns timing metrics - log these to understand where time goes:

```typescript
{
  total_duration:    // Total request time
  load_duration:     // Model load time (cold start)
  prompt_eval_duration: // Prompt processing
  eval_duration:     // Output generation
  prompt_eval_count: // Prompt tokens
  eval_count:        // Output tokens
}
```

## Model Comparison

| Model | Size | Speed | Quality |
|-------|------|-------|---------|
| gemma:2b | ~1GB | Fastest | Good |
| gemma:4b | ~4GB | Fast | Better |
| medgemma:4b | ~4GB | Medium | Medical-tuned |

## Architecture Pattern

For instant feel:
1. **Phase 1** (< 1s): Return "Scanning..." immediately
2. **Phase 2** (2-3s): Stream analysis results

## Preload on Startup

```typescript
// Warm the model before first request
import { preloadModel } from '@/lib/ollama-client';
preloadModel();  // Call at app startup
```

## Troubleshooting

- **Slow first request**: Model cold - ensure keep_alive is set
- **High latency**: Reduce num_predict, use smaller model
- **Parse errors**: Use structured output format
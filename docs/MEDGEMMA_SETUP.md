# Self-Hosting MedGemma with Ollama

## Setup

1. **Install Ollama**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

2. **Pull MedGemma model**
   ```bash
   ollama pull medgemma:4b
   # or vision model
   ollama pull alibayram/medgemma:4b
   ```

3. **Start Ollama server**
   ```bash
   ollama serve
   ```

## API Usage

```bash
# Text generation
curl http://localhost:11434/api/generate -d '{
  "model": "medgemma:4b",
  "prompt": "Analyze this skin concern: dry skin with redness"
}'

# Vision (if using multimodal model)
curl http://localhost:11434/api/generate -d '{
  "model": "alibayram/medgemma:4b",
  "prompt": "Analyze this skin image",
  "images": ["<base64_image>"]
}'
```

## Environment Variables

Add to your `.env.local`:
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=medgemma:4b
# Remove ANTHROPIC_API_KEY to use Ollama instead
```

## Cost

- **Hardware**: GPU with 8GB+ VRAM (RTX 3070/4060 or better)
- **Electricity**: ~50W idle, ~150W under load
- **Cost per month**: ~$0 (if you have GPU) vs $25+/month for API
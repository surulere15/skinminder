/**
 * Partner Script Generator CLI
 * Generates the embed snippet for SkinMinder partners.
 */

function generateSnippet(partnerId: string, brandName: string, color: string) {
  const snippet = `
<!-- SkinMinder Widget Container -->
<div id="skinminder-container"></div>

<!-- SkinMinder SDK -->
<script src="https://skinminder.ai/sdk/v1.js" async></script>

<!-- Initialization -->
<script>
  window.addEventListener('load', function() {
    if (window.SkinMinder) {
      SkinMinder.init({
        containerId: 'skinminder-container',
        partnerId: '${partnerId}',
        settings: {
          brandName: '${brandName}',
          primaryColor: '${color}'
        }
      });
    }
  });
</script>
  `.trim();

  console.log('\n--- SkinMinder Embed Snippet ---');
  console.log(snippet);
  console.log('--------------------------------\n');
  
  return snippet;
}

// Example usage via CLI arguments
const args = process.argv.slice(2);
if (args.length >= 3) {
    const [id, name, color] = args;
    generateSnippet(id, name, color);
} else {
    console.log('Usage: node generate-partner-snippet.js <PARTNER_ID> <BRAND_NAME> <HEX_COLOR>');
    // Example: node generate-partner-snippet.js "PRT-824" "Aura Skincare" "#2A6BFF"
}

export { generateSnippet };

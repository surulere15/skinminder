/**
 * SkinMinder Brand Scan Widget v1.0
 * 
 * Instructions:
 * 1. Include this script in your <head>
 * 2. Add <div id="skinminder-widget"></div> where you want the scanner to appear
 * 3. Initialize with your API Key
 */

(function() {
    const SKINMINDER_CONFIG = {
        apiBase: 'https://api.skinminder.ai/v1',
        theme: 'glass'
    };

    window.SkinMinder = {
        init: function(apiKey) {
            console.log("SkinMinder Widget Initializing with key:", apiKey);
            const container = document.getElementById('skinminder-widget');
            if (!container) return;

            container.innerHTML = `
                <div style="border-radius: 2rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); padding: 2rem; text-align: center; font-family: sans-serif; color: #fff;">
                    <h3 style="margin-bottom: 1rem;">Personalize Your Ritual</h3>
                    <p style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 2rem;">Scan your skin to unlock clinical-grade product matches.</p>
                    <button style="background: #7C6CFF; color: #fff; border: none; padding: 1rem 2rem; border-radius: 1rem; font-weight: bold; cursor: pointer;">Start AI Scan</button>
                    <div style="margin-top: 1rem; font-size: 0.6rem; opacity: 0.4;">Powered by SkinMinder Intelligence Network</div>
                </div>
            `;
        }
    };
})();

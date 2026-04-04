(() => {
  /**
   * SkinMinder Brand Scan Widget v1.0
   * Shadow DOM Isolation Wrapper
   */

  class SkinMinderWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      this.render();
    }

    render() {
      const apiKey = this.getAttribute('api-key');
      const brandName = this.getAttribute('brand-name') || 'SkinMinder Intelligence';
      const primaryColor = this.getAttribute('theme-color') || '#7C6CFF';

      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = `
          <style>
            :host { 
              display: block; 
              font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; 
            }
            .widget-container {
              border: 1px solid rgba(0,0,0,0.05);
              border-radius: 2rem;
              padding: 2.5rem;
              text-align: center;
              background: #fff;
              box-shadow: 0 20px 50px rgba(0,0,0,0.08);
              max-width: 400px;
              margin: 0 auto;
            }
            h3 { 
              font-size: 1.5rem; 
              font-weight: 900; 
              margin-bottom: 0.5rem; 
              letter-spacing: -0.02em;
              color: #000;
            }
            p { 
              font-size: 0.875rem; 
              color: #666; 
              margin-bottom: 2rem; 
              line-height: 1.6;
              font-weight: 500;
            }
            button {
              background: ${primaryColor};
              color: white;
              border: none;
              width: 100%;
              padding: 1.25rem;
              border-radius: 1.25rem;
              font-weight: 900;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              box-shadow: 0 10px 20px ${primaryColor}40;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            button:hover { 
              transform: translateY(-2px);
              box-shadow: 0 15px 30px ${primaryColor}60;
            }
            .footer {
              margin-top: 1.5rem;
              font-size: 0.625rem;
              font-weight: 800;
              color: #ccc;
              text-transform: uppercase;
              letter-spacing: 0.2em;
            }
          </style>
          <div class="widget-container">
            <h3>${brandName}</h3>
            <p>Powered by SkinMinder proprietary AI. Deep tissue analysis & customized outcomes.</p>
            <button id="start-scan">Begin Scan</button>
            <div class="footer">Verified Clinical Engine</div>
          </div>
        `;

        this.shadowRoot.getElementById('start-scan')?.addEventListener('click', () => {
          const url = new URL('https://app.skinminder.ai/try');
          url.searchParams.set('partner', apiKey || '');
          url.searchParams.set('embed', 'true');
          
          window.open(url.toString(), 'SkinMinder', 'width=450,height=800,scrollbars=yes');
        });
      }
    }
  }

  // Register only if not already registered
  if (!customElements.get('skinminder-widget')) {
    customElements.define('skinminder-widget', SkinMinderWidget);
  }

  // Universal Loader stub
  if (!(window as any).SkinMinder) {
    (window as any).SkinMinder = {
      mount: (containerId: string, apiKey: string, themeColor?: string, brandName?: string) => {
        const container = document.getElementById(containerId);
        if (container) {
          const widget = document.createElement('skinminder-widget');
          widget.setAttribute('api-key', apiKey);
          if (themeColor) widget.setAttribute('theme-color', themeColor);
          if (brandName) widget.setAttribute('brand-name', brandName);
          container.appendChild(widget);
        }
      }
    };
  }
})();

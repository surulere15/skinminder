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
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; font-family: sans-serif; }
          .widget-container {
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 1.5rem;
            padding: 2rem;
            text-align: center;
            background: #fff;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          }
          button {
            background: #7C6CFF;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
          }
          button:hover { transform: scale(1.02); }
        </style>
        <div class="widget-container">
          <h3>Analyze Your Skin</h3>
          <p>Get a dermatological-grade analysis in 30 seconds.</p>
          <button id="start-scan">Launch AI Scanner</button>
        </div>
      `;

      this.shadowRoot.getElementById('start-scan')?.addEventListener('click', () => {
        window.open('https://app.skinminder.ai/try?embed=true', 'SkinMinder', 'width=400,height=700');
      });
    }
  }
}

customElements.define('skinminder-widget', SkinMinderWidget);

// Universal Loader stub
(window as any).SkinMinder = {
  mount: (containerId: string, apiKey: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const widget = document.createElement('skinminder-widget');
      widget.setAttribute('api-key', apiKey);
      container.appendChild(widget);
    }
  }
};

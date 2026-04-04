/**
 * SkinMinder Widget SDK v1.0
 * 
 * A zero-dependency loader for the SkinMinder AI Skin Scan.
 * This script injects an iframe that hosts the frictionless 10-second scan experience.
 */

(function() {
    const WIDGET_URL = window.location.origin + '/try';
    
    class SkinMinderWidget {
        constructor() {
            this.container = null;
            this.iframe = null;
            this.isOpen = false;
        }

        init(selector) {
            this.container = document.querySelector(selector);
            if (!this.container) {
                console.error("[SkinMinder] Could not find target element:", selector);
                return;
            }
            this.renderLauncher();
            window.addEventListener('message', (e) => this.handleMessage(e));
        }

        renderLauncher() {
            const btn = document.createElement('button');
            btn.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; font-family: 'Inter', sans-serif;">
                    <div style="width: 12px; height: 12px; background: #7C6CFF; rounded-full; filter: drop-shadow(0 0 8px #7C6CFF);"></div>
                    <strong>AI Skin Analysis</strong>
                </div>
            `;
            const styles = {
                background: '#0B1020',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 24px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '14px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            };
            Object.assign(btn.style, styles);
            
            btn.onmouseover = () => btn.style.transform = 'translateY(-2px) scale(1.02)';
            btn.onmouseout = () => btn.style.transform = 'translateY(0) scale(1)';
            btn.onclick = () => this.open();

            this.container.appendChild(btn);
        }

        open() {
            if (this.isOpen) return;
            
            const overlay = document.createElement('div');
            overlay.id = 'skinminder-overlay';
            Object.assign(overlay.style, {
                position: 'fixed',
                top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.5s ease'
            });

            const modal = document.createElement('div');
            Object.assign(modal.style, {
                width: '95%',
                maxWidth: '1200px',
                height: '85vh',
                background: '#060A18',
                borderRadius: '40px',
                overflow: 'hidden',
                boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                position: 'relative',
                transform: 'scale(0.95)',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            });

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '30px', right: '30px',
                background: 'rgba(255,255,255,0.05)',
                border: 'none', color: 'white',
                width: '40px', height: '40px',
                borderRadius: '50%', cursor: 'pointer',
                zIndex: 10
            });
            closeBtn.onclick = () => this.close();

            const frame = document.createElement('iframe');
            frame.src = WIDGET_URL + '?widget=true';
            Object.assign(frame.style, {
                width: '100%', height: '100%',
                border: 'none'
            });

            modal.appendChild(closeBtn);
            modal.appendChild(frame);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            this.isOpen = true;
            setTimeout(() => {
                overlay.style.opacity = '1';
                modal.style.transform = 'scale(1)';
            }, 10);
        }

        close() {
            const overlay = document.getElementById('skinminder-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.firstChild.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    this.isOpen = false;
                }, 500);
            }
        }

        handleMessage(e) {
            if (e.data.type === 'SKINMINDER_SCAN_COMPLETE') {
                console.log("[SkinMinder] Scan successful:", e.data.payload);
                // Brands can hook into this event on their page
                const event = new CustomEvent('skinminder:complete', { detail: e.data.payload });
                window.dispatchEvent(event);
            }
        }
    }

    window.SkinMinder = new SkinMinderWidget();
})();

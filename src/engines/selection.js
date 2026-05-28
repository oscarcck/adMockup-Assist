export default class SelectionEngine {
    constructor(app) {
        this.app = app;
        this.highlightBox = null;
        this.mask = null;
        
        this.app.state.subscribe((state) => {
            if (state.isSelectionMode) this.enable();
            else this.disable();
        });
    }

    enable() {
        if (!this.highlightBox) {
            this.highlightBox = document.createElement('div');
            this.highlightBox.style.cssText = 'position:fixed; border:2px solid #007bff; background:rgba(0,123,255,0.1); pointer-events:none; z-index:2147483645; display:none;';
            document.documentElement.appendChild(this.highlightBox);
        }
        
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:transparent; z-index:2147483644; cursor:crosshair;';
            
            this.mask.addEventListener('mousemove', (e) => {
                this.mask.style.pointerEvents = 'none';
                let el = document.elementFromPoint(e.clientX, e.clientY);
                this.mask.style.pointerEvents = 'auto';

                if (el && !this.isInternalElement(el)) {
                    el = this.findAdContainer(el);
                    const rect = el.getBoundingClientRect();
                    Object.assign(this.highlightBox.style, {
                        top: `${rect.top}px`,
                        left: `${rect.left}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                        display: 'block'
                    });
                } else {
                    this.highlightBox.style.display = 'none';
                }
            });

            this.mask.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.mask.style.pointerEvents = 'none';
                let el = document.elementFromPoint(e.clientX, e.clientY);
                this.mask.style.pointerEvents = 'auto';

                if (el && !this.isInternalElement(el)) {
                    el = this.findAdContainer(el);
                    this.app.state.setState({ selectedElement: el, isSelectionMode: false });
                    this.app.panel.updateSelectionButton(false);
                }
            }, true);
        }

        this.mask.style.display = 'block';
        document.documentElement.appendChild(this.mask);
    }

    findAdContainer(el) {
        let current = el;
        let highestAdElement = el;

        while (current && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
            const id = current.id || '';
            const className = typeof current.className === 'string' ? current.className : '';
            
            const isAdRelated = id.includes('google_ads_iframe') || 
                               id.includes('gpt-') || 
                               id.includes('ad-slot') ||
                               className.includes('ad-slot') || 
                               className.includes('ad-container') ||
                               className.includes('js-ad-slot');

            if (isAdRelated) highestAdElement = current;
            current = current.parentElement;
        }

        if (highestAdElement.tagName === 'IFRAME' && highestAdElement.parentElement) {
            return highestAdElement.parentElement;
        }

        return highestAdElement;
    }

    disable() {
        if (this.mask) this.mask.style.display = 'none';
        if (this.highlightBox) this.highlightBox.style.display = 'none';
    }

    isInternalElement(el) {
        const root = document.getElementById('ad-mockup-assistant-root');
        return el === root || root?.contains(el) || el === this.highlightBox || el === this.mask;
    }
}

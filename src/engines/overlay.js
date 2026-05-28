import MockupWidget from '../ui/mockup';

export default class OverlayEngine {
    constructor(app) {
        this.app = app;
        this.activeMockups = new Map(); // element -> mockup info
        this.observers = new Map(); // element -> MutationObserver
    }

    async applyFloatingMockup(source) {
        const widget = new MockupWidget(source, this.app);
        await widget.render();
    }

    applyCreative(element, source, options = {}) {
        const { fit = 'contain' } = options;
        this.replaceElement(element, source, fit);
        this.setupResilience(element, source, options);
    }

    replaceElement(element, source, fit) {
        // Hide original children
        Array.from(element.children).forEach(child => {
            if (!child.dataset.adMockup) {
                child.style.display = 'none';
            }
        });

        let mockup = element.querySelector('[data-ad-mockup]');
        if (!mockup) {
            mockup = document.createElement('img');
            mockup.dataset.adMockup = 'true';
            element.appendChild(mockup);
        }

        mockup.src = source;
        mockup.style.cssText = `width:100%; height:100%; object-fit:${fit}; display:block;`;

        this.activeMockups.set(element, { source, options: { fit } });
    }

    setupResilience(element, source, options) {
        if (this.observers.has(element)) {
            this.observers.get(element).disconnect();
        }

        const observer = new MutationObserver((mutations) => {
            const hasChanges = mutations.some(m => 
                m.type === 'childList' && 
                Array.from(m.addedNodes).some(n => n.nodeType === 1 && !n.dataset.adMockup)
            );

            if (hasChanges) {
                this.applyCreative(element, source, options);
            }
        });

        observer.observe(element, { childList: true });
        this.observers.set(element, observer);
    }

    reset() {
        this.activeMockups.forEach((info, element) => {
            const mockup = element.querySelector('[data-ad-mockup]');
            if (mockup) mockup.remove();
            
            Array.from(element.children).forEach(child => {
                child.style.display = '';
            });
        });

        this.observers.forEach(obs => obs.disconnect());
        this.observers.clear();
        this.activeMockups.clear();
        
        // Remove all floating widgets
        document.querySelectorAll('[data-ad-mockup-widget]').forEach(w => w.remove());
        
        this.app.state.setState({ 
            selectedElement: null,
            activeMockup: null 
        });
    }
}

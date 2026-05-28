import Panel from '../ui/panel';
import SelectionEngine from '../engines/selection';
import OverlayEngine from '../engines/overlay';
import StateStore from './state';
import Config from './config';

export default class App {
    constructor() {
        this.state = new StateStore();
        this.config = Config;
        this.panel = new Panel(this);
        this.selectionEngine = new SelectionEngine(this);
        this.overlayEngine = new OverlayEngine(this);
    }

    init() {
        if (window.__AD_MOCKUP_ASSISTANT_INITIALIZED__) {
            console.warn('Ad Mockup Assistant is already initialized.');
            return;
        }
        window.__AD_MOCKUP_ASSISTANT_INITIALIZED__ = true;

        this.panel.render();
        this.setupKeyboardShortcuts();
        console.log('Ad Mockup Assistant initialized.');
    }

    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            const { toggleVisibility } = this.config.shortcuts;
            if (e.key === toggleVisibility[2] && e.ctrlKey === (toggleVisibility[0] === 'Control') && e.shiftKey === (toggleVisibility[1] === 'Shift')) {
                this.panel.toggleVisibility();
            }
        });
    }
}

export default class StateStore {
    constructor() {
        this.selectedElement = null;
        this.activeMockup = null; // Currently selected floating mockup widget
        this.isSelectionMode = false;
        this.isVisible = true;
        this.creatives = []; // History for undo
        this.listeners = [];
    }

    setState(newState) {
        Object.assign(this, newState);
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this));
    }
}

import styles from './styles.css?inline';

export default class Panel {
    constructor(app) {
        this.app = app;
        this.container = null;
        this.shadowRoot = null;
        this.isVisible = true;
        this.aspectLocked = true;
        this.domAspectLocked = true;
    }

    render() {
        this.container = document.createElement('div');
        this.container.id = 'ad-mockup-assistant-root';
        this.shadowRoot = this.container.attachShadow({ mode: 'open' });

        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        this.shadowRoot.appendChild(styleTag);

        const panel = document.createElement('div');
        panel.className = 'mockup-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <div style="display: flex; align-items: center;">
                    <button id="collapse-btn">−</button>
                    <h3>Ad Mockup Assistant</h3>
                </div>
                <button id="close-btn" style="padding: 2px 6px; font-size: 10px;">X</button>
            </div>
            <div class="panel-content">
                <div id="source-section">
                    <label style="font-size: 12px; font-weight: bold;">1. Creative Source:</label>
                    <input type="text" id="url-input" placeholder="Image URL..." style="width: 100%; padding: 5px; box-sizing: border-box; margin-top: 5px;">
                    <div style="display: flex; gap: 5px; margin-top: 5px;">
                        <button id="file-btn" style="flex: 1; font-size: 11px;">Upload File</button>
                        <button id="paste-btn" style="flex: 1; font-size: 11px;">Paste Img</button>
                        <input type="file" id="file-input" class="hidden" accept="image/*">
                    </div>
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">

                <div id="action-section">
                    <label style="font-size: 12px; font-weight: bold;">2. Placement:</label>
                    <button id="float-btn" class="primary" style="width: 100%; margin-top: 5px;">Create Floating Mockup</button>
                    
                    <div style="margin-top: 10px;">
                        <button id="select-btn" style="width: 100%;">Select DOM Element</button>
                        <div id="selection-info" style="font-size: 11px; color: #666; margin-top: 3px; text-align: center;">No element selected</div>
                    </div>

                    <div id="selection-controls" class="hidden" style="margin-top: 10px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                        <label style="font-size: 11px; font-weight: bold;">Fit Mode:</label>
                        <select id="fit-select" style="width: 100%; padding: 3px; margin-top: 3px; font-size: 11px;">
                            <option value="contain">Contain</option>
                            <option value="cover">Cover</option>
                            <option value="fill">Stretch</option>
                            <option value="none">Original</option>
                        </select>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 8px;">
                            <div>
                                <label style="font-size: 9px; display: block; color: #555;">Width</label>
                                <input type="number" id="dom-input-w" style="width: 100%; font-size: 11px; padding: 2px;">
                            </div>
                            <div>
                                <label style="font-size: 9px; display: block; color: #555;">Height</label>
                                <input type="number" id="dom-input-h" style="width: 100%; font-size: 11px; padding: 2px;">
                            </div>
                        </div>

                        <div style="margin-top: 8px;">
                            <label style="font-size: 9px; display: block; color: #555; margin-bottom: 3px;">Presets:</label>
                            <div style="display: flex; flex-wrap: wrap; gap: 3px;">
                                <button class="dom-size-preset" data-w="300" data-h="250" style="font-size: 9px; padding: 2px 4px;">300x250</button>
                                <button class="dom-size-preset" data-w="728" data-h="90" style="font-size: 9px; padding: 2px 4px;">728x90</button>
                                <button class="dom-size-preset" data-w="320" data-h="50" style="font-size: 9px; padding: 2px 4px;">320x50</button>
                                <button class="dom-size-preset" data-w="300" data-h="600" style="font-size: 9px; padding: 2px 4px;">300x600</button>
                            </div>
                        </div>

                        <label style="display: flex; align-items: center; gap: 5px; font-size: 10px; margin-top: 8px; cursor: pointer;">
                            <input type="checkbox" id="dom-lock-aspect" checked> Lock Aspect Ratio
                        </label>

                        <button id="apply-btn" class="primary" style="width: 100%; margin-top: 10px; font-size: 12px;">Replace Selected</button>
                    </div>
                </div>

                <div id="inspector-section" class="hidden" style="background: #f0f7ff; padding: 10px; border-radius: 4px; border: 1px solid #cce5ff; margin-top: 10px;">
                    <label style="font-size: 11px; font-weight: bold; color: #004085;">3. Mockup Inspector:</label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-top: 5px;">
                        <div>
                            <label style="font-size: 9px; display: block; color: #555;">X Pos</label>
                            <input type="number" id="input-x" style="width: 100%; font-size: 11px; padding: 2px;">
                        </div>
                        <div>
                            <label style="font-size: 9px; display: block; color: #555;">Y Pos</label>
                            <input type="number" id="input-y" style="width: 100%; font-size: 11px; padding: 2px;">
                        </div>
                        <div>
                            <label style="font-size: 9px; display: block; color: #555;">Width</label>
                            <input type="number" id="input-w" style="width: 100%; font-size: 11px; padding: 2px;">
                        </div>
                        <div>
                            <label style="font-size: 9px; display: block; color: #555;">Height</label>
                            <input type="number" id="input-h" style="width: 100%; font-size: 11px; padding: 2px;">
                        </div>
                    </div>
                    
                    <div style="margin-top: 8px;">
                        <label style="font-size: 9px; display: block; color: #555; margin-bottom: 3px;">Presets:</label>
                        <div style="display: flex; flex-wrap: wrap; gap: 3px;">
                            <button class="size-preset" data-w="300" data-h="250" style="font-size: 9px; padding: 2px 4px;">300x250</button>
                            <button class="size-preset" data-w="728" data-h="90" style="font-size: 9px; padding: 2px 4px;">728x90</button>
                            <button class="size-preset" data-w="320" data-h="50" style="font-size: 9px; padding: 2px 4px;">320x50</button>
                            <button class="size-preset" data-w="300" data-h="600" style="font-size: 9px; padding: 2px 4px;">300x600</button>
                            <button class="size-preset" data-w="970" data-h="250" style="font-size: 9px; padding: 2px 4px;">970x250</button>
                        </div>
                    </div>

                    <label style="display: flex; align-items: center; gap: 5px; font-size: 10px; margin-top: 8px; cursor: pointer;">
                        <input type="checkbox" id="lock-aspect" checked> Lock Aspect Ratio
                    </label>
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                <button id="reset-btn" style="width: 100%;">Reset All</button>
            </div>
            <div class="panel-footer">
                Shortcut: Ctrl+Shift+H to toggle UI
            </div>
        `;

        this.shadowRoot.appendChild(panel);

        const trigger = document.createElement('div');
        trigger.className = 'visibility-toggle-trigger';
        trigger.title = 'Click to show/hide tool';
        trigger.onclick = () => this.toggleVisibility();
        this.shadowRoot.appendChild(trigger);

        document.documentElement.appendChild(this.container);

        this.setupEventListeners();
        this.makeDraggable(panel);
    }

    $(id) {
        return this.shadowRoot.getElementById(id);
    }

    updateMockupStats(stats) {
        const x = this.$('input-x'), y = this.$('input-y'), w = this.$('input-w'), h = this.$('input-h');
        if (x) x.value = stats.x;
        if (y) y.value = stats.y;
        if (w) w.value = stats.w;
        if (h) h.value = stats.h;
    }

    setupEventListeners() {
        this.$('close-btn').onclick = () => this.toggleVisibility();
        
        const collapseBtn = this.$('collapse-btn');
        const panel = this.shadowRoot.querySelector('.mockup-panel');
        collapseBtn.onclick = () => {
            const isCollapsed = panel.classList.toggle('collapsed');
            collapseBtn.textContent = isCollapsed ? '+' : '−';
        };

        this.$('select-btn').onclick = () => {
            const isSelectionMode = !this.app.state.isSelectionMode;
            this.app.state.setState({ isSelectionMode });
            this.updateSelectionButton(isSelectionMode);
        };

        this.$('reset-btn').onclick = () => this.app.overlayEngine.reset();
        
        this.$('apply-btn').onclick = () => {
            const url = this.$('url-input').value;
            const fit = this.$('fit-select').value;
            const w = this.$('dom-input-w').value;
            const h = this.$('dom-input-h').value;

            if (url && this.app.state.selectedElement) {
                const el = this.app.state.selectedElement;
                if (w) el.style.width = `${w}px`;
                if (h) el.style.height = `${h}px`;
                if (w || h) el.style.margin = '0 auto';
                this.app.overlayEngine.applyCreative(el, url, { fit });
            } else if (url) {
                this.app.overlayEngine.applyFloatingMockup(url);
            }
        };

        this.shadowRoot.querySelectorAll('.dom-size-preset').forEach(btn => {
            btn.onclick = () => {
                const { w, h } = btn.dataset;
                this.$('dom-input-w').value = w;
                this.$('dom-input-h').value = h;
                if (this.app.state.selectedElement) {
                    const el = this.app.state.selectedElement;
                    el.style.width = `${w}px`;
                    el.style.height = `${h}px`;
                    el.style.margin = '0 auto';
                }
            };
        });

        const syncDomSize = (e) => {
            const wInput = this.$('dom-input-w');
            const hInput = this.$('dom-input-h');
            let w = wInput.value;
            let h = hInput.value;
            const el = this.app.state.selectedElement;

            if (el) {
                if (this.domAspectLocked && e && (e.target === wInput || e.target === hInput)) {
                    const rect = el.getBoundingClientRect();
                    const ratio = rect.width / rect.height;
                    if (e.target === wInput && w) {
                        h = Math.round(w / ratio);
                        hInput.value = h;
                    } else if (e.target === hInput && h) {
                        w = Math.round(h * ratio);
                        wInput.value = w;
                    }
                }
                if (w) el.style.width = `${w}px`;
                if (h) el.style.height = `${h}px`;
            }
        };
        this.$('dom-input-w').oninput = syncDomSize;
        this.$('dom-input-h').oninput = syncDomSize;
        this.$('dom-lock-aspect').onchange = (e) => this.domAspectLocked = e.target.checked;

        this.$('float-btn').onclick = () => {
            const url = this.$('url-input').value;
            if (url) this.app.overlayEngine.applyFloatingMockup(url);
            else alert('Please provide a creative source first.');
        };

        this.$('file-btn').onclick = () => this.$('file-input').click();
        this.$('file-input').onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => this.$('url-input').value = event.target.result;
                reader.readAsDataURL(file);
            }
        };

        this.$('paste-btn').onclick = async () => {
            try {
                const items = await navigator.clipboard.read();
                for (const item of items) {
                    for (const type of item.types) {
                        if (type.startsWith('image/')) {
                            const blob = await item.getType(type);
                            const reader = new FileReader();
                            reader.onload = (event) => this.$('url-input').value = event.target.result;
                            reader.readAsDataURL(blob);
                            return;
                        }
                    }
                }
                alert('No image found in clipboard.');
            } catch (err) {
                alert('Clipboard access denied or not supported.');
            }
        };

        const updateActiveMockup = (prop, value) => {
            if (this.app.state.activeMockup) {
                const data = { [prop]: parseInt(value) };
                if (this.aspectLocked && (prop === 'w' || prop === 'h')) {
                    const el = this.app.state.activeMockup.container;
                    const ratio = el.offsetWidth / el.offsetHeight;
                    if (prop === 'w') data.h = Math.round(data.w / ratio);
                    else data.w = Math.round(data.h * ratio);
                    this.$('input-w').value = data.w;
                    this.$('input-h').value = data.h;
                }
                this.app.state.activeMockup.updateFromPanel(data);
            }
        };

        ['x', 'y', 'w', 'h'].forEach(p => this.$(`input-${p}`).oninput = (e) => updateActiveMockup(p, e.target.value));
        this.$('lock-aspect').onchange = (e) => this.aspectLocked = e.target.checked;

        this.shadowRoot.querySelectorAll('.size-preset').forEach(btn => {
            btn.onclick = () => {
                const active = this.app.state.activeMockup;
                if (active) {
                    const w = parseInt(btn.dataset.w), h = parseInt(btn.dataset.h);
                    active.updateFromPanel({ w, h });
                    this.updateMockupStats({
                        x: parseInt(active.container.style.left),
                        y: parseInt(active.container.style.top),
                        w, h
                    });
                }
            };
        });

        this.app.state.subscribe((state) => {
            const info = this.$('selection-info');
            const controls = this.$('selection-controls');
            const inspector = this.$('inspector-section');
            
            if (state.selectedElement) {
                const el = state.selectedElement;
                info.textContent = `Selected: ${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}`;
                controls.classList.remove('hidden');
            } else {
                info.textContent = 'No element selected';
                controls.classList.add('hidden');
            }

            if (state.activeMockup) {
                inspector.classList.remove('hidden');
                state.activeMockup.reportToPanel();
            } else {
                inspector.classList.add('hidden');
            }
        });
    }

    updateSelectionButton(isSelectionMode) {
        const btn = this.$('select-btn');
        btn.textContent = isSelectionMode ? 'Cancel Selection' : 'Select DOM Element';
        btn.classList.toggle('primary', isSelectionMode);
    }

    toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.shadowRoot.querySelector('.mockup-panel').classList.toggle('hidden', !this.isVisible);
        this.app.state.setState({ isVisible: this.isVisible });
    }

    makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = el.querySelector('.panel-header');
        header.onmousedown = (e) => {
            if (window.innerWidth <= 510) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (moveEvent) => {
                pos1 = pos3 - moveEvent.clientX;
                pos2 = pos4 - moveEvent.clientY;
                pos3 = moveEvent.clientX;
                pos4 = moveEvent.clientY;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
                el.style.right = 'auto';
            };
        };
    }
}

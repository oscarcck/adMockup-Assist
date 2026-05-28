export default class MockupWidget {
    constructor(source, app) {
        this.source = source;
        this.app = app;
        this.container = null;
        this.img = null;
    }

    async render() {
        const { w, h } = await this.getImageDimensions(this.source);
        
        this.container = document.createElement('div');
        this.container.dataset.adMockupWidget = 'true';
        
        const initialTop = window.scrollY + (window.innerHeight / 2) - (h / 2);
        const initialLeft = window.scrollX + (window.innerWidth / 2) - (w / 2);

        this.container.style.cssText = `
            position: absolute;
            top: ${initialTop}px;
            left: ${initialLeft}px;
            width: ${w}px;
            height: ${h}px;
            border: 1px dashed #007bff;
            z-index: 2147483640;
            cursor: move;
            box-sizing: border-box;
            background: transparent;
        `;

        this.img = document.createElement('img');
        this.img.src = this.source;
        this.img.style.cssText = 'width: 100%; height: 100%; object-fit: contain; pointer-events: none; display: block;';
        this.container.appendChild(this.img);

        const handle = document.createElement('div');
        handle.style.cssText = 'position: absolute; right: 0; bottom: 0; width: 15px; height: 15px; background: #007bff; cursor: nwse-resize; z-index: 1;';
        this.container.appendChild(handle);

        const close = document.createElement('div');
        close.innerHTML = '×';
        close.style.cssText = 'position: absolute; top: -10px; right: -10px; width: 20px; height: 20px; background: #ff4d4d; color: white; border-radius: 50%; text-align: center; line-height: 18px; cursor: pointer; font-family: Arial; font-size: 14px; display: none;';
        close.onclick = () => this.container.remove();
        this.container.appendChild(close);

        this.container.onmouseenter = () => {
            if (this.app.state.isVisible) {
                close.style.display = 'block';
                this.container.style.border = '1px dashed #007bff';
            }
        };
        this.container.onmouseleave = () => {
            close.style.display = 'none';
            if (!this.app.state.isVisible) this.container.style.border = 'none';
        };

        this.makeDraggable(this.container);
        this.makeResizable(this.container, handle);

        document.body.appendChild(this.container);
        this.select();

        this.app.state.subscribe((state) => {
            this.container.style.border = state.isVisible ? '1px dashed #007bff' : 'none';
            this.container.style.boxShadow = (state.isVisible && state.activeMockup === this) ? '0 0 10px rgba(0,123,255,0.5)' : 'none';
            handle.style.display = state.isVisible ? 'block' : 'none';
            if (!state.isVisible) close.style.display = 'none';
        });
    }

    select() {
        this.app.state.setState({ activeMockup: this });
        document.querySelectorAll('[data-ad-mockup-widget]').forEach(el => el.style.boxShadow = 'none');
        if (this.app.state.isVisible) {
            this.container.style.boxShadow = '0 0 10px rgba(0,123,255,0.5)';
        }
    }

    updateFromPanel(data) {
        if (data.x !== undefined) this.container.style.left = `${data.x}px`;
        if (data.y !== undefined) this.container.style.top = `${data.y}px`;
        if (data.w !== undefined) this.container.style.width = `${data.w}px`;
        if (data.h !== undefined) this.container.style.height = `${data.h}px`;
    }

    reportToPanel() {
        if (this.app.panel) {
            this.app.panel.updateMockupStats({
                x: parseInt(this.container.style.left),
                y: parseInt(this.container.style.top),
                w: this.container.offsetWidth,
                h: this.container.offsetHeight
            });
        }
    }

    getImageDimensions(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ w: 300, h: 250 });
            img.src = src;
        });
    }

    getCoords(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }

    makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        const onStart = (e) => {
            if ((e.target.tagName === 'DIV' && e.target !== el) || !this.app.state.isVisible) return;
            this.select();
            
            const coords = this.getCoords(e);
            pos3 = coords.x;
            pos4 = coords.y;

            const onMove = (moveEvent) => {
                const moveCoords = this.getCoords(moveEvent);
                pos1 = pos3 - moveCoords.x;
                pos2 = pos4 - moveCoords.y;
                pos3 = moveCoords.x;
                pos4 = moveCoords.y;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
                this.reportToPanel();
            };

            const onEnd = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onEnd);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onEnd);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        };

        el.addEventListener('mousedown', onStart);
        el.addEventListener('touchstart', onStart, { passive: false });
    }

    makeResizable(el, handle) {
        const onStart = (e) => {
            if (!this.app.state.isVisible) return;
            this.select();
            e.preventDefault();
            e.stopPropagation();

            let startWidth = el.offsetWidth;
            let startHeight = el.offsetHeight;
            const startCoords = this.getCoords(e);
            let startX = startCoords.x;
            let startY = startCoords.y;
            let ratio = startWidth / startHeight;

            const onMove = (moveEvent) => {
                const moveCoords = this.getCoords(moveEvent);
                let newWidth = startWidth + (moveCoords.x - startX);
                let newHeight = startHeight + (moveCoords.y - startY);
                
                if (this.app.panel && this.app.panel.aspectLocked) {
                    newHeight = newWidth / ratio;
                }
                
                el.style.width = newWidth + 'px';
                el.style.height = newHeight + 'px';
                this.reportToPanel();
            };

            const onEnd = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onEnd);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onEnd);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        };

        handle.addEventListener('mousedown', onStart);
        handle.addEventListener('touchstart', onStart, { passive: false });
    }
}


class Grid extends Movable {

    constructor(config) {
        super(config)
        const { zoom, canvas } = (config || {})
        this.zoom = zoom ?? 10;
        this.moveWithGrid = false;
        if (canvas) {
            canvas.onmousewheel = this.mouseWheel.bind(this);
        }
    }

    draw(config) {
        const { zoom, offset, ctx } = (config || {});

        ctx.beginPath();
        ctx.strokeStyle = "#F0F0F0";

        for (let i = (offset.x * zoom + this.w / 2) % zoom; i <= this.w; i += zoom) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.h);
        }

        for (let j = (offset.y * zoom + this.h / 2) % zoom; j <= this.h; j += zoom) {
            ctx.moveTo(0, j);
            ctx.lineTo(this.w, j);
        }

        ctx.stroke();
    }

    isActive() {
        return true;
    }

    mouseWheel(event) {
        event.stopPropagation()
        const delta = (event.deltaY || event.detail) > 0 ? 0.9 : 1.1;
        const newZoom = this.zoom * delta;
        if (newZoom > 1 && newZoom < window.innerWidth) {
            this.zoom = newZoom;
            if (this.zoomChanged) {
                this.zoomChanged(newZoom);
            }
        }
    }

}

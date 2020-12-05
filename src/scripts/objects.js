class BaseObject {

    constructor(config) {
        const { x, y, width, height, color, moveWithGrid } = (config || {});
        this.x = x || 0;
        this.y = y || 0;
        this.w = width || 1;
        this.h = height || 1;
        this.color = color || '#000';
        this.moveWithGrid = moveWithGrid ?? true;
    }

    draw(config) {
        const { ctx, offset, zoom, width, height } = (config || {});

        /** Если включено движения по сетке, то делаем выравнивание. */
        const pos = this.moveWithGrid ? Math.floor : (item) => item;

        const x = pos(this.x) * zoom + offset.x * zoom + width / 2;
        const y = pos(this.y) * zoom + offset.y * zoom + height / 2;

        ctx.rect(x, y, this.w * zoom, this.h * zoom);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Movable extends BaseObject {

    constructor(config) {
        super(config);
        this.mousePressed = false;
        this.mousePos = null;
    }

    mouseDown(point) {
        this.mousePos = {
            x: point.x,
            y: point.y
        };

        /**
         * При движении по сетке, по клику на объект смешает по отношению к курсору чтобы он попадал в
         * ячейку с курсором а не в ячейку с его левым верхним углом.
         */
        if (this.moveWithGrid) {
            this.x += Math.abs(point.x % 1);
            this.y += Math.abs(point.y % 1);
        }

    }

    mouseMove(point) {
        if (this.mousePos) {
            const dev = {
                x: this.mousePos.x - point.x,
                y: this.mousePos.y - point.y
            };
            this.mousePos = {
                x: point.x,
                y: point.y
            };

            this.x = this.x - dev.x;
            this.y = this.y - dev.y;
        }
    }

    mouseUp(point) {
        this.mousePos = null;
        // Когда отпускаем мышь после перемещения, возвращаю прежнюю позицию.
        if (this.moveWithGrid) {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
        }
    }

    isActive(point) {
        return this.x <= point.x &&
            this.y <= point.y &&
            this.x + this.w >= point.x &&
            this.y + this.h >= point.y;
    }
}

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

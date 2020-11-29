class BaseObject {

    constructor(config) {
        const { x, y, width, height, color } = (config || {});
        this.x = x || 0;
        this.y = y || 0;
        this.w = width || 1;
        this.h = height || 1;
        this.color = color || '#000';
    }

    draw(config) {
        const { ctx, offset, zoom, width, height } = (config || {});

        ctx.rect(this.x * zoom + offset.x * zoom + width / 2, this.y * zoom + offset.y * zoom + height / 2, this.w * zoom, this.h * zoom);
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
        const { zoom } = (config || {})
        this.zoom = zoom ?? 10;
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

}
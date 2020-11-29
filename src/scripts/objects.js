class BaseObject {

    constructor(config) {
        const { x, y, width, height, color } = config;
        this.x = x || 0;
        this.y = y || 0;
        this.w = width || 1;
        this.h = height || 1;
        this.color = color || '#000';
    }

    draw(config) {
        const { ctx, offset, zoom, width, height } = config;

        ctx.rect(this.x + offset.x + width / 2, this.y + offset.y + height / 2, this.w * zoom, this.h * zoom);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Movable extends BaseObject {

}
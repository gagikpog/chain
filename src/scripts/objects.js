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

        ctx.fillStyle = this.getColor();
        ctx.fillRect(x, y, this.w * zoom, this.h * zoom);
    }
    getColor() {
        return this.mousePos ? '#444' : (this.isOn ? '#ff0' :this.color);
    }
    destroy() {}
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
        if(this.updateItemCache) {
            this.updateItemCache();
        }
    }

    isActive(point) {
        return this.x <= point.x &&
            this.y <= point.y &&
            this.x + this.w >= point.x &&
            this.y + this.h >= point.y;
    }
}

class Slots extends Movable {

    constructor(config) {
        super(config);
        this.oldPos = this._getKey();
        this.isOn = false;
        Slots.cacheItems[this.oldPos] = this;
    }

    updateItemCache() {
        delete Slots.cacheItems[this.oldPos];
        this.oldPos = this._getKey();
        Slots.cacheItems[this.oldPos] = this;
    }

    _getKey() {
        return `[${this.x},${this.y}]`;
    }
    getLeft() {
        const leftItemId = `[${this.x - 1},${this.y}]`;
        return Slots.cacheItems[leftItemId] && Slots.cacheItems[leftItemId].getSlotItem('right', leftItemId);
    }
    getRight() {
        const rightItemId = `[${this.x + 1},${this.y}]`;
        return Slots.cacheItems[rightItemId] && Slots.cacheItems[rightItemId].getSlotItem('left', rightItemId);
    }
    getTop() {
        const topItemId = `[${this.x},${this.y - 1}]`;
        return Slots.cacheItems[topItemId] && Slots.cacheItems[topItemId].getSlotItem('bottom', topItemId);
    }
    getBottom() {
        const bottomItemId = `[${this.x},${this.y + 1}]`;
        return Slots.cacheItems[bottomItemId] && Slots.cacheItems[bottomItemId].getSlotItem('top', bottomItemId);
    }
    getSlotItem(direction, position) {
        return this;
    }

    neighborsDisable() {
        if (!this.visited) {
            this._setNeighborsStatus(false);
            this.visited = true;
        }
    }
    
    neighborsEnable() {
        if (!this.visited) {
            this._setNeighborsStatus(true);
            this.visited = true;
        }
    }

    _setNeighborsStatus(status, key = 'setOn') {
        const args = [...arguments].slice(2);
        if (this.getLeft()) {
            this.getLeft()[key](status, ...args);
        }
        if (this.getRight()) {
            this.getRight()[key](status, ...args);
        }
        if (this.getTop()) {
            this.getTop()[key](status, ...args);
        }
        if (this.getBottom()) {
            this.getBottom()[key](status, ...args);
        }
    }

    setOn(status, deep = 1) {
        if (this.isOn === status && !this.visited) {
            this.visited = true;
            this._setNeighborsStatus(status, 'setOn', deep + 1);
        } else {
            this.isOn = status;
        }
        if (this.isOn) {
            this.deep = deep;
        }
        this.visited = true;
    }

    dropVisits() {
        if (this.visited) {
            this.visited = false;
            this._setNeighborsStatus(null, 'dropVisits');
        }
    }

    getActions() {
        return [];
    }

    destroy() {
        delete Slots.cacheItems[this.oldPos];
    }

    canBeOn() {
        if (this.needDeleteDeep) {
            delete this.deep;
            delete this.needDeleteDeep;
        }
        if (this.deep >= 1) {
            const beLife = this.getLeft() && this.getLeft().deep < this.deep ||
            this.getTop() &&this.getTop().deep < this.deep ||
            this.getRight() && this.getRight().deep < this.deep ||
            this.getBottom() && this.getBottom().deep < this.deep;

            if(!beLife) {
                this.needDeleteDeep = true;
                this.isOn = false;
            }
            
        } else {
            if (this.deep === undefined && this.isOn) {
                this.isOn = false;
            }
        }
    }

    static cacheItems = {};
}

class Point extends Slots {
    draw(config) {
        const { ctx, offset, zoom, width, height } = (config || {});

        ctx.fillStyle = ctx.fillStyle = this.getColor();

        /** Если включено движения по сетке, то делаем выравнивание. */
        const pos = this.moveWithGrid ? Math.floor : (item) => item;

        const x = pos(this.x) * zoom + offset.x * zoom + width / 2;
        const y = pos(this.y) * zoom + offset.y * zoom + height / 2;
        const w = this.w * zoom;
        const h = this.h * zoom;
        const l = !!this.getLeft();
        const r = !!this.getRight();
        const t = !!this.getTop();
        const b = !!this.getBottom();

        if (!(l || r || t || b)) {
            ctx.fillRect(x + w / 4, y + h / 4, w / 2, h / 2);
        }

        if ( l || r) {
            ctx.fillRect(x + w * (!l * 0.25), y + h * 0.25, w * (0.5 + r * 0.25 + l * 0.25), h * 0.5);
        }
        if (t || b) {
            ctx.fillRect(x + w / 4, y + h * (!t * 0.25), w / 2, h * (0.5 + t * 0.25 + b * 0.25));
        }
    }

    getActions() {
        return ['remove'];
    }
}

class EnergySource extends Slots {
    constructor(config) {
        super(config);
        this.isOn = true;
        this.deep = 0;
    }
    setOn(status) {
        this.isOn = true;
        this.visited = true;
    }
}


class LogicAnd extends Slots {
    constructor(config) {
        super(config);
        this.w = 2;
        this.oldHeadPos = this._getHeadKey();
        Slots.cacheItems[this.oldHeadPos] = this;
    }

    getActions() {
        return ['remove', 'rotate-right', 'rotate-left'];
    }

    _getHeadKey() {
        return `[${this.x + 1},${this.y}]`;
    }

    updateItemCache() {
        super.updateItemCache()
        delete Slots.cacheItems[this.oldHeadPos];
        this.oldHeadPos = this._getHeadKey();
        Slots.cacheItems[this.oldHeadPos] = this;
    }

    draw(config) {
        super.draw(config);

        const { ctx, offset, zoom, width, height } = (config || {});

        const pos = this.moveWithGrid ? Math.floor : (item) => item;

        const x = pos(this.x) * zoom + offset.x * zoom + width / 2;
        const y = pos(this.y) * zoom + offset.y * zoom + height / 2;
        const w = this.w * zoom;
        const h = this.h * zoom;

        ctx.lineWidth = 5;

        ctx.beginPath();
        ctx.moveTo(x + w * 0.25, y + h);
        ctx.lineTo(x + w * 0.25, y + h * 0.7);

        ctx.lineTo(x + w * 0.4, y + h * 0.7);

        ctx.moveTo(x + w * 0.25, y);

        ctx.lineTo(x + w * 0.25, y + h * 0.3);
        ctx.lineTo(x + w * 0.4, y + h * 0.3);

        ctx.moveTo(x + w * 0.4, y + h * 0.1);
        ctx.lineTo(x + w * 0.4, y + h * 0.9);


        ctx.arc(x + w * 0.6, y + h * 0.5, h * 0.4, Math.PI * 0.5, - Math.PI * 0.5, true);
        ctx.lineTo(x + w * 0.4, y + h * 0.1);

        ctx.moveTo(x + w * 0.8, y + h * 0.5);
        ctx.lineTo(x + w, y + h * 0.5);

        ctx.stroke();
        ctx.lineWidth = 1;
    }

    getSlotItem(direction, position) {
        if (position === this._getKey()) {
            if (direction !== 'left') {
                return this;
            }
        } else {
            if (direction === 'right') {
                return this;
            }
        }
    }

    getRight() {
        const rightItemId = `[${this.x + 2},${this.y}]`;
        return Slots.cacheItems[rightItemId] && Slots.cacheItems[rightItemId].getSlotItem('left', rightItemId);
    }

    getLeft() {
        return undefined;
    }

    setOn(status, deep = 1) {
        if (this.visited) {
            return;
        }
        const top = this.getTop();
        const bottom = this.getBottom();
        const newStatus = top && top.isOn && bottom && bottom.isOn;
        if (this.isOn === newStatus) {
            this.visited = true;
            this._setNeighborsStatus(newStatus, 'setOn', deep + 1);
        } else {
            this.isOn = newStatus;
        }
        if (this.isOn) {
            this.deep = deep;
        }
        this.visited = true;
    }

    _setNeighborsStatus(status, key = 'setOn') {
        const args = [...arguments].slice(2);

        if (this.getRight()) {
            this.getRight()[key](status, ...args);
        }
    }


    destroy() {
        super.destroy();
        delete Slots.cacheItems[this.oldHeadPos];
    }
}

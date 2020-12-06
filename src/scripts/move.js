class MoveLoop {
    constructor(config) {
        const { objects } = config;

        this.objects = objects;
        this.movedObject = null;
        this.redraw = null;
    }

    mouseDown(event) {
        let i = this.objects.length - 1;
        this.movedObject = null;
        const mousePos = this.toGlobalPos(event);

        while (i >= 0) {
            if (this.objects[i] && this.objects[i].isActive) {
                if (this.objects[i].isActive(mousePos)) {
                    this.movedObject = this.objects[i];
                    break;
                }
            }
            i--;
        }

        if (this.movedObject && this.movedObject.mouseDown) {
            this.movedObject.mouseDown(this._toLocalPos(event));
            if (this.redraw) {
                this.redraw()
            }
        }
    }

    mouseMove(event) {
        if (this.movedObject && this.movedObject.mouseMove) {
            this.movedObject.mouseMove(this._toLocalPos(event));
            if (this.redraw) {
                this.redraw()
            }
        }
    }

    mouseUp(event) {
        if (this.movedObject && this.movedObject.mouseUp) {
            this.movedObject.mouseUp(this._toLocalPos(event));
            if (this.redraw) {
                this.redraw();
            }
        }
    }

    _toLocalPos(event) {
        const grid = this.objects[0];
        return {
            x: (event.pageX - grid.w / 2) / grid.zoom,
            y: (event.pageY - grid.h / 2) / grid.zoom
        };
    }

    toGlobalPos(event) {
        const localPos = this._toLocalPos(event);

        const grid = this.objects[0];
        return {
            x: localPos.x - grid.x,
            y: localPos.y - grid.y
        };
    }

}

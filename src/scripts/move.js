class MoveLoop {
    constructor(config) {
        const { canvas, objects }= config;

        this.objects = objects;
        this.movedObject = null;
        this.redraw = null;

        canvas.onmousedown = this.mouseDown.bind(this);
        canvas.onmousemove = this.mouseMove.bind(this);
        canvas.onmouseout = this.mouseUp.bind(this);
        canvas.onmouseup = this.mouseUp.bind(this);
    }

    mouseDown(event) {
        event.stopPropagation()
        let i = this.objects.length - 1;
        this.movedObject = null;

        const localPos = this._toLocalPos(event);

        const grid = this.objects[0];
        const mousePos = {
            x: localPos.x - grid.x,
            y: localPos.y - grid.y
        };

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
        event.stopPropagation()
        if (this.movedObject && this.movedObject.mouseMove) {
            this.movedObject.mouseMove(this._toLocalPos(event));
            if (this.redraw) {
                this.redraw()
            }
        }
    }

    mouseUp(event) {
        event.stopPropagation()
        if (this.movedObject && this.movedObject.mouseUp) {
            this.movedObject.mouseUp(this._toLocalPos(event));
            if (this.redraw) {
                this.redraw()
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

}

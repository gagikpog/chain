class Move {

    constructor(config) {
        const { canvas, zoom, offset }= config;
        this.mousePressed = false;
        this.mousePos = null;
        this.zoom = zoom || 1;
        this.offset = offset || {x: 0, y: 0};

        this.offsetChanged = null;
        this.zoomChanged = null;

        canvas.onmousewheel = this.mouseWheel.bind(this);
        canvas.onmousedown = this.mouseDown.bind(this);
        canvas.onmousemove = this.mouseMove.bind(this);
        canvas.onmouseout = this.mouseUp.bind(this);
        canvas.onmouseup = this.mouseUp.bind(this);
    }

    mouseWheel(event) {
        event.stopPropagation()
        const delta = (event.deltaY || event.detail) > 0 ? 0.5 : 2;
        const newZoom = this.zoom * delta;
        if (newZoom > 0) {
            this.zoom = newZoom;
            if (this.zoomChanged) {
                this.zoomChanged(newZoom);
            }
        }
    }

    mouseDown(event) {
        event.stopPropagation()
        this.mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    }

    mouseMove(event) {
        event.stopPropagation()
        if (this.mousePos) {
            const dev = {
                x: this.mousePos.x - event.pageX,
                y: this.mousePos.y - event.pageY
            };
            this.mousePos = {
                x: event.pageX,
                y: event.pageY
            };
            this.offset = {
                x: this.offset.x - dev.x,
                y: this.offset.y - dev.y
            };
            if (this.offsetChanged) {
                this.offsetChanged(this.offset);
            }
        }
    }

    mouseUp(event) {
        event.stopPropagation()
        this.mousePos = null;
    }

}
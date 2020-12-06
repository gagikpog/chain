class Main {
    constructor(config) {
        const { canvas } = config;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = new Grid({canvas});
        this.objects = [this.grid];
        this.objects.push(new Movable());
        this.moveLoop = new MoveLoop({ canvas, objects: this.objects });

        this.windowResize = this.windowResize.bind(this);
        this.redraw = this.redraw.bind(this);

        window.onresize = this.windowResize;
        this.moveLoop.redraw = this.redraw;
        this.grid.zoomChanged = this.redraw;

        this.windowResize();
    }

    windowResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.grid.h = this.canvas.height;
        this.grid.w = this.canvas.width;
        this.redraw();
    }

    redraw() {
        display(this.getSettings());
    }

    getSettings() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            zoom: this.grid.zoom,
            offset: this.grid,
            ctx: this.ctx,
            objects: this.objects
        };
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    new Main({ canvas });
});

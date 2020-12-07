class Main {
    constructor(config) {
        const { canvas } = config;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = new Grid({ canvas, zoom: 35 });
        this.objects = [this.grid];
        this.objects.push(...(new Array(10).fill(null).map((val, x) => new Point({x}))));
        this.moveLoop = new MoveLoop({ canvas, objects: this.objects });

        this.windowResize = this.windowResize.bind(this);

        window.onresize = this.windowResize;

        this.windowResize();

        canvas.onmousedown = this.mouseDown.bind(this);
        canvas.onmousemove = this.mouseMove.bind(this);
        canvas.onmouseout = this.mouseUp.bind(this);
        canvas.onmouseup = this.mouseUp.bind(this);

        this.displayLoop();
    }

    windowResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.grid.h = this.canvas.height;
        this.grid.w = this.canvas.width;
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

    mouseDown(event) {
        event.stopPropagation();

        switch (event.button) {
            case 0:
                this.moveLoop.mouseDown(event);
                break;
            case 1:
                const { x, y } = this.moveLoop.toGlobalPos(event);
                const elemX = Math.floor(x);
                const elemY = Math.floor(y);
                if (!Slots.cacheItems[`[${elemX},${elemY}]`]) {
                    this.objects.push( new Point({x: elemX, y: elemY}));
                }
                break;
            default:
                event.preventDefault();
                break;
        }

    }

    mouseMove(event) {
        event.stopPropagation();
        this.moveLoop.mouseMove(event);
    }

    mouseUp(event) {
        event.stopPropagation();
        this.moveLoop.mouseUp(event);
    }

    displayLoop() {
        this.timer = setInterval(() => {
            this.redraw();
        }, 16);
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    window.main = new Main({ canvas });
});

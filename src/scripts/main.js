class Main {
    constructor(config) {
        const { canvas } = config;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = new Grid({ canvas, zoom: 35 });
        this.objects = [this.grid];
        this.energySource = new EnergySource();
        this.objects.push(this.energySource);
        this.objects.push(...(new Array(10).fill(null).map((val, x) => new Point({ x: x + 1 }))));
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
        contextMenu.style.display = 'none';
        this.editingItem = null;
        switch (event.button) {
            case 0:
                this.moveLoop.mouseDown(event);
                break;
            case 1:
                const { x, y } = this.moveLoop.toGlobalPos(event);
                const elemX = Math.floor(x);
                const elemY = Math.floor(y);
                if (!Slots.cacheItems[`[${elemX},${elemY}]`]) {
                    this.objects.push(new Point({ x: elemX, y: elemY }));
                }
                break;
            case 2:
                const pos = this.moveLoop.toGlobalPos(event);
                const item = Slots.cacheItems[`[${Math.floor(pos.x)},${Math.floor(pos.y)}]`];
                if (item) {
                    const actions = item.getActions();
                    if (actions.length) {
                        this.editingItem = item;
                        contextMenu.classList.remove(...contextMenu.classList);
                        contextMenu.classList.add('context-menu');
                        contextMenu.classList.add(...actions.map((className) => `context-menu-${className}`));
                        contextMenu.style.display = 'flex';
                        contextMenu.style.top = event.clientY - 11 + 'px';
                        contextMenu.style.left = event.clientX + 'px';
                    }
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
    runSourceLoop() {
        this.sourceTimer = setInterval(() => {
            this.energySource.neighborsEnable();
            this.objects.forEach((item) => item.canBeOn && item.canBeOn());
            this.energySource.dropVisits();
        }, 80);
    }
    stopSourceLoop() {
        clearInterval(this.sourceTimer);
        this.objects.forEach((item) => item.setOn && item.setOn(false));
    }

    contextElementActivated(event) {
        contextMenu.style.display = 'none';
        const action = event.target.id;
        switch(action) {
            case 'delete':
                const itemId = this.objects.findIndex((item) => item === this.editingItem);
                if (itemId > 0) {
                    this.editingItem.destroy();
                    this.objects.splice(itemId, 1);
                }
                break;
            default:
                if (this.editingItem && this.editingItem[action]) {
                    this.editingItem[action]();
                }
                break;
        }
        
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    window.main = new Main({ canvas });

    window.contextMenu = document.querySelector('.context-menu');

    contextMenu.addEventListener('click', (event) => {
        main.contextElementActivated(event);
    })

    if (document.addEventListener) {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);
    } else {
        document.attachEvent('oncontextmenu', function () {
            window.event.returnValue = false;
        });
    }

});

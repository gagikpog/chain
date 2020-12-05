
document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const grid = new Grid({canvas});

    const objects = [grid];

    objects.push(new Movable());

    const getSettings = () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            zoom: grid.zoom,
            offset: grid,
            ctx,
            objects
        };
    }

    window.onresize = ((c) => () => {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        grid.h = c.height;
        grid.w = c.width;
        display(getSettings());
    })(canvas);

    const moveLoop = new MoveLoop({ canvas, objects});

    moveLoop.redraw = () => {
        display(getSettings());
    }
    grid.zoomChanged = moveLoop.redraw;

    window.onresize();

});

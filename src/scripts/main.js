
document.addEventListener("DOMContentLoaded", () => {

    const objects = [];

    let offset = {x: 0, y: 0};
    let zoom = 10;
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const getSettings = () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            zoom,
            offset,
            ctx,
            objects
        };
    }

    window.onresize = ((c) => () => {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        display(getSettings());
    })(canvas);


    const windowMover = new Move({ canvas, zoom, offset});

    objects.push(new BaseObject({}));

    window.onresize();


    windowMover.offsetChanged = (_offset) => {
        offset = _offset;
        display(getSettings());
    }

    windowMover.zoomChanged = (_zoom) => {
        zoom = _zoom;
        display(getSettings());
    }

});

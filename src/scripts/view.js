function drawGrid(config) {
    const { zoom, offset, ctx, width, height } = config;

    ctx.beginPath();
    ctx.strokeStyle = "#F0F0F0";

    for (let i = (offset.x + width / 2) % zoom; i <= width; i += zoom) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
    }

    for (let j = (offset.y + height / 2) % zoom; j <= height; j += zoom) {
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
    }

    ctx.stroke();
}

function display(config) {
    const { ctx, width, height, objects } = config;
    ctx.clearRect(0, 0, width, height);
    drawGrid(config);
    objects.forEach((obj) => {
        obj.draw(config);
    });

}


function display(config) {
    const { ctx, width, height, objects } = config;
    ctx.clearRect(0, 0, width, height);

    objects.forEach((obj) => {
        obj.draw(config);
    });

}

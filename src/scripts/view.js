
function display(config) {
    const { ctx, width, height, objects } = config;
    ctx.clearRect(0, 0, width, height);

    objects.forEach((obj) => {
        obj.draw(config);
    });

}

function run(event) {
    const changeCaptionTo = {
        run: 'stop',
        stop: 'run'
    };

    event.target.classList.remove(`button-${event.target.innerText}`);
    event.target.classList.add(`button-${changeCaptionTo[event.target.innerText]}`);

    event.target.innerText = changeCaptionTo[event.target.innerText];
}

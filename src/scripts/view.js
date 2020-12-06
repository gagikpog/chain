
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
    const caption = event.target.innerText;
    if (caption === 'run') {}

    event.target.classList.remove(`button-${caption}`);
    event.target.classList.add(`button-${changeCaptionTo[caption]}`);

    event.target.innerText = changeCaptionTo[caption];
    
}

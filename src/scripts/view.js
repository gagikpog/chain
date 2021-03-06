let step = 0
let d = 0;
function display(config) {
    const { ctx, width, height, objects } = config;
    ctx.clearRect(0, 0, width, height);

    step++;
    const newD = new Date();
    if (newD - d >= 1000) {
        d = newD;
        const fps = step;
        step = 0;
        document.querySelector('#fps').innerText = fps;
    }

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
    if (caption === 'run') {
        main.runSourceLoop();
    } else {
        main.stopSourceLoop();
    }

    event.target.classList.remove(`button-${caption}`);
    event.target.classList.add(`button-${changeCaptionTo[caption]}`);

    event.target.innerText = changeCaptionTo[caption];
}

const {to,fromTo,set} = gsap;

if (document.getElementById("body").classList.contains("dark")) {
    document.querySelectorAll(".day-night").forEach(dayNight => {
        dayNight.classList.add("night")
    })
}

document.querySelectorAll('.day-night').forEach(dayNight => {
    let toggle = dayNight.querySelector('.toggle');

    toggle.addEventListener('click', e => {
        e.preventDefault();

        if (dayNight.classList.contains('animate')) {
            return;
        }

        dayNight.classList.add('animate');

        let night = dayNight.classList.contains('night');

        to(dayNight, {
            keyframes: [{
                    [night ? '--moon-y' : '--sun-y']: '-4px',
                    duration: .25
                },
                {
                    [night ? '--moon-y' : '--sun-y']: '60px',
                    duration: .2
                },
                {
                    [night ? '--sun-y' : '--moon-y']: '-4px',
                    duration: .25,
                    delay: .275,
                    onStart() {
                        to(dayNight, {
                            '--new-percent': '100%',
                            duration: .5
                        });

                    }
                },
                {
                    [night ? '--sun-y' : '--moon-y']: '0px',
                    duration: .5,
                    ease: 'elastic.out(1, .5)',
                    clearProps: true,
                    onComplete() {
                        if (night) {
                            dayNight.classList.remove('night');
                        } else {
                            dayNight.classList.add('night');
                        }
                        dayNight.classList.remove('animate');
                    }
                }
            ]
        });

        updateColorTheme()

    });
});

function getPoint(point, i, a, smoothing) {
    let cp = (current, previous, next, reverse) => {
            let p = previous || current,
                n = next || current,
                o = {
                    length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
                    angle: Math.atan2(n[1] - p[1], n[0] - p[0])
                },

                angle = o.angle + (reverse ? Math.PI : 0),
                length = o.length * smoothing;
            return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
        },
        cps = cp(a[i - 1], a[i - 2], point, false),
        cpe = cp(point, a[i - 1], a[i + 1], true);
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
}

function getPath(update, smoothing) {
    let points = [
            [4, 18],
            [26, update],
            [48, 18]
        ],

        d = points.reduce((acc, point, i, a) => i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`, '');
    return `<path d="${d}" />`;
}

function updateColorTheme() {
    
    var body = document.getElementsByClassName("dark");

    if (!(body.length)) {
        var body = document.getElementsByClassName("light")[0];

        body.classList.remove("light");
        body.classList.add("dark");

        return
    }

    body = body[0]

    body.classList.remove("dark");
    body.classList.add("light");

}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
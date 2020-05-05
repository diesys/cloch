/////// CLOCH API //////////////////////

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function setHour(new_hour, sixHours = true) { //style = 'fade') {
    style = 'fade' // using as default

    // adding hour to the conf
    config['hour']['value'] = new_hour % 24
    config['hour']['valueHex'] = new_hour % 6
    config['hour']['valueDodec'] = new_hour % 12
    updateDigitalClock()

    // selection 6/12h
    coords = sixHours ? hoursXY : hoursXYdodec
    length = sixHours ? 6 : 12

    transl = "translate(" + coords[new_hour % length][0] + 'px, ' + coords[new_hour % length][1] + "px)"
    duration = ind_anim_duration

    // 0-5 half moon, 6-11 full sun, 12-17 half sun, 18-23 full moon
    if (config['hour']['value'] >= 0 && config['hour']['value'] <= 5) {
        mask_opacity = .6;
    } else if (config['hour']['value'] >= 6 && config['hour']['value'] <= 11) {
        mask_opacity = 0;
    } else if (config['hour']['value'] >= 12 && config['hour']['value'] <= 17) {
        mask_opacity = .4;
    } else { // if (new_hour >= 18 && new_hour <= 23) {
        mask_opacity = 1;
    }

    // ANIMATION
    gsap.fromTo(sunMoon[0], {
        opacity: 0,
        transform: transl
    }, {
        duration: duration,
        opacity: 1,
        transform: transl,
        ease: ind_anim_easing
    })
    // mask sun/moon
    gsap.to(sunMoon[2], {
        delay: duration / 2,
        duration: duration * 2,
        opacity: mask_opacity,
        ease: ind_anim_easing
    })

    if (config['debug']) console.log("new hour set: ", hour)
}


function setMinute(min, theme = config['theme']) {
    if (min < 60) {
        // remove preview min from all indicators / default coloring
        for (i = 0; i < 12; i++) {
            fill = i % 2 ? 'rgba(0,0,0,.04)' : 'rgba(0,0,0,.07)'
            gsap.to(minutes[i], {
                fill: fill,
                delay: 0,
            })
        }

        // sets the colors
        colors = minutes_sets[theme]
        // alpha = theme == 'dark' ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)'

        // adding the minute to the conf
        // a minute is about 0.2, toFixed gives 1 dec digit,tmp to string,separate dec from floor - to int and normalize newMin[1] for index opacity ranges [0..3] levels
        config['minute']['value'] = min
        config['minute']['indicator_index'] = parseInt(((min / 5) % 12).toFixed(1).toString().split('.')[0]),
            config['minute']['opacity_index'] = ((min / 5) % 12).toFixed(1).toString().split('.')[1] / 2
        updateDigitalClock()

        // selecting the indicators
        first_ind = minutes[config['minute']['indicator_index'] % 12],
            second_ind = minutes[(config['minute']['indicator_index'] + 1) % 12];

        // ANIMATION
        gsap.fromTo(first_ind, {
            opacity: 0
        }, {
            ease: ind_anim_easing,
            fill: colors['color'],
            opacity: colors['opacity_st'][config['minute']['opacity_index']],
        })

        if (min % 5) {
            gsap.fromTo(second_ind, {
                opacity: 0
            }, {
                ease: ind_anim_easing,
                fill: colors['color'],
                opacity: colors['opacity_nd'][config['minute']['opacity_index']]
            })
        }

        if (config['debug']) console.log("new minute: ", min)

    } else console.log('error: minutes can be [0..60]')
}

function updateDigitalClock() {
    digital_min = config['minute']['value'] < 10 ? '0' + config['minute']['value'] : config['minute']['value']
    document.querySelector("#digital_clock").innerHTML = config['hour']['value'] + "<i id='digital_clock_sec_ind'>:</i>" + digital_min
}

function toggleTheme(theme) {
    if (!theme)
        theme = config['theme']

    if (config['debug'])
        console.log('curr theme', theme)

    if (theme == 'dark') {
        new_fill_sunmoon = '#040404'
        new_theme = 'light'
    } else if (theme == 'light') {
        new_fill_sunmoon = '#ffffff'
        new_theme = 'dark'
    } else
        console.log('wrong theme...')

    // minutes
    setMinute(config['minute']['value'], new_theme)

    // hours
    gsap.to(sunMoon[1], .5, {
        fill: new_fill_sunmoon,
        ease: ind_anim_easing
    });

    // toggles body class with the new theme
    document.querySelector('body').classList.remove(theme)
    document.querySelector('body').classList.add(new_theme)

    changeImgFilter(config['color'])

    if (config['debug'])
        console.log('new theme', new_theme)

    // writing to conf
    config['theme'] = new_theme;

    // updates the url with color and theme
    updateURL()
}

function changeColor(color, duration = .8) {
    // svg quadranthx and sunmoon mask indicator change
    gsap.to(sunMoon[2], duration, {
        css: {
            fill: color
        }
    });
    gsap.to(background, duration, {
        delay: 0,
        css: {
            fill: color
        }
    });

    // changes colors to link and titles and text element with THEME-COLORED class
    document.querySelectorAll('.theme-colored').forEach(element => {
        element.setAttribute('style', 'color:' + color + '; textShadow: rgba(0,0,0,.5) 0 0 3px;')
    })

    // changes browser and button color
    document.querySelectorAll('.browser-theme-colored').forEach(element => {
        gsap.to(element, duration, {
            delay: 0,
            attr: {
                content: color
            }
        });
        // element.setAttribute('content', color)
    })

    changeImgFilter(color)

    if (config['debug'])
        console.log("new color", color)

    config['color'] = color.replace(/\s/g, '')
    updateURL()
}

function changeImgFilter(color) { 
    rgb = color.substring(4, color.length - 1)
        .replace(/ /g, '')
        .split(',');
         
    console.log(rgb)
    hue = RGBToHue(rgb) + 20 // shift because starts with magenta
    if(document.querySelector('body').classList.contains('light')) {
        hue -= 180 // for inverted colors _ shift 
        filter = 'hue-rotate('+ hue + 'deg)' + ' invert(1) contrast(1.1)'
    } else {
        filter = 'hue-rotate(' + hue + 'deg)'
    }
    document.querySelectorAll('#help img').forEach(element => {
        element.setAttribute('style', 'filter:' + filter)
    })   
}
// used for hue rotation of images in help section, to be theme-colored too, returing only HUE
// https://css-tricks.com/converting-color-spaces-in-javascript/
function RGBToHue([r, g, b]) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0//,
        // s = 0,
        // l = 0;
    
        if (delta == 0)
            h = 0;
        // Red is max
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax == g)
            h = (b - r) / delta + 2;
        // Blue is max
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        // Make negative hues positive behind 360°
        if (h < 0)
            h += 360;

    return h
}

function updateURL() {
    if (window.history.replaceState) {
        //prevents browser from storing history with each change:
        window.history.replaceState({
            'color': config['color'],
            'theme': config['theme'],
            'hexCloch': config['hexCloch'],
            'lang': config['lang']
        }, 'newclrtheme', '?color=' + config['color'] + '&theme=' + config['theme'] + '&hexCloch=' + config['hexCloch'] + '&lang=' + config['lang']);
    }
}

function clochToggle() {
    if (clochStopped) {
        startstop_cloch.classList.add('fa-pause');
        startstop_cloch.classList.remove('fa-play');
        document.querySelector("#digital_clock").classList.remove('paused');
        clochStopped = false;
    } else {
        startstop_cloch.classList.add('fa-play');
        startstop_cloch.classList.remove('fa-pause');
        document.querySelector("#digital_clock").classList.add('paused');
        clochStopped = true;
    }
}

// handler for manual time input
function manualTime(event) {
    new_h = parseInt(event.target.value.split(':')[0])
    new_m = parseInt(event.target.value.split(':')[1])
    if (new_h != config['hour']['value'])
        setHour(new_h, config['hexCloch'])
    if (new_m != config['minute']['value'])
        setMinute(new_m)

    if (config['debug'])
        console.log(new_time)
}

// some viewing functions ////////////////////////////////
function hide(element, duration = 600) {
    element.classList.add('fake_hidden')
    setTimeout(function () {
        element.classList.remove('fake_hidden')
        element.classList.add('hidden')
    }, duration)
}

function show(element) {
    element.classList.remove('hidden')
}

function toggleView(element) {
    element.classList.contains('hidden') ? show(element) : hide(element)
}

function blockUserInput(element, duration = 600) {
    element.classList.add('noInputEvents')
    setTimeout(function () {
        element.classList.remove('noInputEvents')
    }, duration)
}


// some showcase/example functions ////////////////////////////////
function exampleMins(time = 500) {
    clochStopped = true;
    j = 0;
    setInterval(function () {
        if (j < 60) {
            setMinute(j, config['theme']);
            j++
        }
    }, time)
}

function exampleHours(time = 1300) {
    clochStopped = true;
    i = 0;
    setInterval(function () {
        if (i < 24) {
            setHour(i, config['hexCloch']);
            i++
        }
    }, time * 2)
}

function toggleLang() {
    // toggle
    config['lang'] = document.querySelector('body').classList.contains('it') ? 'en' : 'it'

    if(config['lang'] == 'it') {
        document.querySelector('body').classList.add('it')
        document.querySelector('body').classList.remove('en')
        show_selector = 'body .it'
        hide_selector = 'body .en'
    }
    else {
        document.querySelector('body').classList.add('en')
        document.querySelector('body').classList.remove('it')
        show_selector = 'body .en'
        hide_selector = 'body .it'
    }

    duration = .6
    document.querySelectorAll(show_selector).forEach(element => {
        gsap.fromTo(element, duration, 
            {delay: duration, css: {opacity: 0, filter: 'blur(5px)', display: 'none'}}, 
            {css: {opacity: 1, filter: 'blur(0px)', display: 'block'}
        })
    })
    document.querySelectorAll(hide_selector).forEach(element => {
        element.style.display = 'none'
    })

    updateURL()
}

// CONFIGS and ELEMENTS //////////////////////////////////////////////////////////////////////////////////////////////////////
minutes = [
    document.querySelector('#minAng_top'),
    document.querySelector('#minMid_rightT'),
    document.querySelector('#minAng_topR'),
    document.querySelector('#minMid_right'),
    document.querySelector('#minAng_bottomR'),
    document.querySelector('#minMid_rightB'),
    document.querySelector('#minAng_bottom'),
    document.querySelector('#minMid_leftB'),
    document.querySelector('#minAng_bottomL'),
    document.querySelector('#minMid_left'),
    document.querySelector('#minAng_topL'),
    document.querySelector('#minMid_leftT')
]

// indicator, sun and moon mask. sunMoon[2].opacity=0 -> sun; sunMoon[2].opacity=0 -> moon
sunMoon = [
    document.querySelector('#sunmoon_indicator'),
    document.querySelector('#sun'),
    document.querySelector('#moon_mask')
]

// sort of a false perspective cube on the center of the quadrant
// cubex = [document.querySelector('#cubex_top'), document.querySelector('#cubex_left'), document.querySelector('#cubex_right')];

// Hours traslation coordinates
hoursXY = new Array([-33.8, -19], [0, 0], [0, 40], [-33.8, 58], [-67, 38], [-67, 0])
hoursXYdodec = new Array([-33.8, -19], [-15, -11], [0, 0], [2, 20], [0, 40], [-15, 51], [-33.8, 58], [-52, 51], [-67, 38], [-70, 20], [-67, 0], [-52, -11])

// Minutes indicator color values
minutes_sets = { // to -> animation
    'dark': { // on light theme => dark indicators
        'color': 'rgba(255,255,255,1)',
        'opacity_st': [1, 1, .7, .4, .4],
        'opacity_nd': [0, .4, .4, .7, 1]
    },
    'light': { // on dark theme => light indicators
        'color': 'rgba(0,0,0,1)',
        'opacity_st': [1, 1, .6, .3, .3],
        'opacity_nd': [0, .3, .3, .6, 1]
    }
}

// general duration fade used for relative timing and delay
durationFade = .1
// default configs for indicators timing
ind_anim_easing = 'Power2.easeInOut'
ind_anim_duration = 1

// global variable for start/stopping the clock for manual select
clochStopped = false
/////// CLOCH API //////////////////////

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function setHour(new_hour, style = 'fade') {
    new_hour = new_hour % 24;
    var hXY = hoursXY[new_hour % 6],
        hour = {
            'value': new_hour,
            'valueHex': new_hour % 6,
            'X': hXY[0],
            'Y': hXY[1]
        };
    transl = "translate(" + hour['X'] + 'px, ' + hour['Y'] + "px)",
        duration = 1,
        mask_opacity = '';

    // adding hour to the conf
    config['hour'] = hour;

    // 0-5 half moon, 6-11 full sun, 12-17 half sun, 18-23 full moon
    if (new_hour >= 0 && new_hour <= 5) {
        mask_opacity = .6;
    } else if (new_hour >= 6 && new_hour <= 11) {
        opacity = 0;
    } else if (new_hour >= 12 && new_hour <= 17) {
        mask_opacity = .4;
    } else if (new_hour >= 18 && new_hour <= 23) {
        mask_opacity = 1;
    }

    if (style == 'fade') {
        TweenMax.to(sunMoon[0], 2 * durationFade, {
            delay: 0,
            opacity: 0,
        });
        TweenMax.to(sunMoon[0], 0, {
            delay: 3 * durationFade,
            transformOrigin: "50% 50%",
            css: {
                transform: transl
            },
        });
        TweenMax.to(sunMoon[0], 4 * durationFade, {
            opacity: 1,
            delay: 4 * durationFade,
            ease: Bounce.easeOut,
        });
        TweenMax.to(sunMoon[2], 40 * durationFade, {
            delay: 0,
            opacity: mask_opacity,
            ease: Power2.easeOut,
        });
    } else if (style == 'move') {
        TweenMax.to(sunMoon[0], duration, {
            delay: 0,
            transformOrigin: "50% 50%",
            ease: Power3.easeInOut,
            css: {
                transform: transl
            },
        });
    }

    if (config['debug']) {
        console.log("new hour set: ", hour);
    }
}

function setMinute(min, theme = config['theme']) {
    if (min < 60) {
        // a minute is about 0.2, toFixed gives 1 dec digit,tmp to string,separate dec from floor
        var tmp = ((min / 5) % 12).toFixed(1).toString().split('.'),
            // to int and normalize newMin[1] for index opacity ranges [0..3] levels
            newMin = {
                'value': min,
                'indicator_index': parseInt(tmp[0]),
                'opacity_index': tmp[1] / 2
            };

        // adding the minute to the conf
        config['minute'] = newMin;

        // cloch indicators in a thorus previous indicator, fix
        if (min == 0)
            var prec = minutes[11];
        else
            var prec = minutes[(newMin['indicator_index'] - 1) % 12];

        // the base indicator and its next one
        var first = minutes[newMin['indicator_index'] % 12],
            second = minutes[(newMin['indicator_index'] + 1) % 12];

        // indicators' animations
        if (theme == 'dark') {
            colors = minutesColors
        } else if (theme == 'light') {
            colors = minutesColorsLight
        }

        TweenMax.fromTo(first, 8 * durationFade, {
            fill: colors['first_start'][newMin['opacity_index']],
            delay: 2 * durationFade,
        }, {
            fill: colors['first'][newMin['opacity_index']],
            delay: 2 * durationFade,
        });
        // next indicator
        TweenMax.fromTo(second, 8 * durationFade, {
            fill: colors['second_start'][newMin['opacity_index']],
            delay: 2 * durationFade,
        }, {
            fill: colors['second'][newMin['opacity_index']],
            delay: 2 * durationFade,
        });

        // remove bg from other indicators
        for (i = 0; i < 12; i++)
            if (i != newMin['indicator_index'])
                if (i % 2 == 0) {
                    TweenMax.to(minutes[i], 8 * durationFade, {
                        fill: 'rgba(0,0,0,.07)',
                        delay: 0,
                    });
                } else {
                    TweenMax.to(minutes[i], 8 * durationFade, {
                        delay: 0,
                        fill: 'rgba(0,0,0,.04)',
                    });
                }

        // change digital time in toolbar
        temp_min = config['minute']['value'];
        tmp_min = temp_min < 10 ? '0' + temp_min : temp_min;
        new_digital_time = config['hour']['value'] + "<i id='digital_clock_sec_ind'>:</i>" + tmp_min;
        $("#digital_clock").html(new_digital_time);

        if (config['debug']) {
            console.log("new minute: ", min);
        }

    } else console.log('error: minutes can be [0..60]');
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
    setMinute(config['minute']['value'], new_theme);

    // hours
    TweenMax.to(sunMoon[1], .5, {
        fill: new_fill_sunmoon,
        ease: Power2.easeOut,
    });

    // preserves the blur and just toggles body and gradient dont know why it's inverted......!!!!!!!!!!
    $('body').removeClass(theme)
    $('#grad').removeClass(theme)
    $('body').addClass(new_theme)
    $('#grad').addClass(new_theme)

    // toolbar coloring
    $('#toolbar i.fa').switchClass(new_theme, theme, 1000, "easeInOutQuad");

    if (config['debug'])
        console.log('new theme', new_theme)

    // writing to conf
    config['theme'] = new_theme;

    // updates the url with color and theme
    updateThemeURL()
}

function changeColor(color, duration = .8) {
    var backgroundColorChange = TweenMax.to(background, duration, {
        delay: 0,
        transformOrigin: "50% 50%",
        css: {
            fill: color
        },
    });
    var maskColorChange = TweenMax.to(sunMoon[2], duration, {
        delay: 0,
        transformOrigin: "50% 50%",
        css: {
            fill: color
        },
    });

    // changes browser and button color
    $('div.pcr-button').css({
        'background': color
    })
    $('a').css({
        'color': color,
        'textShadow': color + ' 0 0 1.5px'
    })
    $('#browserColor').attr('content', color)
    $('#browserColorwp').attr('content', color)
    $('#browserColorap').attr('content', color)

    if (config['debug']) {
        console.log("new color", color)
    }

    config['color'] = color.replace(/\s/g, '')
    updateThemeURL()
}

function updateThemeURL() {
    if (window.history.replaceState) {
        //prevents browser from storing history with each change:
        window.history.replaceState({
            'color': config['color'],
            'theme': config['theme']
        }, 'newclrtheme', '?color=' + config['color'] + '&theme=' + config['theme']);
    }
}

function clochToggle() {
    if (stopCloch) {
        $("#startstop_cloch").addClass('fa-pause');
        $("#startstop_cloch").removeClass('fa-play');
        $("#digital_clock").removeClass('paused');
        stopCloch = false;
    } else {
        $("#startstop_cloch").addClass('fa-play');
        $("#startstop_cloch").removeClass('fa-pause');
        $("#digital_clock").addClass('paused');
        stopCloch = true;
    }
}

function exampleMins(time = 500) {
    stopCloch = true;
    j = 0;
    setInterval(function () {
        if (j < 60) {
            setMinute(j, config['theme']);
            j++
        }
    }, time)
}

function exampleHours(time = 1300) {
    stopCloch = true;
    i = 0;
    setInterval(function () {
        if (i < 24) {
            setHour(i)
            i++
        }
    }, time * 2)
    // console.log(i,j)
}

// handler for manual time input
function manualTime(event) {
    new_h = parseInt(event.target.value.split(':')[0])
    new_m = parseInt(event.target.value.split(':')[1])
    if(new_h != config['hour']['value'])
        setHour(new_h)
    if(new_m != config['minute']['value']) 
        setMinute(new_m)
    // console.log(new_time)
}


// CONFIGS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MINUTES ANGLE: 0, 10, 20, 30, 50, 60  in clockwise order
// MINUTES MIDDLE: 5, 15, 25, 35, 45, 55 in clockwise order
minutes = [$('#minAng_top'), $('#minMid_rightT'), $('#minAng_topR'), $('#minMid_right'), $('#minAng_bottomR'), $('#minMid_rightB'), $('#minAng_bottom'), $('#minMid_leftB'), $('#minAng_bottomL'), $('#minMid_left'), $('#minAng_topL'), $('#minMid_leftT')],

// indicator, sun and moon mask. sunMoon[2].opacity=0 -> sun; sunMoon[2].opacity=0 -> moon
sunMoon = [$('#sunmoon_indicator'), $('#sun'), $('#moon_mask')],

// sort of a false perspective cube on the center of the quadrant
cubex = [$('#cubex_top'), $('#cubex_left'), $('#cubex_right')];

// Hours traslation coordinates
hoursXY = new Array([-33.8, -19], [0, 0], [0, 40], [-33.8, 58], [-67, 38], [-67, 0]);

// general duration fade used for relative timing and delay
durationFade = .1,

// global variable for start/stopping the clock for manual select
stopCloch = false;

// Minutes indicator color values (DARK)
minutesColorsLight = {
    // from < animation
    'first_start': ['rgba(5,5,5,1)', 'rgba(5,5,5,1)', 'rgba(5,5,5,1)', 'rgba(5,5,5,.7)', 'rgba(5,5,5,.4)'],
    'second_start': ['rgba(0,0,0,.1)', 'rgba(5,5,5,.1)', 'rgba(5,5,5,.4)', 'rgba(5,5,5,.4)', 'rgba(5,5,5,.7)'],

    // to > animation
    'first': ['rgba(5,5,5,1)', 'rgba(5,5,5,1)', 'rgba(5,5,5,.7)', 'rgba(5,5,5,.4)', 'rgba(5,5,5,.4)'],
    'second': ['rgba(0,0,0,.1)', 'rgba(5,5,5,.4)', 'rgba(5,5,5,.4)', 'rgba(5,5,5,.7)', 'rgba(5,5,5,1)'],
};
// light Minutes indicator color values 
minutesColors = {
    // from < animation
    'first_start': ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255, 255, 255, .7)', 'rgba(255, 255, 255, .4)'],
    'second_start': ['rgba(0,0,0,.1)', 'rgba(255,255,255,.1)', 'rgba(255,255,255,.4)', 'rgba(255, 255, 255, .4)', 'rgba(255, 255, 255, .7)'],

    // to > animation
    'first': ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,.7)', 'rgba(255, 255, 255, .4)', 'rgba(255, 255, 255, .4)'],
    'second': ['rgba(0,0,0,.1)', 'rgba(255,255,255,.4)', 'rgba(255,255,255,.4)', 'rgba(255, 255, 255, .7)', 'rgba(255, 255, 255, 1)'],
};



window.onload = function () {
    // main cloch elements
    cloch = $('#cloch')
    quadrant = $('#quadranthx')
    background = $('#backgroundhx')

    // // shows the cloch
    cloch.css({
        'opacity': '1'
    });


    ////// MAIN ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // get url color if any
    config = getUrlVars();
    if (!config['color'])
        config['color'] = '#ff3c6d'
    if (!config['theme'])
        config['theme'] = 'dark'

    // gets new date starts adding to config file 
    date = new Date();
    config['hour'] = {
        'value': date.getHours()
    };
    config['minute'] = {
        'value': date.getMinutes()
    };

    setTimeout(function () {
        setHour(date.getHours());
        setMinute(date.getMinutes(), config['theme']);

        if (config['debug']) {
            console.log("AUTO time set: ", config['hour'], ":", config['minute']);
        }

    }, 0);

    changeColor(config['color'], 0) // 0 is to disable first animation on load
    toggleTheme(config['theme'] == 'dark' ? 'light' : 'dark') // default theme is dark...

    // checks if there's any hour and minute in the url
    setInterval(function () {
        if (!stopCloch) {
            date = new Date();
            h = date.getHours();
            m = date.getMinutes();
            if (h != config['hour']['value'])
                setHour(h);
            if (m != config['minute']['value'])
                setMinute(m, config['theme']);
        }
        if (config['debug']) {
            console.log("AUTO update time: ", h, ":", m);
        }
    }, 500);


    //// UI /////////////////////////////////////////////
    // $("#control_buttons").hide();  debug
    $("#toolbarToggle").bind({
        click: function () {
            $("#control_buttons").toggleClass('hidden');
            if($(this).hasClass('showButton'))
                $("#palette").addClass('hidden');
            $("#toolbarToggle").toggleClass('showButton');
        },
    });
    /// SELECT MANUALLY HOUR AND MINUTE
    $(function () {
        $("#sel_hour").selectmenu({
            change: function (event, data) {
                setHour(data.item.value)
            }
        });

        $("#sel_minute").selectmenu({
            change: function (event, data) {
                setMinute(data.item.value, config['theme'])
            }
        });
    });

    $("#toggle_clockSettings").click(function () {
        $('#clock_settings').toggleClass('hidden')
    });

    $("#toggle_show").click(function () {
        $("#toggle_show").toggleClass('fa-eye')
        $("#toggle_show").toggleClass('fa-eye-slash')
        // when added edit option, enable !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // $('#toggle_stop_menu').fadeToggle()
        // $('#startstop_cloch').fadeToggle()
        // $('#startstop_cloch').toggleClass('hidden')
        $('#digital_clock').toggleClass('hidden')

        if (config['debug']) {
            console.log("manual timing toggle");
        }
    });

    $("#startstop_cloch").click(function () {
        clochToggle();

        // toggle disable state to the input (you can change time only on pause)
        $('#manual_time_input').prop("disabled", (_, val) => !val);

        if (config['debug']) {
            console.log("start/stop toggled");
        }
    });

    // newpalette
    $('#colorpicker').click(function () {
        $('#palette').toggleClass('hidden');
        // $('#palette').fadeToggle();
        // $('#theme_toggle').fadeToggle();

        if (config['debug']) {
            console.log("palette toggle");
        }
    });

    //   theme toggle binding
    document.querySelector('#theme_toggle').addEventListener('click', function () {
        toggleTheme()
    });


    // binds clicking pickr not working DAMN - magari rifare il selettore semplice cosi?
    $('#palette>#colors>li').click(function (e) {
        var color = $(e.target).css('background-color');
        changeColor(color);

        if (config['debug']) {
            console.log("palette color chaged to:", color);
        }
    });

    // help toggle
    $('.toggleHelp').click(function () {
        $('#help').fadeToggle()
        // $('#palette').fadeOut()
        document.body.classList.toggle('inactive')
    });


    // setup before start

    // sets transition for background body and gradient after page loading
    $('body').css('transition', 'background .8s');

}
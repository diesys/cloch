// document.addEventListener('DOMContentLoaded', function() {
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function changeColor(color, duration=.5) {
    var backgroundColorChange = TweenMax.to(background, duration, {
        delay: 0,
        transformOrigin: "50% 50%",
        css: {fill: color},
    });
    var maskColorChange = TweenMax.to(sunMoon[2], duration, {
        delay: 0,
        transformOrigin: "50% 50%",
        css: {fill: color},
    });

    //     colorpicker = $("colorpicker");
    //     colorpicker.value = color.replace('#', '');
    //     colorpicker.style.backgroundColor = color;
}

function setHour(new_hour, style='fade') {
    new_hour = new_hour % 24;
    var hXY = hoursXY[new_hour % 6],
        hour = {'value': new_hour, 'valueHex': new_hour % 6, 'X': hXY[0], 'Y': hXY[1]};
        transl = "translate(" + hour['X'] + 'px, ' + hour['Y'] + "px)",
        duration = 1,
        // durationFade = .1,
        mask_opacity = '';

    // 0-5 half moon, 6-11 full sun, 12-17 half sun, 18-23 full moon
    if(new_hour >= 0 && new_hour <= 5) {
        mask_opacity = .6;
        }
    else if(new_hour >= 6 && new_hour <= 11) {
        opacity = 0;
        }
    else if(new_hour >= 12 && new_hour <= 17) {
        mask_opacity = .4;
    }
    else if(new_hour >= 18 && new_hour <=23) {
        mask_opacity = 1;
    }    
    
    if(style == 'fade'){
        // TweenMax.set(sunMoon[2], {opacity: 0, });
        TweenMax.to(sunMoon[0], 2 * durationFade, {
            delay: 0,
            opacity: 0, 
        });
        TweenMax.to(sunMoon[0], 0, {
            delay: 3 * durationFade,
            transformOrigin: "50% 50%",
            css: {transform: transl},
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
    } else 
        if(style == 'move') {
            TweenMax.to(sunMoon[0], duration, {
                delay: 0,
                transformOrigin: "50% 50%",
                ease: Power3.easeInOut,
                css: {transform: transl},
            });
    }

    config['hour'] = hour;
}

function setMinute2(min, lazy = true) {
    if (min < 60) {
        // var minOpacity = lazy ? minutesStateLazy : minutesState;
        // console.log('lazy = ', lazy, '\nopacity levels:', minOpacity);

        // a minute is about 0.2, toFixed gives 1 dec digit,tmp to string,separate dec from floor
        var tmp = ((min / 5) % 12).toFixed(1).toString().split('.'),

            // to int and normalize newMin[1] for index opacity ranges [0..3] levels
            newMin = {'value': min};
            newMin['indicator_index'] = parseInt(tmp[0]);
            newMin['opacity_index'] = tmp[1] / 2;
            // console.log('minopacity:', newMin['opacity_index']);
            config['minute'] = newMin;
        
        if (min == 0)
            var prec = minutes[11];
        else
            var prec = minutes[(newMin['indicator_index'] - 1) % 12];

        var first = minutes[newMin['indicator_index'] % 12],
            second = minutes[(newMin['indicator_index'] + 1) % 12];

        // starts animation with fade-in consistent opacity level and leaves the indicator near the full opacity one in exact 10n and idle when in middle position(5n min)

        if (newMin['value'] % 10 == 0) {
            TweenMax.to(prec, 7 * durationFade, {
                fill: 'rgba(255,255,255,0)',
            });
            TweenMax.to(second, 7 * durationFade, {
                fill: 'rgba(255,255,255,0)',
            });
            console.log('mod 10');
        } else if (newMin['value'] % 5 == 0 && newMin['value'] % 10 != 0) {
            TweenMax.to(prec, 7 * durationFade, {
                fill: 'rgba(0,0,0,.1)',
            });
            TweenMax.to(second, 7 * durationFade, {
                fill: 'rgba(0,0,0,.1)',
            });
            console.log('mod 5');
        } else {
            // TweenMax.from(prec, 7 * durationFade, {
            //     fill: 'rgba(255,255,255,' + minutesState['first_start'][newMin['opacity_index']] + ')',
            // });
            TweenMax.from(second, 7 * durationFade, {
                fill: 'rgba(255,255,255,' + minutesState['second_start'][newMin['opacity_index']] + ')',
            });
            TweenMax.to(second, 7 * durationFade,{
                fill: 'rgba(255,255,255,' + minutesState['second'][newMin['opacity_index']] + ')',
                delay: 2 * durationFade,
            });
        }

        TweenMax.from(first, 7 * durationFade, {
            fill: 'rgba(255,255,255,' + minutesState['first_start'][newMin['opacity_index']] + ')',
        });
        TweenMax.to(first, 7 * durationFade,{
            fill: 'rgba(255,255,255,' + minutesState['first'][newMin['opacity_index']] + ')',
            delay: 2 * durationFade,    
        });
        
        
        // remove bg from other indicators
        for (i = 0; i < 12; i++)
        if (i != newMin['indicator_index'])
            if(i % 2 == 0) {
                TweenMax.to(minutes[i], 10 * durationFade,{
                    fill: 'rgba(0,0,0,.1)',
                    delay: 0,
                });
            }
            else {
                TweenMax.to(minutes[i], 10 * durationFade,{
                    delay: 0,
                    fill: 'rgba(0,0,0,.05)',
                });
            }
        // minutes[i].css({
                //     'fill': 'red'
                // });
                

        // console.log(newMin);

    } else console.log('error: minutes can be [0..60]');
}


function setMinute(min, lazy = true) {
    // sembra che sia trasparente il successivo(second) al primo passo del nuovo first DA RIVEDERE

    if (min < 60) {
        // var minOpacity = lazy ? minutesStateLazy : minutesState;
        // console.log('lazy = ', lazy, '\nopacity levels:', minOpacity);

        // a minute is about 0.2, toFixed gives 1 dec digit,tmp to string,separate dec from floor
        var tmp = ((min / 5) % 12).toFixed(1).toString().split('.'),

            // to int and normalize newMin[1] for index opacity ranges [0..3] levels
            newMin = {
                'value': min,
                'indicator_index': parseInt(tmp[0]),
                'opacity_index': tmp[1] / 2
            };
        
        config['minute'] = newMin;

        if (min == 0)
            var prec = minutes[11];
        else
            var prec = minutes[(newMin['indicator_index'] - 1) % 12];

        var first = minutes[newMin['indicator_index'] % 12],
            second = minutes[(newMin['indicator_index'] + 1) % 12];

        TweenMax.set(first, {
            fill: 'blue',
        });
        TweenMax.set(second, {
            fill: 'blue',
        });
        
        TweenMax.fromTo(first, 7 * durationFade, {
                fill: 'rgba(255,255,255,' + minutesState['first_start'][newMin['opacity_index']] + ')',
                delay: 2 * durationFade,
            },{
                fill: 'rgba(255,255,255,' + minutesState['first'][newMin['opacity_index']] + ')',
                delay: 2 * durationFade,
            });
            TweenMax.fromTo(second, 7 * durationFade, {
                fill: 'rgba(255,255,255,' + minutesState['second_start'][newMin['opacity_index']] + ')',
                delay: 2 * durationFade,
            }, {
                fill: 'rgba(255,255,255,' + minutesState['second'][newMin['opacity_index']] + ')',
                delay: 2 * durationFade,
        });
        


        // remove bg from other indicators
        for (i = 0; i < 12; i++)
            if (i != newMin['indicator_index'])
                if (i % 2 == 0) {
                    TweenMax.to(minutes[i], 10 * durationFade, {
                        fill: 'rgba(0,0,0,.1)',
                        delay: 0,
                    });
                }
        else {
            TweenMax.to(minutes[i], 10 * durationFade, {
                delay: 0,
                fill: 'rgba(0,0,0,.05)',
            });
        }
        // minutes[i].css({
        //     'fill': 'red'
        // });


        // console.log(newMin);

    } else console.log('error: minutes can be [0..60]');
}



function updateCloch(hour, minute) {
    sunMoon[0].animate({
        'opacity': '320'
    }, {
        step: function (now, fx) {
            $(this).css({
                "transform": "translate(0px, " + now + "px, 0px)"
            });
        },
        duration: 10000,
        easing: 'linear',
        queue: false,
        complete: function () {
            alert('Animation is done');
        }
    }, 'linear');
}

// function toggle_colorpicker() {
//     picker = $("colorpicker");
//     if (picker.className == "jscolor active") {
//         picker.className = "jscolor inactive"
//     } else {
//         picker.className = "jscolor active";
//     }
//     delete picker;
// }

window.onload = function () {
    cloch = $('#cloch'),
    // shows the cloch
    cloch.css({'opacity': '1'});
    
    quadrant = $('#quadranthx'),
    background = $('#backgroundhx'),
    
    // MINUTES ANGLE: 0, 10, 20, 30, 50, 60  in clockwise order
    // MINUTES MIDDLE: 5, 15, 25, 35, 45, 55 in clockwise order
    minutes = [$('#minAng_top'), $('#minMid_rightT'), $('#minAng_topR'), $('#minMid_right'), $('#minAng_bottomR'), $('#minMid_rightB'), $('#minAng_bottom'), $('#minMid_leftB'), $('#minAng_bottomL'), $('#minMid_left'), $('#minAng_topL'), $('#minMid_leftT')],
    
    // indicator, sun and moon mask. sunMoon[2].opacity=0 -> sun; sunMoon[2].opacity=0 -> moon
    sunMoon = [$('#sunmoon_indicator'), $('#sun'), $('#moon_mask')],
    
    // sort of a false perspective cube on the center of the quadrant
    cubex = [$('#cubex_top'), $('#cubex_left'), $('#cubex_right')];

    // Hours traslation coordinates
    hoursXY = new Array([-33.8, -19], [0, 0], [0, 40], [-33.8, 58], [-67, 38], [-67, 0]);

    // Minutes opacity values 
       // es 5min, 2 'triangles' indicators (angle and middle) with 3 states 
       // [0]: A=100, 
       // [1]: [A=100, M=40],
       // [2]: [A=70, M=40],
       // [3]: [A=40, M=70],
       // [4]: [A=40, M=100],
       // restart [5]: M=100, ...
    minutesState = {
        'first': [1,1,.7,.4,.4], 
        'second': [.1,.4,.4,.7,1],
        // used for animation transition between minutes
        'first_start': [1,1,1,.7,.4], 
        'second_start': [0,0,.4,.4,.7]
    };
    
    // general duration fade used for relative timing and delay
    durationFade = .1,
    
    // global variable for start/stopping the clock for manual select
    stopCloch = false;

    config = getUrlVars();
    
    
    // main
    
    // sets sun in the center
    TweenMax.set(sunMoon[0], {
        x:-33.8, y:20,
        transformOrigin: "-33px 20px",
    });

        
    if (!config['color'])
        config['color'] = '#ff3c6d';
    changeColor(config['color'],0);

    date = new Date();
    config['hour'] = {'value': date.getHours()};
    config['minute'] = {'value': date.getMinutes()};
    // setHour(config['currHour'], 'fade');
    
    first_minute = true;
    setTimeout(function () {
        date = new Date();
        setHour(date.getHours());
        setMinute(date.getMinutes());
        // console.log('first AUTO cloch configuration: ', config);
        // console.log('seconds2:', 60 - date.getSeconds());
    }, 0);
    
    setInterval(function () {
        if(!stopCloch) {
            date = new Date();
            h = date.getHours();
            m = date.getMinutes();
            // m = date.getSeconds();
            if (h != config['hour']['value'])
                setHour(h);
            if (m != config['minute']['value'])
                setMinute(m);
            
        }
            // console.log('AUTO cloch configuration: ', config, 'seconds:', first_minute ? ((60 - date.getSeconds()) * 1000) : 60000);
        // }, 1000); //troppo poco??
        }, 500);//500); //troppo poco??

    
    // }, first_minute ? ((60 - date.getSeconds()) * 1000) : 60000); // millisecondi sono i rimanenti rispetto al secondo attuale?
    // console.log('B', first_minute);
    first_minute = false;
    // console.log('A', first_minute);

    



    ////////// TO - DO //////////////////

    // menu per scegliere l'ora, cosi la si impara pure (magari integrata con l'url :Q )

    // bg esagonale, colori piatti, o al massimo tipo cartone come il quadrante

    // CREARE DIZIONARIO DI OPZIONI STANDARD COSI DA NON RIPETERLE TUTTE CAZZO

    // animazione piu' fluida al cambio dei minuti

    // fare bottoncino show/hide delle info (da disegnare) tipo sulle ore, e sui minuti cosi da renderlo piu comprensibile all'inizio



    /// SELECT MANUALLY HOUR AND MINUTE
    $(function () {
        $("#sel_hour").selectmenu({
            change: function (event, data) {
                setHour(data.item.value)
            }
        });

        $("#sel_minute").selectmenu({
            change: function (event, data) {
                setMinute(data.item.value)
            }
        });
    });


    $('#prova').bind({
        click: function () {
            console.log(config['hour'], config['minute']);
            setHour(config['hour']['value'] + 1, 'fade');
        },
    });

    $('#provaM').bind({
        click: function () {
            // console.log(config['hour'], config['minute']);
            setMinute((config['minute']['value'] + 1)%60);
        },
    });

    $("#toggle_manual").click(function () {
        $("fieldset").slideToggle();
    }); $("fieldset").slideToggle();
    
    $("#startstop_cloch").click(function () {
        if(stopCloch) {
            var str = 'Stop';
            stopCloch = false;
        }
        else {
            var str = 'Start';
            stopCloch = true;
        }
        $(this).html(str);
    });
    
    // $('#provaa').bind({
    //     click: function () {
    //         console.log(config['hour'], config['minute']);
    //         ca = hours.indexOf(config['hour']['value']) + 1 % 6;
    //     },
    // });
    
    // $('#prova2').bind({
    //     click: function () {
    //         console.log(config['hour'], config['minute']);
    //         setHour(config['hour']['value'] + 1, 'move');
    //     },
    // });
    
    // $('#prova0').bind({click: function () {setHour(0, 'fade');}});
    // $('#prova1').bind({click: function () {setHour(1, 'fade');}});
    // $('#prova2').bind({click: function () {setHour(2, 'fade');}});
    // $('#prova3').bind({click: function () {setHour(3, 'fade');}});
    // $('#prova4').bind({click: function () {setHour(4, 'fade');}});
    // $('#prova5').bind({click: function () {setHour(5, 'fade');}});
    
    // $('#prova0a').bind({click: function () {setHour(0, 'move');}});
    // $('#prova1a').bind({click: function () {setHour(1, 'move');}});
    // $('#prova2a').bind({click: function () {setHour(2, 'move');}});
    // $('#prova3a').bind({click: function () {setHour(3, 'move');}});
    // $('#prova4a').bind({click: function () {setHour(4, 'move');}});
    // $('#prova5a').bind({click: function () {setHour(5, 'move');}});
  
    // $('#provaM0').bind({click: function () {setMinute(0, 'move');}});
    // $('#provaM05').bind({click: function () {setMinute(5, 'move');}});
    // $('#provaM1').bind({click: function () {setMinute(10, 'move');}});
    // $('#provaM15').bind({click: function () {setMinute(15, 'move');}});
    // $('#provaM2').bind({click: function () {setMinute(20, 'move');}});
    // $('#provaM25').bind({click: function () {setMinute(25, 'move');}});
    // $('#provaM3').bind({click: function () {setMinute(30, 'move');}});
    // $('#provaM35').bind({click: function () {setMinute(35, 'move');}});
    // $('#provaM4').bind({click: function () {setMinute(40, 'move');}});
    // $('#provaM45').bind({click: function () {setMinute(45, 'move');}});
    // $('#provaM5').bind({click: function () {setMinute(50, 'move');}});
    // $('#provaM55').bind({click: function () {setMinute(55, 'move');}});

    
}
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
        
        // adding the minute to the conf
        config['minute'] = newMin;

        // 
        if (min == 0)
            var prec = minutes[11];
        else
            var prec = minutes[(newMin['indicator_index'] - 1) % 12];

        var first = minutes[newMin['indicator_index'] % 12],
            second = minutes[(newMin['indicator_index'] + 1) % 12];
       

        // indicators' animations
        TweenMax.fromTo(first, 8 * durationFade, {
                fill: minutesColors['first_start'][newMin['opacity_index']],
                delay: 2 * durationFade,
            }, {
                fill: minutesColors['first'][newMin['opacity_index']],
                delay: 2 * durationFade,
        });

        TweenMax.fromTo(second, 8 * durationFade, {
                fill: minutesColors['second_start'][newMin['opacity_index']],
                delay: 2 * durationFade,
            }, {
                fill: minutesColors['second'][newMin['opacity_index']],
                delay: 2 * durationFade,
        });


        // remove bg from other indicators
        for (i = 0; i < 12; i++)
            if (i != newMin['indicator_index'])
                if (i % 2 == 0) {
                    TweenMax.to(minutes[i], 8 * durationFade, {
                        fill: 'rgba(0,0,0,.1)',
                        delay: 0,
                    });
                }
        else {
            TweenMax.to(minutes[i], 8 * durationFade, {
                delay: 0,
                fill: 'rgba(0,0,0,.05)',
            });
        }
       
        // console.log(newMin);

    } else console.log('error: minutes can be [0..60]');
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
    // main cloch elements
    cloch = $('#cloch'),
    quadrant = $('#quadranthx'),
    background = $('#backgroundhx');
    
    // shows the cloch
    cloch.css({'opacity': '1'});
    
    
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

    // Minutes indicator color values 
    minutesColors = {
        // from < animation
        'first_start': ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255, 255, 255, .7)', 'rgba(255, 255, 255, .4)'], 
        'second_start': ['rgba(0,0,0,.1)', 'rgba(255,255,255,.1)', 'rgba(255,255,255,.4)', 'rgba(255, 255, 255, .4)', 'rgba(255, 255, 255, .7)'], 
        
        // to > animation
        'first': ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,.7)', 'rgba(255, 255, 255, .4)', 'rgba(255, 255, 255, .4)'], 
        'second': ['rgba(0,0,0,.1)', 'rgba(255,255,255,.4)', 'rgba(255,255,255,.4)', 'rgba(255, 255, 255, .7)', 'rgba(255, 255, 255, 1)'], 
    };

    
    ////// MAIN ///////////   
    
    // get url color if any
    config = getUrlVars();
    if (!config['color'])
        config['color'] = '#ff3c6d';
    changeColor(config['color'], 0);

    // gets new date starts adding to config file 
    date = new Date();
    config['hour'] = {'value': date.getHours()};
    config['minute'] = {'value': date.getMinutes()};
    setTimeout(function () {
        setHour(date.getHours());
        setMinute(date.getMinutes());
        // console.log('first AUTO cloch configuration: ', config);
    }, 0);
    
    // checks if there's any hour and minute in the url
    setInterval(function () {
        if (!stopCloch) {
            date = new Date();
            h = date.getHours();
            m = date.getMinutes();
            if (h != config['hour']['value'])
                setHour(h);
            if (m != config['minute']['value'])
                setMinute(m);
        }
        // console.log('AUTO cloch configuration: ', config, 'seconds:', first_minute ? ((60 - date.getSeconds()) * 1000) : 60000);
    }, 500);


    ////////// TO - DO //////////////////

    // x / menu per scegliere l'ora, cosi la si impara pure (magari integrata con l'url :Q )

    // bg esagonale, colori piatti, o al massimo tipo cartone come il quadrante

    // fare bottoncino show/hide delle info (da disegnare) tipo sulle ore, e sui minuti cosi da renderlo piu comprensibile all'inizio, tipo: numeri minuti e ore su cubo di cloch, fatte con div testo html font rubik e con tweenmax rotazione 3d. animazione sui numeri? creazione tracciato (drawsvg plugin?)? 
    
    // aumentare differenza opacità maschera sole intermedi. 
    
    // menu html5up liquid morph con: colore, opzioni, display cifre, sfondo etc
    
    //nell 'howto mettere il compare approssimato sui minuti tra orlogio e cloch
    
    //rivedere funzione aggiorna ora che cancella le altre allo stato iniziale se non servono

    // ora manuale, nelle select, automaticamente settata su quella attuale

    // implementare ora nell'url

    

    //// UI /////////////////////////////////////////////

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

    $("fieldset").hide();
    $("#toggle_manual").click(function () {
        $("fieldset").slideToggle();
        $("#sel_hour-button").html();
        $("#sel_hour-button").html();

        if (stopCloch) {
            var str = 'Stop';
            stopCloch = false;
        }
        else {
            var str = 'Start';
            stopCloch = true;
        }
        $("#startstop_cloch").html(str);
    });
    
    $("#startstop_cloch").click(function () {
        if(stopCloch) {
            var str = 'Stop';
            stopCloch = false;
        }
        else {
            var str = 'Start';
            stopCloch = true;
        }
        $("fieldset").slideUp();
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
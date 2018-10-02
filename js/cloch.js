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

function setMinute1(min, lazy = true) {
    if (min < 61) {
            // every minute is about 0.2, toFixed 1 decimal digits
        var newMinIndex = ((min / 5) % 12).toFixed(1),
            duration = 500;

            //  separate floor (indicator pos.) from decimal (opacity lev.)
            newMin = newMinIndex.toString().split('.');
            newMinIndicator = minutes[newMin[0]];
            newMinOpacity = minutesStateLazy[newMin[1]];
        
        TweenMax.to(newMinIndicator, duration, {
            delay: 0,
            ease: Power3.easeInOut,
            opacity: newMinOpacity,
            css: {fill: 'red'},
        });
        console.log(newMin);


    } else console.log('error: minutes can be [0..60]');
}

function setMinute(min, lazy=true) {
    if(min < 61) {
        // var minOpacity = lazy ? minutesStateLazy : minutesState;
        // console.log('lazy = ', lazy, '\nopacity levels:', minOpacity);

        // a minute is about 0.2, toFixed gives 1 dec digit,tmp to string,separate dec from floor
        var tmp = ((min / 5) % 12).toFixed(1).toString().split('.'),
        
        // to int and normalize newMin[1] for index opacity ranges [0..3] levels
        newMin = {'value' : min};
        newMin['indicator_index'] = parseInt(tmp[0]);
        newMin['opacity_index'] = tmp[1] / 2;
        console.log('minopacity:', newMin['opacity_index']);
        config['minute'] = newMin;
        
        //     delay: 0,
        //     ease: Power3.easeInOut,
        TweenMax.from(minutes[newMin['indicator_index']], 7 * durationFade, {
            fill: 'rgba(255,255,255,0)',
        });
        TweenMax.from(minutes[(newMin['indicator_index'] + 1) % 12], 7 * durationFade, {
            fill: 'rgba(255,255,255,0)',
        });
        TweenMax.to(minutes[newMin['indicator_index']], 7 * durationFade, 
        // {
        //     fill: 'rgba(255,255,255,0)',
        //     delay: 7 * durationFade,
        //     ease: Bounce.easeOut,
        //     // strokeWidth: "0px",
        // },
        {
            fill: 'rgba(255,255,255,' + minutesState['first'][newMin['opacity_index']] + ')',
            delay: 2 * durationFade,
            ease: Bounce.easeOut,
            // strokeWidth: ".5px",
            // stroke: "rgba(255,255,255,.1)",
        });
        TweenMax.to(minutes[(newMin['indicator_index'] + 1) % 12], 7 * durationFade, 
        // {
        //     fill: 'rgba(255,255,255,0)',
        //     delay: 7 * durationFade,
        //     ease: Bounce.easeOut,
        //     // strokeWidth: "0px",
        // },
        {
            fill: 'rgba(255,255,255,' + minutesState['second'][newMin['opacity_index']] + ')',
            delay: 2 * durationFade,
            ease: Bounce.easeOut,
            // strokeWidth: ".5px",
            // stroke: "rgba(255,255,255,.1)",
        });


        // remove bg from other indicators
        for(i=0; i<12; i++)
            if(i != newMin['indicator_index'])
                minutes[i].css({'fill': ''})

        console.log(newMin);
        
    }
    else console.log('error: minutes can be [0..60]');
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

    
    // Minutes opacity lazy values, 90% or 30% 
        // es 5min, 2 'triangles' indicators (angle and middle) with 2 (lazy) states 
        // [0]: A=90, 
        // [1,2]: [A=90, M=30],
        // [3,4]: [A=30, M=90],
        // [5]: M=90, 
    // minutesStateLazy = new Array(.9,.3,0);
    
    // Minutes opacity values 
       // es 5min, 2 'triangles' indicators (angle and middle) with 3 states 
       // [0]: A=100, 
       // [1]: [A=100, M=40],
       // [2]: [A=70, M=40],
       // [3]: [A=40, M=70],
       // [4]: [A=40, M=100],
       // restart [5]: M=100, ...
    minutesState = {'first': [1,1,.7,.4,.4], 'second': [0,.4,.4,.7,1]};
    
    // general duration fade used for relative timing and delay
    durationFade = .1

    config = getUrlVars();
    
    
    // main
    
    // sets sun in the center
    TweenMax.set(sunMoon[0], {
        x:-33.8, y:20,
        transformOrigin: "-33px 20px",
    });

    // prevent bad animation load page background color
    // TweenMax.set(cloch, {opacity:0,});   
    // TweenMax.to(cloch, 1 * durationFade, {
    //         opacity:1, 
    //         delay: 2 * durationFade,
    //         ease: Power3.easeOut,
    // });
        
    if (!config['color'])
        config['color'] = '#a4a';
    changeColor(config['color'],0);

    date = new Date();
    config['hour'] = {'value': date.getHours()};
    config['minute'] = {'value': date.getMinutes()};
    // setHour(config['currHour'], 'fade');
    
    setTimeout(function () {
        date = new Date();
        setHour(date.getHours());
        setMinute(date.getMinutes());
        console.log('AUTO cloch configuration: ', config);
    }, 0);
    



    ////////// TO - DO //////////////////
    // divisione 10 minuti: (4) -> 2.5m ma con due semitrasp (6) -> 1.6m 
    // sun/moon anche semitrasparente 0-6 semitr, 6-12 sole, 12-18 semitr, 18-0 luna

    /// AGGIUNGERE PIENA - ST .55, PIENA - ST .3 DIVENTANO 7 :(
    // lancetta minuti piena (L1 es. min 00) 1.0, L1 semitrasp .6 - L2 SemiTrasp .3, L2 piena, L2 ST - L3 semi; poi ricomincia L3 piena  

    // menu per scegliere l'ora, cosi la si impara pure (magari integrata con l'url :Q )

    // bg esagonale, colori piatti, o al massimo tipo cartone come il quadrante

    // far partire l'indicatore da trasparente (cosi non vedi che si aggiorna )
    // CREARE DIZIONARIO DI OPZIONI STANDARD COSI DA NON RIPETERLE TUTTE CAZZO

    // fare bottoncino show/hide delle info (da disegnare) tipo sulle ore, e sui minuti cosi da renderlo piu comprensibile all'inizio



    $('#prova').bind({
        click: function () {
            console.log(config['hour'], config['minute']);
            setHour(config['hour']['value'] + 1, 'fade');
        },
    });
    
    $('#provaM').bind({
        click: function () {
            console.log(config['hour'], config['minute']);
            setMinute((config['minute']['value'] + 1)%60);
        },
    });

    $('#provaa').bind({
        click: function () {
            console.log(config['hour'], config['minute']);
            ca = hours.indexOf(config['hour']['value']) + 1 % 6;
        },
    });
    
    $('#prova0').bind({click: function () {setHour(0, 'fade');}});
    $('#prova1').bind({click: function () {setHour(1, 'fade');}});
    $('#prova2').bind({click: function () {setHour(2, 'fade');}});
    $('#prova3').bind({click: function () {setHour(3, 'fade');}});
    $('#prova4').bind({click: function () {setHour(4, 'fade');}});
    $('#prova5').bind({click: function () {setHour(5, 'fade');}});
    
    $('#prova0a').bind({click: function () {setHour(0, 'move');}});
    $('#prova1a').bind({click: function () {setHour(1, 'move');}});
    $('#prova2a').bind({click: function () {setHour(2, 'move');}});
    $('#prova3a').bind({click: function () {setHour(3, 'move');}});
    $('#prova4a').bind({click: function () {setHour(4, 'move');}});
    $('#prova5a').bind({click: function () {setHour(5, 'move');}});
  
    $('#provaM0').bind({click: function () {setMinute(0, 'move');}});
    $('#provaM05').bind({click: function () {setMinute(5, 'move');}});
    $('#provaM1').bind({click: function () {setMinute(10, 'move');}});
    $('#provaM15').bind({click: function () {setMinute(15, 'move');}});
    $('#provaM2').bind({click: function () {setMinute(20, 'move');}});
    $('#provaM25').bind({click: function () {setMinute(25, 'move');}});
    $('#provaM3').bind({click: function () {setMinute(30, 'move');}});
    $('#provaM35').bind({click: function () {setMinute(35, 'move');}});
    $('#provaM4').bind({click: function () {setMinute(40, 'move');}});
    $('#provaM45').bind({click: function () {setMinute(45, 'move');}});
    $('#provaM5').bind({click: function () {setMinute(50, 'move');}});
    $('#provaM55').bind({click: function () {setMinute(55, 'move');}});

    
}







    /////// ANIMATIONS ///////
  
    // MAYBE ANOTHER JS FOR ANIMATIONS??

    //// BOX
    // var clochCenter = TweenMax.set(cloch, {
    //     x: 450,
    //     y: 150,
    // });


    // var quadrantFall = TweenMax.from(quadrant, .5, {
    //     delay: .5,
    //     yPercent: -20,
    //     scale: .8,
    //     opacity: 0,
    //     ease: 'Power3.easeOut',
    //     transformOrigin: "50% 50%",
    // });
 
    // // BOX
    // var boxFall = TweenMax.from(box, .5, {
    //     delay: 1,
    //     yPercent: -300,
    //     scale: .5,
    //     opacity: 0,
    //     ease: 'Bounce.easeOut',
    //     transformOrigin: "50% 50%",
    // });

    // //// LETTERS
    // // stripes
    // var stripesLetterMask_rise = TweenMax.from(stripe_letter_mask, 4, {
    //     delay: 1,
    //     yPercent: 150,
    //     ease: Power4.easeOut,
    //     transformOrigin: "50% 50%",
    // });


    // // logos
    // var logosAppearing = TweenMax.staggerFrom(logos, 1, {
    //     delay: 3.5,
    //     scale: 0,
    //     ease: Elastic.easeOut,
    //     transformOrigin: "50% 50%",
    // }, .2);

    // // FRAME
    // var circleFrame = TweenMax.from(circle_frame, 1.5, {
    //     delay: 7,
    //     scale: .8,
    //     ease: Elastic.easeOut,
    //     transformOrigin: "50% 50%",
    // });

    // var circleFrame = TweenMax.to(circle_frame, 2.4, {
    //     delay: 7,
    //     opacity: 1,
    // });

    // // AFTER
    // var wobblyLetters = TweenMax.staggerTo(letters, .7, {
    //     delay: 4.5,
    //     rotation: 2.5,
    //     yPercent: -5,
    //     repeat: 3,
    //     ease: SlowMo.easeOut,
    //     yoyo: true,
    //     transformOrigin: "50% 50%",
    // }, .25);

    // var smoothscrollAnim = TweenMax.to(smoothscroll, .5, {
    //     delay: 6,
    //     opacity: 1,
    //     transformOrigin: "50% 50%",
    // });

// })
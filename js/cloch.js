// document.addEventListener('DOMContentLoaded', function() {
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function changeColor(color) {
    var backgroundColorChange = TweenMax.to(background, .5, {
        delay: 0,
        transformOrigin: "50% 50%",
        css: {fill: color},
    });
    var maskColorChange = TweenMax.to(sunMoon[2], .5, {
        delay: 0,
        transformOrigin: "50% 50%",
        css: {fill: color},
    });

    //     colorpicker = $("colorpicker");
    //     colorpicker.value = color.replace('#', '');
    //     colorpicker.style.backgroundColor = color;
}

function moveSun(hour, style) {
    hours = new Array([-33.8, -19], [0, 0], [0, 40], [-33.8, 58], [-67, 38], [-67, 0]);
    var hourXY = hours[hour % 6],
        transl = "translate(" + hourXY[0] + 'px, ' + hourXY[1] + "px)",
        duration = 1;
        durationFade = .1;

    if(style == 'fade'){
        TweenMax.from(sunMoon[0], 4 * durationFade, {
            // css: { scale: 2 },
            transformOrigin: "0% 0%",
            delay: 0,
        });
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
            delay: 4 * durationFade,
            opacity: 1,
            ease: Bounce.easeOut,
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

    config['hourXY'] = hourXY;
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
    quadrant = $('#quadranthx'),
    background = $('#backgroundhx'),
    // MINUTES ANGLE: IN POSITIONS H%6 = 0, like - if they were extact - 0, 10, 20, 30, 50, 60m in clockwise order
    minAngle = [$('#minAng_top'), $('#minAng_topR'), $('#minAng_bottomR'), $('#minAng_bottom'), $('#minAng_bottomL'), $('#minAng_topL')],
    // MINUTES MIDDLE: IN MIDDLE POSITIONS, like - if they were extact - 5, 15, 25, 35, 45, 55 in clockwise order
    minMid = [$('#minMid_rightT'), $('#minMid_right'), $('#minMid_rightB'), $('#minMid_leftB'), $('#minMid_left'), $('#minMid_leftT')],
    // indicator, sun and moon mask. sunMoon[2].opacity=0 -> sun; sunMoon[2].opacity=0 -> moon
    sunMoon = [$('#sunmoon_indicator'), $('#sun'), $('#moon_mask')],
    // sort of a false perspective cube on the center of the quadrant
    cubex = [$('#cubex_top'), $('#cubex_left'), $('#cubex_right')];
    hours = new Array([-33.7, -19], [0, 0], [0, 40], [-33.8, 58], [-71, 40], [-67, 0]);

    config = getUrlVars();
    
    
    
    // main
    
    // sets sun in the center for initial animation
    TweenMax.set(sunMoon[0], {
        x:-33.8, y:20, opacity:1,
        // css: { transfom: "scale(1px)"},
        transformOrigin: "-33px 20px",
    });
      
    if (!config['color'])
        config['color'] = '#aaa';
    changeColor(config['color']);

    setTimeout(function () {
        date = new Date();
        moveSun(date.getHours(), 'fade');
        console.log('auto ora', date.getHours());
    }, 1000);
    
    date = new Date();
    config['actHour'] = date.getHours();
    console.log('ora', date.getHours());
    // moveSun(config['actHour'], 'fade');

    ////////// TO - DO //////////////////
    // divisione 10 minuti: (4) -> 2.5m ma con due semitrasp (6) -> 1.6m 
    // sun/moon anche semitrasparente 0-6 semitr, 6-12 sole, 12-18 semitr, 18-0 luna

    /// AGGIUNGERE PIENA - ST .55, PIENA - ST .3 DIVENTANO 7 :(
    // lancetta minuti piena (L1 es. min 00) 1.0, L1 semitrasp .6 - L2 SemiTrasp .3, L2 piena, L2 ST - L3 semi; poi ricomincia L3 piena  

    // menu per scegliere l'ora, cosi la si impara pure (magari integrata con l'url :Q )

    // bg esagonale, colori piatti, o al massimo tipo cartone come il quadrante

    // far partire l'indicatore da trasparente (cosi non vedi che si aggiorna )
    // CREARE DIZIONARIO DI OPZIONI STANDARD COSI DA NON RIPETERLE TUTTE CAZZO

    

    $('#prova').bind({
        click: function () {
            /// non funziona ma stic..
            console.log(config['actHour'],hours.indexOf(config['actHour']), config['actHour']);
            ca = hours.indexOf(config['actHour']) + 1 % 6;
            moveSun(ca, 'move');
            console.log(ca, hours.indexOf(config['actHour']));
        },
    //     mouseover: function () {
    //         $("body").css("background-color", "#E9E9E4");
    //     },
    //     mouseout: function () {
    //         $("body").css("background-color", "#FFFFFF");
    //     }
    });
    
    $('#provaa').bind({
        click: function () {
            
            console.log(config['hour'],hours.indexOf(config['hour']), config['hour']);
            ca = hours.indexOf(config['hour']) + 1 % 6;
            moveSun(ca,'move');
            console.log(ca, hours.indexOf(config['hour']));
        },
    });
    
    $('#prova1').bind({click: function () {moveSun(1, 'fade');}});
    $('#prova2').bind({click: function () {moveSun(2, 'fade');}});
    $('#prova3').bind({click: function () {moveSun(3, 'fade');}});
    $('#prova4').bind({click: function () {moveSun(4, 'fade');}});
    $('#prova5').bind({click: function () {moveSun(5, 'fade');}});
    $('#prova6').bind({click: function () {moveSun(6, 'fade');}});
    
    $('#prova1a').bind({click: function () {moveSun(1, 'move');}});
    $('#prova2a').bind({click: function () {moveSun(2, 'move');}});
    $('#prova3a').bind({click: function () {moveSun(3, 'move');}});
    $('#prova4a').bind({click: function () {moveSun(4, 'move');}});
    $('#prova5a').bind({click: function () {moveSun(5, 'move');}});
    $('#prova6a').bind({click: function () {moveSun(6, 'move');}});


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
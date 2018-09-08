// document.addEventListener('DOMContentLoaded', function() {
window.onload = function () {
    cloch = $('#cloch'),
    quadrant = $('#quadranthx'),
    background = $('#background'),
    // MINUTES ANGLE: IN POSITIONS H%6 = 0, like - if they were extact - 0, 10, 20, 30, 50, 60m in clockwise order
    minAngle = [$('#minAng_top'), $('#minAng_topR'), $('#minAng_bottomR'), $('#minAng_bottom'), $('#minAng_bottomL'), $('#minAng_topL')],
    // MINUTES MIDDLE: IN MIDDLE POSITIONS, like - if they were extact - 5, 15, 25, 35, 45, 55 in clockwise order
    minMid = [$('#minMid_rightT'), $('#minMid_right'), $('#minMid_rightB'), $('#minMid_leftB'), $('#minMid_left'), $('#minMid_leftT')],
    // indicator, sun and moon mask. sunMoon[2].opacity=0 -> sun; sunMoon[2].opacity=0 -> moon
    sunMoon = [$('#sunmoon_indicator'), $('#sun'), $('#moon_mask')],
    // sort of a false perspective cube on the center of the quadrant
    cubex = [$('#cubex_top'), $('#cubex_left'), $('#cubex_right')],
    ;


    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    function changeColor(color) {
        exagon.animate({
            fill: color
        }, 10);
        background.animate({
            fill: color
        }, 10);
        colorpicker = $("colorpicker");
        colorpicker.value = color.replace('#', '');
        colorpicker.style.backgroundColor = color;
    }

    // divisione 10 minuti: (4) -> 2.5m ma con due semitrasp (6) -> 1.6m 
    // sun/moon anche semitrasparente 0-6 semitr, 6-12 sole, 12-18 semitr, 18-0 luna

    /// AGGIUNGERE PIENA - ST .55, PIENA - ST .3 DIVENTANO 7 :(
    // lancetta minuti piena (L1 es. min 00) 1.0, L1 semitrasp .6 - L2 SemiTrasp .3, L2 piena, L2 ST - L3 semi; poi ricomincia L3 piena  

    // maschera sole ad esagono
    // bg esagonale, colori piatti, o al massimo tipo cartone come il quadrante

    function updateCloch(hour, minute) {
        $('#sunmoon_indicator').animate({
            'opacity': '320'
            }, {
                step: function (now, fx) {
                    $(this).css({
                        "transform": "translate3d(0px, " + now + "px, 0px)"
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
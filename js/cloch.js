  ////////// TO - DO //////////////////

  // ***** ripulire file in API/main da poter essere riutilizzato
  // ***** non usare pickr, fare i bottoni html con flex e usare la funzione di binding in fondo (cosi da usare bottone tavolozza sempre)
  
  // bg esagonale, colori piatti, o al massimo tipo cartone come il quadrante

  // show/hide delle info da disegnare sulle ore, e sui minuti cosi da renderlo piu comprensibile all'inizio, tipo: numeri minuti e ore su cubo di cloch, fatte con div testo html font rubik e con tweenmax rotazione 3d. animazione sui numeri? creazione tracciato (drawsvg plugin?)? 

  // nell 'howto mettere il compare approssimato sui minuti tra orlogio e cloch

  // rivedere funzione aggiorna ora che cancella le altre allo stato iniziale se non servono

  // implementare ora nell'url

  // lampeggio su cloch in pausa

  // fare lightmode automatico per colori chiari di sfondo

  // fare versione con minuti relativi (minuto 0 parte da dove sta l'indicatore ore), Va mostrato che la modalita' e' diversa


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
          // durationFade = .1,
          mask_opacity = '';

      // adding hour to the conf
      config['hour'] = hour;
      config['theme'] = 'light';

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
      } else
      if (style == 'move') {
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

  function setMinute(min, theme = 'light') {
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

          // cloch indicators in a thorus previous indicator, fix
          if (min == 0)
              var prec = minutes[11];
          else
              var prec = minutes[(newMin['indicator_index'] - 1) % 12];

          // the base indicator and its next one
          var first = minutes[newMin['indicator_index'] % 12],
              second = minutes[(newMin['indicator_index'] + 1) % 12];

          // indicators' animations
          if (theme == 'light') {
              // LIGHT MODE base indicator
              TweenMax.fromTo(first, 8 * durationFade, {
                  fill: minutesColors['first_start'][newMin['opacity_index']],
                  delay: 2 * durationFade,
              }, {
                  fill: minutesColors['first'][newMin['opacity_index']],
                  delay: 2 * durationFade,
              });
              // next indicator
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
                              fill: 'rgba(0,0,0,.07)',
                              delay: 0,
                          });
                      }
              else {
                  TweenMax.to(minutes[i], 8 * durationFade, {
                      delay: 0,
                      fill: 'rgba(0,0,0,.04)',
                  });
              }
          } else if (theme == 'dark') {
              // DARK MODE base indicator
              TweenMax.fromTo(first, 8 * durationFade, {
                  fill: minutesColorsDark['first_start'][newMin['opacity_index']],
                  delay: 2 * durationFade,
              }, {
                  fill: minutesColorsDark['first'][newMin['opacity_index']],
                  delay: 2 * durationFade,
              });
              // next indicator
              TweenMax.fromTo(second, 8 * durationFade, {
                  fill: minutesColorsDark['second_start'][newMin['opacity_index']],
                  delay: 2 * durationFade,
              }, {
                  fill: minutesColorsDark['second'][newMin['opacity_index']],
                  delay: 2 * durationFade,
              });

              // remove bg from other indicators
              for (i = 0; i < 12; i++)
                  if (i != newMin['indicator_index'])
                      if (i % 2 == 0) {
                          TweenMax.to(minutes[i], 8 * durationFade, {
                              fill: 'rgba(0,0,0,.05)',
                              delay: 0,
                          });
                      }
              else {
                  TweenMax.to(minutes[i], 8 * durationFade, {
                      delay: 0,
                      fill: 'rgba(0,0,0,.02)',
                  });
              }
          }

          // change digital time in toolbar
          temp_min = config['minute']['value'];
          tmp_min = temp_min < 10 ? '0' + temp_min : temp_min;
          new_digital_time = config['hour']['value'] + ':' + tmp_min;
          $("#digital_clock").html(new_digital_time);


          if (config['debug']) {
              console.log("new minute: ", min);
          }

      } else console.log('error: minutes can be [0..60]');
  }

  window.onload = function () {
      // main cloch elements
      cloch = $('#cloch'),
          quadrant = $('#quadranthx'),
          background = $('#backgroundhx');

      // shows the cloch
      cloch.css({
          'opacity': '1'
      });


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
      minutesColorsDark = {
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


      ////// MAIN ///////////   

      // get url color if any
      config = getUrlVars();
      if (!config['color'])
          config['color'] = '#ff3c6d';
      changeColor(config['color'], 0);

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
          setMinute(date.getMinutes());

          if (config['debug']) {
              console.log("AUTO time set: ", config['hour'], ":", config['minute']);
          }

      }, 0);

      changeTheme = function changeTheme(theme) {        
          $('body').attr('class', theme);
          $('#grad').attr('class', theme);

          // minutes
          if (theme == 'dark') {
              setMinute(config['minute']['value'], 'dark');
              // hours
              TweenMax.to(sunMoon[1], .5, {
                  fill: '#040404',
                  ease: Power2.easeOut,
              });
              for(i=0; i<3; i++)
                TweenMax.to(cubex[i], .5, {
                    fill: 'rgba(0,0,0,.75)',
                    ease: Power2.easeOut,
                });
            
            $('#toolbar i.fa').switchClass("light", "dark", 1000, "easeInOutQuad");

            } else if (theme == 'light') {
                setMinute(config['minute']['value'], 'light');
                // hours
                TweenMax.to(sunMoon[1], .5, {
                    fill: '#ffffff',
                    ease: Power2.easeOut,
                });
            for(i=0; i<3; i++)
                TweenMax.to(cubex[i], .5, {
                    fill: '#000000',
                    ease: Power2.easeOut,
                });

            $('#toolbar i.fa').switchClass("dark", "light", 1000, "easeInOutQuad");
          }
          config['theme'] = theme;
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
         $('div.pcr-button').css({ 'background': color})
         $('#browserColor').attr('content', color);
         $('#browserColorwp').attr('content', color);
         $('#browserColorap').attr('content', color);

          if (config['debug']) {
              console.log("new color", color);
          }
          config['color'] = color;
      }
      
      // color picker (pickr)
      const pickr = new Pickr({
          el: '#colorpicker',
          useAsButton: true,

          default: '#ff3c6d',

          swatches: [
              '#F44336',
              '#E91E63',
              '#9C27B0',
              '#673AB7',
              '#3F51B5',
              '#2196F3',
              '#4CAF50',
              '#8BC34A',
              '#CDDC39',
              '#FFEB3B',
              '#FFC107'
          ],

          components: {

              // preview: false,

              interaction: {
                  input: false,
                //   save: true,
              }
          },
      });

      $('div.pcr-app').css({
          'top': '0',
          'bottom': '50px',
      });

      function clochToggle() {
          if (stopCloch) {
              $("#startstop_cloch").attr('class', 'fa fa-pause');
              stopCloch = false;
          } else {
              $("#startstop_cloch").attr('class', 'fa fa-play');
              stopCloch = true;
          }
      }

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
              $("#control_buttons").fadeToggle();

              setTimeout(function () {
                  // button
                  if ($("#control_buttons").is(":hidden"))
                      $("#toolbarToggle").css('transform', 'rotate(0deg');
                  else
                      $("#toolbarToggle").css('transform', 'rotate(180deg)');
              }, 600);
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
                  setMinute(data.item.value)
              }
          });
      });

      $("#toggle_show").click(function () {
           $('#toggle_stop_menu').fadeToggle()

          if (config['debug']) {
              console.log("manual timing toggle");
          }
      });

      $("#startstop_cloch").click(function () {
          clochToggle();

          if (config['debug']) {
              console.log("start/stop toggled");
          }
      });

    //   picker/theme selector toggle show
    $('.pcr-button').click(function () {
        if ($('.pcr-app').is(":visible"))
            $('#theme_toggle').fadeToggle();
        
        if (config['debug']) {
            console.log("theme toggle");
        }
    });
    
    //   picker/theme selector toggle binding
    $('#theme_toggle').click(function () {
        config['theme'] == 'light' ? changeTheme('dark') : changeTheme('light');
    });
    
    
    // binds clicking pickr not working DAMN - magari rifare il selettore semplice cosi?
    $('div.swatches>button').click(function (e) {
        var color = $(e.target).css('color');
        changeColor(color);
    });


    // setup before start
    $('#toggle_stop_menu').hide()
    $('#control_buttons').hide()
    $('#theme_toggle').hide()

    // sets transition for background body and gradient after page loading
    $('body').css('transition', 'background .8s');
    // $('#grad').css('transition', 'background 1s');
    // $('#grad').css('transition-delay', '1s');

    setMinute(config['minute']['value'], config['theme']);
  }
window.onload = function () {
    // shows the cloch
    document.querySelector('#cloch').setAttribute('style', 'opacity: 1')

    // main cloch elements
    quadrant = document.querySelector('#quadranthx')
    background = document.querySelector('#backgroundhx')

    // UI elements
    toggle_toolbar = document.querySelector("#toggle_toolbar")
    subToolbars = document.querySelectorAll(".subtoolbar")
    toolbar_buttons = document.querySelector("#toolbar_buttons")
    toggle_theme = document.querySelector('#toggle_theme')
    toggle_palette = document.querySelector('#toggle_palette')
    palette = document.querySelector('#palette')
    paletteColors = document.querySelectorAll('#palette>#colors>li')
    toggle_digitalClock = document.querySelector("#toggle_digital_clock")
    toggle_hex_dodec = document.querySelector("#toggle_hex_dodec")
    digital_clock = document.querySelector('#digital_clock')
    toggle_clock_settings = document.querySelector("#toggle_clock_settings")
    clock_settings = document.querySelector('#clock_settings')
    startstop_cloch = document.querySelector("#startstop_cloch")
    manual_time_input = document.querySelector('#manual_time_input')
    helpToggles = document.querySelectorAll('.toggleHelp')
    helpPanel = document.querySelector('#help')

    // cloch.setAttribute('style', 'opacity: 1')

    ////// MAIN ////////////////////////////////////////////////////////////////////////////////////////////////////////

    // get url color if any
    config = getUrlVars()
    if (!config['color']) {
        // config['color'] = '#ff3c6d'
        config['color'] = 'rgb(255,60,109)'
        config['first_visit'] = true
    }
    if (!config['theme']) {
        config['theme'] = 'dark'
    }
    if (!config['hexCloch']) {
        config['hexCloch'] = true
    }
    else if (config['hexCloch'] != 'true') {
        config['hexCloch'] = false
        toggle_hex_dodec.classList.remove('hexCloch')
    }
    if (config['lang'] == 'en') {
        document.querySelector('body').classList.remove('it')
        document.querySelector('body').classList.add('en')
    } else {
        config['lang'] = 'it'
    }

    // gets new date starts adding to config file 
    date = new Date();
    config['hour'] = {
        'value': date.getHours()
    };
    config['minute'] = {
        'value': date.getMinutes()
    };

    setTimeout(function () {
        setHour(date.getHours(), config['hexCloch'])
        setMinute(date.getMinutes(), config['theme']);

        if (config['debug']) {
            console.log("AUTO time set: ", config['hour'], ":", config['minute'])
        }

    }, 0);

    changeColor(config['color'], 0) // 0 is to disable first animation on load
    toggleTheme(config['theme'] == 'dark' ? 'light' : 'dark') // default theme is dark...

    // checks if there's any hour and minute in the url
    setInterval(function () {
        if (!clochStopped) {
            date = new Date()
            h = date.getHours()
            m = date.getMinutes()
            if (h != config['hour']['value'])
                setHour(h, config['hexCloch'])
            if (m != config['minute']['value'])
                setMinute(m, config['theme'])
        }
        if (config['debug']) {
            console.log("AUTO update time: ", h, ":", m)
        }
    }, 500);


    //// UI /////////////////////////////////////////////
    toggle_toolbar.addEventListener('click', function () {
        blockUserInput(toggle_toolbar)
        toolbar_buttons.classList.toggle('hidden')
        // toggleView(toolbar_buttons)
        if (this.classList.contains('opened'))
            subToolbars.forEach(element => { // palette and clock settings
                hide(element)//.classList.add('hidden')
            })
        toggle_toolbar.classList.toggle('opened')
    });

    /// SELECT MANUALLY HOUR AND MINUTE
    toggle_clock_settings.addEventListener('click', function () {
        blockUserInput(toggle_clock_settings)
        toggleView(clock_settings) // .classList.toggle('hidden')
        hide(palette) //.classList.add('hidden')
    });

    toggle_digitalClock.addEventListener('click', function () {
        blockUserInput(toggle_digitalClock)
        toggle_digitalClock.classList.toggle('fa-eye')
        toggle_digitalClock.classList.toggle('fa-eye-slash')
        digital_clock.classList.toggle('hidden')

        if (config['debug']) {
            console.log("manual timing toggle")
        }
    });

    toggle_hex_dodec.addEventListener('click', function () {
        this.classList.toggle('hexCloch')
        config['hexCloch'] = Boolean(config['hexCloch']) ? false : true
        setHour(config['hour']['value'], config['hexCloch'])
        updateURL()
    })

    startstop_cloch.addEventListener('click', function () {
        blockUserInput(startstop_cloch)
        // stops the clock and, toggles 'disable' state to the input (you can change time only on pause)
        clochToggle();
        manual_time_input.disabled ^= true

        if (config['debug']) {
            console.log("start/stop toggled")
        }
    });

    // palette opening
    toggle_palette.addEventListener('click', function () {
        blockUserInput(toggle_palette)
        toggleView(palette) // .classList.toggle('hidden')
        hide(clock_settings) //.classList.add('hidden')

        if (config['debug']) {
            console.log("palette toggle")
        }
    });

    // palette changing colors
    paletteColors.forEach(element => {
        element.addEventListener('click', function (e) {
            changeColor(e.target.getAttribute('data-color'))
        })
        if (config['debug']) {
            console.log("palette color chaged to:", color)
        }
    })

    // theme toggle binding
    toggle_theme.addEventListener('click', function () {
        toggleTheme()
    });

    // help toggle
    helpToggles.forEach(element => {
        element.addEventListener('click', function () {
            blockUserInput(element)
            toggleView(helpPanel) //.classList.toggle('hidden')
            hide(palette) //.classList.add('hidden')
            hide(clock_settings) //.classList.add('hidden')
            document.body.classList.toggle('inactive')
        })
        if (config['debug']) {
            console.log("Help toggled")
        }
    })

    // ON FIRST RUN SHOWS THE HELP 
    if (config['first_visit']) {
        show(help)
        document.querySelector('body').classList.add('inactive')
    }

}
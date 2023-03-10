const COLORS = require('./colors')

module.exports = function() {
    const presets = {
        // ##########################
        // ####      System      ####
        // ##########################

        'system-powerOn': {
            type: 'button',
            category: 'System',
            name: 'Camera Power On',
            style: {
                text: 'Cam\nOn',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'camOn',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'system-powerOff': {
            type: 'button',
            category: 'System',
            name: 'Camera Power Off',
            style: {
                text: 'Cam\nOff',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'camOff',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'system-menuBack': {
            type: 'button',
            category: 'System',
            name: 'Menu On or Back Button',
            style: {
                text: 'Menu\n/Back',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'menuToggle',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'system-menuEnter': {
            type: 'button',
            category: 'System',
            name: 'Menu Enter Button',
            style: {
                text: 'Menu\nEnter',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'menuEnter',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },

        // ##########################
        // #### Pan/Tilt Presets ####
        // ##########################

        'panTilt-upLeft': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'UP LEFT',
            style: {
                text: '',
                png64: image_up_left,
                pngalignment: 'center:center',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLUE,
            },
            steps: [{
                down: [{
                    actionId: 'upLeft',
                    options: {},
                }, ],
                up: [{
                    actionId: 'stop',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-up': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'UP',
            style: {
                text: '',
                png64: image_up,
                pngalignment: 'center:center',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLUE,
            },
            steps: [{
                down: [{
                    actionId: 'up',
                    options: {},
                }, ],
                up: [{
                    actionId: 'stop',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-upRight': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'UP RIGHT',
            style: {
                text: '',
                png64: image_up_right,
                pngalignment: 'center:center',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLUE,
            },
            steps: [{
                down: [{
                    actionId: 'upRight',
                    options: {},
                }, ],
                up: [{
                    actionId: 'stop',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-left': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'LEFT',
            style: {
                text: '',
                png64: image_left,
                pngalignment: 'center:center',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLUE,
            },
            steps: [{
                down: [{
                    actionId: 'left',
                    options: {},
                }, ],
                up: [{
                    actionId: 'stop',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-right': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'RIGHT',
            style: {
                text: '',
                png64: image_right,
                pngalignment: 'center:center',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLUE,
            },
            steps: [{
                down: [{
                    actionId: 'right',
                    options: {},
                }, ],
                up: [{
                    actionId: 'stop',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-downLeft': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'DOWN LEFT',
            style: {
                text: '',
                png64: image_down_left,
                pngalignment: 'center:center',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLUE,
            },
            steps: [{
                down: [{
                    actionId: 'downLeft',
                    options: {},
                }, ],
                up: [{
                    actionId: 'stop',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-down': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'DOWN',
            style: {
                text: '',
                png64: image_down,
                pngalignment: 'center:center',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLUE,
            },
            steps: [{
                down: [{
                    actionId: 'down',
                    options: {},
                }, ],
                up: [{
                    actionId: 'stop',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-downright': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'DOWN RIGHT',
            style: {
                text: '',
                png64: image_down_right,
                pngalignment: 'center:center',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLUE,
            },
            steps: [{
                down: [{
                    actionId: 'downRight',
                    options: {},
                }, ],
                up: [{
                    actionId: 'stop',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-home': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'Home',
            style: {
                text: 'HOME',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'home',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-speedUp': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'Speed Up',
            style: {
                text: 'SPEED\\nUP',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'ptSpeedU',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-speedDown': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'Speed Down',
            style: {
                text: 'SPEED\\nDOWN',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'ptSpeedD',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'panTilt-speedDefault': {
            type: 'button',
            category: 'Pan/Tilt',
            name: 'Speed Default',
            style: {
                text: 'SPEED\\nDefault',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'ptSpeedS',
                    options: {
                        speed: '0C',
                    },
                }, ],
            }, ],
            feedbacks: [],
        },

        // ##########################
        // ####   Lens Presets   ####
        // ##########################

        'lens-zoomIn': {
            type: 'button',
            category: 'Lens',
            name: 'Zoom In',
            style: {
                text: 'ZOOM\\nIN',
                size: '12',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'zoomI',
                    options: {},
                }, ],
                up: [{
                    actionId: 'zoomS',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'lens-zoomOut': {
            type: 'button',
            category: 'Lens',
            name: 'Zoom Out',
            style: {
                text: 'ZOOM\\nOUT',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'zoomO',
                    options: {},
                }, ],
                up: [{
                    actionId: 'zoomS',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'lens-zoomCI': {
            type: 'button',
            category: 'Lens',
            name: 'CI Zoom',
            style: {
                text: 'CI\\nZOOM',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'ciZoom',
                    options: {
                        bol: 1,
                    },
                }, ],
                up: [{
                    actionId: 'ciZoom',
                    options: {
                        bol: 0,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'lens-focusNear': {
            type: 'button',
            category: 'Lens',
            name: 'Focus Near',
            style: {
                text: 'FOCUS\\nNEAR',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'focusN',
                    options: {},
                }, ],
                up: [{
                    actionId: 'focusS',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'lens-focusFar': {
            type: 'button',
            category: 'Lens',
            name: 'Focus Far',
            style: {
                text: 'FOCUS\\nFAR',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'focusF',
                    options: {},
                }, ],
                up: [{
                    actionId: 'focusS',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },
        'lens-focusAuto': {
            type: 'button',
            category: 'Lens',
            name: 'Auto Focus',
            style: {
                text: 'AUTO\\nFOCUS',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                    down: [{
                        actionId: 'focusM',
                        options: {
                            bol: 0,
                        },
                    }, ],
                },
                {
                    down: [{
                        actionId: 'focusM',
                        options: {
                            bol: 1,
                        },
                    }, ],
                },
            ],
            feedbacks: [],
        },
        'lens-opaf': {
            type: 'button',
            category: 'Lens',
            name: 'One Push Auto Focus',
            style: {
                text: 'O.P.\\nAF',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'focusOpaf',
                    options: {},
                }, ],
            }, ],
            feedbacks: [],
        },

        // ##########################
        // #### Exposure Presets ####
        // ##########################

        'exposure-autoManual': {
            type: 'button',
            category: 'Exposure',
            name: 'Auto / Manual Exposure Toggle',
            style: {
                text: 'AUTO\\Manual\\nExpose',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                    down: [{
                        actionId: 'expM',
                        options: {
                            val: 0,
                        },
                    }, ],
                },
                {
                    down: [{
                        actionId: 'expM',
                        options: {
                            val: 1,
                        },
                    }, ],
                },
            ],
            feedbacks: [],
        },
        'exposure-mode': {
            type: 'button',
            category: 'Exposure',
            name: 'Exposure Mode',
            style: {
                text: 'EXP\\nMODE',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'expM',
                    options: {
                        val: 0,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'exposure-gainUp': {
            type: 'button',
            category: 'Exposure',
            name: 'Gain Up',
            style: {
                text: 'GAIN\\nUP',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'gainU',
                }, ],
            }, ],
            feedbacks: [],
        },
        'exposure-gainDown': {
            type: 'button',
            category: 'Exposure',
            name: 'Gain Down',
            style: {
                text: 'GAIN\\nDOWN',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'gainD',
                }, ],
            }, ],
            feedbacks: [],
        },
        'exposure-irisUp': {
            type: 'button',
            category: 'Exposure',
            name: 'Iris Up',
            style: {
                text: 'IRIS\\nUP',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'irisU',
                }, ],
            }, ],
            feedbacks: [],
        },
        'exposure-irisDown': {
            type: 'button',
            category: 'Exposure',
            name: 'Iris Down',
            style: {
                text: 'IRIS\\nDOWN',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'irisD',
                }, ],
            }, ],
            feedbacks: [],
        },
        'exposure-shutterUp': {
            type: 'button',
            category: 'Exposure',
            name: 'Shutter Up',
            style: {
                text: 'Shut\\nUP',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'shutU',
                }, ],
            }, ],
            feedbacks: [],
        },
        'exposure-shutterDown': {
            type: 'button',
            category: 'Exposure',
            name: 'Shutter Down',
            style: {
                text: 'Shut\\nDOWN',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'shutD',
                }, ],
            }, ],
            feedbacks: [],
        },

        // #######################
        // #### Color Presets ####
        // #######################

        'color-wbModeAuto': {
            type: 'button',
            category: 'Color',
            label: 'White Balance Mode - Auto1',
            style: {
                text: 'WB\\nAuto1',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'whiteBal',
                    options: {
                        val: 0,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbModeAuto2': {
            type: 'button',
            category: 'Color',
            label: 'White Balance Mode - Auto2 (ATW)',
            style: {
                text: 'WB\\nAuto2',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'whiteBal',
                    options: {
                        val: 4,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbModeIndoor': {
            type: 'button',
            category: 'Color',
            label: 'White Balance Mode - Indoor',
            style: {
                text: 'WB\\nIndoor',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'whiteBal',
                    options: {
                        val: 1,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbModeOutdoor': {
            type: 'button',
            category: 'Color',
            label: 'White Balance Mode - Outdoor',
            style: {
                text: 'WB\\nOutdoor',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'whiteBal',
                    options: {
                        val: 2,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbModeManual': {
            type: 'button',
            category: 'Color',
            label: 'White Balance Mode - Manual',
            style: {
                text: 'WB\\nManual',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'whiteBal',
                    options: {
                        val: 5,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbModeCustom': {
            type: 'button',
            category: 'Color',
            label: 'White Balance Mode - Custom',
            style: {
                text: 'WB\\nCustom',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbCustom',
                    options: {
                        rVal: 192,
                        bVal: 192,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbModeOPWB': {
            type: 'button',
            category: 'Color',
            label: 'White Balance Mode - One push WB',
            style: {
                text: 'WB\\n1 Push',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'whiteBal',
                    options: {
                        val: 3,
                    },
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbOPWBTrigger': {
            type: 'button',
            category: 'Color',
            label: 'One push WB trigger (must be in One push WB mode)',
            style: {
                text: '1 Push\\nTrigger',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbTrigger',
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbRedGainUp': {
            type: 'button',
            category: 'Color',
            label: 'White Balance - Red Gain Up (must be in WB Manual)',
            style: {
                text: 'Red\\nGain\\nUp',
                size: '18',
                color: COLORS.PALE_RED,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbRedUp',
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbRedGainDown': {
            type: 'button',
            category: 'Color',
            label: 'White Balance - Red Gain Down (must be in WB Manual)',
            style: {
                text: 'Red\\nGain\\nDown',
                size: '18',
                color: COLORS.PALE_RED,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbRedDown',
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbBlueGainUp': {
            type: 'button',
            category: 'Color',
            label: 'White Balance - Blue Gain Up (must be in WB Manual)',
            style: {
                text: 'Blue\\nGain\\nUp',
                size: '18',
                color: COLORS.PALE_BLUE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbBlueUp',
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbBlueGainDown': {
            type: 'button',
            category: 'Color',
            label: 'White Balance - Blue Gain Down (must be in WB Manual)',
            style: {
                text: 'Blue\\nGain\\nDown',
                size: '18',
                color: COLORS.PALE_BLUE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbBlueDown',
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbOffsetReset': {
            type: 'button',
            category: 'Color',
            label: 'White Balance - Offset Reset',
            style: {
                text: 'WB\\nOffset\\nReset',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbOffsetReset',
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbOffsetUp': {
            type: 'button',
            category: 'Color',
            label: 'White Balance - Offset Up (more red)',
            style: {
                text: 'WB\\nOffset\\nUp',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbOffsetUp',
                }, ],
            }, ],
            feedbacks: [],
        },
        'color-wbOffsetDown': {
            type: 'button',
            category: 'Color',
            label: 'White Balance - Offset Down (more blue)',
            style: {
                text: 'WB\\nOffset\\nDown',
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                down: [{
                    actionId: 'wbOffsetDown',
                }, ],
            }, ],
            feedbacks: [],
        },
    }

    // ###############################
    // #### Camera Preset Presets ####
    // ###############################

    for (let i = 0; i < 64; i++) {
        var preset = {
            type: 'button',
            category: 'Presets',
            label: 'Preset ' + (i + 1),
            style: {
                text: 'Preset\\n' + (i + 1),
                size: '18',
                color: COLORS.WHITE,
                bgcolor: COLORS.BLACK,
            },
            steps: [{
                2000: [{
                    actionId: 'savePset',
                    options: {
                        val: ('0' + i.toString(16)).slice(-2).toUpperCase(),
                    },
                    delay: 0,
                }, ],
                down: [],
                up: [{
                    actionId: 'recallPset',
                    options: {
                        val: ('0' + i.toString(16)).slice(-2).toUpperCase(),
                    },
                    delay: 0,
                }, ],
            }, ],
            options: {
                runWhileHeld: [2000],
            },
            feedbacks: [],
        }
        presets['presets-Preset' + i] = preset
    }

    return presets
}

// Variables for Base64 image data do not edit
var image_up =
    'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIFJREFUKM+90EEKgzAQRmFDFy49ghcp5FquVPBighcRegHBjWDJ68D8U6F7m00+EnhkUlW3ru6rdyCV0INQzSg1zFLLKmU2aeCQQMEEJXIQORRsTLNyKJhNm3IoaPBg4mQorp2Mh1+00kKN307o/bZrpt5O/FlPU/c75X91/fPd6wPRD1eHyHEL4wAAAABJRU5ErkJggg=='

var image_down =
    'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIlJREFUKM/F0DEOwyAMBVAjDxk5Qo7CtdiClIv1KJF6gUpZIhXxY2zTDJ2benoS8LFN9MsKbYjxF2XRS1UZ4bCeGFztFmNqphURpidm146kpwFvLDYJpPQtLSLNoySyP2bRpoqih2oSFW8K3lYAxmJGXA88XMnjeuDmih7XA8vXvNeeqX6U6aY6AacbWAQNWOPUAAAAAElFTkSuQmCC'

var image_left =
    'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHpJREFUKM+1kTEOgCAQBM9Q2JjwA/mJPA2fxlN4giWF8TRBBhMpbKSaZie3i8gPb4Y8FNZKGm8YIAONkNWacIruQLejy+gyug1dQhfRqZa0v6gYA6QfqSWapZnto1B6XdUuFaVHoJunr2MD21nIdJYUEhLYfoGmP777BKKIXC0eYSD5AAAAAElFTkSuQmCC'

var image_right =
    'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHhJREFUKM+10LERgCAMQFE4CktHcBRWcRMYzVEcwdKCI+od+fGksVCq3/AuiXOfvZnaNXzRClVrEKtMLdSqP2RTRQAFMAFGwAlw7MAk0sAzGnhVoerLKg/F5Pv4NoFNZZNGpk9sxJYeLsDdL5T7S8IFOM/R3OZ+fQeQZV9pMy+bVgAAAABJRU5ErkJggg=='

var image_up_right =
    'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABhlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+X02G5AAAAgXRSTlMAAte32QZhZx7d+TywDTf8/d5VstYPOxULNvKmSY8TFBrxyeGCluJeELQ5uw7ULND4BedlKuv2P/vDA8UgCk30WO41s8+5X8dABAz6QhHVaR156JpPnihSfTJDNOMBm4bzSICqr23NsRjcGRbtjTCS2lzsOmyu9+WLKb2fTL8+RPDhqO4yAAABfElEQVRYw+3WZW/CUBQG4AO0FBsOwwcMm7sLc3d3d3e388/HGGs7lpD0tsm+9P3S5CT3SdPec+8BkCNHzv9FAVAAEABYdQDkA7jo9GNUIDMBzstb5vr0/Gx8Z35zOjI36R2xbu+619eWa2xCoK0FClF5h1cWxDHEwilEOyLlQc8hokoAlMRcESBh7siQlJBWKkijNaHuPrWBED9iYiDQ7Pv1D4Z4/DXyFo2JgeAghQEkEgAvT6IgNo/PIUmgd62oj80mqEIpINoXRkmg2j2UBDIWVXKLTSXEUIOF/xbV5aRQsJvvUOoqMqjZZ+c7FcX8ThYCtTbxHV0fkEGDA73D3Dpzi/6rWEYAdSn579PZ/t3IBJChkef0dLRlHXdkJ6TSmSnmiYPq1LQIiGHX9BvZYinJ7/+R6q1czUG0j9KSOTxDc6UhshZhMIQrS78mncwZtzErrNcYL6V2Zd0tJ6i7QFtAYPcvHv25W6J+/Y3BrRA/x6WGuGN5mpUjhyyfsGtrpKE95HoAAAAASUVORK5CYII='

var image_down_right =
    'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABXFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jYfXuAAAAc3RSTlMAQ98Ox1j9gAtRNTqBPfgu9p/MTQ+G1Qfx7Y0VBYyJgjkGd3ysU+Zz1IQvMM20PgwBp8Mi4TSUiDvlPxylsaF2WfcjJh0S+wLzQLmY4l/ovX3ra1rPLAOSKa4RUEvgcZwbFHqPzodGbX7qPMvCtsEq1laguT+HEwAAAVlJREFUWMPt1sduwkAQgOGxDfFCIITe0nvvvZHee++992TeX4pJQIC9hPWaQ6T41x6skfY7WGPJAGZm/6qgZjIH4AMgOp2Lq32batTkdW/trPt9+qC70DVmSKS2BXF7A1fX9DDnN2FUSpe8y5hID3SZuJMmrcwmoSFm5vD0BDWSNTnCUmZoD1PZtJCDGfIgRUpBMjPkR4rEAwUtFIkHAkKRuCCaxAdRJE5IK/FCGumWF1JLEW5ILfFD2ST9UBaJA6JLPBCQ57xAJcp5NQbtSgBReJSsH8QI5No8ODo+u397ecL3T35IGhcRA4jig8E9qmjAX2OGnAV5ggrxr0ELOaByVmg6B1TGvEYyTvxcKUaMv/ii7xN/VAZYY2dfSHkkPOYY7Kpf7OmLzLfGPIFGd6izWrRUjdYt9Xfo+ULsLpgRKqGtGyadAEIUmnuhXSAwMAXD5j+omZlZRl+X30CWTm2dHwAAAABJRU5ErkJggg=='

var image_up_left =
    'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABLFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PVkEkAAAAY3RSTlMAAQ/6Uc0OEAvHTzL7TcudsMHvdwnfUwMcG8UGiIfTrIkg9QI+/ZTDe460km73LNovCo1vQUuR4Lwk45/OK+3UERTkekziZlSK8QQnoOsFaaXmLqOylvPZLYDRZTUWUpiTDfAuEmiSAAABUklEQVRYw+3WZ2+DMBAG4EtTygrQ7NHsJt1777333vv+/38o6gIMSo0dqf3AK1lIZ/mRjPEJgCBBgvxtQr8WqDKbCiWUG1AnYXU7C7UJqKQSR5oKQwqIPphsYW24nEPjJCYXilf9F+G+qeTmThTP5w8X8gK9NLqOGMGPhD8fdXtBkGihlmlsmF5aqK2xg9FmQe3/DupuEhTpoT41z/V1HVHfxWRRo/6ORBfyjILx9mRo+2MDlS3ggF5q4uP9qzmVNjfOA+EDdDLcWA8IW6FJEJPkCbFI3hCDZEFVPsmC7mQuyYJ0iUuyIAG4JDvEJTkgHskJcUgExC6RECmxQ4REDa24ILsU6wL/rfYHskmX9C87Pfi9aA5cUmnRx/kffDmncSCkat7X342KSzOIuesNR1WSl7GU8Xfbbs9Gyoo0TvRp6Tie8d2TOsyx51UMEiQIS94B13oTqqYgGGoAAAAASUVORK5CYII='

var image_down_left =
    'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABg1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8aT76cAAAAgHRSTlMAafwJfflezc+3WA7Z5Rk6PAvpBNE73kJT89QxZ48czNIv9A1DnI3qKQUaymjT4a7HdVuGf85LR20CVHr+tLBlA0GvYSTYZEnbAcazNPX4yB4GrAgnmL6Bcj4qIVKIe8kdVadIEe27B90bOG/3Er1rYJq1wibyh+4Q5CMzRllMXDo5euMAAAGfSURBVFjD7dblUwJBGAbw5aSlBJRGQERBkLC7u7u7u7veP90jDnaEcdhjP+k9X5h9Zu43O7PLe4eQECH/KGsIaUooOEcLK75LpehH628idSrE+nMANfyQ3MY2BRm0C6mM462tUwJAJtVyUB1WmsoSFZEk46D6TBcYS3UKPpCYawxD5VxHImVD/RHIxMQbGintkGQcppkcOkuutQPYfkDfmjck556ZTSydve2YY5UWk0Mww672VPh+XFqCU8tA+whtL+KOpa+bF3Rh8B4ymDNaSnSzG9IPIpsL34/HTPZfS58auMPYuYNMWcQXOsD3U9ZDOkZkkCvqwSIqUI2WfEDmgiQxRANiIp8GKtDLO6/Znw19oOdXhKoROtEUBr1F5Y9f4dt1XygqKgh6YqcHwMQkQBWICr1H6czTgrpoQde0IGnekJEWNEwLMv/GPDDB/M/fDioVeLYA5GqoYt+xNRY4toJkCiBUG7vTEVxJu2Z549RbqXQuba7uVDZWO66mgw6d7kYaEPvvCb+REIp/srGzLP4aa0n8zKFkKUSIkD+Qb9QrYMvxAbaBAAAAAElFTkSuQmCC'
# Sony VISCA

This module uses the Sony VISCA protocol to control PTZ cameras.

**Please Note**: Not all Sony PTZ cameras support all VISCA commands. Please check the official "Technical Manual" of your exact model to see what commands it supports, in case one of the commands in this module is not working for you.

## Configuration

- Type in the IP address of the device.
- Type in the port of the device (default is 52381)
- You can also specify the Camera ID  
  (In most cases **id 1** is the best choice)

## Enabling VISCA over IP on your camera

Several Sony PTZ camera models do not enable VISCA over IP by default. On some models you can enable it using the on screen menu.

Most models have dip switches on the back of the cameras with descriptions of their functions on the bottom of the camera. In many cases, such as the "IMLE-FR7" setting switch three to the on position and re-powering the camera enables VISCA over IP.

Please refer to the manual for your camera for specific instructions.

## Actions Implemented

### Pan/Tilt Actions

- Pan Left
- Pan Right
- Tilt Up
- Tilt Down
- Up Left
- Up Right
- Down Left
- Down Right
- Pan/Tilt Stop
- Pan/Tilt Home
- Pan/Tilt Slow Mode
- Pan Speed (up/down/default)
- Tilt Speed (up/down/default)
- Pan/Tilt Speed (up/down/default)
- Set Pan and/or Tilt Speed
- Set Pan and Tilt Speed
- Pan/Tilt Reset
- Pan/Tilt Absolute Position
- Pan/Tilt Relative Move (degrees)
- Pan/Tilt Speed Type
- Ramp Curve
- Pan Reverse (on/off)
- Tilt Reverse (on/off)

### Lens Actions

- Zoom In - standard speed
- Zoom Out - standard speed
- Zoom In - variable speed
- Zoom Out - variable speed
- Zoom Stop
- Zoom In - High Resolution Speed (FR7/AM7)
- Zoom Out - High Resolution Speed (FR7/AM7)
- Zoom Stop - High Resolution (FR7/AM7)
- Zoom Mode (digital/optical/clear image)
- Zoom Mode Toggle (up to three modes)
- Zoom Speed (up/down/default)
- Focus Speed (up/down/default)
- Focus Mode (auto/manual)
- Focus Near - standard speed
- Focus Far - standard speed
- Focus Near - variable speed
- Focus Far - variable speed
- Focus Stop
- One Push Auto Focus
- Focus Infinity
- Focus Direct Position
- Zoom Direct Position
- Tele Convert (on/off)
- AF Mode (Normal/Interval/Zoom Trigger)
- AF Sensitivity (Normal/Low)
- AF Interval Time
- Focus Near Limit Direct
- Zoom Speed Type
- Lens Init

### Exposure Actions

- Exposure Mode (auto/manual/shutter/iris/gain/bright)
- Exposure Mode Toggle (between two modes)
- Iris Adjust (up/down)
- Set Iris
- Gain Adjust (up/down)
- Set Gain
- Shutter Adjust (up/down)
- Set Shutter
- Brightness Adjust (up/down)
- Set Brightness
- Exposure Compensation (on/off)
- Exposure Compensation (up/down/reset)
- Exposure Compensation Set Value
- Aperture Compensation (up/down/reset)
- Wide Dynamic Range (off/low/mid/high)
- Noise Reduction Level (off-strong)
- Backlight Compensation (on/off)
- Spotlight Compensation (on/off)
- Auto Slow Shutter (on/off)
- High Sensitivity (on/off)
- Low Light Basis Brightness (on/off)
- Basis Brightness Level
- Set Gain Limit
- Set Max Shutter
- Set Min Shutter
- Visibility Enhancer (on/off)
- Visibility Enhancer Settings
- AE Speed Direct
- Gain Point (on/off)
- Gain Point Position
- Defog (on/off with level)
- IR Correction (Standard/IR Light)
- 2D/3D Noise Reduction (separate)
- ND Filter Mode (FR7)
- ND Variable Adjust (FR7)
- ND Variable Direct (FR7)
- Auto ND Filter (FR7)
- ND Clear/Filtered (FR7)
- Auto Iris (FR7)
- Auto Shutter (FR7)
- AGC (FR7)

### Color Actions

- White Balance Mode (auto/indoor/outdoor/one push/ATW/manual)
- One push WB trigger
- White Balance Adjust (red/blue - up/down/reset)
- White Balance - Set custom values
- White Balance - Offset Adjust (up/down/reset)
- White Balance - Offset Direct
- White Balance Speed Direct
- Chroma Suppress
- Color Matrix Select
- Color Level Adjust (up/down/reset)
- Color Level Direct
- Color Gain Direct (per-color)
- Color Phase Adjust (up/down/reset)
- Color Phase Direct
- Color Hue Direct (per-color)
- Gamma Select
- Gamma Level Direct
- Knee Setting (on/off)
- Knee Mode (Auto/Manual)
- Detail Level Direct
- Detail Setting (on/off)
- Detail Sub-settings
- Black Level Adjust (up/down/reset)
- Black Level Direct
- Picture Profile Select
- Color Matrix Correction
- Gamma Pattern Direct
- Gamma Offset Direct
- Knee Slope Direct
- Knee Point Direct
- Black Gamma Level Direct
- Black Gamma Range
- Preset White Direct (FR7)
- Tint Direct (FR7)
- Offset Color Temp Direct (FR7)
- Offset Tint Direct (FR7)
- Master Black Direct (FR7)
- R Gain Direct (FR7)
- B Gain Direct (FR7)
- R Black Direct (FR7)
- B Black Direct (FR7)

### Camera Preset Actions

- Save Preset
- Recall Preset
- Preset Drive Speed (individual)
- Set Preset Selector
- Modify Preset Selector
- Preset Speed Select (Compatible/Separate/Common)
- Preset Drive Speed (common)
- Preset Mode (Mode1/Mode2/Trace)

### Miscellaneous Actions

- Camera Power (on/off)
- Tally
- Menu (on/off/enter)
- Video Latency (normal/low)
- Button Feedback (highlight/clear)
- Recording Button (press/release)
- Override VISCA ID (serial only)
- Flicker Cancel (on/off)
- Image Stabilizer (on/off/hold)
- High Resolution (on/off)
- ICR / Night Mode (on/off)
- Auto ICR (on/off)
- Image Flip (on/off)
- Color Bar (on/off)
- PTZ Trace
- Pan/Tilt Limit (set/clear)
- H Phase (up/down)
- H Phase Direct
- OSD On/Off
- Camera ID Direct
- HDMI Color Space
- Video Format Select
- Standby Mode
- Picture Effect
- IR Receive (on/off/toggle)
- Color System (HDMI/DVI)
- Information Display (on/off)
- Preset Call Mode (Freeze/Normal)
- Color Bar Overlay Name (on/off)
- Auto ICR Threshold Direct
- Tally Level Direct
- ND Filter
- HDMI Video Format
- Push AF / Push MF (FR7)
- PTZ Auto Framing
- Audio Level Control (FR7)
- Audio Input Level Direct (FR7)
- Audio Input Level Adjust (FR7)
- Display Button (FR7)
- Assignable Button (FR7)
- Direct Menu (FR7)
- Multi Selector (FR7/AM7)
- Multi Function Dial - Set (FR7/AM7)
- Multi Function Dial - Rotate (FR7/AM7)
- Preset Separate Duration (FR7)
- Preset Separate Mode (Speed/Duration)
- Custom Command - _If you use a custom command that may be a useful action for others please let us know at [Issues - Custom Commands #35](https://github.com/bitfocus/companion-module-sony-visca/issues/35)_

## Presets Implemented

### Pan/Tilt Presets

- Up
- Down
- Left
- Right
- Up Left
- Up Right
- Down Left
- Down Right
- Home
- Pan/Tilt Speed Up
- Pan/Tilt Speed Down
- Pan/Tilt Speed Default
- Pan/Tilt Slow Mode (normal/slow)
- Ramp Curve
- Go To Center (0°/0°)
- Pan Left 90°
- Pan Right 90°
- Tilt Up 45°
- Pan +10°
- Pan -10°
- Auto Framing Toggle

### Lens Presets

- Zoom In (variable speed)
- Zoom Out (variable speed)
- Zoom Mode Toggle
- Focus Far (variable speed)
- Focus Near (variable speed)
- Focus Mode - Auto/Manual
- One Push Auto Focus
- Push AF/MF (FR7)
- Zoom Speed Faster
- Zoom Speed Slower
- Zoom Speed Default (1)
- Focus Speed Faster
- Focus Speed Slower
- Focus Speed Default (1)

### Exposure Presets

- Exposure Mode Toggle
- Bright Mode (toggle with Auto)
- Iris Up
- Iris Down
- Gain Up
- Gain Down
- Shutter Up
- Shutter Down
- Brightness Up
- Brightness Down
- Exposure Compensation On/Off
- Exposure Compensation Up
- Exposure Compensation Down
- Exposure Compensation Reset
- Backlight Compensation On/Off
- Spotlight Compensation On/Off
- Low Light Basis Brightness On/Off

### Color Presets

- White Balance Mode - Auto1
- White Balance Mode - Auto2 (ATW)
- White Balance Mode - Indoor
- White Balance Mode - Outdoor
- White Balance Mode - Manual
- White Balance Mode - Custom
- White Balance Mode - One push WB
- WB Mode - ATW (FR7)
- WB Mode - Memory A (FR7)
- WB Mode - Preset (FR7)
- White Balance - Red Gain Up (must be in WB Manual)
- White Balance - Red Gain Down (must be in WB Manual)
- White Balance - Blue Gain Up (must be in WB Manual)
- White Balance - Blue Gain Down (must be in WB Manual)
- White Balance - Offset Up (more red)
- White Balance - Offset Down (more blue)
- White Balance - Offset Reset

### System Presets

- Camera Power On
- Camera Power Off
- Menu/Back Button
- Menu Enter Button
- Recording Button (press/release)
- Tally Red Toggle
- Tally Green Toggle (FR7)

### Camera Presets

- Presets 1-64 are available
- Tap to recall or hold for 2 seconds to save. When a camera preset button is held for 2 seconds, all camera preset buttons will highlight yellow indicating the preset is saved and you can let go.\*
- Presets using presetSelector variable
- Preset Selector Set, Increment and Decrement

### Rotation Enabled Presets

- Iris - tap to open iris
- Gain - tap to set to 0dB
- Shutter - tap for default (1/60 or 1/50)
- Brightness - tap for default (1/60 or 1/50)
- Exposure Compensation - tap to reset, hold to toggle
- Red Gain - tap for default (192)
- Blue Gain - tap for default (192)
- White Balance Offset - tap to reset
- Pan/Tilt Speed - tap for default
- Zoom Speed - tap for standard (1)
- Focus Speed - tap for standard (1)

_Rotation enabled presets are intended for devices like the Stream Deck+ and the Loupe Deck Live that have knobs. Rotate Left decreases the value, Rotate Right increases, and Tapping the knob defaults the setting._

## Variables Implemented

| Id                      | Name                                            |
| ----------------------- | ----------------------------------------------- |
| ptSlowMode              | Pan/Tilt Slow mode (slow/normal)                |
| rampCurve               | Ramp Curve (1-9)                                |
| lowLightBasisBrightness | Low Light Basis Brightness (on/off)             |
| basisBrightnessLevel    | Basis Brightness Level (4-10)                   |
| panSpeed                | Pan Speed                                       |
| tiltSpeed               | Tilt Speed                                      |
| zoomSpeed               | Zoom Speed                                      |
| focusSpeed              | Focus Speed                                     |
| zoomMode                | Zoom Mode (optical/digital/clr img)             |
| focusMode               | Focus Mode (auto/manual)                        |
| expMode                 | Exposure Mode                                   |
| expCompOnOff            | Exposure Compensation (on/off)                  |
| backlightComp           | Backlight Compensation (on/off)                 |
| spotlightComp           | Spotlight Compensation (on/off)                 |
| recordingStatus         | Recording status (unknown/standby/recording)    |
| ptzAutoFraming          | PTZ Auto Framing (on/off)                       |
| tallyRed                | Tally Red (on/off)                              |
| tallyGreen              | Tally Green (on/off)                            |
| tallyYellow             | Tally Yellow (on/off)                           |
| presetSelector          | Preset Selection Variable                       |
| lastPresetUsed          | Last Preset Recalled (1-64)                     |
| viscaId                 | Specific ViscaID to interact with (serial only) |
| lastCmdSent             | Last Command Sent (hex values)                  |
| panPosition             | Pan Position                                    |
| tiltPosition            | Tilt Position                                   |
| panDegrees              | Pan Position (degrees)                          |
| tiltDegrees             | Tilt Position (degrees)                         |
| panPositionBar          | Pan Position Bar                                |
| tiltPositionBar         | Tilt Position Bar                               |
| zoomRatio               | Zoom Ratio (e.g. 3.9x)                          |
| zoomPositionBar         | Zoom Position Bar                               |
| focusPositionBar        | Focus Position Bar                              |
| irisPositionBar         | Iris Position Bar                               |
| zoomPosition            | Zoom Position                                   |
| focusPosition           | Focus Position                                  |
| focusNearLimit          | Focus Near Limit                                |
| afMode                  | Auto Focus Mode                                 |
| afSensitivity           | Auto Focus Sensitivity                          |
| presetRecallExecuting   | Preset Recall Executing                         |
| focusCmdExecuting       | Focus Command Executing                         |
| zoomCmdExecuting        | Zoom Command Executing                          |
| wbMode                  | White Balance Mode                              |
| wbSpeed                 | White Balance Speed                             |
| detailLevel             | Detail Level                                    |
| colorMatrix             | Color Matrix                                    |
| irisLevel               | Iris Level                                      |
| gainLevel               | Gain Level                                      |
| shutterSpeed            | Shutter Speed                                   |
| redGain                 | Red Gain                                        |
| blueGain                | Blue Gain                                       |
| slowShutter             | Slow Shutter (auto/manual)                      |
| highResolution          | High Resolution (on/off)                        |
| ve                      | Visibility Enhancer (on/off)                    |
| expCompLevel            | Exposure Compensation Level                     |
| brightPosition          | Bright Position                                 |
| wideDynamic             | Wide Dynamic Range (on/off)                     |
| power                   | Power (on/off)                                  |
| flickerCancel           | Flicker Cancel (on/off)                         |
| IRCutFilterAuto         | IR Cut Filter Auto (auto/manual)                |
| imageStabilizer         | Image Stabilization (on/off)                    |
| IRCutFilter             | IR Cut Filter (on/off)                          |
| pictureEffectOn         | Picture Effect                                  |
| wbOffset                | White Balance Offset                            |
| cameraIdReported        | Camera ID (reported)                            |
| kneeMode                | Knee Mode (Manual/Auto)                         |
| kneeSlope               | Knee Slope                                      |
| kneeSetting             | Knee Setting (on/off)                           |
| kneePoint               | Knee Point                                      |
| afOpTime                | AF Operating Time                               |
| afStayTime              | AF Stay Time                                    |
| nr2dLevel               | 2D Noise Reduction Level                        |
| nr3dLevel               | 3D Noise Reduction Level                        |
| nrLevel                 | Noise Reduction Level                           |
| gamma                   | Gamma                                           |
| imageFlip               | Image Flip (on/off)                             |
| colorGain               | Color Gain                                      |
| aeSpeed                 | AE Speed                                        |
| highSensitivity         | High Sensitivity (on/off)                       |
| chromaSuppress          | Chroma Suppress Level                           |
| gainLimit               | Max Gain Limit                                  |
| blackLevel              | Black Level                                     |
| veLevel                 | Visibility Enhancer Level                       |
| blackGammaLevel         | Black Gamma Level                               |
| veBrightnessComp        | VE Brightness Compensation                      |
| gammaLevel              | Gamma Level                                     |
| veCompLevel             | VE Compensation Level                           |
| blackGammaRange         | Black Gamma Range                               |
| gammaOffset             | Gamma Offset                                    |
| minShutterSpeed         | Min Shutter Speed                               |
| maxShutterSpeed         | Max Shutter Speed                               |
| detailHVBalance         | Detail H/V Balance                              |
| detailCrispening        | Detail Crispening                               |
| detailLimit             | Detail Limit                                    |
| detailBWBalance         | Detail B/W Balance                              |
| detailHighlightDetail   | Detail Highlight Detail                         |
| detailSuperLow          | Detail Super Low                                |
| detailMode              | Detail Mode (Manual/Auto)                       |
| detailBandwidth         | Detail Bandwidth                                |
| colorHue                | Color Hue                                       |
| colorRG                 | Color Matrix R-G                                |
| colorRB                 | Color Matrix R-B                                |
| colorGR                 | Color Matrix G-R                                |
| colorGB                 | Color Matrix G-B                                |
| colorBR                 | Color Matrix B-R                                |
| colorBG                 | Color Matrix B-G                                |

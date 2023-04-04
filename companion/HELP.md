# Sony VISCA

This module uses the Sony VISCA protocol to control PTZ cameras.

**Please Note**: Not all Sony PTZ cameras support all VISCA commands. Please check the official "Technical Manual" of your exact model to see what commands it supports, in case one of the commands in this module is not working for you.

## Configuration

- Type in the IP address of the device.
- Type in the port of the device (default is 52381).
- You can also specify the Camera ID.

## Actions Implemented

### Pan/Tilt Actions

* Pan Left
* Pan Right
* Tilt Up
* Tilt Down
* Up Left
* Up Right
* Down Left
* Down Right
* Pan/Tilt Stop
* Pan/Tilt Home
* P/T Slow Mode
* Pan Speed (up/down/default)
* Tilt Speed (up/down/default)
* P/T Speed Up . . . . . . deprecated
* P/T Speed Down . . . . . . deprecated
* Pan and/or Tilt Speed Set
* P/T Speed Set . . . . . . deprecated

### Lens Actions

* Zoom In - standard speed
* Zoom Out - standard speed
* Zoom Stop
* Zoom Mode (digital/optical/clear image)
* Clear Image Zoom . . . . . . deprecated
* Focus Mode (auto/manual)
* Focus Near - standard speed
* Focus Far - standard speed
* Focus Stop
* One Push Auto Focus

### Exposure Actions

* Exposure Mode (auto/manual/shutter/iris/gain priority)
* Iris Adjust (up/down)
* Iris Up . . . . . . deprecated
* Iris Down . . . . . . deprecated
* Set Iris
* Gain Adjust (up/down)
* Gain Up . . . . . . deprecated
* Gain Down . . . . . . deprecated
* Set Gain
* Shutter Adjust (up/down)
* Shutter Up . . . . . . deprecated
* Shutter Down . . . . . . deprecated
* Set Shutter
* Brightness Adjust (up/down)
* Brightness Up . . . . . . deprecated
* Brightness Down . . . . . . deprecated
* Exposure Compensation On/Off
* Exposure Compensation (up/down/reset)
* Exposure Compensation Up . . . . . . deprecated
* Exposure Compensation Down . . . . . . deprecated
* Exposure Compensation Reset . . . . . . deprecated
* Exposure Compensation Set Value
* Aperture Compensation (up/down/reset)
* Wide Dynamic Range (off/low/mid/high)
* Noise Reduction Level (off-strong)
* Backlight Compensation (on/off)
* Spotlight Compensation (on/off)

### Color Actions

* White Balance Mode (auto/indoor/outdoor/one push/ATW/manual)
* Outdoor . . . . . . deprecated
* Indoor . . . . . . deprecated
* One push WB trigger
* White Balance Adjust (red/blue - up/down)
* White Balance - Red Gain Up . . . . . . deprecated
* White Balance - Red Gain Down . . . . . . deprecated
* White Balance - Blue Gain Up . . . . . . deprecated
* White Balance - Blue Gain Down . . . . . . deprecated
* White Balance - Set custom values
* White Balance - Red Set Value . . . . . . deprecated
* White Balance - Blue Set Value . . . . . . deprecated
* White Balance - Offset Adjust (up/down/reset)
* White Balance - Offset Up . . . . . . deprecated
* White Balance - Offset Down . . . . . . deprecated
* White Balance - Offset Reset . . . . . . deprecated

### Camera Preset Actions

* Save Preset
* Recall Preset
* Preset Drive Speed (individual)

### Miscellaneous Actions

* Camera Power (on/off)
* Power On Camera . . . . . . deprecated
* Power Off Camera . . . . . . deprecated
* Tally (on/off)
* Menu (on/off/enter)
* Menu/Back . . . . . . deprecated
* Menu Enter . . . . . . deprecated
* Video Latency (normal/low)
* Button Feedback (highlight/clear)
* Set Held Feedback On . . . . . . deprecated
* Clear Held Feedback . . . . . . deprecated
* Custom Command - *If you use a custom command that may be a useful action for others please let us know at [Issues - Custom Commands #35](https://github.com/bitfocus/companion-module-sony-visca/issues/35)*

## Presets Implemented

### Pan/Tilt Presets

* Up
* Down
* Left
* Right
* Up Left
* Up Right
* Down Left
* Down Right
* Home
* Speed Up
* Speed Down
* Speed Default

### Lens Presets

* Zoom In
* Zoom Out
* Zoom Mode
* Focus Near
* Focus Far
* Auto Focus
* One Push Auto Focus

### Exposure Presets

* Auto / Manual Exposure Toggle
* Exposure Mode
* Iris Up
* Iris Down
* Gain Up
* Gain Down
* Shutter Up
* Shutter Down
* Exposure Compensation On/Off
* Exposure Compensation Up
* Exposure Compensation Down
* Exposure Compensation Reset
* Backlight Compensation On/Off
* Spotlight Compensation On/Off

### Color Presets

* White Balance Mode - Auto1
* White Balance Mode - Auto2 (ATW)
* White Balance Mode - Indoor
* White Balance Mode - Outdoor
* White Balance Mode - Manual
* White Balance Mode - Custom
* White Balance Mode - One push WB
* One push WB trigger (must be in One push WB mode)
* White Balance - Red Gain Up (must be in WB Manual)
* White Balance - Red Gain Down (must be in WB Manual)
* White Balance - Blue Gain Up (must be in WB Manual)
* White Balance - Blue Gain Down (must be in WB Manual)
* White Balance - Offset Reset
* White Balance - Offset Up (more red)
* White Balance - Offset Down (more blue)

### System Presets

* Camera Power On
* Camera Power Off
* Menu/Back Button
* Menu Enter Button

### Camera Presets

* Presets 1-64 are available  
*Tap to recall or hold for 2 seconds to save. When a camera preset button is held for 2 seconds, all camera preset buttons will highlight yellow indicating the preset is saved and you can let go.*

### Rotation Enabled Presets

* Iris - tap to open iris
* Gain - tap to set to 0dB
* Shutter - tap for default (1/60 or 1/50)
* Exposure Compensation - tap to reset
* Red Gain - tap for default (192)
* Blue Gain - tap for default (192)
* White Balance Offset - tap to reset
* Pan/Tilt Speed - tap for default

*Rotation enabled presets are intended for devices like the Stream Deck+ and the Loupe Deck Live that have knobs. Rotate Left decreases the value, Rotate Right increases, and Tapping the knob defaults the setting.*

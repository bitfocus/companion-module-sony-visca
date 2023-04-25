# Sony VISCA

This module uses the Sony VISCA protocol to control PTZ cameras.

**Please Note**: Not all Sony PTZ cameras support all VISCA commands. Please check the official "Technical Manual" of your exact model to see what commands it supports, in case one of the commands in this module is not working for you.

## Configuration

- Type in the IP address of the device.
- Type in the port of the device (default is 52381).
- You can also specify the Camera ID.

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

### Lens Actions

- Zoom In - standard speed
- Zoom Out - standard speed
- Zoom In - variable speed
- Zoom Out - variable speed
- Zoom Stop
- Zoom Mode (digital/optical/clear image)
- Zoom Speed (up/down/default)
- Focus Speed (up/down/default)
- Focus Mode (auto/manual)
- Focus Near - standard speed
- Focus Far - standard speed
- Focus Near - variable speed
- Focus Far - variable speed
- Focus Stop
- One Push Auto Focus

### Exposure Actions

- Exposure Mode (auto/manual/shutter/iris/gain priority)
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

### Color Actions

- White Balance Mode (auto/indoor/outdoor/one push/ATW/manual)
- One push WB trigger
- White Balance Adjust (red/blue - up/down)
- White Balance - Set custom values
- White Balance - Offset Adjust (up/down/reset)

### Camera Preset Actions

- Save Preset
- Recall Preset
- Preset Drive Speed (individual)
- Modify Preset Selector

### Miscellaneous Actions

- Camera Power (on/off)
- Tally (on/off)
- Menu (on/off/enter)
- Video Latency (normal/low)
- Button Feedback (highlight/clear)
- Override VISCA ID (serial only)
- Custom Command - *If you use a custom command that may be a useful action for others please let us know at [Issues - Custom Commands #35](https://github.com/bitfocus/companion-module-sony-visca/issues/35)*

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

### Lens Presets

- Zoom In (variable speed)
- Zoom Out (variable speed)
- Zoom Mode
- Focus Far (variable speed)
- Focus Near (variable speed)
- Focus Mode - Auto/Manual
- One Push Auto Focus
- Zoom Speed Faster
- Zoom Speed Slower
- Zoom Speed Default (1)
- Focus Speed Faster
- Focus Speed Slower
- Focus Speed Default (1)

### Exposure Presets

- Auto/Manual Exposure Toggle
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

### Color Presets

- White Balance Mode - Auto1
- White Balance Mode - Auto2 (ATW)
- White Balance Mode - Indoor
- White Balance Mode - Outdoor
- White Balance Mode - Manual
- White Balance Mode - Custom
- White Balance Mode - One push WB
- One push WB trigger (must be in One push WB mode)
- White Balance - Red Gain Up (must be in WB Manual)
- White Balance - Red Gain Down (must be in WB Manual)
- White Balance - Blue Gain Up (must be in WB Manual)
- White Balance - Blue Gain Down (must be in WB Manual)
- White Balance - Offset Reset
- White Balance - Offset Up (more red)
- White Balance - Offset Down (more blue)

### System Presets

- Camera Power On
- Camera Power Off
- Menu/Back Button
- Menu Enter Button

### Camera Presets

- Presets 1-64 are available
- Tap to recall or hold for 2 seconds to save. When a camera preset button is held for 2 seconds, all camera preset buttons will highlight yellow indicating the preset is saved and you can let go.*
- Presets using presetSelector variable
- Preset Select Increment and Decrement

### Rotation Enabled Presets

- Iris - tap to open iris
- Gain - tap to set to 0dB
- Shutter - tap for default (1/60 or 1/50)
- Brightness - tap for default (1/60 or 1/50)
- Exposure Compensation - tap to reset
- Red Gain - tap for default (192)
- Blue Gain - tap for default (192)
- White Balance Offset - tap to reset
- Pan/Tilt Speed - tap for default
- Zoom Speed - tap for standard (1)
- Focus Speed - tap for standard (1)

*Rotation enabled presets are intended for devices like the Stream Deck+ and the Loupe Deck Live that have knobs. Rotate Left decreases the value, Rotate Right increases, and Tapping the knob defaults the setting.*

## Variables Implemented

| Id | Name |
|----|------|
| ptSlowMode | Pan/Tilt Slow mode (slow/normal) |
| panSpeed | Pan Speed |
| tiltSpeed | Tilt Speed |
| zoomSpeed | Zoom Speed |
| focusSpeed | Focus Speed |
| zoomMode | Zoom Mode (optical/digital/clr img) |
| focusMode | Focus Mode (auto/manual) |
| expMode | Exposure Mode |
| expCompOnOff | Exposure Compensation (on/off) |
| backlightComp | Backlight Compensation (on/off) |
| spotlightComp | Spotlight Compensation (on/off) |
| presetSelector | Preset Selection Variable |
| viscaId | Specific ViscaID to interact with (serial only) |
| lastCmdSent | Last Command Sent (hex values) |

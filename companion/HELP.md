# Sony Visca

This module uses the Sony Visca protocol to control PTZ cameras.

**Please Note**: Not all Sony PTZ cameras support all VISCA commands. Please check the official "Technical Manual" of your exact model to see what commands it supports, in case one of the commands in this module is not working for you.

## Configuration

- Type in the IP address of the device.
- Type in the port of the device (default is 52381).
- You can also specify the Camera ID.

## Available Actions

### Movement

- Pan Left
- Pan Right
- Tilt Up
- Tilt Down
- Up Left
- Up Right
- Down Left
- Down Right
- P/T Stop
- P/T Home
- P/T Speed
- P/T Speed Up
- P/T Speed Down
- P/T Slow Mode
- Zoom In
- Zoom Out
- Zoom Stop
- Clear Image Zoom
- Focus Near
- Focus Far
- Focus Stop
- Focus Mode (Auto or Manual)
- One Push Auto Focus

### Exposure

- Set Exposure Mode
- Gain Up
- Gain Down
- Set Gain
- Iris Up
- Iris Down
- Set Iris
- Shutter Up
- Shutter Down
- Set Shutter
- BackLight Compensation On/Off
- Aperture +,-,Reset
- Wide Dynamic Range (Off,Low,Mid,High)

### Color

- White Balance Modes - Auto1, Auto2, Indoor, Outdoor, Manual, One push WB
- One push White Balance trigger (must be in One Push WB mode)
- Adjust Red or Green Up or Down (must be in Manual WB mode)
- Offset - **adjust up** to make redder, **adjust down** to make bluer, or **reset** (works in Auto1, Auto2, or One Push WB modes)

### Camera Presets

- Save Preset
- Recall Preset
- Preset Drive Speed

### Misc

- Tally on/off
- Power Camera On/Off

## Companion Presets

- Pan/Tilt
- Lens - Zoom and Focus actions
- Exposure - Modes, Gain, Iris, Shutter)
- Color - White Balance modes, adjustments, trigger
- Presets - Dual function buttons, tap to recall or press for 2+ seconds to save.

**Note:** The implementation has changed since Companion 2.4.x. If you used "Cam Presets" in previous versions the recall function for those buttons works as expected but save function will no longer work. This can be fixed by replacing it with a new preset or by deleting the `savePsetLongPress` action from an existing button and adding a duration group with the action "Save Preset".

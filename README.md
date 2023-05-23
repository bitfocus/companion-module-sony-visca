# companion-module-sony-visca

This module uses the Sony Visca protocol to control PTZ cameras. While it is focused on features and protocols implemented in Sony cameras it does work with many other PTZ cameras that us the VISCA protocol over UDP.

- See [companion/HELP.md](https://github.com/bitfocus/companion-module-sony-visca/blob/master/companion/HELP.md) for features implemented and operational instructions.
- See [LICENSE](https://github.com/bitfocus/companion-module-sony-visca/blob/master/LICENSE)

## Changes

### v2.7.0

- Added selection of and some specific settings for ILME-FR7, ILME-FR7k, SRG-120DH, SRG-201SE, SRG-300SE, and SRG-301SE cameras.
- Fixed regression bug which affected new instances.

### v2.6.0

- Added Camera model and frame rate choices to config and updated actions to have correct Iris/Gain/Shutter values for each model/frame rate combination.

### v2.5.0

- Added clearer purpose in README.md
- Implemented a "viscaId" variable and an "Override VISCA ID" action to enable communications with multiple cameras from the same instance. This is a feature requested in issue #47.  
  **NOTE** It is expected that this feature only works with VISCA over serial. When communicating over IP the cameras ignore the VISCA Id

### v2.4.1

- Update dependency for better upgrade experience

### v2.4.0

- Add Preset handling using the variable presetSelector
- Improved regex validation for custom command

### v2.3.6

- Add Custom Command action
- Add variable speed zoom and focus actions and presets
- Add speed controls and variables for PTZF functions
- Add upgrade script to handle changes
- Rework actions and presets for consistency and preparing for new features
- Rework feedbacks, moved text updates to variables
- Updated documentation to include all implemented actions, presets, and variables

### v2.2.0

- Add Exposure Compensation actions and presets
- Add Spotlight Compensation On/Off
- Add Zoom Modes and preset to cycle through
- Add Noise Reduction action
- Add Latency selection action

### v2.1.0

- Add menu actions and presets
- Update Camera Preset presets to highlight and save when pressed for 2 seconds
- Add feedbacks for Auto Focus and Auto Iris
- Add rotation enabled presets for Stream Deck + and Loupe Deck knobs

### v2.0.0

- Compatible with Companion 3.x
- Feature parity with v1.2.12

### v1.2.12

- Add White Balance actions and presets

### v1.2.11

- Add dual function presets

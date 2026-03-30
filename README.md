# companion-module-sony-visca

This module uses the Sony Visca protocol to control PTZ cameras. While it is focused on features and protocols implemented in Sony cameras it does work with many other PTZ cameras that us the VISCA protocol over UDP.

- See [HELP.md](https://github.com/bitfocus/companion-module-sony-visca/blob/master/companion/HELP.md) for features implemented and operational instructions.
- See [LICENSE](https://github.com/bitfocus/companion-module-sony-visca/blob/master/LICENSE)

## How to Test

1. Go to the [Actions tab](https://github.com/bitfocus/companion-module-sony-visca/actions) on GitHub
2. Find the latest workflow run for the branch you want to test
3. Download the **pkg** artifact (it will save as `pkg.zip` containing the module `.tgz`)
4. Extract the `.tgz` file from the zip
5. In Companion, go to **Connections** and click the **Developer modules** button (bottom of the page, you may need to enable developer mode in the settings)
6. Install the `.tgz` file
7. Restart Companion if prompted

## Testing Needed

We've recently added per-model inquiry polling, new camera support, and protocol-accurate byte-level parsing for all supported camera families. Much of this was implemented from protocol documentation without hardware access. We need community help verifying behavior on cameras other than the BRC-X400.

### General Testing

If you have any of the following cameras, please test the module and report any issues with variables showing incorrect values, feedbacks not highlighting correctly, or unexpected log errors.

**Untested models:**

- BRC-X1000
- BRC-H780
- BRC-H800
- BRC-X401
- ILME-FR7 / ILME-FR7K
- SRG-A40 / SRG-A12
- SRG-X40UH / SRG-H40UH
- SRG-120DH
- SRG-201SE / SRG-300SE / SRG-301SE
- SRG-X120 / SRG-X400 / SRG-X402
- SRG-201M2 / SRG-HD1M2

### Specific Testing

**BRC-X1000 / BRC-H780 / BRC-H800 — Pan/tilt position**
The X1000 family uses 5-nibble (20-bit) pan coordinates with 4-nibble (16-bit) tilt, a mixed format unique to this family. Please verify:

1. Pan and tilt position variables update correctly as the camera moves
2. Pan and tilt position bars track smoothly from end to end
3. If image flip is supported on your model, confirm the tilt position bar adjusts when flip is toggled

**BRC-X1000 / BRC-H780 / BRC-H800 — Inquiry block 03**
Block 03 (Enlargement) was recently added for the X1000 family. Please verify these variables update correctly:

- NR 2D/3D Level, Gamma, Image Flip, Color Gain, AE Speed, NR Level, Chroma Suppress, Gain Limit

**ILME-FR7 / ILME-FR7K — Individual inquiry polling**
The FR7 does not support block inquiries. Polling uses individual VISCA queries instead. Please verify:

1. Zoom position, focus position, focus mode, power, and WB mode update in real time
2. Pan/tilt position bar tracks correctly (FR7 uses 20-bit coordinates on both axes)
3. Low-priority state updates work: knee setting/mode, detail mode, auto iris, AGC, auto shutter, ND filter mode/auto/clear
4. If ceiling-mounted, confirm the tilt position bar range adjusts correctly

**SRG-X40UH / SRG-H40UH — Inquiry blocks 01-04**
All four blocks were corrected from protocol documentation. Please verify:

1. White balance speed and detail level show correct values (previously read from wrong byte positions)
2. Block 02 variables: spotlight, flicker cancel, IR cut filter, image stabilizer, WB offset, camera ID
3. Block 03/04 variables: AF timing, NR levels, image flip, AE speed, detail settings, visibility enhancer

**SRG-A40 / SRG-A12 — New model support**
These are newly added models. Please verify:

1. Basic connection and polling works
2. Gain limit action is available and shows correct values
3. Block 03 variables include chroma suppress and gain limit
4. Block 04 variables include defog and defog level

**SRG-120DH / SRG-201SE / SRG-300SE / SRG-301SE — Inquiry blocks 03-05**
Blocks 03-05 were recently added for legacy cameras. Please verify:

1. Block 03: AF timing, color gain, gamma, high sensitivity, NR level, chroma suppress, gain limit
2. Block 04: defog status
3. Block 05: color hue

## Changes

### v2.8.1

- Added SRG-360SHE and SRG-280SHE camera support (group 3c) with 20-bit pan/tilt, block inquiries 00-03, tally, and zoom ratio tables
- Added Bright exposure mode to exposure mode actions and toggle for cameras that support it (120DH, 300SE/301SE/201SE, 360SHE/280SHE)
- Added Bright Mode preset (toggle between Auto and Bright)
- Added CAP_TALLY capability set for tally support across X400/X1000 and 360SHE families
- Refactored pan/tilt absolute position command to support 4+4, 5+4, and 5+5 nibble encoding across all camera families

### v2.8.0

- Added inquiry polling with per-family block definitions for real-time camera state (zoom, focus, iris, gain, shutter, exposure mode, WB mode, pan/tilt position, and many more)
- Added per-model filtering of actions, presets, feedbacks, and variables based on camera capabilities
- Added 97+ variables with confirmed state from camera polling
- Added 14 boolean feedbacks (focus mode, exposure mode, WB mode, zoom mode, backlight, spotlight, exposure comp, recording, PT slow mode, selected preset, last preset used, and more)
- Added position bar variables for pan, tilt, zoom, focus, and iris
- Added zoom ratio variable with per-model interpolation tables
- Added zoom mode toggle action (cycles through up to three modes)
- Added FR7 individual inquiry polling (FR7 does not support block inquiries)
- Added FR7 low-priority inquiries for knee, detail, ND filter, auto iris, AGC, auto shutter, and ceiling mode
- Added FR7 20-bit pan/tilt coordinate support with per-model position bar ranges
- Added SRG-A40 and SRG-A12 camera support with dedicated inquiry blocks and GAIN_LIMIT choices
- Added inquiry blocks 03-05 for SRG-120DH and SRG-300SE legacy cameras
- Added X1000 inquiry block 03 (enlargement settings)
- Added configurable preset colors for multi-camera identification (set per-instance in connection config)
- Added last preset recalled feedback and variable
- Added selected preset feedback to camera preset buttons
- Added focus near limit individual inquiry for full 16-bit precision
- Fixed per-family inquiry block byte positions and masks across X40UH, X1000, X400, 300SE, and legacy families
- Fixed X1000 pan/tilt parsing for mixed 5-nibble pan / 4-nibble tilt format
- Fixed focus position bar to scale based on actual focusNearLimit instead of protocol maximum
- Fixed focusNearLimit value from block inquiry (was 1/256 of actual value)
- Fixed redundant "Status: ok" logging during normal polling
- Fixed upgrade script ordering to preserve v2.7.5 positional indexes
- Updated protocol documentation with clarified byte/nibble/bit notation
- Updated presets with position bars, zoom ratio, and improved text sizing
- Updated custom command action to support variables in command strings

### v2.7.5

- Added details for enabling VISCA to HELP.md
- Updated dependencies
- Fixed bug that prevented presets from highlighting when saving
- Fixed default camera Id in new configs
- Finished Camera Preset Selection action and feedback #77

### v2.7.1

- Fixed issue that required disabling and re-enabling a new instance when added to companion.

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

import { degreesToRaw, rawToDegrees } from '../src/variables.js'

describe('degreesToRaw', () => {
	it('converts 0° to 0 raw for all axes', () => {
		expect(degreesToRaw('051C', 0, 'pan', 'Off')).toBe(0)
		expect(degreesToRaw('051C', 0, 'tilt', 'Off')).toBe(0)
		expect(degreesToRaw('0519', 0, 'pan', 'Off')).toBe(0)
		expect(degreesToRaw('0511', 0, 'pan', 'Off')).toBe(0)
	})

	it('converts X400 pan ±170° to ±0x2200', () => {
		expect(degreesToRaw('051C', 170, 'pan', 'Off')).toBe(0x2200)
		expect(degreesToRaw('051C', -170, 'pan', 'Off')).toBe(-0x2200)
	})

	it('converts X400 tilt flip off: -20° to -0x0400, +90° to +0x1200', () => {
		expect(degreesToRaw('051C', 90, 'tilt', 'Off')).toBe(0x1200)
		expect(degreesToRaw('051C', -20, 'tilt', 'Off')).toBe(-0x0400)
	})

	it('converts X400 tilt flip on: -90° to -0x1200, +20° to +0x0400', () => {
		expect(degreesToRaw('051C', -90, 'tilt', 'On')).toBe(-0x1200)
		expect(degreesToRaw('051C', 20, 'tilt', 'On')).toBe(0x0400)
	})

	it('converts X1000 pan using 20-bit range: 10° ≈ 0x937', () => {
		const raw = degreesToRaw('0519', 10, 'pan', 'Off')
		// X1000 protocol: 10° = 0x937 = 2359
		expect(raw).toBe(2359)
	})

	it('converts X1000 pan 170° to 0x9CA7', () => {
		expect(degreesToRaw('0519', 170, 'pan', 'Off')).toBe(0x9ca7)
	})

	it('converts SRG-120DH pan ±100° to ±0x1400', () => {
		expect(degreesToRaw('0511', 100, 'pan', 'Off')).toBe(0x1400)
		expect(degreesToRaw('0511', -100, 'pan', 'Off')).toBe(-0x1400)
	})

	it('converts FR7 pan 170° to 0x9CA7', () => {
		expect(degreesToRaw('051E', 170, 'pan', 'Off')).toBe(0x9ca7)
	})

	it('converts FR7 tilt flip off 195° to 0xB3B0', () => {
		expect(degreesToRaw('051E', 195, 'tilt', 'Off')).toBe(0xb3b0)
	})

	it('converts 360SHE pan 170° to 0x15400', () => {
		expect(degreesToRaw('0604', 170, 'pan', 'Off')).toBe(0x15400)
	})

	it('clamps values beyond model range', () => {
		// X400 pan max is ±170°, requesting 200° should clamp to 170°
		expect(degreesToRaw('051C', 200, 'pan', 'Off')).toBe(0x2200)
		expect(degreesToRaw('051C', -200, 'pan', 'Off')).toBe(-0x2200)
	})

	it('uses default range for unknown model', () => {
		// Default is same as X400: ±170° pan = ±0x2200
		expect(degreesToRaw('9999', 170, 'pan', 'Off')).toBe(0x2200)
	})
})

describe('rawToDegrees', () => {
	it('converts 0 raw to 0° for all axes', () => {
		expect(rawToDegrees('051C', 0, 'pan', 'Off')).toBe(0)
		expect(rawToDegrees('051C', 0, 'tilt', 'Off')).toBe(0)
	})

	it('returns null for null input', () => {
		expect(rawToDegrees('051C', null, 'pan', 'Off')).toBeNull()
	})

	it('converts X400 pan 0x2200 to 170°', () => {
		expect(rawToDegrees('051C', 0x2200, 'pan', 'Off')).toBe(170)
	})

	it('converts X400 pan -0x2200 to -170°', () => {
		expect(rawToDegrees('051C', -0x2200, 'pan', 'Off')).toBe(-170)
	})

	it('converts X400 tilt flip off 0x1200 to 90°', () => {
		expect(rawToDegrees('051C', 0x1200, 'tilt', 'Off')).toBe(90)
	})

	it('converts X400 tilt flip on -0x1200 to -90°', () => {
		expect(rawToDegrees('051C', -0x1200, 'tilt', 'On')).toBe(-90)
	})

	it('converts X1000 pan 0x937 to 10°', () => {
		expect(rawToDegrees('0519', 0x937, 'pan', 'Off')).toBe(10)
	})

	it('converts X1000 pan 0x9CA7 to 170°', () => {
		expect(rawToDegrees('0519', 0x9ca7, 'pan', 'Off')).toBe(170)
	})

	it('converts SRG-120DH pan 0x1400 to 100°', () => {
		expect(rawToDegrees('0511', 0x1400, 'pan', 'Off')).toBe(100)
	})

	it('converts FR7 tilt flip off 0xB3B0 to 195°', () => {
		expect(rawToDegrees('051E', 0xb3b0, 'tilt', 'Off')).toBe(195)
	})

	it('round-trips degreesToRaw for fractional values', () => {
		const raw = degreesToRaw('051C', 45.5, 'pan', 'Off')
		const deg = rawToDegrees('051C', raw, 'pan', 'Off')
		expect(deg).toBeCloseTo(45.5, 0)
	})
})

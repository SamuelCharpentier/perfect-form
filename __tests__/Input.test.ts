import { TextualInput } from '@src/TextualInput';
import { NumericalInput } from '@src/NumericalInput';
let inputBase = { label: 'My Input', name: 'myInput' };

describe('Input', () => {
	it('Has a unique ID', () => {
		let txtInpt = new TextualInput({ ...inputBase });
		expect(txtInpt.id).not.toBeUndefined();
		expect(typeof txtInpt.id).toBe('string');
		expect(txtInpt.id.length).toBeGreaterThanOrEqual(1);
	});
});
describe('Maskable Input', () => {
	it.todo('Has mask');
});

describe('TextualInput', () => {
	it('Validate a string value', () => {
		let txtInpt = new TextualInput({ ...inputBase });

		txtInpt.required = false;
		txtInpt.value = 'This is a string';
		expect(txtInpt.isValid).toBe(true);
		txtInpt.value = 'A';
		expect(txtInpt.isValid).toBe(true);
		txtInpt.value = '';
		expect(txtInpt.isValid).toBe(true);
	});

	it('Invalidate all non string values', () => {
		let txtInpt = new TextualInput({ ...inputBase });

		txtInpt.value = 200;
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = 0;
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = false;
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = true;
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = ['This is a string array'];
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = { key: 'This is an object' };
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = new Set(['This is a string array']);
		expect(txtInpt.isValid).toBe(false);
	});

	it('Requires a value when required', () => {
		let txtInpt = new TextualInput({ ...inputBase, required: true });

		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = 'My value';
		expect(txtInpt.isValid).toBe(true);
		txtInpt.value = '';
		expect(txtInpt.isValid).toBe(false);
	});

	it('Handles input hinting properly', () => {
		let txtInpt = new TextualInput({
			...inputBase,
			required: true,
			hintsInstructions: [{ regexp: /.+/, message: 'This input is required' }],
		});

		txtInpt.updateHint();
		expect(txtInpt.hints).toStrictEqual(['This input is required']);
		txtInpt.value = 'My value';
		txtInpt.updateHint();
		expect(txtInpt.hints).toStrictEqual([]);
	});

	it('Validate input pattern properly', () => {
		let testedRegexp = /[0-9].*[0-9]/;
		let txtInpt = new TextualInput({
			...inputBase,
			required: true,
			pattern: testedRegexp,
		});

		txtInpt.value = 'This is just a string';
		expect(txtInpt.isValid).toBe(false);
		txtInpt.value = 'This is just a string 12';
		expect(txtInpt.isValid).toBe(true);
		txtInpt.value = '1This is just a string 2';
		expect(txtInpt.isValid).toBe(true);
	});

	it('Returns given value untouched', () => {
		let txtInpt = new TextualInput({ ...inputBase });
		txtInpt.value = 'George';
		expect(txtInpt.value).toBe('George');
	});
});

describe('NumericalInputs', () => {
	it('Validates numerical string value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase });
		nbrInpt.value = '2';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '0025846';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = 66;
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '';
		expect(nbrInpt.isValid).toBe(true);
	});
	it('Invalidates non numerical values', () => {
		let nbrInpt = new NumericalInput({ ...inputBase });
		nbrInpt.value = 'This is not a number';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = { value: '0' };
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = [6, 3, 13];
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = undefined;
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = null;
		expect(nbrInpt.isValid).toBe(false);
	});
	it('Converts floats to intergers', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, type: 'integers' });
		nbrInpt.value = '55.2';
		expect(nbrInpt.valueAsNumber).toBe(55);
		expect(nbrInpt.value).toBe(55);
	});
});

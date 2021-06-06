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
	it('Can be masked', () => {
		let txtInpt = new TextualInput({ ...inputBase, mask: '000 $' });
		expect(txtInpt.mask).toBe('000 $');
	});
});

describe('NumericalInputs', () => {
	it('Validates numerical string value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase });
		nbrInpt.value = '2';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '0025846';
		expect(nbrInpt.isValid).toBe(true);

		nbrInpt.value = '';
		expect(nbrInpt.isValid).toBe(true);
	});

	it('Converts native numbers into strings', () => {
		let nbrInpt = new NumericalInput({ ...inputBase });
		nbrInpt.value = 66;
		expect(nbrInpt.value).toBe('66');
		expect(nbrInpt.isValid).toBe(true);
	});

	it('Converts invalid values into empty strings', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true });
		nbrInpt.value = 'This is not a number';
		expect(nbrInpt.value).toBe('');
		nbrInpt.value = { value: '0' };
		expect(nbrInpt.value).toBe('');
		nbrInpt.value = [6, 3, 13];
		expect(nbrInpt.value).toBe('');
		nbrInpt.value = undefined;
		expect(nbrInpt.value).toBe('');
		nbrInpt.value = null;
		expect(nbrInpt.value).toBe('');
	});
	it('Invalidates empty value when required', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true });
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '65px';
		expect(nbrInpt.value).toBe('65');
		expect(nbrInpt.isValid).toBe(true);
	});
	it('Handles integers correctly', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, type: 'integers' });
		nbrInpt.value = '55.2';
		expect(nbrInpt.valueAsNumber).toBe(55);
		expect(nbrInpt.value).toBe('55');
		nbrInpt.value = '33';
		expect(nbrInpt.valueAsNumber).toBe(33);
		expect(nbrInpt.value).toBe('33');
	});

	it('Handles floats correctly', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, type: 'floats' });
		nbrInpt.value = '55.2';
		expect(nbrInpt.valueAsNumber).toBe(55.2);
		expect(nbrInpt.value).toBe('55.2');
		nbrInpt.value = '33';
		expect(nbrInpt.valueAsNumber).toBe(33);
		expect(nbrInpt.value).toBe('33');
	});

	it('Enforce a minimum numerical value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true, minVal: 10 });
		nbrInpt.value = '-10';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '0';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '5';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '10';
		expect(nbrInpt.isValid).toBe(true);
	});

	it('Enforce a maximum numerical value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true, maxVal: 10 });
		nbrInpt.value = '15';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '10';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '0';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '-100';
		expect(nbrInpt.isValid).toBe(true);
	});
	it('Enforce incremental steps to value', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true, incrementStep: 2 });
		nbrInpt.value = '3';
		expect(nbrInpt.isValid).toBe(false);
		nbrInpt.value = '0';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '2';
		expect(nbrInpt.isValid).toBe(true);
		nbrInpt.value = '-122';
		expect(nbrInpt.isValid).toBe(true);
	});
	it('Handles input hinting properly', () => {
		let nbrInpt = new NumericalInput({ ...inputBase, required: true, incrementStep: 2, minVal: 5, maxVal: 20 });

		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('this field is required');
		expect(nbrInpt.hints).toContain('this field has to be between 5 and 20');
		nbrInpt.value = '3';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('this field has to be more than 5');
		expect(nbrInpt.hints).toContain('this field has to be in increments of 2');
		nbrInpt.value = '25';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('this field has to be less than 20');
		expect(nbrInpt.hints).toContain('this field has to be in increments of 2');
		nbrInpt.value = '10';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toStrictEqual([]);
	});
	it('Allows to translate hinting', () => {
		let myTranslation = {
			thisField: 'ce champ',
			isRequired: 'est requis',
			hasToBe: 'doit être',
			lessThan: 'moins de',
			moreThan: 'plus de',
			between: 'entre',
			and: 'et',
			inIncrementsOf: 'en incréments de',
		};
		let nbrInpt = new NumericalInput({
			...inputBase,
			required: true,
			incrementStep: 2,
			minVal: 5,
			maxVal: 20,
			hintConfig: { translation: myTranslation },
		});
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('ce champ est requis');
		expect(nbrInpt.hints).toContain('ce champ doit être entre 5 et 20');
		nbrInpt.value = '3';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('ce champ doit être plus de 5');
		expect(nbrInpt.hints).toContain('ce champ doit être en incréments de 2');
		nbrInpt.value = '25';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toContain('ce champ doit être moins de 20');
		expect(nbrInpt.hints).toContain('ce champ doit être en incréments de 2');
		nbrInpt.value = '10';
		nbrInpt.updateHint();
		expect(nbrInpt.hints).toStrictEqual([]);
	});
});

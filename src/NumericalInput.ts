import { MaskableInputConstructor, MaskableInput } from './Input';
import type { InputOption } from './Option';

interface NumberInputConstructor extends MaskableInputConstructor {
	value?: string;
	type?: 'integers' | 'floats';
	minVal?: number;
	maxVal?: number;
	autocomplete?: boolean | string;
	incrementStep?: number;
}

export class NumericalInput extends MaskableInput {
	public autocomplete: boolean | string;
	public defaultValue: string;
	public type: 'integers' | 'floats';
	public minVal?: number;
	public maxVal?: number;
	public incrementStep?: number;
	public optionList?: InputOption[];
	public hints?: string[];
	public customValidation: ((value: string) => boolean)[] = [];
	private _value: string = '';

	constructor(constructorObject: NumberInputConstructor) {
		super(constructorObject);
		const { value, type, minVal, maxVal, autocomplete, incrementStep, defaultValue, useValueAsDefaultValue } =
			constructorObject;
		this.value = value !== undefined ? value : '';
		this.defaultValue = defaultValue !== undefined ? defaultValue : useValueAsDefaultValue ? value : '';
		this.type = type ? type : 'floats';
		this.minVal = minVal;
		this.maxVal = maxVal;
		this.autocomplete = autocomplete !== undefined ? autocomplete : true; // true could be changed for a default value for all form fields...
		this.incrementStep = incrementStep;
	}
	set value(value: string) {
		value = value !== undefined && typeof value === 'string' ? value : '';
		let numberValue = this.convertToNumber(value, this.type);
		if (value !== '' && numberValue) {
		}
		this._value = value;
	}
	get value() {
		return this._value;
	}
	updateHint() {}
	get isValid() {
		return this.validate(this.value);
	}
	private validate(value: string) {
		if (!this.required && value === '') return true;
		const numberValue = this.convertToNumber(value, this.type);
		if (numberValue === undefined) return false;
		if (isNaN(numberValue)) return false;
		if (this.minVal && numberValue < this.minVal) return false;
		if (this.maxVal && numberValue > this.maxVal) return false;
		if (this.type === 'integers' && !Number.isInteger(numberValue)) return false;
		if (this.incrementStep && numberValue % this.incrementStep !== 0) return false;
		this.customValidation.forEach((validation) => {
			if (!validation(value)) return false;
		});
		return true;
	}
	get valueAsNumber(): number | undefined {
		return this.convertToNumber(this.value, this.type);
	}
	private convertToNumber(value: string, type: 'floats' | 'integers') {
		if (typeof value !== 'string') return undefined;
		if (type === 'floats') return parseFloat(this.value);
		if (type === 'integers') return parseInt(this.value, 10);
		return undefined;
	}
}

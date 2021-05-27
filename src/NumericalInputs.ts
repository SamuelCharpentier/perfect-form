import { InputConstructor, Input } from './Input';
import type { InputOption } from './Option';

interface NumberInputConstructor extends InputConstructor {
	value?: string;
	type?: 'integers' | 'floats';
	minVal?: number;
	maxVal?: number;
	autocomplete?: boolean | string;
	incrementStep?: number;
}

export class NumberInput extends Input {
	public autocomplete: boolean | string;
	public defaultValue: string;
	public value: string;
	public type: 'integers' | 'floats';
	public minVal?: number;
	public maxVal?: number;
	public incrementStep?: number;
	public optionList: InputOption[];
	public hints: string[];
	public customValidation: { (value: string): boolean }[] = [];

	constructor(constructorObject: NumberInputConstructor) {
		super(constructorObject);
		const { value, type, minVal, maxVal, autocomplete, incrementStep } =
			constructorObject;
		this.value = value !== undefined ? value : '';
		this.type = type ? type : 'floats';
		this.minVal = minVal;
		this.maxVal = maxVal;
		this.autocomplete = autocomplete !== undefined ? autocomplete : true; //true could be changed for a default value for all form fields...
		this.incrementStep = incrementStep;
	}
	updateHint() {}
	get isValid() {
		if (!this.required && this.value === '') return true;
		if (isNaN(this.valueAsNumber)) return false;
		if (this.minVal && this.valueAsNumber < this.minVal) return false;
		if (this.maxVal && this.valueAsNumber > this.maxVal) return false;
		if (this.type === 'integers' && !Number.isInteger(this.valueAsNumber))
			return false;
		if (this.incrementStep && this.valueAsNumber % this.incrementStep !== 0)
			return false;
		this.customValidation.forEach((validation) => {
			if (!validation(this.value)) return false;
		});
		return true;
	}
	get valueAsNumber(): number | undefined {
		if (this.type === 'floats') return parseFloat(this.value);
		if (this.type === 'integers') return parseInt(this.value);
		return undefined;
	}
}

import { InputConstructor, Input } from './Input';
import type { InputOption } from './Option';

const numberInputDefaultHintTranslation = {
	thisField: 'this field',
	isRequired: 'is required',
	hasToBe: 'has to be',
	lessThan: 'less than',
	moreThan: 'more than',
	between: 'between',
	and: 'and',
	inIncrementsOf: 'in increments of',
};
const numberInputDefaultHintToggle = {
	required: true,
	min: true,
	max: true,
	increment: true,
};

const numberInputDefaultHintConfig = {
	translation: numberInputDefaultHintTranslation,
	toggle: numberInputDefaultHintToggle,
};
interface HintConfig {
	translation?: {
		thisField: string;
		isRequired: string;
		hasToBe: string;
		lessThan: string;
		moreThan: string;
		between: string;
		and: string;
		inIncrementsOf: string;
	};
	toggle?: {
		required?: boolean;
		min?: boolean;
		max?: boolean;
		increment?: boolean;
	};
}

interface NumberInputConstructor extends InputConstructor {
	value?: string;
	type?: 'integers' | 'floats';
	minVal?: number;
	maxVal?: number;
	autocomplete?: boolean | string;
	incrementStep?: number;
	hintConfig?: HintConfig;
}

export class NumericalInput extends Input {
	public autocomplete: boolean | string;
	public defaultValue: string;
	public type: 'integers' | 'floats';
	public minVal?: number;
	public maxVal?: number;
	public incrementStep?: number;
	public optionList?: InputOption[];
	public hints: string[] = [];
	public customValidation: ((value: string) => boolean)[] = [];
	public hintConfig: {
		translation: {
			thisField: string;
			isRequired: string;
			hasToBe: string;
			lessThan: string;
			moreThan: string;
			between: string;
			and: string;
			inIncrementsOf: string;
		};
		toggle: {
			required: boolean;
			min: boolean;
			max: boolean;
			increment: boolean;
		};
	};
	private _value: string = '';

	constructor(constructorObject: NumberInputConstructor) {
		super(constructorObject);
		const {
			value,
			type,
			minVal,
			maxVal,
			autocomplete,
			incrementStep,
			defaultValue,
			useValueAsDefaultValue,
			hintConfig,
		} = constructorObject;
		this.value = value !== undefined ? value : '';
		this.defaultValue = defaultValue !== undefined ? defaultValue : useValueAsDefaultValue ? value : '';
		this.type = type ? type : 'floats';
		this.minVal = minVal;
		this.maxVal = maxVal;
		this.autocomplete = autocomplete !== undefined ? autocomplete : true; // true could be changed for a default value for all form fields...
		this.incrementStep = incrementStep;

		this.hintConfig = {
			translation: { ...numberInputDefaultHintConfig.translation, ...hintConfig?.translation },
			toggle: { ...numberInputDefaultHintConfig.toggle, ...hintConfig?.toggle },
		};
	}

	set value(value: string | number) {
		if (typeof value === 'number') value = value?.toString();
		if (value === '' || typeof value !== 'string') {
			this._value = '';
			return;
		}
		let numberValue = this.convertToNumber(value, this.type);
		value = numberValue !== undefined ? numberValue.toString() : '';
		this._value = value;
	}

	get value() {
		return this._value;
	}
	private get needsToShowRequiredHint() {
		return this.required && this.hintConfig.toggle.required;
	}
	private get needsToShowMinHint() {
		return this.minVal !== undefined && this.hintConfig.toggle.min;
	}
	private get needsToShowMaxHint() {
		return this.minVal !== undefined && this.hintConfig.toggle.max;
	}
	private get needsToShowIncrementHint() {
		return this.incrementStep !== undefined && this.hintConfig.toggle.increment;
	}
	private addToHints(message: string) {
		if (!this.hints.includes(message)) this.hints.push(message);
	}
	updateHint() {
		this.hints = [];
		const msg = this.hintConfig.translation;
		if (this.needsToShowRequiredHint && !this.isValid) {
			let hintMessageRequired = `${msg.thisField} ${msg.isRequired}`;
			this.addToHints(hintMessageRequired);
		}
		if (this.needsToShowMinHint || this.needsToShowMaxHint) {
			let hintMessageMinMax = `${msg.thisField} ${msg.hasToBe} ${msg.between} ${this.minVal} ${msg.and} ${this.maxVal}`;
			let hintMessageMin = `${msg.thisField} ${msg.hasToBe} ${msg.moreThan} ${this.minVal}`;
			let hintMessageMax = `${msg.thisField} ${msg.hasToBe} ${msg.lessThan} ${this.maxVal}`;
			if (this.valueAsNumber === undefined) {
				if (this.needsToShowMinHint && this.needsToShowMaxHint) {
					this.addToHints(hintMessageMinMax);
				}
				if (this.needsToShowMinHint && !this.needsToShowMaxHint) {
					this.addToHints(hintMessageMin);
				}
				if (this.needsToShowMaxHint && !this.needsToShowMinHint) {
					this.addToHints(hintMessageMax);
				}
			} else {
				if (this.needsToShowMinHint && this.minVal && this.valueAsNumber < this.minVal) {
					this.addToHints(hintMessageMin);
				}
				if (this.needsToShowMaxHint && this.maxVal && this.valueAsNumber > this.maxVal) {
					this.addToHints(hintMessageMax);
				}
			}
			if (this.needsToShowIncrementHint) {
				let hintMessageIncrement = `${msg.thisField} ${msg.hasToBe} ${msg.inIncrementsOf} ${this.incrementStep}`;
				if (
					this.valueAsNumber !== undefined &&
					this.incrementStep !== undefined &&
					this.valueAsNumber % this.incrementStep !== 0
				) {
					this.addToHints(hintMessageIncrement);
				}
			}
		}
	}

	get isValid() {
		return this.validate(this._value);
	}

	private validate(value: string) {
		if (!this.required && value === '') return true;
		const numberValue = this.convertToNumber(value, this.type);
		if (numberValue === undefined) return false;
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
		return this.convertToNumber(this._value, this.type);
	}

	private convertToNumber(value: string, type: 'floats' | 'integers') {
		if (typeof value !== 'string') return undefined;
		let convertedValue = type === 'floats' ? parseFloat(value) : parseInt(value, 10);
		return isNaN(convertedValue) ? undefined : convertedValue;
	}
}

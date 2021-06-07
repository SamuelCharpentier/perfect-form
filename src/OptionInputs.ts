import { Input, InputConstructor } from './Input';
import { InputOption } from './InputOption';
import type { OptionGroup } from './OptionGroup';

interface OptionBasedInputConstructor extends InputConstructor {
	options: (InputOption | OptionGroup)[];
}
abstract class OptionBasedInput extends Input {
	abstract multipleValues: boolean;
	private _options: (InputOption | OptionGroup)[] = [];
	public _allOptions: InputOption[] = [];

	constructor(constructorObject: OptionBasedInputConstructor) {
		super(constructorObject);
		const { options } = constructorObject;
		if (options === undefined || options.length === 0)
			throw new Error('Options are required for initialisation of option based input');
		this.options = options;
	}
	set options(options: (InputOption | OptionGroup)[]) {
		const cumulateInputOption = (options: (InputOption | OptionGroup)[]): InputOption[] => {
			return options.reduce((cumulatedOptions: InputOption[], opt) => {
				if (opt instanceof InputOption) {
					return [...cumulatedOptions, opt];
				}
				return [...cumulatedOptions, ...cumulateInputOption(opt.options)];
			}, []);
		};
		this._allOptions = cumulateInputOption(options);
		this._allOptions
			.map((opt) => opt.value)
			.reduce((duplicateValues: string[], value, index, valueArr) => {
				if (valueArr.indexOf(value) !== index)
					duplicateValues = [...Array.from(new Set([...duplicateValues, value]))];

				if (index === valueArr.length - 1) {
					if (duplicateValues.length > 0) {
						let errorMessage = `All Options of option based Inputs must have unique values. \n`;
						duplicateValues.forEach((dupVal) => {
							errorMessage += `${dupVal} received in double. \n`;
						});
						throw new Error(errorMessage);
					}
					return valueArr;
				}

				return duplicateValues;
			}, []);
		this._options = options;
	}
	get options(): (InputOption | OptionGroup)[] {
		return this._options;
	}
	isValidValue(value: string) {
		return this._allOptions.some(
			(option) =>
				option.value === value &&
				!option.disabled &&
				(option.optionGroup === undefined || !option.optionGroup.disabled),
		);
	}
}

interface SingleOptionInputConstructor extends OptionBasedInputConstructor {
	value?: string;
	defaultValue?: string;
}
export class SingleOptionInput extends OptionBasedInput implements Input {
	public value: string;
	public readonly multipleValues: false = false;
	public readonly defaultValue: string;
	constructor(constructorObject: SingleOptionInputConstructor) {
		super(constructorObject);

		let { value, defaultValue } = constructorObject;

		let selectedOption = this._allOptions.filter((option) => option.preSelected);

		if (selectedOption.length > 1)
			throw new Error('Only one option should be pre-selected in a single option input');

		this.value = selectedOption.length === 1 ? selectedOption[0].value : '';
		this.value = typeof value === 'string' && this.isValidValue(value) ? value : '';

		this.defaultValue = defaultValue !== undefined && this.isValidValue(defaultValue) ? defaultValue : this.value;
	}
	get isValid() {
		if (!this.required && !this.value) return true;
		if (this.isValidValue(this.value)) {
			return true;
		}
		this.value = '';
		return false;
	}
}

interface MultiOptionInputConstructor extends OptionBasedInputConstructor {
	values?: string[];
	defaultValues?: string[];
}
export class MultiOptionInput extends OptionBasedInput implements Input {
	public values: string[];
	public readonly multipleValues: true = true;
	public readonly defaultValue: string[] = [];
	constructor(opt: MultiOptionInputConstructor) {
		super(arguments[0]);
		const { values, defaultValues } = opt;

		let selectedOptions = this._allOptions
			.filter((option) => option.preSelected)
			.reduce((arrValues: string[], value: InputOption) => {
				return [...arrValues, value.value];
			}, []);

		this.values = selectedOptions.length > 0 ? selectedOptions : [];
		this.values = values !== undefined && this.areValidValues(values) ? values : [];

		this.defaultValue =
			defaultValues !== undefined
				? this.areValidValues(defaultValues).isValid
					? defaultValues
					: this.areValidValues(defaultValues).values
				: this.values;
	}
	get isValid() {
		if (!this.required && this.values.length === 0) return true;
		let validationResult = this.areValidValues(this.values);
		if (!validationResult.isValid) {
			this.values = [...validationResult.values];
			return false;
		}
		return true;
	}
	private areValidValues(valuesArray: string[]) {
		let result = { isValid: true, values: [...valuesArray] };
		valuesArray.forEach((value) => {
			if (!this.isValidValue(value)) {
				result.isValid = false;
				result.values.splice(result.values.indexOf(value), 1);
			}
		});
		return result;
	}
}

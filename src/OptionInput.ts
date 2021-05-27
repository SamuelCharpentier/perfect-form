import { Input, InputConstructor } from './Input';
import { InputOption } from './Option';
import type { OptionGroup } from './OptionGroup';

interface OptionBasedInputConstructor extends InputConstructor {
	options: (InputOption | OptionGroup)[];
}
abstract class OptionBasedInput extends Input {
	abstract multipleValues: boolean;
	private _options: (InputOption | OptionGroup)[];
	public _allOptions: InputOption[];

	constructor(constructorObject: OptionBasedInputConstructor) {
		super(constructorObject);
		this.options = constructorObject.options;
	}
	set options(options: (InputOption | OptionGroup)[]) {
		this._allOptions = options.reduce((optionsArr: InputOption[], opt) => {
			if (opt instanceof InputOption) {
				return [...optionsArr, opt];
			}
			return [...optionsArr, ...opt.options];
		}, []);
		this._allOptions
			.map((opt) => opt.value)
			.reduce((duplicateValues: string[], value, index, valueArr) => {
				if (valueArr.indexOf(value) != index)
					duplicateValues = [...new Set([...duplicateValues, value])];

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
				!option.optionGroup.disabled,
		);
	}
}

interface SingleOptionInputConstructor extends OptionBasedInputConstructor {
	value?: string;
	defaultValue?: string;
}
export class SingleOptionInput extends OptionBasedInput implements Input {
	public value: string;
	public multipleValues: false = false;
	public readonly defaultValue: string;
	constructor(constructorObject: SingleOptionInputConstructor) {
		super(constructorObject);

		let { value, defaultValue } = constructorObject;

		let selectedOption = this._allOptions.filter(
			(option) => option.preSelected,
		);

		if (selectedOption.length > 1)
			throw new Error(
				'Only one option should be pre-selected in a single option input',
			);

		this.value =
			!value && selectedOption.length === 1
				? selectedOption[0].value
				: value;

		this.isValid;
		this.defaultValue =
			defaultValue !== undefined && this.isValidValue(defaultValue)
				? defaultValue
				: this.value;
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
	public values: string[] = [];
	public multipleValues: true = true;
	public readonly defaultValue: string[] = [];
	constructor(opt: MultiOptionInputConstructor) {
		super(arguments[0]);
		const { values, defaultValues } = opt;

		let selectedOption = this._allOptions
			.filter((option) => option.preSelected)
			.reduce((arrValues: string[], value: InputOption) => {
				return [...arrValues, value.value];
			}, []);
		this.values =
			!values && selectedOption.length > 0 ? selectedOption : values;
		this.isValid;

		this.defaultValue =
			defaultValues !== undefined &&
			defaultValues.filter((value) => {
				!this.isValidValue(value);
			}).length > 0
				? defaultValues
				: this.values;
	}
	get isValid() {
		if (!this.required && this.values.length === 0) return true;
		this.values.forEach((value) => {
			if (!this.isValidValue(value))
				this.values.splice(this.values.indexOf(value), 1);
		});
		if (this.values.length > 0) return true;
		return false;
	}
}

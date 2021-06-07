import { MaskableInputConstructor, MaskableInput } from '@src/Input';
import type { HintsInstruction } from '@src/Hints';

interface TextualInputConstructor extends MaskableInputConstructor {
	value?: string;
	pattern?: RegExp;
	autocomplete?: boolean | string;
	hintsInstructions?: HintsInstruction[];
	placeholder?: string;
	type?: 'text' | 'textarea';
	defaultValue?: string;
}
export class TextualInput extends MaskableInput {
	public readonly defaultValue: string;
	public autocomplete: boolean | string;
	public type: 'text' | 'textarea';
	public value: string;
	public hints: string[] = [];
	public pattern?: RegExp;
	public placeholder?: string;
	public hintsInstructions: HintsInstruction[];

	constructor(constructorObject: TextualInputConstructor) {
		super(constructorObject);

		const {
			value,
			pattern,
			hintsInstructions,
			placeholder,
			type,
			autocomplete,
			defaultValue,
			useValueAsDefaultValue,
			mask,
		} = constructorObject;

		this.value = value !== undefined ? value : '';
		this.defaultValue = defaultValue !== undefined && this.validate(defaultValue) ? defaultValue : this.value;
		this.type = type ? type : 'text';
		this.autocomplete = autocomplete !== undefined ? autocomplete : true; // true could be changed for a default value for all form fields...
		this.hints = [];
		this.pattern = pattern ? pattern : this.required ? /.+/ : undefined;
		this.placeholder = placeholder;
		this.hintsInstructions =
			hintsInstructions !== undefined
				? hintsInstructions
				: pattern !== undefined
				? [
						{
							regexp: pattern,
							message: `Doit se conformer à /${pattern}/`,
						},
				  ]
				: [];
		this.mask = mask;
	}
	updateHint() {
		for (const instruction of this.hintsInstructions) {
			const passesRegExpTest = RegExp(instruction.regexp).test(this.value.trim());
			const hintAlreadyShown = this.hints.includes(instruction.message);
			if (!passesRegExpTest && !hintAlreadyShown) {
				this.hints.push(instruction.message);
			} else if (passesRegExpTest && hintAlreadyShown) {
				this.hints.splice(this.hints.indexOf(instruction.message), 1);
			}
		}
	}
	get isValid() {
		return this.validate(this.value);
	}
	private validate(value: string): boolean {
		if (typeof value !== 'string') return false;
		if (this.required && this.value === '') return false;
		if (this.pattern !== undefined && !this.pattern.test(this.value.trim())) return false;
		return true;
	}
}

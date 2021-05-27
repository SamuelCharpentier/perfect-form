import { InputConstructor, Input } from './Input';
import type { HintsInstruction } from './Hints';

interface TextualInputConstructor extends InputConstructor {
	value?: string;
	pattern?: RegExp;
	autocomplete?: boolean | string;
	hintsInstructions?: HintsInstruction[];
	placeholder?: string;
	type?: 'text' | 'textarea';
	defaultValue?: string;
}
export class TextualInput extends Input {
	public defaultValue: string;
	public autocomplete: boolean | string;
	public type: 'text' | 'textarea';
	public value: string;
	public hints: string[];
	public pattern?: RegExp;
	public placeholder?: string;
	public hintsInstructions: HintsInstruction[];
	constructor(constructorObject: TextualInputConstructor) {
		super(constructorObject);

		const { value, pattern, hintsInstructions, placeholder, type, autocomplete, defaultValue } = constructorObject;

		this.value = value !== undefined ? value : '';
		this.defaultValue = defaultValue !== undefined ? defaultValue : this.value;
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
		if (!this.required && this.value === '') return true;
		if (this.pattern !== undefined && this.pattern.test(this.value.trim())) return true;
		return false;
	}
}

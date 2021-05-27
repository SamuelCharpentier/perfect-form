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
	public hintsInstructions?: HintsInstruction[];
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
		} = constructorObject;

		this.value = value !== undefined ? value : '';
		this.defaultValue =
			defaultValue !== undefined ? defaultValue : this.value;
		this.type = type ? type : 'text';
		this.autocomplete = autocomplete !== undefined ? autocomplete : true; //true could be changed for a default value for all form fields...
		this.hints = [];
		this.pattern = pattern ? pattern : this.required ? /.+/ : undefined;
		this.placeholder = placeholder;
		this.hintsInstructions =
			pattern != undefined && hintsInstructions != undefined
				? hintsInstructions
				: [
						{
							regexp: pattern,
							message: `Doit se conformer à /${pattern}/`,
						},
				  ];
	}
	updateHint() {
		for (let instructions of this.hintsInstructions) {
			instructions.regexp = instructions.regexp
				? instructions.regexp
				: this.pattern;
			let passesRegExpTest = RegExp(instructions.regexp).test(
				this.value.trim(),
			);
			let hintAlreadyShown = this.hints.includes(instructions.message);
			if (!passesRegExpTest && !hintAlreadyShown) {
				this.hints.push(instructions.message);
			} else if (passesRegExpTest && hintAlreadyShown) {
				this.hints.splice(this.hints.indexOf(instructions.message), 1);
			}
		}
	}
	get isValid() {
		if (!this.required && this.value === '') return true;
		if (this.pattern.test(this.value.trim())) return true;
		return false;
	}
}

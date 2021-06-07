import { Input, InputConstructor } from './Input';

interface ToggleInputConstructor extends InputConstructor {
	initialState: boolean;
	defaultValue?: boolean;
}

export class ToggleInput extends Input {
	public defaultValue: boolean;
	private _value: boolean;
	constructor(constructorObject: ToggleInputConstructor) {
		super(constructorObject);
		const { initialState, defaultValue } = constructorObject;
		this._value = initialState;
		this.defaultValue = defaultValue !== undefined ? defaultValue : this._value;
	}
	public toggle() {
		this._value = !this._value;
	}
	get value() {
		return this._value;
	}
	get isValid() {
		return this.required ? this._value : true;
	}
}

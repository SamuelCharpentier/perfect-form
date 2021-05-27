import { Input, InputConstructor } from './Input';

interface ToggleInputConstructor extends InputConstructor {}

export class ToggleInput extends Input {
	constructor(constructorObject: ToggleInputConstructor) {
		super(constructorObject);
	}
	get isValid() {
		return true;
	}
}

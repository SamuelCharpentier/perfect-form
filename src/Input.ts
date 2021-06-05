import { v4 as uuidv4 } from 'uuid';

export interface InputConstructor {
	label: string;
	name: string;
	required?: boolean;
	id?: string;
	formID?: string;
	defaultValue?: any;
	useValueAsDefaultValue?: boolean;
}

export interface MaskableInputConstructor extends InputConstructor {
	mask?: string;
}
export interface Input {
	updateHint?(): void;
}
export abstract class Input implements InputConstructor, Input {
	public label: string;
	public name: string;
	public required: boolean = false;
	public id: string = uuidv4();
	public formID?: string = undefined;
	abstract isValid: boolean;
	abstract defaultValue: any;

	constructor(constructorObject: InputConstructor) {
		const { label, name, id, formID, required } = constructorObject;
		this.label = label;
		this.name = name;
		this.required = required ? required : this.required;
		this.id = id ? id : this.id;
		this.formID = formID ? formID : this.formID;
	}
}
export abstract class MaskableInput extends Input implements MaskableInputConstructor, Input {
	public mask?: string = undefined;
	constructor(constructorObject: MaskableInputConstructor) {
		super(constructorObject);
		this.mask = constructorObject.mask;
	}
}

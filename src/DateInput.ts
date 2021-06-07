import { MaskableInputConstructor, MaskableInput } from './Input';
import type { InputOption } from './InputOption';
import type { OptionGroup } from './OptionGroup';

interface DateInputConstructor extends MaskableInputConstructor {
	type?: 'date' | 'time' | 'datetime' | 'month' | 'week';
	value?: string;
	min?: Date;
	max?: Date;
	step?: number;
	list?: (InputOption | OptionGroup)[];
	readOnly?: boolean;
}

export class DateInput extends MaskableInput {
	public type: 'date' | 'time' | 'datetime' | 'month' | 'week';
	public value?: string;
	public readonly defaultValue: string;
	public min?: Date;
	public max?: Date;
	public step?: number;
	public list?: (InputOption | OptionGroup)[];
	public readOnly?: boolean;
	constructor(constructorObject: DateInputConstructor) {
		super(constructorObject);
		const { value, type, min, max, step, list, readOnly } = constructorObject;
		this.type = type === undefined ? 'datetime' : type;
		this.value = value !== undefined ? value : '';
		this.defaultValue = this.value;
		this.min = min;
		this.max = max;
		this.step = step;
		this.list = list;
		if ((type === 'date' || type === 'datetime') && readOnly !== undefined)
			console.warn('readonly is not supported on date and datetime input fields');
		this.readOnly = readOnly;
	}
	get isValid() {
		return true;
	}
	get getValueAsDate(): Date {
		return new Date();
	}
}

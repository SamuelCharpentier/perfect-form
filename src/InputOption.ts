import { v4 as uuidv4 } from 'uuid';
import type { OptionGroup } from './OptionGroup';

export class InputOption {
	public value: string;
	public label?: string;
	public disabled: boolean;
	public preSelected: boolean;
	public optionGroup?: OptionGroup;
	public id: string = uuidv4();
	constructor({
		value,
		label,
		disabled = false,
		preSelected = false,
		optionGroup,
	}: {
		value: string;
		label?: string;
		disabled?: boolean;
		preSelected?: boolean;
		optionGroup?: OptionGroup;
	}) {
		if (typeof value !== 'string' || value === '')
			throw new Error('A string value with a minimum length of 1 character must be provided for each options');
		this.value = value;
		this.label = label;
		this.disabled = disabled;
		this.preSelected = preSelected;
		this.optionGroup = optionGroup;
	}
}

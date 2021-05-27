import { v4 as uuidv4 } from 'uuid';
import type { InputOption } from './Option';

export class OptionGroup {
	public label: string;
	public disabled: boolean;
	private _options: InputOption[];
	public id: string = uuidv4();
	constructor({
		label,
		options,
		disabled = false,
	}: {
		label: string;
		disabled?: boolean;
		options: InputOption[];
	}) {
		this.disabled = disabled;
		this.label = label;
		this.options = options;
	}

	set options(options: InputOption[]) {
		this._options = options.map((option) => {
			option.optionGroup = this;
			if (this.disabled) option.disabled = true;
			return option;
		});
	}
	get options(): InputOption[] {
		return this._options;
	}
}

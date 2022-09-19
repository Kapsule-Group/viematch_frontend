import React from 'react';
import './RenderField.scss';
import Select, { components } from 'react-select';
import InputAdornment from '@material-ui/core/InputAdornment';
import { DropdownIndicator } from './../SelectComponent/SelectComponent';
import DatePicker from 'react-datepicker';
import CalendarInput from '../../HelperComponents/CalendarInput/CalendarInput';
import moment from 'moment';
import NumberFormat from 'react-number-format';

const RenderField = ({
	input,
	placeholder,
	ref,
	type,
	min,
	step,
	autoFocus,
	pattern,
	id,
	meta: { touched, error, warning },
	handleInput,
	disabled = false,
	currency,
	format,
	className,
	isClearable,
	max
}) => (
	<label
		className={
			touched && error ? input.value !== '' ? (
				'block-input error_border value'
			) : (
				'error_border block-input'
			) : input.value !== '' ? (
				'block-input value'
			) : (
				'block-input'
			)
		}
	>
		<input
			{...input}
			placeholder={placeholder}
			disabled={disabled}
			id={id}
			ref={ref}
			type={type}
			autoComplete="off"
			min={min}
			maxlength={max}
			pattern={pattern}
			step={step}
			autoFocus={autoFocus}
			onKeyDown={handleInput}
			className={
				currency ? (
					'input-with-currency'
				) : disabled && currency ? (
					'input-with-currency disabled'
				) : (
					disabled && 'disabled'
				)
			}
		/>

		{currency && <span className="currency-block-value">{currency}</span>}
		{touched && error && <span className="error-text">{error}</span>}
	</label>
);

export const RenderArea = ({
	input,
	placeholder,
	ref,
	type,
	min,
	step,
	autoFocus,
	pattern,
	id,
	meta: { touched, error, warning },
	handleInput,
	disabled = false,
	currency,
	format,
	className,
	isClearable
}) => (
	<label
		className={
			touched && error ? input.value !== '' ? (
				'block-input error_border value'
			) : (
				'error_border block-input'
			) : input.value !== '' ? (
				'block-input value'
			) : (
				'block-input'
			)
		}
	>
		<textarea
			{...input}
			placeholder={placeholder}
			disabled={disabled}
			id={id}
			ref={ref}
			type={type}
			autoComplete="off"
			min={min}
			pattern={pattern}
			step={step}
			rows={2}
			autoFocus={autoFocus}
			onKeyDown={handleInput}
			className={'order-textarea'}
		/>

		{currency && <span className="currency-block-value">{currency}</span>}
		{touched && error && <span className="error-text">{error}</span>}
	</label>
);

export const ReduxFormSelect = ({
	input,
	meta: { touched, error, warning },
	options,
	isClearable = 'false',
	isSearchable = false,
	menuIsOpen,
	onKeyDown,
	loading,
	placeholder,
	disabled
}) => {
	const customStyles = {
		control: (styles) => ({ ...styles, borderColor: '#ff60a3!important' }),
		placeholder: (provided, state) => {
			return { ...provided, color: '#ff60a3!important' };
		}
	};
	return (
		<div className={`custom-input-wrapper`} style={{ position: 'relative', maxWidth: '459px' }}>
			<Select
				{...input}
				menuIsOpen={menuIsOpen}
				className={disabled ? 'select_component disabled' : 'select_component'}
				classNamePrefix="select"
				isDisabled={disabled}
				isLoading={loading}
				isClearable={isClearable}
				isSearchable={isSearchable}
				options={options}
				onChange={(value) => {
					input.onChange(value);
				}}
				onBlur={(e) => e.preventDefault()}
				value={input.value}
				placeholder={placeholder}
				onKeyDown={onKeyDown}
				components={{ DropdownIndicator }}
				noOptionsMessage={() => 'Нет вариантов'}
			/>
			<InputAdornment position="start">
				{touched && !!error && <span className="error-text">{error}</span>}
			</InputAdornment>
		</div>
	);
};

export const renderDatePicker = ({
	input,
	placeholder,
	isExpiration,
	defaultValue,
	isClearable,
	meta: { touched, error },
	disabled = false
}) => {
	const dateFormat = 'dd/MM/yyyy';
	return (
		<div className={disabled ? 'calendar calendar-block disabled' : 'calendar calendar-block'}>
			<DatePicker
				{...input}
				selected={input.value ? input.value : null}
				dateFormat={dateFormat}
				peekNextMonth
				showMonthDropdown
				showYearDropdown
				dropdownMode="select"
				className={'date-picker-custom'}
				timeFormat="p"
				locale="en-GB"
				popperPlacement="top"
				customInput={<CalendarInput isExpiration={isExpiration} {...input} />}
				withPortal
				readOnly={disabled}
				isClearable={isClearable}
			/>

			{touched && error && <span className="error-text">{error}</span>}
		</div>
	);
};

export const renderDatePickerHours = ({
	input,
	placeholder,
	defaultValue,
	meta: { touched, error },
	disabled = false
}) => {
	const dateFormatHours = 'dd/MM/yyyy HH:mm';
	return (
		<div className="calendar">
			<DatePicker
				{...input}
				selected={input.value ? input.value : null}
				// onChange={input.onChange}
				dateFormat={dateFormatHours}
				className="date-picker-custom"
				dropdownMode="select"
				showTimeSelect
				peekNextMonth
				showMonthDropdown
				showYearDropdown
				timeFormat="p"
				//locale="en-GB"
				popperPlacement="top"
				customInput={<CalendarInput {...input} />}
				withPortal
				readOnly={disabled}
			/>
			{touched && error && <span className="error-text">{error}</span>}
		</div>
	);
};

export default RenderField;

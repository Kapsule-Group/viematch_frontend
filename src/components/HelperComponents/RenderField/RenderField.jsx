import React from 'react';
import './RenderField.scss';

const RenderField = ({ onChange, input, placeholder, type, id, meta: { touched, error, warning }, max, min }) => (
    <label className={touched && error ? input.value !=='' ? 'block-input error_border value' : 'error_border block-input' : input.value !=='' ? 'block-input value' : 'block-input'}>
        <input onChange={onChange} {...input} onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : false)} placeholder={placeholder} max={max} min={min} id={id} type={type} autoComplete='off'  />
         <span className="error">{error}</span>
    </label>
);



export default RenderField;
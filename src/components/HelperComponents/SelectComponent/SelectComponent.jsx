import React from "react";
import Select, { components } from "react-select";

import expand_icon from "../../../assets/image/arrow_down.png";

import "./SelectComponent.scss";

export const DropdownIndicator = props => {
    return (
        components.DropdownIndicator && (
            <components.DropdownIndicator {...props}>
                <div
                    className={props.selectProps.menuIsOpen ? "select_indicator indicator_active" : "select_indicator"}
                >
                    <img src={expand_icon} alt="expand_icon" />
                </div>
            </components.DropdownIndicator>
        )
    );
};



const SelectComponent = ({
    value,
    onKeyDown,
    options,
    loading,  
    loadingMessage = "Loading filters...",
    change,
    placeholder,
    isClearable,
    isSearchable = true,
    disabled = false
}) => (
    <Select
        className="select_component"
        classNamePrefix="select"
        isDisabled={disabled}
        isLoading={loading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name="color"
        value={value}
        options={options}
        onChange={change}       
        loadingMessage={() => loadingMessage}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        components={{ DropdownIndicator }}
      
    />
);

export default SelectComponent;

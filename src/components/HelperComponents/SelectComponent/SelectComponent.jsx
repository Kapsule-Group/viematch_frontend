import React from 'react';
import Select, {components} from 'react-select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './SelectComponent.scss';

const DropdownIndicator = props => {
    return (
        components.DropdownIndicator && (
            <components.DropdownIndicator {...props}>
                <div className={props.selectProps.menuIsOpen ? "select_indicator indicator_active" : "select_indicator"}>
                    <ExpandMoreIcon />
                </div>
            </components.DropdownIndicator>
        )
    );
};

const SelectComponent = ({value,onKeyDown, options, loading, change, placeholder, isClearable, isSearchable = true}) => (
      <Select
          className="select_component"
          classNamePrefix="select"
          isDisabled={false}
          isLoading={loading}
          isClearable={!isClearable}
          isSearchable={isSearchable}
          name="color"
          value={value}
          options={options}
          onChange={change}
          loadingMessage={()=>'Loading filters...'}
          placeholder={placeholder}
          onKeyDown={onKeyDown}

          components={{ DropdownIndicator }}
      />
);

export default SelectComponent;
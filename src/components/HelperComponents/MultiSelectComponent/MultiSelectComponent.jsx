import React from 'react';
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";

import './MultiSelectComponent.scss';

const MultiSelectComponent = ({ items, item, handleChange, maxItems, placeholder, handleSearch, resetChosenUsers }) => {
    return (
        <div className="wrapper_multiselect">
            {item.length === 0 && <span className="select_placeholder">{placeholder}</span>}
            <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                multiple
                value={item}
                onChange={handleChange}
                input={<Input />}
                renderValue={selected => {
                    const items = [];
                    selected.forEach(el => items.push(el.slice(1)));
                    if (items.length <= maxItems) {
                        return(items.join(', '))
                    } else if (maxItems === 2) {
                        return(`${items[0]}, ${items[1]} +  ${items.length - 1} more`)
                    } else {
                        return(`${items[0]} +  ${items.length - 1} more`)
                    }
                }}
                MenuProps={{
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                    },
                    transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                    },
                    getContentAnchorEl: null
                }}
            >
                <div className="custom_mu">
                    <div>
                        <input
                            type="text"
                            onChange={handleSearch}
                            placeholder="Search…"
                        />
                    </div>
                    <button
                        className="btn_clear"
                        onClick={e => {e.stopPropagation(); resetChosenUsers()}}
                    >
                        Clear selected items
                    </button>
                </div>
                {items
                    .filter(value => item.indexOf(value) > -1)
                    .map(name => (
                        <MenuItem
                            key={name}
                            value={name}
                        >
                            <Checkbox checked={item.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                {items.filter(value => item.indexOf(value) > -1).length > 0 && item.length !== items.length &&
                <div className="line_check" />
                }
                {items
                    .filter(value => item.indexOf(value) === -1)
                    .map(name => (
                        <MenuItem
                            key={name}
                            value={name}
                        >
                            <Checkbox checked={item.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
            </Select>
        </div>
    );
};

export default MultiSelectComponent;
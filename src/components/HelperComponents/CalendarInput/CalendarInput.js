import React, { Component } from 'react';
import calendar from '../../../assets/image/calendar_icon.svg';

import './CalendarInput.scss';

function CalendarInput({ value, onClick, isExpiration }) {
  return (
    <div className="calendar-input">
      <input type="text" value={value} placeholder={isExpiration ? 'None' : 'DD/MM/YYYY'} />
      <img src={calendar} alt="" onClick={onClick} />
    </div>
  );
}

export default CalendarInput;

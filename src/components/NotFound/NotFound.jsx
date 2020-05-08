import React from 'react';
import './NotFound.scss';

const NotFound = ({text = 'Not Found'}) => {
    return (
        <div className="page_not_found">
            <h2>{text}</h2>
        </div>
    );
};

export default NotFound;
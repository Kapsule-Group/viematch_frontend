import React from 'react';
import '../style/main.scss';
import { Context as ResponsiveContext } from 'react-responsive';

const App = (props) => {
    return (
        <ResponsiveContext.Provider>
            {props.children}
        </ResponsiveContext.Provider>
    );
};

export default App;

import React from 'react';
import { MetroSpinner } from "react-spinners-kit";
import './ContentLoader.css'

const Loader = () => {
    return (
        <div className={'loaderWrapper'}>
            <MetroSpinner size={70} color="#686769" loading={true}/>
        </div>
        )
};

export default Loader;
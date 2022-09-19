import React from 'react';
import { MetroSpinner } from 'react-spinners-kit';
import './ContentLoader.css';

const Loader = ({ size, classNameCustom }) => {
  return (
    <div className={classNameCustom ? classNameCustom : 'loaderWrapper'}>
      <MetroSpinner size={size ? +size : 70} color="#686769" loading={true} />
    </div>
  );
};

export default Loader;

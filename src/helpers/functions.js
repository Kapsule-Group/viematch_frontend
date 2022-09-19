import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function getOption(label) {
  return (
    <div className={`status ${label}`}>
      <div>
        {label !== 'All networks' && <span />}
        {label}
      </div>
    </div>
  );
}

export const toastErrors = (res) => {
  if (res.error && res.error.response && res.error.response.data) {
    Object.entries(res.error.response.data)
      .map((el) => el.flat().join(': '))
      .forEach((el) => {
        toast(el, {
          progressClassName: 'red-progress',
        });
      });
  } else {
    toast('Something has gone wrong. Try one more time, pls!', {
      progressClassName: 'red-progress',
    });
  }
};

export function useDebounce(value, delay = 300) {
  const [debaunced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debaunced;
}

import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.scss';
import arrowDown from './img/arrow_down.png';
import { ReactComponent as New } from './img/new.svg';
import { ReactComponent as Partial } from './img/partial.svg';

function CustomSelect({ options, disabled, setArray }) {
  const [open, setOpen] = useState(false);
  let [selectedArr, addToSelectedArr] = useState([]);
  const uniqueValues = [...new Set(selectedArr)];

  const markAsSelect = (id) => {
    addToSelectedArr((oldArray) => [...oldArray, id]);

    console.log('add');
  };

  const unMarkedAsSelect = (id) => {
    addToSelectedArr(selectedArr.filter((item) => item !== id));

    console.log('remove');
  };

  const wrapperRef = useRef(null);
  const wrapedInputRef = useRef(null);

  function useOutsideAlerter(ref, ref2) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          ref.current &&
          ref2.current &&
          !ref.current.contains(event.target) &&
          !ref2.current.contains(event.target)
        ) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref, ref2]);
  }

  useOutsideAlerter(wrapperRef, wrapedInputRef);

  useEffect(() => {
    setArray(selectedArr);
  }, [selectedArr]);

  return (
    <div className={!disabled ? 'multi__select-dropdown disabled' : 'multi__select-dropdown '}>
      <button
        ref={wrapedInputRef}
        className="dropdown__elem"
        disabled={!disabled}
        onClick={() => setOpen(!open)}>
        {selectedArr.length > 0 ? (
          <p>
            {uniqueValues.map((item) =>
              options.filter((elem) => elem.id === item).map((txt) => <span>{txt.request}, </span>),
            )}
          </p>
        ) : (
          <p>Select invoices…</p>
        )}

        <img
          className={open ? 'dropdown__elem--icon up' : 'dropdown__elem--icon'}
          src={arrowDown}
          alt="arrow"
        />
      </button>
      {open && (
        <ul ref={wrapperRef} className="dropdown__list">
          {options.length === 0 && <p className="empty__list">No invoices</p>}
          {options &&
            options.map(({ id, request, payment_status, status }, idx) => (
              <>
                {selectedArr.includes(id) && (
                  <li
                    key={idx}
                    style={{ order: uniqueValues.indexOf(id) }}
                    className={selectedArr.includes(id) ? 'selected' : 'item'}>
                    <input
                      id={`invoice_${id}`}
                      type="checkbox"
                      checked={selectedArr.includes(id)}
                      onClick={() => {
                        selectedArr.includes(id) ? unMarkedAsSelect(id) : markAsSelect(id);
                      }}
                    />
                    <label htmlFor={`invoice_${id}`}>
                      <span>{status + ' ' + request}</span>
                      {payment_status === 'partial' ? (
                        <div className="label label-partial">
                          <Partial />
                          <p>{payment_status}</p>
                        </div>
                      ) : (
                        <div className="label label-new">
                          <New />
                          <p>{payment_status}</p>
                        </div>
                      )}
                    </label>
                  </li>
                )}
              </>
            ))}

          {selectedArr.length > 0 && <span className="measure"></span>}

          {options &&
            options.map(({ id, request, payment_status, status }, idx) => (
              <>
                {!selectedArr.includes(id) && (
                  <li key={idx} className={selectedArr.includes(id) ? 'selected' : 'item'}>
                    <input
                      id={`invoice_${id}`}
                      type="checkbox"
                      checked={selectedArr.includes(id)}
                      onClick={() => {
                        selectedArr.includes(id) ? unMarkedAsSelect(id) : markAsSelect(id);
                      }}
                    />
                    <label htmlFor={`invoice_${id}`}>
                      <span>{status + ' ' + request}</span>
                      {payment_status === 'partial' ? (
                        <div className="label label-partial">
                          <Partial />
                          <p>{payment_status}</p>
                        </div>
                      ) : (
                        <div className="label label-new">
                          <New />
                          <p>{payment_status}</p>
                        </div>
                      )}
                    </label>
                  </li>
                )}
              </>
            ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;

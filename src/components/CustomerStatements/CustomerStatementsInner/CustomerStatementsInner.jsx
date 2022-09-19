import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CalendarInput from '../../HelperComponents/CalendarInput/CalendarInput';
import DialogComponent from '../../HelperComponents/DialogComponent/DialogComponent';
import SelectComponent from '../../HelperComponents/SelectComponent/SelectComponent';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import balance_down from '../../../assets/image/balance_down.svg';
import balance_ok from '../../../assets/image/balance_ok.svg';
import balance_up from '../../../assets/image/balance_up.svg';
import Path from '../../../assets/image/Path.svg';
import ok from '../../../assets/image/ok_icon.svg';
import partial from '../../../assets/image/partial_icon.svg';
import new_icon from '../../../assets/image/new_icon.svg';
import edit_pen from '../../../assets/image/edit_pen.svg';
import print from '../../../assets/image/print.svg';
import arrow_b from '../../../assets/image/arrow_b.svg';
import './CustomerStatementsInner.scss';
import { BlobProvider } from '@react-pdf/renderer';
import PrintPDF from './PrintPDF';
import {
  getCustomerStatements,
  getCustomerStatementsHeader,
  addCustomerPayment,
  updateBalanceForward,
  getCustomerPDF,
  getFirstPaidOrders,
} from '../../../actions/customersActions';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import CurrencyInput from 'react-currency-input-field';
import arrow from '../../../assets/image/arrow_return.svg';
import CustomSelect from './CustomSelect/CustomSelect';
import Loader from './../../HelperComponents/ContentLoader/ContentLoader';

const CustomerStatementsInner = () => {
  const [dialog, toggleDialog] = useState({
    status: false,
  });
  const [dialogChange, toggleDialogChange] = useState({
    status: false,
  });
  const [dialogEdit, toggleDialogEdit] = useState({
    status: false,
  });

  const [specificInvoices, setSpecificInvoices] = useState(false);

  const closeDialog = () => {
    toggleDialog((prev) => ({ ...prev, status: false }));
    setAddPaymentData({
      date: new Date(),
      amount: null,
      method: {
        label: 'All methods',
        value: null,
      },
      order_ids: [],
    });
    setSpecificInvoices(false);
  };
  const closeDialogChange = () => {
    toggleDialogChange((prev) => ({ ...prev, status: false }));
  };

  const methods_list = [
    { label: 'Cash', value: 'cash' },
    { label: 'Check', value: 'check' },
    { label: 'Transfer', value: 'transfer' },
    { label: 'Mobile', value: 'mobile' },
  ];

  const closeDialogEdit = () => {
    toggleDialogEdit((prev) => ({ ...prev, status: false }));
  };
  const [startDate, setStartDate] = useState(new Date());
  const dispatch = useDispatch();

  const {
    statements,
    statements_success,
    statements_header_success,
    statements_header,
    pdfData,
    first_paid_orders,
    loading,
  } = useSelector(({ customers }) => customers);

  const refreshAndClose = () => {
    toggleDialog({ status: false });
    toggleDialogEdit({ status: false });
    dispatch(getCustomerStatements(id, 1));
    dispatch(getCustomerStatementsHeader(id));
    setSpecificInvoices(false);
    setAddPaymentData({
      date: new Date(),
      amount: null,
      method: {
        label: 'All methods',
        value: null,
      },
      order_ids: [],
    });
  };

  const [addPaymentData, setAddPaymentData] = useState({
    date: new Date(),
    amount: null,
    notes: '',
    method: {
      label: 'All methods',
      value: null,
    },
    order_ids: [],
  });

  const [filter, setFilter] = useState({
    page: 1,
    from: null,
    fromBasic: null,
    toBasic: null,
    to: null,
  });

  const [balanceForward, setBalanceForward] = useState({
    id: null,
    currency: null,
    balance: null,
    quarter: null,
  });

  const status_list = [
    { label: 'Cash', value: 'cash' },
    { label: 'Check', value: 'check' },
    { label: 'Bank Transfer', value: 'transfer' },
    { label: 'Mobile Money', value: 'mobile' },
  ];

  const id = window.location.href.split('/')[5];

  useEffect(() => {
    dispatch(getCustomerStatements(id, 1, null));
    dispatch(getCustomerStatementsHeader(id));
    dispatch(getCustomerPDF(id, 1, null));
    dispatch(getFirstPaidOrders(id));
  }, []);

  useEffect(() => {
    dispatch(getFirstPaidOrders(id));
  }, [dialog]);

  useEffect(() => {
    dispatch(
      getCustomerStatements(
        id,
        filter.page,
        filter.from !== null && filter.from,
        filter.to !== null && filter.to,
      ),
    );
    dispatch(
      getCustomerPDF(
        id,
        filter.page,
        filter.from !== null && filter.from,
        filter.to !== null && filter.to,
      ),
    );
  }, [filter]);

  return (
    <div className="customers_statements_inner content_block">
      <div className="custom_title_wrapper">
        <div className="link_req">
          <Link to="/main/customer-statements">
            <img src={Path} alt="Path" />
            Customer statements
          </Link>
        </div>
        <div className="title_page">
          {statements_header && statements_header.username && statements_header.username}
        </div>
        <span>
          TIN:{' '}
          {statements_header && statements_header.tin && statements_header.tin !== null
            ? statements_header.tin
            : '---'}{' '}
          / {statements_header && statements_header.region_name && statements_header.region_name}
        </span>
      </div>
      <div className="content_page">
        <div className="descriptions">total</div>
        <div className="total_inner">
          <div>
            <div>Sales</div>
            <p>
              {new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
              }).format(
                Number(
                  statements_header && statements_header.sales && statements_header.sales,
                ).toFixed(0),
              )}{' '}
              {statements_header && statements_header.currency && statements_header.currency}
            </p>
          </div>
          <div>
            <div>Paid</div>
            <p>
              {new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
              }).format(
                Number(
                  statements_header && statements_header.paid && statements_header.paid,
                ).toFixed(0),
              )}{' '}
              {statements_header && statements_header.currency && statements_header.currency}{' '}
              {statements_header_success && (
                <span
                  className={
                    statements_header.paid === statements_header.sales
                      ? 'ok'
                      : statements_header.current_amount < 0
                      ? 'up'
                      : 'down'
                  }>
                  {(isNaN(statements_header.paid / statements_header.sales) ||
                  statements_header.sales == 0
                    ? 0
                    : (statements_header.paid / statements_header.sales) * 100
                  ).toFixed(1)}
                  %
                </span>
              )}
            </p>
          </div>
          {statements_header_success && (
            <div>
              <div>Balance due</div>
              <span>
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(
                  Number(
                    statements_header.current_amount > 0
                      ? Math.abs(statements_header.balance_due)
                      : 0,
                  ).toFixed(0),
                )}{' '}
                {statements_header.currency}
                <p>
                  {statements_header.paid === statements_header.sales ? (
                    <img src={balance_ok} alt="ok" />
                  ) : statements_header.current_amount < 0 ? (
                    <img src={balance_up} alt="up" />
                  ) : (
                    <img src={balance_down} alt="down" />
                  )}
                </p>
              </span>
            </div>
          )}
          {statements_header_success && (
            <div>
              <div>Current amount </div>
              <p>
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(
                  Number(
                    statements_header.current_amount < 0
                      ? Math.abs(statements_header.current_amount)
                      : 0,
                  ).toFixed(0),
                )}{' '}
                {statements_header.currency}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="content_page">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="descriptions">
              <span>payments</span>
              <button onClick={() => toggleDialog({ status: true })}>+ ADD PAYMENT</button>
            </div>
            <div className="payments_panel">
              <div className="date">
                <span>From</span>
                <DatePicker
                  dateFormat="dd/MM/yy"
                  selected={filter.fromBasic}
                  onChange={(date) =>
                    setFilter({
                      ...filter,
                      fromBasic: date,
                      from: moment(date).format('YYYY-MM-DD'),
                    })
                  }
                  className="date-picker-custom"
                  timeFormat="p"
                  locale="en-GB"
                  popperPlacement="top"
                  customInput={<CalendarInput value={filter.fromBasic} />}
                  withPortal
                />
              </div>

              <div className="date">
                <span>To</span>
                <DatePicker
                  dateFormat="dd/MM/yy"
                  selected={filter.toBasic}
                  onChange={(date) =>
                    setFilter({
                      ...filter,
                      toBasic: date,
                      to: moment(date).format('YYYY-MM-DD'),
                    })
                  }
                  className="date-picker-custom"
                  timeFormat="p"
                  locale="en-GB"
                  popperPlacement="top"
                  customInput={<CalendarInput value={filter.toBasic} />}
                  withPortal
                />
              </div>

              <BlobProvider document={<PrintPDF pdfData={pdfData} />} textPDF={'data'}>
                {({ url, blob, loading }) => {
                  return (
                    <a href={url} target="_blank">
                      <button onClick={()=>console.log(pdfData)}>
                        <img src={print} alt="print" />
                        Statement extraction
                      </button>
                    </a>
                  );
                }}
              </BlobProvider>
            </div>
            <div className="payments_table">
              <div className="table_container transactions_columns">
                <div className="table_header">
                  <div className="table_row">
                    <div className="row_item">Date</div>
                    <div className="row_item">Type</div>
                    <div className="row_item">Method</div>
                    <div className="row_item">Amount</div>
                    <div className="row_item">Payment</div>
                    <div className="row_item">Note</div>
                    <div className="row_item"></div>
                  </div>
                </div>
                <div className="table_body">
                  {statements &&
                    statements.map(
                      (
                        {
                          id,
                          date,
                          type,
                          different_currency,
                          balance,
                          currency,
                          edit,
                          amount,
                          payment_status,
                          method,
                          notes,
                          count,
                        },
                        idx,
                      ) => (
                        <div
                          className={
                            type.type_obj === 'balance_forward'
                              ? amount > 0
                                ? 'table_row down'
                                : 'table_row  up'
                              : 'table_row'
                          }
                          key={idx}>
                          <div className={!count ? 'row_item light' : 'row_item'}>{date}</div>
                          <div className="row_item">
                            <div className={!count && 'light'}>
                              {type &&
                                type.type_obj &&
                                type.type_obj === 'order_auto_payment' &&
                                !count && <img src={arrow} alt="order_auto_payment" />}
                              {type.type_obj === 'clinic_payment' ||
                              type.type_obj === 'refund_payment'
                                ? 'Submitted amount'
                                : type.type_obj === 'order_payment'
                                ? 'Payment for '
                                : type.type_obj === 'order'
                                ? 'Invoice '
                                : type.type_obj === 'order_auto_payment' && count === true
                                ? 'Refunded Invoice '
                                : type.type_obj === 'order_auto_payment' && count === false
                                ? 'Auto-payment for '
                                : type.type_obj === 'balance_forward' && (
                                    <p>
                                      <p>Balance forward </p> by the end of the quarter{' '}
                                    </p>
                                  )}
                              {type.name}
                              {payment_status === 'paid' ? (
                                <span className="paid">
                                  <img src={ok} alt="ok" />
                                  Paid
                                </span>
                              ) : payment_status === 'partial' ? (
                                <span className="partial">
                                  <img src={partial} alt="partial" />
                                  Partial
                                </span>
                              ) : (
                                payment_status === 'new' && (
                                  <span className="new">
                                    <img src={new_icon} alt="new_icon" />
                                    New
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                          <div
                            className={
                              type &&
                              type.type_obj &&
                              type.type_obj === 'order_auto_payment' &&
                              !count
                                ? 'row_item light'
                                : 'row_item'
                            }>
                            {method
                              ? method === 'transfer'
                                ? 'Bank Transfer'
                                : method === 'mobile'
                                ? 'Mobile Money'
                                : method[0].toUpperCase() + method.slice(1)
                              : '-'}
                            {type &&
                              type.type_obj &&
                              type.type_obj === 'refund_payment' &&
                              ' - Refund'}
                          </div>
                          <div className={!count ? 'row_item light' : 'row_item'}>
                            {type.type_obj === 'order'
                              ? new Intl.NumberFormat('en-US', {
                                  minimumFractionDigits: 0,
                                }).format(Number(amount).toFixed(0)) +
                                ' ' +
                                currency
                              : '-'}
                            {type.type_obj === 'balance_forward' && type.type_obj === 'order' ? (
                              <span>
                                {
                                  <img
                                    src={edit_pen}
                                    alt="edit_pen"
                                    onClick={() => {
                                      toggleDialogEdit({ status: true });
                                      setBalanceForward({
                                        currency,
                                        quarter: type.name,
                                        id,
                                      });
                                    }}
                                  />
                                }
                              </span>
                            ) : null}
                          </div>
                          <div className={!count ? 'row_item light' : 'row_item'}>
                            {type.type_obj !== 'order' && currency && amount
                              ? new Intl.NumberFormat('en-US', {
                                  minimumFractionDigits: 0,
                                }).format(Number(amount).toFixed(0)) +
                                ' ' +
                                currency
                              : '-'}
                            {type.type_obj === 'balance_forward' ? (
                              <span>
                                {
                                  <img
                                    src={edit_pen}
                                    alt="edit_pen"
                                    onClick={() => {
                                      toggleDialogEdit({ status: true });
                                      setBalanceForward({
                                        currency,
                                        quarter: type.name,
                                        id,
                                      });
                                    }}
                                  />
                                }
                              </span>
                            ) : null}
                          </div>
                          <div
                            className={!count ? 'row_item light notes' : 'row_item notes'}
                            data-tip
                            data-for={`copy-btn-${id}`}>
                            {notes ? notes : '-'}
                          </div>

                          {notes && (
                            <ReactTooltip
                              id={`copy-btn-${id}`}
                              effect="solid"
                              place="top"
                              backgroundColor="#FFFFFF"
                              textColor="#334150"
                              className="tooltip">
                              <p>{notes}</p>
                            </ReactTooltip>
                          )}
                        </div>
                      ),
                    )}
                </div>
              </div>
            </div>
            {statements_success && (
              <div className="total_pay">
                <div>Total</div>
                <div>
                  {' '}
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                  }).format(
                    Number(
                      statements_header && statements_header.total && statements_header.total,
                    ).toFixed(0),
                  )}{' '}
                  {statements_header && statements_header.currency && statements_header.currency}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <DialogComponent open={dialog.status} onClose={closeDialog}>
        <div className="dialog_pay">
          <h2>Add payment</h2>
          <div className="payment-data-row">
            <div className="due-date-checkbox refund">
              <input
                type="checkbox"
                id="checkbox_1"
                checked={specificInvoices}
                onChange={() => {
                  setSpecificInvoices(!specificInvoices);
                }}
              />
              <label for="checkbox_1">Payment for specific invoices</label>
            </div>{' '}
          </div>
          <div className="block_field invoices">
            <CustomSelect
              options={first_paid_orders}
              disabled={specificInvoices}
              setArray={(array) =>
                setAddPaymentData({
                  ...addPaymentData,
                  order_ids: array,
                })
              }
            />
          </div>
          <div className="block_add_field">
            <div className="date">
              <span>Date</span>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={addPaymentData.date}
                onChange={(date) =>
                  setAddPaymentData({
                    ...addPaymentData,
                    date: new Date(date),
                  })
                }
                className="date-picker-custom"
                timeFormat="p"
                locale="en-GB"
                popperPlacement="top"
                customInput={<CalendarInput value={addPaymentData.date} />}
                withPortal
              />
            </div>
            {statements_success && (
              <div className="block_field">
                <span>Amount</span>

                <CurrencyInput
                  placeholder="0.00"
                  decimalsLimit={0}
                  intlConfig={{ locale: 'en-US' }}
                  onValueChange={(e) => {
                    setAddPaymentData({
                      ...addPaymentData,
                      amount: e,
                    });
                  }}
                />

                <p>
                  {' '}
                  {statements_header && statements_header.currency && statements_header.currency}
                </p>
              </div>
            )}
            <div className="method">
              <span>Method</span>
              <SelectComponent
                value={addPaymentData.method}
                options={status_list}
                change={(e) => {
                  setAddPaymentData({
                    ...addPaymentData,
                    method: { value: e.value, label: e.label },
                  });
                }}
                isClearable={false}
                isSearchable={false}
                placeholder="Select…"
              />
            </div>
          </div>
          <div className="payment-data-row block_field">
            <span>Note</span>
            <textarea
              className="payment-data--textarea"
              placeholder="Type here..."
              onChange={(e) =>
                setAddPaymentData({
                  ...addPaymentData,
                  notes: e.target.value,
                })
              }
              rows="4"></textarea>
          </div>
          <div className="btn_wrapper">
            <button className="cancel_btn" onClick={closeDialog}>
              CANCEL
            </button>
            <button
              onClick={() =>
                dispatch(
                  addCustomerPayment(id, {
                    ...addPaymentData,
                    order_ids: specificInvoices ? addPaymentData.order_ids : [],
                    method: addPaymentData.method.value,
                  }),
                ).then((res) => {
                  res && res.payload && res.payload.status === 201
                    ? refreshAndClose()
                    : Object.values(res.error.response.data)
                        .flat()
                        .forEach((el) => toast.error(el, {}));
                })
              }
              className={
                !addPaymentData.amount || !addPaymentData.amount || !addPaymentData.method.value
                  ? 'blue_btn_unactive'
                  : 'blue_btn'
              }
              disabled={
                !addPaymentData.amount || !addPaymentData.amount || !addPaymentData.method.value
              }>
              Add
            </button>
          </div>
        </div>
      </DialogComponent>

      <DialogComponent open={dialogEdit.status} onClose={closeDialogEdit}>
        <div className="dialog_edit">
          <h2>Balance forward</h2>
          <div className="block_add_field">
            <div className="block_field">
              <span>Balance</span>

              <CurrencyInput
                placeholder="0.00"
                decimalsLimit={0}
                intlConfig={{ locale: 'en-US' }}
                onValueChange={(e) => {
                  setBalanceForward({
                    ...balanceForward,
                    balance: e,
                  });
                }}
              />
              <p>{balanceForward.currency}</p>
            </div>
            <span>by the end of the quarter {balanceForward.quarter}</span>
          </div>
          <div className="btn_wrapper">
            <button className="cancel_btn" onClick={closeDialogEdit}>
              CANCEL
            </button>
            <button
              className={!balanceForward.balance ? 'blue_btn_unactive' : 'blue_btn'}
              disabled={!balanceForward.balance}
              onClick={() =>
                dispatch(
                  updateBalanceForward(balanceForward.id, {
                    amount: balanceForward.balance,
                  }),
                ).then((res) => {
                  res && res.payload && res.payload.status === 200
                    ? refreshAndClose()
                    : Object.values(res.error.response.data)
                        .flat()
                        .forEach((el) => toast.error(el, {}));
                })
              }>
              save
            </button>
          </div>
        </div>
      </DialogComponent>
      <DialogComponent open={dialogChange.status} onClose={closeDialogChange}>
        <div className="dialog_change">
          <h2>Change currency</h2>
          <div className="block_add_field">
            <div className="block_field">
              <span>Amount</span>
              <input placeholder="0.00" type="number" />
              <p>USD</p>
            </div>
            <p>
              <img src={arrow_b} alt="arrow_b" />
            </p>
            <div className="block_field">
              <span>Amount</span>
              <input placeholder="0.00" type="number" />
              <p>RWF</p>
            </div>
          </div>
          <div className="btn_wrapper">
            <button className="cancel_btn" onClick={closeDialogChange}>
              CANCEL
            </button>
            <button className={balanceForward.balance ? 'blue_btn_unactive' : 'blue_btn'}>
              save
            </button>
          </div>
        </div>
      </DialogComponent>
    </div>
  );
};

export default CustomerStatementsInner;

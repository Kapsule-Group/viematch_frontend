import React, { Component, Fragment, useImperativeHandle } from 'react';
import { ReactDOM } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'react-datepicker/dist/react-datepicker.css';

import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import CalendarInput from '../../HelperComponents/CalendarInput/CalendarInput';
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '../../HelperComponents/SelectComponent/SelectComponent';
import document from '../../../assets/image/document.svg';
import Path from '../../../assets/image/Path.svg';
import Edit from '../../../assets/image/edit.svg';
import Save from '../../../assets/image/save.svg';
import close from '../../../assets/image/close.svg';
import { createNumberMask } from 'redux-form-input-masks';
import './OrdersInner.scss';
import RenderField, {
  ReduxFormSelect,
  renderDatePicker,
} from './../../HelperComponents/RenderField/RenderField';

import DialogComponent from '../../HelperComponents/DialogComponent/DialogComponent';

import { toast } from 'react-toastify';

import moment from 'moment';

import { getRegions } from '../../../actions/managersActions';

import { createOrder } from '../../../actions/ordersActions';
import {
  getInvoiceOptions,
  getInvoiceProductOptions,
  userQuickCreate,
  productQuickCreate,
} from '../../../actions/invoiceActions';

import { reduxForm, Field, FieldArray, formValueSelector, change } from 'redux-form';

class RenderItems extends Component {
  render() {
    const {
      fields,
      meta: { error },
      products,
      itemsArr,
      change,
      openProductAct,
      regionsList,
      currency,
      vat,
      vatPercent,
      discountPercent,
      ref,
      sumItemsArr,
    } = this.props;

    const currencyMask = createNumberMask({
      decimalPlaces: 0,
      locale: 'en-US',
    });

    return (
      <>
        <div className="products">
          <div className="title-wrapper">
            <div className="title_block mb0">products</div>

            <div onClick={() => openProductAct()} className="add-btn">
              + CREATE PRODUCT
            </div>
          </div>
          {fields.map((item, idx) => (
            <div key={idx} className="block block-column">
              <div className="block-row">
                <div className="product-order">#{idx + 1}</div>
                <div>
                  <span>Product name</span>

                  <FormControl className="select_wrapper">
                    <Field
                      name={`${item}.name`}
                      placeholder="Select…"
                      className="wide-field"
                      options={
                        products &&
                        products.map((el) => ({
                          label: el.name,
                          value: el.name,
                          id: el.id,
                          price: el.price,
                          pack_size: el.pack_size,
                          expiration_date: el.expiration_date ? new Date(el.expiration_date) : null,
                        }))
                      }
                      component={ReduxFormSelect}
                      isClearable={false}
                      isSearchable={true}
                      onChange={(e) => {
                        change(`${item}`, e);
                      }}
                    />
                  </FormControl>
                </div>
              </div>

              <div className="block-row">
                <div>
                  <span>Pack size</span>

                  <Field name={`${item}.pack_size`} component={RenderField} type="string" />
                </div>
                <div>
                  <span>Quantity</span>
                  <Field
                    name={`${item}.quantity`}
                    placeholder="0"
                    component={RenderField}
                    type="tel"
                    {...currencyMask}
                    onChange={(e, value) =>
                      change(
                        `${item}.total`,
                        itemsArr && itemsArr[idx] && itemsArr[idx].price
                          ? +itemsArr[idx].price * +value
                          : '',
                      )
                    }
                  />
                </div>
                <div>
                  <span>Availability</span>

                  <Field name={`${item}.availability`} component={RenderField} type="string" />
                </div>
                <div>
                  <span>Price</span>
                  <Field
                    name={`${item}.price`}
                    placeholder="0"
                    component={RenderField}
                    type="tel"
                    {...currencyMask}
                    currency={currency}
                    onChange={(e, value) =>
                      change(
                        `${item}.total`,
                        itemsArr && itemsArr[idx] && itemsArr[idx].quantity
                          ? +itemsArr[idx].quantity * +value
                          : +value,
                      )
                    }
                  />
                </div>
                <div>
                  <span>Total price</span>
                  <Field
                    name={`${item}.total`}
                    placeholder="0"
                    component={RenderField}
                    type="tel"
                    {...currencyMask}
                    disabled
                    currency={currency}
                  />
                </div>
                <div>
                  <span>Expiration date</span>
                  <Field
                    isClearable
                    name={`${item}.expiration_date`}
                    isExpiration
                    component={renderDatePicker}
                  />
                </div>
                <div>
                  <span>Delivery date</span>
                  <Field name={`${item}.delivery_date`} component={renderDatePicker} />
                </div>
                {itemsArr && itemsArr.length > 1 && (
                  <button
                    aria-label="Удалить ордер"
                    type="button"
                    onClick={() => fields.remove(idx)}>
                    <img src={close} alt="close" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="btn-wrapper-add">
            <button type="button" onClick={() => fields.push({})} className="add-more">
              + ADD more
            </button>

            <div className="total_block">
              <div>
                <p>Subtotal</p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                  }).format(sumItemsArr.toFixed(0))}{' '}
                  {currency != null ? currency : ''}
                </p>
              </div>
              <div>
                <p>VAT {vatPercent ? `${vatPercent}%` : ''}</p>
                <p>
                  {vatPercent
                    ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 0,
                      }).format(
                        (sumItemsArr * ((vatPercent && vatPercent ? vatPercent : 0) / 100)).toFixed(
                          0,
                        ),
                      )
                    : '-'}{' '}
                  {currency != null ? currency : ''}
                </p>
              </div>
              <div>
                <p>Discount {discountPercent ? `${discountPercent}%` : ''} </p>
                <p>
                  {vatPercent
                    ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 0,
                      }).format(
                        (
                          sumItemsArr *
                          ((discountPercent && discountPercent ? discountPercent : 0) / 100)
                        ).toFixed(0),
                      )
                    : '-'}{' '}
                  {currency != null ? currency : ''}
                </p>
              </div>
              <div>
                <p>Total</p>
                <p>
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                  }).format(
                    (
                      sumItemsArr *
                      (vatPercent ? 1 + vatPercent / 100 : 1) *
                      (discountPercent ? 1 - discountPercent / 100 : 1)
                    ).toFixed(0),
                  )}{' '}
                  {currency != null ? currency : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

class OrdersInnerAdd extends Component {
  state = {
    startDate: null,

    status_list: [
      { label: 'New', value: 'new' },
      { label: 'Partial', value: 'partial' },
      { label: 'Overdue', value: 'overdue' },
      { label: 'Paid', value: 'paid' },
    ],
    currencies_list: [
      { label: 'RWF', value: 'RWF' },
      { label: 'BRF', value: 'BRF' },
      { label: 'USD', value: 'USD' },
      { label: 'KSh', value: 'KSh' },
    ],
    file: null,
    openCustomer: false,
    openConfirmBalance: false,
    balance: null,
    error: null,
    customerName: '',
    addRegion: '',
    productName: '',
    openProduct: false,
    tax_file: null,

    notes: '',
    vatPercent: '',
    discountPercent: '',

    confirm_balance: {
      editable: false,
      second_ste: false,
      changedBalance: '0.00',
    },
  };
  constructor(props) {
    super(props);
    this.balanceRef = React.createRef();
  }

  componentDidMount() {
    const { getInvoiceOptions, getInvoiceProductOptions, getRegions } = this.props;
    getInvoiceOptions();
    getInvoiceProductOptions();
    getRegions();
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event });
  };

  submitForm = (data) => {
    const { createOrder, history, sumItemsArr, formInfo } = this.props;
    const { file, tax_file, notes, confirm_balance, vatPercent, discountPercent } = this.state;
    const formData = new FormData();
    file && formData.append('invoice_file', file);
    data.request && formData.append('request', data.request);
    data.user && formData.append('user', data.user.id);

    tax_file && formData.append('tax_invoice_file', tax_file);

    confirm_balance.changedBalance !== '0.00' &&
      formData.append('balance', confirm_balance.changedBalance);

    data.due_date &&
      formData.append(
        'due_date',
        moment(data.due_date)
          //.utcOffset(0)
          .format('YYYY-MM-DD'),
      );
    data.balance && formData.append('balance', data.balance);
    data.payment_status && formData.append('payment_status', data.payment_status.value);
    data.currency &&
      formData.append(
        'currency',
        formInfo &&
          formInfo &&
          formInfo.user &&
          formInfo.user.region &&
          formInfo.user.region.currency &&
          formInfo.user.region.currency,
      );
    notes && formData.append('notes', notes);

    vatPercent && formData.append('vat', vatPercent);
    discountPercent && formData.append('discount', discountPercent);

    data.items &&
      formData.append(
        'items',
        JSON.stringify(
          data.items &&
            data.items.map((el, idx) => ({
              quantity: el.quantity,
              availability: el.availability,
              price_per_unit: el.price,
              delivery_date: el.delivery_date,
              expiration_date: el.expiration_date
                ? moment(el.expiration_date).format('YYYY-MM-DD')
                : null,
              pack_size: el.pack_size,
              product: el.name.id,
            })),
        ),
      );

    createOrder(formData).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        history.push('/main/orders');
      } else {
        if (res.error && res.error.response && res.error.response.data) {
          Object.values(res.error.response.data)
            .flat()
            .forEach((el) =>
              toast(el, {
                progressClassName: 'red-progress',
              }),
            );
        } else {
          toast('Something went wrong.', {
            progressClassName: 'red-progress',
          });
        }
      }
    });
  };

  render() {
    const {
      file,
      openCustomer,
      error,
      customerName,
      addRegion,
      productName,
      openProduct,
      tax_file,
      notes,
      discountPercent,
      vatPercent,
      confirm_balance,
    } = this.state;
    const {
      handleSubmit,
      users,
      formInfo,
      products,
      itemsArr,
      change,
      userQuickCreate,
      productQuickCreate,
      regionsList,

      loading,
    } = this.props;

    let sumItemsArr = 0;
    itemsArr &&
      itemsArr.forEach(({ quantity, price }) => {
        const mult = quantity * price;
        if (!isNaN(mult)) {
          sumItemsArr += mult;
        }
      });

    return (
      <form className="order_page_inner content_block" onSubmit={handleSubmit(this.submitForm)}>
        <div className="custom_title_wrapper">
          <div className="link_req">
            <Link to="/main/orders">
              <img src={Path} alt="Path" />
              Orders
            </Link>
          </div>
          <div className="title_page">Add invoice</div>
          <div className="content_page">
            <div className="title_block">general info</div>
            <div className="general_info">
              <div className="block_field first-row">
                <div>
                  <span>Currency</span>

                  <p className="currency-text">
                    {formInfo &&
                    formInfo &&
                    formInfo.user &&
                    formInfo.user.region &&
                    formInfo.user.region.currency
                      ? formInfo.user.region.currency
                      : '--'}
                  </p>
                </div>
                <div>
                  <span>Balance due</span>
                  <div className="balance-block--currency">
                    <span className="balance-value">
                      {new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 0,
                      }).format(
                        Number(
                          sumItemsArr +
                            sumItemsArr *
                              ((formInfo && formInfo.user && formInfo.user.vat
                                ? formInfo.user.vat
                                : 0) /
                                100),
                        ).toFixed(0),
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="block_field">
                <div>
                  <span>Customer</span>
                  <FormControl className="select_wrapper">
                    <Field
                      name={`user`}
                      placeholder="Select…"
                      className="wide-field"
                      options={
                        users &&
                        users.map((el) => ({
                          label: el.username,
                          value: el.username,
                          region: el.region,
                          vat: el.region && el.region.vat && el.region.vat,
                          id: el.id,
                        }))
                      }
                      component={ReduxFormSelect}
                      isClearable={false}
                      isSearchable={true}
                    />
                  </FormControl>
                </div>
                <div onClick={() => this.setState({ openCustomer: true })} className="add-btn mt40">
                  + ADD CUSTOMER
                </div>
              </div>
              <div className="block_field block_field_more data-picker second-row">
                {this.props.role !== 'sales' && (
                  <div id="due_date">
                    <span>Due date</span>

                    <Field name={`due_date`} component={renderDatePicker} />
                  </div>
                )}
                <div id="vat" className="block_field vat-block">
                  <span>VAT</span>
                  <label className="block-input">
                    <Field
                      className="discount-input"
                      placeholder="0"
                      name={`vat`}
                      component={RenderField}
                      onChange={(e) =>
                        this.setState({
                          vatPercent: e.target.value,
                        })
                      }
                    />
                    <p>%</p>
                  </label>
                </div>
                <div id="discount" className="block_field vat-block">
                  <span>Discount</span>
                  <label className="block-input">
                    <Field
                      className="discount-input"
                      name={`discount`}
                      component={RenderField}
                      placeholder="0"
                      onChange={(e) =>
                        this.setState({
                          discountPercent: e.target.value,
                        })
                      }
                    />
                    <p>%</p>
                  </label>
                </div>
              </div>

              <div className="block_field block_field_more">
                <div>
                  <span>Balance note</span>

                  <textarea
                    name={`notes`}
                    className="order-textarea"
                    placeholder="Type here..."
                    onChange={(e) =>
                      this.setState({
                        notes: e.target.value,
                      })
                    }
                    rows="2"></textarea>
                </div>
              </div>
            </div>
            <div className="documents">
              <div className="title_block">documents</div>
              <>
                {tax_file && (
                  <div className="block">
                    <span>Tax invoice</span>
                    <div>
                      <img src={document} alt="document" />
                      <p>{tax_file.name}</p>
                      <button
                        onClick={() =>
                          this.setState({
                            tax_file: null,
                          })
                        }>
                        <img src={close} alt="close" />
                      </button>
                    </div>
                  </div>
                )}

                {!tax_file && (
                  <div className="block">
                    <span>Tax invoice</span>

                    <label for="fileInp" className="blue_btn">
                      Upload
                    </label>
                    <input
                      style={{
                        display: 'none',
                      }}
                      type="file"
                      id="fileInp"
                      onChange={(e) => {
                        let tax_file = e.target.files[0];
                        this.setState({
                          tax_file,
                        });
                      }}
                    />
                  </div>
                )}
              </>

              {file && (
                <div className="block">
                  <span>Invoice</span>
                  <div>
                    <img src={document} alt="document" />
                    <p>{file.name}</p>
                    <button onClick={() => this.setState({ file: null })}>
                      <img src={close} alt="close" />
                    </button>
                  </div>
                </div>
              )}
              {!file && (
                <div className="block">
                  <span>Invoice</span>

                  <label for="fileInp" className="blue_btn">
                    Upload
                  </label>
                  <input
                    style={{
                      display: 'none',
                    }}
                    type="file"
                    id="fileInp"
                    onChange={(e) => {
                      let file = e.target.files[0];
                      this.setState({
                        file,
                      });
                    }}
                  />
                </div>
              )}
            </div>
            <FieldArray
              name={`items`}
              component={RenderItems}
              currency={
                formInfo &&
                formInfo.user &&
                formInfo.user.region &&
                formInfo.user.region.currency &&
                formInfo.user.region.currency
              }
              vat={formInfo && formInfo.user && formInfo.user.vat && formInfo.user.vat}
              vatPercent={vatPercent}
              discountPercent={discountPercent}
              products={products}
              itemsArr={itemsArr}
              sumItemsArr={sumItemsArr}
              change={change}
              openProductAct={() => this.setState({ openProduct: true })}
            />

            <div className="wrapper_btn">
              <div>
                <button
                  disabled={loading}
                  className={loading ? 'blue_btn_unactive' : 'blue_btn_bg'}
                  formAction>
                  Add invoice
                </button>
              </div>
            </div>
          </div>
        </div>
        <DialogComponent
          open={openCustomer}
          onClose={() => {
            this.setState({
              openCustomer: false,
              customerName: '',
              addRegion: '',
              error: null,
            });
          }}>
          <div className="edit_dialog">
            <div className="title">Add customer </div>
            <div className={'block_add_field row'}>
              <div className="name">
                <div className="block_field row">
                  <span>Name</span>
                  <span className={error ? '' : ''} />
                </div>
                <input
                  onChange={(e) =>
                    this.setState({
                      customerName: e.target.value,
                    })
                  }
                  value={customerName}
                  type="text"
                  placeholder="Type here..."
                />
              </div>
              <div className="name region__dropdown">
                <span>Region</span>
                <SelectComponent
                  change={this.handleChange('addRegion')}
                  options={
                    regionsList &&
                    regionsList.map((el) => ({
                      label: el.label,
                      value: el.value,
                      id: el.id,
                    }))
                  }
                  name={`region`}
                  isClearable={false}
                  isSearchable={true}
                  placeholder="Select…"
                />
              </div>
            </div>
            <span className={this.state.error ? 'error visible' : 'error'}>{this.state.error}</span>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    openCustomer: false,
                    customerName: '',
                    addRegion: '',
                    error: null,
                  });
                }}>
                Cancel
              </button>
              <button
                className={!customerName || !addRegion ? 'blue_btn_unactive' : 'blue_btn'}
                disabled={!customerName || !addRegion}
                onClick={() => {
                  userQuickCreate({
                    username: customerName,
                    region: addRegion.value,
                  }).then((res) => {
                    if (res.payload && res.payload.status && res.payload.status === 201) {
                      const { username, id } = res.payload.data;
                      change('user', {
                        label: username,
                        value: username,
                        id: id,
                      });
                      this.setState({
                        openCustomer: false,
                        customerName: '',
                        addRegion: '',
                        error: null,
                      });
                    } else {
                    }
                  });
                }}>
                Add
              </button>
            </div>
          </div>
        </DialogComponent>
        <DialogComponent
          open={openProduct}
          onClose={() => {
            this.setState({
              openProduct: false,
              productName: '',
              error: null,
            });
          }}>
          <div className="edit_dialog">
            <div className="title">Create product</div>
            <div className={'block_add_field'}>
              <div className="name">
                <div className="block_field row">
                  <span>Name</span>
                  <span className={error ? '' : ''} />
                </div>
                <input
                  onChange={(e) =>
                    this.setState({
                      productName: e.target.value,
                    })
                  }
                  value={productName}
                  type="text"
                  placeholder="Type here..."
                />
              </div>
            </div>
            <span className={this.state.error ? 'error visible' : 'error'}>{this.state.error}</span>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    openProduct: false,
                    productName: '',
                    error: null,
                  });
                }}>
                Cancel
              </button>
              <button
                className={
                  productName === null || productName === '' ? 'blue_btn_unactive' : 'blue_btn'
                }
                disabled={productName === null || productName === ''}
                onClick={() => {
                  productQuickCreate({
                    name: productName,
                  }).then((res) => {
                    if (res.payload && res.payload.status && res.payload.status === 201) {
                      const { name, id } = res.payload.data;
                      change('items', [
                        {
                          name: {
                            label: name,
                            value: name,
                            id: id,
                          },
                        },
                        ...itemsArr,
                      ]);
                      this.setState({
                        openProduct: false,
                        productName: '',
                        error: null,
                      });
                    } else {
                    }
                  });
                }}>
                Add
              </button>
            </div>
          </div>
        </DialogComponent>
      </form>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.request) {
    errors.request = 'Required field';
  }
  if (!values.user) {
    errors.user = 'Required field';
  }
  if (!values.payment_status) {
    errors.payment_status = 'Required field';
  }
  if (!values.items || !values.items.length) {
    errors.items = 'You must fill in at least 1 product line.';
  } else {
    const itemsArrayErrors = [];
    values.items.forEach((el, idx) => {
      const itemsErrors = {};
      if (!el || !el.name) {
        itemsErrors.name = 'Required field';
        itemsArrayErrors[idx] = itemsErrors;
      }
      if (!el || !el.quantity) {
        itemsErrors.quantity = 'Required field';
        itemsArrayErrors[idx] = itemsErrors;
      }
      if (!el || !el.price) {
        itemsErrors.price = 'Required field';
        itemsArrayErrors[idx] = itemsErrors;
      }
    });
    if (itemsArrayErrors.length) {
      errors.items = itemsArrayErrors;
    }
  }

  return errors;
};

const OrdersInnerAddForm = reduxForm({
  form: 'OrdersInnerAdd',
  validate,
  enableReinitialize: true,
})(OrdersInnerAdd);

const selector = formValueSelector('OrdersInnerAdd');

function mapStateToProps(state) {
  return {
    categories: state.dashboard.categories,
    users: state.invoices.invoice_options,
    regionsList: state.managers.regionsList,
    loading: state.orders.loading,
    formInfo:
      state.form &&
      state.form.OrdersInnerAdd &&
      state.form.OrdersInnerAdd.values &&
      state.form.OrdersInnerAdd.values,
    products: state.invoices.invoice_product_options,
    currency: state.auth.data.currency,
    itemsArr: selector(state, 'items'),
    initialValues: {
      items: [{}],
      currency: {
        label: state.auth.data.currency,
        value: state.auth.data.currency,
      },
    },
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createOrder,
      getInvoiceOptions,
      getInvoiceProductOptions,
      change,
      userQuickCreate,
      getRegions,
      productQuickCreate,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersInnerAddForm);

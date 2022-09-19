import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'react-datepicker/dist/react-datepicker.css';
import generateProformaPDF from './generateProformaPDF';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import CalendarInput from '../../HelperComponents/CalendarInput/CalendarInput';
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '../../HelperComponents/SelectComponent/SelectComponent';
import document from '../../../assets/image/document.svg';
import Path from '../../../assets/image/Path.svg';
import close from '../../../assets/image/close.svg';
import { createNumberMask } from 'redux-form-input-masks';
import ReactTooltip from 'react-tooltip';
import './OrdersInner.scss';
import RenderField, {
  ReduxFormSelect,
  renderDatePicker,
  renderDatePickerHours,
  renderCheckbox,
} from './../../HelperComponents/RenderField/RenderField';
import DialogComponent from '../../HelperComponents/DialogComponent/DialogComponent';
import { data_image } from './imagedata';
import Loader from './../../HelperComponents/ContentLoader/ContentLoader';
import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Edit from '../../../assets/image/edit.svg';
import Save from '../../../assets/image/save.svg';
import Copy from '../../../assets/image/copy_icon.svg';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Attention from '../../../assets/image/attention.svg';
import OverdueImg from '../../../assets/image/no_actions.svg';
import PartialImg from '../../../assets/image/no-partial.svg';
import PaidImg from '../../../assets/image/no-ok.svg';
import moment from 'moment';
import { submit } from 'redux-form';
import {
  createOrder,
  getSingleOrder,
  changeOrder,
  changeSalesOrder,
  partialChangeOrder,
  getSalesList,
  paymentGet,
  toApproval,
  approveRequest,
  paymentCreate,
  markPaid,
  checkEstimateBalance,
} from '../../../actions/ordersActions';
import {
  getInvoiceOptions,
  getInvoiceProductOptions,
  getActivityOrder,
  productQuickCreate,
} from '../../../actions/invoiceActions';
import AlertImg from '../../../assets/image/alert.svg';
import generatePDF from './generatePDF';
import Print from '../../../assets/image/print.svg';
import { BlobProvider } from '@react-pdf/renderer';
import ProformaPDF from './ProformaPDF';
import InvoicePDF from './InvoicePDF';

import { reduxForm, Field, FieldArray, formValueSelector, change } from 'redux-form';

const renderItems = ({
  fields,
  meta: { error },
  products,
  itemsArr,
  change,
  formInformation,
  user,
  sales_rep,
  orders,
  role,
  status,
  currency,
  regionData,
  disallowSubmitForm,
  allowSubmitForm,
  checkFunction,
  showState,
  region,
  openProductAct,
  openAddPayment,
  returnIsDisabled,
}) => {
  let sum = 0;
  itemsArr &&
    itemsArr.forEach(({ quantity, price }) => {
      const mult = +quantity * +price;
      if (!isNaN(mult)) {
        sum += mult;
      }
    });
  const currencyMask = createNumberMask({
    decimalPlaces: 0,
    locale: 'en-US',
  });

  return (
    <>
      <div className="products">
        <div className="title-wrapper">
          <div className="title_block mb0">products</div>

          {status === 'proforma' && (
            <div onClick={() => openProductAct()} className="add-btn">
              + ADD PRODUCT
            </div>
          )}
        </div>{' '}
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
                    disabled={status !== 'proforma'}
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

                <Field
                  disabled={status !== 'proforma'}
                  name={`${item}.pack_size`}
                  component={RenderField}
                  type="string"
                />
              </div>
              <div>
                <span>Quantity</span>
                <Field
                  name={`${item}.quantity`}
                  placeholder="0"
                  component={RenderField}
                  disabled={status !== 'proforma'}
                  type="tel"
                  {...currencyMask}
                  onChange={(e, value) => {
                    change(
                      `${item}.total`,
                      itemsArr && itemsArr[idx] && itemsArr[idx].price
                        ? +itemsArr[idx].price * +value
                        : '',
                    );
                    setTimeout(() => {
                      checkFunction();
                    }, 500);
                  }}
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
                  disabled={status !== 'proforma'}
                  onChange={(e, value) => {
                    change(
                      `${item}.total`,
                      itemsArr && itemsArr[idx] && itemsArr[idx].quantity
                        ? +itemsArr[idx].quantity * +value
                        : +value,
                    );
                    setTimeout(() => {
                      checkFunction();
                    }, 500);
                  }}
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
                  isExpiration
                  isClearable
                  disabled={status !== 'proforma'}
                  name={`${item}.expiration_date`}
                  component={renderDatePicker}
                />
              </div>
              <div>
                <span>Delivery date</span>
                <Field
                  disabled={status !== 'proforma'}
                  name={`${item}.delivery_date`}
                  component={renderDatePicker}
                />
              </div>
              {itemsArr && itemsArr.length > 1 && status === 'proforma' && (
                <button aria-label="Удалить ордер" type="button" onClick={() => fields.remove(idx)}>
                  <img src={close} alt="close" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="btn-wrapper-add">
          {status === 'proforma' && (
            <button type="button" onClick={() => fields.push({})} className="add-more">
              + ADD more
            </button>
          )}
          <div className="total_block">
            <div>
              <p>Subtotal</p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(sum.toFixed(0))}{' '}
                {currency != null ? currency : ''}
              </p>
            </div>
            <div>
              <p>
                VAT of{' '}
                {formInformation && formInformation.values && formInformation.values.vat
                  ? formInformation.values.vat
                  : 0}
                %
              </p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(
                  (
                    sum *
                    ((formInformation && formInformation.values && formInformation.values.vat
                      ? formInformation.values.vat
                      : 0) /
                      100)
                  ).toFixed(0),
                )}{' '}
                {currency != null ? currency : ''}
              </p>
            </div>

            <div>
              <p>
                Discount{' '}
                {formInformation && formInformation.values && formInformation.values.discount
                  ? formInformation.values.discount
                  : 0}
                %
              </p>
              <p>
                {new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 0,
                }).format(
                  (
                    sum *
                    ((formInformation && formInformation.values && formInformation.values.discount
                      ? formInformation.values.discount
                      : 0) /
                      100)
                  ).toFixed(0),
                )}{' '}
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
                    sum *
                    (formInformation && formInformation.values && formInformation.values.vat
                      ? 1 + formInformation.values.vat / 100
                      : 1) *
                    (formInformation && formInformation.values && formInformation.values.discount
                      ? 1 - formInformation.values.discount / 100
                      : 1)
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
};
class OrdersSalesInnerEdit extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  state = {
    startDate: null,
    role: '',

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
    methods_list: [
      { label: 'Cash', value: 'cash' },
      { label: 'Check', value: 'check' },
      { label: 'Transfer', value: 'transfer' },
      { label: 'Mobile', value: 'mobile' },
    ],
    file: null,
    proceed: false,
    openRequestDialog: false,
    openOrderDialog: false,
    openDeliveryDialog: false,
    openInvoiceDialog: false,
    receiptFile: false,
    is_rejected: null,
    namesOfStatuses: {
      all: 'All',
      request: 'Request',
      proforma: 'Proforma',
      order: 'Purchase order',
      delivery: 'Delivery in progress',
      delivered: 'P.O. delivered',
      invoice: 'Invoice',
      receipt: 'Receipt',
    },
    openProduct: false,
    openPayment: false,
    productName: '',
    paymentValue: '',
    saveChangesParam: false,

    error: null,
    tax_file: null,
    rejectDialog: false,
    confirm_balance: {
      editable: false,
      confirmedPopup: false,
      changedBalance: null,
    },
    overdueOrder: false,
    paymentDate: new Date(),
    isFirst: true,
    allowSubmit: true,
  };

  componentDidMount() {
    const {
      getInvoiceOptions,
      getInvoiceProductOptions,
      getSingleOrder,
      paymentGet,
      role,

      match: {
        params: { id },
      },
      getSalesList,
    } = this.props;

    getInvoiceOptions();
    getInvoiceProductOptions();
    getSingleOrder(id).then((res) => {
      res &&
        res.error &&
        (res.error.request.status === 500 || res.error.request.status === 400) &&
        toast(res.error.request.statusText, {
          progressClassName: 'red-progress',
        });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.is_overdue !== this.props.data.is_overdue) {
      this.setState({ overdueOrder: this.props.data.is_overdue });
    }

    const {
      paymentGet,
      role,

      match: {
        params: { id },
      },
      salesList,
      getSalesList,
    } = this.props;

    if (role && role !== 'sales') {
      if (this.state.isFirst) {
        paymentGet('', id);
        getSalesList();
        this.setState({ isFirst: false });
      }
    }
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event });
  };

  submitForm = (data) => {
    const {
      changeOrder,
      changeSalesOrder,
      history,
      role,
      match: {
        params: { id },
      },
      toApproval,
      data: { status, payment_status },
      approveRequest,
      markPaid,
    } = this.props;
    if (status === 'sales_to_approve') {
      approveRequest(id, { approve: true }).then((res) => {
        const {
          location: { search },
        } = this.props;
        const salesId = new URLSearchParams(search).get('id');

        if (res.payload && res.payload.status && res.payload.status === 200) {
          history.push(salesId ? `/main/inner-sales/${salesId}` : '/main/orders');
          return;
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
          return;
        }
      });
      return;
    }
    const formData = new FormData();

    const { file, proceed, receiptFile, tax_file, overdueOrder, saveChangesParam } = this.state;

    // if (status === "invoice") {
    //   formData.append("is_overdue", overdueOrder);
    // }
    // if (status === 'invoice' && payment_status !== 'paid') {
    //   markPaid(id).then((res) => {
    //     const {
    //       location: { search },
    //     } = this.props;
    //     const salesId = new URLSearchParams(search).get('id');

    //     if (res.payload && res.payload.status && res.payload.status === 200) {
    //       history.push(salesId ? `/main/inner-sales/${salesId}` : '/main/orders');
    //     }
    //   });
    //   return;
    // }
    file && formData.append('invoice_file', file);
    receiptFile && formData.append('receipt_file', receiptFile);
    tax_file && formData.append('tax_invoice_file', tax_file);
    data.request && formData.append('request', data.request);
    data.user && formData.append('user', data.user.id);
    data.discount && formData.append('discount', data.discount);
    data.vat && formData.append('vat', data.vat);
    data.due_date &&
      formData.append(
        'due_date',
        moment(data.due_date)
          .utcOffset(0)
          .format('YYYY-MM-DD'),
      );
    data.date &&
      formData.append(
        'date',
        moment(data.date)
          .utcOffset(0)
          .format('YYYY-MM-DD HH:mm:ss'),
      );

    if (!saveChangesParam) {
      if (status === 'sales_review' || status === 'sales_rejected') {
        formData.append('status', 'proforma');
      }
    }

    // if (status === "invoice") {
    //   data.balance && formData.append("balance", 0);
    // } else {
    //   data.balance && formData.append("balance", data.balance);
    // }

    // data.payment_status &&
    //   formData.append("payment_status", data.payment_status.value);
    data.currency && formData.append('currency', data.currency.value);
    data.sales && data.sales.id && formData.append('sales_rep', data.sales.id);
    status !== 'proforma' &&
      status !== 'sales_review' &&
      status !== 'sales_rejected' &&
      data.items &&
      formData.append(
        'items',
        JSON.stringify(
          data.items &&
            data.items.map((el, idx) => ({
              availability: el.availability,
            })),
        ),
      );

    (status === 'sales_rejected' || status === 'proforma' || status === 'sales_review') &&
      data.items &&
      formData.append(
        'items',
        JSON.stringify(
          data.items &&
            data.items.map((el, idx) => ({
              item_id: el.idProd,
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

    // formData.append("proceed", proceed);

    if (status === 'proforma') {
      changeOrder(id, formData, status).then((res) => {
        const {
          location: { search },
        } = this.props;
        const salesId = new URLSearchParams(search).get('id');

        if (res.payload && res.payload.status && res.payload.status === 200) {
          history.push(salesId ? `/main/inner-sales/${salesId}` : '/main/orders');
        } else {
          if (res.error && res.error.response && res.error.response.data) {
            Object.values(res.error.response.data)
              .flat()
              .forEach((el) => {
                toast(el === '"null" is not a valid choice.' ? `Currency can't be empty.` : el, {
                  progressClassName: 'red-progress',
                });
                toast(el && el.product && el.product[0], {
                  progressClassName: 'red-progress',
                });
              });
          } else {
            toast('Something went wrong.', {
              progressClassName: 'red-progress',
            });
          }
        }
      });
    }

    if (status === 'sales_review' || status === 'sales_rejected') {
      changeOrder(id, formData, status).then((res) => {
        const {
          location: { search },
        } = this.props;
        const salesId = new URLSearchParams(search).get('id');

        if (res.payload && res.payload.status && res.payload.status === 200) {
          history.push(salesId ? `/main/inner-sales/${salesId}` : '/main/orders');
          return;
        } else {
          if (res.error && res.error.response && res.error.response.data) {
            Object.values(res.error.response.data)
              .flat()
              .forEach((el) => {
                toast(el === '"null" is not a valid choice.' ? `Currency can't be empty.` : el, {
                  progressClassName: 'red-progress',
                });
              });
          } else {
            toast('Something went wrong.', {
              progressClassName: 'red-progress',
            });
          }
          return;
        }
      });
      return;
    }

    let orderData = {
      items: data.items.map((el, idx) => ({
        availability: el.availability,
        item_id: el.idProd,
      })),
    };

    status !== 'proforma' &&
      changeSalesOrder(data.items && orderData).then((res) => {
        const {
          location: { search },
        } = this.props;
        const salesId = new URLSearchParams(search).get('id');

        if (res.payload && res.payload.status && res.payload.status === 200) {
          history.push(salesId ? `/main/inner-sales/${salesId}` : '/main/orders');
        } else {
          if (res.error && res.error.response && res.error.response.data) {
            Object.values(res.error.response.data)
              .flat()
              .forEach((el) => {
                toast(el === '"null" is not a valid choice.' ? `Currency can't be empty.` : el, {
                  progressClassName: 'red-progress',
                });
              });
          } else {
            toast('Something went wrong.', {
              progressClassName: 'red-progress',
            });
          }
        }
      });
  };

  submitFormPartial = (data) => {
    const {
      changeOrder,
      checkEstimateBalance,
      makeProformaApproved,
      history,
      role,
      match: {
        params: { id },
      },
      toApproval,
      data: { status, payment_status },
      approveRequest,
      markPaid,
    } = this.props;

    const formData = new FormData();

    data.items &&
      formData.append(
        'items',
        JSON.stringify(
          data.items &&
            data.items.map((el, idx) => ({
              item_id: el.idProd,
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

    const body =
      data.items &&
      data.items.map((el, idx) => ({
        item_id: el.idProd,
        quantity: el.quantity,
        availability: el.availability,
        price_per_unit: el.price,
        delivery_date: el.delivery_date,
        expiration_date: el.expiration_date
          ? moment(el.expiration_date).format('YYYY-MM-DD')
          : null,
        pack_size: el.pack_size,
        product: el.name.id,
      }));

    checkEstimateBalance(id, body).then((res) => {
      const {
        location: { search },
      } = this.props;
      const salesId = new URLSearchParams(search).get('id');

      if (res.payload && res.payload.status && res.payload.status === 200) {
      } else {
        if (res.error && res.error.response && res.error.response.data) {
          Object.values(res.error.response.data)
            .flat()
            .forEach((el) => {
              toast(el === '"null" is not a valid choice.' ? `Currency can't be empty.` : el, {
                progressClassName: 'red-progress',
              });
              toast(el && el.product && el.product[0], {
                progressClassName: 'red-progress',
              });
            });
        } else {
          toast('Something went wrong.', {
            progressClassName: 'red-progress',
          });
        }
      }
    });
  };
  renderTitle = (status) => {
    switch (status) {
      case 'request':
      case 'sales_to_approve':
      case 'sales_review':
      case 'sales_rejected':
        return 'Request';
      case 'proforma':
        return 'Proforma';
      case 'order':
        return 'Purchase order';
      case 'delivery':
        return 'Delivery note';
      case 'delivered':
        return 'P.O. Delivered';
      case 'invoice':
        return 'Invoice';
      case 'receipt':
        return 'Receipt';
      case 'refunded':
        return 'Invoice';
      default:
        break;
    }
  };

  sortFunction(a, b) {
    var dateA = new Date(a.date_created).getTime();
    var dateB = new Date(b.date_created).getTime();
    return dateA > dateB ? 1 : -1;
  }

  GetCurrOrder = (id) => {
    const { getActivityOrder } = this.props;
    getActivityOrder(id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        res.payload.data.status === 'proforma'
          ? generateProformaPDF(res.payload.data, this.props)
          : generatePDF(res.payload.data, this.props, true);
      }
    });
  };

  returnIsDisabled = (type = false) => {
    const {
      data: { status },
    } = this.props;
    if (type) {
      if (status === 'sales_to_approve') {
        return true;
      }
      return false;
    }

    if (status === 'sales_review' || status === 'sales_rejected' || status === 'sales_to_approve') {
      return true;
    }
    return false;
  };

  render() {
    const {
      status_list,
      file,
      openRequestDialog,
      openOrderDialog,
      openDeliveryDialog,
      openInvoiceDialog,
      receiptFile,
      openProduct,
      openPayment,
      productName,
      paymentValue,
      method,
      overdueOrder,
      paymentDate,
      error,
      tax_file,

      rejectDialog,
      currencies_list,
      methods_list,
      confirm_balance,
      allowSubmit,
    } = this.state;
    const {
      handleSubmit,
      users,
      payments,
      products,
      itemsArr,
      change,
      productQuickCreate,
      loading,
      regionData,
      maximumBalance,
      balancePre,
      printInfo,
      data: {
        status,
        purchase_order_file,
        invoice_file,
        receipt_file,
        tax_invoice_file,
        created_by_user,
        region,
        user,
        sales_rep,
        currency,
        balance,
        request,
        payment_status,
        is_overdue,
        is_rejected,
        date,
        due_date,
        notes,
        tin,
      },
      match: {
        params: { id },
      },
      changeOrder,
      changeSalesOrder,
      getSingleOrder,
      submit,
      partialChangeOrder,
      salesList,
      salesManager,
      form,
      history,
      location: { search },
      approveRequest,
      paymentCreate,
      paymentGet,
      balanceValue,
      role,
      statusValue,
      formInfo,
    } = this.props;

    const salesId = new URLSearchParams(search).get('id');

    let BASE_URL;

    if (
      window.location.host === 'localhost:3000' ||
      window.location.host === 'admin.viebeg.4-com.pro'
    ) {
      BASE_URL = 'http://viebeg.4-com.pro/main/activity?id=';
    } else {
      BASE_URL = 'http://client.vieprocure.com/main/activity?id=';
    }

    return (
      <form className="order_page_inner content_block" onSubmit={handleSubmit(this.submitForm)}>
        <div className="custom_title_wrapper">
          <div className="link_req">
            <Link to={salesId ? `/main/inner-sales/${salesId}` : '/main/orders'}>
              <img src={Path} alt="Path" />
              Orders
            </Link>
          </div>
          <div className="title_page">
            {is_rejected && is_rejected && 'Rejected '}
            {this.renderTitle(status)} #{request}
            <div className="buttons-row">
              <CopyToClipboard text={`${BASE_URL}${id}`}>
                <button
                  data-tip
                  data-for={`copy-btn`}
                  type="button"
                  onCopy={() => console.log('copy')}
                  onClick={() =>
                    toast('Link to the order on the customer side was added to the clipboard.')
                  }
                  className="print-button">
                  <img src={Copy} alt="copy" />
                  <p>COPY</p>
                </button>
              </CopyToClipboard>

              <ReactTooltip
                id={`copy-btn`}
                effect="solid"
                place="top"
                backgroundColor="#FFFFFF"
                textColor="#334150"
                className="tooltip">
                <span>Copy client link</span>
              </ReactTooltip>

              {status === 'proforma' && (
                <BlobProvider
                  document={
                    status === 'proforma' ? (
                      <ProformaPDF pdfData={printInfo} />
                    ) : (
                      <InvoicePDF pdfData={printInfo} />
                    )
                  }
                  textPDF={'data'}>
                  {({ url, blob, loading }) => {
                    return (
                      <a href={url} target="_blank">
                        <button
                          type="button"
                          onClick={() => console.log('printed')}
                          className="print-button">
                          <img src={Print} alt="print" />
                          <p>PRINT</p>
                        </button>
                      </a>
                    );
                  }}
                </BlobProvider>
              )}
            </div>
          </div>
          <div className="content_page">
            <div className="order_header_row">
              <div className="title_block">general info</div>

              {created_by_user && created_by_user.role !== null && (
                <div className="created_block">
                  <span>●</span>
                  Created by{' '}
                  {created_by_user.region_accordance
                    ? `${created_by_user.region_accordance} manager`
                    : created_by_user.role === 'sales'
                    ? 'Sales Rep.'
                    : created_by_user.role === 'super_admin'
                    ? 'Admin'
                    : created_by_user.role === 'region'
                    ? 'Region Manager'
                    : 'Customer'}
                </div>
              )}
            </div>
            {this.props.initialValues.loading && <Loader />}

            {this.props.initialValues.loading ? (
              <Loader />
            ) : (
              <>
                <div className="general_info">
                  <div className="block_field first-row">
                    <div>
                      <span>Currency</span>
                      {status === 'invoice' &&
                      (payment_status === 'partial' || payment_status === 'paid') ? (
                        <p className="currency-text">{user.currency}</p>
                      ) : (
                        <FormControl className="select_wrapper">
                          <Field
                            name={`currency`}
                            placeholder="Select…"
                            className="wide-field"
                            options={currencies_list}
                            disabled
                            component={ReduxFormSelect}
                            isClearable={false}
                            isSearchable={false}
                          />
                        </FormControl>
                      )}
                    </div>
                    <div>
                      <span>Balance due</span>
                      <div className="balance-block--currency">
                        {!confirm_balance.editable ? (
                          <span className="balance-value">
                            {!maximumBalance && balanceValue && !balancePre
                              ? new Intl.NumberFormat('en-US', {
                                  minimumFractionDigits: 0,
                                }).format(Number(balanceValue).toFixed(0))
                              : maximumBalance && balancePre == null
                              ? '--'
                              : new Intl.NumberFormat('en-US', {
                                  minimumFractionDigits: 0,
                                }).format(Number(balancePre).toFixed(0))}
                          </span>
                        ) : (
                          // <Field
                          //   name="balance"
                          //   onChange={(e, value) => {
                          //     this.setState({
                          //       confirm_balance: {
                          //         ...confirm_balance,
                          //         changedBalance: value,
                          //       },
                          //     });
                          //   }}
                          //   placeholder="0"
                          //   component={RenderField}
                          //   type="number"
                          // />
                          <NumberFormat
                            thousandSeparator={','}
                            decimalSeparator={'.'}
                            onChange={(e, value) => {
                              this.setState({
                                confirm_balance: {
                                  ...confirm_balance,
                                  changedBalance: e.target.value.split(',').join(''),
                                },
                              });
                            }}
                            component={RenderField}
                          />
                        )}
                        {/* {role !== 'sales' && (
                          <div className="edit-button">
                            {!confirm_balance.editable ? (
                              <img
                                src={Edit}
                                onClick={() => {
                                  this.setState({
                                    confirm_balance: {
                                      ...confirm_balance,
                                      editable: !confirm_balance.editable,
                                    },
                                  });
                                }}
                                alt="edit"
                              />
                            ) : (
                              <img
                                src={Save}
                                onClick={() => {
                                  this.setState({
                                    confirm_balance: {
                                      ...confirm_balance,
                                      confirmedPopup: !confirm_balance.confirmedPopup,
                                    },
                                  });
                                }}
                                alt="save"
                              />
                            )}
                            <DialogComponent
                              open={confirm_balance.confirmedPopup}
                              onClose={() => {
                                this.setState({
                                  confirm_balance: {
                                    ediatble: false,
                                    confirmedBalance: false,
                                  },
                                });
                              }}>
                              <div className="orders_dialog">
                                <div className="title">
                                  <span>Change balance</span>
                                </div>
                                <div className="descriptions">
                                  <span>
                                    The balance will be changed from{' '}
                                    <span>
                                      <NumberFormat
                                        value={Math.round(balance)}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                      />{' '}
                                      {currency}
                                    </span>{' '}
                                    to
                                    <span>
                                      {' '}
                                      {confirm_balance.changedBalance !== null ? (
                                        <NumberFormat
                                          value={Math.round(confirm_balance.changedBalance)}
                                          displayType={'text'}
                                          thousandSeparator={true}
                                        />
                                      ) : (
                                        <NumberFormat
                                          value={Math.round(balance)}
                                          displayType={'text'}
                                          thousandSeparator={true}
                                        />
                                      )}
                                      {currency}
                                    </span>{' '}
                                  
                                    . Are you sure?
                                  </span>
                                </div>
                                <div className="payment-data-row" />
                                <div className="btn_wrapper">
                                  <button
                                    className="cancel_btn"
                                    onClick={() => {
                                      this.setState({
                                        confirm_balance: {
                                          ediatble: false,
                                          confirmedBalance: false,
                                        },
                                      });
                                    }}>
                                    Cancel
                                  </button>
                                  <button
                                    className={`blue_btn`}
                                    onClick={() =>
                                      partialChangeOrder(id, {
                                        balance: confirm_balance && confirm_balance.changedBalance,
                                      }).then((res) => {
                                        if (
                                          res.payload &&
                                          res.payload.status &&
                                          res.payload.status === 200
                                        ) {
                                          this.setState({
                                            confirm_balance: {
                                              ediatble: false,
                                              confirmedBalance: false,
                                            },
                                          });
                                          getSingleOrder(id);
                                          paymentGet('', id);
                                        } else {
                                        }
                                      })
                                    }>
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            </DialogComponent>
                          </div>
                        )} */}
                      </div>
                    </div>
                    {(status === 'invoice' || status === 'receipt') && (
                      <div>
                        <span>Status</span>
                        <div className="status-block-row">
                          {payment_status === 'new' ? (
                            <div className="status-block">
                              <img className="status-block-img" src={Attention} alt="attention" />
                              <p className="status-block-text">New</p>
                            </div>
                          ) : payment_status === 'partial' ? (
                            <div className="status-block partial">
                              <img className="status-block-img" src={PartialImg} alt="attention" />
                              <p className="status-block-text">Partial</p>
                            </div>
                          ) : payment_status === 'overdue' ? (
                            <div className="status-block overdue">
                              <img className="status-block-img" src={OverdueImg} alt="attention" />
                              <p className="status-block-text">Overdue</p>
                            </div>
                          ) : (
                            <div className="status-block paid">
                              <img className="status-block-img" src={PaidImg} alt="attention" />
                              <p className="status-block-text">Paid</p>
                            </div>
                          )}

                          {/* <div
                            onClick={() =>
                              role !== 'sales' &&
                              this.setState({
                                openPayment: true,
                              })
                            }
                            className="add-btn">
                            + ADD PAYMENT
                          </div> */}
                          <DialogComponent
                            open={openPayment}
                            onClose={() => {
                              this.setState({
                                openPayment: false,
                              });
                            }}>
                            <div className="orders_dialog">
                              <div className="title">
                                <span>Add new payment</span>
                              </div>
                              <div className="descriptions">
                                <span>
                                  Enter the amount and payment method the <span>Cummeratafort</span>{' '}
                                  used to pay for the invoice <span>#{id}.</span>
                                </span>
                              </div>
                              <div className="payment-data-row">
                                {/* HERE */}
                                <div className="block_field">
                                  <span>Date</span>
                                  <DatePicker
                                    selected={paymentDate}
                                    onChange={(date) =>
                                      this.setState({
                                        paymentDate: date,
                                      })
                                    }
                                    className="date-picker-custom"
                                    timeFormat="p"
                                    locale="en-GB"
                                    popperPlacement="top"
                                    dateFormat={'dd/MM/yyyy'}
                                    customInput={<CalendarInput value={paymentDate} />}
                                    withPortal
                                  />
                                </div>
                                <div className="block_field payment-data-amount">
                                  <span>Amount</span>
                                  <Field
                                    name={`amount`}
                                    placeholder="0"
                                    component={RenderField}
                                    type="number"
                                    onChange={(e, value) =>
                                      this.setState({
                                        paymentValue: e.target.value,
                                      })
                                    }
                                    disabled={false}
                                  />
                                </div>
                                <div className="block_field payment-data-method">
                                  <span>Method</span>
                                  <Field
                                    name={`method`}
                                    placeholder="Select…"
                                    className="wide-field"
                                    options={methods_list}
                                    component={ReduxFormSelect}
                                    onChange={({ value }) =>
                                      this.setState({
                                        method: value,
                                      })
                                    }
                                    isClearable={false}
                                    isSearchable={false}
                                  />
                                </div>
                              </div>
                              <div className="btn_wrapper">
                                <button
                                  className="cancel_btn"
                                  onClick={() => {
                                    this.setState({
                                      openPayment: false,
                                    });
                                  }}>
                                  Cancel
                                </button>
                                <button
                                  className={
                                    !method || !paymentDate || !paymentValue
                                      ? `blue_btn_unactive`
                                      : `blue_btn`
                                  }
                                  disabled={!method || !paymentDate || !paymentValue}
                                  onClick={() => {
                                    paymentCreate({
                                      amount: paymentValue,
                                      method: method,
                                      date: paymentDate,
                                      order: id,
                                      event_type: 'payment',
                                    }).then((res) => {
                                      if (
                                        res.payload &&
                                        res.payload.status &&
                                        res.payload.status === 201
                                      ) {
                                        this.setState({
                                          openPayment: false,
                                          error: null,
                                        });
                                        paymentGet('', id);
                                        getSingleOrder(id);
                                      } else {
                                      }
                                    });
                                  }}>
                                  Confirm
                                </button>
                              </div>
                            </div>
                          </DialogComponent>
                        </div>
                      </div>
                    )}
                  </div>
                  {status !== 'request' && (
                    <div className="block_field">
                      {role === 'sales' && status === 'proforma' && (
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
                                  value: el.id,
                                  id: el.id,
                                }))
                              }
                              component={ReduxFormSelect}
                              isClearable={false}
                              isSearchable={true}
                            />
                          </FormControl>
                        </div>
                      )}

                      {status !== 'invoice' && (
                        <div className="input_tin">
                          <span>TIN </span>
                          <Field type="string" name="tin" disabled component={RenderField} />
                        </div>
                      )}

                      {/* HERE */}
                      {role !== 'sales' &&
                        status !== 'sales_review' &&
                        status !== 'request' &&
                        status !== 'sales_to_approve' &&
                        status !== 'sales_rejected' && (
                          <div>
                            <span>Sales Rep.</span>
                            <FormControl className="select_wrapper">
                              <Field
                                name={`sales_rep`}
                                placeholder="Select…"
                                className="wide-field"
                                options={
                                  salesList &&
                                  [
                                    {
                                      username: 'None',
                                      id: null,
                                    },
                                    ...salesList,
                                  ].map((el) => ({
                                    label: el.username,
                                    value: el.id,
                                    id: el.id,
                                  }))
                                }
                                component={ReduxFormSelect}
                                isClearable={false}
                                isSearchable={true}
                              />
                            </FormControl>
                          </div>
                        )}

                      {status === 'request' && (
                        <div>
                          <span>Sales Rep.</span>
                          <FormControl className="select_wrapper">
                            <Field
                              name={`sales`}
                              placeholder="Select…"
                              className="wide-field"
                              options={
                                salesList &&
                                [
                                  {
                                    username: 'None',
                                    id: null,
                                  },
                                  ...salesList,
                                ].map((el) => ({
                                  label: el.username,
                                  value: el.username,
                                  id: el.id,
                                }))
                              }
                              component={ReduxFormSelect}
                              isClearable={false}
                              isSearchable={true}
                            />
                          </FormControl>
                        </div>
                      )}
                      {((role !== 'sales' && status === 'sales_to_approve') ||
                        (role !== 'sales' && status === 'sales_review') ||
                        (role !== 'sales' && status === 'sales_rejected')) && (
                        <div>
                          <span>Sales Rep. </span>
                          <Field
                            type="string"
                            name="sales"
                            placeholder="Type here..."
                            disabled
                            component={RenderField}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="block_field block_field_more date_row creation_date">
                    {role === 'sales' && status !== 'proforma' && (
                      <div className="customer-uneditable">
                        <span>Customer</span>

                        <p>{user && user.username && user.username}</p>
                      </div>
                    )}

                    {status === 'invoice' && (
                      <div className="input_tin">
                        <span>TIN </span>
                        <Field type="string" name="tin" disabled component={RenderField} />
                      </div>
                    )}

                    <div id="creation_date" className="date-uneditable">
                      <span>Creation date & time</span>

                      {status === 'proforma' ? (
                        <Field name={`date`} component={renderDatePickerHours} />
                      ) : (
                        <p>{moment(date).format('DD/MM/YYYY HH:mm')}</p>
                      )}
                    </div>

                    {status === 'proforma' ? (
                      <div id="due_date">
                        <span>Due date</span>

                        <div className="due-date-row sales-rep">
                          <Field name={`due_date`} component={renderDatePicker} />

                          {status === 'invoice' && (
                            <div className="due-date-checkbox">
                              <input
                                type="checkbox"
                                checked={this.state.overdueOrder}
                                onChange={() => {
                                  this.setState({
                                    overdueOrder: !overdueOrder,
                                  });
                                }}
                              />
                              <p>Overdue order</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      status !== 'request' && (
                        <div className="date-uneditable">
                          <span>Due date </span>

                          {
                            <p>
                              {due_date
                                ? moment(due_date).format('DD/MM/YYYY HH:mm')
                                : '--/--/---- -- : --'}
                            </p>
                          }
                        </div>
                      )
                    )}
                  </div>

                  <div className="block_field second-row">
                    <div id="vat" className="block_field vat-block">
                      <span>VAT</span>
                      <label className="block-input">
                        <Field
                          className="discount-input"
                          placeholder="0"
                          name={`vat`}
                          component={RenderField}
                          disabled={(payment_status === 'paid') | (payment_status === 'partial')}
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
                          disabled={(payment_status === 'paid') | (payment_status === 'partial')}
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

                  <div className="block_field ">
                    <div className="balance_note--container">
                      <span>Balance note</span>

                      <textarea
                        name={`notes`}
                        className={'order-textarea uneditable'}
                        placeholder="Type here..."
                        disabled
                        value={notes}
                        onChange={(e) =>
                          this.setState({
                            notes: e.target.value,
                          })
                        }
                        rows="2"></textarea>
                    </div>
                  </div>
                </div>
                {status === 'invoice' && payments && payments.length > 0 && (
                  <div className="payments">
                    <div className="title_block">payments</div>

                    <div className="payments-block">
                      {payments && (
                        <div className="payments-list-header">
                          <div className="payments-list-header-item">Date</div>
                          <div className="payments-list-header-item">Method</div>
                          <div className="payments-list-header-item">Amount</div>
                          <div className="payments-list-header-item">Note</div>
                        </div>
                      )}
                      {payments ? (
                        payments.map((payment) =>
                          payment.event_type === 'balance_edit' ? (
                            <div key={payment.id} className="payments-list-element edited">
                              <div className="payments-list-element-item edited ">
                                {moment(payment.date).format('DD/MM/YYYY HH:mm')}
                              </div>

                              <div className="payments-list-element-item edited">
                                Manual balance edit from {currency === 'USD' ? '$' : currency}
                                {new Intl.NumberFormat('en-US', {
                                  minimumFractionDigits: 2,
                                }).format(payment.from_amount)}{' '}
                                to {currency === 'USD' ? '$' : currency}
                                {new Intl.NumberFormat('en-US', {
                                  minimumFractionDigits: 2,
                                }).format(payment.to_amount)}
                              </div>
                            </div>
                          ) : payment.event_type === 'paid' ? (
                            <div key={payment.id} className="payments-list-element edited">
                              <div className="payments-list-element-item edited ">
                                {moment(payment.date).format('DD/MM/YYYY HH:mm')}
                              </div>
                              <div className="payments-list-element-item edited">
                                Marked as Paid
                              </div>
                            </div>
                          ) : payment.event_type === 'payment' ? (
                            <div key={payment.id} className="payments-list-element">
                              <div className="payments-list-element-item">
                                {moment(payment.date).format('DD/MM/YYYY HH:mm')}
                              </div>

                              <div className="payments-list-element-item">
                                {payment.payment &&
                                  payment.payment.method &&
                                  payment.payment.method}
                              </div>
                              <div className="payments-list-element-item">
                                {currency === 'USD' ? '$' : currency}
                                {payment.payment &&
                                  payment.payment.amount &&
                                  new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 0,
                                  }).format(payment.payment.amount)}
                              </div>

                              <div className="payments-list-element-item">
                                {payment && payment.payment && payment.payment.notes
                                  ? payment.payment.notes
                                  : ''}
                              </div>
                            </div>
                          ) : payment.event_type === 'auto_paid' ? (
                            <div key={payment.id} className="payments-list-element">
                              <div className="payments-list-element-item">
                                {moment(payment.date).format('DD/MM/YYYY HH:mm')}
                              </div>

                              <div className="payments-list-element-item">
                                {payment.payment &&
                                  payment.payment.method &&
                                  payment.payment.method}{' '}
                                (Auto Paid)
                              </div>
                              <div className="payments-list-element-item">
                                {currency === 'USD' ? '$' : currency}
                                {payment.payment &&
                                  payment.payment.amount &&
                                  new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 0,
                                  }).format(payment.payment.amount)}
                              </div>

                              <div className="payments-list-element-item">
                                {payment.payment && payment.payment.notes
                                  ? payment.payment.notes
                                  : ''}
                              </div>
                            </div>
                          ) : payment.event_type === 'paid' ? (
                            <div key={payment.id} className="payments-list-element edited">
                              <div className="payments-list-element-item edited ">
                                {moment(payment.date).format('DD/MM/YYYY HH:mm')}
                              </div>
                              <div className="payments-list-element-item edited">
                                Marked as Paid
                              </div>
                            </div>
                          ) : payment.event_type === 'refund' ? (
                            <div key={payment.id} className="payments-list-element">
                              <div className="payments-list-element-item">
                                {moment(payment.date).format('DD/MM/YYYY HH:mm')}
                              </div>

                              <div className="payments-list-element-item">
                                {payment.payment &&
                                  payment.payment.method &&
                                  payment.payment.method}{' '}
                                - Refund
                              </div>
                              <div className="payments-list-element-item">
                                {payment.payment &&
                                  payment.payment.amount &&
                                  new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 0,
                                  }).format(payment.payment.amount)}
                                {currency === 'USD' ? '$' : currency}
                              </div>
                              <div className="payments-list-element-item">
                                {payment.payment && payment.payment.notes
                                  ? payment.payment.notes
                                  : ''}
                              </div>
                            </div>
                          ) : (
                            ''
                          ),
                        )
                      ) : (
                        <p className="payments-list-empty">No payments yet</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="documents">
                  <div className="title_block">documents</div>
                  {!tax_invoice_file && (
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

                          <label
                            for="fileInp"
                            className={status !== 'proforma' ? 'blue_btn_unactive' : 'blue_btn'}>
                            Upload
                          </label>
                          <input
                            style={{
                              display: 'none',
                            }}
                            type="file"
                            id="fileInp"
                            disabled={status !== 'proforma'}
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
                  )}
                  {tax_invoice_file && (
                    <div className="block">
                      <span>Tax invoice</span>
                      <div>
                        <a href={tax_invoice_file} download target="_blank">
                          <img src={document} alt="document" />
                          <p>{tax_invoice_file.split('/').reverse()[0]}</p>
                        </a>
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            partialChangeOrder(id, {
                              tax_invoice_file: null,
                            }).then((res) => {
                              if (res.payload && res.payload.status && res.payload.status === 200) {
                                getSingleOrder(id);
                              }
                            })
                          }>
                          <img src={close} alt="close" />
                        </div>
                      </div>
                    </div>
                  )}
                  {purchase_order_file &&
                    (status === 'order' || status === 'invoice' || status === 'receipt') && (
                      <div className="block">
                        <span>Purchase order</span>
                        <a href={purchase_order_file} download target="_blank">
                          <img src={document} alt="document" />
                          <p>{purchase_order_file.split('/').reverse()[0]}</p>
                        </a>
                      </div>
                    )}
                  {(status === 'delivery' || status === 'delivered' || status === 'invoice') &&
                    !invoice_file && (
                      <>
                        {file && (
                          <div className="block">
                            <span>Invoice</span>
                            <div>
                              <img src={document} alt="document" />
                              <p>{file.name}</p>
                              <button
                                onClick={() =>
                                  this.setState({
                                    file: null,
                                  })
                                }>
                                <img src={close} alt="close" />
                              </button>
                            </div>
                          </div>
                        )}

                        {!file && (
                          <div className="block">
                            <span>Invoice</span>

                            <label
                              for="fileInp"
                              className={role === 'sales' ? 'blue_btn_unactive' : 'blue_btn'}>
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
                      </>
                    )}
                  {invoice_file && (status === 'invoice' || status === 'receipt') && (
                    <div className="block">
                      <span>Invoice</span>
                      <a href={invoice_file} download target="_blank">
                        <img src={document} alt="document" />
                        <p>{invoice_file.split('/').reverse()[0]}</p>
                      </a>
                    </div>
                  )}
                  {status === 'receipt' &&
                    (receipt_file ? (
                      <div className="block">
                        <span>Receipt</span>
                        <a href={receipt_file} download target="_blank">
                          <img src={document} alt="document" />
                          <p>{receipt_file.split('/').reverse()[0]}</p>
                        </a>
                      </div>
                    ) : (
                      <>
                        {receiptFile && (
                          <div className="block">
                            <span>Receipt</span>
                            <div>
                              <img src={document} alt="document" />
                              <p>{receiptFile.name}</p>
                              <button
                                onClick={() =>
                                  this.setState({
                                    receiptFile: null,
                                  })
                                }>
                                <img src={close} alt="close" />
                              </button>
                            </div>
                          </div>
                        )}

                        {!receiptFile && (
                          <div className="block">
                            <span>Receipt</span>

                            <label
                              for="fileInp"
                              className={role === 'sales' ? 'blue_btn_unactive' : 'blue_btn'}>
                              Upload
                            </label>
                            <input
                              style={{
                                display: 'none',
                              }}
                              type="file"
                              id="fileInp"
                              onChange={(e) => {
                                let receiptFile = e.target.files[0];
                                this.setState({
                                  receiptFile,
                                });
                              }}
                            />
                          </div>
                        )}
                      </>
                    ))}
                </div>
                <FieldArray
                  name={`items`}
                  component={renderItems}
                  checkFunction={handleSubmit(this.submitFormPartial)}
                  products={products}
                  formInformation={formInfo}
                  allowSubmitForm={() => {
                    this.setState({ allowSubmit: true });
                  }}
                  disallowSubmitForm={() => {
                    this.setState({ allowSubmit: false });
                  }}
                  itemsArr={itemsArr}
                  change={change}
                  currency={this.props.data.currency}
                  user={user}
                  sales_rep={sales_rep}
                  role={role}
                  regionData={this.props.data.region}
                  status={status}
                  openProductAct={() => {
                    this.setState({ openProduct: true });
                  }}
                  returnIsDisabled={this.returnIsDisabled}
                  tin={tin}
                />

                <div className="wrapper_btn">
                  <div>
                    {status === 'sales_to_approve' && role !== 'sales' && (
                      <>
                        <div
                          className="blue_btn_bg"
                          onClick={() => {
                            this.setState({
                              openRequestDialog: true,
                              proceed: true,
                            });
                          }}>
                          Approve
                        </div>
                        <div
                          className="red_btn"
                          onClick={() =>
                            this.setState({
                              rejectDialog: true,
                            })
                          }>
                          Reject
                        </div>
                      </>
                    )}
                    {status === 'request' && (
                      <div
                        className="blue_btn_bg"
                        onClick={() => {
                          if (salesManager && salesManager.id) {
                            this.setState({
                              openRequestDialog: true,
                              proceed: false,
                            });
                          }
                        }}>
                        {salesManager && salesManager.id && 'Save & Submit'}
                      </div>
                    )}

                    {(status === 'sales_review' ||
                      status === 'sales_rejected' ||
                      status === 'sales_to_approve') && (
                      <button
                        className={this.state.allowSubmit ? 'blue_btn' : 'blue_btn_unactive'}
                        ref={this.myRef}
                        disabled={!this.state.allowSubmit}
                        style={
                          (salesManager && salesManager.id) || status === 'sales_to_approve'
                            ? { display: 'none' }
                            : {}
                        }>
                        {'Submit'}
                      </button>
                    )}

                    <button
                      disabled={loading}
                      className={loading ? 'blue_btn_unactive' : 'blue_btn'}
                      onClick={() => this.setState({ saveChangesParam: true })}>
                      {'Save changes'}
                    </button>
                  </div>
                  {(status === 'invoice' || status === 'receipt') && (
                    <div className="downloadPdf" onClick={() => this.GetCurrOrder(id)}>
                      Download pdf
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <DialogComponent
          open={openRequestDialog}
          onClose={() => {
            this.setState({
              openRequestDialog: false,
              proceed: false,
            });
          }}>
          <div className="orders_dialog">
            <div className="title">
              <span>{salesManager && salesManager.id ? 'Submit request' : 'Approve request'}</span>
            </div>
            <div className="descriptions">
              {salesManager && salesManager.id ? (
                <span>
                  Confirm that you want to submit the request <span>#{id}</span> for approval to the
                  regional manager.
                </span>
              ) : (
                <span>
                  You are about to approve the request <span>#{id}</span> and send the proforma to
                  the customer. Are you sure?
                </span>
              )}
            </div>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    openRequestDialog: false,
                    proceed: false,
                  });
                }}>
                Cancel
              </button>
              <button
                className="blue_btn"
                onClick={() => {
                  this.myRef.current.click();
                }}>
                {salesManager && salesManager.id ? 'Submit' : 'Approve1'}
              </button>
            </div>
          </div>
        </DialogComponent>

        <DialogComponent
          open={rejectDialog}
          onClose={() => {
            this.setState({
              rejectDialog: false,
            });
          }}>
          <div className="orders_dialog">
            <div className="title">
              <span>Reject request</span>
            </div>
            <div className="descriptions">
              <span>
                You are about to reject the request <span>#{id}</span> and send it back to the sales
                manager. Are you sure?
              </span>
            </div>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    rejectDialog: false,
                  });
                }}>
                Cancel
              </button>
              <button
                className="red_btn"
                onClick={() => {
                  approveRequest(id, { approve: false }).then((res) => {
                    const {
                      location: { search },
                    } = this.props;
                    const salesId = new URLSearchParams(search).get('id');

                    if (res.payload && res.payload.status && res.payload.status === 200) {
                      history.push(salesId ? `/main/inner-sales/${salesId}` : '/main/orders');
                      return;
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
                      return;
                    }
                  });
                }}>
                Reject
              </button>
            </div>
          </div>
        </DialogComponent>
        <DialogComponent
          open={openOrderDialog}
          onClose={() => {
            this.setState({
              openOrderDialog: false,
              proceed: false,
            });
          }}>
          <div className="orders_dialog">
            <div className="title">
              <span>Confirm purchase</span>
            </div>
            <div className="descriptions">
              <span>
                You are about to submit the purchase order <span>#{id}.</span> Are you sure?
              </span>
            </div>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    openOrderDialog: false,
                    proceed: false,
                  });
                }}>
                Cancel
              </button>
              <button className="blue_btn" onClick={() => this.myRef.current.click()}>
                Confirm
              </button>
            </div>
          </div>
        </DialogComponent>
        <DialogComponent
          open={openDeliveryDialog}
          onClose={() => {
            this.setState({
              openDeliveryDialog: false,
              proceed: false,
            });
          }}>
          <div className="orders_dialog">
            <div className="title">
              <span>Confirm delivery</span>
            </div>
            <div className="descriptions">
              <span>
                You are about to confirm delivery of the order <span>#{id}.</span> Are you sure?
              </span>
            </div>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    openDeliveryDialog: false,
                    proceed: false,
                  });
                }}>
                Cancel
              </button>
              <button className="blue_btn" onClick={() => this.myRef.current.click()}>
                Confirm
              </button>
            </div>
          </div>
        </DialogComponent>
        <DialogComponent
          open={openInvoiceDialog}
          onClose={() => {
            this.setState({
              openInvoiceDialog: false,
              proceed: false,
            });
          }}>
          <div className="orders_dialog">
            <div className="title">
              <span>Confirm payment</span>
            </div>
            <div className="descriptions">
              {(payment_status === 'new' || payment_status === 'partial') &&
                ((!tax_invoice_file && !tax_file) || (!invoice_file && !file)) && (
                  <>
                    <span>
                      By confirming this payment, you are approved that the{' '}
                      <span>{user && user.username}</span> has paid the full amount of invoice{' '}
                      <span>#{id}.</span>. The balance will be changed from{' '}
                      <span>
                        {balanceValue} {currency}
                      </span>{' '}
                      to <span>0.00 {currency}</span> and invoice will be marked as{' '}
                      <span>‘Paid’</span>. Are you sure?
                    </span>
                    <div className="missing-doc-dialog">
                      <img src={AlertImg} />
                      There are missing documents for this invoice. You can add it now or be sure to
                      do it later.
                    </div>
                  </>
                )}
              {payment_status === 'paid' &&
                ((!tax_invoice_file && !tax_file) || (!invoice_file && !file)) && (
                  <>
                    <span>
                      By confirming this payment, you are approved that the{' '}
                      <span>{user && user.username}</span> has paid the full amount of invoice
                      <span>#{id}.</span>. The invoice is already marked as <span>‘Paid’</span> and
                      the balance is <span>0.00 {currency}</span>. Are you sure?
                    </span>
                    <div className="missing-doc-dialog">
                      <img src={AlertImg} />
                      There are missing documents for this invoice. You can add it now or be sure to
                      do it later.
                    </div>
                  </>
                )}
              {(payment_status === 'new' || payment_status === 'partial') &&
                (tax_invoice_file || tax_file) &&
                (invoice_file || file) && (
                  <>
                    <span>
                      By confirming this payment, you are approved that the{' '}
                      <span>{user && user.username}</span> has paid the full amount of invoice{' '}
                      <span>#{id}.</span>. The balance will be changed from{' '}
                      <span>
                        {balanceValue} {currency}
                      </span>{' '}
                      to <span>0.00 {currency}</span> and invoice will be marked as{' '}
                      <span>‘Paid’</span>. Are you sure?
                    </span>
                  </>
                )}
              {payment_status === 'paid' &&
                (tax_invoice_file || tax_file) &&
                (invoice_file || file) && (
                  <>
                    <span>
                      By confirming this payment, you are approved that the{' '}
                      <span>{user && user.username}</span> has paid the full amount of invoice
                      <span>#{id}.</span>. The invoice is already marked as <span>‘Paid’</span> and
                      the balance is <span>0.00 {currency}</span>. Are you sure?
                    </span>
                  </>
                )}
            </div>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    openInvoiceDialog: false,
                    proceed: false,
                  });
                }}>
                Cancel
              </button>
              <button className="blue_btn" onClick={() => this.myRef.current.click()}>
                Confirm
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
            <div className="title">Add product</div>
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
      if (el.quantity === null || el.quantity === undefined) {
        itemsErrors.quantity = 'Required field';
        itemsArrayErrors[idx] = itemsErrors;
      }
      if (
        (el.price === null && values.status === 'proforma') ||
        (el.price === undefined && values.status === 'proforma')
      ) {
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

const OrdersSalesInnerEditForm = reduxForm({
  form: 'OrdersSalesInnerEdit',
  validate,
  enableReinitialize: true,
})(OrdersSalesInnerEdit);

const selector = formValueSelector('OrdersSalesInnerEdit');

function mapStateToProps(state) {
  const { dashboard, invoices, orders, auth } = state;
  return {
    categories: dashboard.categories,
    payments:
      orders.payments &&
      orders.payments.map((item) => ({
        amount: item.amount,
        event_type: item.event_type,
        payment: item.payment,
        from_amount: item.from_amount,
        to_amount: item.to_amount,
        date: item.date,
      })),
    users: invoices.invoice_options,
    formInfo: state.form && state.form.OrdersSalesInnerEdit,
    role: auth.data.role,
    products: invoices.invoice_product_options,
    itemsArr: selector(state, 'items'),
    salesManager: selector(state, 'sales'),
    data: orders.order,
    printInfo: orders.order,
    salesList: orders.sales,
    maximumBalance: orders.maximumBalance && orders.maximumBalance,
    balancePre:
      orders.balance && orders.balance.estimated_balance && orders.balance.estimated_balance,
    balanceValue: orders.order && orders.order.balance,
    is_rejected: orders.order && orders.order.is_rejected && orders.order.is_rejected,
    initialValues: {
      request: orders.order && orders.order.request,
      user: {
        label: orders.order && orders.order.user && orders.order.user.username,
        value: orders.order && orders.order.user && orders.order.user.username,
        id: orders.order && orders.order.user && orders.order.user.id,
      },
      tin: orders.order && orders.order.user && orders.order.user.tin,
      discount: orders.order && orders.order.discount,
      vat: orders.order && orders.order.vat,
      sales_rep: {
        label: orders.order && orders.order.sales_rep && orders.order.sales_rep.username,
        value: orders.order && orders.order.sales_rep && orders.order.sales_rep.username,
        id: orders.order && orders.order.sales_rep && orders.order.sales_rep.id,
      },
      sales: orders.order && orders.order.sales_rep && orders.order.sales_rep.username,
      due_date: orders.order && orders.order.due_date ? new Date(orders.order.due_date) : null,
      date: orders.order && orders.order.date ? new Date(orders.order.date) : null,
      balance: orders.order && orders.order.balance,
      is_rejected: orders.order && orders.order.is_rejected && orders.order.is_rejected,
      status: orders.order && orders.order.status,
      payment_status: {
        label:
          orders.order &&
          orders.order.payment_status &&
          orders.order.payment_status[0].toUpperCase() + orders.order.payment_status.slice(1),
        value: orders.order && orders.order.payment_status,
      },
      currency: {
        label: orders.order && orders.order.currency,
        value: orders.order && orders.order.currency,
      },
      method: {
        label: orders.order && orders.order.method,
        value: orders.order && orders.order.method,
      },
      regionData: orders.order && orders.order.region,
      created_by_user: orders.order && orders.order.created_by_user,
      loading: orders.loading,
      items:
        orders.order &&
        orders.order.items &&
        orders.order.items.map((el) => ({
          name: {
            value: el.product && el.product.name,
            label: el.product && el.product.name,
            id: el.product && el.product.id,
          },
          idProd: el.id,
          quantity: el.quantity,
          availability: el.availability,
          price: el.price_per_unit,
          delivery_date: el.delivery_date && new Date(el.delivery_date),
          total: +el.price_per_unit * +el.quantity,
          expiration_date: el.expiration_date && new Date(el.expiration_date),
          pack_size: el.pack_size,
        })),
    },
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createOrder,
      checkEstimateBalance,
      getInvoiceOptions,
      getInvoiceProductOptions,
      change,
      getSingleOrder,
      paymentGet,
      changeOrder,
      changeSalesOrder,
      submit,
      getActivityOrder,
      productQuickCreate,
      partialChangeOrder,
      getSalesList,
      paymentCreate,
      toApproval,
      approveRequest,
      markPaid,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(OrdersSalesInnerEditForm);

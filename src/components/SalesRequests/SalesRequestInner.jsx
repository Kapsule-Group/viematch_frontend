import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import "react-datepicker/dist/react-datepicker.css";
import FormControl from "@material-ui/core/FormControl";
import document from "../../assets/image/document.svg";
import Path from "../../assets/image/Path.svg";
import close from "../../assets/image/close.svg";
import "./SalesRequests.scss";
import RenderField, {
  ReduxFormSelect,
  renderDatePicker,
} from "../HelperComponents/RenderField/RenderField";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import { toast } from "react-toastify";
import moment from "moment";
import {
  createOrder,
  getSingleOrder,
  changeOrder,
  partialChangeOrder,
  getSalesList,
  toApproval,
  approveRequest,
} from "../../actions/ordersActions";
import {
  getInvoiceOptions,
  getInvoiceProductOptions,
  getActivityOrder,
  productQuickCreate,
} from "../../actions/invoiceActions";

import {
  reduxForm,
  Field,
  FieldArray,
  formValueSelector,
  change,
} from "redux-form";

const renderItems = ({
  fields,
  meta: { error },
  products,
  itemsArr,
  change,
  user,
  status,
}) => {
  let sum = 0;
  itemsArr &&
    itemsArr.forEach(({ quantity, price }) => {
      const mult = +quantity * +price;

      if (!isNaN(mult)) {
        sum += mult;
      }
    });
  return (
    <>
      <div className="products">
        <div className="title-wrapper">
          <div className="title_block mb0">products</div>
        </div>{" "}
        {fields.map((item, idx) => (
          <div key={idx} className="block">
            <div>
              <span>Product name</span>
              <Field
                name={`${item}.name`}
                placeholder="Product name"
                component={RenderField}
                type="text"
                disabled
              />
            </div>
            <div>
              <span>Quantity</span>
              <Field
                name={`${item}.quantity`}
                placeholder="0"
                component={RenderField}
                type="number"
                onChange={(e, value) =>
                  change(
                    `${item}.total`,
                    itemsArr && itemsArr[idx] && itemsArr[idx].price
                      ? +itemsArr[idx].price * +value
                      : ""
                  )
                }
                disabled
              />
            </div>

            <div>
              <span>Price</span>
              <Field
                name={`${item}.price`}
                placeholder="0"
                component={RenderField}
                type="number"
                disabled={status === "sales_to_approve"}
                onChange={(e, value) =>
                  change(
                    `${item}.total`,
                    itemsArr && itemsArr[idx] && itemsArr[idx].quantity
                      ? +itemsArr[idx].quantity * +value
                      : +value
                  )
                }
              />
            </div>
            <div>
              <span>Total price</span>
              <Field
                name={`${item}.total`}
                placeholder={`${user && user.currency}0.00`}
                component={RenderField}
                type="number"
                disabled
              />
            </div>
            <div>
              <span>Delivery date</span>
              {/* <Field
                                name={`${item}.delivery_date`}
                                component={renderDatePicker}
                                disabled
                            /> */}
              <Field
                name={`${item}.delivery_date`}
                component={RenderField}
                type="text"
                disabled
              />
            </div>
          </div>
        ))}
        <div className="btn-wrapper-add">
          <div>
            Total {user && user.currency} {sum.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
};

class SalesRequestInner extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  state = {
    startDate: null,

    status_list: [
      { label: "New", value: "new" },
      { label: "Partial", value: "partial" },
      { label: "Overdue", value: "overdue" },
      { label: "Paid", value: "paid" },
    ],
    file: null,
    proceed: false,
    openRequestDialog: false,
    openOrderDialog: false,
    openDeliveryDialog: false,
    openInvoiceDialog: false,
    receiptFile: false,
    namesOfStatuses: {
      all: "All",
      request: "Request",
      proforma: "Proforma",
      order: "Purchase order",
      delivery: "Delivery in progress",
      delivered: "P.O. delivered",
      invoice: "Invoice",
      receipt: "Receipt",
    },
    openProduct: false,
    productName: "",
    error: null,
    tax_file: null,
    rejectDialog: false,
  };

  componentDidMount() {
    const {
      getSingleOrder,
      match: {
        params: { id },
      },
    } = this.props;
    getSingleOrder(id);
  }

  renderTitle = (status) => {
    switch (status) {
      case "sales_to_approve":
        return "Request in review";
      case "sales_review":
        return "New request";
      case "sales_rejected":
        return "Rejected request";

      default:
        break;
    }
  };

  submitForm = (data) => {
    const {
      history,
      match: {
        params: { id },
      },
      toApproval,
    } = this.props;
    toApproval(
      id,

      data.items &&
        data.items.map((el, idx) => ({
          // quantity: el.quantity,
          // price_per_unit: el.price,
          // delivery_date: el.delivery_date,
          // product: el.name.id,
          item_id: el.idProd,
          price_per_unit: +el.price,
        }))
    ).then((res) => {
      const {
        location: { search },
      } = this.props;
      const salesId = new URLSearchParams(search).get("id");

      if (res.payload && res.payload.status && res.payload.status === 200) {
        history.push("/main/sales-requests");
        return;
      } else {
        if (res.error && res.error.response && res.error.response.data) {
          Object.values(res.error.response.data)
            .flat()
            .forEach((el) =>
              toast(el, {
                progressClassName: "red-progress",
              })
            );
        } else {
          toast("Something went wrong.", {
            progressClassName: "red-progress",
          });
        }
        return;
      }
    });
  };

  render() {
    const { openRequestDialog } = this.state;
    const {
      handleSubmit,
      products,
      itemsArr,
      change,
      data: {
        status,

        user,
        request,
      },
      match: {
        params: { id },
      },

      salesManager,
      location: { search },
    } = this.props;
    const salesId = new URLSearchParams(search).get("id");
    return (
      <form
        className="sales_order_page_inner content_block"
        onSubmit={handleSubmit(this.submitForm)}
      >
        <div className="custom_title_wrapper">
          <div className="link_req">
            <Link to={"/main/sales-requests"}>
              <img src={Path} alt="Path" />
              Requests
            </Link>
          </div>
          <div className="title_page">
            {this.renderTitle(status)} #{request}
          </div>
          <div className="content_page">
            <div className="title_block">general info</div>
            <div className="general_info">
              <div className="block_field">
                <div>
                  <span>ID/PI#</span>
                  <Field
                    type="number"
                    name="request"
                    placeholder="Type here..."
                    component={RenderField}
                    disabled
                  />
                </div>
                <div>
                  <span>Customer</span>
                  <Field
                    type="text"
                    name="user"
                    placeholder="Type here..."
                    component={RenderField}
                    disabled
                  />
                </div>
                <div>
                  <span>Balance</span>
                  <Field
                    type="text"
                    name="balance"
                    placeholder=""
                    component={RenderField}
                    disabled
                  />
                </div>
              </div>
            </div>

            <FieldArray
              name={`items`}
              component={renderItems}
              products={products}
              itemsArr={itemsArr}
              change={change}
              user={user}
              status={status}
              openProductAct={() => this.setState({ openProduct: true })}
            />

            <div className="wrapper_btn">
              <div>
                <button
                  style={{ display: "none" }}
                  className="blue_btn"
                  formAction
                  ref={this.myRef}
                >
                  Submit
                </button>
                {status !== "sales_to_approve" && (
                  <div
                    className="blue_btn_bg"
                    onClick={() =>
                      this.setState({
                        openRequestDialog: true,
                      })
                    }
                  >
                    Submit
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogComponent
          open={openRequestDialog}
          onClose={() => {
            this.setState({
              openRequestDialog: false,
              proceed: false,
            });
          }}
        >
          <div className="orders_dialog">
            <div className="title">
              <span>Submit request</span>
            </div>
            <div className="descriptions">
              <span>
                Confirm that you want to submit the request <span>#{id}</span>{" "}
                for approval to the regional manager.
              </span>
            </div>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    openRequestDialog: false,
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="blue_btn"
                onClick={() => {
                  this.myRef.current.click();
                }}
              >
                Submit
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

  if (!values.items || !values.items.length) {
    errors.items = "You must fill in at least 1 product line.";
  } else {
    const itemsArrayErrors = [];
    values.items.forEach((el, idx) => {
      const itemsErrors = {};
      if (!el || !el.price) {
        itemsErrors.price = "Required field";
        itemsArrayErrors[idx] = itemsErrors;
      }
    });
    if (itemsArrayErrors.length) {
      errors.items = itemsArrayErrors;
    }
  }

  return errors;
};

const SalesRequestInnerForm = reduxForm({
  form: "SalesRequestInner",
  validate,
  enableReinitialize: true,
})(SalesRequestInner);

const selector = formValueSelector("SalesRequestInner");

function mapStateToProps(state) {
  const { dashboard, invoices, orders } = state;
  return {
    categories: dashboard.categories,
    users: invoices.invoice_options,
    products: invoices.invoice_product_options,
    itemsArr: selector(state, "items"),
    salesManager: selector(state, "sales"),
    data: orders.order,
    salesList: orders.sales,
    initialValues: {
      request: orders.order && orders.order.request,
      user: orders.order && orders.order.user && orders.order.user.username,
      balance: orders.order && orders.order.balance,
      sales:
        orders.order &&
        orders.order.sales_rep &&
        orders.order.sales_rep.username,
      due_date:
        orders.order && orders.order.due_date
          ? new Date(orders.order.due_date)
          : null,
      balance: orders.order && orders.order.balance,
      payment_status: {
        label:
          orders.order &&
          orders.order.payment_status &&
          orders.order.payment_status[0].toUpperCase() +
            orders.order.payment_status.slice(1),
        value: orders.order && orders.order.payment_status,
      },
      items:
        orders.order &&
        orders.order.items &&
        orders.order.items.map((el) => ({
          name: el.product && el.product.name,
          idProd: el.id,
          quantity: el.quantity,
          idProd: el.id,
          price: el.price_per_unit,
          delivery_date:
            el.delivery_date &&
            moment(el.delivery_date).format("DD/MM/yyyy HH:mm"),
          total: +el.price_per_unit * +el.quantity,
        })),
    },
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      change,
      getSingleOrder,
      toApproval,
      approveRequest,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesRequestInnerForm);

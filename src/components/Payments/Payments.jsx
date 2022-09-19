import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

import "./Payments.scss";
import Pagination from "../HelperComponents/Pagination/Pagination";
import FormControl from "@material-ui/core/FormControl";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";
import {
  getPayments,
  addPayment,
  invoiceLiveSearch,
  deletePayment,
} from "../../actions/paymentsActions";
import moment from "moment";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CalendarInput from "../HelperComponents/CalendarInput/CalendarInput";
import { toast } from "react-toastify";
import { toastErrors } from "../../helpers/functions";
import { ClickAwayListener } from "@material-ui/core";
import NumberFormat from "react-number-format";
import { ReactComponent as InHand } from "../../../src/assets/image/no-ok.svg";
import { ReactComponent as InfoIcon } from "../../assets/image/info_ico.svg";
import ReactTooltip from "react-tooltip";
class Payments extends Component {
  state = {
    activePage: 1,
    status_list: [
      { label: "Cash", value: "cash" },
      { label: "Check", value: "check" },
      { label: "Bank Transfer", value: "transfer" },
      { label: "Mobile Money", value: "mobile" },
    ],
    types_list: [
      { label: "All types", value: null },
      { label: "Payment", value: "payment" },
      { label: "Refund", value: "refund" },
      { label: "Refund on hand", value: "refund_on_hand" },
      { label: "Auto-payment", value: "auto_paid" },
    ],
    addStatus: null,
    commentText: "",
    activeStatus: null,
    activeType: null,
    search: "",
    addPeyment: false,
    paymentNum: "",
    date: new Date(),
    amount: "",
    method: {},
    notes: "",
    openSearch: false,
    chosenEl: null,
    openDeleteDialog: false,
    currentItemId: null,
    currentItemAmount: null,
    currentItemCurrency: null,
    currentItemName: "",
    activeStatus: { label: "All methods", value: null },
    activeType: { label: "All types", value: null },
  };

  componentDidMount() {
    const { getPayments } = this.props;
    getPayments();
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event });
  };
  changePage = (e) => {
    const { getPayments } = this.props;
    const { search, activeStatus, activeType } = this.state;
    getPayments(
      e.selected + 1,
      search,
      activeStatus && activeStatus.value,
      activeType && activeType.value
    );
    this.setState({ activePage: e.selected + 1 });
  };

  handleClickDelete = () => {
    const { getPayments, deletePayment } = this.props;
    const {
      activePage,
      search,
      activeStatus,
      currentItemId,
      activeType,
    } = this.state;
    deletePayment(currentItemId).then((res) => {
      res.payload &&
        res.payload.status &&
        res.payload.status === 204 &&
        getPayments(
          activePage,
          search,
          activeStatus && activeStatus.value,
          activeType && activeType.value
        );
      this.toggleDeleteDialog();
    });
  };

  toggleDeleteDialog = () => {
    this.setState(({ openDeleteDialog }) => ({
      openDeleteDialog: !openDeleteDialog,
    }));
  };

  deleteItem = (
    currentItemId,
    currentItemAmount,
    currentItemCurrency,
    currentItemName
  ) => {
    this.setState({
      currentItemId: currentItemId,
      currentItemAmount: currentItemAmount,
      currentItemCurrency: currentItemCurrency,
      currentItemName: currentItemName,
    });
    this.toggleDeleteDialog();
  };

  render() {
    const {
      activePage,
      status_list,
      types_list,
      search,
      activeStatus,
      activeType,
      addPeyment,
      paymentNum,
      date,
      amount,
      addStatus,
      commentText,
      openSearch,
      chosenEl,
      openDeleteDialog,
      currentItemAmount,
      currentItemCurrency,
      currentItemName,
    } = this.state;
    const {
      data,
      getPayments,
      addPayment,
      invoiceLiveSearch,
      invoices,
      role,
      loading
    } = this.props;

    return (
      <div className="payments_page content_block">
        <div className="custom_title_wrapper">
          <div className="title_page">Payments</div>
        </div>
        <div className="content_page">
          <div className="table_panel">
            <div>
              <input
                placeholder="Search by ID or customer…"
                value={search}
                onChange={(e) => {
                  getPayments(
                    1,
                    e.target.value,
                    activeStatus && activeStatus.value,
                    activeType && activeType.value
                  );
                  this.setState({
                    search: e.target.value,
                    activePage: 1,
                  });
                }}
              />
              <FormControl className="select_wrapper">
                <SelectComponent
                  value={
                    activeType
                      ? activeType
                      : { label: "All types", value: null }
                  }
                  options={types_list}
                  change={(e) => {
                    this.setState({ activeType: e, activePage: 1 }, () => {
                      getPayments(
                        1,
                        search,
                        activeStatus && activeStatus.value,
                        e ? e.value : null
                      );
                    });
                  }}
                  isClearable={true}
                  isSearchable={false}
                  placeholder="Select…"
                />
              </FormControl>
              <FormControl className="select_wrapper">
                <SelectComponent
                  value={
                    activeStatus
                      ? activeStatus
                      : { label: "All statuses", value: null }
                  }
                  options={status_list}
                  change={(e) => {
                    this.setState({ activeStatus: e, activePage: 1 }, () => {
                      getPayments(
                        1,
                        search,
                        e ? e.value : null,
                        activeType && activeType.value
                      );
                    });
                  }}
                  isClearable={true}
                  isSearchable={false}
                  placeholder="Select…"
                />
              </FormControl>
            </div>
            <div
              className="add-payment-btn"
              onClick={() => this.setState({ addPeyment: true })}
            >
              + ADD PAYMENT
            </div>
          </div>
          <div className="order_page_table">
            <div className="table_container transactions_columns">
              <div
                className={`table_header${
                  role === "super_admin" ? " isdelete" : ""
                }`}
              >
                <div className="table_row">
                  <div className="row_item">Date/time</div>
                  <div className="row_item">ID/PI#</div>
                  <div className="row_item">Customer</div>
                  <div className="row_item">Method</div>
                  <div className="row_item">Payment</div>
                </div>
              </div>
              <div className="table_body">
                {data &&
                  data.results &&
                  data.results.map(
                    ({
                      id,
                      date,
                      amount,
                      method,
                      order,
                      currency,
                      notes,
                      event_type,
                    }) => (
                      <div className="table_row" key={id}>
                        <div className="row_item">
                          {moment(date).format("DD/MM/YYYY HH:mm")}
                        </div>
                        <div className="row_item">
                          <Link
                            to={`/main/orders-inner-edit/${order && order.id}`}
                          >
                            {order && order.request}
                          </Link>
                        </div>
                        <div className="row_item">
                          <Link
                            to={`/main/customers/inner/${order &&
                              order.created_by_id}`}
                          >
                            {order && order.customer_name}
                          </Link>
                        </div>
                        <div className="row_item method">
                          {method
                            ? method === "transfer"
                              ? "Bank Transfer"
                              : method === "mobile"
                              ? "Mobile Money"
                              : method[0].toUpperCase() + method.slice(1)
                            : "-"}{" "}
                          {(event_type === "refund" ||
                            event_type === "refund_on_hand") &&
                            "- Refund"}
                          {event_type === "auto_paid" && "- Auto-payment"}
                          {event_type === "refund_on_hand" && (
                            <span className="in-hand">
                              <InHand />
                              In hand
                            </span>
                          )}
                        </div>
                        <div className="row_item">
                          <p className="status-name">
                            <div className="balance_due">
                              {new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 0,
                              }).format(Number(amount).toFixed(0))}{" "}
                              {currency && currency}
                              {notes && (
                                <>
                                  <InfoIcon data-tip data-for={`info-${id}`} />
                                  <ReactTooltip
                                    id={`info-${id}`}
                                    effect="solid"
                                    place="top"
                                    backgroundColor="#FFFFFF"
                                    textColor="#334150"
                                    className="tooltip"
                                  >
                                    <span>{notes}</span>
                                  </ReactTooltip>
                                </>
                              )}
                            </div>
                          </p>
                        </div>
                        {role === "super_admin" && (
                          <div className="row_item delete">
                            <button
                              onClick={() =>
                                this.deleteItem(
                                  id,
                                  amount,
                                  currency,
                                  order.customer_name
                                )
                              }
                              className="delete_btn"
                            >
                              DELETE
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>

          {data && data.count && data.count > 10 ? (
            <div className="pagination_info_wrapper">
              <div className="pagination_block">
                <Pagination
                  active={activePage - 1}
                  pageCount={data.count && Math.ceil(data.count / 10)}
                  onChange={this.changePage}
                />
              </div>

              <div className="info">
                {" "}
                Displaying page {activePage} of{" "}
                {data.count && Math.ceil(data.count / 10)}, items{" "}
                {activePage * 10 - 9} to{" "}
                {activePage * 10 > data.count ? data.count : activePage * 10} of{" "}
                {data.count}
              </div>
            </div>
          ) : null}
        </div>
        <DialogComponent
          open={openDeleteDialog}
          onClose={() => this.toggleDeleteDialog()}
        >
          <div className="delete_dialog">
            <div className="title">Delete payment</div>
            <div className="descriptions">
              You are about to delete a{" "}
              <b>{currentItemName && currentItemName}</b> payment in the amount
              of{" "}
              <b>
                {
                  <NumberFormat
                    className="balance-value"
                    value={Math.round(currentItemAmount) || "-"}
                    displayType={"text"}
                    thousandSeparator={true}
                  />
                }

                {currentItemCurrency && " "}
                {currentItemCurrency && currentItemCurrency}
              </b>
              . Are you sure?
            </div>
            <div className="btn_wrapper">
              <button className="cancel_btn" onClick={this.toggleDeleteDialog}>
                Cancel
              </button>
              <button className="red_btn" onClick={this.handleClickDelete}>
                delete
              </button>
            </div>
          </div>
        </DialogComponent>
        <DialogComponent
          open={addPeyment}
          onClose={() => {
            this.setState({
              addPeyment: false,
              amount: "",
              addStatus: null,
              commentText: "",
              date: new Date(),
              paymentNum: "",
            });
          }}
        >
          <div className="payment_dialog">
            <div className="title">Add payment</div>
            <div className="block_add_field">
              <div className="number">
                <div className="block_field row">
                  <span>ID/PI#</span>
                  <span style={{ display: "none" }} />
                </div>
                <input
                  onChange={(e) => {
                    this.setState({
                      paymentNum: e.target.value,
                      openSearch: true,
                      chosenEl: null,
                    });
                    invoiceLiveSearch(e.target.value);
                  }}
                  value={paymentNum}
                  type="text"
                  placeholder="Type here..."
                />
                {invoices && openSearch && (
                  <ClickAwayListener
                    onClickAway={() =>
                      this.setState({
                        openSearch: false,
                      })
                    }
                  >
                    <div className="live-search-results">
                      {invoices &&
                        invoices.length > 0 &&
                        invoices.map((el) => (
                          <div
                            className="result-el"
                            onClick={() =>
                              this.setState({
                                openSearch: false,
                                paymentNum: el.request,
                                chosenEl: el,
                              })
                            }
                          >
                            {el.request}
                          </div>
                        ))}
                    </div>
                  </ClickAwayListener>
                )}
              </div>
            </div>
            <div className="block_add_field">
              <div className="wrapper-fields">
                <div>
                  <div className="number">
                    <div className="block_field row">
                      <span>Date</span>
                      <span style={{ display: "none" }} />
                    </div>
                    <DatePicker
                      selected={date}
                      onChange={(date) => this.setState({ date })}
                      className="date-picker-custom"
                      timeFormat="p"
                      locale="en-GB"
                      popperPlacement="top"
                      customInput={<CalendarInput value={date} />}
                      withPortal
                    />
                  </div>
                </div>
                <div>
                  <div className="number">
                    <div className="block_field row">
                      <span>Amount</span>
                      <span style={{ display: "none" }} />
                    </div>
                    <input
                      onChange={(e) =>
                        this.setState({
                          amount: e.target.value,
                        })
                      }
                      value={amount}
                      placeholder="0.00"
                      type="number"
                    />
                  </div>
                </div>
                <div>
                  <div className="number">
                    <div className="block_field row">
                      <span>Method</span>
                      <span style={{ display: "none" }} />
                    </div>
                    <FormControl className="select_wrapper">
                      <SelectComponent
                        value={addStatus}
                        options={status_list}
                        change={(e) => {
                          this.setState({
                            addStatus: e,
                          });
                        }}
                        isClearable={false}
                        isSearchable={false}
                        placeholder="Select…"
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
            <div className="payment-data-row block_field">
              <span>Note</span>
              <textarea
                className="payment-data--textarea"
                placeholder="Type here..."
                onChange={(e) =>
                  this.setState({
                    commentText: e.target.value,
                  })
                }
                rows="4"
              ></textarea>
            </div>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    addPeyment: false,
                    amount: "",
                    addStatus: null,
                    date: new Date(),
                    commentText: "",
                    paymentNum: "",
                  });
                }}
              >
                Cancel
              </button>
              <button
                className={loading ? "blue_btn_unactive" : "blue_btn"}
                disabled={loading}
                onClick={() => {
                  if (!paymentNum || !date || !amount || !addStatus) {
                    toast("You need to fill all fields.", {
                      progressClassName: "red-progress",
                    });
                  } else {
                    addPayment({
                      order: chosenEl ? chosenEl.id : paymentNum,
                      amount: amount,
                      method: addStatus && addStatus.value,
                      date: new Date(date),
                      event_type: "payment",
                      notes: commentText || "",
                    }).then((res) => {
                      if (
                        res.payload &&
                        res.payload.status &&
                        res.payload.status === 201
                      ) {
                        this.setState({
                          addPeyment: false,
                          amount: "",
                          addStatus: null,
                          commentText: "",
                          date: new Date(),
                          paymentNum: "",
                        });
                        getPayments(
                          activePage,
                          search,
                          activeStatus && activeStatus.value,
                          activeType && activeType.value
                        );
                        toast("Payment was created");
                      } else {
                        toastErrors(res);
                      }
                    });
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        </DialogComponent>
      </div>
    );
  }
}

function mapStateToProps({ orders, payments, auth }) {
  return {
    data: payments.list,
    invoices: payments.invoices,
    role: auth.data.role,
    loading: payments.loading,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getPayments, addPayment, invoiceLiveSearch, deletePayment },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Payments);

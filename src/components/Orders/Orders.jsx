import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import no_actions from "../../assets/image/no_actions.svg";
import no_ok from "../../assets/image/no-ok.svg";
import new_icon from "../../assets/image/new_icon.svg";
import no_partial from "../../assets/image/no-partial.svg";
import "./Orders.scss";
import Pagination from "../HelperComponents/Pagination/Pagination";
import FormControl from "@material-ui/core/FormControl";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";
import {
  getOrders,
  getActiveOrders,
  getDisableOrders,
} from "../../actions/ordersActions";
import moment from "moment";
import PrintSVG from "../../assets/image/print.svg";
import { getActivityOrder } from "../../actions/invoiceActions";
import "jspdf-autotable";
import noRefunded from "../../assets/image/no-refunded.svg";
import Upload from "../../assets/image/upload.svg";
import Download from "../../assets/image/download.svg";
import {
  changeOrder,
  partialChangeOrder,
  getSingleOrder,
  getSingleDisabledOrder,
  disableInvoice,
} from "../../actions/ordersActions";
import ReactTooltip from "react-tooltip";
import overdueImg from "../../assets/image/overdue-img.svg";
import missingImg from "../../assets/image/missing-img.svg";
import markOK from "../../assets/image/no-ok.svg";
import NumberFormat from "react-number-format";
import { ReactComponent as InfoIcon } from "../../assets/image/info_ico.svg";
import { BlobProvider } from "@react-pdf/renderer";
import ProformaPDF from "./OrdersInner/ProformaPDF";
import InvoicePDF from "./OrdersInner/InvoicePDF";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";
import Disable from "../../assets/image/disable.svg";
import Enable from "../../assets/image/enable.svg";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import { toast } from "react-toastify";

class Orders extends Component {
  state = {
    activePage: 1,
    tab: "0",
    auth: "",
    status_list: [
      { label: "All statuses", value: null },
      { label: "Request", value: "request" },
      { label: "Reviewing by Sales Rep.", value: "sales_review" },
      { label: "Rejected", value: "sales_rejected" },
      { label: "Waiting for approval", value: "sales_to_approve" },
      { label: "Proforma", value: "proforma" },
      { label: "Purchase Order", value: "order" },
      { label: "Delivery in progress", value: "delivery" },
      { label: "P.O. delivered", value: "delivered" },
      { label: "Invoice", value: "invoice" },
      { label: "Refunded", value: "refunded" },
      { label: "Receipt", value: "receipt" },
    ],
    status_list_tab_reg_adm: [
      { label: "All statuses", value: null },
      { label: "Request", value: "request" },
      { label: "Reviewing by Sales Rep.", value: "sales_review" },
      { label: "Waiting for approval", value: "sales_to_approve" },
      { label: "Proforma", value: "proforma" },
      { label: "Purchase Order", value: "order" },
      { label: "P.O. delivered", value: "delivered" },
    ],
    status_list_tab_sales: [
      { label: "All statuses", value: null },
      { label: "Reviewing by Sales Rep.", value: "sales_review" },
      { label: "Rejected", value: "sales_rejected" },
    ],
    createdBy_list: [
      { label: "Created by anyone", value: null },
      { label: "Created by Admin", value: "admin" },
      { label: "Created by Region Manager", value: "region" },
      { label: "Created by Sales Rep.", value: "sales" },
      { label: "Created by Customer", value: "clinic" },
    ],
    activeStatus: { label: "All statuses", value: null },
    pdfLink: false,
    choosenOrder: "",
    linkCount: 1,
    pdfLinkArray: [],
    confirmedByCustomer: false,
    activeCreatedByStatus: { label: "Created by anyone", value: "null" },
    search: "",
    role: "",
    activityOrder: "",
    orderLoading: false,
    openDisabled: false,
    disabledId: "",
    namesOfStatuses: {
      all: "All",
      request: "Request",
      proforma: "Proforma",
      order: "Purchase order",
      delivery: "Delivery in progress",
      delivered: "P.O. delivered",
      invoice: "Invoice",
      refunded: "Refunded",
      receipt: "Receipt",
      sales_to_approve: "Request",
      sales_review: "Request",
      sales_rejected: "Request",
    },
  };

  componentDidMount() {
    const {
      getOrders,
      getActiveOrders,
      getDisableOrders,
      getSingleOrder,
      getSingleDisabledOrder,
    } = this.props;
    getOrders();
    getActiveOrders();
    getDisableOrders();
  }

  componentDidUpdate(prevProps, prevState) {
    const { getOrders, getActiveOrders, getDisableOrders } = this.props;
    if (prevState.tab !== this.state.tab) {
      getOrders();
      getActiveOrders();
      getDisableOrders();
    }
  }
  changeTab = (tab) => {
    this.setState({ tab, inputValue: "" });
  };

  clearFilters = () => {
    this.setState({
      activeStatus: { label: "All statuses", value: null },
      confirmedByCustomer: false,
      activeCreatedByStatus: { label: "Created by anyone", value: "null" },
      search: "",
    });
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event });
  };
  changePage = (e) => {
    const { getOrders, getActiveOrders, getDisableOrders } = this.props;
    const {
      search,
      activeStatus,
      confirmedByCustomer,
      activeCreatedByStatus,
    } = this.state;

    this.state.tab === "0"
      ? getOrders(
          e.selected + 1,
          search,
          activeStatus.value,
          activeCreatedByStatus.label !== "Created by anyone" &&
            activeCreatedByStatus.value,
          confirmedByCustomer
        )
      : this.state.tab === "1"
      ? getActiveOrders(
          e.selected + 1,
          search,
          activeStatus.value,
          activeCreatedByStatus.label !== "Created by anyone" &&
            activeCreatedByStatus.value,
          confirmedByCustomer
        )
      : getDisableOrders(
          e.selected + 1,
          search,
          activeStatus.value,
          activeCreatedByStatus.label !== "Created by anyone" &&
            activeCreatedByStatus.value,
          confirmedByCustomer
        );

    this.setState({ activePage: e.selected + 1 });
  };

  returnStatusName = (status) => {
    switch (status) {
      case "delivered":
        return "P.O. delivered";
      case "delivery":
        return "Delivery note";
      case "receipt":
        return "Receipt";
      case "order":
        return "Purchase Order";
      case "proforma":
        return "Proforma";
      case "request":
      case "sales_to_approve":
      case "sales_review":
      case "sales_rejected":
        return "Request";
      case "invoice":
      case "refunded":
        return "Invoice";

      default:
        return null;
    }
  };

  GetCurrOrder = (id, status) => {
    const { getSingleOrder } = this.props;
    getSingleOrder(id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        res.payload.data.status === "proforma"
          ? console.log(1)
          : console.log(2);
      }
    });
  };

  render() {
    const {
      tab,
      activePage,
      tablelist,
      status_type,
      status_list,
      status_list_tab_reg_adm,
      status_list_tab_sales,
      search,
      activeStatus,
      pdfLink,
      choosenOrder,
      linkCount,
      pdfLinkArray,
      confirmedByCustomer,
      activeCreatedByStatus,
      createdBy_list,
      openDisabled,
      disabledId,
    } = this.state;
    const {
      data,
      dataActive,
      dataDisbled,
      auth,
      getOrders,
      getSingleOrder,
      getSingleDisabledOrder,
      disableInvoice,
      getActiveOrders,
      getDisableOrders,
      changeOrder,
      role,
      dataCur,
      activityOrder,
      orderLoading,
      partialChangeOrder,
      history,
    } = this.props;
    let renderData;
    tab === "0"
      ? (renderData = data)
      : tab === "1"
      ? (renderData = dataActive)
      : (renderData = dataDisbled);

    const openPdf = (pdfLinkArray, linkCount = 1) => {
      window.open(pdfLinkArray[0], "_blank");
      this.setState({
        linkCount: linkCount + 1,
        pdfLink: false,
        pdfLinkArray: [],
      });
    };

    const printAvailablle = [
      "invoice",
      "receipt",
      "proforma",
      "sales_to_approve",
      "sales_review",
      "order",
      "sales_rejected",
    ];

    const printAvailablleSales = ["proforma"];

    return (
      <div className="order_page content_block">
        <div className="custom_title_wrapper">
          <div className="title_page">Orders</div>
        </div>
        <div className="content_page">
          <div className="table_panel">
            {
              <div className="tab_customers">
                <button
                  className={tab === "0" ? "active" : ""}
                  onClick={() => {
                    this.changeTab("0");
                    this.clearFilters();
                  }}
                >
                  all orders
                </button>
                <button
                  className={tab === "1" ? "active" : ""}
                  onClick={() => {
                    this.changeTab("1");
                    this.clearFilters();
                  }}
                >
                  action needed
                  {dataActive &&
                  dataActive.results &&
                  dataActive.results.length > 0 ? (
                    <span />
                  ) : null}
                </button>
                {role === "super_admin" && (
                  <button
                    className={tab === "2" ? "active" : ""}
                    onClick={() => {
                      this.changeTab("2");
                      this.clearFilters();
                    }}
                  >
                    disabled orders
                  </button>
                )}
              </div>
            }
            <div className="create-btns">
              {<Link to="/main/orders-proforma-inner-add">+ ADD PROFORMA</Link>}

              {auth.role !== "sales" && (
                <Link to="/main/orders-inner-add">+ ADD INVOICE</Link>
              )}
            </div>
          </div>

          <div className="table_panel">
            <div>
              <input
                placeholder="Search by customer…"
                value={search}
                onChange={(e) => {
                  tab === "0"
                    ? getOrders(
                        1,
                        e.target.value,
                        activeStatus && activeStatus.value,
                        confirmedByCustomer
                      )
                    : tab === "1"
                    ? getActiveOrders(
                        1,
                        e.target.value,
                        activeStatus && activeStatus.value,
                        confirmedByCustomer
                      )
                    : getDisableOrders(
                        1,
                        e.target.value,
                        activeStatus && activeStatus.value,
                        confirmedByCustomer
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
                    activeStatus
                      ? activeStatus
                      : { label: "All statuses", value: null }
                  }
                  options={
                    tab === "0"
                      ? status_list
                      : role === "sales"
                      ? status_list_tab_sales
                      : status_list_tab_reg_adm
                  }
                  change={(e) => {
                    this.setState({ activeStatus: e, activePage: 1 }, () => {
                      console.log(e);
                      tab === "0"
                        ? getOrders(
                            1,
                            search,
                            e ? e.value : null,
                            confirmedByCustomer
                          )
                        : tab === "1"
                        ? getActiveOrders(
                            1,
                            search,
                            e ? e.value : null,
                            confirmedByCustomer
                          )
                        : getDisableOrders(
                            1,
                            search,
                            e ? e.value : null,
                            confirmedByCustomer
                          );
                    });
                  }}
                  isClearable={false}
                  isSearchable={false}
                  placeholder="Select…"
                />
              </FormControl>
              <FormControl className="select_wrapper select_created">
                <SelectComponent
                  value={
                    activeCreatedByStatus
                      ? activeCreatedByStatus
                      : { label: "Created by anyone", value: null }
                  }
                  options={createdBy_list}
                  change={(e) => {
                    this.setState(
                      { activeCreatedByStatus: e, activePage: 1 },
                      () => {
                        console.log(e);
                        tab === "0"
                          ? getOrders(
                              1,
                              search,
                              activeStatus.value,
                              e ? e.value : null,
                              confirmedByCustomer
                            )
                          : tab === "1"
                          ? getActiveOrders(
                              1,
                              search,
                              activeStatus.value,
                              e ? e.value : null,
                              confirmedByCustomer
                            )
                          : getDisableOrders(
                              1,
                              search,
                              activeStatus.value,
                              e ? e.value : null,
                              confirmedByCustomer
                            );
                      }
                    );
                  }}
                  isClearable={false}
                  isSearchable={false}
                  placeholder="Select…"
                />
              </FormControl>
              <FormControl className="select_wrapper checkbox">
                <div id="confirmed__checkbox" className="due-date-checkbox">
                  <input
                    id="checkbox"
                    type="checkbox"
                    checked={this.state.confirmedByCustomer}
                    onChange={(e) => {
                      this.setState(
                        {
                          confirmedByCustomer: !confirmedByCustomer,
                          activePage: 1,
                        },
                        () => {
                          tab === "0"
                            ? getOrders(
                                1,
                                search,
                                activeStatus.value,
                                e ? e.value : null,
                                !confirmedByCustomer
                              )
                            : tab === "1"
                            ? getActiveOrders(
                                1,
                                search,
                                activeStatus.value,
                                e ? e.value : null,
                                !confirmedByCustomer
                              )
                            : getDisableOrders(
                                1,
                                search,
                                activeStatus.value,
                                e ? e.value : null,
                                !confirmedByCustomer
                              );
                        }
                      );
                    }}
                  />
                  <label for="checkbox">Confirmed by Customer</label>
                </div>
              </FormControl>
            </div>
          </div>
          <div className="order_page_table">
            <div className="table_container transactions_columns">
              <div className="table_header">
                <div className="table_row">
                  <div className="row_item">Date/time</div>
                  <div className="row_item">ID/PI#</div>
                  <div className="row_item">Customer</div>
                  <div className="row_item">Balance due</div>

                  <div className="row_item">Status</div>
                  <div className="row_item">Total</div>
                  <div className="row_item" />
                </div>
              </div>

              <div className="table_body">
                {renderData &&
                  renderData.results &&
                  renderData.results.map(
                    ({
                      id,
                      date,
                      customer_name,
                      balance,
                      status,
                      created_by_id,
                      request,
                      payment_status,
                      tax_invoice_file,
                      is_confirmed_by_customer,

                      is_rejected,
                      is_overdue,
                      disabled,
                      currency,
                      invoice_file,
                      created_by_user,
                      is_approved,
                      total,
                      notes,
                      tax_invoice_number,
                    }) => (
                      <div
                        className={
                          sessionStorage.getItem("copiedProforma") == id
                            ? "table_row copied"
                            : "table_row"
                        }
                        key={id}
                      >
                        <div className="row_item">
                          {moment(date).format("DD/MM/YYYY HH:mm")}
                          {is_overdue && (
                            <div className="overdue-wrap">
                              <img src={overdueImg} alt="overdueImg" />
                              <p>Overdue</p>
                            </div>
                          )}
                        </div>
                        <div className="row_item">
                          <Link
                            to={`/main/orders-inner-edit/${id}?disabled=${disabled}`}
                          >
                            {request}
                          </Link>
                          {is_confirmed_by_customer && (
                            <div className="mark-ok">
                              <img src={markOK} alt="markOK" /> by Customer
                            </div>
                          )}
                        </div>
                        <div className="row_item customer-block">
                          <Link to={`/main/customers/inner/${created_by_id}`}>
                            {customer_name}
                          </Link>

                          {created_by_user !== null && (
                            <p className="created-by-block">
                              Created by{" "}
                              {created_by_user.region_accordance
                                ? `${created_by_user.region_accordance} manager`
                                : created_by_user.role === "sales"
                                ? "Sales Rep."
                                : created_by_user.role === "super_admin"
                                ? "Admin"
                                : created_by_user.role === "region"
                                ? "Region Manager"
                                : "Customer"}
                            </p>
                          )}
                        </div>
                        <div className="row_item">
                          <div className="balance_due">
                            <NumberFormat
                              className="balance-value"
                              value={Math.round(balance) || "-"}
                              displayType={"text"}
                              thousandSeparator={true}
                            />{" "}
                            {currency}
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

                          {status === "invoice" &&
                            payment_status === "paid" &&
                            (tax_invoice_file === null ||
                              invoice_file === null) && (
                              <div className="missing-wrap">
                                <img src={missingImg} alt="missing" />
                                <p>Missing documents</p>
                              </div>
                            )}
                        </div>

                        <div className="row_item">
                          <div>
                            <p className="status-name">
                              {this.returnStatusName(status)}

                              {(status === "invoice" || status === "receipt") &&
                                (payment_status === "overdue" ? (
                                  <span className="status_block overdue">
                                    <img src={no_actions} alt="Overdue" />{" "}
                                    Overdue
                                  </span>
                                ) : payment_status === "paid" ? (
                                  <span className="status_block paid">
                                    <img src={no_ok} alt="paid" /> Paid
                                  </span>
                                ) : payment_status === "partial" ? (
                                  <span className="status_block partial">
                                    <img src={no_partial} alt="partial" />{" "}
                                    Partial
                                  </span>
                                ) : payment_status === "new" ? (
                                  <span className="status_block new">
                                    <img src={new_icon} alt="new" /> New
                                  </span>
                                ) : null)}
                              {(status === "sales_to_approve" &&
                                auth.role !== "sales") ||
                              (status === "order" && auth.role !== "sales") ||
                              (status === "delivery" &&
                                auth.role !== "sales") ||
                              (status === "proforma" && !is_approved) ||
                              (status === "sales_review" &&
                                auth.role === "sales") ||
                              (status === "sales_rejected" &&
                                auth.role === "sales") ? (
                                <span className="blue-dot" />
                              ) : (
                                ""
                              )}
                              {status === "refunded" ? (
                                <span className="status_block refunded">
                                  <img src={noRefunded} alt="refunded" />{" "}
                                  Refunded
                                </span>
                              ) : null}
                            </p>
                            {(status === "sales_to_approve" ||
                              (status === "sales_review" &&
                                auth.role !== "sales") ||
                              status === "sales_rejected" ||
                              is_rejected === true) && (
                              <p
                                className={
                                  "request-status " +
                                  `${(status === "sales_rejected" ||
                                    is_rejected === true) &&
                                    " rejected"}`
                                }
                              >
                                {status === "sales_to_approve"
                                  ? "Waiting for approval"
                                  : status === "sales_review"
                                  ? "Reviewing by Sales Rep."
                                  : "Rejected" ||
                                    (is_rejected === true && "Rejected")}
                              </p>
                            )}
                            {!is_approved && status === "proforma" && (
                              <>
                                <p className="is_approved">
                                  Waiting for approval
                                </p>
                              </>
                            )}
                            {(status === "invoice" || status === "refunded") &&
                              tax_invoice_number && (
                                <p className="tax_invoice_number">
                                  Tax invoice:{" "}
                                  <span className="tax_invoice_number--value">
                                    {tax_invoice_number}
                                  </span>
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="row_item">
                          <p>
                            <NumberFormat
                              className="balance-value"
                              value={total}
                              displayType={"text"}
                              thousandSeparator={true}
                            />
                          </p>
                          {currency}
                        </div>

                        <div className="row_item">
                          {
                            <div className="upload">
                              {!tax_invoice_file ? (
                                <>
                                  <label for="fileInp">
                                    <img
                                      src={Upload}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      alt="upload"
                                      data-tip
                                      data-for={`upload-${id}`}
                                    />
                                    <ReactTooltip
                                      id={`upload-${id}`}
                                      effect="solid"
                                      place="top"
                                      backgroundColor="#FFFFFF"
                                      textColor="#334150"
                                      className="tooltip"
                                    >
                                      <span>Upload tax invoice</span>
                                    </ReactTooltip>
                                  </label>
                                  <input
                                    style={{
                                      display: "none",
                                    }}
                                    type="file"
                                    id="fileInp"
                                    onChange={(e) => {
                                      let tax_file = e.target.files[0];
                                      const formData = new FormData();
                                      tax_file &&
                                        formData.append(
                                          "tax_invoice_file",
                                          tax_file
                                        );

                                      partialChangeOrder(id, formData).then(
                                        (res) => {
                                          if (
                                            res.payload &&
                                            res.payload.status &&
                                            res.payload.status === 200
                                          ) {
                                            tab === "0"
                                              ? getOrders(
                                                  1,
                                                  e.target.value,
                                                  activeStatus &&
                                                    activeStatus.value,
                                                  confirmedByCustomer
                                                )
                                              : tab === "1"
                                              ? getActiveOrders(
                                                  1,
                                                  e.target.value,
                                                  activeStatus &&
                                                    activeStatus.value,
                                                  confirmedByCustomer
                                                )
                                              : getDisableOrders(
                                                  1,
                                                  e.target.value,
                                                  activeStatus &&
                                                    activeStatus.value,
                                                  confirmedByCustomer
                                                );
                                          }
                                        }
                                      );
                                    }}
                                  />
                                </>
                              ) : (
                                <a
                                  href={tax_invoice_file}
                                  download
                                  target="_blank"
                                >
                                  <>
                                    <img
                                      src={Download}
                                      alt="download"
                                      data-tip
                                      data-for={`download-${id}`}
                                    />
                                    <ReactTooltip
                                      id={`download-${id}`}
                                      effect="solid"
                                      place="top"
                                      backgroundColor="#FFFFFF"
                                      textColor="#334150"
                                      className="tooltip"
                                    >
                                      <span>Download tax invoice</span>
                                    </ReactTooltip>
                                  </>
                                </a>
                              )}
                            </div>
                          }
                          {(auth.role === "sales"
                            ? printAvailablleSales.includes(status)
                            : printAvailablle.includes(status) ) &&
                              dataCur.id !== id && (
                                <>
                                  {orderLoading &&
                                  this.state.choosenOrder === id ? (
                                    <a>
                                      <p>
                                        <Loader
                                          classNameCustom={"loader_small"}
                                          size="20"
                                        />
                                      </p>
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      disabled={orderLoading}
                                      onMouseEnter={() => {
                                        this.setState({ choosenOrder: id });
                                        this.state.tab !== "2"
                                          ? this.props
                                              .getSingleOrder(id)
                                              .then(
                                                (res) =>
                                                  res &&
                                                  res.payload &&
                                                  res.payload.status === 200 &&
                                                  this.setState({
                                                    pdfLink: true,
                                                  })
                                              )
                                          : this.props
                                              .getSingleDisabledOrder(id)
                                              .then(
                                                (res) =>
                                                  res &&
                                                  res.payload &&
                                                  res.payload.status === 200 &&
                                                  this.setState({
                                                    pdfLink: true,
                                                  })
                                              );
                                      }}
                                      className="print-button"
                                    >
                                      <img src={PrintSVG} alt="print" />
                                    </button>
                                  )}
                                </>
                              )}

                          {(auth.role === "sales"
                            ? printAvailablleSales.includes(status)
                            : printAvailablle.includes(status)) &&
                              dataCur.id === id && (
                              <>
                                {
                                  <BlobProvider
                                    document={
                                      activityOrder &&
                                      activityOrder.status &&
                                      activityOrder.status !== "proforma" ? (
                                        <InvoicePDF pdfData={activityOrder} />
                                      ) : (
                                        <ProformaPDF pdfData={activityOrder} />
                                      )
                                    }
                                    textPDF={"data"}
                                  >
                                    {({ url, loading, ...props }) => {
                                      url !== null && pdfLinkArray.push(url);

                                      return loading ? (
                                        <a>
                                          <p>
                                            <Loader
                                              classNameCustom={"loader_small"}
                                              size="20"
                                            />
                                          </p>
                                        </a>
                                      ) : (
                                        <a href={url} target="_blank">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              console.log("printed")
                                            }
                                            className="print-button"
                                          >
                                            <img src={PrintSVG} alt="print" />
                                          </button>
                                        </a>
                                      );
                                    }}
                                  </BlobProvider>
                                }
                              </>
                            )}

                          {role === "super_admin" && (
                            <button
                              data-tip
                              type="button"
                              className="disable-button"
                              data-for={`disabled-${id}`}
                              onClick={(e) => {
                                this.setState({
                                  disabledId: id,
                                  openDisabled: true,
                                });
                              }}
                            >
                              <img
                                src={this.state.tab !== "2" ? Disable : Enable}
                                alt="disable/enable"
                              />
                            </button>
                          )}
                          <ReactTooltip
                            id={`disabled-${id}`}
                            effect="solid"
                            place="top"
                            backgroundColor="#FFFFFF"
                            textColor="#334150"
                            className="tooltip"
                          >
                            <span>
                              {this.state.tab !== "2"
                                ? "Disable order"
                                : "Enable"}
                            </span>
                          </ReactTooltip>
                        </div>
                        {/* DISABLE ORDER POPUP */}
                        {id === disabledId && (
                          <DialogComponent
                            open={openDisabled}
                            onClose={() => {
                              this.setState({
                                openDisabled: false,
                                disabledId: "",
                              });
                            }}
                          >
                            {
                              <div className="edit_dialog">
                                <div className="title">
                                  {this.state.tab !== "2"
                                    ? "Disable order"
                                    : "Enable order"}
                                </div>

                                <div className="descriptions">
                                  You are about to{" "}
                                  {this.state.tab !== "2"
                                    ? "disable"
                                    : "enable"}{" "}
                                  {status} <span>#{request}</span>. Are you
                                  sure?
                                </div>

                                {((payment_status === "partial" &&
                                  this.state.tab !== "2") ||
                                  (payment_status === "paid" &&
                                    this.state.tab !== "2")) && (
                                  <div className="warning__block">
                                    <img src={missingImg} alt="warning" />
                                    <p>
                                      {payment_status === "partial" &&
                                        `This is a partially paid ${status}. All payments will be marked as refunded.`}
                                      {payment_status === "paid" &&
                                        `This is a paid ${status}. All payments will be marked as refunded.`}
                                    </p>
                                  </div>
                                )}

                                <div className="btn_wrapper">
                                  <button
                                    className="cancel_btn"
                                    onClick={() => {
                                      this.setState({
                                        openDisabled: false,
                                        disabledId: "",
                                      });
                                    }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className={
                                      orderLoading
                                        ? "blue_btn_unactive"
                                        : this.state.tab !== "2"
                                        ? "red_btn"
                                        : "blue_btn"
                                    }
                                    disabled={orderLoading}
                                    onClick={() => {
                                      disableInvoice(disabledId, {
                                        disabled:
                                          this.state.tab !== "2" ? true : false,
                                      }).then((res) => {
                                        if (
                                          res.payload &&
                                          res.payload.status &&
                                          res.payload.status === 200
                                        ) {
                                          this.setState({
                                            openDisabled: false,
                                            disabledId: "",
                                          });
                                          getOrders();
                                          getActiveOrders();
                                          getDisableOrders();
                                        } else {
                                          Object.values(res.error.response.data)
                                            .flat()
                                            .forEach((el) =>
                                              toast(el, {
                                                progressClassName:
                                                  "red-progress",
                                              })
                                            );
                                        }
                                      });
                                    }}
                                  >
                                    {this.state.tab !== "2"
                                      ? "Disable"
                                      : "Enable"}
                                  </button>
                                </div>
                              </div>
                            }
                          </DialogComponent>
                        )}
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>

          {renderData && renderData.count && renderData.count > 10 ? (
            <div className="pagination_info_wrapper">
              <div className="pagination_block">
                <Pagination
                  active={activePage - 1}
                  pageCount={
                    renderData.count && Math.ceil(renderData.count / 10)
                  }
                  onChange={this.changePage}
                />
              </div>

              <div className="info">
                Displaying page 1 of 2, items 1 to 10 of 12
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ orders, auth, invoices }) {
  return {
    data: orders.list,
    role: auth.data.role,
    activityOrder: orders && orders.order && orders.order,
    orderLoading: orders && orders.loading && orders.loading,
    dataActive: orders.active_list,
    dataDisbled: orders.disabled_list,
    auth: auth.data,
    dataCur: orders.order,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrders,
      getActiveOrders,
      getDisableOrders,
      getActivityOrder,
      changeOrder,
      partialChangeOrder,
      getSingleOrder,
      getSingleDisabledOrder,
      disableInvoice,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);

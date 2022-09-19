import React, { Component } from "react";
import { connect } from "react-redux";
import DialogComponentActivity from "../HelperComponents/DialogComponent/DialogComponentForActivity";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import {
  getInvoice,
  getInvoiceOptions,
  getInvoiceProductOptions,
  postInvoice,
  sortFunction,
  getActivityOrder,
} from "../../actions/invoiceActions";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import moment from "moment";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { data_image } from "./imagedata";
import Snack from "./../HelperComponents/Snack/Snack";
import imageData from "../../assets/image/logo.png";
import closeIcon from "../../assets/image/close.svg";
import "./Invoice.scss";
import { reduxForm } from "redux-form";
import DefaultButton from "../Buttons/DefaultButton/DefaultButton";
import Pagination from "../HelperComponents/Pagination/Pagination";

class Invoice extends Component {
  state = {
    open: false,
    user: "",
    fieldArray: [
      {
        quantity: "",
        price_per_unit: "",
        product: "",
        liveSearch: false,
        productId: "",
      },
    ],
    liveSearchUser: false,
    openSuccess: false,
    userId: "",
    request: "",
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
    requestNamesOfStatuses: {
      request: "View Request",
      proforma: "View Pro Forma",
      order: "View Purchase Order",
      delivery: "Delivery in progress",
      delivered: "View Delivery Note",
      invoice: "View System Invoice",
      receipt: "View Receipt",
    },
    activePage: 1,
  };

  componentDidMount() {
    const {
      getInvoice,
      getInvoiceOptions,
      getInvoiceProductOptions,
      getActivityOrder,
    } = this.props;
    getInvoice();
    getInvoiceOptions();
    getInvoiceProductOptions();
    getActivityOrder();
  }

  GetCurrOrder = (id, isModal) => {
    const { getActivityOrder } = this.props;
    getActivityOrder(id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        if (isModal) {
          this.setState({ model: true, modalId: id });
        } else {
          this.generatePDF(res.payload.data);
        }
      }
    });
  };

  toggleSuccess = () => {
    this.setState(({ openSuccess }) => ({
      openSuccess: !openSuccess,
    }));
  };

  toggleDialog = () => {
    this.setState(({ open }) => ({
      open: !open,
    }));
    this.setState({
      fieldArray: [
        {
          quantity: "",
          price_per_unit: "",
          productId: "",
        },
      ],
      request: "",
      searchValueUser: "",
    });
  };

  hideModal = (e) => {
    this.setState({ model: false });
  };

  generatePDF = (client_data) => {
    var doc = new jsPDF("p", "pt");
    let imageData = data_image;
    const pdfdat1 = client_data.items;
    const pdfdata = pdfdat1.map((elt) => [
      elt.product_name,
      elt.quantity,
      Number(elt.price_per_unit).toFixed(2),
      Number(+elt.quantity * +elt.price_per_unit).toFixed(2),
    ]);

    pdfdata.sort(sortFunction);
    doc.addImage(imageData, "PNG", 30, 40, 250, 75);
    const reducer = (accumulator, currentValue) =>
      Number(accumulator) + Number(currentValue);
    var total = [];

    var z = 0;
    pdfdata.forEach((element) =>
      total.splice(z, 0, Number(element[3]).toFixed(2))
    );
    ++z;
    var total1 = total.reduce(reducer, 0);

    doc.setFont("times");
    // doc.setFontType("italic");
    doc.setFontSize(10);
    doc.text(
      290,
      50,
      "Address: K&M Building 1st Floor Opposite Sonatube kicukiro kigali"
    );
    doc.text(290, 65, "Email: alex@viebeg.com / tobias@viebeg.com");
    doc.text(290, 80, "Website: www.viebeg.com");
    doc.text(290, 95, "Office line: +250782205366 Tel: +250787104894");
    var pdfbody = [
      [
        {
          content: `${
            client_data.status === "delivered"
              ? "Delivery Note"
              : this.state.namesOfStatuses[client_data.status]
          }`,
          colSpan: 4,
          styles: {
            halign: "center",
            fontSize: 12,
            font: "times",
            fontStyle: "bold",
          },
        },
      ],
      [
        {
          content:
            `Client Name: ${client_data.customer_name}\r\nPI#: ${
              client_data.request
            }\r\nDate: ${moment(client_data.date).format(
              "DD/MM/YYYY   hh-mm-ss"
            )}\r\n` + "" /* `Sales Rep: Cecile` */,
          colSpan: 4,
          styles: { font: "italic", fontSize: 10, fontStyle: "bold" },
        },
      ],
      ["ITEM DESCRIPTION", "QTY", "UNIT PRICE", "SUB TOTAL"],
      [
        { content: "", colSpan: 2, styles: { halign: "center" } },
        "Total",
        Number(total1).toFixed(2),
      ],
      [
        {
          content:
            "VAT EXEMPTED\r\nTIN: 107902413\r\nccount Number: 21102347510015100000 / GT Bank, Main Branch\r\nDelivery: Immediately \r\nDISCLAIMER: This invoice is not an official invoice and is only valid together with the EBM invoice provided by VIEBEG upon delivery of the goods.",
          colSpan: 4,
          styles: { font: "italic", fontSize: 10, fontStyle: "bold" },
        },
      ],
    ];
    var k = 3;
    pdfdata.forEach((element) => pdfbody.splice(k, 0, element));
    ++k;
    doc.autoTable({
      theme: "grid",
      margin: { top: 150 },
      styles: { lineColor: "black", lineWidth: 1 },
      body: pdfbody,
    });

    doc.save(client_data.customer_name + "_profomer.pdf");
  };

  changeSearchInput = (idx, { target: { value, id } }) => {
    this.setState(({ fieldArray }) => ({
      fieldArray: [
        ...fieldArray.slice(0, idx),
        {
          ...fieldArray[idx],
          product: value,
          productId: id,
        },
        ...fieldArray.slice(idx + 1),
      ],
    }));
    if (value.replace(/\s/g, "").length > 0) {
      const { getInvoiceProductOptions } = this.props;
      getInvoiceProductOptions(value).then(() => {
        this.setState(({ fieldArray }) => ({
          fieldArray: [
            ...fieldArray.slice(0, idx),
            {
              ...fieldArray[idx],
              product: value,
              liveSearch: true,
              productId: id,
              searchError: "",
            },
            ...fieldArray.slice(idx + 1),
          ],
        }));
      });
    } else {
      this.setState(({ fieldArray }) => ({
        fieldArray: [
          ...fieldArray.slice(0, idx),
          {
            ...fieldArray[idx],
            product: value,
            productId: id,
            liveSearch: false,
            searchError: "",
          },
          ...fieldArray.slice(idx + 1),
        ],
      }));
    }
  };

  changeSearchInputUser = ({ target: { value } }) => {
    this.setState({ searchValueUser: value });
    if (value.replace(/\s/g, "").length > 0) {
      const { getInvoiceOptions } = this.props;
      getInvoiceOptions(value).then(() => {
        this.setState({ searchError: "", liveSearchUser: true });
      });
    } else {
      this.setState({ searchError: "", liveSearchUser: false });
    }
  };

  changeRequest = ({ target: { value } }) => {
    this.setState({ request: value });
  };

  submitInvoice = () => {
    const { postInvoice, getInvoice } = this.props;
    const { fieldArray } = this.state;
    let data = {
      user: this.state.userId,
      request: this.state.request,
      items: fieldArray.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
      })),
    };
    postInvoice(data).then((res) => {
      if (
        (res.payload && res.payload.status && res.payload.status === 200) ||
        res.payload.status === 201
      ) {
        this.setState(({ open }) => ({
          open: !open,
        }));
        this.toggleSuccess();
        getInvoice();
      }
    });
  };

  changePage = (page) => {
    const { getInvoice } = this.props;
    let newPage = page.selected + 1;

    getInvoice(newPage);
  };

  render() {
    const {
      namesOfStatuses,
      open,
      fieldArray,
      searchValueUser,
      liveSearchUser,
      openSuccess,
      model,
      request,
      userId,
      activePage,
      fieldArray: [{ quantity, price_per_unit, product }],
    } = this.state;
    const {
      invoice_product_options,
      invoice_options,
      invoice,
      activityOrder,
    } = this.props;
    const addtopdf = [];
    const ModalTotal = [];
    return (
      <div className="invoice_page content_block">
        <div className="title_page">Invoices</div>
        <div className="content_page">
          <button className="add_btn" onClick={this.toggleDialog}>
            create new invoice
          </button>
          <div className="table_container transactions_columns">
            <div className="table_header">
              <div className="table_row">
                <div className="row_item">DATE</div>
                <div className="row_item">REQUEST</div>
                <div className="row_item">PDF</div>
              </div>
            </div>
            <div className="table_body">
              {invoice && invoice.results && invoice.results.length > 0 ? (
                invoice.results.map((el, index) => (
                  <div className="table_row">
                    <div className="row_item" key={index}>
                      {moment(el.date).format(
                        "DD/MM/YYYY   hh-mm-ss"
                      )}
                    </div>
                    <div className="row_item">
                      <button
                        onClick={() => {
                          this.GetCurrOrder(el.id, true);
                        }}
                        type="primary"
                      >
                        {el.request}
                      </button>
                    </div>
                    <div className="row_item">
                      <button
                        onClick={() => this.GetCurrOrder(el.id, false)}
                        type="primary"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="table_row">The list is empty.</div>
              )}
            </div>
            {invoice && invoice.count && invoice.count <= 10 ? null : (
              <div className="pagination_info_wrapper">
                <div className="pagination_block">
                  <Pagination
                    active={activePage - 1}
                    pageCount={Math.ceil(invoice.count / 10)}
                    onChange={this.changePage}
                  />
                </div>
                <div className="info">
                  Displaying page {activePage} of{" "}
                  {Math.ceil(invoice.count / 10)}, items {activePage * 10 - 9}{" "}
                  to{" "}
                  {activePage * 10 > Math.ceil(invoice.count / 10)
                    ? Math.ceil(invoice.count / 10)
                    : activePage * 10}{" "}
                  of {invoice.count}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogComponent open={open} onClose={this.toggleDialog}>
          <div className="dialog_invoice">
            <div className="title">Create new invoice</div>
            <div className="wrapper">
              <div className="block_field ">
                <span>ID/PI#</span>
                <div className="custom_search">
                  <input
                    onChange={this.changeRequest}
                    value={invoice.request}
                    type="number"
                    placeholder="ID/PI#"
                  />
                </div>
              </div>

              <div className="block_field ">
                <span>Select a client</span>
                <div className="custom_search">
                  <input
                    onChange={this.changeSearchInputUser}
                    value={searchValueUser}
                    type="text"
                    placeholder="Name or email"
                  />
                  {liveSearchUser && (
                    <div
                      className="search_info"
                      onClick={() =>
                        this.setState({
                          liveSearchUser: false,
                        })
                      }
                    >
                      <div className="product_search">
                        {invoice_options.length > 0 ? (
                          invoice_options.map((el, idx) => (
                            <div
                              onClick={() =>
                                this.setState({
                                  searchValueUser: el.username,
                                  userId: el.id,
                                })
                              }
                              key={idx}
                            >
                              <span>{el.username}</span>
                            </div>
                          ))
                        ) : (
                          <span className={`no_search_items`}>no items</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {fieldArray &&
                fieldArray.map((el, idx) => (
                  <div className="block" key={idx}>
                    <div className="block_field select ">
                      <span>Select the products</span>
                      <div className="custom_search">
                        <input
                          value={el.product}
                          onChange={(e) => this.changeSearchInput(idx, e)}
                          type="text"
                          placeholder="Name"
                        />
                        {el.liveSearch && (
                          <div className="search_info">
                            <div className="product_search">
                              {invoice_product_options.length > 0 ? (
                                invoice_product_options.map((el, id) => (
                                  <div
                                    onClick={() =>
                                      this.setState(({ fieldArray }) => ({
                                        fieldArray: [
                                          ...fieldArray.slice(0, idx),
                                          {
                                            ...fieldArray[idx],
                                            product: el.name,
                                            productId: el.id,
                                            liveSearch: false,
                                          },
                                          ...fieldArray.slice(idx + 1),
                                        ],
                                      }))
                                    }
                                    key={id}
                                  >
                                    <span>{el.name}</span>
                                  </div>
                                ))
                              ) : (
                                <span className={`no_search_items`}>
                                  no items
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="block_field quantity">
                      <span>Quantity</span>
                      <div className="block-input">
                        <input
                          type="text"
                          value={el.quantity}
                          placeholder="0"
                          onChange={(e) => {
                            const { value } = e.target;
                            this.setState(({ fieldArray }) => ({
                              fieldArray: [
                                ...fieldArray.slice(0, idx),
                                {
                                  ...fieldArray[idx],
                                  quantity: value,
                                },
                                ...fieldArray.slice(idx + 1),
                              ],
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="block_field amount ">
                      <span>Price</span>
                      <div className="block-input">
                        <input
                          type="text"
                          placeholder="0"
                          value={el.price_per_unit}
                          onChange={(e) => {
                            const { value } = e.target;
                            this.setState(({ fieldArray }) => ({
                              fieldArray: [
                                ...fieldArray.slice(0, idx),
                                {
                                  ...fieldArray[idx],
                                  price_per_unit: value,
                                },
                                ...fieldArray.slice(idx + 1),
                              ],
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="delete_field_btn"
                      onClick={() =>
                        this.setState(({ fieldArray }) => ({
                          fieldArray: [
                            ...fieldArray.slice(0, idx),
                            ...fieldArray.slice(idx + 1),
                          ],
                        }))
                      }
                    >
                      <img src={closeIcon} alt="delete_icon" />
                    </button>
                  </div>
                ))}
            </div>
            <button
              type="button"
              className="add"
              onClick={() =>
                this.setState(({ fieldArray }) => ({
                  fieldArray: [
                    ...fieldArray,
                    {
                      price_per_unit: "",
                      quantity: "",
                      product: "",
                    },
                  ],
                }))
              }
            >
              + Add more
            </button>
            <div className="btn_wrapper">
              <button className="cancel_btn" onClick={this.toggleDialog}>
                Cancel
              </button>
              <DefaultButton
                variant="outlined"
                disabled={
                  !request ||
                  !price_per_unit ||
                  !quantity ||
                  !product ||
                  !userId
                }
                onClick={this.submitInvoice}
              >
                add
              </DefaultButton>
            </div>
          </div>
        </DialogComponent>
        <DialogComponentActivity
          open={model}
          onClose={this.hideModal}
          classes={"contained-modal-title-vcenter"}
        >
          <div className="modal-content">
            <Modal.Header>
              <button
                type="button"
                className="close"
                onClick={this.hideModal}
                data-dismiss="modal"
              >
                &times;
              </button>
            </Modal.Header>
            <ModalBody className="modelBody">
              <table style={{ marginBottom: "25px" }}>
                <tbody>
                  <tr>
                    <td>
                      <img src={imageData} alt={"logo"} />{" "}
                    </td>
                    <td>
                      Address: K&M Building 1st Floor Opposite Sonatube kicukiro
                      kigali <br />
                      Email: alex@viebeg.com / tobias@viebeg.com <br />
                      Website: www.viebeg.com <br />
                      Office line: +250782205366 Tel: +250787104894 <br />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td colSpan="6" id="proformaTitle">
                      {activityOrder.status === "delivered"
                        ? "Delivery Note"
                        : namesOfStatuses[activityOrder.status]}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6" id="clientDesc">
                      Client Name: {activityOrder.customer_name}
                      <br />
                      ID/PI#: {activityOrder.request}
                      <br />
                      Date:{" "}
                      {moment(activityOrder.date).format(
                        "DD/MM/YYYY   hh-mm-ss"
                      )}
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td>ITEM DESCRIPTION</td>
                    <td>QTY</td>
                    <td>UNITY PRICE</td>
                    <td>TOTAL</td>
                    <td>STATUS</td>
                  </tr>
                  {JSON.stringify(activityOrder) !== "{}" ? (
                    !activityOrder.items ? (
                      <>
                        <tr>
                          <td>The list is empty.</td>
                          <td />
                          <td />
                          <td />
                          <td />
                        </tr>
                      </>
                    ) : (
                      activityOrder.items.map((el, index) => (
                        <tr>
                          <td
                            style={{
                              position: "relative",
                              paddingRight: `${
                                activityOrder.status === "proforma"
                                  ? "calc(.75rem + 50px)"
                                  : ".75rem"
                              }`,
                            }}
                            key={index}
                          >
                            {el.product_name}
                            {activityOrder.status === "proforma" && (
                              <div
                                className={`delete_item_btn`}
                                onClick={() => this.deleteOrderItem(el.id)}
                              />
                            )}
                          </td>
                          <td>{el.quantity}</td>
                          <td>
                            {el.price_per_unit
                              ? `${el.price_per_unit} ${activityOrder.currency}`
                              : "Waiting to be processed"}
                          </td>
                          <td>
                            {el.price_per_unit
                              ? `${(el.price_per_unit * el.quantity).toFixed(
                                  2
                                )} ${activityOrder.currency}`
                              : "Waiting to be processed"}
                          </td>
                          <td>
                            {" "}
                            {activityOrder.status === "delivered"
                              ? "Completed"
                              : el.delivery_date
                              ? moment(el.delivery_date).format("DD/MM/YYYY")
                              : "Processing"}{" "}
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <>
                      <tr>
                        <td>The list is empty.</td>
                        <td />
                        <td />
                        <td />
                        <td />
                      </tr>
                    </>
                  )}
                  <tr>
                    <td colSpan="3" id="clientDesc">
                      TOTAL
                    </td>
                    <td id="clientDesc">
                      {JSON.stringify(activityOrder) !== "{}"
                        ? `${activityOrder.items
                            .reduce(
                              (x, y) => x + y.price_per_unit * y.quantity,
                              0
                            )
                            .toFixed(2)} ${activityOrder.currency}`
                        : ""}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </ModalBody>
            <Modal.Footer>
              <button onClick={this.hideModal}>Close</button>
            </Modal.Footer>
          </div>
        </DialogComponentActivity>
        <Snack
          open={openSuccess}
          handleSnack={this.toggleSuccess}
          message="Successfully"
        />
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.request) {
    errors.request = "Required";
  }
  if (!values.quantity) {
    errors.quantity = "Required";
  }
  if (!values.price_per_unit) {
    errors.price_per_unit = "Required";
  }
  return errors;
};

Invoice = reduxForm({
  form: "InvoiceForm",
  validate,
})(Invoice);

const mapStateToProps = (state) => {
  return {
    invoice: state.invoices.invoice,
    invoice_options: state.invoices.invoice_options,
    invoice_product_options: state.invoices.invoice_product_options,
    activityOrder: state.invoices.activityOrder,
  };
};

const mapDispatchToProps = {
  getInvoice,
  getInvoiceProductOptions,
  getInvoiceOptions,
  postInvoice,
  getActivityOrder,
};
export default connect(mapStateToProps, mapDispatchToProps)(Invoice);

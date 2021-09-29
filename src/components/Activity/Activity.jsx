import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import Pagination from "../HelperComponents/Pagination/Pagination";
import {
    getActivity1,
    sortFunction,
    sortFunctioncart,
    getActivityOrder,
    nextStep,
    patchOrderFile,
    deleteOrderItem
} from "../../actions/activityActions";
import { getStock } from "../../actions/stockActions";
import "./Activity.scss";
import { Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponentForActivity";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { data_image } from "./imagedata";
import imageData from "../../assets/image/logo.png";
import { groupBy } from "../../actions/dashboardActions";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";
import { getOption } from "../HelperComponents/functions";
import { toast } from "react-toastify";

import CircularProgress from "@material-ui/core/CircularProgress";

class Activity extends Component {
    state = {
        stock: "in",
        activePage: 1,
        loading: true,

        activity: {
            label: <div></div>,
            value: "supply_requests"
        },
        option: { label: getOption("All"), value: "all" },
        option_list: [
            { label: getOption("All"), value: "all" },
            { label: getOption("Request"), value: "request" },
            { label: getOption("Proforma"), value: "proforma" },
            { label: getOption("Purchase order"), value: "order" },
            { label: getOption("Delivery in progress"), value: "delivery" },
            { label: getOption("P.O. delivered"), value: "delivered" },
            { label: getOption("Invoice"), value: "invoice" },
            { label: getOption("Receipt"), value: "receipt" }
        ],
        namesOfStatuses: {
            all: "All",
            request: "Request",
            proforma: "Proforma",
            order: "Purchase order",
            delivery: "Delivery in progress",
            delivered: "P.O. delivered",
            invoice: "Invoice",
            receipt: "Receipt"
        },
        requestNamesOfStatuses: {
            request: "View Request",
            proforma: "View Pro Forma",
            order: "View Purchase Order",
            delivery: "Delivery in progress",
            delivered: "View Delivery Note",
            invoice: "View System Invoice",
            receipt: "View Receipt"
        },
        fileName: "",
        fileTargetId: "",
        waitingForFile: false
    };

    componentDidMount() {
        this.doRequest();
        //this.doStock();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.option !== this.state.option) {
            this.doRequest();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    doRequest = () => {
        const { getActivity1 } = this.props;
        const { option } = this.state;
        getActivity1(option.value).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({ loading: false });
            }
        });
    };

    changePage = page => {
        this.setState({ activePage: page.selected + 1 });
        this.doRequest(page.selected + 1);
    };

    handleChange = name => event => {
        this.setState({ [name]: event });
        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
        }, 0);
    };
    GetCurrOrder = (id, isModal) => {
        const { getActivityOrder } = this.props;
        getActivityOrder(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                if (isModal) {
                    this.setState({ model: true, modalId: id });
                } else {
                    this.generatePDF(res.payload.data);
                }
            }
        });
    };

    hideModal = e => {
        this.setState({ model: false });
    };

    addFile = (event, targetId) => {
        const file = event.target.files[0];
        const { patchOrderFile } = this.props;
        this.setState({ fileName: file.name, fileTargetId: targetId, waitingForFile: true });
        if (file) {
            /* let size = Number((file.size / 1024 / 1024).toFixed(2));
            if (size >= 1000) {
                this.setState({ edit_error: "The media should not exceed 1 GB" });
            } else { */
            const formData = new FormData();
            formData.append("purchase_order_file", file);
            patchOrderFile(targetId, formData).then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    this.setState({ fileName: file.name, fileTargetId: targetId, waitingForFile: false });
                }
            });
            //}
        }
    };

    nextStep = id => {
        const { nextStep } = this.props;

        nextStep(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.doRequest();
            } else {
                toast(
                    `${res.error &&
                    res.error.response.data.non_field_errors &&
                    res.error.response.data.non_field_errors[0]}`,
                    {
                        progressClassName: "red-progress"
                    }
                );
                console.log(res.error.response.data.non_field_errors[0]);
            }
        });
    };

    deleteOrderItem = id => {
        const { deleteOrderItem, getActivityOrder } = this.props;
        const { modalId } = this.state;

        deleteOrderItem(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 204) {
                getActivityOrder(modalId);
            }
        });
    };

    /* renderTableForPrint = data => {
        console.log(data)
        return (
            <div id="my-table" style={{ backgroundColor: '#fff' }}>
                        <img src={imageData} />
            </div>
        )
    } */

    generatePDF = client_data => {
        var doc = new jsPDF("p", "pt");
        let imageData = data_image;
        const pdfdat1 = client_data.items;
        const pdfdata = pdfdat1.map(elt => [
            { content: elt.product_name, styles: { fontStyle: "bold" } },
            { content: elt.quantity, styles: { halign: 'right' } },
            { content: Number(elt.price_per_unit).toFixed(2), styles: { halign: 'right' } },
            { content: Number(+elt.quantity * +elt.price_per_unit).toFixed(2), styles: { halign: 'right' } }
        ]);
        pdfdata.sort(sortFunction);
        doc.addImage(imageData, "PNG", 30, 60, 160, 50);
        const reducer = (accumulator, currentValue) => Number(accumulator) + Number(currentValue);
        var total = [];

        var z = 0;
        pdfdata.forEach(element => total.splice(z, 0, Number(element[3]).toFixed(2)));
        ++z;
        var total1 = total.reduce(reducer, 0);
        doc.setFont("Helvetica");
        doc.setTextColor("#204569");
        doc.setFontSize(8);
        doc.setFontType("bold");
        doc.text(250, 70, "Viebeg Medical and Dental Supplies Ltd");
        doc.setFontType("normal");
        doc.text(250, 85, "K&M Building 1st Floor Opposite Sonatubes Kicukiro");
        doc.text(250, 100, "Kigali, Kigali 20093 RW");
        doc.text(250, 115, "+250 789700776");
        doc.text(250, 130, "alex@viebeg.com");
        doc.text(250, 145, "www.viebeg.com");
        doc.text(250, 160, "Govt. UID 107902413");
        doc.setFontSize(10);
        var pdfbody = [
            [
                {
                    content: `${client_data.status === "delivered"
                        ? "Delivery Note"
                        : this.state.namesOfStatuses[client_data.status].toUpperCase()
                        }`,
                    colSpan: 4,
                    styles: { halign: "left", fontSize: 20, fontStyle: "light", textColor: '#204569' }
                }
            ],
            [
                {
                    content: `BILL TO`,
                    colSpan: 2,
                    rowSpan: 1,
                    styles: { fontSize: 10, fontStyle: "bold", valign: 'bottom' }
                },
                {
                    content: `Invoice no.\r\nDate\r\nDue Date\r\nTerms`.toUpperCase(),
                    colSpan: 1,
                    rowSpan: 2,
                    styles: { fontSize: 10, halign: "right", fontStyle: "bold" }
                },
                {
                    content:
                        `${client_data.request}` +
                        `\r\n${moment(client_data.date_requested).format("MM/DD/YYYY")}` +
                        `\r\n${client_data.due_date === null ? '—' : moment(client_data.due_date).format("MM/DD/YYYY")}` +
                        `\r\nNet 30`,
                    colSpan: 1,
                    rowSpan: 2,
                    styles: { fontSize: 10 }
                }
            ],
            [{
                content: client_data.customer_name.toUpperCase(),
                colSpan: 2,
                rowSpan: 1,
                styles: { fontSize: 10, valign: 'top' }
            }, "", ""],
            [{
                content: "———————————————————————————————————————————————————",
                colSpan: 4, styles: { valign: 'middle', halign: "center", cellPadding: 0, textColor: '#e3e7ec', fontStyle: "bold", minCellHeight: 20 }
            }],
            [
                { content: "", styles: { fillColor: '#EBF4FE' } },
                { content: "QTY", styles: { fillColor: '#EBF4FE', halign: 'right' } },
                { content: "RATE", styles: { fillColor: '#EBF4FE', halign: 'right' } },
                { content: "AMOUNT", styles: { fillColor: '#EBF4FE', halign: 'right' } },
            ],
            [{
                content: "—  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —  —",
                colSpan: 4, styles: { valign: 'middle', halign: "center", cellPadding: 0, textColor: '#e3e7ec', fontStyle: "bold", minCellHeight: 20 }
            }],
            [{
                content: `Account Number: 21 102347510015100000 -` +
                    `\r\nGT Bank, Main Branch` +
                    `\r\nPayment upon delivery` +
                    `\r\nDelivery: Immediately` +
                    `\r\nGoods installed and commisioned`,
                colSpan: 2,
                rowSpan: 2,
                styles: { halign: "left", fontSize: 8 }
            }, { content: "PAYMENT", rowSpan: 1, styles: { valign: 'bottom' } },
            { content: Number(client_data.total).toFixed(2), rowSpan: 1, styles: { valign: 'bottom', halign: 'right' } }
            ],
            [
                { content: 'BALANCE DUE', rowSpan: 1, styles: { valign: 'middle' } },
                { content: `${client_data.balance !== null ? `RF${client_data.balance}` : '—'}`, rowSpan: 1, styles: { valign: 'top', fontSize: 20, fontStyle: "bold", halign: 'right' } }
            ],
            //margin
            [{ content: ``, colSpan: 4, styles: { minCellHeight: 20 } }],
            [
                {
                    content:
                        `Prepared by` +
                        `\r\n\r\nName: ______________________________________` +
                        `\r\n\r\nSignature: ___________________________________`,
                    colSpan: 4,
                    styles: { fontSize: 8 }
                }
            ],
            [
                {
                    content:
                        `\r\nReceived by` +
                        `\r\n\r\nName: ______________________________________` +
                        `\r\n\r\nSignature: ___________________________________`,
                    colSpan: 4,
                    styles: { fontSize: 8 }
                }
            ],
            //margin
            [{ content: ``, colSpan: 4, styles: { minCellHeight: 20 } }],
            [
                {
                    content: `Thank you! All cheques payable to Viebeg Medical and Dental Supplies Ltd.` +
                        `\r\n\r\n` +
                        `DISCLAIMER: This invoice is not an official invoice and is only valid together with the EBM invoice provided by VIEBEG upon delivery of the goods.`,
                    colSpan: 4,
                    styles: { fontSize: 8, textColor: '#8fa2b4' }
                }
            ]
        ];
        var k = 5;
        pdfdata.forEach(element => pdfbody.splice(k, 0, element));
        ++k;
        doc.autoTable({
            theme: "grid",
            margin: { top: 190 },
            styles: { lineColor: "black", lineWidth: 0, textColor: '#204569' },
            body: pdfbody
        });

        doc.save(client_data.customer_name + "_profomer.pdf");
    };

    render() {
        const {
            activePage,
            loading,
            model,
            option,
            option_list,
            fileName,
            fileTargetId,
            namesOfStatuses,
            requestNamesOfStatuses,
            waitingForFile
        } = this.state;
        const { activityLog, activityOrder } = this.props;
        const addtopdf = [];
        const ModalTotal = [];

        if (loading) return null;
        const groupedRequest = activityLog;

        return (
            <div className="activity_page content_block" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="title_page">My Purchases</div>
                <div className="activity_block">
                    <div className="select_wrapper">
                        <SelectComponent
                            value={option}
                            options={option_list}
                            change={e => {
                                this.setState({ option: e });
                            }}
                            isClearable="false"
                            isSearchable={false}
                            placeholder="Select search option"
                        />
                    </div>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>REQUEST</th>
                                <th>PDF</th>
                                {/* <th>EMAIL</th> */}
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityLog && activityLog.length > 0 ? (
                                activityLog.map((el, index) => (
                                    <tr>
                                        <>
                                            <td key={index}>
                                                {moment(el.date_requested).format("DD/MM/YYYY   hh-mm-ss")}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        this.GetCurrOrder(el.id, true);
                                                    }}
                                                    type="primary"
                                                >
                                                    {requestNamesOfStatuses[el.status]}
                                                </button>
                                            </td>
                                            <td>
                                                <div>
                                                    <button
                                                        onClick={() => this.GetCurrOrder(el.id, false)}
                                                        type="primary"
                                                    >
                                                        Download PDF
                                                    </button>
                                                </div>
                                            </td>
                                            {/* <td>
                                                <div>
                                                    <button onClick={() => { alert("Email Action") }} type="primary">Send Email</button>
                                                </div>
                                            </td> */}
                                            <td>
                                                <div>
                                                    {el.status === "invoice"
                                                        ? "Complete payment"
                                                        : el.status === "receipt"
                                                            ? "Order completed"
                                                            : el.status === "request"
                                                                ? "Request submitted"
                                                                : el.status === "order"
                                                                    ? "P.O. submitted"
                                                                    : namesOfStatuses[el.status]}
                                                </div>
                                                {(el.status === "proforma" || el.status === "delivered") && (
                                                    <>
                                                        <button
                                                            className={`btn btn-success btn-sm waiting${fileTargetId !== el.id ? ` notification_for_file` : ""
                                                                }${el.status === "delivered" ? " no_tooltip" : ""}`}
                                                            disabled={
                                                                fileName !== "" &&
                                                                fileTargetId === el.id &&
                                                                waitingForFile
                                                            }
                                                            notification={`You need to add file first.`}
                                                            onClick={e => {
                                                                // el.status === "proforma"
                                                                //     ? fileName === ""
                                                                //         ? e.target.nextElementSibling.nextElementSibling.click()
                                                                //         : this.nextStep(el.id)
                                                                //     : this.nextStep(el.id);
                                                                this.nextStep(el.id);
                                                            }}
                                                            style={{ marginRight: "10px" }}
                                                        >
                                                            {el.status === "delivered" ? "Confirm delivery" : "Approve"}
                                                        </button>
                                                        {el.invoice_file && (
                                                            <>
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={e => {
                                                                        e.target.nextElementSibling.click();
                                                                    }}
                                                                >
                                                                    Invoice
                                                                </button>
                                                                <a
                                                                    style={{ display: "none" }}
                                                                    target="_blank"
                                                                    href={el.invoice_file}
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                                {el.status === "proforma" && (
                                                    <>
                                                        <button
                                                            style={{ marginLeft: "15px" }}
                                                            className="btn btn-success btn-sm waiting"
                                                            disabled={
                                                                fileName !== "" &&
                                                                fileTargetId === el.id &&
                                                                waitingForFile
                                                            }
                                                            onClick={e => {
                                                                fileTargetId === el.id || fileTargetId === ""
                                                                    ? e.target.nextElementSibling.click()
                                                                    : alert(
                                                                        "Complete the operation you started first."
                                                                    );
                                                            }}
                                                        >
                                                            {fileName !== "" &&
                                                                fileTargetId === el.id &&
                                                                waitingForFile && <CircularProgress color="inherit" />}
                                                            {fileName !== "" && fileTargetId === el.id
                                                                ? fileName
                                                                : "Add file"}
                                                        </button>
                                                        <input
                                                            type="file"
                                                            onChange={e => {
                                                                this.addFile(e, el.id);
                                                            }}
                                                            style={{ display: "none" }}
                                                        />
                                                    </>
                                                )}
                                                {el.status === "receipt" &&
                                                    (el.invoice_file || el.receipt_file ? (
                                                        <>
                                                            {el.invoice_file && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-success btn-sm"
                                                                        onClick={e => {
                                                                            e.target.nextElementSibling.click();
                                                                        }}
                                                                        style={{ marginRight: "10px" }}
                                                                    >
                                                                        Invoice
                                                                    </button>
                                                                    <a
                                                                        style={{ display: "none" }}
                                                                        target="_blank"
                                                                        href={el.invoice_file}
                                                                    />
                                                                </>
                                                            )}
                                                            {el.receipt_file && (
                                                                <>
                                                                    <button
                                                                        className="btn btn-success btn-sm"
                                                                        onClick={e => {
                                                                            e.target.nextElementSibling.click();
                                                                        }}
                                                                    >
                                                                        Receipt
                                                                    </button>
                                                                    <a
                                                                        style={{ display: "none" }}
                                                                        target="_blank"
                                                                        href={el.receipt_file}
                                                                    />
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                disabled={true}
                                                                style={{ cursor: "not-allowed" }}
                                                            >
                                                                No additional invoice file
                                                            </button>
                                                        </>
                                                    ))}
                                            </td>
                                        </>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>The list is empty.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {/* {activityLog.count < 10 &&
                        <div className="pagination_info_wrapper">
                            <div className="pagination_block">

                                <Pagination
                                    current={activePage}
                                    pageCount={activityLog.total_pages}
                                    onChange={this.changePage}
                                />

                            </div>
                            <div className="info">Displaying page {activePage} of {activityLog.total_pages},
                            items {activePage * 10 - 9} to {activePage * 10 > activityLog.count ? activityLog.count : activePage * 10} of {activityLog.count}</div>
                        </div>
                    } */}
                </div>
                <DialogComponent open={model} onClose={this.hideModal} classes={"contained-modal-title-vcenter"}>
                    <div className="modal-content">
                        <Modal.Header>
                            <button type="button" className="close" onClick={this.hideModal} data-dismiss="modal">
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
                                            Address: K&M Building 1st Floor Opposite Sonatube kicukiro kigali <br />
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
                                            PI#: {activityOrder.request}
                                            <br />
                                            Date: {moment(activityOrder.date_requested).format("DD/MM/YYYY   hh-mm-ss")}
                                            <br />
                                            {/* Sales Rep: Cecile<br /> */}
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
                                        activityOrder.items.length < 1 ? (
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
                                                            paddingRight: `${activityOrder.status === "proforma"
                                                                ? "calc(.75rem + 50px)"
                                                                : ".75rem"
                                                                }`
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
                                                            ? `${el.price_per_unit} ${this.props.userInfo.currency}`
                                                            : "Waiting to be processed"}
                                                    </td>
                                                    <td>
                                                        {el.price_per_unit
                                                            ? `${(el.price_per_unit * el.quantity).toFixed(2)} ${this.props.userInfo.currency
                                                            }`
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
                                                    {/* <td> {namesOfStatuses[activityOrder.status]} </td> */}
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
                                                    .reduce((x, y) => x + y.price_per_unit * y.quantity, 0)
                                                    .toFixed(2)} ${this.props.userInfo.currency}`
                                                : ""}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </ModalBody>
                        <Modal.Footer>
                            <button onClick={this.hideModal}>Close</button>
                        </Modal.Footer>
                    </div>
                </DialogComponent>
                {/* {this.renderTableForPrint()} */}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        activityLog: state.activity.activityLog,
        activityOrder: state.activity.activityOrder,
        userInfo: state.users.userInfo
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getActivity1,
            getStock,
            getActivityOrder,
            nextStep,
            patchOrderFile,
            deleteOrderItem
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);

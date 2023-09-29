import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import Pagination from "../HelperComponents/Pagination/Pagination";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
    getActivity1,
    sortFunction,
    sortFunctioncart,
    getActivityOrder,
    nextStep,
    rejectStep,
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
import generatePDF from "./generatePDF";
import generateProformaPDF from "./generateProformaPDF";
import CircularProgress from "@material-ui/core/CircularProgress";
import close from "../../assets/image/close.svg";
import DownloadImg from "../../assets/image/download_tax.svg";
import ConfirmImg from "../../assets/image/confirm.svg";
import RejectImg from "../../assets/image/reject.svg";
import DownloadDoc from "../../assets/image/download_doc.svg";
import MoreActions from "../../assets/image/more_actions.svg";
import Refunded from "../../assets/image/no-refunded.svg";

import View from "../../assets/image/view.svg";
import document from "../../assets/image/document.svg";
import arrow from "../../assets/image/drop_up.svg";
import ReactTooltip from "react-tooltip";
import { NavLink, Link } from "react-router-dom";
import { BlobProvider } from "@react-pdf/renderer";
import ProformaPDF from "./PDF/ProformaPDF";
import InvoicePDF from "./PDF/InvoicePDF";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";

class Activity extends Component {
    state = {
        stock: "in",
        activePage: 1,
        loading: true,

        activity: {
            label: <div></div>,
            value: "supply_requests"
        },
        option: { label: getOption("All statuses"), value: "all" },
        option_list: [
            { label: "All statuses", value: "all" },
            { label: "Request", value: "request" },

            { label: "Proforma", value: "proforma" },
            { label: "Purchase Order", value: "order" },
            { label: "Delivery in progress", value: "delivery" },
            { label: "P.O. delivered", value: "delivered" },
            { label: "Invoice", value: "invoice" },
            { label: "Refunded ", value: "refunded" },
            { label: "Receipt", value: "receipt" }
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
        pdfLink: false,
        choosenOrder: "",
        linkCount: 1,
        pdfLinkArray: [],
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
        active: false,
        activeId: null,
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
                    res.payload.data.status === "proforma"
                        ? generateProformaPDF(res.payload.data, this.props)
                        : generatePDF(res.payload.data, this.props, true);
                }
            }
        });
    };

    hideModal = e => {
        this.setState({ model: false, popup: false, tax_file: undefined });
    };

    addFile = (filePurch, targetId) => {
        const file = filePurch;
        const { patchOrderFile } = this.props;
        this.setState({ fileName: file.name, fileTargetId: targetId, waitingForFile: true });
        if (file) {
            const formData = new FormData();
            formData.append("purchase_order_file", file);
            patchOrderFile(targetId, formData).then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    this.setState({ fileName: file.name, fileTargetId: targetId, waitingForFile: false });
                    this.nextStep(targetId);
                }
            });
        }
    };

    nextStep = id => {
        const { nextStep } = this.props;

        nextStep(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.doRequest();
                this.hideModal();
                sessionStorage.removeItem("id");
            } else {
                toast(
                    `${res.error &&
                        res.error.response.data.non_field_errors &&
                        res.error.response.data.non_field_errors[0]}`,
                    {
                        progressClassName: "red-progress"
                    }
                );
            }
        });
    };

    rejectStep = id => {
        const { rejectStep } = this.props;

        rejectStep(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.doRequest();
                this.hideModal();
                sessionStorage.removeItem("id");
            } else {
                toast(
                    `${res.error &&
                        res.error.response.data.non_field_errors &&
                        res.error.response.data.non_field_errors[0]}`,
                    {
                        progressClassName: "red-progress"
                    }
                );
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

    returnStatusName = status => {
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

    render() {
        const {
            activePage,
            loading,
            model,
            tax_file,
            popup,
            fileDropdown = false,
            buttonIDX = null,
            popupType,
            elID,
            option,
            option_list,
            fileName,
            pdfLink,
            choosenOrder,
            linkCount,
            pdfLinkArray,
            fileTargetId,
            namesOfStatuses,
            requestNamesOfStatuses,
            active,
            activeId,
            waitingForFile
        } = this.state;
        const { activityLog, activityOrder, history, loadingRequest } = this.props;
        const addtopdf = [];
        const ModalTotal = [];

        const token = localStorage.getItem("token");
        if (!token) history.push("/auth/sign-in");
        if (loading) return null;
        const groupedRequest = activityLog;

        const hightlightID = sessionStorage.getItem("id");
        const elementIdHighlighted = hightlightID && hightlightID.split("=")[1];

        const openPdf = (pdfLinkArray, linkCount = 1) => {
            window.open(pdfLinkArray[0], "_blank");
            this.setState({ linkCount: linkCount + 1, pdfLink: false, pdfLinkArray: [] });
        };

        return (
            <div className="activity_page content_block" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="title_page">Orders</div>

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

                    <div className="in_stock_table">
                        <div className="table_container transactions_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <div className="row">
                                        <div className="row_item">Date/time</div>
                                        <div className="row_item">Status</div>
                                        <div className="row_item">Actions</div>
                                    </div>
                                </div>
                            </div>
                            {loadingRequest && <Loader></Loader>}
                            <div className="table_body">
                                {activityLog.length < 1 ? (
                                    <div className="table_row">
                                        <div className="row">no items</div>
                                    </div>
                                ) : (
                                    activityLog.map((el, idx) => (
                                        <>
                                            <div
                                                className={
                                                    el.id === +elementIdHighlighted
                                                        ? "table_row-elem highlighted"
                                                        : "table_row-elem"
                                                }
                                                key={el.id}
                                            >
                                                <header className="table_row-header">
                                                    <div className="row_item row_item-date">
                                                        {moment(el.date).format("DD/MM/YYYY   HH:mm")}
                                                    </div>
                                                    <button>
                                                        <img
                                                            src={MoreActions}
                                                            onClick={() =>
                                                                this.setState(({ active, activeId }) => ({
                                                                    active: !active,
                                                                    activeId: idx
                                                                }))
                                                            }
                                                            alt="more actions"
                                                        />
                                                        {active && activeId === idx && (
                                                            <ClickAwayListener
                                                                onClickAway={() => this.setState({ active: false })}
                                                            >
                                                                <div className="drop-menu">
                                                                    {!loadingRequest && (
                                                                        <button
                                                                            onClick={() => {
                                                                                this.GetCurrOrder(el.id, true);
                                                                            }}
                                                                            className="drop-menu-btn"
                                                                        >
                                                                            <img src={View} alt="view" />
                                                                            <span>View</span>
                                                                        </button>
                                                                    )}

                                                                    <button
                                                                        onClick={() =>
                                                                            this.props
                                                                                .getActivityOrder(el.id)
                                                                                .then(
                                                                                    res =>
                                                                                        res &&
                                                                                        res.payload &&
                                                                                        res.payload.status === 200 &&
                                                                                        this.setState({ pdfLink: true })
                                                                                )
                                                                        }
                                                                        className={
                                                                            el.tax_invoice_file ||
                                                                            el.invoice_file ||
                                                                            el.receipt_file
                                                                                ? "drop-menu-btn border"
                                                                                : "drop-menu-btn"
                                                                        }
                                                                    >
                                                                        <img src={document} alt="view" />
                                                                        <span>Download PDF</span>
                                                                    </button>

                                                                    {el.tax_invoice_file && (
                                                                        <a
                                                                            target="_blank"
                                                                            download
                                                                            href={el.tax_invoice_file}
                                                                            className="drop-menu-btn"
                                                                        >
                                                                            <img src={DownloadImg} alt="download" />
                                                                            <span>Tax invoice</span>
                                                                        </a>
                                                                    )}
                                                                    {el.invoice_file && (
                                                                        <a
                                                                            target="_blank"
                                                                            download
                                                                            href={el.invoice_file}
                                                                            className="drop-menu-btn"
                                                                        >
                                                                            <img src={DownloadImg} alt="download" />

                                                                            <span>Invoice</span>
                                                                        </a>
                                                                    )}
                                                                    {el.receipt_file && (
                                                                        <a
                                                                            target="_blank"
                                                                            download
                                                                            href={el.receipt_file}
                                                                            className="drop-menu-btn"
                                                                        >
                                                                            <img src={DownloadImg} alt="download" />
                                                                            <span>Receipt file</span>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </ClickAwayListener>
                                                        )}
                                                    </button>
                                                </header>
                                                <div className="table_row-status">
                                                    <span>
                                                        {this.returnStatusName(el.status)}
                                                        <span className="rejected_status_label">
                                                            {el.is_rejected && "Rejected"}
                                                        </span>
                                                        <span className="refunded_status_label">
                                                            {el.payment_status === "refunded" && (
                                                                <img src={Refunded} alt="Refunded" />
                                                            )}
                                                            {el.payment_status === "refunded" && "Refunded"}
                                                        </span>
                                                    </span>
                                                </div>

                                                {(el.status === "proforma" || el.status === "delivered") && (
                                                    <div className="table_row-buttons">
                                                        <>
                                                            <button
                                                                className={
                                                                    el.status === "delivered"
                                                                        ? el.is_rejected === false
                                                                            ? "confirm-btn"
                                                                            : "confirm-btn fullwidth"
                                                                        : el.status !== "delivered" &&
                                                                          el.is_rejected !== false
                                                                        ? "confirm-btn fullwidth"
                                                                        : "confirm-btn "
                                                                }
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

                                                                    this.setState({
                                                                        popup: true,
                                                                        popupType:
                                                                            el.status === "delivered"
                                                                                ? "confirm_delivery"
                                                                                : "approve_proforma",
                                                                        elID: el.id
                                                                    });
                                                                    //this.nextStep(el.id);
                                                                }}
                                                                style={{ marginRight: "10px" }}
                                                            >
                                                                <img src={ConfirmImg} alt="" />
                                                                {el.status === "delivered" ? "Confirm" : "Approve"}
                                                            </button>
                                                            {el.is_rejected !== true && (
                                                                <button
                                                                    className="reject-btn"
                                                                    disabled={
                                                                        fileName !== "" &&
                                                                        fileTargetId === el.id &&
                                                                        waitingForFile
                                                                    }
                                                                    notification={`You need to add file first.`}
                                                                    onClick={e => {
                                                                        this.setState({
                                                                            popup: true,
                                                                            popupType: "reject_proforma",
                                                                            elID: el.id
                                                                        });

                                                                        //this.rejectStep(el.id);
                                                                    }}
                                                                    style={{ marginRight: "10px" }}
                                                                >
                                                                    <img src={RejectImg} alt="" />
                                                                    {"reject"}
                                                                </button>
                                                            )}

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
                                                    </div>
                                                )}
                                            </div>

                                            <div className="table_row" key={idx}>
                                                <div
                                                    className={
                                                        el.id === +elementIdHighlighted ? "row highlighted" : "row"
                                                    }
                                                >
                                                    <div className="row_item row_item-date">
                                                        {moment(el.date).format("DD/MM/YYYY   HH:mm")}
                                                    </div>
                                                    <div className="row_item">
                                                        <>
                                                            <span
                                                                className={
                                                                    el.payment_status === "refunded" && "row-alighned"
                                                                }
                                                            >
                                                                {this.returnStatusName(el.status)}
                                                                <span className="rejected_status_label">
                                                                    {el.is_rejected && "Rejected"}
                                                                </span>
                                                                <span className="refunded_status_label">
                                                                    {el.payment_status === "refunded" && (
                                                                        <img src={Refunded} alt="Refunded" />
                                                                    )}
                                                                    {el.payment_status === "refunded" && "Refunded"}
                                                                </span>
                                                            </span>
                                                        </>
                                                        <button
                                                            onClick={() => {
                                                                this.GetCurrOrder(el.id, true);
                                                            }}
                                                            type="primary"
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                this.props
                                                                    .getActivityOrder(el.id)
                                                                    .then(
                                                                        res =>
                                                                            res &&
                                                                            res.payload &&
                                                                            res.payload.status === 200 &&
                                                                            this.setState({ pdfLink: true })
                                                                    )
                                                            }
                                                            type="primary"
                                                            className="download"
                                                        >
                                                            Download PDF
                                                        </button>
                                                        {pdfLink && (
                                                            <BlobProvider
                                                                document={
                                                                    activityOrder &&
                                                                    activityOrder.status &&
                                                                    activityOrder.status === "proforma" ? (
                                                                        <ProformaPDF pdfData={activityOrder} />
                                                                    ) : (
                                                                        <InvoicePDF pdfData={activityOrder} />
                                                                    )
                                                                }
                                                                textPDF={"data"}
                                                            >
                                                                {({ url, loading, ...props }) => {
                                                                    url !== null && pdfLinkArray.push(url);

                                                                    linkCount === 1 &&
                                                                        pdfLinkArray !== [] &&
                                                                        pdfLinkArray[0] !== undefined &&
                                                                        openPdf(pdfLinkArray);

                                                                    setTimeout(() => {
                                                                        this.setState({
                                                                            linkCount: 1
                                                                        });
                                                                    }, 500);

                                                                    return (
                                                                        choosenOrder === el.id &&
                                                                        loading && (
                                                                            <div className="loader_orders">
                                                                                <Loader></Loader>
                                                                            </div>
                                                                        )
                                                                    );
                                                                }}
                                                            </BlobProvider>
                                                        )}
                                                    </div>

                                                    <div
                                                        className={
                                                            el.tax_invoice_file || el.invoice_file || el.receipt_file
                                                                ? "row_item"
                                                                : "row_item with-padding"
                                                        }
                                                    >
                                                        {(el.tax_invoice_file ||
                                                            el.invoice_file ||
                                                            el.receipt_file) && (
                                                            <>
                                                                <a
                                                                    target="_blank"
                                                                    style={{ marginRight: "25px" }}
                                                                    className="download-img-block"
                                                                    rel="noopener noreferrer"
                                                                    onClick={e => {
                                                                        this.setState({
                                                                            fileDropdown: !fileDropdown,
                                                                            buttonIDX: idx
                                                                        });
                                                                    }}
                                                                >
                                                                    <img src={DownloadImg} alt="" />
                                                                </a>

                                                                {+!!el.tax_invoice_file +
                                                                    +!!el.invoice_file +
                                                                    +!!el.receipt_file >
                                                                1 ? (
                                                                    <p
                                                                        className="download-txt-block"
                                                                        onClick={e => {
                                                                            this.setState({
                                                                                fileDropdown: !fileDropdown,
                                                                                buttonIDX: idx
                                                                            });
                                                                        }}
                                                                    >
                                                                        Download
                                                                    </p>
                                                                ) : (
                                                                    <a
                                                                        className={
                                                                            +!!el.tax_invoice_file +
                                                                                +!!el.invoice_file +
                                                                                +!!el.receipt_file >
                                                                            1
                                                                                ? "download-txt-block with-margin arrow"
                                                                                : "download-txt-block with-margin "
                                                                        }
                                                                        data-tip={
                                                                            el.tax_invoice_file &&
                                                                            "Download tax invoice" + el.invoice_file &&
                                                                            "Download invoice file" + el.receipt_file &&
                                                                            "Download receipt file"
                                                                        }
                                                                        download
                                                                        rel="noopener noreferrer"
                                                                        target="_blank"
                                                                        href={
                                                                            (el.tax_invoice_file &&
                                                                                el.tax_invoice_file) ||
                                                                            (el.invoice_file && el.invoice_file) ||
                                                                            (el.receipt_file && el.receipt_file)
                                                                        }
                                                                    >
                                                                        Download
                                                                    </a>
                                                                )}

                                                                {+!!el.tax_invoice_file +
                                                                    +!!el.invoice_file +
                                                                    +!!el.receipt_file >
                                                                    1 && (
                                                                    <img
                                                                        className={
                                                                            fileDropdown === true && buttonIDX === idx
                                                                                ? "download-arrow open"
                                                                                : "download-arrow"
                                                                        }
                                                                        onClick={e => {
                                                                            this.setState({
                                                                                fileDropdown: !fileDropdown,
                                                                                buttonIDX: idx
                                                                            });
                                                                        }}
                                                                        src={arrow}
                                                                        alt="arrow"
                                                                    />
                                                                )}
                                                                {/* 
                                                                <ReactTooltip
                                                                    data-background-color="#fff"
                                                                    className="tooltip-width"
                                                                    place="top"
                                                                    type="light"
                                                                    effect="solid"
                                                                /> */}

                                                                {fileDropdown === true && buttonIDX === idx && (
                                                                    <ClickAwayListener
                                                                        onClickAway={() =>
                                                                            this.setState({ fileDropdown: false })
                                                                        }
                                                                    >
                                                                        <p
                                                                            className={
                                                                                fileDropdown === true &&
                                                                                buttonIDX === idx
                                                                                    ? "dropdown-list open"
                                                                                    : "dropdown-list "
                                                                            }
                                                                        >
                                                                            {el.tax_invoice_file && (
                                                                                <a
                                                                                    target="_blank"
                                                                                    download
                                                                                    href={el.tax_invoice_file}
                                                                                >
                                                                                    Tax invoice
                                                                                </a>
                                                                            )}
                                                                            {el.invoice_file && (
                                                                                <a
                                                                                    target="_blank"
                                                                                    download
                                                                                    href={el.invoice_file}
                                                                                >
                                                                                    Invoice
                                                                                </a>
                                                                            )}
                                                                            {el.receipt_file && (
                                                                                <a
                                                                                    target="_blank"
                                                                                    download
                                                                                    href={el.receipt_file}
                                                                                >
                                                                                    Receipt file
                                                                                </a>
                                                                            )}
                                                                        </p>
                                                                    </ClickAwayListener>
                                                                )}
                                                            </>
                                                        )}

                                                        {(el.status === "proforma" || el.status === "delivered") && (
                                                            <>
                                                                <button
                                                                    className={
                                                                        el.is_rejected
                                                                            ? "confirm-btn alone"
                                                                            : "confirm-btn"
                                                                    }
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

                                                                        this.setState({
                                                                            popup: true,
                                                                            popupType:
                                                                                el.status === "delivered"
                                                                                    ? "confirm_delivery"
                                                                                    : "approve_proforma",
                                                                            elID: el.id
                                                                        });
                                                                        //this.nextStep(el.id);
                                                                    }}
                                                                    style={{ marginRight: "10px" }}
                                                                >
                                                                    <img src={ConfirmImg} alt="" />
                                                                    {el.status === "delivered" ? "Confirm" : "Approve"}
                                                                </button>
                                                                {el.is_rejected !== true && (
                                                                    <button
                                                                        className="reject-btn"
                                                                        disabled={
                                                                            fileName !== "" &&
                                                                            fileTargetId === el.id &&
                                                                            waitingForFile
                                                                        }
                                                                        notification={`You need to add file first.`}
                                                                        onClick={e => {
                                                                            this.setState({
                                                                                popup: true,
                                                                                popupType: "reject_proforma",
                                                                                elID: el.id
                                                                            });

                                                                            //this.rejectStep(el.id);
                                                                        }}
                                                                        style={{ marginRight: "10px" }}
                                                                    >
                                                                        <img src={RejectImg} alt="" />
                                                                        {"reject"}
                                                                    </button>
                                                                )}

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
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
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
                                            {activityOrder &&
                                                activityOrder.region &&
                                                activityOrder.region.address1 &&
                                                activityOrder.region.address1}{" "}
                                            <br />
                                            {activityOrder &&
                                                activityOrder.region &&
                                                activityOrder.region.address2 &&
                                                activityOrder.region.address2}{" "}
                                            <br />
                                            {activityOrder &&
                                                activityOrder.region &&
                                                activityOrder.region.address3 &&
                                                activityOrder.region.address3}
                                            <br />
                                            {activityOrder &&
                                                activityOrder.region &&
                                                activityOrder.region.address4 &&
                                                activityOrder.region.address4}{" "}
                                            <br />
                                            {activityOrder &&
                                                activityOrder.region &&
                                                activityOrder.region.address5 &&
                                                activityOrder.region.address5}{" "}
                                            <br />
                                            {activityOrder &&
                                                activityOrder.region &&
                                                activityOrder.region.address6 &&
                                                activityOrder.region.address6}{" "}
                                            <br />
                                            {activityOrder &&
                                                activityOrder.region &&
                                                activityOrder.region.address7 &&
                                                activityOrder.region.address7}{" "}
                                            <br />
                                            {activityOrder &&
                                                activityOrder.region &&
                                                activityOrder.region.address8 &&
                                                activityOrder.region.address8}{" "}
                                            <br />
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
                                            {activityOrder.status === "invoice" ? "INVOICE NO. " : "ID/PI#:"}{" "}
                                            {activityOrder.request}
                                            <br />
                                            Client Name: {activityOrder.customer_name}
                                            {activityOrder.status === "proforma" && (
                                                <>
                                                    <br />
                                                    Sales rep:{" "}
                                                    {activityOrder.sales_rep ? activityOrder.sales_rep.username : "-"}
                                                </>
                                            )}
                                            <br />
                                            {activityOrder.tin && "TIN: " + activityOrder.tin}
                                            <br />
                                            Date: {moment(activityOrder.date).format("DD/MM/YYYY   HH-mm-ss")}
                                            {activityOrder.status === "proforma" && (
                                                <>
                                                    <br />
                                                    Quotation Validity:{" "}
                                                    {moment(activityOrder.due_date).format("DD/MM/YYYY   HH-mm-ss")}
                                                </>
                                            )}
                                            <br />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ITEM DESCRIPTION</td>
                                        <td>QTY</td>
                                        <td>UNIT PRICE</td>
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
                                                            paddingRight: `${
                                                                activityOrder.status === "proforma"
                                                                    ? "calc(.75rem + 50px)"
                                                                    : ".75rem"
                                                            }`
                                                        }}
                                                        key={el.id}
                                                    >
                                                        {el.product_name}
                                                        {activityOrder.status === "proforma" && (
                                                            <div
                                                                className={`delete_item_btn`}
                                                                onClick={() => this.deleteOrderItem(el.id)}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>{new Intl.NumberFormat("en-US").format(el.quantity)}</td>

                                                    <td>
                                                        {!el.price_per_unit ||
                                                        activityOrder.status === "sales_review" ||
                                                        activityOrder.status === "sales_rejected" ||
                                                        activityOrder.status === "sales_to_approve"
                                                            ? "Waiting to be processed"
                                                            : `${new Intl.NumberFormat("en-US", {
                                                                  minimumFractionDigits: 2
                                                              }).format(el.price_per_unit)} ${
                                                                  this.props.activityOrder.currency
                                                                      ? this.props.activityOrder.currency
                                                                      : ""
                                                              }`}
                                                    </td>
                                                    <td>
                                                        {!el.price_per_unit ||
                                                        activityOrder.status === "sales_review" ||
                                                        activityOrder.status === "sales_rejected" ||
                                                        activityOrder.status === "sales_to_approve"
                                                            ? "Waiting to be processed"
                                                            : `${new Intl.NumberFormat("en-US", {
                                                                  minimumFractionDigits: 2
                                                              }).format(Number(el.price_per_unit * el.quantity))} ${
                                                                  this.props.activityOrder.currency
                                                                      ? this.props.activityOrder.currency
                                                                      : ""
                                                              }`}
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
                                            {this.props.activityOrder.region &&
                                            this.props.activityOrder.region.vat &&
                                            this.props.activityOrder.region.vat &&
                                            this.props.activityOrder.total !== 0 ? (
                                                <>
                                                    <p className={"without-margin"}>SUBTOTAL</p>
                                                    <p className={"without-margin"}>VAT</p>
                                                    <p className={"without-margin"}>TOTAL</p>
                                                </>
                                            ) : (
                                                "TOTAL"
                                            )}
                                        </td>
                                        <td id="clientDesc">
                                            {this.props.activityOrder.region &&
                                            this.props.activityOrder.region.vat &&
                                            this.props.activityOrder.region.vat &&
                                            this.props.activityOrder.total !== 0 ? (
                                                <>
                                                    <p className={"without-margin"}>
                                                        {activityOrder.status === "sales_review" ||
                                                        activityOrder.status === "sales_rejected" ||
                                                        activityOrder.status === "sales_to_approve"
                                                            ? "—"
                                                            : new Intl.NumberFormat("en-US", {
                                                                  minimumFractionDigits: 2
                                                              }).format(
                                                                  (+this.props.activityOrder.total * 100) /
                                                                      (+this.props.activityOrder.region.vat + 100)
                                                              ) +
                                                              (this.props.activityOrder.currency
                                                                  ? this.props.activityOrder.currency
                                                                  : "")}
                                                    </p>
                                                    <p className={"without-margin"}>
                                                        {activityOrder.status === "sales_review" ||
                                                        activityOrder.status === "sales_rejected" ||
                                                        activityOrder.status === "sales_to_approve"
                                                            ? "—"
                                                            : this.props.activityOrder.region.vat + "%"}
                                                    </p>
                                                    <p className={"without-margin"}>
                                                        {activityOrder.status === "sales_review" ||
                                                        activityOrder.status === "sales_rejected" ||
                                                        activityOrder.status === "sales_to_approve"
                                                            ? "—"
                                                            : JSON.stringify(activityOrder) !== "{}"
                                                            ? `${new Intl.NumberFormat("en-US", {
                                                                  minimumFractionDigits: 2
                                                              }).format(+this.props.activityOrder.total.toFixed(2))}${
                                                                  this.props.activityOrder.currency
                                                                      ? this.props.activityOrder.currency
                                                                      : ""
                                                              }`
                                                            : ""}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className={"without-margin"}>
                                                    {activityOrder.status === "sales_review" ||
                                                    activityOrder.status === "sales_rejected" ||
                                                    activityOrder.status === "sales_to_approve"
                                                        ? "Waiting to be processed"
                                                        : JSON.stringify(activityOrder) !== "{}"
                                                        ? `${new Intl.NumberFormat("en-US", {
                                                              minimumFractionDigits: 2
                                                          }).format(+this.props.activityOrder.total.toFixed(2))}${
                                                              this.props.activityOrder.currency
                                                                  ? this.props.activityOrder.currency
                                                                  : ""
                                                          }`
                                                        : ""}
                                                </p>
                                            )}
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

                <DialogComponent open={popup} onClose={this.hideModal}>
                    <div className="activity_dialog">
                        <div className="activity_dialog-title">
                            {popupType === "confirm_delivery" && <span>Confirm delivery</span>}
                            {popupType === "reject_proforma" && <span>Reject proforma</span>}
                            {popupType === "approve_proforma" && <span>Approve proforma</span>}
                        </div>
                        <p className="activity_dialog-txt">
                            {popupType === "confirm_delivery" &&
                                "You are about to confirm delivery of the order. Are you sure?"}
                            {popupType === "reject_proforma" &&
                                `You are about to reject the proforma. \n Are you sure?`}
                            {popupType === "approve_proforma" &&
                                `You are about to approve the proforma. \n Are you sure?`}
                        </p>

                        {popupType === "approve_proforma" && (
                            <div className="block_field stamp-block">
                                {tax_file !== undefined ? (
                                    <>
                                        <span className="stamp-title">File</span>
                                        <div className="stamp-block-row">
                                            <img src={document} alt="document" />
                                            <p className="stamp-block-title">
                                                {tax_file &&
                                                    tax_file.name.split("/")[tax_file.name.split("/").length - 1]}
                                            </p>
                                            <button
                                                type={"button"}
                                                className="stamp-block-btn"
                                                onClick={() => {
                                                    this.setState({ tax_file: undefined });
                                                }}
                                            >
                                                <img src={close} alt="close" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span>File</span>
                                        <label for="fileInp" className="blue_btn upload">
                                            Upload
                                        </label>
                                        <input
                                            style={{
                                                display: "none"
                                            }}
                                            type="file"
                                            accept="image/*"
                                            id="fileInp"
                                            onChange={e => {
                                                let tax_file = e.target.files[0];
                                                this.setState({
                                                    tax_file
                                                });
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                        )}

                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.hideModal}>
                                Cancel
                            </button>
                            <button
                                className={popupType !== "reject_proforma" ? "blue_btn" : "red_btn"}
                                onClick={() => {
                                    // popupType === "confirm_delivery" && this.nextStep(elID);
                                    popupType === "reject_proforma" && this.rejectStep(elID);
                                    popupType === "approve_proforma" && tax_file !== undefined
                                        ? this.addFile(tax_file, elID)
                                        : popupType !== "reject_proforma" && this.nextStep(elID);
                                }}
                            >
                                {popupType === "confirm_delivery" && "Confirm"}
                                {popupType === "approve_proforma" && "Approve"}
                                {popupType === "reject_proforma" && "Reject"}
                            </button>
                        </div>
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        activityLog: state.activity.activityLog,
        activityOrder: state.activity.activityOrder,
        loadingRequest: state.activity.loading,
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
            rejectStep,
            patchOrderFile,
            deleteOrderItem
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);

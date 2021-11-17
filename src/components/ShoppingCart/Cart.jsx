import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Pagination from "../HelperComponents/Pagination/Pagination";
import { getActivity } from "../../actions/activityActions";
import { getStock, patchCartQuantity } from "../../actions/stockActions";
import "./Activity.scss";
import QuantityDialog from "./Dialogs/QuantityDialog";
import DeleteDialog from "./Dialogs/DeleteDialog";
import RequestDialog from "./Dialogs/RequestDialog";
import CartDialogue from "./Dialogs/CartAction";
import { OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_BASE_URL } from "../../config";
import logo_sidebar from "../../assets/image/new logo.svg";
import { Link } from "react-router-dom";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";

import DeleteImg from "../../assets/image/delete.svg";

class Activity extends Component {
    state = {
        loading: true,
        stockLoad: true,
        tab: "0",
        activePage: 1,
        totalPages: "",
        totalItems: "",
        InfoIsOpen: false,
        openDeleteDialog: false,
        openQuantityDialog: false,
        openRequestDialog: false,
        openCartDialogue: false,
        openCartDialog: false,
        sign: null,
        product_name: null,
        product_quantity: null,
        openSearch: false,
        optionValue: null,
        switcherState: "quantity",
        someVal: "",
        newVal: "",
        activity: {
            label: <div></div>,
            value: "supply_requests"
        },
        cartLength: 0,
        switcherState: "quantity"
    };

    componentDidMount() {
        this.setState({ role: localStorage.getItem("role") });
        if (this.state) {
            this.setState({
                tab: this.state.tab.toString()
            });
        }

        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
        }, 0);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    doRequest = (page = 1) => {
        const { getActivity } = this.props;
        const { activity } = this.state;
        getActivity(activity.value, page).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.doStock();
            }
        });
    };

    doStock = () => {
        const { getStock } = this.props;
        const { switcherState } = this.state;
        getStock("out", false, switcherState).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    loading: false,
                    stockLoad: false
                });
            }
        });
    };
    handleSwitch = () => {
        if (this.state.switcherState === "quantity") {
            this.setState({
                switcherState: "-quantity"
            });
        } else {
            this.setState({
                switcherState: "quantity"
            });
        }
        this.timer = this.timeout = setTimeout(() => {
            this.doStock();
        }, 0);
    };

    toggleQuantityDialog = (sign, name, quantity, id) => {
        this.setState(({ openQuantityDialog }) => ({
            openQuantityDialog: !openQuantityDialog,
            sign: typeof sign === "string" ? sign : "",
            product_name: name,
            product_quantity: quantity,
            product_id: id,
            InfoIsOpen: false
        }));
    };

    toggleDeleteDialog = (sign, name, quantity, id, cartLength1) => {
        this.setState(({ openDeleteDialog }) => ({
            openDeleteDialog: !openDeleteDialog,
            sign: typeof sign === "string" ? sign : "",
            product_name: name,
            product_quantity: quantity,
            product_id: id,
            InfoIsOpen: false,
            cartLength: cartLength1
        }));
    };
    toggleRequestDialog = (name, quantity, id, product_image) => {
        this.setState(({ openRequestDialog }) => ({
            openRequestDialog: !openRequestDialog,
            product_name: typeof name === "string" ? name : "",
            product_quantity: quantity,
            product_id: id,
            InfoIsOpen: false,
            product_image: product_image
        }));
    };

    toggleCartDialogue = id => {
        this.setState(({ openCartDialogue }) => ({
            openCartDialogue: !openCartDialogue,
            requestid: id,
            InfoIsOpen: false
        }));
    };

    changePage = page => {
        this.setState({ activePage: page.selected + 1 });
        this.doRequest(page.selected + 1);
        //this.doStock(page.selected + 1);
    };

    handleChange = name => event => {
        // const status = { status: event.value }
        this.setState({ [name]: event });
        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
            //this.doStock();
        }, 0);
    };
    pagFunc = page => {
        this.doRequest(page);
    };

    unique = arr => {
        let result = [];

        for (let el of arr) {
            if (!result.some(elem => elem.id !== el.id)) {
                result.push(el);
            }
        }

        return result;
    };

    openMenu = id => {
        this.setState(({ InfoIsOpen }) => ({
            InfoIsOpen: true,
            product_id: id
        }));
    };

    closeMenu = id => {
        this.setState(({ InfoIsOpen }) => ({
            InfoIsOpen: false,
            product_id: ""
        }));
    };

    render() {
        function makeid(pow) {
            return Math.floor(Math.random() * pow);
        }

        const {
            openDeleteDialog,
            openQuantityDialog,
            openRequestDialog,
            openCartDialogue,
            sign,
            product_name,
            product_quantity,
            product_id,
            requestid,
            role,
            activePage,
            loading,
            InfoIsOpen,
            stockLoad,
            product_image
        } = this.state;

        const { activityLog, stock_list, history } = this.props;

        const token = localStorage.getItem("token");
        if (!token) history.push("/main/catalog");

        let combinedCart = [];
        if (activityLog.results && activityLog.results.length > 0) {
            combinedCart = activityLog.results.filter(item => item.quantity > 0);
        }

        const cartId = makeid(100000000000);

        return (
            <div className="stock_management_page content_block cart-page" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="title_page">Shopping cart</div>
                <div style={{ width: "100%" }}>
                    <div className="content_page" style={{ width: "100%", float: "left", overflow: "hidden" }}>
                        {activityLog.results && activityLog.results.length > 0 ? (
                            <div className="in_stock_wrapper">
                                <div className="in_stock_table">
                                    <div className="title_block">
                                        <div className="cart_title">
                                            {/* <span style={{ fontWeight: "100 !important" }}>Cart Total Item </span>{" "} */}
                                            {activityLog.count} products
                                        </div>
                                    </div>

                                    {combinedCart.length > 0 ? (
                                        <div className="cart_items">
                                            <ul className="cart_list">
                                                {/*map start*/}
                                                {combinedCart.map(row => (
                                                    <li
                                                        className="cart_item clearfix"
                                                        onClick={() =>
                                                            row.product_id &&
                                                            history.push(`/main/product-details/${row.product_id}`)
                                                        }
                                                    >
                                                        <div className="cart_item_image">
                                                            {row.image.includes("http") ? (
                                                                <img src={row.image} alt={row.name} />
                                                            ) : (
                                                                <>
                                                                    {row.image === "" || row.image === "Request" ? (
                                                                        <img src={logo_sidebar} alt={row.name} />
                                                                    ) : (
                                                                        <img
                                                                            src={
                                                                                API_BASE_URL.replace(
                                                                                    "api/v0",
                                                                                    "media"
                                                                                ) + row.image
                                                                            }
                                                                            alt={row.name}
                                                                        />
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="cart_item_info d-flex flex-md-row flex-column justify-content-between">
                                                            <div className="cart_item_name cart_info_col">
                                                                <div className="cart_item_title ">Name</div>
                                                                <div className="cart_item_text">{row.product_name}</div>
                                                            </div>
                                                            <div className="row" style={{ flexWrap: "nowrap" }}>
                                                                <div
                                                                    className="cart_item_quantity cart_info_col text-center"
                                                                    style={{ marginRight: "187px" }}
                                                                >
                                                                    <div className="cart_item_title">Quantity</div>
                                                                    <div className="cart_item_text text-center">
                                                                        <div className="row">
                                                                            <button
                                                                                disabled={row.quantity <= 0}
                                                                                onClick={e => {
                                                                                    e.stopPropagation();
                                                                                    this.props
                                                                                        .patchCartQuantity(row.id, {
                                                                                            quantity: -1
                                                                                        })
                                                                                        .then(res => {
                                                                                            if (
                                                                                                res.payload &&
                                                                                                res.payload.status &&
                                                                                                res.payload.status ===
                                                                                                    200
                                                                                            ) {
                                                                                                this.doRequest(
                                                                                                    activePage
                                                                                                );
                                                                                            }
                                                                                        });
                                                                                }}
                                                                            >
                                                                                -
                                                                            </button>
                                                                            <input
                                                                                type="text"
                                                                                value={row.quantity}
                                                                                onClick={e => e.stopPropagation()}
                                                                                onChange={e =>
                                                                                    this.props
                                                                                        .patchCartQuantity(row.id, {
                                                                                            set_quantity: parseInt(
                                                                                                e.target.value
                                                                                            )
                                                                                        })
                                                                                        .then(res => {
                                                                                            if (
                                                                                                res.payload &&
                                                                                                res.payload.status &&
                                                                                                res.payload.status ===
                                                                                                    200
                                                                                            ) {
                                                                                                this.doRequest(
                                                                                                    activePage
                                                                                                );
                                                                                            }
                                                                                        })
                                                                                }
                                                                            />
                                                                            {/* <button className="col alert alert-light"
                                                                            defaultValue={row.quantity}>{row.quantity}</button> */}
                                                                            <button
                                                                                onClick={e => {
                                                                                    e.stopPropagation();
                                                                                    this.props
                                                                                        .patchCartQuantity(row.id, {
                                                                                            quantity: 1
                                                                                        })
                                                                                        .then(res => {
                                                                                            if (
                                                                                                res.payload &&
                                                                                                res.payload.status &&
                                                                                                res.payload.status ===
                                                                                                    200
                                                                                            ) {
                                                                                                this.doRequest(
                                                                                                    activePage
                                                                                                );
                                                                                            }
                                                                                        });
                                                                                }}
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="cart_item_total cart_info_col">
                                                                    <div className="cart_item_title">&nbsp;</div>
                                                                    <div className="cart_item_text">
                                                                        <img
                                                                            src={DeleteImg}
                                                                            alt=""
                                                                            style={{ cursor: "pointer" }}
                                                                            onClick={e => {
                                                                                e.stopPropagation();
                                                                                this.toggleDeleteDialog(
                                                                                    "-",
                                                                                    row.product_name,
                                                                                    row.quantity,
                                                                                    row.id,
                                                                                    combinedCart.length
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                                {/*map end*/}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="items_no">
                                            No products have been selected.{" "}
                                            <Link to={`/main/catalog`}>Add products to cart </Link>
                                        </div>
                                    )}

                                    {activityLog.count > 10 && (
                                        <div className="pagination_info_wrapper">
                                            <div className="pagination_block">
                                                <Pagination
                                                    current={activePage}
                                                    pageCount={activityLog.total_pages}
                                                    onChange={this.changePage}
                                                />
                                            </div>
                                            <div className="info">
                                                Displaying page {activePage} of {activityLog.total_pages}, items{" "}
                                                {activePage * 10 - 9} to{" "}
                                                {activePage * 10 > activityLog.count
                                                    ? activityLog.count
                                                    : activePage * 10}{" "}
                                                of {activityLog.count}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : loading ? (
                            <Loader />
                        ) : (
                            <h3 className={"empty_list"}>The list is empty</h3>
                        )}
                        <div className="cart_buttons">
                            {combinedCart.length > 0 ? (
                                <button
                                    type="submit"
                                    onClick={() => this.toggleCartDialogue(cartId)}
                                    className="button cart_button_checkout"
                                >
                                    Request Proforma
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    onClick={() => alert("Your Cart is empty")}
                                    className="button cart_button_checkout"
                                >
                                    Request Proforma
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="suggested-wrapper">
                    <div className="in_stock_wrapper">
                        <div className="in_stock_table">
                            <div className="title_block">
                                <div className="cart_title">
                                    <span style={{ fontWeight: "100 !important" }}>suggested products </span>
                                </div>
                            </div>
                            <div className="table_container transactions_columns">
                                <div className="table_header">
                                    <div className="table_row1">
                                        <div className="row">
                                            <div className="row_item suggested1">Name</div>
                                            <div className="row_item suggested2">Code</div>
                                            <div className="row_item suggested3">Actions</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table_body">
                                    {(stock_list &&
                                        stock_list.results &&
                                        stock_list.results.length &&
                                        stock_list.results.length < 1) ||
                                    stockLoad ? (
                                        <div className="table_row1">
                                            <div className="row">no items</div>
                                        </div>
                                    ) : (
                                        stock_list.results.map((row, idx) => (
                                            <div
                                                className="table_row1"
                                                key={idx}
                                                onClick={() =>
                                                    row.product_id &&
                                                    history.push(`/main/product-details/${row.product_id}`)
                                                }
                                            >
                                                <div className="row">
                                                    <>
                                                        <span
                                                            variant="light suggested1"
                                                            style={{
                                                                width: "50%",
                                                                color: "#204569",
                                                                fontSize: "16px",
                                                                fontFamily: "MontRegular, sans-serif"
                                                            }}
                                                        >
                                                            {row.deleted === false ? (
                                                                <div style={{ width: "100%" }}>{row.product_name}</div>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </span>
                                                    </>

                                                    {row.code ? (
                                                        <div className="row_item suggested2">#{row.code}</div>
                                                    ) : (
                                                        <div className="row_item suggested2">-</div>
                                                    )}

                                                    <div className="row_item suggested3">
                                                        {row.deleted && row.code ? (
                                                            <div className="btn_text">Not available</div>
                                                        ) : row.code ? (
                                                            <div className="row_item">
                                                                <button
                                                                    className={
                                                                        role !== "user"
                                                                            ? "green_text btn_text"
                                                                            : "hided"
                                                                    }
                                                                    disabled={role === "user"}
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        this.toggleRequestDialog(
                                                                            row.product_name,
                                                                            row.quantity,
                                                                            row.id,
                                                                            row.image
                                                                        );
                                                                    }}
                                                                >
                                                                    ADD TO CART
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="row_item">-</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <QuantityDialog
                    toggler={this.toggleQuantityDialog}
                    product_quantity={product_quantity}
                    product_name={product_name}
                    sign={sign}
                    state={openQuantityDialog}
                    product_id={product_id}
                    startValue={""}
                    activePage={activePage}
                    doRequest={this.doRequest}
                />

                <DeleteDialog
                    toggler={this.toggleDeleteDialog}
                    product_quantity={product_quantity}
                    product_name={product_name}
                    incart={"False"}
                    sign={sign}
                    state={openDeleteDialog}
                    product_id={product_id}
                    startValue={""}
                    activePage={activePage}
                    doRequest={this.doRequest}
                    cartLength={this.state.cartLength}
                    changePage={page => {
                        this.setState({ activePage: page });
                    }}
                />
                <RequestDialog
                    toggler={this.toggleRequestDialog}
                    product_quantity={product_quantity}
                    product_name={product_name}
                    state={openRequestDialog}
                    product_id={product_id}
                    startValue={""}
                    product_image={product_image}
                    doRequest={this.doRequest}
                />

                <CartDialogue
                    toggler={this.toggleCartDialogue}
                    state={openCartDialogue}
                    requestid={requestid}
                    activePage={activePage}
                    doRequest={this.doRequest}
                    startValue={""}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        activityLog: state.activity.activityLog,
        stock_list: state.stock.stock_list
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getActivity,
            getStock,
            patchCartQuantity
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);

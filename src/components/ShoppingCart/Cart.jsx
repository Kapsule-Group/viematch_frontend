import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Pagination from "../HelperComponents/Pagination/Pagination";
import { getActivity } from "../../actions/activityActions";
import { getStock, patchCartQuantity } from "../../actions/stockActions";
import "./Activity.scss";
import minus from "../../assets/image/minus.svg";
import plus from "../../assets/image/plus.svg";
import QuantityDialog from "./Dialogs/QuantityDialog";
import DeleteDialog from "./Dialogs/DeleteDialog";
import RequestDialog from "./Dialogs/RequestDialog";
import CartDialogue from "./Dialogs/CartAction";
import { OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_BASE_URL } from "../../config";
import logo_sidebar from "../../assets/image/new logo.svg";
import { Link } from "react-router-dom";
import roll_down from "../../assets/image/roll_down.svg";
import ok from "../../assets/image/ok.svg";
import no from "../../assets/image/no.svg";
import sort_up from "../../assets/image/sort_up.svg";
import sort_down from "../../assets/image/sort_down.svg";

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
            //this.state.tab === 1 && this.setState({ stock: 'out' });
        }

        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
            //this.doStock();
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
                this.doStock(); /* .then(response => {
                    if (response.payload && response.payload.status && response.payload.status === 200) {
                        this.setState({ loading: false });
                    }
                }); */

                //this.setState({ loading: false });
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
        /*
        const options = {
            timeout: 5000,
            position: positions.BOTTOM_CENTER
        };

        const Alert = (j) => (
            <Provider template={AlertTemplate} {...options}>
                <Home />
            </Provider>
        );*/
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

        const { activityLog, stock_list } = this.props;
        let combinedCart = [];
        if (activityLog.results && activityLog.results.length > 0) {
            //     activityLog.results.sort(sortFunctioncart).forEach((row)  => {
            //         if(row.incart == "True" && row.quantity > 0) {
            //             combinedCart.push(row)
            //         }
            //     })
            //
            combinedCart = activityLog.results.filter(item => item.incart === "True" && item.quantity > 0);
        }

        // combinedCart = this.unique(combinedCart);
        // console.log(combinedCart);
        // console.log(activityLog.results);
        const cartId = makeid(100000000000);
        //const totalItems = activityLog.results.length;
        if (loading) return null;
        let g = activityLog.results.filter(item => item.incart === "True" && item.quantity > 0);
        return (
            <div className="stock_management_page content_block" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="title_page">Shopping cart</div>
                <div style={{ width: "100%", overflow: "hidden" }}>
                    <div className="content_page" style={{ width: "100%", float: "left", overflow: "hidden" }}>
                        {activityLog.results && activityLog.results.length > 0 ? (
                            <div className="in_stock_wrapper">
                                <div className="in_stock_table">
                                    <div className="title_block">
                                        <div className="cart_title">
                                            {/*console.log(activityLog.results.filter(item => item.incart==="True"))*/}
                                            <span style={{ fontWeight: "100 !important" }}>
                                                Cart Total Item{" "}
                                            </span> ( <b>{activityLog.count}</b> )
                                        </div>
                                        <div className="cart_buttons">
                                            {combinedCart.length > 0 ? (
                                                <button
                                                    type="submit"
                                                    onClick={() => this.toggleCartDialogue(cartId)}
                                                    className="button cart_button_checkout"
                                                >
                                                    Request Pro Forma
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    onClick={() => alert("Your Cart is empty")}
                                                    className="button cart_button_checkout"
                                                >
                                                    Request Pro Forma
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {combinedCart.length > 0 ? (
                                        <div className="cart_items">
                                            <ul className="cart_list">
                                                {/*map start*/}
                                                {combinedCart.map(row => (
                                                    <li className="cart_item clearfix">
                                                        <div className="cart_item_image">
                                                            {row.image.includes("http") ? (
                                                                <img
                                                                    src={row.image}
                                                                    style={{ width: "113px", height: "113px" }}
                                                                    alt={row.name}
                                                                />
                                                            ) : (
                                                                <>
                                                                    {row.image === "" || row.image === "Request" ? (
                                                                        <img
                                                                            src={logo_sidebar}
                                                                            style={{ width: "113px", height: "113px" }}
                                                                            alt={row.name}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={
                                                                                API_BASE_URL.replace(
                                                                                    "api/v0",
                                                                                    "media"
                                                                                ) + row.image
                                                                            }
                                                                            style={{ width: "113px", height: "113px" }}
                                                                            alt={row.name}
                                                                        />
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="cart_item_info d-flex flex-md-row flex-column justify-content-between">
                                                            <div className="cart_item_name cart_info_col text-center">
                                                                <div className="cart_item_title ">Name</div>
                                                                <div className="cart_item_text">{row.product_name}</div>
                                                            </div>
                                                            <div className="row" style={{ flexWrap: "nowrap" }}>
                                                                <div
                                                                    className="cart_item_quantity cart_info_col text-center"
                                                                    style={{ marginRight: "35px" }}
                                                                >
                                                                    <div className="cart_item_title">Quantity</div>
                                                                    <div className="cart_item_text text-center">
                                                                        <div className="row">
                                                                            <button
                                                                                className="col alert alert-light"
                                                                                disabled={row.quantity <= 0}
                                                                                style={{
                                                                                    color: "red",
                                                                                    fontWeight: "bold",
                                                                                    fontSize: "x-large"
                                                                                }}
                                                                                onClick={() =>
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
                                                                                        })
                                                                                }
                                                                            >
                                                                                -
                                                                            </button>
                                                                            <input
                                                                                type="text"
                                                                                className="col alert alert-light"
                                                                                style={{ textAlign: "center" }}
                                                                                value={row.quantity}
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
                                                                                className="col alert alert-light"
                                                                                style={{
                                                                                    color: "green",
                                                                                    fontWeight: "bold",
                                                                                    fontSize: "x-large"
                                                                                }}
                                                                                onClick={() =>
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
                                                                                        })
                                                                                }
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="cart_item_total cart_info_col">
                                                                    <div className="cart_item_title">&nbsp;</div>
                                                                    <div
                                                                        className="cart_item_text mt-3"
                                                                        title="Remove This"
                                                                        style={{ fontSize: "2.5vmax", opacity: ".6" }}
                                                                    >
                                                                        <a
                                                                            disabled={row.quantity <= 0}
                                                                            className="fa fa-trash text-danger delete-item"
                                                                            style={{ cursor: "pointer" }}
                                                                            data-slug="meta-etchant-37-phosphoric"
                                                                            data-id={195}
                                                                            data-qty={0}
                                                                            data-csrf="IjRhMmI4ZjQwNDcyNjA2NTc5NGM4MWY0ZDJkMDIzZjQ3ZjVkZGJkYTgi.X19JUw.Z4Kg9u6ZHIaowtogW6am1A1VfSk"
                                                                            data-url="http://139.59.152.214/cart"
                                                                            data-u="/cart/create/meta-etchant-37-phosphoric"
                                                                            data-action="del"
                                                                            onClick={() =>
                                                                                this.toggleDeleteDialog(
                                                                                    "-",
                                                                                    row.product_name,
                                                                                    row.quantity,
                                                                                    row.id,
                                                                                    combinedCart.length
                                                                                )
                                                                            }
                                                                        ></a>
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
                        ) : (
                            <h3 className={"empty_list"}>The list is empty</h3>
                        )}
                        <hr style={{ margin: "50px 0 15px" }} />
                        <div className="in_stock_wrapper">
                            <div className="in_stock_table">
                                <div className="title_block">
                                    <div className="cart_title">
                                        <span style={{ fontWeight: "100 !important" }}>Suggested products </span>({" "}
                                        <b>
                                            {stock_list &&
                                            stock_list.results &&
                                            stock_list.results.length &&
                                            stock_list.results.length
                                                ? stock_list.results.length
                                                : "0"}
                                        </b>{" "}
                                        )
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
                                                <div className="table_row1" key={idx}>
                                                    <div className="row">
                                                        <>
                                                            <OverlayTrigger
                                                                key={"bottom"}
                                                                placement={"bottom"}
                                                                overlay={
                                                                    <Tooltip id="tooltip-top">
                                                                        <div
                                                                            className="row_item suggested1"
                                                                            style={{
                                                                                textAlign: "left",
                                                                                fontSize: "14px"
                                                                            }}
                                                                        >
                                                                            {row.product_name ? row.product_name : ""}
                                                                        </div>
                                                                        <hr />
                                                                        {row.image ? (
                                                                            <>
                                                                                <div>
                                                                                    <Image
                                                                                        src={
                                                                                            API_BASE_URL.replace(
                                                                                                "api/v0",
                                                                                                "media"
                                                                                            ) + row.image
                                                                                        }
                                                                                        alt={`no_image`}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            height: "100%"
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <hr />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div>
                                                                                    <Image
                                                                                        src={logo_sidebar}
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            height: "100%"
                                                                                        }}
                                                                                        alt={`no_image`}
                                                                                    />
                                                                                </div>
                                                                                <hr />
                                                                            </>
                                                                        )}

                                                                        <div
                                                                            className="row_item suggested1"
                                                                            style={{
                                                                                textAlign: "left",
                                                                                fontSize: "12px"
                                                                            }}
                                                                        >
                                                                            {row.description ? row.description : ""}
                                                                        </div>
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <span
                                                                    variant="light suggested1"
                                                                    style={{
                                                                        width: "80%",
                                                                        color: "#204569",
                                                                        fontSize: "16px",
                                                                        fontFamily: "MontRegular, sans-serif"
                                                                    }}
                                                                >
                                                                    {row.deleted === false ? (
                                                                        <div style={{ width: "100%" }}>
                                                                            {row.product_name}
                                                                        </div>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </span>
                                                            </OverlayTrigger>{" "}
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
                                                                        onClick={() =>
                                                                            this.toggleRequestDialog(
                                                                                row.product_name,
                                                                                row.quantity,
                                                                                row.id,
                                                                                row.image
                                                                            )
                                                                        }
                                                                    >
                                                                        ADD TO CART
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="row_item">-</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* <div
                                                        className={
                                                            InfoIsOpen && product_id === row.id
                                                                ? "info info_open"
                                                                : "info"
                                                        }
                                                    >
                                                        <div className="row_item">
                                                            {!row.is_custom && (
                                                                <>
                                                                    <span>Category</span>
                                                                    {role !== "user" ? (
                                                                        <Link
                                                                            className={role !== "user" ? "" : "hided"}
                                                                            to={`/main/catalog/category/${
                                                                                row.product_subcategory[0][
                                                                                    row.product_subcategory[0].length -
                                                                                        1
                                                                                ].id
                                                                            }`}
                                                                        >
                                                                            {row.product_subcategory[1]}
                                                                        </Link>
                                                                    ) : (
                                                                        <a className="hided">
                                                                            {row.product_subcategory[1]}
                                                                        </a>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="row_item">
                                                            <span>Auto supply</span>
                                                            {row.auto_supply ? (
                                                                <img src={ok} alt="ok" />
                                                            ) : (
                                                                <img src={no} alt="no" />
                                                            )}
                                                        </div>
                                                        <div className="row_item">
                                                            <span>Min. qty</span>
                                                            {row.deleted ? "-" : row.min_supply_quantity}
                                                        </div>
                                                        <div className="row_item">
                                                            <span>Auto supply qty</span>
                                                            {row.deleted ? "-" : row.supply_quantity}
                                                        </div>
                                                    </div> */}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                {/* {totalItems > 10 ? null :
                                        <div className="pagination_info_wrapper">
                                            <div className="pagination_block">
                                                <Pagination
                                                    active={activePage}
                                                    pageCount={+totalPages}
                                                    onChange={this.pagFunc}
                                                />
                                            </div>
                                            <div className="info">Displaying page {activePage + 1} of {totalPages},
                                            items {(activePage + 1) * 10 - 9} to {(activePage + 1) * 10 > totalItems ? totalItems : (activePage + 1) * 10} of {totalItems}</div>
                                        </div>
                                    } */}
                            </div>
                        </div>
                    </div>
                </div>
                {/*<CartDialogue toggler={this.toggleCartDialogue}
                    request={cartId}
                    state={openCartDialog}
                    activePage={activePage}
                    doRequest={this.doRequest}
                    startValue={''}

                                    />*/}

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

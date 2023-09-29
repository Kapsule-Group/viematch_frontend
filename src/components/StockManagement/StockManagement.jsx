import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import Pagination from "../HelperComponents/Pagination/Pagination";
import FormControl from "@material-ui/core/FormControl";
import ok from "../../assets/image/ok.svg";
import no from "../../assets/image/no.svg";
import minus from "../../assets/image/minus.svg";
import plus from "../../assets/image/plus.svg";
import roll_down from "../../assets/image/roll_down.svg";
import sort_up from "../../assets/image/sort_up.svg";
import sort_down from "../../assets/image/sort_down.svg";
import "./StockManagement.scss";
import off from "../../assets/image/off.svg";
import on from "../../assets/image/on.svg";
import QuantityDialog from "./Dialogs/QuantityDialog";
import RequestDialog from "./Dialogs/RequestDialog";
import {
    getStock,
    stockSettings,
    searchStock,
    getSearchList,
    getSettings,
    updateSetting
} from "../../actions/stockActions";
import { createInventoryNew, patchInventory, getProdsForStocks } from "../../actions/catalogActions";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { OverlayTrigger, Tooltip, Image, Row, Col } from "react-bootstrap";
import { API_BASE_URL } from "../../config";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo_sidebar from "../../assets/image/new logo.svg";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";

import UserManagement from "../StockSettings/StockSettings";
import StickyPopover from "../HelperComponents/StickyPopover/StickyPopover";

class StockManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            lowStock: 5,
            inStock: 6,
            outStock: 1,
            stockToFatch: "",
            userId: "",
            plusButton: "",
            minusButton: "",
            openAddStockDialog: false,
            tab: "0",
            stock: "sufficient",
            activePage: 0,
            totalPages: "",
            totalItems: "",
            InfoIsOpen: false,
            openQuantityDialog: false,
            openRequestDialog: false,
            sign: null,
            product_name: null,
            product_quantity: null,
            openSearch: false,
            optionValue: null,
            switcherState: "quantity",
            someVal: "",
            newVal: "",
            selectType: "prod",
            selectWidth: 60,
            items: "",
            newStock: false,
            autoSup: false,
            buyingPrice: "",
            openSettings: false,
            limits: {}
        };
    }

    componentDidMount() {
        const { stockSettings } = this.props;
        this.setState({ role: localStorage.getItem("role") });
        if (this.props.location.state) {
            this.setState({
                tab: this.props.location.state.tab.toString()
            });
            this.props.location.state.tab === 1 && this.setState({ stock: "out" });
        }

        this.timer = this.timeout = setTimeout(() => {
            stockSettings("GET").then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    this.setState({ limits: res.payload.data });
                    this.doRequest();
                }
            });
        }, 0);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        this.setState({
            openAddStockDialog: false,
            newStock: false,
            autoSup: false
        });
    }

    toggleStockDialog = (id = null) => {
        this.setState(
            ({
                openAddStockDialog,
                openAddProductDialog,
                nameError,
                priceError,
                nameErrorText,
                priceErrorText,
                quantityError,
                supplyQuantityError,
                minSupplyQuantityError,
                quantityErrorText,
                supplyQuantityErrorText,
                minSupplyQuantityErrorText
            }) => ({
                openAddStockDialog: !openAddStockDialog,
                openAddProductDialog: openAddProductDialog ? !openAddProductDialog : openAddProductDialog,
                nameError: openAddStockDialog ? !nameError : nameError,
                priceError: openAddStockDialog ? !priceError : priceError,
                nameErrorText: openAddStockDialog ? "" : nameErrorText,
                priceErrorText: openAddStockDialog ? "" : priceErrorText,
                quantityError: openAddStockDialog ? !quantityError : quantityError,
                supplyQuantityError: openAddStockDialog ? !supplyQuantityError : supplyQuantityError,
                minSupplyQuantityError: openAddStockDialog ? !minSupplyQuantityError : minSupplyQuantityError,
                quantityErrorText: openAddStockDialog ? "" : quantityErrorText,
                supplyQuantityErrorText: openAddStockDialog ? "" : supplyQuantityErrorText,
                minSupplyQuantityErrorText: openAddStockDialog ? "" : minSupplyQuantityErrorText,
                quantity: "",
                buyingPrice: ""
            })
        );
    };

    addNewProd = qty => {
        const {
            addProduct,
            history: {
                location: { pathname }
            }
        } = this.props;
        const {
            newCategoryName,
            newProductPrice,
            parentCatId,
            totalPagesCount,
            quantity,
            newProdName,
            autoSup
        } = this.state;
        let data = {
                price: +newProductPrice,
                subcategory_id: parentCatId
            },
            items = this.state.items,
            lastSlug = pathname.split("/")[pathname.split("/").length - 1];

        if (qty) {
            data.name = newProdName;
            data.quantity = quantity;
        } else {
            data.name = newCategoryName;
        }

        addProduct(data).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 201) {
                if (items[0].length + items[1].length < 10) {
                    items[1].push(res.payload.data);
                    this.setState({
                        items: items,
                        openDeleteDialog: false,
                        openEditDialog: false,
                        openAddDialog: false,
                        openAddStockDialog: false,
                        openAddProductDialog: false,
                        openAddStockCustomDialog: false,
                        quantity: "",
                        autoSup: false,
                        supply_quantity: "",
                        min_supply_quantity: "",
                        newProductPrice: "",
                        stock_name: "",
                        currentItemPrice: "",
                        quantityError: false,
                        quantityErrorText: ""
                    });
                } else {
                    this.getCurrentCat(lastSlug);
                    this.changePage(false, totalPagesCount);
                }
                this.endLoading();
            } else {
                if (res.error.response.data.name && res.error.response.data.price) {
                    this.setState({
                        nameError: true,
                        priceError: true,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: res.error.response.data.price,
                        quantityError: false,
                        quantityErrorText: ""
                    });
                } else if (res.error.response.data.name) {
                    this.setState({
                        nameError: true,
                        priceError: false,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: "",
                        quantityError: false,
                        quantityErrorText: ""
                    });
                } else if (res.error.response.data.price) {
                    this.setState({
                        nameError: false,
                        priceError: true,
                        nameErrorText: "",
                        priceErrorText: res.error.response.data.price,
                        quantityError: false,
                        quantityErrorText: ""
                    });
                } else if (res.error.response.data.quantity) {
                    this.setState({
                        quantityError: true,
                        quantityErrorText: res.error.response.data.quantity,
                        nameError: false,
                        priceError: false,
                        nameErrorText: "",
                        priceErrorText: ""
                    });
                }
            }
        });
    };
    autoSupOn = () => {
        this.setState({
            autoSup: true
        });
    };

    autoSupOff = () => {
        this.setState({
            autoSup: false
        });
    };

    doRequest = page => {
        const { getStock } = this.props;
        const { stock, switcherState } = this.state;
        getStock(stock, page !== undefined ? page.selected + 1 : false, switcherState).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                if (page !== undefined) {
                    this.setState({
                        loading: false,
                        activePage: page.selected,
                        totalPages: res.payload.data.total_pages,
                        totalItems: res.payload.data.count,
                        items: res.payload.data.results
                    });
                } else {
                    this.setState({
                        loading: false,
                        totalPages: res.payload.data.total_pages,
                        totalItems: res.payload.data.count,
                        activePage: page ? page : 0,
                        items: res.payload.data.results
                    });
                }
            }
        });
    };

    changeOutStock = e => {
        this.setState({
            outStock: parseInt(e.target.value)
        });
    };
    changeInStock = e => {
        this.setState({
            inStock: parseInt(e.target.value)
        });
    };
    changeLowStock = e => {
        this.setState({
            lowStock: parseInt(e.target.value),
            inStock: parseInt(e.target.value) + 1
        });
    };

    lowButtonPlus = () => {
        this.setState({
            lowStock: parseInt(this.state.lowStock) + 1,
            inStock: parseInt(this.state.lowStock) + 2
        });
    };
    lowButtonMinus = () => {
        this.setState({
            lowStock: parseInt(this.state.lowStock) - 1,
            inStock: parseInt(this.state.lowStock) - 2
        });
    };

    inButtonPlus = () => {
        this.setState({
            inStock: parseInt(this.state.inStock) + 1
        });
    };
    inButtonMinus = () => {
        this.setState({
            inStock: parseInt(this.state.inStock) - 1
        });
    };

    outButtonPlus = () => {
        this.setState({
            outStock: parseInt(this.state.outStock) + 1
        });
    };
    outButtonMinus = () => {
        this.setState({
            outStock: parseInt(this.state.outStock) - 1
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
            this.doRequest();
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

    toggleRequestDialog = (name, quantity, id, product_image) => {
        this.setState(({ openRequestDialog }) => ({
            openRequestDialog: !openRequestDialog,
            product_name: typeof name === "string" ? name : "",
            product_quantity: quantity,
            product_id: id,
            product_image: product_image,
            InfoIsOpen: false
        }));
    };

    changeTab = (tab, stock) => {
        const { getStock, stockSettings } = this.props;

        if (stock === "settings") {
            stockSettings("GET").then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    tab === 2
                        ? this.setState({ tab, totalItems: 1, newVal: "", openSearch: false })
                        : this.setState({ tab, stock, newVal: "", openSearch: false });
                }
            });
        } else {
            getStock(stock).then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    this.setState({
                        loading: false,
                        activePage: 0,
                        totalPages: res.payload.data.total_pages,
                        totalItems: res.payload.data.count,
                        items: res.payload.data.results
                    });
                    /* this.pagFunc(); */
                    tab === 2
                        ? this.setState({ tab, totalItems: 1, newVal: "", openSearch: false })
                        : this.setState({ tab, stock, newVal: "", openSearch: false });
                }
            });
        }
    };

    fetchSettings = () => {
        const { getSettings } = this.props;

        getSettings().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    inStock: res.payload.data[0].instock,
                    lowStock: res.payload.data[0].lowstock,
                    outStock: res.payload.data[0].outstock,
                    userId: res.payload.data[0].id
                });
            }
        });
    };

    updateSettings = () => {
        const { updateSetting } = this.props;
        this.setState({ loading: true });
        let data = new FormData();
        data.append("instock", this.state.inStock);
        data.append("lowstock", this.state.lowStock);
        data.append("outstock", this.state.outStock);

        updateSetting(this.state.userId, data).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    loading: false
                });
                //alert("saved well");
            }
        });
    };

    changeWidth = e => {
        this.setState({
            selectType: e.target.value,
            selectWidth: 8 * e.target.value.length + 31
        });
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

    toggleSearch = () => {
        this.setState(({ openSearch }) => ({
            openSearch: !openSearch
        }));
    };

    togglePopper = () => {
        this.setState({ openSearch: true, activePage: 0 });
    };

    handleToggleSearch = () => {
        this.setState({
            openSearch: false
        });
    };

    searchOnChange = e => {
        let regEx = /[^a-zA-Zа-яА-Я0-9]/g;

        /* this.setState({
            someVal: e.target.value.replace(regEx, ''),
            newVal: e.target.value.replace(regEx, '')
        }) */
        this.setState({
            someVal: e.target.value,
            newVal: e.target.value
        });
    };

    handleSearchChange = e => {
        const { searchStock, search_list, getSearchList } = this.props;
        const { stock } = this.state;
        let inputValue = e.target.value.replace("#", "");

        if (inputValue.length >= 3) {
            searchStock(stock, inputValue).then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    this.togglePopper();
                }
            });
        } else if (inputValue.length < 3) {
            this.setState({ openSearch: false });
            if (inputValue.length === 0) {
                this.doRequest();
            }
        }

        if (e.keyCode === 13 && inputValue.length > 2) {
            let el_id = search_list.map(el => el.id);
            getSearchList(el_id.join(",")).then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    this.setState({
                        totalPages: res.payload.data.total_pages,
                        totalItems: res.payload.data.count
                    });
                    this.handleToggleSearch();
                }
            });
        } else if (e.keyCode === 13 && inputValue.length < 2) {
            return null;
        }
    };
    handleSearchClick = id => {
        const { getSearchList } = this.props;
        getSearchList(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    totalPages: res.payload.data.total_pages,
                    totalItems: res.payload.data.count
                });
                this.handleToggleSearch();
            }
        });
    };

    pagFunc = page => {
        this.doRequest(page);
    };
    newQuantity = e => {
        this.setState({
            quantity: e.target.value
        });
    };

    newBuyingPrice = e => {
        this.setState({
            buyingPrice: e.target.value
        });
    };

    newName = e => {
        this.setState({
            stock_name: e.target.value
        });
    };

    newSupplyQuantity = e => {
        this.setState({
            supply_quantity: e.target.value
        });
    };

    newMinSupplyQuantity = e => {
        this.setState({
            min_supply_quantity: e.target.value
        });
    };

    addToStock = () => {
        const {
            targetId,
            quantity,
            autoSup,
            supply_quantity,
            min_supply_quantity,
            stock_name,
            inventoryId,
            buyingPrice
        } = this.state;
        const { createInventoryNew, patchInventory } = this.props;
        let data = {
            /* auto_supply: autoSup, */
        };
        if (quantity) data.quantity = +quantity;
        /* if (supply_quantity) data.supply_quantity = +supply_quantity;
        if (min_supply_quantity) data.min_supply_quantity = +min_supply_quantity; */
        if (buyingPrice) data.unit_price = +buyingPrice;
        if (stock_name) data.product_name = stock_name;

        /* data.product_id = targetId; */
        createInventoryNew(data).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 201) {
                this.setState({
                    quantityError: false,
                    quantityErrorText: "",
                    supplyQuantityError: false,
                    supplyQuantityErrorText: "",
                    minSupplyQuantityError: false,
                    minSupplyQuantityErrorText: ""
                });
                this.toggleStockDialog();
            }
        });
    };

    render() {
        const {
            tab,
            activePage,
            InfoIsOpen,
            openQuantityDialog,
            openRequestDialog,
            loading,
            sign,
            product_name,
            product_quantity,
            product_id,
            product_image,
            openSearch,
            totalPages,
            totalItems,
            role,
            newStock,
            quantity,
            stock,
            newVal,
            openAddStockDialog,
            quantityError,
            quantityErrorText,
            autoSup,
            min_supply_quantity,
            stock_name,
            minSupplyQuantityError,
            supplyQuantityErrorText,
            minSupplyQuantityErrorText,
            supply_quantity,
            supplyQuantityError,
            option_list,
            option,
            buyingPrice,
            openSettings,
            limits
        } = this.state;
        const {
            stock_list,
            search_list,
            list,
            stock_settings,
            userInfo,
            stockSettings,
            history,
            loadingPage
        } = this.props;

        const token = localStorage.getItem("token");
        if (!token) history.push("/main/catalog");

        if (loading) return null;
        return (
            <div className="stock_management_page content_block" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="title_page">Stock management</div>

                <div className="content_page">
                    <div className="tab_block">
                        <button
                            className={tab === "0" ? "active" : ""}
                            onClick={() => this.changeTab("0", "sufficient")}
                        >
                            in stock
                        </button>
                        <button className={tab === "1" ? "active" : ""} onClick={() => this.changeTab("1", "low")}>
                            low stock
                        </button>
                        <button className={tab === "2" ? "active" : ""} onClick={() => this.changeTab("2", "out")}>
                            out of stock
                        </button>
                        <button className={"float-right blue-btn"} onClick={() => this.toggleStockDialog()}>
                            + ADD PRODUCT
                        </button>
                        <button
                            className={"blue-btn"}
                            style={{ float: "right" }}
                            onClick={() => this.setState({ openSettings: true })}
                        >
                            SETTINGS
                        </button>
                    </div>

                    {tab !== "3" ? (
                        <div className="in_stock_wrapper">
                            <div className="block_search">
                                <div className="input-group">
                                    <div className="search_info">
                                        <input
                                            type="text"
                                            className="search_info reset"
                                            placeholder="Search..."
                                            onKeyUp={e => this.handleSearchChange(e)}
                                            onChange={this.searchOnChange}
                                            value={newVal}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="in_stock_table">
                                <div className="table_container transactions_columns">
                                    <div className="table_header">
                                        <div className="table_row">
                                            <div className="row">
                                                <div className="row_item">Name</div>
                                                <div className="row_item">Unit value</div>
                                                <div className="row_item">
                                                    <button onClick={this.handleSwitch} className="btn_sort">
                                                        Quantity
                                                        <div className="sort">
                                                            <img src={sort_up} alt="sort_up" />
                                                            <img src={sort_down} alt="sort_down" />
                                                        </div>
                                                    </button>
                                                </div>
                                                <div className="row_item">Actions</div>
                                                <div className="row_item">Expand</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table_body">
                                        {list[`${openSearch ? "search" : "stock"}`].length < 1 ? (
                                            <div className="table_row">
                                                <div className="row">no items</div>
                                            </div>
                                        ) : (
                                            list[`${openSearch ? "search" : "stock"}`].map((row, idx) => (
                                                <div className="table_row" key={idx}>
                                                    <div className="row">
                                                        {["bottom"].map(placement => (
                                                            <>
                                                                <StickyPopover
                                                                    key={placement}
                                                                    placement={placement}
                                                                    component={
                                                                        <>
                                                                            <div
                                                                                className="row_item"
                                                                                style={{
                                                                                    textAlign: "left",
                                                                                    fontSize: "14px"
                                                                                }}
                                                                            >
                                                                                {row.product_name
                                                                                    ? row.product_name
                                                                                    : ""}
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
                                                                                className="row_item"
                                                                                style={{
                                                                                    textAlign: "left",
                                                                                    fontSize: "12px"
                                                                                }}
                                                                            >
                                                                                {row.description ? row.description : ""}
                                                                            </div>
                                                                        </>
                                                                    }
                                                                >
                                                                    <span variant="light">
                                                                        {openSearch ? (
                                                                            <div style={{ width: "100%" }}>
                                                                                {row.product_name}
                                                                            </div>
                                                                        ) : row.deleted === false ? (
                                                                            <div style={{ width: "100%" }}>
                                                                                {row.product_name}
                                                                            </div>
                                                                        ) : (
                                                                            <></>
                                                                        )}
                                                                    </span>
                                                                </StickyPopover>
                                                            </>
                                                        ))}
                                                        <div className="row_item">
                                                            {row.price
                                                                ? `${new Intl.NumberFormat("en-US").format(
                                                                      Number(row.price).toFixed(2)
                                                                  )} ${userInfo.currency}`
                                                                : "-"}
                                                        </div>
                                                        <div className="row_item">
                                                            <button
                                                                disabled={row.quantity <= 0}
                                                                onClick={() =>
                                                                    this.toggleQuantityDialog(
                                                                        "-",
                                                                        row.product_name,
                                                                        row.quantity,
                                                                        row.id
                                                                    )
                                                                }
                                                            >
                                                                <img src={minus} alt="minus" />
                                                            </button>
                                                            <div>{row.quantity}</div>
                                                            <button
                                                                onClick={() =>
                                                                    this.toggleQuantityDialog(
                                                                        "+",
                                                                        row.product_name,
                                                                        row.quantity,
                                                                        row.id
                                                                    )
                                                                }
                                                            >
                                                                <img src={plus} alt="plus" />
                                                            </button>
                                                        </div>

                                                        <div className="row_item">
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
                                                                        REQUEST SUPPLY
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="row_item">-</div>
                                                            )}
                                                        </div>
                                                        <div className="row_item">
                                                            <button
                                                                className={
                                                                    InfoIsOpen && product_id === row.id
                                                                        ? "btn_arrow_open btn_arrow row_item"
                                                                        : "btn_arrow"
                                                                }
                                                                onClick={() =>
                                                                    product_id === row.id
                                                                        ? this.closeMenu(row.id)
                                                                        : this.openMenu(row.id)
                                                                }
                                                            >
                                                                <img src={roll_down} alt="roll_down" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div
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
                                                                    {openSearch ? null : role !== "user" ? (
                                                                        <Link
                                                                            className={role !== "user" ? "" : "hided"}
                                                                            to={`/main/catalog/category/${row.product_subcategory !==
                                                                                null &&
                                                                                row.product_subcategory[0][
                                                                                    row.product_subcategory[0].length -
                                                                                        1
                                                                                ].id}`}
                                                                        >
                                                                            {row.product_subcategory !== null &&
                                                                                row.product_subcategory[1]}
                                                                        </Link>
                                                                    ) : (
                                                                        <a className="hided">
                                                                            {row.product_subcategory !== null &&
                                                                                row.product_subcategory[1]}
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
                                                        <div className="row_item">
                                                            <span>Code</span>
                                                            <span>{row.code ? `#${row.code}` : "-"}</span>
                                                        </div>
                                                        <div className="row_item">
                                                            <span>Total value</span>
                                                            <span>
                                                                {row.total_price
                                                                    ? `${row.total_price} ${userInfo.currency}`
                                                                    : "-"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <UserManagement stock_settings={stock_settings} />
                        </>
                    )}
                </div>

                <QuantityDialog
                    toggler={this.toggleQuantityDialog}
                    product_quantity={product_quantity}
                    product_name={product_name}
                    sign={sign}
                    state={openQuantityDialog}
                    startValue={""}
                    product_id={product_id}
                    activePage={activePage}
                    doRequest={() => {
                        openSearch ? this.handleSearchChange({ target: { value: newVal } }) : this.doRequest();
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
                />

                <DialogComponent open={openAddStockDialog} onClose={this.toggleStockDialog}>
                    <div className="stock_dialog">
                        <div className="title">
                            <span>Add product</span>
                        </div>
                        <div className="stock_wrapper">
                            {newStock ? null : (
                                <div className="first_block">
                                    <div className="block_field">
                                        <span>Product Name</span>
                                    </div>
                                    <input
                                        type="text"
                                        onChange={this.newName}
                                        value={product_name}
                                        placeholder="Type here..."
                                    />
                                    <div className="block_field error_block">
                                        <span className={quantityError ? "visible" : ""}>{quantityErrorText}</span>
                                    </div>
                                </div>
                            )}
                            <div className="first_block">
                                <div className="block_field">
                                    <span>Available qty</span>
                                </div>
                                <input
                                    type="number"
                                    onChange={this.newQuantity}
                                    value={quantity}
                                    placeholder="Type here..."
                                />
                                <div className="block_field error_block">
                                    <span className={quantityError ? "visible" : ""}>{quantityErrorText}</span>
                                </div>
                            </div>
                        </div>
                        <div className="stock_wrapper">
                            <div className="first_block">
                                <div className="block_field">
                                    <span>Unit Buying Price</span>
                                </div>
                                <input
                                    type="number"
                                    onChange={this.newBuyingPrice}
                                    value={buyingPrice}
                                    placeholder="Type here..."
                                />
                                <div className="block_field error_block">
                                    <span className={quantityError ? "visible" : ""}>{quantityErrorText}</span>
                                </div>
                            </div>
                        </div>

                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleStockDialog}>
                                Cancel
                            </button>
                            <button
                                className={loadingPage ? "unactive_btn" : "blue_btn"}
                                disabled={loadingPage}
                                onClick={this.addToStock}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </DialogComponent>
                <DialogComponent open={openSettings} onClose={() => this.setState({ openSettings: false })}>
                    <div className="stock_dialog">
                        <div className="title">
                            <span>Stock settings</span>
                        </div>

                        <div className="settings-dialog-wrapper">
                            <div className="settings-row">
                                <span>Low stock is less than or equal</span>
                                <span>Out of stock is less than</span>
                            </div>
                            <div className="settings-row">
                                <input
                                    type="number"
                                    value={limits && limits.low}
                                    onChange={e => {
                                        const { value } = e.target;
                                        this.setState(({ limits }) => ({ limits: { ...limits, low: +value } }));
                                    }}
                                />

                                <input
                                    type="number"
                                    value={limits && limits.out}
                                    onChange={e => {
                                        const { value } = e.target;
                                        this.setState(({ limits }) => ({ limits: { ...limits, out: +value } }));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={() => this.setState({ openSettings: false })}>
                                Cancel
                            </button>
                            <button
                                className="blue_btn"
                                onClick={() =>
                                    stockSettings("PATCH", limits).then(res => {
                                        if (res.error) {
                                            this.setState({ error: res.error.response.data.non_field_errors });
                                            //setTimeout(() => {this.setState({ error: '' });}, 5000);
                                        } else {
                                            this.setState({ openSettings: false });
                                        }
                                    })
                                }
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

function mapStateToProps({ stock, users }) {
    return {
        stock_list: stock.stock_list,
        search_list: stock.search_list,
        loadingPage: stock.loading,
        list: {
            stock: stock.stock_list.results,
            search: stock.search_list
        },
        stock_settings: stock.stock_settings,
        userInfo: users.userInfo
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getStock,
            searchStock,
            getSearchList,
            updateSetting,
            patchInventory,
            createInventoryNew,
            stockSettings
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(StockManagement);

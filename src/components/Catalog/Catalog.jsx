import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";
import Pagination from "../HelperComponents/Pagination/Pagination";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";
import FormControl from "@material-ui/core/FormControl";
import { Form, OverlayTrigger, Tooltip, Image, Popover } from "react-bootstrap";
import Path from "../../assets/image/Path.svg";
import off from "../../assets/image/off.svg";
import on from "../../assets/image/on.svg";
import RequestDialog from "../StockManagement/Dialogs/RequestDialog";
import {
    getCat,
    searchProducts,
    addCat,
    getSubcat,
    addProduct,
    searchAllStock,
    specialSearch,
    getSearchListAll,
    getStock,
    getCurrentCat,
    editCat,
    editProd,
    deleteProd,
    deleteCat,
    paginate,
    checkStocks,
    createInventory,
    patchInventory,
    getProdsForStocks,
    searchNewCategories,
    searchNewSubCategories,
    searchNewProducts
} from "../../actions/catalogActions";
import logo_sidebar from "../../assets/image/new logo.svg";
import { getOption } from "../HelperComponents/functions";

import "./Catalog.scss";
import CatalogInterface from "./CatalogInterface";
import StickyPopover from "../HelperComponents/StickyPopover/StickyPopover";

class Catalog extends CatalogInterface {
    state = {
        openDeleteDialog: false,
        openEditDialog: false,
        openAddDialog: false,
        openAddStockDialog: false,
        openAddProductDialog: false,
        openAddStockCustomDialog: false,
        totalItems: "",
        selectWidth: "60",
        otherData: [],
        selectType: "prod",
        option: { label: getOption("Products"), value: "products" },
        option_list: [
            { label: getOption("Categories"), value: "categories" },
            { label: getOption("Sub Categories"), value: "subcategories" },
            { label: getOption("Products"), value: "products" }
        ],

        items: [[], []],
        categoryProducts: [],
        filteredProds: [],
        currentCatName: "",
        parentCatId: false,
        prevCatName: [],
        prevCatId: [],
        targetId: "",
        newItemType: "",
        newCategoryName: "",
        newProductPrice: "",
        currentItemName: "",
        currentItemPrice: "",
        newProdName: "",

        activePage: 1,
        totalItemsCount: 0,
        totalPagesCount: 0,
        next: "",
        prev: "",
        reloading: false,
        loading: true,

        nameError: false,
        priceError: false,
        quantityError: false,
        supplyQuantityError: false,
        minSupplyQuantityError: false,
        nameErrorText: "",
        priceErrorText: "",
        quantityErrorText: "",
        supplyQuantityErrorText: "",
        minSupplyQuantityErrorText: "",

        quantity: "",
        autoSup: false,
        supply_quantity: "",
        min_supply_quantity: "",
        newStock: false,
        inventoryId: "",
        newVal: "",
        openSearch: false,
        openRequestDialog: false,
        product_quantity: null,
        product_name: null,
        stock: "in"
    };

    componentDidMount() {
        const {
            history: {
                location: { pathname }
            }
        } = this.props;
        let lastSlug = pathname.split("/")[pathname.split("/").length - 1];
        if (lastSlug === "catalog") {
            this.getCategories();
        } else {
            this.getCurrentCat(lastSlug);
            this.redirect(lastSlug);
        }
        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
        }, 0);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            history: {
                location: { pathname }
            }
        } = this.props;
        let lastSlug = pathname.split("/")[pathname.split("/").length - 1];

        if (this.props.catalog !== prevProps.catalog) {
            if (lastSlug === "catalog") {
                this.getCategories();
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            openDeleteDialog: false,
            openEditDialog: false,
            openAddDialog: false,
            openAddStockDialog: false,
            openAddProductDialog: false,
            openAddStockCustomDialog: false,
            selectType: null,
            option: null,
            option_list: [
                // { label: getOption("ALL"), value: "all" },
                { label: getOption("Categories"), value: "categories" },
                { label: getOption("Sub Categories"), value: "subcategories" },
                { label: getOption("Products"), value: "products" }
            ],

            items: [[], []],
            categoryProducts: [],
            filteredProds: [],
            currentCatName: "",
            parentCatId: false,
            targetId: "",
            newItemType: "",
            newCategoryName: "",
            newProductPrice: "",
            newProdName: "",

            activePage: 1,
            totalItemsCount: 0,
            totalPagesCount: 0,
            next: "",
            prev: "",
            loading: true,

            nameError: false,
            priceError: false,
            quantityError: false,
            supplyQuantityError: false,
            minSupplyQuantityError: false,
            nameErrorText: "",
            priceErrorText: "",
            quantityErrorText: "",
            supplyQuantityErrorText: "",
            minSupplyQuantityErrorText: "",

            quantity: "",
            autoSup: false,
            supply_quantity: "",
            min_supply_quantity: "",
            newStock: false,
            inventoryId: ""
        });
    }

    render() {
        const {
            openDeleteDialog,
            openEditDialog,
            openAddDialog,
            openAddStockCustomDialog,
            openAddStockDialog,
            openAddProductDialog,
            prevCatName,
            loading,
            items,
            activePage,
            categoryId,
            totalPagesCount,
            totalItemsCount,
            currentCatName,
            newItemType,
            currentItemName,
            currentItemPrice,
            nameError,
            priceError,
            nameErrorText,
            priceErrorText,
            autoSup,
            quantity,
            supply_quantity,
            min_supply_quantity,
            newProdName,
            filteredProds,
            newStock,
            quantityError,
            quantityErrorText,
            supplyQuantityError,
            supplyQuantityErrorText,
            minSupplyQuantityError,
            minSupplyQuantityErrorText,
            noCategoryExist,
            newVal,
            openRequestDialog,
            roduct_id,
            openSearch,
            product_quantity,
            product_name,
            product_id,
            product_image,
            option_list,
            option
        } = this.state;

        const {
            history: {
                location: { pathname }
            },
            stock_list
        } = this.props;
        let lastSlug = pathname.split("/")[pathname.split("/").length - 1];

        return (
            <div className="catalog_page content_block" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="custom_title_wrapper">
                    {pathname !== "/main/catalog" ? (
                        prevCatName.length > 1 ? (
                            <Fragment>
                                <Link to="#" onClick={this.moveBackFromSubcategory}>
                                    <img src={Path} alt="Path" />
                                    {prevCatName[prevCatName.length - 2]}
                                </Link>
                                <div className="title_page">{prevCatName[prevCatName.length - 1]}</div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Link to="/main/catalog" onClick={this.getCategories}>
                                    <img src={Path} alt="Path" />
                                    Products and categories
                                </Link>
                                <div className="title_page">{currentCatName}</div>
                            </Fragment>
                        )
                    ) : (
                        <div className="title_page">Products and categories</div>
                    )}
                </div>

                <div className="content_page">
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className={`catalog_table ${pathname === "/main/catalog" ? "catalog" : ""}`}>
                            <div className="block_search">
                                <div className="input-group">
                                    <FormControl className="select_wrapper">
                                        <SelectComponent
                                            value={option}
                                            options={option_list}
                                            change={e => {
                                                this.setState({
                                                    openSearch: false,
                                                    activePage: 0,
                                                    someVal: "",
                                                    newVal: "",
                                                    selectType: e.value,
                                                    option: e
                                                });
                                            }}
                                            isClearable="false"
                                            isSearchable={false}
                                            placeholder="Select search option"
                                        />
                                    </FormControl>

                                    <div className="search_info">
                                        <input
                                            type="text"
                                            className="search_info reset"
                                            placeholder="Search..."
                                            onKeyUp={e => this.handleSearchChange(e)}
                                            onChange={this.searchOnChange}
                                            value={newVal}
                                            disabled={!option}
                                        />
                                    </div>
                                </div>
                            </div>
                            {totalItemsCount === 0 && items[0].length + items[1].length < 1 ? (
                                <h3 className={"empty_list"}>The list is empty</h3>
                            ) : (
                                <div className="table_container transactions_columns">
                                    <div className="table_header">
                                        <div className="table_row">
                                            <div className="row_item">Name</div>
                                            <div className="row_item">Code</div>
                                            {<div className="row_item">Request</div>}
                                            <div className="row_item">Actions</div>
                                        </div>
                                    </div>

                                    <div className="table_body">
                                        {stock_list.count === 1
                                            ? items.map((elem, id) =>
                                                  elem.map((el, index) =>
                                                      el.id === stock_list.results[0].id ? (
                                                          <div className="table_row" key={index}>
                                                              {(this.state.search_list = [])}
                                                              <div className="row_item" style={{ height: "auto" }}>
                                                                  <>
                                                                      {["bottom"].map(placement => (
                                                                          <StickyPopover
                                                                              key={placement}
                                                                              placement={placement}
                                                                              component={
                                                                                  <>
                                                                                      {el.image ? (
                                                                                          <div>
                                                                                              <Image
                                                                                                  src={el.image}
                                                                                                  style={{
                                                                                                      width: "100%",
                                                                                                      height: "100%"
                                                                                                  }}
                                                                                              />
                                                                                          </div>
                                                                                      ) : (
                                                                                          <div>
                                                                                              <Image
                                                                                                  src={logo_sidebar}
                                                                                                  style={{
                                                                                                      width: "100%",
                                                                                                      height: "100%"
                                                                                                  }}
                                                                                              />
                                                                                          </div>
                                                                                      )}

                                                                                      <div
                                                                                          className="row_item"
                                                                                          style={{
                                                                                              textAlign: "left",
                                                                                              userSelect: 'text'
                                                                                          }}
                                                                                      >
                                                                                          {el.description
                                                                                              ? el.description
                                                                                              : el.name}
                                                                                      </div>
                                                                                  </>
                                                                              }
                                                                          >
                                                                              <span variant="light">
                                                                                  {el.is_product || el.price ? (
                                                                                      <div style={{ width: "100%" }}>
                                                                                          {el.name}
                                                                                      </div>
                                                                                  ) : (
                                                                                      <Link
                                                                                          to="#"
                                                                                          onClick={() =>
                                                                                              this.moveToSubcategory(
                                                                                                  el.id,
                                                                                                  el.name
                                                                                              )
                                                                                          }
                                                                                      >
                                                                                          {el.name}
                                                                                      </Link>
                                                                                  )}
                                                                              </span>
                                                                          </StickyPopover>
                                                                      ))}
                                                                  </>
                                                              </div>
                                                              <div className="row_item">
                                                                  {el.code ? "#" + el.code : "-"}
                                                              </div>
                                                              <div className="row_item">
                                                                  {el.deleted && el.code ? (
                                                                      <div className="btn_text">Not available</div>
                                                                  ) : el.is_product ? (
                                                                      <div className="row_item">
                                                                          <button
                                                                              className="green_text"
                                                                              onClick={() =>
                                                                                  this.toggleRequestDialog(
                                                                                      el.product_name,
                                                                                      el.quantity,
                                                                                      el.id,
                                                                                      el.image
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
                                                              {/*<div className="row_item">{el.unit_value || el.price ? 'RWF' + (el.unit_value || el.price) : '-'}</div>*/}
                                                              <div className="row_item ">
                                                                  {el.code ? (
                                                                      el.name === newProdName ||
                                                                      el.is_product ||
                                                                      el.brand ? (
                                                                          <button
                                                                              className="green_text"
                                                                              onClick={() => this.checkStocks(el.id)}
                                                                          >
                                                                              Add to stock
                                                                          </button>
                                                                      ) : (
                                                                          "-"
                                                                      )
                                                                  ) : (
                                                                      <Fragment>
                                                                          <button
                                                                              className="blue_text"
                                                                              onClick={() =>
                                                                                  this.editItem(
                                                                                      `${
                                                                                          lastSlug === "catalog"
                                                                                              ? "cat"
                                                                                              : el.unit_value ||
                                                                                                el.price
                                                                                              ? "prod"
                                                                                              : "sub"
                                                                                      }`,
                                                                                      el.id,
                                                                                      el.name,
                                                                                      el.price || el.unit_value
                                                                                          ? el.price || el.unit_value
                                                                                          : ""
                                                                                  )
                                                                              }
                                                                          >
                                                                              Edit
                                                                          </button>
                                                                          <button
                                                                              className="red_text"
                                                                              onClick={() =>
                                                                                  this.deleteItem(
                                                                                      `${
                                                                                          lastSlug === "catalog"
                                                                                              ? "cat"
                                                                                              : el.unit_value ||
                                                                                                el.price
                                                                                              ? "prod"
                                                                                              : "sub"
                                                                                      }`,
                                                                                      el.id,
                                                                                      el.name
                                                                                  )
                                                                              }
                                                                          >
                                                                              Delete
                                                                          </button>
                                                                      </Fragment>
                                                                  )}
                                                              </div>
                                                          </div>
                                                      ) : (
                                                          <> </>
                                                      )
                                                  )
                                              )
                                            : items.map((elem, id) =>
                                                  elem.map((el, index) => (
                                                      <div className="table_row" key={index}>
                                                          <div className="row_item" style={{ height: "auto" }}>
                                                              <>
                                                                  {["bottom"].map(placement => (
                                                                      <StickyPopover
                                                                          key={placement}
                                                                          placement={placement}
                                                                          component={
                                                                              <>
                                                                                  {el.image ? (
                                                                                      <div>
                                                                                          <Image
                                                                                              src={el.image}
                                                                                              style={{
                                                                                                  width: "100%",
                                                                                                  height: "100%"
                                                                                              }}
                                                                                          />
                                                                                      </div>
                                                                                  ) : (
                                                                                      <div>
                                                                                          <Image
                                                                                              src={logo_sidebar}
                                                                                              style={{
                                                                                                  width: "100%",
                                                                                                  height: "100%"
                                                                                              }}
                                                                                          />
                                                                                      </div>
                                                                                  )}

                                                                                  <div
                                                                                      className="row_item popover_text"
                                                                                  >
                                                                                      {el.description
                                                                                          ? el.description
                                                                                          : el.name}
                                                                                  </div>
                                                                              </>
                                                                          }
                                                                      >
                                                                          <span variant="light">
                                                                              {el.is_product || el.price ? (
                                                                                  <div style={{ width: "100%" }}>
                                                                                      {el.name}
                                                                                  </div>
                                                                              ) : (
                                                                                  <Link
                                                                                      to="#"
                                                                                      onClick={() =>
                                                                                          this.moveToSubcategory(
                                                                                              el.id,
                                                                                              el.name
                                                                                          )
                                                                                      }
                                                                                  >
                                                                                      {el.name}
                                                                                  </Link>
                                                                              )}
                                                                          </span>
                                                                      </StickyPopover>
                                                                  ))}
                                                              </>
                                                          </div>
                                                          <div className="row_item">
                                                              {el.code ? "#" + el.code : "-"}
                                                          </div>
                                                          <div className="row_item">
                                                              {el.deleted && el.code ? (
                                                                  <div className="btn_text">Not available</div>
                                                              ) : el.is_product ? (
                                                                  <div className="row_item">
                                                                      <button
                                                                          className="green_text"
                                                                          onClick={() =>
                                                                              this.toggleRequestDialog(
                                                                                  el.product_name,
                                                                                  el.quantity,
                                                                                  el.id,
                                                                                  el.image
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
                                                          {/*<div className="row_item">{el.unit_value || el.price ? 'RWF' + (el.unit_value || el.price) : '-'}</div>*/}
                                                          <div className="row_item ">
                                                              {el.code ? (
                                                                  el.name === newProdName ||
                                                                  el.is_product ||
                                                                  el.brand ? (
                                                                      <button
                                                                          className="green_text"
                                                                          onClick={() => this.checkStocks(el.id)}
                                                                      >
                                                                          Add to stock
                                                                      </button>
                                                                  ) : (
                                                                      "-"
                                                                  )
                                                              ) : (
                                                                  <Fragment>
                                                                      <button
                                                                          className="blue_text"
                                                                          onClick={() =>
                                                                              this.editItem(
                                                                                  `${
                                                                                      lastSlug === "catalog"
                                                                                          ? "cat"
                                                                                          : el.unit_value || el.price
                                                                                          ? "prod"
                                                                                          : "sub"
                                                                                  }`,
                                                                                  el.id,
                                                                                  el.name,
                                                                                  el.price || el.unit_value
                                                                                      ? el.price || el.unit_value
                                                                                      : ""
                                                                              )
                                                                          }
                                                                      >
                                                                          Edit
                                                                      </button>
                                                                      <button
                                                                          className="red_text"
                                                                          onClick={() =>
                                                                              this.deleteItem(
                                                                                  `${
                                                                                      lastSlug === "catalog"
                                                                                          ? "cat"
                                                                                          : el.unit_value || el.price
                                                                                          ? "prod"
                                                                                          : "sub"
                                                                                  }`,
                                                                                  el.id,
                                                                                  el.name
                                                                              )
                                                                          }
                                                                      >
                                                                          Delete
                                                                      </button>
                                                                  </Fragment>
                                                              )}
                                                          </div>
                                                      </div>
                                                  ))
                                              )}
                                    </div>
                                </div>
                            )}
                            {stock_list.count < 1 ? (
                                totalItemsCount < 10 ? null : (
                                    <div className="pagination_info_wrapper">
                                        <div className="pagination_block">
                                            <Pagination
                                                active={activePage - 1}
                                                pageCount={totalPagesCount}
                                                onChange={this.changePage}
                                            />
                                        </div>
                                        <div className="info">
                                            {" "}
                                            page {activePage} of {totalPagesCount}, items {activePage * 10 - 9} to{" "}
                                            {activePage * 10 > totalItemsCount ? totalItemsCount : activePage * 10} of{" "}
                                            {totalItemsCount}
                                        </div>
                                    </div>
                                )
                            ) : (
                                <></>
                            )}
                        </div>
                    )}
                </div>

                <DialogComponent
                    open={openDeleteDialog}
                    onClose={() => this.toggleDeleteDialog(this.state.productId, this.state.isProduct, categoryId)}
                >
                    <div className="delete_dialog">
                        <div className="title">
                            {newItemType === "cat" ? (
                                <span>Delete category</span>
                            ) : newItemType === "prod" ? (
                                <span>Delete product</span>
                            ) : newItemType === "sub" ? (
                                <span>Delete subcategory</span>
                            ) : null}
                        </div>
                        <div className="descriptions">
                            {newItemType === "cat" ? (
                                <span>
                                    You are about to delete <span>{currentItemName}</span> from the catalog. All
                                    subcategories and products of this category will also be deleted. Are you sure?
                                </span>
                            ) : newItemType === "prod" ? (
                                <span>
                                    You are about to delete <span>{currentItemName}</span> from the catalog. <br />
                                    Are you sure?
                                </span>
                            ) : newItemType === "sub" ? (
                                <span>
                                    You are about to delete <span>{currentItemName}</span> from the catalog. All
                                    subcategories and products of this subcategory will also be deleted. Are you sure?
                                </span>
                            ) : null}
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleDeleteDialog}>
                                Cancel
                            </button>
                            <button className="red_btn" onClick={this.deleteClick}>
                                delete
                            </button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent open={openAddStockDialog} onClose={this.toggleStockDialog}>
                    <div className="stock_dialog">
                        <div className="title">
                            <span>Add product</span>
                        </div>
                        {newStock ? null : (
                            <div className="help_block">
                                <span>This product is already in stock, you can edit it below.</span>
                            </div>
                        )}
                        <div className="stock_wrapper">
                            <div className="first_block">
                                <div className="block_field row">
                                    <span>Available qty</span>
                                </div>
                                <input
                                    type="number"
                                    onChange={this.newQuantity}
                                    value={quantity}
                                    placeholder="Type here..."
                                />
                                <div className="block_field error_block row">
                                    <span className={quantityError ? "visible" : ""}>{quantityErrorText}</span>
                                </div>
                            </div>
                            <div>
                                <span>Auto supply</span>
                                <div className="supply_btn">
                                    <button onClick={this.autoSupOff} className={autoSup ? "red" : "red active"}>
                                        <img src={off} alt="off" />
                                    </button>
                                    <button onClick={this.autoSupOn} className={autoSup ? "green active" : "green"}>
                                        <img src={on} alt="on" />
                                    </button>
                                </div>
                            </div>
                            <div className={autoSup ? "" : "disabled"}>
                                <div className="block_field row">
                                    <span>Min. qty</span>
                                </div>
                                <input
                                    type="number"
                                    onChange={this.newMinSupplyQuantity}
                                    value={min_supply_quantity}
                                    placeholder="Type here..."
                                />
                                <div className="block_field error_block row">
                                    <span className={minSupplyQuantityError ? "visible" : ""}>
                                        {minSupplyQuantityErrorText}
                                    </span>
                                </div>
                            </div>
                            <div className={autoSup ? "" : "disabled"}>
                                <div className="block_field row">
                                    <span>Auto supply qty</span>
                                </div>
                                <input
                                    type="number"
                                    onChange={this.newSupplyQuantity}
                                    value={supply_quantity}
                                    placeholder="Type here..."
                                />
                                <div className="block_field error_block row">
                                    <span className={supplyQuantityError ? "visible" : ""}>
                                        {supplyQuantityErrorText}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleStockDialog}>
                                Cancel
                            </button>
                            <button className="blue_btn" onClick={this.addToStock}>
                                add
                            </button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent open={openAddStockCustomDialog} onClose={this.toggleStockCustomDialog}>
                    <div className="stock_dialog">
                        <div className="title">
                            <span>Add product</span>
                        </div>
                        <div className="stock_wrapper">
                            <div className="first_block">
                                <div className="block_field row">
                                    <span>Available qty</span>
                                </div>
                                <input
                                    type="number"
                                    onChange={this.newQuantity}
                                    value={quantity}
                                    placeholder="Type here..."
                                />
                            </div>
                            <div>
                                <div className="block_field row">
                                    <span>Price</span>
                                </div>
                                <input
                                    type="number"
                                    onChange={this.newProductPrice}
                                    value={currentItemPrice}
                                    placeholder="Type here..."
                                />
                            </div>
                        </div>
                        <div className="block_field error_block row">
                            <span className={priceError ? "visible" : ""}>{priceErrorText}</span>
                            <span className={quantityError ? "visible" : ""}>{quantityErrorText}</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleStockCustomDialog}>
                                Cancel
                            </button>
                            <button className="blue_btn" onClick={() => this.addClick(true)}>
                                add
                            </button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent
                    open={openEditDialog}
                    onClose={() => this.toggleEditDialog(this.state.productId, this.state.isProduct, categoryId)}
                >
                    <div className="edit_dialog">
                        <div className="title">
                            {newItemType === "cat" ? (
                                <span>Edit category</span>
                            ) : newItemType === "prod" ? (
                                <span>Edit product</span>
                            ) : newItemType === "sub" ? (
                                <span>Edit subcategory</span>
                            ) : null}
                        </div>
                        <div className={`block_edit_field${newItemType === "prod" ? "" : " category"}`}>
                            <div>
                                <div className="block_field row">
                                    <span>Name</span>
                                </div>
                                <input onChange={this.newCategoryName} value={currentItemName} type="text" />
                            </div>
                            {newItemType === "prod" ? (
                                <div>
                                    <div className="block_field row">
                                        <span>Unit value</span>
                                    </div>
                                    <input
                                        onChange={this.newProductPrice}
                                        value={currentItemPrice}
                                        type="number"
                                        placeholder="Type here..."
                                    />
                                    <p>RWF</p>
                                </div>
                            ) : null}
                        </div>
                        <div className="block_field error_block row">
                            <span className={priceError ? "visible" : ""}>{priceErrorText}</span>
                            <span className={nameError ? "visible" : ""}>{nameErrorText}</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleEditDialog}>
                                Cancel
                            </button>
                            <button className="blue_btn" onClick={this.editClick}>
                                Save
                            </button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent open={openAddDialog} onClose={() => this.toggleAddDialog(categoryId, true)}>
                    <div className="add_dialog">
                        <div className="title">
                            {newItemType === "cat" ? (
                                <span>Add category</span>
                            ) : newItemType === "prod" ? (
                                <span>Add product</span>
                            ) : newItemType === "sub" ? (
                                <span>Add subcategory</span>
                            ) : null}
                        </div>
                        <div className="block_add_field">
                            <div>
                                <Form>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            onChange={this.newCategoryName}
                                            type="text"
                                            placeholder="Type Here..."
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            onChange={this.newCategoryDesc}
                                            as="textarea"
                                            rows="5"
                                            cols="7"
                                            placeholder="Product description..."
                                        />
                                    </Form.Group>

                                    <Form.File id="formcheck-api-regular">
                                        <Form.File.Label>Upload Image</Form.File.Label>
                                        <Form.File.Input onChange={this.newCategoryImg} />
                                    </Form.File>
                                </Form>
                            </div>
                            {newItemType === "prod" ? (
                                <div>
                                    <div className="block_field row">
                                        <span>Unit value</span>
                                    </div>
                                    <input onChange={this.newProductPrice} type="number" placeholder="Type here..." />
                                    <p>RWF</p>
                                </div>
                            ) : null}
                        </div>
                        <div className="block_field error_block row">
                            <span className={priceError ? "visible" : ""}>{priceErrorText}</span>
                            <span className={nameError ? "visible" : ""}>{nameErrorText}</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleAddDialog}>
                                Cancel
                            </button>
                            <button className="blue_btn" onClick={() => this.addClick(false)}>
                                Add
                            </button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent
                    open={openAddProductDialog}
                    onClose={this.toggleAddProductDialog}
                    onClick={this.clearSearch}
                >
                    <div className="add_product_dialog">
                        <div className="title">
                            <span>Add product</span>
                        </div>
                        <div className="descriptions">
                            <span>
                                Type a product name and select one of the options <br />
                                or create a new product.
                            </span>
                        </div>
                        <div className="block_field row">
                            <span></span>
                        </div>
                        <div className="block_search">
                            <input onChange={this.onTypeAction} type="text" placeholder="Search…" />
                            {filteredProds.length > 0 && newProdName.length > 2 ? (
                                <div className="autocomplete">
                                    {nameError ? null : (
                                        <button className="new" onClick={this.toggleStockCustomDialog}>
                                            {newProdName}
                                            <span>+ add new</span>
                                        </button>
                                    )}
                                    {filteredProds.map((prod, key) => (
                                        <button id={prod.id} key={key} onClick={() => this.checkStocks(prod.id)}>
                                            {prod.name}
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <div className="block_field error_block row">
                            <span className={nameError ? "visible" : ""}>{nameErrorText}</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleAddProductDialog}>
                                Cancel
                            </button>
                            <button
                                className="blue_btn"
                                disabled={nameError || newProdName.length < 3}
                                onClick={this.toggleStockCustomDialog}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </DialogComponent>
                <RequestDialog
                    useProductId
                    toggler={this.toggleRequestDialog}
                    product_quantity={product_quantity}
                    product_name={product_name}
                    state={openRequestDialog}
                    product_id={product_id}
                    product_image={product_image}
                    startValue={""}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        stock_list: state.stock.stock_list,
        search_list: state.stock.search_list
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getCat,
            searchProducts,
            addCat,
            getSubcat,
            addProduct,
            searchAllStock,
            specialSearch,
            getCurrentCat,
            editCat,
            editProd,
            deleteProd,
            deleteCat,
            paginate,
            checkStocks,
            createInventory,
            patchInventory,
            getProdsForStocks,
            getSearchListAll,
            getStock,
            searchNewCategories,
            searchNewSubCategories,
            searchNewProducts
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DialogComponent from '../HelperComponents/DialogComponent/DialogComponent';
import Loader from '../HelperComponents/ContentLoader/ContentLoader';
import Pagination from '../HelperComponents/Pagination/Pagination';
import ExpansionPanel from '../HelperComponents/ExpansionPanel/ExpansionPanel';
import addPhoto from '../../assets/image/add_photo.svg';
import SelectComponent from '../HelperComponents/SelectComponent/SelectComponent';

import Path from '../../assets/image/Path.svg';
import '../Catalog/Catalog.scss';

import {
  getCategories,
  getCat,
  addCat,
  getSubcat,
  addProduct,
  getCurrentCat,
  editCat,
  editProd,
  deleteProd,
  deleteCat,
  paginate,
} from '../../actions/catalogActions';

import {
  getProducts,
  paginateProducts,
  addProductNew,
  editProductNew,
  deleteProductNew,
  editQtyProduct,
  getManagerProducts,
  paginateManagerProducts,
} from '../../actions/productsActions';

import { changeRegionalQty } from '../../actions/ordersActions';

import { getManagers } from './../../actions/managersActions';

class InnerManager extends Component {
  state = {
    openEditDialog: false,
    openChangeQty: false,

    items: [[], []],
    currentCatName: '',
    parentCatId: false,
    prevCatName: [],
    prevCatId: [],
    targetId: '',
    newItemType: '',
    newCategoryName: '',
    newProductPrice: '',
    currentItemName: '',
    currentItemPrice: '',

    activePage: 1,
    totalItemsCount: 0,
    totalPagesCount: 0,
    next: '',
    prev: '',
    reloading: false,
    loading: true,

    nameError: false,
    priceError: false,
    nameErrorText: '',
    priceErrorText: '',
    inputValue: '',
    sku: '',
    chosenCategory: null,
    uploadedPhoto: null,
    photo: null,
    costValue: '',
    qtyValue: '',
    reorderValue: '',
    descriptionValue: '',
  };

  componentDidMount() {
    const { getCategories, getManagers } = this.props;
    getCategories();
    getManagers();
    this.getCat();
  }

  componentWillUnmount() {
    this.setState({
      openChangeQty: false,

      items: [[], []],
      currentCatName: '',
      parentCatId: false,
      prevCatName: [],
      prevCatId: [],
      targetId: '',
      newItemType: '',
      newCategoryName: '',
      newProductPrice: '',
      currentItemName: '',
      currentItemPrice: '',

      activePage: 1,
      totalItemsCount: 0,
      totalPagesCount: 0,
      next: '',
      prev: '',
      reloading: false,
      loading: true,

      nameError: false,
      priceError: false,
      nameErrorText: '',
      priceErrorText: '',
      regionOnHand: '',
    });
  }

  toggleEditDialog = () => {
    this.setState(({ openChangeQty }) => ({
      openChangeQty: !openChangeQty,
      error: null,
    }));
  };

  newCategoryName = (e) => {
    this.setState({
      newCategoryName: e.target.value,
      currentItemName: e.target.value,
    });
  };

  newProductPrice = (e) => {
    this.setState({
      newProductPrice: e.target.value,
      currentItemPrice: e.target.value,
    });
  };

  getCat = () => {
    const {
      getManagerProducts,
      match: {
        params: { id },
      },
    } = this.props;
    let generalData = [],
      categories = [],
      products = [],
      next = '',
      prev = '',
      totalPagesCount = 0,
      totalItemsCount = 0;

    this.setState({
      loading: true,
    });

    getManagerProducts(id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        generalData = res.payload.data.results;
        next = res.payload.data.next;
        prev = res.payload.data.previous;
        totalPagesCount = Math.ceil(res.payload.data.count / 10);
        totalItemsCount = res.payload.data.count;
        generalData.map((el, index) => {
          return el.is_product ? products.push(el) : categories.push(el);
        });
        this.setState({
          items: [categories, []],
          parentCatId: false,
          totalItemsCount: totalItemsCount,
          totalPagesCount: totalPagesCount,
          next: next,
          prev: prev,
          prevCatId: [],
          prevCatName: [],
          activePage: 1,
        });
        this.endLoading();
      }
    });
  };

  liveSearch = (search) => {
    const {
      paginateManagerProducts,
      match: {
        params: { id },
      },
    } = this.props;
    const { activePage } = this.state;
    let generalData = [],
      categories = [],
      products = [],
      next = '',
      prev = '',
      totalPagesCount = 0,
      totalItemsCount = 0;
    paginateManagerProducts(id, activePage, search).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        generalData = res.payload.data.results;
        next = res.payload.data.next;
        prev = res.payload.data.previous;
        totalPagesCount = Math.ceil(res.payload.data.count / 10);
        totalItemsCount = res.payload.data.count;

        generalData.map((el, index) => {
          return el.is_product ? products.push(el) : categories.push(el);
        });

        this.setState({
          items: [categories, products],
          totalItemsCount: totalItemsCount,
          totalPagesCount: totalPagesCount,
          next: next,
          prev: prev,
        });
        this.endLoading();
      }
    });
  };

  changePage = (page, customPage) => {
    const {
      paginateManagerProducts,
      match: {
        params: { id },
      },
    } = this.props;

    let newPage = customPage ? customPage : page.selected + 1,
      { inputValue } = this.state,
      generalData = [],
      categories = [],
      products = [],
      next = '',
      prev = '',
      totalPagesCount = 0,
      totalItemsCount = 0;

    paginateManagerProducts(id, newPage, inputValue).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        generalData = res.payload.data.results;
        next = res.payload.data.next;
        prev = res.payload.data.previous;
        totalPagesCount = Math.ceil(res.payload.data.count / 10);
        totalItemsCount = res.payload.data.count;

        generalData.map((el, index) => {
          return el.is_product ? products.push(el) : categories.push(el);
        });

        this.setState({
          items: [categories, products],
          activePage: newPage,
          totalItemsCount: totalItemsCount,
          totalPagesCount: totalPagesCount,
          next: next,
          prev: prev,
        });
        this.endLoading();
      }
    });
  };

  endLoading = () => {
    this.setState({
      loading: false,
    });
  };

  editQuantity = () => {
    const {
      changeRegionalQty,
      match: {
        params: { id },
      },
    } = this.props;
    const { targetId, regionOnHand, activePage } = this.state;
    if (regionOnHand >= 0) {
      changeRegionalQty(targetId, id, {
        region_on_hand: regionOnHand,
      }).then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
          this.changePage(false, activePage);

          this.endLoading();
          this.toggleEditDialog();
          this.setState({
            regionOnHand: null,
          });
        } else {
          if (res.error.response.data) {
            this.setState({
              error: Object.values(res.error.response.data)
                .flat()
                .map((el) => {
                  if (typeof el === 'object') {
                    return Object.values(el);
                  }
                  return el;
                })
                .flat()[0],
            });
          }
        }
      });
    } else {
      this.setState({
        error: 'Must be greater than 0.',
      });
    }
  };

  render() {
    const {
      openChangeQty,
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
      inputValue,
      chosenCategory,
      uploadedPhoto,
      photo,
      qtyValue,
      reorderValue,
      descriptionValue,
      costValue,
      regionOnHand,
    } = this.state;
    const {
      history: {
        location: { pathname },
      },
      managers,
      match: {
        params: { id },
      },
      categories,
    } = this.props;
    let lastSlug = pathname.split('/')[pathname.split('/').length - 1];
    //if(loading) return <Loader />;
    let mainCatalog = pathname === '/main/catalog';
    const currentManager = managers && managers.find((el) => el.id == id);
    return (
      <div className="catalog_page content_block">
        <div className="link_back">
          <Link to="/main/regional-managers/">
            <img src={Path} alt="Path" />
            Regions & representatives
          </Link>
        </div>
        <div className="custom_title_wrapper">
          <div className="title_page manager-title">
            {currentManager && currentManager.username}
          </div>
        </div>
        <div className="manager-email">
          {currentManager && currentManager.email} / {currentManager && currentManager.region}
        </div>
        <div className="content_page">
          {loading ? (
            <Loader />
          ) : (
            <div className={`catalog_table ${pathname === '/main/catalog' ? 'catalog' : ''}`}>
              <div className="table_panel">
                <input
                  placeholder="Search..."
                  value={inputValue}
                  onChange={(e) => {
                    this.setState({
                      inputValue: e.target.value,
                    });
                    this.liveSearch(e.target.value);
                  }}
                />

                {/* <div>
                                    <button
                                        onClick={() => this.addNewItem("prod")}
                                    >
                                        + add product
                                    </button>
                                </div> */}
              </div>
              {items[0].length + items[1].length < 1 ? (
                <h3 className={'empty_list'}>The list is empty</h3>
              ) : (
                <div className="table_container transactions_columns">
                  <div className="table_header">
                    <div className="table_row">
                      <div className="row_item">Name</div>
                      <div className="row_item">SKU</div>
                      <div className="row_item">Sales price</div>
                      {!mainCatalog && (
                        <>
                          <div className="row_item">Cost</div>
                          <div className="row_item">Qty on hand</div>
                          <div className="row_item">Reorder point</div>
                        </>
                      )}
                      <div className="row_item">Actions</div>
                    </div>
                  </div>
                  <div className="table_body">
                    {items.map((elem, id) =>
                      elem.map((el, index) => {
                        return (
                          <ExpansionPanel message={el.description} key={id} anounce={'Description'}>
                            <div className="row_item">{el.name}</div>
                            <div className="row_item">#{el.code}</div>
                            <div className="row_item">
                              {el.unit_value || el.price ? '$' + (el.unit_value || el.price) : '-'}
                            </div>
                            {!mainCatalog && (
                              <>
                                <div className="row_item">{el.cost || '-'}</div>
                                <div className="row_item">{el.region_on_hand || '-'}</div>
                                <div className="row_item">{el.reorder_point || '-'}</div>
                              </>
                            )}
                            <div className="row_item ">
                              <button
                                className="blue_text"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.setState({
                                    regionOnHand: el.region_on_hand,
                                    openChangeQty: true,
                                    targetId: el.id,
                                  });
                                }}>
                                CHANGE QTY
                              </button>
                            </div>
                          </ExpansionPanel>
                        );
                      }),
                    )}
                  </div>
                </div>
              )}
              {totalItemsCount <= 10 ? null : (
                <div className="pagination_info_wrapper">
                  <div className="pagination_block">
                    <Pagination
                      active={activePage - 1}
                      pageCount={totalPagesCount}
                      onChange={this.changePage}
                    />
                  </div>
                  <div className="info">
                    Displaying page {activePage} of {totalPagesCount}, items {activePage * 10 - 9}{' '}
                    to {activePage * 10 > totalItemsCount ? totalItemsCount : activePage * 10} of{' '}
                    {totalItemsCount}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogComponent
          open={openChangeQty}
          onClose={() => {
            this.setState({
              openChangeQty: false,
              regionOnHand: null,
              error: null,
            });
          }}>
          <div className="edit_dialog">
            <div className="title">Change product quantity</div>
            <div className="descriptions">
              You are about to change available amount of Product1. Enter the current quantity of
              the required product to proceed.
            </div>
            <div className={'block_add_field'}>
              <div className="name">
                <div className="block_field row">
                  <span>Quantity</span>
                  <span className={nameError ? '' : ''} />
                </div>
                <input
                  onChange={(e) =>
                    this.setState({
                      regionOnHand: e.target.value,
                    })
                  }
                  value={regionOnHand}
                  type="number"
                />
              </div>
            </div>
            <span className={this.state.error ? 'error visible' : 'error'}>{this.state.error}</span>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.setState({
                    openChangeQty: false,
                    regionOnHand: null,
                    error: null,
                  });
                }}>
                Cancel
              </button>
              <button className="blue_btn" onClick={this.editQuantity}>
                Save
              </button>
            </div>
          </div>
        </DialogComponent>
      </div>
    );
  }
}

function mapStateToProps({ dashboard, managers }) {
  return {
    categories: dashboard.categories,
    managers: managers.list,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCat,
      addCat,
      getSubcat,
      addProduct,
      getCurrentCat,
      editCat,
      editProd,
      deleteProd,
      deleteCat,
      paginate,
      getCategories,
      getProducts,
      paginateProducts,
      addProductNew,
      editProductNew,
      deleteProductNew,
      getManagers,
      editQtyProduct,
      changeRegionalQty,
      getManagerProducts,
      paginateManagerProducts,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InnerManager);

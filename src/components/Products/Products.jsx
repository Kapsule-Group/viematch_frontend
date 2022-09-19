import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DialogComponent from '../HelperComponents/DialogComponent/DialogComponent';
import { createNumberMask } from 'redux-form-input-masks';
import Loader from '../HelperComponents/ContentLoader/ContentLoader';
import Pagination from '../HelperComponents/Pagination/Pagination';
import ExpansionPanel from '../HelperComponents/ExpansionPanelModern/ExpansionPanelModern';
import addPhoto from '../../assets/image/add_photo.svg';
import SelectComponent from '../HelperComponents/SelectComponent/SelectComponent';
import { DefaultEditor } from 'react-simple-wysiwyg';

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
  searchProducts,
  addProductNew,
  editProductNew,
  deleteProductNew,
  editQtyProductMod,
  needDot,
} from '../../actions/productsActions';

class Products extends Component {
  state = {
    openDeleteDialog: false,
    openEditDialog: false,
    openAddDialog: false,

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
    regionOnHand: null,
    openChangeQty: false,
    activeTab: 0,
  };

  componentDidMount() {
    const { getCategories, needDot, location } = this.props;
    getCategories();
    this.getCat();
    needDot();

    const query = new URLSearchParams(location.search);
    if (query.get('code')) {
      this.setState({
        inputValue: query.get('code'),
      });
      this.liveSearch(query.get('code'));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    prevState.activeTab !== this.state.activeTab && this.getCat();
  }

  componentWillUnmount() {
    this.setState({
      openDeleteDialog: false,
      openEditDialog: false,
      openAddDialog: false,

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
    });
  }

  toggleDeleteDialog = () => {
    this.setState(({ openDeleteDialog }) => ({
      openDeleteDialog: !openDeleteDialog,
    }));
  };

  toggleEditDialog = () => {
    this.setState(({ openEditDialog }) => ({
      openEditDialog: !openEditDialog,
      error: null,
    }));
  };

  toggleAddDialog = () => {
    this.setState(({ openAddDialog }) => ({
      openAddDialog: !openAddDialog,
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
    const { getProducts } = this.props;
    const { activeTab } = this.state;
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

    getProducts(activeTab === 1).then((res) => {
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

  addNewItem = (type) => {
    this.setState({
      newItemType: type,
    });
    this.toggleAddDialog();
  };

  addClick = () => {
    const type = this.state.newItemType;

    switch (type) {
      case 'prod':
        this.addNewProd();
        break;
      default:
        console.log('Такое создать нельзя', type);
    }
  };

  addNewProd = () => {
    const {
      addProductNew,
      history: {
        location: { pathname },
      },
    } = this.props;
    const {
      newCategoryName,
      newProductPrice,
      parentCatId,
      totalPagesCount,
      sku,
      chosenCategory,
      uploadedPhoto,
      costValue,
      qtyValue,
      reorderValue,
      descriptionValue,
      activePage,
    } = this.state;
    const formData = new FormData();
    formData.append('image', uploadedPhoto);
    formData.append('name', newCategoryName);
    formData.append('price', +newProductPrice);
    formData.append('subcategory', chosenCategory && chosenCategory.id);
    // formData.append("code", sku);
    formData.append('cost', +costValue);
    formData.append('on_hand', +qtyValue);
    formData.append('reorder_point', +reorderValue);
    formData.append('description', descriptionValue);

    this.setState({ error: null });

    addProductNew(formData).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        this.changePage(false, activePage);

        this.endLoading();
        this.setState({
          sku: '',
          chosenCategory: null,
          uploadedPhoto: null,
          photo: null,
          costValue: '',
          qtyValue: '',
          reorderValue: '',
          descriptionValue: '',
        });
        this.toggleAddDialog();
      } else {
        if (res.error.response.data) {
          this.setState({
            error: Object.entries(res.error.response.data)
              .flat()
              .flat()
              .join(': '),
          });
        }
      }
    });
  };

  editItem = (
    type,
    targetId,
    currentItemName,
    currentItemPrice,
    code,
    cost,
    on_hand,
    reorder_point,
    image,
    description,
    subcategory,
  ) => {
    const { categories } = this.props;
    this.setState({
      newItemType: type,
      targetId: targetId,
      currentItemName: currentItemName,
      currentItemPrice: currentItemPrice,
      newProductPrice: currentItemPrice,
      newCategoryName: currentItemName,
      sku: code,
      costValue: cost,
      qtyValue: on_hand,
      reorderValue: reorder_point,
      descriptionValue: description,
      photo: image,
      chosenCategory: categories
        .filter((el) => el.id === subcategory)
        .map((el) => ({
          label: el.name,
          value: el.name,
          id: el.id,
        }))[0],
    });
    this.toggleEditDialog();
  };

  editClick = () => {
    const type = this.state.newItemType;

    switch (type) {
      case 'prod':
        this.editProd();
        break;
      default:
        console.log('Такое изменить нельзя', type);
    }
  };

  editProd = () => {
    const {
      newCategoryName,
      newProductPrice,
      parentCatId,
      totalPagesCount,
      sku,
      chosenCategory,
      uploadedPhoto,
      costValue,
      qtyValue,
      reorderValue,
      descriptionValue,
      targetId,
      activePage,
    } = this.state;
    const formData = new FormData();
    uploadedPhoto && formData.append('image', uploadedPhoto);
    formData.append('name', newCategoryName);
    formData.append('price', +newProductPrice);
    formData.append('subcategory', chosenCategory && chosenCategory.id);
    formData.append('code', sku);
    formData.append('cost', +costValue);
    formData.append('on_hand', +qtyValue);
    formData.append('reorder_point', +reorderValue);
    formData.append('description', descriptionValue);

    const { editProductNew } = this.props;
    this.setState({ error: null });

    editProductNew(formData, targetId).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        this.changePage(false, activePage);

        this.endLoading();
        this.toggleEditDialog();
        this.setState({
          sku: '',
          chosenCategory: null,
          uploadedPhoto: null,
          photo: null,
          costValue: '',
          qtyValue: '',
          reorderValue: '',
          descriptionValue: '',
        });
      } else {
        if (res.error.response.data) {
          this.setState({
            error: Object.entries(res.error.response.data)
              .flat()
              .flat()
              .join(': '),
          });
        }
      }
    });
  };

  deleteItem = (type, targetId, currentItemName) => {
    this.setState({
      newItemType: type,
      targetId: targetId,
      currentItemName: currentItemName,
    });
    this.toggleDeleteDialog();
  };

  deleteClick = () => {
    const type = this.state.newItemType;

    switch (type) {
      case 'prod':
        this.deleteProd();
        break;
      default:
        console.log('Такое удалить нельзя', type);
    }
  };

  deleteProd = () => {
    let { targetId, activePage } = this.state;
    const { deleteProductNew } = this.props;

    deleteProductNew(targetId).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        this.changePage(false, activePage);

        this.endLoading();
        this.toggleDeleteDialog();
      }
    });
  };

  liveSearch = (search) => {
    const { searchProducts } = this.props;
    const { activePage, activeTab } = this.state;
    let generalData = [],
      categories = [],
      products = [],
      next = '',
      prev = '',
      totalPagesCount = 0,
      totalItemsCount = 0;
    searchProducts(activePage, search, activeTab === 1).then((res) => {
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
    const { paginateProducts } = this.props;

    let newPage = customPage ? customPage : page.selected + 1,
      { inputValue, activeTab } = this.state,
      generalData = [],
      categories = [],
      products = [],
      next = '',
      prev = '',
      totalPagesCount = 0,
      totalItemsCount = 0;

    paginateProducts(newPage, inputValue, activeTab === 1).then((res) => {
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

  editQuantity = () => {
    const { editQtyProductMod } = this.props;
    const { targetId, regionOnHand, activePage } = this.state;
    if (regionOnHand >= 0) {
      editQtyProductMod({ region_on_hand: regionOnHand }, targetId).then((res) => {
        if (res.payload && res.payload.status && res.payload.status === 200) {
          this.changePage(false, activePage);

          this.endLoading();
          //this.toggleEditDialog();
          this.setState({
            regionOnHand: null,
            openChangeQty: false,
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

  endLoading = () => {
    this.setState({
      loading: false,
    });
  };

  changeTab = (activeTab) => {
    this.setState({ activeTab, activePage: 1, search: '' });
  };

  currencyMask = createNumberMask({
    decimalPlaces: 0,
    locale: 'en-US',
  });

  render() {
    const {
      openDeleteDialog,
      openEditDialog,
      openAddDialog,
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
      openChangeQty,
      activeTab,
    } = this.state;
    const {
      history: {
        location: { pathname },
      },
      history,
      categories,
      data: { role },
      resultsDot,
      currencyMask,
    } = this.props;
    let lastSlug = pathname.split('/')[pathname.split('/').length - 1];
    //if(loading) return <Loader />;
    let mainCatalog = pathname === '/main/catalog';
    return (
      <div className="catalog_page content_block">
        <div className="custom_title_wrapper">
          <div className="title_page">Products</div>
        </div>
        <div className="content_page">
          {(role === 'super_admin' || role === 'region') && (
            <div className="tab_customers pb30">
              <button
                className={activeTab === 0 ? 'active' : ''}
                onClick={() => {
                  this.changeTab(0);
                  this.setState({ inputValue: '' });
                }}>
                added products
              </button>
              <button
                className={activeTab === 1 ? 'active' : ''}
                onClick={() => {
                  this.changeTab(1);
                  this.setState({ inputValue: '' });
                }}>
                new products
                {resultsDot && resultsDot.results && resultsDot.results.length > 0 ? (
                  <span />
                ) : null}
              </button>
              {role === 'super_admin' && (
                <span onClick={() => history.push('/main/product-inner-replace')}>
                  REPLACE PRODUCT
                </span>
              )}
              {
                <span onClick={() => history.push('/main/product-inner-add')}>
                  + CREATE PRODUCT
                </span>
              }
            </div>
          )}

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
                      {role !== 'sales' && <div className="row_item">Actions</div>}
                    </div>
                  </div>
                  <div className="table_body">
                    {items.map((elem, id) =>
                      elem.map((el, index) => {
                        return (
                          <ExpansionPanel data={el}>
                            <div className="row_item">{el.name}</div>
                            <div className="row_item">#{el.code}</div>
                            <div className="row_item">
                              {el.unit_value || el.price
                                ? el.unit_value ||
                                  new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 0,
                                  }).format(Number(el.price).toFixed(0))
                                : '-'}
                            </div>

                            {!mainCatalog && (
                              <>
                                <div className="row_item">
                                  {new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 0,
                                  }).format(Number(el.cost).toFixed(0)) || '-'}
                                </div>
                                <div className="row_item">
                                  {(role === 'region'
                                    ? new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 0,
                                      }).format(Number(el.region_on_hand).toFixed(0))
                                    : new Intl.NumberFormat('en-US', {
                                        minimumFractionDigits: 0,
                                      }).format(Number(el.on_hand).toFixed(0))) || '-'}
                                </div>
                                <div className="row_item">
                                  {new Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 0,
                                  }).format(Number(el.reorder_point).toFixed(0)) || '-'}
                                </div>
                              </>
                            )}

                            {role !== 'sales' && (
                              <>
                                {' '}
                                {el.is_incomplete ? (
                                  <div className="row_item ">
                                    <button
                                      className="blue_text"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        history.push(`/main/product-inner-edit/${el.id}`);
                                      }}>
                                      Edit
                                    </button>
                                  </div>
                                ) : (
                                  <div className="row_item ">
                                    {role === 'other' ? (
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
                                    ) : (
                                      <>
                                        <button
                                          className="blue_text"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            history.push(`/main/product-inner-edit/${el.id}`);
                                          }}>
                                          Edit
                                        </button>
                                        <button
                                          className="red_text"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            this.deleteItem(
                                              `${
                                                lastSlug === 'catalog'
                                                  ? 'cat'
                                                  : el.unit_value || el.price
                                                  ? 'prod'
                                                  : 'sub'
                                              }`,
                                              el.id,
                                              el.name,
                                            );
                                          }}>
                                          Delete
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
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

        <DialogComponent
          open={openDeleteDialog}
          onClose={() =>
            this.toggleDeleteDialog(this.state.productId, this.state.isProduct, categoryId)
          }>
          <div className="delete_dialog">
            <div className="title">
              {newItemType === 'cat' ? (
                <span>Delete category</span>
              ) : newItemType === 'prod' ? (
                <span>Delete product</span>
              ) : newItemType === 'sub' ? (
                <span>Delete subcategory</span>
              ) : null}
            </div>
            <div className="descriptions">
              {newItemType === 'cat' ? (
                <span>
                  You are about to delete <span>{currentItemName}</span> from the catalog. All
                  subcategories and products of this category will also be deleted. Are you sure?
                </span>
              ) : newItemType === 'prod' ? (
                <span>
                  You are about to delete <span>{currentItemName}</span> from the catalog. <br />
                  Are you sure?
                </span>
              ) : newItemType === 'sub' ? (
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

        <DialogComponent
          open={openEditDialog}
          onClose={() => {
            this.toggleEditDialog(this.state.productId, this.state.isProduct, categoryId);
            this.setState({
              sku: '',
              chosenCategory: null,
              uploadedPhoto: null,
              photo: null,
              costValue: '',
              qtyValue: '',
              reorderValue: '',
              descriptionValue: '',
            });
          }}>
          <div className="edit_dialog">
            <div className="title">
              {newItemType === 'cat' ? (
                <span>Edit category</span>
              ) : newItemType === 'prod' ? (
                <span>Edit product</span>
              ) : newItemType === 'sub' ? (
                <span>Edit subcategory</span>
              ) : null}
            </div>
            <div
              className={`${newItemType === 'prod' ? 'block_add_field' : 'block_edit_field'}${
                newItemType === 'prod' ? '' : ' category'
              }`}>
              {newItemType === 'prod' ? (
                <>
                  <div className="wrapper-fields">
                    <div>
                      <div className="block_field row">
                        <span>Photo</span>
                        <span className={priceError ? '' : ''} />
                      </div>
                      <label>
                        <img src={photo || addPhoto} className="img-add" />
                        <input
                          type="file"
                          id="fileCreate"
                          style={{ display: 'none' }}
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={(e) => {
                            let fileItem = e.target.files[0];
                            if (fileItem) {
                              const newUrl = URL.createObjectURL(fileItem);
                              this.setState({
                                uploadedPhoto: fileItem,
                                photo: newUrl.toString(),
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <div className="name">
                        <div className="block_field row">
                          <span>Name</span>
                          <span className={nameError ? '' : ''} />
                        </div>
                        <input
                          onChange={this.newCategoryName}
                          value={currentItemName}
                          type="text"
                        />
                      </div>

                      <div className="sku">
                        <div className="block_field row">
                          <span>SKU</span>
                          <span className={this.state.skuError ? '' : ''} />
                        </div>
                        <input
                          onChange={(e) =>
                            this.setState({
                              sku: e.target.value,
                            })
                          }
                          value={this.state.sku}
                          type="text"
                          placeholder="Type here..."
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="category">
                    <div className="block_field row">
                      <span>Category</span>
                      <span className={priceError ? '' : ''} />
                    </div>
                    <SelectComponent
                      value={chosenCategory}
                      isSearchable={true}
                      isClearable={true}
                      placeholder="Select category…"
                      options={
                        categories &&
                        categories.map((el) => ({
                          label: el.name,
                          value: el.name,
                          id: el.id,
                        }))
                      }
                      change={(e) =>
                        this.setState({
                          chosenCategory: e,
                        })
                      }
                    />
                  </div>
                  <div className="four-fields-wrapper">
                    <div className="unit">
                      <div className="block_field row">
                        <span>Sales price</span>
                        <span className={priceError ? '' : ''} />
                      </div>
                      <input
                        onChange={this.newProductPrice}
                        type="number"
                        placeholder="Type here..."
                        value={currentItemPrice}
                      />
                      <p>$</p>
                    </div>
                    <div className="cost">
                      <div className="block_field row">
                        <span>Cost</span>
                        <span className={this.state.costError ? '' : ''} />
                      </div>
                      <input
                        onChange={(e) =>
                          this.setState({
                            costValue: e.target.value,
                          })
                        }
                        type="number"
                        value={costValue}
                        placeholder="Type here..."
                      />
                      <p>$</p>
                    </div>
                    <div className="qty">
                      <div className="block_field row">
                        <span>Qty on hand</span>
                        <span className={this.state.qtyError ? '' : ''} />
                      </div>
                      <input
                        onChange={(e) =>
                          this.setState({
                            qtyValue: e.target.value,
                          })
                        }
                        type="number"
                        value={qtyValue}
                        placeholder="0"
                      />
                    </div>
                    <div className="reorder">
                      <div className="block_field row">
                        <span>Reorder point</span>
                        <span className={this.state.reorderError ? '' : ''} />
                      </div>
                      <input
                        onChange={(e) =>
                          this.setState({
                            reorderValue: e.target.value,
                          })
                        }
                        type="number"
                        value={reorderValue}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="description">
                    <div className="block_field row">
                      <span>Description</span>
                      <span className={this.state.descriptionError ? '' : ''} />
                    </div>
                    {/* <textarea
                                            onChange={(e) =>
                                                this.setState({
                                                    descriptionValue:
                                                        e.target.value,
                                                })
                                            }
                                            type="number"
                                            value={descriptionValue}
                                            placeholder="Type here..."
                                        /> */}
                    <DefaultEditor
                      value={descriptionValue}
                      onChange={(e) =>
                        this.setState({
                          descriptionValue: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="name">
                  <div className="block_field row">
                    <span>Name</span>
                    <span className={nameError ? '' : ''} />
                  </div>
                  <input onChange={this.newCategoryName} value={currentItemName} type="text" />
                </div>
              )}
            </div>
            <span className={this.state.error ? 'error visible' : 'error'}>{this.state.error}</span>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.toggleEditDialog(this.state.productId, this.state.isProduct, categoryId);
                  this.setState({
                    sku: '',
                    chosenCategory: null,
                    uploadedPhoto: null,
                    photo: null,
                    costValue: '',
                    qtyValue: '',
                    reorderValue: '',
                    descriptionValue: '',
                  });
                }}>
                Cancel
              </button>
              <button className="blue_btn" onClick={this.editClick}>
                Save
              </button>
            </div>
          </div>
        </DialogComponent>

        <DialogComponent
          open={openAddDialog}
          onClose={() => {
            this.toggleAddDialog(categoryId, true);
            this.setState({
              sku: '',
              chosenCategory: null,
              uploadedPhoto: null,
              photo: null,
              costValue: '',
              qtyValue: '',
              reorderValue: '',
              descriptionValue: '',
            });
          }}>
          <div className="add_dialog">
            <div className="title">
              {newItemType === 'cat' ? (
                <span>Add category</span>
              ) : newItemType === 'prod' ? (
                <span>Add product</span>
              ) : newItemType === 'sub' ? (
                <span>Add subcategory</span>
              ) : null}
            </div>
            <div className="block_add_field">
              {newItemType === 'prod' ? (
                <>
                  <div className="wrapper-fields">
                    <div>
                      <div className="block_field row">
                        <span>Photo</span>
                        <span className={priceError ? '' : ''} />
                      </div>
                      <label>
                        <img src={photo || addPhoto} className="img-add" />
                        <input
                          type="file"
                          id="fileCreate"
                          style={{ display: 'none' }}
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={(e) => {
                            let fileItem = e.target.files[0];
                            if (fileItem) {
                              const newUrl = URL.createObjectURL(fileItem);
                              this.setState({
                                uploadedPhoto: fileItem,
                                photo: newUrl.toString(),
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <div className="name">
                        <div className="block_field row">
                          <span>Name</span>
                          <span className={nameError ? '' : ''} />
                        </div>
                        <input
                          onChange={this.newCategoryName}
                          type="text"
                          placeholder="Type here..."
                        />
                      </div>
                      <div className="sku">
                        <div className="block_field row">
                          <span>SKU</span>
                          <span className={this.state.skuError ? '' : ''} />
                        </div>
                        <input
                          onChange={(e) =>
                            this.setState({
                              sku: e.target.value,
                            })
                          }
                          value="Filled automatically after product creation."
                          type="text"
                          placeholder="Type here..."
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="category">
                    <div className="block_field row">
                      <span>Category</span>
                      <span className={priceError ? '' : ''} />
                    </div>
                    <SelectComponent
                      value={chosenCategory}
                      isSearchable={true}
                      isClearable={true}
                      placeholder="Select category…"
                      options={
                        categories &&
                        categories.map((el) => ({
                          label: el.name,
                          value: el.name,
                          id: el.id,
                        }))
                      }
                      change={(e) =>
                        this.setState({
                          chosenCategory: e,
                        })
                      }
                    />
                  </div>
                  <div className="four-fields-wrapper">
                    <div className="unit">
                      <div className="block_field row">
                        <span>Sales price</span>
                        <span className={priceError ? '' : ''} />
                      </div>
                      <input
                        onChange={this.newProductPrice}
                        type="number"
                        placeholder="Type here..."
                      />
                      <p>$</p>
                    </div>
                    <div className="cost">
                      <div className="block_field row">
                        <span>Cost</span>
                        <span className={this.state.costError ? '' : ''} />
                      </div>
                      <input
                        onChange={(e) =>
                          this.setState({
                            costValue: e.target.value,
                          })
                        }
                        type="number"
                        value={costValue}
                        placeholder="Type here..."
                      />
                      <p>$</p>
                    </div>
                    <div className="qty">
                      <div className="block_field row">
                        <span>Qty on hand</span>
                        <span className={this.state.qtyError ? '' : ''} />
                      </div>
                      <input
                        onChange={(e) =>
                          this.setState({
                            qtyValue: e.target.value,
                          })
                        }
                        type="number"
                        value={qtyValue}
                        placeholder="0"
                      />
                    </div>
                    <div className="reorder">
                      <div className="block_field row">
                        <span>Reorder point</span>
                        <span className={this.state.reorderError ? '' : ''} />
                      </div>
                      <input
                        onChange={(e) =>
                          this.setState({
                            reorderValue: e.target.value,
                          })
                        }
                        type="number"
                        value={reorderValue}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="description">
                    <div className="block_field row">
                      <span>Description </span>
                      <span className={this.state.descriptionError ? '' : ''} />
                    </div>
                    {/* <textarea
                                            onChange={(e) =>
                                                this.setState({
                                                    descriptionValue:
                                                        e.target.value,
                                                })
                                            }
                                            type="number"
                                            value={descriptionValue}
                                            placeholder="Type here..."
                                        /> */}
                    <DefaultEditor
                      value={descriptionValue}
                      onChange={(e) =>
                        this.setState({
                          descriptionValue: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <div className="name">
                  <div className="block_field row">
                    <span>Name</span>
                    <span className={nameError ? '' : ''} />
                  </div>
                  <input onChange={this.newCategoryName} type="text" placeholder="Type here..." />
                </div>
              )}
            </div>
            <span className={this.state.error ? 'error visible' : 'error'}>{this.state.error}</span>
            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.toggleAddDialog(categoryId, true);
                  this.setState({
                    sku: '',
                    chosenCategory: null,
                    uploadedPhoto: null,
                    photo: null,
                    costValue: '',
                    qtyValue: '',
                    reorderValue: '',
                    descriptionValue: '',
                  });
                }}>
                Cancel
              </button>
              <button className="blue_btn" onClick={this.addClick}>
                Add
              </button>
            </div>
          </div>
        </DialogComponent>
      </div>
    );
  }
}

function mapStateToProps({ dashboard, auth }) {
  return {
    categories: dashboard.categories,
    data: auth.data,
    resultsDot: auth.resultsDot,
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
      searchProducts,
      addProductNew,
      editProductNew,
      editQtyProductMod,
      deleteProductNew,
      needDot,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);

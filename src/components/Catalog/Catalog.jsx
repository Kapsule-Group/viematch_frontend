import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";
import Pagination from "../HelperComponents/Pagination/Pagination";
import ExpansionPanel from "../HelperComponents/ExpansionPanel/ExpansionPanel";
import addPhoto from "../../assets/image/add_photo.svg";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";
import { DefaultEditor } from "react-simple-wysiwyg";
import Path from "../../assets/image/Path.svg";
import "./Catalog.scss";
import ImagePhoto from "../../assets/image/image-doc.svg";
import DeletePhoto from "../../assets/image/close.svg";

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
} from "../../actions/catalogActions";

import { editProductNew } from "../../actions/productsActions";

class Catalog extends Component {
  state = {
    openDeleteDialog: false,
    openEditDialog: false,
    openAddDialog: false,

    items: [[], []],
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

    activePage: 1,
    totalItemsCount: 0,
    totalPagesCount: 0,
    next: "",
    prev: "",
    reloading: false,
    loading: true,

    nameError: false,
    priceError: false,
    nameErrorText: "",
    priceErrorText: "",
    inputValue: "",
    sku: "",
    chosenCategory: null,
    uploadedPhoto: null,
    photo: null,
    costValue: "",
    qtyValue: "",
    reorderValue: "",
    descriptionValue: "",
    photoAdded: null,
  };

  componentDidMount() {
    const {
      history: {
        location: { pathname },
      },
      getCategories,
    } = this.props;
    let lastSlug = pathname.split("/")[pathname.split("/").length - 1];
    getCategories();
    if (lastSlug === "catalog") {
      this.getCat();
    } else {
      this.getCurrentCat(lastSlug);
      this.getSubcat(lastSlug);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      history: {
        location: { pathname },
      },
      getCategories,
    } = this.props;
    let lastSlug = pathname.split("/")[pathname.split("/").length - 1];
    if (prevProps.location !== this.props.location) {
      this.setState({ inputValue: "" });
      getCategories();
      if (lastSlug === "catalog") {
        this.getCat();
      } else {
        this.getCurrentCat(lastSlug);
        this.getSubcat(lastSlug);
      }
    }
  }

  componentWillUnmount() {
    this.setState({
      openDeleteDialog: false,
      openEditDialog: false,
      openAddDialog: false,

      items: [[], []],
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

      activePage: 1,
      totalItemsCount: 0,
      totalPagesCount: 0,
      next: "",
      prev: "",
      reloading: false,
      loading: true,

      nameError: false,
      priceError: false,
      nameErrorText: "",
      priceErrorText: "",
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
      photoAdded: null,
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
    const { getCat } = this.props;
    let generalData = [],
      categories = [],
      products = [],
      next = "",
      prev = "",
      totalPagesCount = 0,
      totalItemsCount = 0;

    this.setState({
      loading: true,
    });

    getCat().then((res) => {
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

  getSubcat = (parentCatId) => {
    const { getSubcat } = this.props;
    let generalData = [],
      categories = [],
      products = [],
      next = "",
      prev = "",
      totalPagesCount = 0,
      totalItemsCount = 0;

    this.setState({
      loading: true,
    });

    getSubcat(parentCatId).then((res) => {
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
          activePage: 1,
        });
        this.endLoading();
      }
    });
  };

  addNewItem = (type) => {
    const {
      categories,
      match: {
        params: { id },
      },
    } = this.props;
    let data = { newItemType: type };
    if (type === "prod") {
      data.chosenCategory =
        categories &&
        categories
          .filter((el) => el.id == id)
          .map((el) => ({
            label: el.name,
            value: el.name,
            id: el.id,
          }))[0];
    }
    this.setState(data);
    this.toggleAddDialog();
  };

  addClick = () => {
    const type = this.state.newItemType;

    switch (type) {
      case "cat":
        this.addNewCat();
        break;
      case "sub":
        this.addNewCat(this.state.parentCatId);
        break;
      case "prod":
        this.addNewProd();
        break;
      default:
        console.log("Такое создать нельзя", type);
    }
  };

  addNewCat = (id) => {
    let { newCategoryName, parentCatId, photoAdded } = this.state,
      {
        history: {
          location: { pathname },
        },
      } = this.props,
      { items } = this.state,
      lastSlug = pathname.split("/")[pathname.split("/").length - 1];

    const data = new FormData();
    data.append("name", newCategoryName);
    if (photoAdded) {
      data.append("image", photoAdded);
    }
    const { addCat } = this.props;

    if (id !== undefined) {
      data.append("subcategory_id", id);
    }
    addCat(data).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        this.getCurrentCat(res.payload.data.id);
        this.redirect(res.payload.data.id);

        this.endLoading();
        this.toggleAddDialog();
      } else {
        if (res.error.response.data) {
          this.setState({
            error: Object.entries(res.error.response.data)
              .flat()
              .flat()
              .join(": "),
          });
        }
      }
    });
  };

  addNewProd = () => {
    const {
      addProduct,
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
    } = this.state;
    const formData = new FormData();
    formData.append("image", uploadedPhoto);
    formData.append("name", newCategoryName);
    formData.append("price", +newProductPrice);
    formData.append("subcategory_id", chosenCategory && chosenCategory.id);
    formData.append("code", sku);
    formData.append("cost", +costValue);
    formData.append("on_hand", +qtyValue);
    formData.append("reorder_point", +reorderValue);
    formData.append("description", descriptionValue);

    let data = {
        name: newCategoryName,
        price: +newProductPrice,
        subcategory_id: chosenCategory && chosenCategory.id,
        image: uploadedPhoto,
        code: sku,
        cost: +costValue,
        on_hand: +qtyValue,
        reorder_point: +reorderValue,
        description: descriptionValue,
      },
      items = this.state.items,
      lastSlug = pathname.split("/")[pathname.split("/").length - 1];

    addProduct(formData).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 201) {
        if (items[0].length + items[1].length < 10) {
          items[1].push(res.payload.data);
          this.setState({
            items: items,
          });
        } else {
          this.getCurrentCat(lastSlug);
          this.changePage(false, totalPagesCount);
        }
        this.endLoading();
        this.setState({
          sku: "",
          chosenCategory: null,
          uploadedPhoto: null,
          photo: null,
          costValue: "",
          qtyValue: "",
          reorderValue: "",
          descriptionValue: "",
        });
        this.toggleAddDialog();
      } else {
        if (res.error.response.data) {
          this.setState({
            error: Object.entries(res.error.response.data)
              .flat()
              .flat()
              .join(": "),
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
    description
  ) => {
    const {
      categories,
      match: {
        params: { id },
      },
    } = this.props;
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
      photoAdded: image,
      chosenCategory: categories
        .filter((el) => el.id === +id)
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
      case "cat":
        this.editCat();
        break;
      case "sub":
        this.editCat();
        break;
      case "prod":
        this.editProd();
        break;
      default:
        console.log("Такое изменить нельзя", type);
    }
  };

  editCat = () => {
    let { newCategoryName, targetId, parentCatId, photoAdded } = this.state,
      {
        history: {
          location: { pathname },
        },
      } = this.props,
      lastSlug = pathname.split("/")[pathname.split("/").length - 1];

    const data = new FormData();
    data.append("name", newCategoryName);
    if (photoAdded && photoAdded.name) {
      data.append("image", photoAdded);
    }
    const { editCat } = this.props;

    if (this.state.newItemType === "sub") data.subcategory_id = parentCatId;
    editCat(targetId, data).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        if (lastSlug === "catalog") {
          this.getCat();
        } else {
          this.getCurrentCat(parentCatId);
          this.getSubcat(parentCatId);
        }

        this.endLoading();
        this.toggleEditDialog();
      } else {
        if (res.error.response.data) {
          this.setState({
            error: Object.entries(res.error.response.data)
              .flat()
              .flat()
              .join(": "),
          });
        }
      }
    });
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
    } = this.state;
    const formData = new FormData();
    uploadedPhoto && formData.append("image", uploadedPhoto);
    formData.append("name", newCategoryName);
    formData.append("price", +newProductPrice);
    formData.append("subcategory", chosenCategory && chosenCategory.id);
    formData.append("code", sku);
    formData.append("cost", +costValue);
    formData.append("on_hand", +qtyValue);
    formData.append("reorder_point", +reorderValue);
    formData.append("description", descriptionValue);
    const { editProd, editProductNew } = this.props;

    this.setState({ error: null });

    editProductNew(formData, targetId).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        this.getCurrentCat(parentCatId);
        this.getSubcat(parentCatId);

        this.endLoading();
        this.toggleEditDialog();
        this.setState({
          sku: "",
          chosenCategory: null,
          uploadedPhoto: null,
          photo: null,
          costValue: "",
          qtyValue: "",
          reorderValue: "",
          descriptionValue: "",
        });
      } else {
        if (res.error.response.data) {
          this.setState({
            error: Object.entries(res.error.response.data)
              .flat()
              .flat()
              .join(": "),
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
      case "cat":
        this.deleteCat();
        break;
      case "sub":
        this.deleteCat();
        break;
      case "prod":
        this.deleteProd();
        break;
      default:
        console.log("Такое удалить нельзя", type);
    }
  };

  deleteProd = () => {
    let { targetId, parentCatId } = this.state;
    const { deleteProd } = this.props;

    deleteProd(targetId).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        this.getCurrentCat(parentCatId);
        this.getSubcat(parentCatId);

        this.endLoading();
        this.toggleDeleteDialog();
      }
    });
  };

  deleteCat = () => {
    let { targetId, parentCatId } = this.state,
      {
        history: {
          location: { pathname },
        },
      } = this.props,
      lastSlug = pathname.split("/")[pathname.split("/").length - 1];
    const { deleteCat } = this.props;

    deleteCat(targetId).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        if (lastSlug === "catalog") {
          this.getCat();
        } else {
          this.getCurrentCat(parentCatId);
          this.getSubcat(parentCatId);
        }

        this.endLoading();
        this.toggleDeleteDialog();
      }
    });
  };

  moveToSubcategory = (parentCatId, currentCatName) => {
    this.setState(({ prevCatId, prevCatName }) => ({
      prevCatId: [...prevCatId, parentCatId],
      prevCatName: [...prevCatName, currentCatName],
      currentCatName: currentCatName,
      parentCatId: parentCatId,
      items: [[], []],
    }));

    this.redirect(parentCatId);
  };

  moveBackFromSubcategory = () => {
    const { prevCatId, prevCatName } = this.state;
    prevCatId.pop();
    prevCatName.pop();

    this.setState({
      prevCatId: prevCatId,
      prevCatName: prevCatName,
      currentCatName: prevCatName[prevCatName.length - 1],
      parentCatId: prevCatId[prevCatId.length - 1],
    });

    this.redirect(prevCatId[prevCatId.length - 1]);
  };

  redirect = (id) => {
    const { history } = this.props;

    history.push(`/main/catalog/category/${id}`);
    this.getSubcat(id);
  };

  getCurrentCat = (id) => {
    const { getCurrentCat } = this.props;

    getCurrentCat(id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        this.setState({
          currentCatName: res.payload.data.name,
          parentCatId: res.payload.data.id,
        });
      }
    });
  };

  liveSearch = (search) => {
    const { paginate } = this.props;
    const { activePage, parentCatId } = this.state;
    let generalData = [],
      categories = [],
      products = [],
      next = "",
      prev = "",
      totalPagesCount = 0,
      totalItemsCount = 0;
    paginate(activePage, parentCatId, search).then((res) => {
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
    const { paginate } = this.props;

    let newPage = customPage ? customPage : page.selected + 1,
      { parentCatId, inputValue } = this.state,
      generalData = [],
      categories = [],
      products = [],
      next = "",
      prev = "",
      totalPagesCount = 0,
      totalItemsCount = 0;

    paginate(newPage, parentCatId, inputValue).then((res) => {
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
    } = this.state;
    const {
      history: {
        location: { pathname },
      },
      history,
      categories,
    } = this.props;
    let lastSlug = pathname.split("/")[pathname.split("/").length - 1];
    //if(loading) return <Loader />;
    let mainCatalog = pathname === "/main/catalog";
    return (
      <div className="catalog_page content_block">
        <div className="custom_title_wrapper">
          {pathname !== "/main/catalog" ? (
            prevCatName.length > 1 ? (
              <Fragment>
                <div className="link_req">
                  <Link to="#" onClick={this.moveBackFromSubcategory}>
                    <img src={Path} alt="Path" />
                    {prevCatName[prevCatName.length - 2]}
                  </Link>
                </div>
                <div className="title_page">
                  {prevCatName[prevCatName.length - 1]}
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="link_req">
                  <Link to="/main/catalog" onClick={this.getCategories}>
                    <img src={Path} alt="Path" />
                    Catalog
                  </Link>
                </div>
                <div className="title_page">{currentCatName}</div>
              </Fragment>
            )
          ) : (
            <div className="title_page">Catalog</div>
          )}
        </div>
        <div className="content_page">
          {loading ? (
            <Loader />
          ) : (
            <div
              className={`catalog_table ${
                pathname === "/main/catalog" ? "catalog" : ""
              }`}
            >
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
                {pathname === "/main/catalog" ? (
                  <button onClick={() => this.addNewItem("cat")}>
                    + add category
                  </button>
                ) : (
                  <div>
                    <button onClick={() => this.addNewItem("sub")}>
                      + add subcategory
                    </button>
                    <button
                      onClick={() => history.push("/main/product-inner-add")}
                    >
                      + add product
                    </button>
                  </div>
                )}
              </div>
              {items[0].length + items[1].length < 1 ? (
                <h3 className={"empty_list"}>The list is empty</h3>
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
                        return el.is_product ? (
                          <ExpansionPanel
                            message={
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: el.description,
                                }}
                              />
                            }
                            key={id}
                            anounce={"Description"}
                          >
                            <div className="row_item">{el.name}</div>
                            <div className="row_item">#{el.code}</div>
                            <div className="row_item">
                              {el.unit_value || el.price
                                ? new Intl.NumberFormat("en-US", {
                                    minimumFractionDigits: 0,
                                  }).format(el.unit_value || el.price)
                                : "-"}
                            </div>

                            {!mainCatalog && (
                              <>
                                <div className="row_item">
                                  {new Intl.NumberFormat("en-US", {
                                    minimumFractionDigits: 0,
                                  }).format(el.cost) || "-"}
                                </div>
                                <div className="row_item">
                                  {el.on_hand || "-"}
                                </div>
                                <div className="row_item">
                                  {el.reorder_point || "-"}
                                </div>
                              </>
                            )}
                            <div className="row_item ">
                              <button
                                className="blue_text"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // this.editItem(
                                  //     `${
                                  //         lastSlug ===
                                  //         "catalog"
                                  //             ? "cat"
                                  //             : el.unit_value ||
                                  //               el.price
                                  //             ? "prod"
                                  //             : "sub"
                                  //     }`,
                                  //     el.id,
                                  //     el.name,
                                  //     el.price ||
                                  //         el.unit_value
                                  //         ? el.price ||
                                  //               el.unit_value
                                  //         : "",
                                  //     el.code,
                                  //     el.cost,
                                  //     el.on_hand,
                                  //     el.reorder_point,
                                  //     el.image,
                                  //     el.description
                                  // );
                                  history.push(
                                    `/main/product-inner-edit/${el.id}`
                                  );
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="red_text"
                                onClick={(e) => {
                                  e.stopPropagation();
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
                                  );
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </ExpansionPanel>
                        ) : (
                          <div className="table_row" key={index}>
                            <div className="row_item">
                              {el.is_product || el.price ? (
                                <div>{el.name}</div>
                              ) : (
                                <Link
                                  to="#"
                                  onClick={() =>
                                    this.moveToSubcategory(el.id, el.name)
                                  }
                                >
                                  {el.name}
                                </Link>
                              )}
                            </div>
                            <div className="row_item">#{el.code}</div>
                            <div className="row_item">
                              {el.unit_value || el.price
                                ? "$" + (el.unit_value || el.price)
                                : "-"}
                            </div>
                            {!mainCatalog && (
                              <>
                                <div className="row_item">{el.cost || "-"}</div>
                                <div className="row_item">
                                  {el.on_hand || "-"}
                                </div>
                                <div className="row_item">
                                  {el.reorder_point || "-"}
                                </div>
                              </>
                            )}
                            <div className="row_item ">
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
                                      : "",
                                    el.code,
                                    el.cost,
                                    el.on_hand,
                                    el.reorder_point,
                                    el.image,
                                    el.description
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
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
              {lastSlug === "catalog" && totalItemsCount > 10 ? (
                <div className="pagination_info_wrapper">
                  <div className="pagination_block">
                    <Pagination
                      active={activePage - 1}
                      pageCount={totalPagesCount}
                      onChange={this.changePage}
                    />
                  </div>
                  <div className="info">
                    Displaying page {activePage} of {totalPagesCount}, items{" "}
                    {activePage * 10 - 9} to{" "}
                    {activePage * 10 > totalItemsCount
                      ? totalItemsCount
                      : activePage * 10}{" "}
                    of {totalItemsCount}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <DialogComponent
          open={openDeleteDialog}
          onClose={() =>
            this.toggleDeleteDialog(
              this.state.productId,
              this.state.isProduct,
              categoryId
            )
          }
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
                  You are about to delete <span>{currentItemName}</span> from
                  the catalog. All subcategories and products of this category
                  will also be deleted. Are you sure?
                </span>
              ) : newItemType === "prod" ? (
                <span>
                  You are about to delete <span>{currentItemName}</span> from
                  the catalog. <br />
                  Are you sure?
                </span>
              ) : newItemType === "sub" ? (
                <span>
                  You are about to delete <span>{currentItemName}</span> from
                  the catalog. All subcategories and products of this
                  subcategory will also be deleted. Are you sure?
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
            this.toggleEditDialog(
              this.state.productId,
              this.state.isProduct,
              categoryId
            );
            this.setState({
              sku: "",
              chosenCategory: null,
              uploadedPhoto: null,
              photo: null,
              costValue: "",
              qtyValue: "",
              reorderValue: "",
              descriptionValue: "",
            });
          }}
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
            <div
              className={`${
                newItemType === "prod" ? "block_add_field" : "block_edit_field"
              }${newItemType === "prod" ? "" : " category"}`}
            >
              {newItemType === "prod" ? (
                <>
                  <div className="wrapper-fields">
                    <div>
                      <div className="block_field row">
                        <span>Photo</span>
                        <span className={priceError ? "" : ""} />
                      </div>
                      <label>
                        <img src={photo || addPhoto} className="img-add" />
                        <input
                          type="file"
                          id="fileCreate"
                          style={{ display: "none" }}
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
                          <span className={nameError ? "" : ""} />
                        </div>
                        <input
                          onChange={this.newCategoryName}
                          value={currentItemName}
                          type="text"
                        />
                        <label />
                      </div>

                      <div className="sku">
                        <div className="block_field row">
                          <span>SKU</span>
                          <span className={this.state.skuError ? "" : ""} />
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
                      <span className={priceError ? "" : ""} />
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
                        <span className={priceError ? "" : ""} />
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
                        <span className={this.state.costError ? "" : ""} />
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
                        <span className={this.state.qtyError ? "" : ""} />
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
                        <span className={this.state.reorderError ? "" : ""} />
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
                      <span className={this.state.descriptionError ? "" : ""} />
                    </div>

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
                <div className="add-row">
                  <div className="name">
                    <div className="block_field row">
                      <span>Name</span>
                      <span className={nameError ? "" : ""} />
                    </div>
                    <input
                      onChange={this.newCategoryName}
                      type="text"
                      placeholder="Type here..."
                      value={currentItemName}
                    />
                  </div>
                  <div className="photo-input">
                    <div className="block_field row">
                      <span>Photo</span>
                      <span className={nameError ? "" : ""} />
                    </div>
                    {this.state.photoAdded ? (
                      <div className="downloaded-photo-wrapper">
                        <img src={ImagePhoto} alt="" />
                        <p>
                          {this.state.photoAdded.name ||
                            this.state.photoAdded.split("/").reverse()[0]}
                        </p>
                        <img
                          className="delete-photo-btn"
                          src={DeletePhoto}
                          alt=""
                          onClick={() =>
                            this.setState({
                              photoAdded: null,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <label>
                        <div className="upload-btn">Upload</div>
                        <input
                          type="file"
                          id="fileCreate"
                          style={{ display: "none" }}
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={(e) => {
                            let fileItem = e.target.files[0];
                            if (fileItem) {
                              const newUrl = URL.createObjectURL(fileItem);
                              this.setState({
                                photoAdded: fileItem,
                              });
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className={this.state.error ? "error visible" : "error"}>
              {this.state.error}
            </span>
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

        <DialogComponent
          open={openAddDialog}
          onClose={() => {
            this.toggleAddDialog(categoryId, true);
            this.setState({
              sku: "",
              chosenCategory: null,
              uploadedPhoto: null,
              photo: null,
              costValue: "",
              qtyValue: "",
              reorderValue: "",
              descriptionValue: "",
            });
          }}
        >
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
              {newItemType === "prod" ? (
                <>
                  <div className="wrapper-fields">
                    <div>
                      <div className="block_field row">
                        <span>Photo</span>
                        <span className={priceError ? "visible" : ""}>
                          {priceErrorText}
                        </span>
                      </div>
                      <label>
                        <img src={photo || addPhoto} className="img-add" />
                        <input
                          type="file"
                          id="fileCreate"
                          style={{ display: "none" }}
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
                          <span className={nameError ? "" : ""} />
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
                          <span className={this.state.skuError ? "" : ""} />
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
                      <span className={priceError ? "" : ""} />
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
                        <span className={priceError ? "" : ""} />
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
                        <span className={this.state.costError ? "" : ""} />
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
                        <span className={this.state.qtyError ? "" : ""} />
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
                        <span className={this.state.reorderError ? "" : ""} />
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
                      <span className={this.state.descriptionError ? "" : ""} />
                    </div>

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
                <div className="add-row">
                  <div className="name">
                    <div className="block_field row">
                      <span>Name</span>
                      <span className={nameError ? "" : ""} />
                    </div>
                    <input
                      onChange={this.newCategoryName}
                      type="text"
                      placeholder="Type here..."
                    />
                  </div>
                  <div className="photo-input">
                    <div className="block_field row">
                      <span>Photo</span>
                      <span className={nameError ? "" : ""} />
                    </div>
                    {this.state.photoAdded ? (
                      <div className="downloaded-photo-wrapper">
                        <img src={ImagePhoto} alt="" />
                        <p>{this.state.photoAdded.name}</p>
                        <img
                          className="delete-photo-btn"
                          src={DeletePhoto}
                          alt=""
                          onClick={() =>
                            this.setState({
                              photoAdded: null,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <label>
                        <div className="upload-btn">Upload</div>
                        <input
                          type="file"
                          id="fileCreate"
                          style={{ display: "none" }}
                          accept="image/jpg, image/jpeg, image/png"
                          onChange={(e) => {
                            let fileItem = e.target.files[0];
                            if (fileItem) {
                              const newUrl = URL.createObjectURL(fileItem);
                              this.setState({
                                photoAdded: fileItem,
                              });
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className={this.state.error ? "error visible" : "error"}>
              {this.state.error}
            </span>
            <div className="btn_wrapper">
              <button className="cancel_btn" onClick={this.toggleAddDialog}>
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

function mapStateToProps({ dashboard }) {
  return {
    categories: dashboard.categories,
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
      editProductNew,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);

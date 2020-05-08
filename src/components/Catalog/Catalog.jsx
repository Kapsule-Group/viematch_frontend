import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link, withRouter} from 'react-router-dom';
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import Loader from '../HelperComponents/ContentLoader/ContentLoader'
import Pagination from '../HelperComponents/Pagination/Pagination';

import Path from '../../assets/image/Path.svg';
import off from '../../assets/image/off.svg';
import on from '../../assets/image/on.svg';
import './Catalog.scss';

import { getCat, addCat, getSubcat, addProduct, getCurrentCat, editCat, editProd, deleteProd, deleteCat, paginate, checkStocks, createInventory, patchInventory, getProdsForStocks } from '../../actions/catalogActions';


class Catalog extends Component {
    state = {
        openDeleteDialog: false,
        openEditDialog: false,
        openAddDialog: false,
        openAddStockDialog: false,
        openAddProductDialog: false,
        openAddStockCustomDialog: false,

        items: [[],[]],
        categoryProducts: [],
        filteredProds: [],
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
        newProdName: '',

        activePage: 1,
        totalItemsCount: 0,
        totalPagesCount: 0,
        next: '',
        prev: '',
        reloading: false,
        loading: true,

        nameError: false,
        priceError: false,
        quantityError: false,
        supplyQuantityError: false,
        minSupplyQuantityError: false,
        nameErrorText: '',
        priceErrorText: '',
        quantityErrorText: '',
        supplyQuantityErrorText: '',
        minSupplyQuantityErrorText: '',

        quantity: '',
        autoSup: false,
        supply_quantity: '',
        min_supply_quantity: '',
        newStock: false,
        inventoryId: ''
    };

    componentDidMount() {
        const {  history: { location: { pathname } } } = this.props;
        let lastSlug = pathname.split('/')[pathname.split('/').length - 1];
        if(lastSlug === 'catalog') {
            this.getCategories();
        }else{
            this.getCurrentCat(lastSlug);
            this.redirect(lastSlug);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {  history: { location: { pathname } } } = this.props;
        let lastSlug = pathname.split('/')[pathname.split('/').length - 1];

        if(this.props.catalog !== prevProps.catalog) {
            if(lastSlug === 'catalog') {
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

            items: [[],[]],
            categoryProducts: [],
            filteredProds: [],
            currentCatName: '',
            parentCatId: false,
            targetId: '',
            newItemType: '',
            newCategoryName: '',
            newProductPrice: '',
            newProdName: '',

            activePage: 1,
            totalItemsCount: 0,
            totalPagesCount: 0,
            next: '',
            prev: '',
            loading: true,

            nameError: false,
            priceError: false,
            quantityError: false,
            supplyQuantityError: false,
            minSupplyQuantityError: false,
            nameErrorText: '',
            priceErrorText: '',
            quantityErrorText: '',
            supplyQuantityErrorText: '',
            minSupplyQuantityErrorText: '',

            quantity: '',
            autoSup: false,
            supply_quantity: '',
            min_supply_quantity: '',
            newStock: false,
            inventoryId: ''
        });
    }

    toggleDeleteDialog = (id = null) => {
        this.setState(({openDeleteDialog}) => ({
            openDeleteDialog: !openDeleteDialog,
        }));
    };

    toggleEditDialog = (id = null) => {
        this.setState(({
                           openEditDialog,
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
            openEditDialog: !openEditDialog,
            nameError: openEditDialog ? !nameError : nameError,
            priceError: openEditDialog ? !priceError : priceError,
            nameErrorText: openEditDialog ? '' : nameErrorText,
            priceErrorText: openEditDialog ? '' : priceErrorText,
            quantityError: openEditDialog ? !quantityError : quantityError,
            supplyQuantityError: openEditDialog ? !supplyQuantityError : supplyQuantityError,
            minSupplyQuantityError: openEditDialog ? !minSupplyQuantityError : minSupplyQuantityError,
            quantityErrorText: openEditDialog ? '' : quantityErrorText,
            supplyQuantityErrorText: openEditDialog ? '' : supplyQuantityErrorText,
            minSupplyQuantityErrorText: openEditDialog ? '' : minSupplyQuantityErrorText,
        }))
    };

    toggleAddDialog = (id = null) => {
        this.setState(({
                           openAddDialog,
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
            openAddDialog: !openAddDialog,
            nameError: openAddDialog ? !nameError : nameError,
            priceError: openAddDialog ? !priceError : priceError,
            nameErrorText: openAddDialog ? '' : nameErrorText,
            priceErrorText: openAddDialog ? '' : priceErrorText,
            quantityError: openAddDialog ? !quantityError : quantityError,
            supplyQuantityError: openAddDialog ? !supplyQuantityError : supplyQuantityError,
            minSupplyQuantityError: openAddDialog ? !minSupplyQuantityError : minSupplyQuantityError,
            quantityErrorText: openAddDialog ? '' : quantityErrorText,
            supplyQuantityErrorText: openAddDialog ? '' : supplyQuantityErrorText,
            minSupplyQuantityErrorText: openAddDialog ? '' : minSupplyQuantityErrorText,
        }))
    };

    toggleStockDialog = (id = null) => {
        this.setState(({
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
            nameErrorText: openAddStockDialog ? '' : nameErrorText,
            priceErrorText: openAddStockDialog ? '' : priceErrorText,
            quantityError: openAddStockDialog ? !quantityError : quantityError,
            supplyQuantityError: openAddStockDialog ? !supplyQuantityError : supplyQuantityError,
            minSupplyQuantityError: openAddStockDialog ? !minSupplyQuantityError : minSupplyQuantityError,
            quantityErrorText: openAddStockDialog ? '' : quantityErrorText,
            supplyQuantityErrorText: openAddStockDialog ? '' : supplyQuantityErrorText,
            minSupplyQuantityErrorText: openAddStockDialog ? '' : minSupplyQuantityErrorText,
        }));
    };

    toggleStockCustomDialog = (id = null) => {
        this.setState(({
                           openAddStockCustomDialog,
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
            openAddStockCustomDialog: !openAddStockCustomDialog,
            openAddProductDialog: openAddProductDialog ? !openAddProductDialog : openAddProductDialog,
            quantity: '',
            currentItemPrice: '',
            nameError: openAddStockCustomDialog ? !nameError : nameError,
            priceError: openAddStockCustomDialog ? !priceError : priceError,
            nameErrorText: openAddStockCustomDialog ? '' : nameErrorText,
            priceErrorText: openAddStockCustomDialog ? '' : priceErrorText,
            quantityError: openAddStockCustomDialog ? !quantityError : quantityError,
            supplyQuantityError: openAddStockCustomDialog ? !supplyQuantityError : supplyQuantityError,
            minSupplyQuantityError: openAddStockCustomDialog ? !minSupplyQuantityError : minSupplyQuantityError,
            quantityErrorText: openAddStockCustomDialog ? '' : quantityErrorText,
            supplyQuantityErrorText: openAddStockCustomDialog ? '' : supplyQuantityErrorText,
            minSupplyQuantityErrorText: openAddStockCustomDialog ? '' : minSupplyQuantityErrorText,
        }));
    };

    toggleAddProductDialog = (id = null) => {
        this.setState(({
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
            openAddProductDialog: !openAddProductDialog,
            filteredProds: [],
            nameError: openAddProductDialog ? !nameError : nameError,
            priceError: openAddProductDialog ? !priceError : priceError,
            nameErrorText: openAddProductDialog ? '' : nameErrorText,
            priceErrorText: openAddProductDialog ? '' : priceErrorText,
            quantityError: openAddProductDialog ? !quantityError : quantityError,
            supplyQuantityError: openAddProductDialog ? !supplyQuantityError : supplyQuantityError,
            minSupplyQuantityError: openAddProductDialog ? !minSupplyQuantityError : minSupplyQuantityError,
            quantityErrorText: openAddProductDialog ? '' : quantityErrorText,
            supplyQuantityErrorText: openAddProductDialog ? '' : supplyQuantityErrorText,
            minSupplyQuantityErrorText: openAddProductDialog ? '' : minSupplyQuantityErrorText,
        }));
    };

    onTypeAction = (e) => {
        const { categoryProducts } = this.state;
        let newArr = [];

        for(let i = 0; i < categoryProducts.length; i++) {
            if(e.target.value.length < 1) {
                newArr = [];
            }else if(categoryProducts[i].name.toLowerCase().includes(e.target.value.toLowerCase())) {
                newArr.push(categoryProducts[i]);
            }
            if(categoryProducts[i].name.toLowerCase() === e.target.value.toLowerCase()) {
                console.log(categoryProducts[i], 'ошибка');
                this.setState({
                    nameError: true,
                    nameErrorText: 'Product with the same name already exists in this category/subcategory.',
                });
                break;
            }else {
                console.log('нет ошибки');
                this.setState({
                    nameError: false,
                    nameErrorText: '',
                });
            }
        }

        this.setState({
            newProdName: e.target.value,
            filteredProds: newArr
        });

    };

    clearSearch = () => {
        this.setState({
            filteredProds: []
        });
    };

    newCategoryName = (e) => {
        this.setState({
            newCategoryName: e.target.value,
            currentItemName: e.target.value
        });
    };

    newProductPrice = (e) => {
        this.setState({
            newProductPrice: e.target.value,
            currentItemPrice: e.target.value
        });
    };

    getCategoriesProducts = () => {
        const {getProdsForStocks} = this.props;

        getProdsForStocks().then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    categoryProducts: res.payload.data
                });
            }
        });
    };

    getCategories = () => {
        const { getCat } = this.props;
        let generalData = [],
            categories = [],
            products = [],
            next = '',
            prev = '',
            totalPagesCount = 0,
            totalItemsCount = 0;

        this.setState({
            loading: true
        });

        getCat().then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                generalData = res.payload.data.results;
                next = res.payload.data.next;
                prev = res.payload.data.previous;
                totalPagesCount = res.payload.data.total_pages;
                totalItemsCount = res.payload.data.count;
                generalData.map((el, index) => {
                    el.is_product ? products.push(el) : categories.push(el);
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
                    currentCatName: false,
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
            next = '',
            prev = '',
            totalPagesCount = 0,
            totalItemsCount = 0;

        this.setState({
            loading: true
        });

        getSubcat(parentCatId).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                generalData = res.payload.data.results;
                next = res.payload.data.next;
                prev = res.payload.data.previous;
                totalPagesCount = res.payload.data.total_pages;
                totalItemsCount = res.payload.data.count;

                generalData.map((el, index) => {
                    el.is_product ? products.push(el) : categories.push(el);
                });

                this.setState({
                    items: [categories, products],
                    totalItemsCount: totalItemsCount,
                    totalPagesCount: totalPagesCount,
                    next: next,
                    prev: prev,
                    activePage: 1
                });
                this.endLoading();
            } else {
                this.setState({
                    items: [[], []],
                    totalItemsCount: 0,
                    totalPagesCount: 0,
                    next: false,
                    prev: false,
                    activePage: 1
                });
                this.endLoading();
            }
        });
    };

    addNewItem = (type) => {
        this.setState({
            newItemType: type
        });
        switch (type){
            case 'cat' :
                this.toggleAddDialog();
                break;
            case 'prod' :
                this.getCategoriesProducts();
                this.toggleAddProductDialog();
                break;
            default:
                this.toggleAddDialog();
        }
    };

    addClick = ( qty ) => {
        const type = this.state.newItemType;

        switch (type) {
            case 'cat':
                this.addNewCat();
                break;
            case 'sub':
                this.addNewCat(this.state.parentCatId);
                break;
            case 'prod':
                this.addNewProd(qty);
                break;
            default:
                console.log( "Такое создать нельзя", type );
        }
    };

    addNewCat = (id) => {
        let { newCategoryName, parentCatId } = this.state,
            data = {
                name: newCategoryName
            },
            { history: { location: { pathname } } } = this.props,
            { items } = this.state,
            lastSlug = pathname.split('/')[pathname.split('/').length - 1];


        const { addCat } = this.props;

        if(id !== undefined) data.subcategory_id = id;
        addCat(data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 201) {

                this.getCurrentCat(res.payload.data.id);
                this.redirect(res.payload.data.id);

                this.endLoading();
                this.toggleAddDialog();
            }else {
                if(res.error.response.data.name && res.error.response.data.price) {
                    this.setState({
                        nameError: true,
                        priceError: true,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: res.error.response.data.price
                    })
                }else if(res.error.response.data.name) {
                    this.setState({
                        nameError: true,
                        priceError: false,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: ''
                    })
                }else if(res.error.response.data.price) {
                    this.setState({
                        nameError: false,
                        priceError: true,
                        nameErrorText: '',
                        priceErrorText: res.error.response.data.price
                    })
                }
            }
        });
    };

    addNewProd = ( qty ) => {
        const { addProduct, history: { location: { pathname } } } = this.props;
        const { newCategoryName, newProductPrice, parentCatId, totalPagesCount, quantity, newProdName } = this.state;
        let data = {
                price: +newProductPrice,
                subcategory_id: parentCatId
            },
            items = this.state.items,
            lastSlug = pathname.split('/')[pathname.split('/').length - 1];

        if (qty) {
            data.name = newProdName;
            data.quantity = quantity;
        } else {
            data.name = newCategoryName;
        }

        addProduct(data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 201) {
                if(items[0].length + items[1].length < 10){
                    items[1].push(res.payload.data);
                    this.setState({
                        items: items,
                        openDeleteDialog: false,
                        openEditDialog: false,
                        openAddDialog: false,
                        openAddStockDialog: false,
                        openAddProductDialog: false,
                        openAddStockCustomDialog: false,
                        quantity: '',
                        autoSup: false,
                        supply_quantity: '',
                        min_supply_quantity: '',
                        newProductPrice: '',
                        currentItemPrice: '',
                        quantityError: false,
                        quantityErrorText: '',
                    });
                }else{
                    this.getCurrentCat(lastSlug);
                    this.changePage(false, totalPagesCount);
                }
                this.endLoading();
            }else {
                if(res.error.response.data.name && res.error.response.data.price) {
                    this.setState({
                        nameError: true,
                        priceError: true,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: res.error.response.data.price,
                        quantityError: false,
                        quantityErrorText: '',
                    })
                }else if(res.error.response.data.name) {
                    this.setState({
                        nameError: true,
                        priceError: false,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: '',
                        quantityError: false,
                        quantityErrorText: '',
                    })
                }else if(res.error.response.data.price) {
                    this.setState({
                        nameError: false,
                        priceError: true,
                        nameErrorText: '',
                        priceErrorText: res.error.response.data.price,
                        quantityError: false,
                        quantityErrorText: '',
                    })
                }else if(res.error.response.data.quantity) {
                    this.setState({
                        quantityError: true,
                        quantityErrorText: res.error.response.data.quantity,
                        nameError: false,
                        priceError: false,
                        nameErrorText: '',
                        priceErrorText: ''
                    })
                }
            }
        });
    };

    editItem = (type, targetId, currentItemName, currentItemPrice) => {
        this.setState({
            newItemType: type,
            targetId: targetId,
            currentItemName: currentItemName,
            currentItemPrice: currentItemPrice,
            newProductPrice: currentItemPrice,
            newCategoryName: currentItemName
        });
        this.toggleEditDialog();
    };

    editClick = () => {
        const type = this.state.newItemType;

        switch (type) {
            case 'cat':
                this.editCat();
                break;
            case 'sub':
                this.editCat();
                break;
            case 'prod':
                this.editProd();
                break;
            default:
                console.log( "Такое изменить нельзя", type );
        }
    };

    editCat = () => {
        let { newCategoryName, targetId, parentCatId } = this.state,
            data = {
                name: newCategoryName
            },
            { history: { location: { pathname } } } = this.props,
            { items } = this.state,
            lastSlug = pathname.split('/')[pathname.split('/').length - 1];


        const { editCat } = this.props;

        if(this.state.newItemType === 'sub') data.subcategory_id = parentCatId;
        editCat(targetId, data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {

                if(lastSlug === 'catalog') {
                    this.getCategories();
                }else{
                    this.getCurrentCat(parentCatId);
                    this.getSubcat(parentCatId);
                }

                this.endLoading();
                this.toggleEditDialog();
            }else {
                if(res.error.response.data.name && res.error.response.data.price) {
                    this.setState({
                        nameError: true,
                        priceError: true,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: res.error.response.data.price
                    })
                }else if(res.error.response.data.name) {
                    this.setState({
                        nameError: true,
                        priceError: false,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: ''
                    })
                }else if(res.error.response.data.price) {
                    this.setState({
                        nameError: false,
                        priceError: true,
                        nameErrorText: '',
                        priceErrorText: res.error.response.data.price
                    })
                }
            }
        });
    };

    editProd = () => {
        let { newCategoryName, newProductPrice, targetId, parentCatId } = this.state,
            data = {
                name: newCategoryName,
                price: newProductPrice,
                subcategory_id: parentCatId
            },
            { history: { location: { pathname } } } = this.props;
        const { editProd } = this.props;

        console.log(data);
        editProd(targetId, data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.getCurrentCat(parentCatId);
                this.getSubcat(parentCatId);

                this.endLoading();
                this.toggleEditDialog();
            }else {
                if(res.error.response.data.name && res.error.response.data.price) {
                    this.setState({
                        nameError: true,
                        priceError: true,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: res.error.response.data.price
                    })
                }else if(res.error.response.data.name) {
                    this.setState({
                        nameError: true,
                        priceError: false,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: ''
                    })
                }else if(res.error.response.data.price) {
                    this.setState({
                        nameError: false,
                        priceError: true,
                        nameErrorText: '',
                        priceErrorText: res.error.response.data.price
                    })
                }
            }
        });
    };

    deleteItem = (type, targetId, currentItemName) => {
        this.setState({
            newItemType: type,
            targetId: targetId,
            currentItemName: currentItemName
        });
        this.toggleDeleteDialog();
    };

    deleteClick = () => {
        const type = this.state.newItemType;

        switch (type) {
            case 'cat':
                this.deleteCat();
                break;
            case 'sub':
                this.deleteCat();
                break;
            case 'prod':
                this.deleteProd();
                break;
            default:
        }
    };

    deleteProd = () => {
        let { targetId, parentCatId } = this.state,
            { history: { location: { pathname } } } = this.props;
        const { deleteProd } = this.props;

        deleteProd(targetId).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.getCurrentCat(parentCatId);
                this.getSubcat(parentCatId);

                this.endLoading();
                this.toggleDeleteDialog();
            }
        });
    };

    deleteCat = () => {
        let { targetId, parentCatId } = this.state,
            { history: { location: { pathname } } } = this.props,
            lastSlug = pathname.split('/')[pathname.split('/').length - 1];
        const { deleteCat } = this.props;

        deleteCat(targetId).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                if(lastSlug === 'catalog') {
                    this.getCategories();
                }else{
                    this.getCurrentCat(parentCatId);
                    this.getSubcat(parentCatId);
                }

                this.endLoading();
                this.toggleDeleteDialog();
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

    checkStocks = id => {
        const { checkStocks } = this.props;

        this.setState({
            targetId: id,
        });

        checkStocks(id).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    quantity: res.payload.data.quantity,
                    autoSup: res.payload.data.auto_supply,
                    supply_quantity: res.payload.data.supply_quantity,
                    min_supply_quantity: res.payload.data.min_supply_quantity,
                    newStock: false,
                    inventoryId: res.payload.data.inventory_id
                });
                this.toggleStockDialog();
            }else if(res.error.response.status === 404) {
                this.setState({
                    inventoryId: false,
                    supply_quantity: false,
                    min_supply_quantity: false,
                    quantity: false,
                    autoSup: false,
                    newStock: true
                });
                this.toggleStockDialog();
            }
        });
    };

    newQuantity = (e) => {
        this.setState({
            quantity: e.target.value
        });
    };

    newSupplyQuantity = (e) => {
        this.setState({
            supply_quantity: e.target.value
        });
    };

    newMinSupplyQuantity = (e) => {
        this.setState({
            min_supply_quantity: e.target.value
        });
    };

    addToStock = () => {
        const { targetId, quantity, autoSup, supply_quantity, min_supply_quantity, newStock, inventoryId } = this.state;
        const {createInventory, patchInventory} = this.props;

        let data = {
            auto_supply: autoSup,
        };
        if(quantity) data.quantity = +quantity;
        if(supply_quantity) data.supply_quantity = +supply_quantity;
        if(min_supply_quantity) data.min_supply_quantity = +min_supply_quantity;


        if(newStock) {
            data.product_id = targetId;
            createInventory(data).then(res => {
                if (res.payload && res.payload.status && res.payload.status === 201) {
                    this.setState({
                        quantityError: false,
                        quantityErrorText: '',
                        supplyQuantityError: false,
                        supplyQuantityErrorText: '',
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: '',
                    });
                    this.toggleStockDialog();
                } else if(res.error.response.data.quantity) {
                    this.setState({
                        quantityError: true,
                        quantityErrorText: res.error.response.data.quantity,
                        supplyQuantityError: false,
                        supplyQuantityErrorText: '',
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: '',
                    })
                }else if(res.error.response.data.supply_quantity) {
                    this.setState({
                        supplyQuantityError: true,
                        supplyQuantityErrorText: res.error.response.data.supply_quantity,
                        quantityError: false,
                        quantityErrorText: '',
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: '',
                    })
                }else if(res.error.response.data.min_supply_quantity) {
                    this.setState({
                        minSupplyQuantityError: true,
                        minSupplyQuantityErrorText: res.error.response.data.min_supply_quantity,
                        quantityError: false,
                        quantityErrorText: '',
                        supplyQuantityError: false,
                        supplyQuantityErrorText: '',
                    })
                }
            });
        }else {
            patchInventory(inventoryId, data).then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    this.setState({
                        quantityError: false,
                        quantityErrorText: '',
                        supplyQuantityError: false,
                        supplyQuantityErrorText: '',
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: '',
                    });
                    this.toggleStockDialog();
                }else if(res.error.response.data.quantity) {
                    this.setState({
                        quantityError: true,
                        quantityErrorText: res.error.response.data.quantity,
                        supplyQuantityError: false,
                        supplyQuantityErrorText: '',
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: '',
                    })
                }else if(res.error.response.data.supply_quantity) {
                    this.setState({
                        supplyQuantityError: true,
                        supplyQuantityErrorText: res.error.response.data.supply_quantity,
                        quantityError: false,
                        quantityErrorText: '',
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: '',
                    })
                }else if(res.error.response.data.min_supply_quantity) {
                    this.setState({
                        minSupplyQuantityError: true,
                        minSupplyQuantityErrorText: res.error.response.data.min_supply_quantity,
                        quantityError: false,
                        quantityErrorText: '',
                        supplyQuantityError: false,
                        supplyQuantityErrorText: '',
                    })
                }
            });
        }
    };

    moveToSubcategory = (parentCatId, currentCatName) => {
        this.setState(({prevCatId, prevCatName}) => ({
            prevCatId: [...prevCatId, parentCatId],
            prevCatName: [...prevCatName, currentCatName],
            currentCatName: currentCatName,
            parentCatId: parentCatId,
            items: []
        }));

        this.redirect(parentCatId);
    };

    moveBackFromSubcategory = () => {
        const {prevCatId, prevCatName} = this.state;
        prevCatId.pop();
        prevCatName.pop();

        this.setState({
            prevCatId: prevCatId,
            prevCatName: prevCatName,
            currentCatName: prevCatName[prevCatName.length - 1],
            parentCatId: prevCatId[prevCatId.length - 1]
        });

        this.redirect(prevCatId[prevCatId.length - 1]);
    };

    redirect = id => {
        const { history } = this.props;



        history.push(`/main/catalog/category/${id}`);
        this.getSubcat(id);
    };

    getCurrentCat = (id) => {
        const { getCurrentCat } = this.props;

        getCurrentCat(id).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.setState(({prevCatId, prevCatName}) => ({
                    prevCatId: [...prevCatId, res.payload.data.id],
                    prevCatName: [...prevCatName, res.payload.data.name],
                    currentCatName: res.payload.data.name,
                    parentCatId: res.payload.data.id,
                    noCategoryExist: false
                }));
            } else {
                console.log(res);
                this.setState(({prevCatId, prevCatName}) => ({
                    prevCatId: [],
                    prevCatName: [],
                    currentCatName: res.error.response.data.id,
                    parentCatId: '',
                    noCategoryExist: true
                }));
            }
        });
    };

    changePage = (page, customPage) => {
        const { paginate } = this.props;

        let newPage = customPage ? customPage : page.selected + 1,
            { parentCatId } = this.state,
            generalData = [],
            categories = [],
            products = [],
            next = '',
            prev = '',
            totalPagesCount = 0,
            totalItemsCount = 0;

        paginate(newPage, parentCatId).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                generalData = res.payload.data.results;
                next = res.payload.data.next;
                prev = res.payload.data.previous;
                totalPagesCount = res.payload.data.total_pages;
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
                    prev: prev
                });
                this.endLoading();
            }
        });
    };

    endLoading = () => {
        this.setState({
            loading: false,
            nameError: false,
            priceError: false,
            nameErrorText: '',
            priceErrorText: ''
        });
    };

    render(){
        const { openDeleteDialog,
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
            categoryProducts,
            newProdName,
            filteredProds,
            newStock,
            quantityError,
            quantityErrorText,
            supplyQuantityError,
            supplyQuantityErrorText,
            minSupplyQuantityError,
            minSupplyQuantityErrorText,
            noCategoryExist
        } = this.state;
        const {  history: { location: { pathname } } } = this.props;
        let lastSlug = pathname.split('/')[pathname.split('/').length - 1];

        console.log(items);
        return (
            <div className="catalog_page content_block">

                <div className="custom_title_wrapper">
                    {pathname !== '/main/catalog'
                        ?
                        prevCatName.length > 1 ?
                            <Fragment>
                                <Link to="#" onClick={this.moveBackFromSubcategory}><img src={Path} alt="Path"/>{prevCatName[prevCatName.length - 2]}</Link>
                                <div className="title_page">{prevCatName[prevCatName.length - 1]}</div>
                            </Fragment>
                            :
                            <Fragment>
                                <Link to="/main/catalog" onClick={this.getCategories}><img src={Path} alt="Path"/>Products and categories</Link>
                                <div className="title_page">{currentCatName}</div>
                            </Fragment>
                        :
                        <div className="title_page">Products and categories</div>
                    }

                </div>

                <div className="content_page">

                    {loading
                        ?
                        <Loader />
                        :
                        <div className={`catalog_table ${pathname === '/main/catalog' ? 'catalog' : ''}`}>
                            <div className="table_panel">
                                {noCategoryExist ? null :
                                    <Fragment>
                                        {
                                            pathname === '/main/catalog' ?

                                                <Fragment>
                                                    {<button onClick={() => this.addNewItem('cat')}>+ add category</button>}
                                                    {null}
                                                </Fragment>
                                                :
                                                <Fragment>
                                                    <button onClick={() => this.addNewItem('sub')}>+ add subcategory</button>
                                                    <button onClick={() => this.addNewItem('prod')}>+ add product</button>
                                                </Fragment>
                                        }
                                    </Fragment>
                                }
                            </div>
                            {(totalItemsCount === 0) && (items[0].length + items[1].length < 1)
                                ?
                                <h3 className={'empty_list'}>The list is empty</h3>
                                :
                                <div className="table_container transactions_columns">
                                    <div className="table_header">
                                        <div className="table_row">
                                            <div className="row_item">Name</div>
                                            <div className="row_item">Code</div>
                                            <div className="row_item">Unit value</div>
                                            <div className="row_item">Actions</div>
                                        </div>
                                    </div>
                                    <div className="table_body">
                                        {
                                            items.map((elem, id) => (
                                                elem.map((el, index) => (
                                                    <div className="table_row" key={index}>
                                                        <div className="row_item">
                                                            {el.is_product || el.price ?
                                                                <div>{el.name}</div>
                                                                :
                                                                <Link to='#' onClick={() => this.moveToSubcategory(el.id, el.name)}>{el.name}</Link>
                                                            }
                                                        </div>
                                                        <div className="row_item">{el.code ? '#' + el.code : '-'}</div>
                                                        <div className="row_item">{el.unit_value || el.price ? 'RWF' + (el.unit_value || el.price) : '-'}</div>
                                                        <div className="row_item ">

                                                            {el.code
                                                                ?
                                                                el.name === newProdName || el.is_product ?
                                                                    <button className="green_text"onClick={() => this.checkStocks(el.id)}>Add to stock</button>
                                                                    :
                                                                    '-'
                                                                :
                                                                <Fragment>
                                                                    <button className="blue_text"
                                                                            onClick={() => this.editItem(`${lastSlug === 'catalog' ? 'cat' : el.unit_value || el.price ? 'prod' : 'sub'}`, el.id, el.name, el.price || el.unit_value ? el.price || el.unit_value : '')}>Edit</button>
                                                                    < button className="red_text" onClick={() => this.deleteItem(`${lastSlug === 'catalog' ? 'cat' : el.unit_value || el.price ? 'prod' : 'sub'}`, el.id, el.name)}>Delete</button>
                                                                </Fragment>
                                                            }
                                                        </div>
                                                    </div>
                                                ))
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                            {totalItemsCount < 10 ?
                                null
                                :
                                <div className="pagination_info_wrapper">
                                    <div className="pagination_block">
                                        <Pagination
                                            active={activePage - 1}
                                            pageCount={totalPagesCount}
                                            onChange={this.changePage}
                                        />
                                    </div>
                                    <div className="info">Displaying page {activePage} of {totalPagesCount},
                                        items {activePage * 10 - 9} to {activePage * 10 > totalItemsCount ? totalItemsCount : activePage * 10} of {totalItemsCount}</div>
                                </div>
                            }
                        </div>
                    }
                </div>

                <DialogComponent
                    open={openDeleteDialog}
                    onClose={() => this.toggleDeleteDialog(this.state.productId, this.state.isProduct, categoryId)}
                >
                    <div className="delete_dialog">
                        <div className="title">
                            {
                                newItemType === 'cat'
                                    ?
                                    <span>Delete category</span>
                                    :
                                    newItemType === 'prod' ?
                                        <span>Delete product</span>
                                        :
                                        newItemType === 'sub' ?
                                            <span>Delete subcategory</span>
                                            :
                                            null
                            }
                        </div>
                        <div className="descriptions">
                            {
                                newItemType === 'cat'
                                    ?
                                    <span>You are about to delete <span>{currentItemName}</span> from the catalog. All subcategories and products of this category will also be deleted. Are you sure?</span>
                                    :
                                    newItemType === 'prod' ?
                                        <span>You are about to delete <span>{currentItemName}</span> from the catalog. <br/>Are you sure?</span>
                                        :
                                        newItemType === 'sub' ?
                                            <span>You are about to delete <span>{currentItemName}</span> from the catalog. All subcategories and products of this subcategory will also be deleted. Are you sure?</span>
                                            :
                                            null
                            }
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleDeleteDialog}>Cancel</button>
                            <button className="red_btn" onClick={this.deleteClick}>delete</button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent
                    open={openAddStockDialog}
                    onClose={this.toggleStockDialog}
                >
                    <div className="stock_dialog">
                        <div className="title">
                            <span>Add product</span>
                        </div>
                        {newStock ? null :
                            <div className="help_block">
                                <span>This product is already in stock, you can edit it below.</span>
                            </div>
                        }
                        <div className="stock_wrapper">
                            <div className="first_block">
                                <div className="block_field row">
                                    <span>Available qty</span>
                                </div>
                                <input type="number" onChange={this.newQuantity} value={quantity} placeholder="Type here..."/>
                                <div className="block_field error_block row">
                                    <span className={quantityError ? 'visible' : ''}>{quantityErrorText}</span>
                                </div>
                            </div>
                            <div>
                                <span>Auto supply</span>
                                <div className="supply_btn">
                                    <button onClick={this.autoSupOff} className={autoSup ? "red" : "red active"}><img src={off} alt="off"/></button>
                                    <button onClick={this.autoSupOn} className={autoSup ? "green active" : "green"}><img src={on} alt="on"/></button>
                                </div>
                            </div>
                            <div className={autoSup ? "" : "disabled"}>
                                <div className="block_field row">
                                    <span>Min. qty</span>
                                </div>
                                <input type="number" onChange={this.newMinSupplyQuantity} value={min_supply_quantity} placeholder="Type here..."/>
                                <div className="block_field error_block row">
                                    <span className={minSupplyQuantityError ? 'visible' : ''}>{minSupplyQuantityErrorText}</span>
                                </div>
                            </div>
                            <div className={autoSup ? "" : "disabled"}>
                                <div className="block_field row">
                                    <span>Auto supply qty</span>
                                </div>
                                <input type="number" onChange={this.newSupplyQuantity} value={supply_quantity} placeholder="Type here..."/>
                                <div className="block_field error_block row">
                                    <span className={supplyQuantityError ? 'visible' : ''}>{supplyQuantityErrorText}</span>
                                </div>
                            </div>
                        </div>

                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleStockDialog}>Cancel</button>
                            <button className="blue_btn" onClick={this.addToStock}>add</button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent
                    open={openAddStockCustomDialog}
                    onClose={this.toggleStockCustomDialog}
                >
                    <div className="stock_dialog">
                        <div className="title">
                            <span>Add product</span>
                        </div>
                        <div className="stock_wrapper">
                            <div className="first_block">
                                <div className="block_field row">
                                    <span>Available qty</span>
                                </div>
                                <input type="number" onChange={this.newQuantity} value={quantity} placeholder="Type here..."/>
                            </div>
                            <div>
                                <div className="block_field row">
                                    <span>Price</span>
                                </div>
                                <input type="number" onChange={this.newProductPrice} value={currentItemPrice} placeholder="Type here..."/>
                            </div>
                        </div>
                        <div className="block_field error_block row">
                            <span className={priceError ? 'visible' : ''}>{priceErrorText}</span>
                            <span className={quantityError ? 'visible' : ''}>{quantityErrorText}</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleStockCustomDialog}>Cancel</button>
                            <button className="blue_btn" onClick={() => this.addClick(true)}>add</button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent
                    open={openEditDialog}
                    onClose={() => this.toggleEditDialog(this.state.productId, this.state.isProduct, categoryId)}
                >
                    <div className="edit_dialog">
                        <div className="title">
                            {
                                newItemType === 'cat'
                                    ?
                                    <span>Edit category</span>
                                    :
                                    newItemType === 'prod' ?
                                        <span>Edit product</span>
                                        :
                                        newItemType === 'sub' ?
                                            <span>Edit subcategory</span>
                                            :
                                            null
                            }
                        </div>
                        <div className={`block_edit_field${newItemType === 'prod' ? '' : ' category'}`}>
                            <div>
                                <div className="block_field row">
                                    <span>Name</span>
                                </div>
                                <input onChange={this.newCategoryName} value={currentItemName} type="text"/>
                            </div>
                            {
                                newItemType === 'prod' ?
                                    <div>
                                        <div className="block_field row">
                                            <span>Unit value</span>
                                        </div>
                                        <input onChange={this.newProductPrice} value={currentItemPrice} type="number"  placeholder="Type here..."/>
                                        <p>RWF</p>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        <div className="block_field error_block row">
                            <span className={priceError ? 'visible' : ''}>{priceErrorText}</span>
                            <span className={nameError ? 'visible' : ''}>{nameErrorText}</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleEditDialog}>Cancel</button>
                            <button className="blue_btn" onClick={this.editClick}>Save</button>
                        </div>
                    </div>
                </DialogComponent>

                <DialogComponent
                    open={openAddDialog}
                    onClose={() => this.toggleAddDialog(categoryId, true)}
                >
                    <div className="add_dialog">
                        <div className="title">
                            {
                                newItemType === 'cat'
                                    ?
                                    <span>Add category</span>
                                    :
                                    newItemType === 'prod' ?
                                        <span>Add product</span>
                                        :
                                        newItemType === 'sub' ?
                                            <span>Add subcategory</span>
                                            :
                                            null
                            }
                        </div>
                        <div className="block_add_field">
                            <div>
                                <div className="block_field row">
                                    <span>Name</span>
                                </div>
                                <input onChange={this.newCategoryName} type="text" placeholder="Type here..."/>
                            </div>
                            {
                                newItemType === 'prod' ?
                                    <div>
                                        <div className="block_field row">
                                            <span>Unit value</span>
                                        </div>
                                        <input onChange={this.newProductPrice} type="number"  placeholder="Type here..."/>
                                        <p>RWF</p>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        <div className="block_field error_block row">
                            <span className={priceError ? 'visible' : ''}>{priceErrorText}</span>
                            <span className={nameError ? 'visible' : ''}>{nameErrorText}</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleAddDialog}>Cancel</button>
                            <button className="blue_btn" onClick={() => this.addClick(false)}>Add</button>
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
                            <span>Type a product name and select one of the options <br/>or create a new product.</span>
                        </div>
                        <div className="block_field row">
                            <span></span>
                        </div>
                        <div className="block_search">
                            <input onChange={this.onTypeAction} type="text" placeholder="Search…"/>
                            {
                                filteredProds.length > 0 && newProdName.length > 2 ?
                                    <div className="autocomplete">
                                        {nameError ? null :
                                            <button className="new" onClick={this.toggleStockCustomDialog}>{newProdName}<span>+ add new</span></button>
                                        }
                                        {
                                            filteredProds.map((prod, key) =>
                                                (
                                                    <button id={prod.id} key={key} onClick={() => this.checkStocks(prod.id)}>{prod.name}</button>
                                                )
                                            )
                                        }
                                    </div>
                                    :
                                    null
                            }
                        </div>
                        <div className="block_field error_block row">
                            <span className={nameError ? 'visible' : ''}>{nameErrorText}</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleAddProductDialog}>Cancel</button>
                            <button className="blue_btn" disabled={nameError || (newProdName.length < 3)} onClick={this.toggleStockCustomDialog}>Next</button>
                        </div>
                    </div>
                </DialogComponent>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return{

    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
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
        checkStocks,
        createInventory,
        patchInventory,
        getProdsForStocks
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);

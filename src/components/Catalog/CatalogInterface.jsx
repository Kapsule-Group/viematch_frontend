import { Component } from "react";

class CatalogInterface extends Component {
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
                        totalItems: res.payload.data.count
                    });
                } else {
                    this.setState({
                        loading: false,
                        totalPages: res.payload.data.total_pages,
                        totalItems: res.payload.data.count,
                        activePage: page ? page : 0
                    });
                }

                this.endLoading();
            }
        });
    };

    changeWidth = e => {
        console.log(e);
        this.setState({
            selectType: e.target.value,
            option: e.target.value,
            selectWidth: 8 * e.target.value.length + 31
        });
    };

    changeSearchType = e => {
        console.log(e);
        this.setState({
            selectType: e.target.value,
            option: e.target.value
        });
    };

    toggleDeleteDialog = (id = null) => {
        this.setState(({ openDeleteDialog }) => ({
            openDeleteDialog: !openDeleteDialog
        }));
    };

    toggleEditDialog = (id = null) => {
        this.setState(
            ({
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
                nameErrorText: openEditDialog ? "" : nameErrorText,
                priceErrorText: openEditDialog ? "" : priceErrorText,
                quantityError: openEditDialog ? !quantityError : quantityError,
                supplyQuantityError: openEditDialog ? !supplyQuantityError : supplyQuantityError,
                minSupplyQuantityError: openEditDialog ? !minSupplyQuantityError : minSupplyQuantityError,
                quantityErrorText: openEditDialog ? "" : quantityErrorText,
                supplyQuantityErrorText: openEditDialog ? "" : supplyQuantityErrorText,
                minSupplyQuantityErrorText: openEditDialog ? "" : minSupplyQuantityErrorText
            })
        );
    };

    toggleAddDialog = (id = null) => {
        this.setState(
            ({
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
                nameErrorText: openAddDialog ? "" : nameErrorText,
                priceErrorText: openAddDialog ? "" : priceErrorText,
                quantityError: openAddDialog ? !quantityError : quantityError,
                supplyQuantityError: openAddDialog ? !supplyQuantityError : supplyQuantityError,
                minSupplyQuantityError: openAddDialog ? !minSupplyQuantityError : minSupplyQuantityError,
                quantityErrorText: openAddDialog ? "" : quantityErrorText,
                supplyQuantityErrorText: openAddDialog ? "" : supplyQuantityErrorText,
                minSupplyQuantityErrorText: openAddDialog ? "" : minSupplyQuantityErrorText
            })
        );
    };

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
                minSupplyQuantityErrorText: openAddStockDialog ? "" : minSupplyQuantityErrorText
            })
        );
    };

    toggleStockCustomDialog = (id = null) => {
        this.setState(
            ({
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
                quantity: "",
                currentItemPrice: "",
                nameError: openAddStockCustomDialog ? !nameError : nameError,
                priceError: openAddStockCustomDialog ? !priceError : priceError,
                nameErrorText: openAddStockCustomDialog ? "" : nameErrorText,
                priceErrorText: openAddStockCustomDialog ? "" : priceErrorText,
                quantityError: openAddStockCustomDialog ? !quantityError : quantityError,
                supplyQuantityError: openAddStockCustomDialog ? !supplyQuantityError : supplyQuantityError,
                minSupplyQuantityError: openAddStockCustomDialog ? !minSupplyQuantityError : minSupplyQuantityError,
                quantityErrorText: openAddStockCustomDialog ? "" : quantityErrorText,
                supplyQuantityErrorText: openAddStockCustomDialog ? "" : supplyQuantityErrorText,
                minSupplyQuantityErrorText: openAddStockCustomDialog ? "" : minSupplyQuantityErrorText
            })
        );
    };

    toggleAddProductDialog = (id = null) => {
        this.setState(
            ({
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
                nameErrorText: openAddProductDialog ? "" : nameErrorText,
                priceErrorText: openAddProductDialog ? "" : priceErrorText,
                quantityError: openAddProductDialog ? !quantityError : quantityError,
                supplyQuantityError: openAddProductDialog ? !supplyQuantityError : supplyQuantityError,
                minSupplyQuantityError: openAddProductDialog ? !minSupplyQuantityError : minSupplyQuantityError,
                quantityErrorText: openAddProductDialog ? "" : quantityErrorText,
                supplyQuantityErrorText: openAddProductDialog ? "" : supplyQuantityErrorText,
                minSupplyQuantityErrorText: openAddProductDialog ? "" : minSupplyQuantityErrorText
            })
        );
    };

    onTypeAction = e => {
        const { categoryProducts } = this.state;
        let newArr = [];

        for (let i = 0; i < categoryProducts.length; i++) {
            if (e.target.value.length < 1) {
                newArr = [];
            } else if (categoryProducts[i].name.toLowerCase().includes(e.target.value.toLowerCase())) {
                newArr.push(categoryProducts[i]);
            }
            if (categoryProducts[i].name.toLowerCase() === e.target.value.toLowerCase()) {
                //console.log(categoryProducts[i], 'ошибка');
                this.setState({
                    nameError: true,
                    nameErrorText: "Product with the same name already exists in this category/subcategory."
                });
                break;
            } else {
                //console.log('нет ошибки');
                this.setState({
                    nameError: false,
                    nameErrorText: ""
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

    newCategoryName = e => {
        this.setState({
            newCategoryName: e.target.value,
            currentItemName: e.target.value
        });
    };

    newProductPrice = e => {
        this.setState({
            newProductPrice: e.target.value,
            currentItemPrice: e.target.value
        });
    };

    getCategoriesProducts = () => {
        const { getProdsForStocks } = this.props;

        getProdsForStocks().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    categoryProducts: res.payload.data
                });
            }
        });
    };

    getCategories = loading => {
        const { getCat } = this.props;
        let generalData = [],
            categories = [],
            products = [],
            next = "",
            prev = "",
            totalPagesCount = 0,
            totalItemsCount = 0;

        loading &&
            this.setState({
                loading: true
            });

        getCat().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                generalData = res.payload.data.results;
                next = res.payload.data.next;
                prev = res.payload.data.previous;
                totalPagesCount = res.payload.data.total_pages;
                totalItemsCount = res.payload.data.count;
                generalData.map((el, index) => {
                    el.is_product ? products.push(el) : categories.push(el);
                    return el;
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
                    currentCatName: false
                });
                this.endLoading();
            }
        });
    };

    getSubcat = parentCatId => {
        const { getSubcat } = this.props;
        let generalData = [],
            categories = [],
            products = [],
            next = "",
            prev = "",
            totalPagesCount = 0,
            totalItemsCount = 0;

        this.setState({
            loading: true
        });

        getSubcat(parentCatId).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                generalData = res.payload.data.results;
                next = res.payload.data.next;
                prev = res.payload.data.previous;
                totalPagesCount = res.payload.data.total_pages;
                totalItemsCount = res.payload.data.count;

                generalData.map((el, index) => {
                    el.is_product ? products.push(el) : categories.push(el);
                    return el;
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

    addNewItem = type => {
        this.setState({
            newItemType: type
        });
        switch (type) {
            case "cat":
                this.toggleAddDialog();
                break;
            case "prod":
                this.getCategoriesProducts();
                this.toggleAddProductDialog();
                break;
            default:
                this.toggleAddDialog();
        }
    };

    addClick = qty => {
        const type = this.state.newItemType;

        switch (type) {
            case "cat":
                this.addNewCat();
                break;
            case "sub":
                this.addNewCat(this.state.parentCatId);
                break;
            case "prod":
                this.addNewProd(qty);
                break;
            default:
                console.log("Такое создать нельзя", type);
        }
    };

    addNewCat = id => {
        let { newCategoryName /*parentCatId*/ } = this.state,
            data = {
                name: newCategoryName
            };
        //{ history: { location: { pathname } } } = this.props
        //{ items } = this.state,
        //lastSlug = pathname.split('/')[pathname.split('/').length - 1];

        const { addCat } = this.props;

        if (id !== undefined) data.subcategory_id = id;
        addCat(data).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 201) {
                this.getCurrentCat(res.payload.data.id);
                this.redirect(res.payload.data.id);

                this.endLoading();
                this.toggleAddDialog();
            } else {
                if (res.error.response.data.name && res.error.response.data.price) {
                    this.setState({
                        nameError: true,
                        priceError: true,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: res.error.response.data.price
                    });
                } else if (res.error.response.data.name) {
                    this.setState({
                        nameError: true,
                        priceError: false,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: ""
                    });
                } else if (res.error.response.data.price) {
                    this.setState({
                        nameError: false,
                        priceError: true,
                        nameErrorText: "",
                        priceErrorText: res.error.response.data.price
                    });
                }
            }
        });
    };

    addNewProd = qty => {
        const {
            addProduct,
            history: {
                location: { pathname }
            }
        } = this.props;
        const { newCategoryName, newProductPrice, parentCatId, totalPagesCount, quantity, newProdName } = this.state;
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
        let { newCategoryName, targetId, parentCatId } = this.state,
            data = {
                name: newCategoryName
            },
            {
                history: {
                    location: { pathname }
                }
            } = this.props,
            //{ items } = this.state,
            lastSlug = pathname.split("/")[pathname.split("/").length - 1];

        const { editCat } = this.props;

        if (this.state.newItemType === "sub") data.subcategory_id = parentCatId;
        editCat(targetId, data).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                if (lastSlug === "catalog") {
                    this.getCategories();
                } else {
                    this.getCurrentCat(parentCatId);
                    this.getSubcat(parentCatId);
                }

                this.endLoading();
                this.toggleEditDialog();
            } else {
                if (res.error.response.data.name && res.error.response.data.price) {
                    this.setState({
                        nameError: true,
                        priceError: true,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: res.error.response.data.price
                    });
                } else if (res.error.response.data.name) {
                    this.setState({
                        nameError: true,
                        priceError: false,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: ""
                    });
                } else if (res.error.response.data.price) {
                    this.setState({
                        nameError: false,
                        priceError: true,
                        nameErrorText: "",
                        priceErrorText: res.error.response.data.price
                    });
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
            };
        //{ history: { location: { pathname } } } = this.props;
        //const { editProd } = this.props;

        this.props.editProd(targetId, data).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.getCurrentCat(parentCatId);
                this.getSubcat(parentCatId);

                this.endLoading();
                this.toggleEditDialog();
            } else {
                if (res.error.response.data.name && res.error.response.data.price) {
                    this.setState({
                        nameError: true,
                        priceError: true,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: res.error.response.data.price
                    });
                } else if (res.error.response.data.name) {
                    this.setState({
                        nameError: true,
                        priceError: false,
                        nameErrorText: res.error.response.data.name,
                        priceErrorText: ""
                    });
                } else if (res.error.response.data.price) {
                    this.setState({
                        nameError: false,
                        priceError: true,
                        nameErrorText: "",
                        priceErrorText: res.error.response.data.price
                    });
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
        }
    };

    deleteProd = () => {
        let { targetId, parentCatId } = this.state;
        //{ history: { location: { pathname } } } = this.props;
        const { deleteProd } = this.props;

        deleteProd(targetId).then(res => {
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
                    location: { pathname }
                }
            } = this.props,
            lastSlug = pathname.split("/")[pathname.split("/").length - 1];
        const { deleteCat } = this.props;

        deleteCat(targetId).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                if (lastSlug === "catalog") {
                    this.getCategories();
                } else {
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
            targetId: id
        });

        checkStocks(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    quantity: res.payload.data.quantity,
                    autoSup: res.payload.data.auto_supply,
                    supply_quantity: res.payload.data.supply_quantity,
                    min_supply_quantity: res.payload.data.min_supply_quantity,
                    newStock: false,
                    inventoryId: res.payload.data.inventory_id
                });
                this.toggleStockDialog();
            } else if (res.error.response.status === 404) {
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

    newQuantity = e => {
        this.setState({
            quantity: e.target.value
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
        const { targetId, quantity, autoSup, supply_quantity, min_supply_quantity, newStock, inventoryId } = this.state;
        const { createInventory, patchInventory } = this.props;

        let data = {
            auto_supply: autoSup
        };
        if (quantity) data.quantity = +quantity;
        if (supply_quantity) data.supply_quantity = +supply_quantity;
        if (min_supply_quantity) data.min_supply_quantity = +min_supply_quantity;

        if (newStock) {
            data.product_id = targetId;
            createInventory(data).then(res => {
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
                } else if (res.error.response.data.quantity) {
                    this.setState({
                        quantityError: true,
                        quantityErrorText: res.error.response.data.quantity,
                        supplyQuantityError: false,
                        supplyQuantityErrorText: "",
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: ""
                    });
                } else if (res.error.response.data.supply_quantity) {
                    this.setState({
                        supplyQuantityError: true,
                        supplyQuantityErrorText: res.error.response.data.supply_quantity,
                        quantityError: false,
                        quantityErrorText: "",
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: ""
                    });
                } else if (res.error.response.data.min_supply_quantity) {
                    this.setState({
                        minSupplyQuantityError: true,
                        minSupplyQuantityErrorText: res.error.response.data.min_supply_quantity,
                        quantityError: false,
                        quantityErrorText: "",
                        supplyQuantityError: false,
                        supplyQuantityErrorText: ""
                    });
                }
            });
        } else {
            patchInventory(inventoryId, data).then(res => {
                if (res.payload && res.payload.status && res.payload.status === 200) {
                    this.setState({
                        quantityError: false,
                        quantityErrorText: "",
                        supplyQuantityError: false,
                        supplyQuantityErrorText: "",
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: ""
                    });
                    this.toggleStockDialog();
                } else if (res.error.response.data.quantity) {
                    this.setState({
                        quantityError: true,
                        quantityErrorText: res.error.response.data.quantity,
                        supplyQuantityError: false,
                        supplyQuantityErrorText: "",
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: ""
                    });
                } else if (res.error.response.data.supply_quantity) {
                    this.setState({
                        supplyQuantityError: true,
                        supplyQuantityErrorText: res.error.response.data.supply_quantity,
                        quantityError: false,
                        quantityErrorText: "",
                        minSupplyQuantityError: false,
                        minSupplyQuantityErrorText: ""
                    });
                } else if (res.error.response.data.min_supply_quantity) {
                    this.setState({
                        minSupplyQuantityError: true,
                        minSupplyQuantityErrorText: res.error.response.data.min_supply_quantity,
                        quantityError: false,
                        quantityErrorText: "",
                        supplyQuantityError: false,
                        supplyQuantityErrorText: ""
                    });
                }
            });
        }
    };

    moveToSubcategory = (parentCatId, currentCatName) => {
        const abortController = new AbortController();
        const { signal } = abortController;
        this.setState(({ prevCatId, prevCatName }) => ({
            prevCatId: [...prevCatId, parentCatId],
            prevCatName: [...prevCatName, currentCatName],
            currentCatName: currentCatName,
            parentCatId: parentCatId,
            items: []
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
            parentCatId: prevCatId[prevCatId.length - 1]
        });

        this.redirect(prevCatId[prevCatId.length - 1]);
    };

    redirect = id => {
        const { history } = this.props;

        history.push(`/main/catalog/category/${id}`);
        this.getSubcat(id);
    };

    getCurrentCat = id => {
        const { getCurrentCat } = this.props;

        getCurrentCat(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState(({ prevCatId, prevCatName }) => ({
                    prevCatId: [...prevCatId, res.payload.data.id],
                    prevCatName: [...prevCatName, res.payload.data.name],
                    currentCatName: res.payload.data.name,
                    parentCatId: res.payload.data.id,
                    noCategoryExist: false
                }));
            } else {
                this.setState(({ prevCatId, prevCatName }) => ({
                    prevCatId: [],
                    prevCatName: [],
                    currentCatName: res.error.response.data.id,
                    parentCatId: "",
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
            next = "",
            prev = "",
            totalPagesCount = 0,
            totalItemsCount = 0;

        paginate(newPage, parentCatId).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
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
            nameErrorText: "",
            priceErrorText: ""
        });
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
        //console.log(e);
        let regEx = /[^a-zA-Zа-яА-Я0-9\s]/g;
        /* this.setState({
            someVal: e.target.value.replace(regEx, ''),
            newVal: e.target.value.replace(regEx, ''),
        }); */
        this.setState({
            someVal: e.target.value,
            newVal: e.target.value
        });
    };

    handleSearchChange = e => {
        const { searchAllStock, search_list, getSearchListAll } = this.props;
        const { stock, option } = this.state;
        let inputValue = e.target.value.replace("#", "");

        if (inputValue.length >= 3) {
            switch (option.value) {
                case "products":
                    this.searchProducts();
                    break;
                // case "all":
                //     searchAllStock(stock, null, inputValue).then(res => {
                //         if (res.payload && res.payload.status && res.payload.status === 200) {
                //             this.togglePopper();
                //         }
                //     });
                //     break;
                case "categories":
                    this.searchCategories();
                    break;
                case "subcategories":
                    this.searchSubcat();
                    break;
                default:
                    break;
            }
        } else if (inputValue.length < 3) {
            // this.setState({ openSearch: false });
            // if (inputValue.length === 0) {
            //     this.doRequest();
            // }
            this.getCategories(false);
        }

        if (e.keyCode === 13 && inputValue.length > 2) {
            let el_id = search_list.map(el => el.id);
            getSearchListAll(el_id.join(",")).then(res => {
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

    submitSearch = () => {
        const { searchProducts } = this.props;
        searchProducts(this.state.selectType, this.state.newVal).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    items: [res.payload.data.results, []]
                });
            }
        });
    };

    handleSearchClick = id => {
        const { getSearchListAll } = this.props;
        getSearchListAll(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    totalPages: res.payload.data.total_pages,
                    totalItems: res.payload.data.count
                });
                this.handleToggleSearch();
            }
        });
    };

    handleSwitch = () => {
        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
        }, 0);
    };

    pagFunc = page => {
        this.doRequest(page);
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

    searchCategories = () => {
        const { searchNewCategories } = this.props;
        let generalData = [],
            categories = [],
            products = [],
            next = "",
            prev = "",
            totalPagesCount = 0,
            totalItemsCount = 0;

        // this.setState({
        //     loading: true
        // });

        searchNewCategories(this.state.someVal).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                generalData = res.payload.data.results;
                next = res.payload.data.next;
                prev = res.payload.data.previous;
                totalPagesCount = res.payload.data.total_pages;
                totalItemsCount = res.payload.data.count;
                generalData.map((el, index) => {
                    el.is_product ? products.push(el) : categories.push(el);
                    return el;
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
                    currentCatName: false
                });
                this.endLoading();
            }
        });
    };

    searchSubcat = () => {
        const { searchNewSubCategories } = this.props;
        let generalData = [],
            categories = [],
            products = [],
            next = "",
            prev = "",
            totalPagesCount = 0,
            totalItemsCount = 0;

        searchNewSubCategories(this.state.someVal).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                generalData = res.payload.data.results;
                next = res.payload.data.next;
                prev = res.payload.data.previous;
                totalPagesCount = res.payload.data.total_pages;
                totalItemsCount = res.payload.data.count;

                generalData.map((el, index) => {
                    el.is_product ? products.push(el) : categories.push(el);
                    return el;
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

    searchProducts = () => {
        const { searchNewProducts } = this.props;
        let generalData = [],
            next = "",
            prev = "",
            totalPagesCount = 0,
            totalItemsCount = 0;

        searchNewProducts(this.state.someVal).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                generalData = res.payload.data.results;
                next = res.payload.data.next;
                prev = res.payload.data.previous;
                totalPagesCount = res.payload.data.total_pages;
                totalItemsCount = res.payload.data.count;

                this.setState({
                    items: [[], generalData],
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
}

export default CatalogInterface;

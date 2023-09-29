import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CatalogCard from "../HelperComponents/CatalogCard/CatalogCard";
import Slider from "react-slick";
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
    searchNewProducts,
    getMainCatalog,
    getPromotionals
} from "../../actions/catalogActions";

import { getBanners } from "../../actions/UserActions";

import "./Catalog.scss";
import CatalogInterface from "./CatalogInterface";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PromotionalCard from "../HelperComponents/PromotionalCard/PromotionalCard";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";

class Catalog extends CatalogInterface {
    state = {};

    componentDidMount() {
        const {
            history: {
                location: { pathname }
            },
            getMainCatalog,
            getBanners,
            getPromotionals
        } = this.props;
        getBanners();
        getMainCatalog().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                getPromotionals();
            }
        });
    }

    render() {
        const {
            history: {
                location: { pathname }
            },
            stock_list,
            catalog,
            banners,
            cats,
            promotionals
        } = this.props;
        let lastSlug = pathname.split("/")[pathname.split("/").length - 1];
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000
        };
        return (
            <div className="catalog_page" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="slider-wrapper">
                    <Slider {...settings}>
                        {banners &&
                            banners.map(el => (
                                <a href={el.link} target="_blank" key={el.id} className="slider-el">
                                    <img src={el.image} />
                                </a>
                            ))}
                    </Slider>
                </div>

                <div className="catalog-wrapper">
                    {!cats || (cats.length < 1 && <Loader />)}
                    {cats && cats.length > 0 && (
                        <div className="cards-wrapper">
                            {cats &&
                                cats.map((el, idx) => {
                                    return el.promotional ? (
                                        <PromotionalCard idx={idx} {...el} />
                                    ) : (
                                        <CatalogCard
                                            idx={idx + 999}
                                            className="main-card"
                                            link="/main/catalog/category/"
                                            main={true}
                                            {...el}
                                        />
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        stock_list: state.stock.stock_list,
        search_list: state.stock.search_list,
        banners: state.users.banners,
        cats: state.catalog.cats,
        promotionals: state.catalog.promotionals
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
            searchNewProducts,
            getBanners,
            getMainCatalog,
            getPromotionals
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);

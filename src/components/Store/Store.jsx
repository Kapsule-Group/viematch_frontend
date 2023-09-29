import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Featured from "./Featured";
import { getSingleProd, getSlideProd, getTrendsProd, getFeaturedProd } from "../../actions/storeAction";

class Store extends Component {
    state = {
        singProd: [],
        slideProd: [],
        trendsPro: [],
        featuredProd: []
    };

    componentDidMount() {
        this.getSingleProd();
        this.fetchSlide();
        this.fetchTrends();
    }

    componentWillUnmount() {}

    removeCart = productId => {
        let cartProducts = JSON.parse(localStorage.getItem("products"));
        let products = cartProducts.filter(product => product.productId !== productId);
        localStorage.setItem("products", JSON.stringify(products));
    };

    getSingleProd = () => {
        const { getSingleProd } = this.props;

        getSingleProd().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    singProd: res.payload.data
                });
            }
        });
    };

    fetchSlide = () => {
        const { getSlideProd } = this.props;

        getSlideProd().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    slideProd: res.payload.data
                });
            }
        });
    };

    fetchTrends = () => {
        const { getTrendsProd } = this.props;
        getTrendsProd().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    trendsPro: res.payload.data
                });
            }
        });
    };

    featuredProduct = () => {
        const { getFeaturedProd } = this.props;
        getFeaturedProd().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    featuredProd: res.payload.data
                });
            }
        });
    };

    render() {
        const role = localStorage.role;
        let { featuredProd, trendsPro } = this.state;
        let data = trendsPro;

        return (
            <div className="super_container">
                {/* Header */}
                <Navbar />
                {this.state.singProd.map((key, index) => (
                    <div key={index} className="banner">
                        <div
                            className="banner_background"
                            style={{ backgroundImage: "url(images/banner_background.jpg)" }}
                        />
                        <div className="container fill_height" style={{ wordWrap: "break-word !important" }}>
                            <div className="row fill_height" style={{ wordWrap: "break-word !important" }}>
                                <div className="banner_product_image">
                                    <img
                                        src={key.image}
                                        data-src={key.image}
                                        style={{ maxWidth: "400px", maxHeight: "300px" }}
                                        alt="Meta Etchant 37% Phosphoric "
                                    />
                                </div>
                                <div
                                    className="col-lg-5 offset-lg-4 fill_height"
                                    style={{ wordWrap: "break-word !important" }}
                                >
                                    <div className="banner_content" style={{ wordWrap: "break-word !important" }}>
                                        <h1 className="banner_text" style={{ wordWrap: "break-word !important" }}>
                                            {key.name}{" "}
                                        </h1>
                                        <div className="banner_price">&nbsp;</div>
                                        <div
                                            className="banner_product_name"
                                            style={{ wordWrap: "break-word !important" }}
                                        >
                                            {key.subcategory.name}
                                        </div>
                                        <div className="button banner_button">
                                            <a href={"store/product/" + key.id}>Shop Now</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Characteristics */}

                <div className="container mydiv">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="container m-t-20">
                                <div className="row">
                                    {data.map((key, index) => (
                                        <div key={index} className="col-md-4 padding-0">
                                            <div className="bbb_item is_new">
                                                <div className="bbb_image d-flex flex-column align-items-center justify-content-center">
                                                    <img src={key.image} alt="" />
                                                </div>
                                                <div className="bbb_content">
                                                    <div className="bbb_category">
                                                        <a href="#">{key.subcategory.name}</a>
                                                    </div>
                                                    <div className="bbb_info clearfix">
                                                        <div className="bbb_name">
                                                            <a href={"store/product/" + key.id}>{key.name}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ul className="bbb_marks">
                                                    <li className="bbb_mark bbb_discount">-25%</li>
                                                    <li className="bbb_mark bbb_new">new</li>
                                                </ul>
                                                <div className="bbb_fav">
                                                    <i className="fas fa-heart" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner */}

                <div className="py-5" id="venue" style={{ backgroundImage: "url(images/banner_2_background.jpg)" }}>
                    <div className="container">
                        <div className="carousel slide" data-ride="carousel" id="carousel1">
                            <div className="carousel-inner" role="listbox">
                                {trendsPro.map((key, index) => (
                                    <div key={index} className={index == 1 ? "carousel-item active" : "carousel-item"}>
                                        <div className="row">
                                            <div className="p-4 col-md-6 align-self-center text-color">
                                                <p classname="m-0">{key.subcategory.name}</p>
                                                <h2>{key.name}</h2>
                                                <p classname="my-4">{key.description}</p>
                                                <a href="#" classname="btn mb-3 p-2 btn-danger">
                                                    Add to Cart
                                                </a>
                                            </div>
                                            <div className="p-4 col-md-6 align-self-center text-color">
                                                <img
                                                    classname="d-block img-fluid w-100"
                                                    src={key.image}
                                                    alt="first slide"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <a className="carousel-control-prev" href="#carousel1" role="button" data-slide="prev">
                                {" "}
                                <span className="carousel-control-prev-icon" aria-hidden="true" />{" "}
                                <span className="sr-only">Previous</span>{" "}
                            </a>{" "}
                            <a className="carousel-control-next" href="#carousel1" role="button" data-slide="next">
                                {" "}
                                <span className="carousel-control-next-icon" aria-hidden="true" />{" "}
                                <span className="sr-only">Next</span>{" "}
                            </a>
                        </div>
                    </div>
                </div>

                {/* Popular Categories */}
                <div className="popular_categories">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="popular_categories_content">
                                    <div className="popular_categories_title">Popular Categories</div>
                                    <div className="popular_categories_slider_nav">
                                        <div className="popular_categories_prev popular_categories_nav">
                                            <i className="fas fa-angle-left ml-auto" />
                                        </div>
                                        <div className="popular_categories_next popular_categories_nav">
                                            <i className="fas fa-angle-right ml-auto" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Popular Categories Slider */}
                            <div className="col-lg-9">
                                <div className="popular_categories_slider_container">
                                    <div className="owl-carousel owl-theme popular_categories_slider">
                                        {/* Popular Categories Item */}
                                        <a href="/category/restoratives">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Restoratives
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/endodontics">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Endodontics
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/dental-x-ray">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Dental x-ray
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/dental-lab">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Dental lab
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/disposables">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Disposables
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/orthodonctics">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Orthodonctics
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/anesthetics">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Anesthetics
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/others">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Others
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/small-equipments">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Small equipments
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {/* Popular Categories Item */}
                                        <a href="/category/instruments">
                                            <div className="owl-item">
                                                <div className="popular_category d-flex flex-column align-items-center justify-content-center">
                                                    <div className="popular_category_image"></div>
                                                    <div
                                                        className="popular_category_text"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        Instruments
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trends */}

                <div style={{ backgroundImage: "url(images/banner_background.jpg)" }}>
                    <div className="container mt-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            {" "}
                            <span>Hottest Giveaways</span> <span className="custom-badge text-uppercase">See More</span>{" "}
                        </div>
                        <div className="row">
                            {data.map((key, index) => (
                                <div key={index} className="col-md-4">
                                    <div className="card">
                                        <div className="d-flex justify-content-between align-items-center"></div>
                                        <div className="text-center">
                                            {" "}
                                            <img src={key.image} width={250} height={250} />{" "}
                                        </div>
                                        <div className="text-center">
                                            <h5>{key.name}</h5> <span className="text-success"></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hot New Arrivals */}
                <div className="new_arrivals">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="tabbed_container">
                                    <div className="tabs clearfix tabs-right">
                                        <div className="new_arrivals_title">Hot New Arrivals</div>
                                        <ul className="clearfix">
                                            <li className="active">&nbsp;</li>
                                        </ul>
                                        <div className="tabs_line">
                                            <span />
                                        </div>
                                    </div>
                                    <div className="row">
                                        {trendsPro.map((key, index) => (
                                            <div key={index} className="col-lg-3">
                                                <div className="arrivals_single clearfix">
                                                    <div
                                                        className="d-flex flex-column align-items-center justify-content-center"
                                                        style={{ wordWrap: "break-word !important" }}
                                                    >
                                                        <div className="arrivals_single_image">
                                                            <a href="/product/meta-etchant-37-phosphoric">
                                                                <img
                                                                    src="http://localhost:8000/media/images/product/Screen_Shot_2020-06-23_at_16.15.43.png"
                                                                    data-src="http://localhost:8000/media/images/product/Screen_Shot_2020-06-23_at_16.15.43.png"
                                                                    style={{ maxWidth: "135px" }}
                                                                    alt="Meta Etchant 37% Phosphoric "
                                                                />
                                                            </a>
                                                        </div>
                                                        <div
                                                            className="arrivals_single_content"
                                                            style={{ wordWrap: "break-word !important" }}
                                                        >
                                                            <div
                                                                className="arrivals_single_category"
                                                                style={{ wordWrap: "break-word !important" }}
                                                            >
                                                                <a href="/category/restoratives">RESTORATIVES</a>
                                                            </div>
                                                            <div
                                                                className="arrivals_single_name_container clearfix"
                                                                style={{ wordWrap: "break-word !important" }}
                                                            >
                                                                <div
                                                                    className="arrivals_single_name text-wrap"
                                                                    style={{ wordWrap: "break-word !important" }}
                                                                >
                                                                    <a
                                                                        href="/product/meta-etchant-37-phosphoric"
                                                                        style={{ wordWrap: "break-word !important" }}
                                                                    >
                                                                        Meta etchant 37% phosphoric
                                                                    </a>
                                                                </div>
                                                                <div
                                                                    className="arrivals_single_price text-right"
                                                                    style={{ wordWrap: "break-word !important" }}
                                                                />
                                                            </div>
                                                            <form
                                                                action="/cart/create/meta-etchant-37-phosphoric"
                                                                method="post"
                                                            >
                                                                <button
                                                                    className="arrivals_single_button"
                                                                    type="submit"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </form>
                                                        </div>
                                                        <div className="arrivals_single_fav product_fav active">
                                                            <i className="fas fa-heart" />
                                                        </div>
                                                        <ul className="arrivals_single_marks product_marks">
                                                            <li className="arrivals_single_mark product_mark product_new">
                                                                new
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Best Sellers */}

                {/* Best Sellers */}
                <div className="best_sellers">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="tabbed_container">
                                    <div className="tabs clearfix tabs-right">
                                        <div className="new_arrivals_title">Hot Best Sellers</div>
                                        <ul className="clearfix">
                                            <li className="active">&nbsp;</li>
                                        </ul>
                                        <div className="tabs_line">
                                            <span />
                                        </div>
                                    </div>
                                    <div className="bestsellers_panel panel active">
                                        {/* Best Sellers Slider */}
                                        <div className="bestsellers_slider slider">
                                            {/* Best Sellers Item */}

                                            {this.state.trendsPro.map((key, index) => (
                                                <div
                                                    className="slick-slide slick-active"
                                                    data-slick-index={1}
                                                    aria-hidden="false"
                                                    style={{ width: "350px" }}
                                                    tabIndex={0}
                                                    role="tabpanel"
                                                    key={index}
                                                    id="slick-slide41"
                                                >
                                                    <div>
                                                        <a
                                                            href="/category/others"
                                                            style={{ width: "100%", display: "inline-block" }}
                                                            tabIndex={0}
                                                        ></a>
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="bestsellers_item"
                                                            style={{ width: "100%", display: "inline-block" }}
                                                        >
                                                            <a href="/category/others" tabIndex={0}></a>
                                                            <div className="bestsellers_item_container d-flex flex-row align-items-center justify-content-start">
                                                                <a href="/category/others" tabIndex={0}></a>
                                                                <div className="bestsellers_image">
                                                                    <a href="/category/others" tabIndex={0}></a>
                                                                    <a
                                                                        href="/product/retractor-2-thick-250cm"
                                                                        tabIndex={0}
                                                                    >
                                                                        <img
                                                                            src={key.image}
                                                                            data-src={key.image}
                                                                            style={{
                                                                                maxHeight: "115px",
                                                                                maxWidth: "115px"
                                                                            }}
                                                                            alt=""
                                                                        />
                                                                    </a>
                                                                </div>
                                                                <div
                                                                    className="bestsellers_content"
                                                                    style={{ wordWrap: "break-word !important" }}
                                                                >
                                                                    <div
                                                                        className="bestsellers_category"
                                                                        style={{ wordWrap: "break-word !important" }}
                                                                    >
                                                                        <a
                                                                            href="/category/others"
                                                                            style={{
                                                                                wordWrap: "break-word !important"
                                                                            }}
                                                                            tabIndex={0}
                                                                        >
                                                                            {key.subcategory.name}
                                                                        </a>
                                                                    </div>
                                                                    <div
                                                                        className="bestsellers_name"
                                                                        style={{ wordWrap: "break-word !important" }}
                                                                    >
                                                                        <a
                                                                            href="/product/retractor-2-thick-250cm"
                                                                            style={{
                                                                                wordWrap: "break-word !important"
                                                                            }}
                                                                            tabIndex={0}
                                                                        >
                                                                            {key.name}
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="bestsellers_fav active">
                                                                <i className="fas fa-heart" />
                                                            </div>
                                                            <ul className="bestsellers_marks">
                                                                <li className="bestsellers_mark bestsellers_discount">
                                                                    -25%
                                                                </li>
                                                                <li className="bestsellers_mark bestsellers_new">
                                                                    new
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Brands */}
                <div className="brands">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="brands_slider_container">
                                    {/* Brands Slider */}
                                    <div className="owl-carousel owl-theme brands_slider">
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1561651145.352455.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1561651711.623175.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1561651798.972237.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562852561.975058.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562852814.216681.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562852828.389226.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562852845.987658.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562853058.77298.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562853033.479199.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562853510.564029.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562853534.804799.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562853556.47769.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562853579.133201.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562853599.363741.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562854033.258549.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562854054.577248.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562854073.23963.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562854096.703977.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562854225.429982.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1562854248.132021.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1565682978.126476.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1565683104.283147.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1565683487.738711.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1565683819.541258.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1565683579.343227.jpg"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="owl-item">
                                            <div className="brands_item d-flex flex-column justify-content-center">
                                                <img
                                                    src="/static/brands/1567583925.008965.png"
                                                    style={{
                                                        maxWidth: "72px !important",
                                                        maxHeight: "72px !important"
                                                    }}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Brands Slider Navigation */}
                                    <div className="brands_nav brands_prev">
                                        <i className="fas fa-chevron-left" />
                                    </div>
                                    <div className="brands_nav brands_next">
                                        <i className="fas fa-chevron-right" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getSingleProd,
            getSlideProd,
            getTrendsProd,
            getFeaturedProd
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Store);

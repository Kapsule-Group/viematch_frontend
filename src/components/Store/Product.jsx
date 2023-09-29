import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getProdDescription } from "../../actions/storeAction";

class Product extends Component {
    state = {
        cart: [],
        singProd: []
    };

    componentDidMount() {
        const {
            match: { params }
        } = this.props;
        this.setCart();
        this.showProdDescription(params.id);
    }

    componentWillUnmount() {}

    showProdDescription = prodId => {
        const { getProdDescription } = this.props;

        getProdDescription(prodId).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    singProd: res.payload.data
                });
            }
        });
    };

    removeCart = productId => {
        let cartProducts = JSON.parse(localStorage.getItem("products"));
        let products = cartProducts.filter(product => product.productId !== productId);
        localStorage.setItem("products", JSON.stringify(products));
        //alert(productId);
        this.setState({
            cart: products
        });
    };

    setCart = () => {
        let products = [];
        if (localStorage.getItem("products")) {
            products = JSON.parse(localStorage.getItem("products"));
        }
        this.setState({
            cart: products
        });
    };

    addCart = (productId, name, image) => {
        this.props.addToCart(productId, name, image);
    };

    addTocart = () => {
        this.navRef.current.showMsg();
    };

    render() {
        return (
            <div className="super_container">
                <Navbar ref={this.navRef} />

                {this.state.singProd.length > 0 ? (
                    this.state.singProd.map((key, index) => (
                        <div key={index} className="single_product">
                            <div className="container">
                                <div className="row">
                                    {/* Images */}
                                    <div className="col-lg-2 order-lg-1 order-2">
                                        <ul className="image_list">
                                            <li data-image={key.image}>
                                                <img src={key.image} alt="Retractor #0 fine 250cm" />
                                            </li>
                                        </ul>
                                    </div>
                                    {/* Selected Image */}
                                    <div className="col-lg-5 order-lg-2 order-1">
                                        <div className="image_selected">
                                            <img src={key.image} alt={key.name} />
                                        </div>
                                    </div>
                                    {/* Description */}
                                    <div className="col-lg-5 order-3">
                                        <div className="product_description">
                                            <div className="product_category">{key.subcategory.name}</div>
                                            <div className="product_name">{key.name}</div>
                                            <div className="product_text">
                                                <p>{key.description}</p>
                                            </div>
                                            <div className="order_info d-flex flex-row">
                                                <input
                                                    id="csrf_token"
                                                    name="csrf_token"
                                                    type="hidden"
                                                    defaultValue="ImNlODBlMzJkYmNmOTQ1Zjk3MWIxNTQyYWI4YzE4YjkyNGFjZjIyZGEi.X1IByw.3RujPpIF6ydM4wOg_RyNfV7PNgY"
                                                />
                                                <input type="hidden" defaultValue={170} name="product_id" />
                                                <input
                                                    type="hidden"
                                                    defaultValue="retractor-0-fine-250cm"
                                                    name="product_slug"
                                                />
                                                <input
                                                    type="hidden"
                                                    defaultValue="http://139.59.152.214/product/retractor-0-fine-250cm"
                                                    name="request_url"
                                                />
                                                <div className="clearfix" style={{ zIndex: 1000 }}>
                                                    {/* Product Quantity */}
                                                    <div className="product_quantity clearfix">
                                                        <span>Quantity: </span>
                                                        <input
                                                            id="quantity_input"
                                                            name="product_quantity"
                                                            type="text"
                                                            pattern="[0-9]*"
                                                            defaultValue={1}
                                                        />
                                                        <div className="quantity_buttons">
                                                            <div
                                                                id="quantity_inc_button"
                                                                className="quantity_inc quantity_control"
                                                            >
                                                                <i className="fas fa-chevron-up" />
                                                            </div>
                                                            <div
                                                                id="quantity_dec_button"
                                                                className="quantity_dec quantity_control"
                                                            >
                                                                <i className="fas fa-chevron-down" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="button_container" tyle={{ leftMargin: "-60px" }}>
                                                    <button
                                                        type="submit"
                                                        className="button cart_button"
                                                        onClick={this.addTocart}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                    <div className="product_fav">
                                                        <i className="fas fa-heart" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="jumbotron mt-4">
                        <div className="text-center">
                            <h1>404</h1>
                            <p>Sorry, that page doesn't exist.</p>
                            <p>
                                Want to <a href="/store">home</a> instead?
                            </p>
                        </div>
                    </div>
                )}

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
            getProdDescription
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);

import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import Navbar from "./Navbar";
import Footer from "./Footer";

//import { getStock, searchStock, getSearchList } from '../../actions/stockActions';

class Cart extends Component {
    state = {
        cart: []
    };

    componentDidMount() {
        this.setCart();
    }

    componentWillUnmount() {}

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

    render() {
        const { stock_list, search_list } = this.props;

        return (
            <div className="super_container">
                <Navbar />

                <div className="cart_section">
                    <div className="container">
                        <form action="/proforma" method="POST">
                            <input
                                id="csrf_token"
                                name="csrf_token"
                                type="hidden"
                                defaultValue="ImNlODBlMzJkYmNmOTQ1Zjk3MWIxNTQyYWI4YzE4YjkyNGFjZjIyZGEi.X1EL_A.zfV3m0tmMWsy1RhSONoq1OwHLXU"
                            />
                            <div className="row">
                                <div className="col-lg-10 offset-lg-1">
                                    <div className="cart_container">
                                        <div className="cart_title">
                                            <span style={{ fontWeight: "100 !important" }}>Cart Total Item </span>({" "}
                                            <b>{this.state.cart.length}</b> )
                                        </div>

                                        {this.state.cart.map((key, index) => (
                                            <div key={index} className="cart_items">
                                                <ul className="cart_list">
                                                    <li className="cart_item clearfix">
                                                        <div className="cart_item_image">
                                                            <img
                                                                src={key.image}
                                                                style={{ width: "113px", height: "113px" }}
                                                                alt="Retractor #0 fine 250cm"
                                                            />
                                                        </div>
                                                        <div className="cart_item_info d-flex flex-md-row flex-column justify-content-between">
                                                            <div className="cart_item_name cart_info_col">
                                                                <div className="cart_item_title">Name</div>
                                                                <div
                                                                    className="cart_item_text"
                                                                    style={{
                                                                        fontSize: "18px",
                                                                        marginTop: "35px",
                                                                        fontWeight: "bold"
                                                                    }}
                                                                >
                                                                    {key.name}
                                                                </div>
                                                            </div>
                                                            <div className="cart_item_quantity cart_info_col">
                                                                <div className="cart_item_title">Quantity</div>
                                                                <div className="cart_item_text text-center">
                                                                    <input
                                                                        type="number"
                                                                        defaultValue={1}
                                                                        name="items_quantity[]"
                                                                        className="form-control"
                                                                        required
                                                                    />
                                                                    <input
                                                                        type="hidden"
                                                                        name="items[]"
                                                                        defaultValue="retractor-0-fine-250cm"
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="cart_item_total cart_info_col">
                                                                <div className="cart_item_title">&nbsp;</div>
                                                                <div
                                                                    className="cart_item_text mt-3"
                                                                    title="Remove This"
                                                                    style={{ fontSize: "1.5vmax", opacity: ".6" }}
                                                                >
                                                                    <a
                                                                        className="fa fa-trash text-danger delete-item"
                                                                        onClick={() => this.removeCart(key.productId)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        ))}

                                        {this.state.cart.length < 1 ? (
                                            ""
                                        ) : (
                                            <div className="cart_buttons">
                                                <button type="button" className="float-left button cart_button_clear">
                                                    <span>Clear Cart</span>
                                                </button>
                                                <button
                                                    type="submit"
                                                    onclick="if(confirm('Yes submit this Pro Forma') !== true) return false;"
                                                    className="button cart_button_checkout"
                                                >
                                                    Create Pro Forma
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
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
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

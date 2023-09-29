import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProductCard.scss";
import CartImg from "../../../assets/image/shopping_cart_sm.svg";
import { postRequest } from "../../../actions/stockActions";
import { connect } from "react-redux";
import NoImg from "../../../assets/image/no-product.png";
import { toast } from "react-toastify";

const ProductCard = ({
    name,
    idx,
    id,
    image,
    className,
    description,
    link,
    price,
    history,
    postRequest,
    info: { currency }
}) => {
    const [inputValue, setInputValue] = useState(1);
    let token = localStorage.getItem("token");

    return (
        <div
            onClick={() => history.push(`/main/product-details/${id}`)}
            className={`product-card${className ? " " + className : ""}`}
            key={idx}
        >
            <img src={image || NoImg} alt="" />
            <p className="name">{name}</p>
            <p className="description">{description && description.replace(/<[^>]+>/g, "")}</p>
            <div className="row-wrapper">
                <span>
                    {/* {currency || "USD"} {price} */}
                    Price on Request
                </span>

                {token && (
                    <div>
                        <div className="input-wrapper">
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    if (inputValue > 1) {
                                        setInputValue(inputValue - 1);
                                    }
                                }}
                                disabled={inputValue <= 1}
                            >
                                -
                            </button>
                            <input
                                value={inputValue}
                                onChange={e => setInputValue(+e.target.value)}
                                onClick={e => e.stopPropagation()}
                                onBlur={e => {
                                    if (e.target.value < 1) {
                                        setInputValue(1);
                                    }
                                }}
                            />
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    setInputValue(inputValue + 1);
                                }}
                            >
                                +
                            </button>
                        </div>
                        <button
                            className="add-cart"
                            onClick={e => {
                                e.stopPropagation();
                                postRequest({ product_id: id, quantity: inputValue, incart: true }).then(res => {
                                    if (res.payload && res.payload.status && res.payload.status === 201) {
                                        toast(`${name} is added to the cart.`);
                                    }
                                });
                            }}
                        >
                            <img src={CartImg} alt="" />
                            Add
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = ({ users }) => {
    return {
        info: users.userInfo
    };
};

const mapDispatchToProps = {
    postRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);

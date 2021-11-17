import React, { useState } from "react";
import "./SearchResults.scss";
import NoImg from "../../assets/image/no-category.png";
import CartImg from "../../assets/image/shopping_cart_sm.svg";
import { postRequest } from "../../actions/stockActions";
import { connect } from "react-redux";
import { toast } from "react-toastify";

const SearchElement = ({
    image,
    price,
    description,
    name,
    subcategory,
    idx,
    postRequest,
    id,
    info: { currency },
    history
}) => {
    let token = localStorage.getItem("token");

    const [inputValue, setInputValue] = useState(1);
    return (
        <div className="search-element" key={idx} onClick={() => history.push(`/main/product-details/${id}`)}>
            <img src={NoImg || image} alt="" />
            <div className="details-wrapper">
                <p
                    className="category"
                    onClick={e => {
                        e.stopPropagation();
                        history.push(`/main/catalog/category/${subcategory && subcategory.id}/`);
                    }}
                >
                    {subcategory && subcategory.name}
                </p>
                <p className="name">{name}</p>
                <p className="description">{description && description.replace(/<[^>]+>/g, "")}</p>
                <div className="row-wrapper">
                    <span>
                        {currency || "USD"} {price}
                    </span>
                    {token && (
                        <>
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
                        </>
                    )}
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchElement);

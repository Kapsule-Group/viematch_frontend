import React, { useEffect, useState } from "react";
import "./ProductDetails.scss";
import { connect } from "react-redux";
import { getProductDetails, getRecommendedProducts } from "../../actions/catalogActions";
import { Link } from "react-router-dom";
import arrow from "../../assets/image/go_back.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import RecommendedElem from "./RecommendedElem";
import Radio from "../../assets/image/radio.svg";
import DialogComponent from "./../HelperComponents/DialogComponent/DialogComponent";
import { toast } from "react-toastify";
import { postRequest } from "../../actions/stockActions";
import CartImg from "../../assets/image/shopping_cart_white.svg";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";

function SampleNextArrow(props) {
    const { className, onClick } = props;
    return <div className={className} style={{ display: "block" }} onClick={onClick} />;
}

function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return <div className={className} style={{ display: "block" }} onClick={onClick} />;
}

const ProductDetails = ({
    match: {
        params: { id }
    },
    getProductDetails,
    getRecommendedProducts,
    details,
    recommended: { results },
    info: { currency },
    postRequest,
    history
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductDetails(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                setLoading(false);
            }
        });
        getRecommendedProducts(id);
    }, []);

    useEffect(() => {
        setLoading(true);
        getProductDetails(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                setLoading(false);
            }
        });
        getRecommendedProducts(id);
    }, [id]);

    const { path, name, extra_images, description, brand_ref, image, price } = details;

    const [inputValue, setInputValue] = useState(1);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1
    };

    const settingsDialog = {
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const photoSettings = {
        dots: false,
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        vertical: true,
        verticalSwiping: true,
        autoplay: false,
        prevArrow: <SamplePrevArrow />,
        nextArrow: <SampleNextArrow />
    };

    const [pickedImg, setPickedImg] = useState(null);

    const handleImagePick = el => {
        setPickedImg(el);
    };

    const wordArray = ["Every week", "Every month", "Every year"];

    const [activeAdv, setActiveAdv] = useState(0);

    const [dialogOpened, setDialogOpened] = useState(false);

    const toggleDialog = () => setDialogOpened(!dialogOpened);

    let photoArr = [];

    if (image) {
        photoArr.push(image);
    }

    if (extra_images && extra_images.length > 0) {
        photoArr = [...photoArr, ...extra_images].map(el => (el.image ? el.image : el));
    }

    let token = localStorage.getItem("token");
    return (
        <div className="product-details">
            <div className="breadcrams">
                {path &&
                    path.map((el, idx) => (
                        <div className="breadcram-single" key={idx}>
                            <img alt="" src={arrow} />
                            <Link to={`/main/catalog/category/${el.id}`} key={el.id}>
                                {el.name}
                            </Link>
                        </div>
                    ))}
            </div>
            <h1>{name}</h1>
            {loading ? (
                <Loader />
            ) : (
                <div className="content-wrapper">
                    <div className="main-info">
                        <div className="photo only_desk">
                            <div className="more_img">
                                {photoArr && photoArr > 4 ? (
                                    <Slider {...photoSettings}>
                                        {photoArr &&
                                            photoArr((el, idx) => (
                                                <div
                                                    onClick={() => handleImagePick(el)}
                                                    className={el === pickedImg ? "active" : ""}
                                                    key={idx}
                                                >
                                                    <img src={el} alt={``} />
                                                </div>
                                            ))}
                                    </Slider>
                                ) : (
                                    photoArr &&
                                    photoArr.map((el, idx) => (
                                        <div
                                            onClick={() => handleImagePick(el)}
                                            className={el === pickedImg ? "active photo-detail" : "photo-detail"}
                                            key={idx}
                                        >
                                            <img src={el} alt={``} />
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="img" onClick={toggleDialog}>
                                <img
                                    className="img_to_drag"
                                    src={pickedImg ? pickedImg : photoArr && photoArr[0]}
                                    alt={``}
                                />
                            </div>
                        </div>
                        <div className="text-wrapper">
                            <div>
                                <div className="description" dangerouslySetInnerHTML={{ __html: description }}></div>
                                {brand_ref && (
                                    <div className="manufacturer">
                                        <p className="tag">Manufacturer:</p>
                                        <p className="name">{brand_ref.name}</p>
                                    </div>
                                )}
                            </div>

                            <div className="row-wrapper">
                                <span>
                                    {/* {currency || "USD"} {price} */}
                                    Price on Request
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
                                                    console.log(e.target.value);
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
                                                postRequest({
                                                    product_id: id,
                                                    quantity: inputValue,
                                                    incart: true
                                                }).then(res => {
                                                    if (
                                                        res.payload &&
                                                        res.payload.status &&
                                                        res.payload.status === 201
                                                    ) {
                                                        toast(`${name} is added to the cart.`);
                                                    }
                                                });
                                            }}
                                        >
                                            <img src={CartImg} alt="" />
                                            Add to cart
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* <div className="advertising">
                    <p className="name">Subscribe to this item</p>
                    <p className="description">Add this product to your subscription and get up to 20% discount NOW</p>
                    <p className="choose-plan">Choose a subscription plan:</p>
                    {wordArray.map((el, idx) => (
                        <div className="option" onClick={() => setActiveAdv(idx)} key={idx}>
                            {activeAdv === idx ? <img src={Radio} alt="" /> : <div className="empty-radio" />}
                            <p>{el}</p>
                        </div>
                    ))}

                    <button>Subscribe</button>
                </div> */}
                </div>
            )}

            {results && results.length > 0 && (
                <div className="recommended-wrapper">
                    <p className="head-text">You may also be interested in</p>

                    <div className="slider-wrapper">
                        <Slider {...settings}>
                            {results.map((el, idx) => (
                                <RecommendedElem key={idx} history={history} {...el} />
                            ))}
                        </Slider>
                    </div>
                </div>
            )}
            <DialogComponent open={dialogOpened} onClose={toggleDialog} paper_classes="dialog_product_slider">
                <div className="dialog_slider">
                    <Slider {...settingsDialog}>
                        {photoArr &&
                            photoArr.map((pic, idx) => (
                                <div key={idx} className="slider_items">
                                    <div className="icon">
                                        <img src={pic} alt={``} />
                                    </div>
                                </div>
                            ))}
                    </Slider>
                </div>
            </DialogComponent>
        </div>
    );
};

const mapStateToProps = ({ catalog, users }) => {
    return {
        details: catalog.product_details,
        recommended: catalog.recommended,
        info: users.userInfo
    };
};

const mapDispatchToProps = { getProductDetails, getRecommendedProducts, postRequest };

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);

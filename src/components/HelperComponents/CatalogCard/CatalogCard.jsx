import React from "react";
import { Link } from "react-router-dom";
import arrowImg from "../../../assets/image/arrow_forward-new.svg";
import "./CatalogCard.scss";
import NoImg from "../../../assets/image/no-category.png";

const CatalogCard = ({ name, idx, id, image, className, link, main }) => {
    return (
        <Link to={`${link}${id}`} className={`catalog-card${className ? " " + className : ""}`} key={idx}>
            <p>{name}</p>
            <img src={image || NoImg} alt="" />
            <Link to={`${link}${id}`}>
                {main ? "Shop now" : "See more"}
                <img src={arrowImg} alt="" />
            </Link>
        </Link>
    );
};

export default CatalogCard;

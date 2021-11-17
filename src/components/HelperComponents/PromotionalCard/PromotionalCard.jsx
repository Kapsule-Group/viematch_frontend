import React from "react";
import { Link } from "react-router-dom";
import "./PromotionalCard.scss";

const PromotionalCard = ({ button_title, image, link, title, idx, id }) => {
    return (
        <div className="promotional-cart" key={idx} style={{ backgroundImage: `url(${image})` }}>
            <p>{title}</p>
            <a href={link} target="_blank">
                {button_title}
            </a>
        </div>
    );
};

export default PromotionalCard;

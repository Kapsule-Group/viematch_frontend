import React from "react";

import arrow from "../../../assets/image/arrow-stock.svg";
import inStock from "../../../assets/image/in-stock.svg";
import lowStock from "../../../assets/image/low-stock.svg";
import outOfStock from "../../../assets/image/out-of-stock.svg";

import "./StockManagementGraphic.scss";

const StockManagementGraphic = ({ data: { sufficient, low, out }, push }) => {
    const inPercent = (sufficient / (sufficient + low + out)) * 100,
        lowPercent = (low / (sufficient + low + out)) * 100,
        outPercent = (out / (sufficient + low + out)) * 100;
    return (
        <>
            <div className="stock-header">
                <p>Stock Management</p>
                <img
                    src={arrow}
                    alt="arrow"
                    onClick={() => push("/main/stock-management")}
                    style={{ cursor: "pointer" }}
                />
            </div>
            <div className="in-stock">
                <img src={inStock} alt="in-stock" />
                <div>
                    <div className="in-stock-data">
                        <div className="bar-name">in stock</div>
                        <div>
                            <span className="amount">{sufficient}</span>
                            {sufficient ? <span className="percents">{Math.round(inPercent * 100) / 100}%</span> : null}
                        </div>
                    </div>
                    <div className="in-stock-bar">
                        <div
                            className="in-stock-bar-fill"
                            style={sufficient === 0 ? { width: "0%" } : { width: `${inPercent}%` }}
                        />
                    </div>
                </div>
            </div>
            <div className="low-stock">
                <img src={lowStock} alt="low-stock" />
                <div>
                    <div className="low-stock-data">
                        <div className="bar-name">low stock</div>
                        <div>
                            <span className="amount">{low}</span>
                            {low ? <span className="percents">{Math.round(lowPercent * 100) / 100}%</span> : null}
                        </div>
                    </div>
                    <div className="low-stock-bar">
                        <div
                            className="low-stock-bar-fill"
                            style={low === 0 ? { width: "0%" } : { width: `${lowPercent}%` }}
                        />
                    </div>
                </div>
            </div>
            <div className="out-stock">
                <img src={outOfStock} alt="out-stock" />
                <div>
                    <div className="out-stock-data">
                        <div className="bar-name">out of stock</div>
                        <div>
                            <span className="amount">{out}</span>
                            {out ? <span className="percents">{Math.round(outPercent * 100) / 100}%</span> : null}
                        </div>
                    </div>
                    <div className="out-stock-bar">
                        <div
                            className="out-stock-bar-fill"
                            style={out === 0 ? { width: "0%" } : { width: `${outPercent}%` }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default StockManagementGraphic;

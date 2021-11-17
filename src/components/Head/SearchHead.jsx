import React, { useState, useEffect } from "react";
import "./SearchHead.scss";
import roll from "../../assets/image/roll_down.svg";
import { ClickAwayListener } from "@material-ui/core";
import activeChoise from "../../assets/image/active_choice.svg";
import searchIcon from "../../assets/image/search_btn.svg";

const SearchHead = ({ categories, liveSearchHeader, searchResults, history }) => {
    const {
        location: { pathname }
    } = history;

    useEffect(() => {
        if (pathname !== "/main/search-results") {
            setSearch("");
        }
    }, [pathname]);

    const [showFilter, setShowFilter] = useState(false);

    const [activeFilter, setActiveFilter] = useState({ name: "All", id: null });

    const [search, setSearch] = useState("");

    const [activeSearch, setActiveSearch] = useState(false);

    return (
        <div className="search-wrapper">
            <div className="filter" onClick={() => setShowFilter(!showFilter)}>
                <span>{activeFilter && activeFilter.name}</span>
                <img src={roll} alt="roll" className={showFilter ? "reverse" : ""} />
            </div>
            {showFilter && (
                <ClickAwayListener onClickAway={() => setShowFilter(false)}>
                    <div className="filter-props">
                        {categories &&
                            [{ name: "All", id: null }, ...categories].map((el, idx) => (
                                <div
                                    key={idx}
                                    className={el === activeFilter ? "activeFilter" : ""}
                                    onClick={() => {
                                        setActiveFilter(el);
                                        setShowFilter(false);
                                    }}
                                >
                                    {el.name}
                                    {el.id === activeFilter.id && <img src={activeChoise} alt="" />}
                                </div>
                            ))}
                    </div>
                </ClickAwayListener>
            )}
            {activeSearch && searchResults && searchResults.length > 0 && (
                <ClickAwayListener onClickAway={() => setActiveSearch(false)}>
                    <div className="search-props">
                        {searchResults.map((el, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    setSearch(el.name);
                                    setActiveSearch(false);
                                    history.push(
                                        `/main/search-results?search=${el.name}${
                                            activeFilter && activeFilter.id ? "&id=" + activeFilter.id : ""
                                        }`
                                    );
                                }}
                            >
                                {el.name}
                            </div>
                        ))}
                    </div>
                </ClickAwayListener>
            )}
            <input
                placeholder="Search..."
                value={search}
                onChange={e => {
                    setSearch(e.target.value);
                    if (e.target.value && e.target.value.length > 1) {
                        liveSearchHeader(e.target.value, activeFilter && activeFilter.id);
                        setActiveSearch(true);
                    }
                }}
            />
            <button>
                <img
                    src={searchIcon}
                    alt=""
                    onClick={() =>
                        history.push(
                            `/main/search-results?search=${search}${
                                activeFilter && activeFilter.id ? "&id=" + activeFilter.id : ""
                            }`
                        )
                    }
                />
            </button>
        </div>
    );
};

export default SearchHead;

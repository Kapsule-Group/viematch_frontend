import React, { useState } from "react";
import "./CategoriesFilter.scss";
import Checkbox from "@material-ui/core/Checkbox";

const CategoriesFilter = ({
    categories: { tree },
    brands,
    activeCategory,
    search,
    history,
    activeMan,
    setActiveMan,
    fetchFunction,
    setActivePage,
    category
}) => {
    const [showAll, setShowAll] = useState(activeCategory ? true : false);

    const find = (array, id) => {
        let result;
        array && array.some(o => (result = o.id === id ? o : find(o.items || [], id)));
        return result;
    };
    const renderFunc = (array, isChild = false) => {
        return (
            <div className={`categories${isChild ? " mt16" : ""}`}>
                {array &&
                    array.map(el => {
                        return (
                            <div
                                key={el.id}
                                className={`${isChild ? "category-child" : "category"}${
                                    activeCategory === el.id ? " active" : ""
                                }`}
                                onClick={e => {
                                    e.stopPropagation();
                                    if (category) {
                                        history.push(`/main/catalog/category/${el.id}/`);
                                    } else {
                                        history.push(`/main/search-results?search=${search}&id=${el.id}`);
                                    }
                                }}
                            >
                                {el.name}
                                {((el.items && el.items.length > 0 && find(el.items, activeCategory)) ||
                                    activeCategory == el.id) &&
                                    renderFunc(el.items, true)}
                            </div>
                        );
                    })}
            </div>
        );
    };

    const arr = tree && tree.slice(0, showAll ? 999 : 10);

    return (
        <div className="filter-menu">
            <div className="categories-wrapper">
                <p>Category</p>
                <div className="categories">{renderFunc(arr)}</div>
                {!showAll && (
                    <div className="view-more" onClick={() => setShowAll(true)}>
                        See all {tree && tree.length} categories
                    </div>
                )}
            </div>
            {brands && brands.length > 0 && (
                <div className="manufacturer-wrapper">
                    <p>Manufacturer</p>
                    <div className="manufacturers">
                        {brands.map((el, idx) => (
                            <div className="single-man" key={idx}>
                                <Checkbox
                                    style={{
                                        color: "#3796F6"
                                    }}
                                    size="small"
                                    checked={activeMan && activeMan.some(check => check === el.id)}
                                    onChange={e => {
                                        setActivePage(1);
                                        if (e.target.checked) {
                                            fetchFunction([...activeMan, el.id].join(","));
                                            setActiveMan([...activeMan, el.id]);
                                        } else {
                                            const idx = activeMan.findIndex(i => i === el.id);
                                            fetchFunction(
                                                [...activeMan.slice(0, idx), ...activeMan.slice(idx + 1)].join(",")
                                            );
                                            setActiveMan([...activeMan.slice(0, idx), ...activeMan.slice(idx + 1)]);
                                        }
                                    }}
                                    inputProps={{ "aria-label": "controlled" }}
                                />
                                <span
                                    className={`man-text${
                                        activeMan && activeMan.some(check => check === el.id) ? " active" : ""
                                    }`}
                                >
                                    {el.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesFilter;

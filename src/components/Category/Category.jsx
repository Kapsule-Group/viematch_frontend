import React, { useState, useEffect, Component } from "react";
import "./Category.scss";
import { getSubcat, getCat } from "../../actions/catalogActions";
import { connect } from "react-redux";
import CategoriesFilter from "../CategoriesFilter/CategoriesFilter";
import CatalogCard from "../HelperComponents/CatalogCard/CatalogCard";
import ProductCard from "../HelperComponents/ProductCard/ProductCard";
import SearchPagination from "../HelperComponents/SearchPagination/SearchPagination";
import { useQuery } from "../../helpers/functions";
import { getCategoryResults, getSearchResultsCategories, getBrandsCategory } from "../../actions/catalogActions";
import { Link } from "react-router-dom";
import arrow from "../../assets/image/go_back.svg";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";

const Category = ({
    getCategoryResults,
    getSearchResultsCategories,
    getBrandsCategory,
    match: {
        params: { id }
    },
    history,
    category_results: { results, overall_total },
    brands,
    search_categories
}) => {
    let query = useQuery();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getCategoryResults(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                setLoading(false);
            }
        });
        getSearchResultsCategories(id);
        getBrandsCategory(id);
    }, []);

    useEffect(() => {
        setLoading(true);
        getCategoryResults(id).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                setLoading(false);
            }
        });
        setLoading(true);
        getSearchResultsCategories(id);
        getBrandsCategory(id);
        setActivePage(1);
    }, [id]);

    const [activePage, setActivePage] = useState(1);
    const [activeBrands, setActiveBrands] = useState([]);
    const { path } = search_categories;
    console.log(results);
    return (
        <div className="category-wrapper">
            <CategoriesFilter
                categories={search_categories}
                brands={brands}
                activeCategory={+id}
                history={history}
                activeMan={activeBrands}
                setActiveMan={setActiveBrands}
                fetchFunction={brands => {
                    getCategoryResults(id, 1, brands);
                }}
                setActivePage={setActivePage}
                category={true}
            />
            <div className="content-wrapper">
                <div className="results-wrapper">
                    {path && path.length > 1 && (
                        <div className="breadcrams">
                            {path.slice(0, path.length - 1).map((el, idx) => (
                                <div className="breadcram-single" key={idx}>
                                    <img alt="" src={arrow} />
                                    <Link to={`/main/catalog/category/${el.id}`} key={el.id}>
                                        {el.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}

                    <h1>{path && path.slice(-1)[0] && path.slice(-1)[0].name}</h1>
                    {loading ? (
                        <Loader />
                    ) : (
                        results &&
                        (results.length === 0 ? (
                            <span className="no-results">No results</span>
                        ) : (
                            <div className="results">
                                {results.map((el, idx) => {
                                    return el.type === "Product" ? (
                                        <ProductCard
                                            idx={idx}
                                            history={history}
                                            link="/main/catalog/category/"
                                            // className="category-card"
                                            {...el}
                                        />
                                    ) : (
                                        <CatalogCard
                                            idx={idx}
                                            link="/main/catalog/category/"
                                            className="category-card"
                                            {...el}
                                        />
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
                {overall_total > 30 && (
                    <div className="search-pagination">
                        <SearchPagination
                            active={activePage - 1}
                            pageCount={Math.ceil(overall_total / 30)}
                            onChange={e => {
                                setActivePage(e.selected + 1);
                                setLoading(true);
                                getCategoryResults(id, e.selected + 1, activeBrands.join(",")).then(res => {
                                    if (res.payload && res.payload.status && res.payload.status === 200) {
                                        setLoading(false);
                                    }
                                });
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = ({ catalog }) => {
    return {
        category_results: catalog.category_results,
        search_categories: catalog.search_categories,
        brands: catalog.brands
    };
};

const mapDispatchToProps = {
    getCategoryResults,
    getSearchResultsCategories,
    getBrandsCategory
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);

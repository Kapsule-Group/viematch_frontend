import React, { useState, useEffect } from "react";
import "./SearchResults.scss";
import { connect } from "react-redux";
import CategoriesFilter from "../CategoriesFilter/CategoriesFilter";
import CatalogCard from "../HelperComponents/CatalogCard/CatalogCard";
import ProductCard from "../HelperComponents/ProductCard/ProductCard";
import { useQuery } from "../../helpers/functions";
import { getSearchResults, getSearchResultsCategories, getBrands } from "../../actions/catalogActions";
import SearchElement from "./SearchElement";
import SearchPagination from "../HelperComponents/SearchPagination/SearchPagination";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";

const SearchResults = ({
    search_categories,
    search_results: { results, count },
    match: {
        params: { id }
    },
    getSearchResults,
    getSearchResultsCategories,
    history,
    getBrands,
    brands
}) => {
    let query = useQuery();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSearchResults(query.get("search"), query.get("id")).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                setLoading(false);
            }
        });
        getSearchResultsCategories(query.get("id"));
        getBrands(query.get("search"), query.get("id"));
        window.scrollTo({
            top: 1000,
            behavior: "smooth"
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        getSearchResults(query.get("search"), query.get("id")).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                setLoading(false);
            }
        });
        getSearchResultsCategories(query.get("id"));
        getBrands(query.get("search"), query.get("id"));
    }, [query.get("search")]);

    useEffect(() => {
        setLoading(true);
        getSearchResults(query.get("search"), query.get("id")).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                setLoading(false);
            }
        });
        getSearchResultsCategories(query.get("id"));
        getBrands(query.get("search"), query.get("id"));
        setActivePage(1);
    }, [query.get("id")]);

    const [activePage, setActivePage] = useState(1);
    const [activeBrands, setActiveBrands] = useState([]);

    return (
        <div className="search-results-wrapper">
            <CategoriesFilter
                categories={search_categories}
                brands={brands}
                activeCategory={+query.get("id")}
                search={query.get("search")}
                history={history}
                activeMan={activeBrands}
                setActiveMan={setActiveBrands}
                fetchFunction={brands => {
                    getSearchResults(query.get("search"), query.get("id"), 1, brands);
                }}
                setActivePage={setActivePage}
                category={false}
            />
            <div className="content-wrapper">
                <div className="results-wrapper">
                    <h1>{`Search results for «${query.get("search")}»`}</h1>
                    {loading ? (
                        <Loader />
                    ) : (
                        results &&
                        (results.length === 0 ? (
                            <span className="no-results">No results</span>
                        ) : (
                            <div className="results">
                                {results &&
                                    results.map((el, idx) => {
                                        return <SearchElement idx={idx} history={history} {...el} />;
                                    })}
                            </div>
                        ))
                    )}
                </div>
                {count > 10 && (
                    <div className="search-pagination">
                        <SearchPagination
                            active={activePage - 1}
                            pageCount={Math.ceil(count / 10)}
                            onChange={e => {
                                setActivePage(e.selected + 1);
                                setLoading(true);
                                getSearchResults(
                                    query.get("search"),
                                    query.get("id"),
                                    e.selected + 1,
                                    activeBrands.join(",")
                                ).then(res => {
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
        search_results: catalog.search_results,
        search_categories: catalog.search_categories,
        brands: catalog.brands
    };
};

const mapDispatchToProps = {
    getSearchResults,
    getSearchResultsCategories,
    getBrands
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);

import React from 'react';
import ReactPaginate from 'react-paginate';
import PrevIcon from '@material-ui/icons/KeyboardArrowLeft';
import NextIcon from '@material-ui/icons/KeyboardArrowRight';
import './Pagination.scss';

const Pagination = ({active, pageCount, pageItemsCount, commentTotalCount, onChange}) => {
    return (
        <div className="pagination-container">
            <ReactPaginate
                forcePage={active}
                onPageChange={onChange}
                pageCount={pageCount}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                previousLabel={<PrevIcon/>}
                nextLabel={<NextIcon/>}
                containerClassName="pagination-list"
                pageClassName="pagination-item"
                pageLinkClassName="pagination-link"
                activeLinkClassName="pagination-link-active"
                breakClassName="pagination-ellipsis"
            />
        </div>
    );
};

export default Pagination;
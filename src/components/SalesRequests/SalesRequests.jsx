import React, { useState, useEffect } from "react";
import "./SalesRequests.scss";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Pagination from "../HelperComponents/Pagination/Pagination";
import FormControl from "@material-ui/core/FormControl";
import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";
import moment from "moment";
import { getOrders } from "../../actions/ordersActions";

const SalesRequests = ({ getOrders, data }) => {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [activePage, setActivePage] = useState(1);
  useEffect(() => {
    getOrders();
  }, []);
  useEffect(() => {
    getOrders(1, search, activeStatus ? activeStatus.value : null);
  }, [activeStatus]);
  const status_list = [
    { label: "New", value: "sales_review" },
    { label: "In review", value: "sales_to_approve" },
    { label: "Rejected", value: "sales_rejected" },
  ];
  const returnStatusName = (status) => {
    switch (status) {
      case "request":
        return "Request";
      case "sales_to_approve":
        return "In review";
      case "sales_review":
        return "New";
      case "sales_rejected":
        return "Rejected";
      default:
        return null;
    }
  };
  const changePage = (e) => {
    getOrders(e.selected + 1, search, activeStatus && activeStatus.value);
    setActivePage(e.selected + 1);
  };

  return (
    <div className="catalog_page content_block">
      <div className="custom_title_wrapper">
        <div className="title_page manager-title">Requests</div>
      </div>
      <div className="sales_list_content_page">
        <div className="table_panel">
          <div>
            <input
              placeholder="Search by customer…"
              value={search}
              onChange={(e) => {
                getOrders(
                  1,
                  e.target.value,
                  activeStatus && activeStatus.value
                );

                setActivePage(1);
                setSearch(e.target.value);
              }}
            />
            <FormControl className="select_wrapper">
              <SelectComponent
                value={activeStatus}
                options={status_list}
                change={(e) => {
                  setActivePage(1);
                  setActiveStatus(e);
                }}
                isClearable={true}
                isSearchable={false}
                placeholder="Select…"
              />
            </FormControl>
          </div>
        </div>
        <div className="order_page_table">
          <div className="table_container transactions_columns">
            <div className="table_header">
              <div className="table_row">
                <div className="row_item">Date/time</div>
                <div className="row_item">ID/PI#</div>
                <div className="row_item">Customer</div>
                <div className="row_item">Balance</div>
                <div className="row_item">Status</div>
                <div className="row_item" />
              </div>
            </div>
            <div className="table_body">
              {data &&
                data.results &&
                data.results.map(
                  ({
                    id: orderId,
                    date,
                    customer_name,
                    balance,
                    status,
                    created_by_id,
                    request,
                    payment_status,
                    tax_invoice_file,
                  }) => (
                    <div className="table_row" key={orderId}>
                      <div className="row_item">
                        {moment(date).format("DD/MM/YYYY HH:mm")}
                      </div>
                      <div className="row_item">
                        <Link to={`/main/sales-request/${orderId}/`}>
                          {request}
                        </Link>
                      </div>
                      <div className="row_item">{customer_name}</div>
                      <div className="row_item">{balance || "-"}</div>
                      <div className="row_item">
                        <div>
                          <p
                            className="status-name"
                            style={
                              status === "sales_rejected"
                                ? {
                                    color: "#E44B4B",
                                  }
                                : {}
                            }
                          >
                            {returnStatusName(status)}
                          </p>
                        </div>
                      </div>
                      <div className="row_item">
                        {(status === "sales_review" ||
                          status === "sales_rejected") && (
                          <span className="blue_dot" />
                        )}
                      </div>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>

        {data && data.count && data.count > 10 ? (
          <div className="pagination_info_wrapper">
            <div className="pagination_block">
              <Pagination
                active={activePage - 1}
                pageCount={data.count && Math.ceil(data.count / 10)}
                onChange={changePage}
              />
            </div>

            <div className="info">
              Displaying page 1 of 2, items 1 to 10 of 12
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = ({ orders }) => {
  return {
    data: orders.list,
  };
};

const mapDispatchToProps = { getOrders };

export default connect(mapStateToProps, mapDispatchToProps)(SalesRequests);

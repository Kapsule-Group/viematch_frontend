import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DemandsBlock from './DemandsBlock';
import Pagination from '../../HelperComponents/Pagination/Pagination';
import director from '../../../assets/image/director.svg';
import email from '../../../assets/image/email.svg';
import ok from '../../../assets/image/ok.svg';
import Path from '../../../assets/image/Path.svg';
import no from '../../../assets/image/no.svg';
import {
  getCertainCustomer,
  getUserInner,
  clearCustomerInner,
} from '../../../actions/customersActions';

import './CustomersInner.scss';
import Loader from '../../HelperComponents/ContentLoader/ContentLoader';
import SupplyScheduleBlock from '../../Subscriptions/SupplyScheduleBlock';
import CustumerInnerForm from '../CustumerInnerForm/CustumerInnerForm';

class CustomersInner extends Component {
  state = {
    activePage: 1,
    loading: true,
    tab: '0',
  };

  componentDidMount() {
    const {
      getUserInner,
      clearCustomerInner,
      match: {
        params: { id },
      },
    } = this.props;
    this.doRequest();
    clearCustomerInner();
    getUserInner(id);
  }

  doRequest = (page) => {
    const {
      getCertainCustomer,
      match: { params },
    } = this.props;
    getCertainCustomer(params.id, page ? page.selected + 1 : false).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        if (page) {
          this.setState({
            loading: false,
            activePage: page.selected + 1,
          });
        } else {
          this.setState({ loading: false, activePage: 1 });
        }
      }
    });
  };
  changeTab = (tab) => {
    this.setState({ tab, inputValue: '' });
  };

  render() {
    const { activePage, loading, tab } = this.state;
    const { certain_customer, info, match } = this.props;

    if (loading) return null;

    return (
      <div className="customers_inner_page content_block">
        <div className="custom_title_wrapper">
          <div className="link_req">
            <Link to="/main/customers">
              <img src={Path} alt="Path" />
              Customers
            </Link>
          </div>
          <div className="title_page">{info && info.customer_name && info.customer_name}</div>
          {/* <div className="info_custom">
                        <div>
                            <img src={email} alt="email" />
                            <span>{info.email}</span>
                        </div>
                        <div>
                            <img src={director} alt="director" />
                            {info.director}
                            <span>
                                {" "}
                                {info.director_email
                                    ? "/ " + info.director_email
                                    : ""}{" "}
                                {info.phone ? "/ " + info.phone : ""}
                            </span>
                        </div>
                    </div> */}
        </div>

        <CustumerInnerForm id={this.props.match.params.id} clinicInfo={info}></CustumerInnerForm>

        <div className="content_page">
          <div className="tab_customers">
            <button className={tab === '0' ? 'active' : ''} onClick={() => this.changeTab('0')}>
              stock
            </button>
            <button className={tab === '1' ? 'active' : ''} onClick={() => this.changeTab('1')}>
              subscriptions
            </button>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              {tab === '0' && (
                <div className="customers_inner_table">
                  <div className="table_container transactions_columns">
                    <div className="table_header">
                      <div className="table_row">
                        <div className="row_item">Name</div>
                        <div className="row_item">Code</div>
                        <div className="row_item">Qty</div>
                        <div className="row_item">Unit value</div>
                        <div className="row_item">Total value</div>
                        <div className="row_item">Auto supply</div>
                        <div className="row_item">Min. qty</div>
                        <div className="row_item">Auto supply qty</div>
                      </div>
                    </div>
                    <div className="table_body">
                      {certain_customer.count > 0 ? (
                        certain_customer.results.map((el, id) => (
                          <div className="table_row" key={id}>
                            <div className="row_item ">{el.name}</div>
                            <div className="row_item ">{el.code ? el.code : '-'}</div>
                            <div className="row_item ">{el.quantity}</div>
                            <div className="row_item ">
                              $
                              {new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 0,
                              }).format(el.price.toFixed(0))}
                            </div>
                            <div className="row_item ">
                              $
                              {new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 0,
                              }).format(el.total_price)}
                            </div>
                            <div className="row_item ">
                              {el.auto_supply ? (
                                <img src={ok} alt="ok" />
                              ) : (
                                <img src={no} alt="no" />
                              )}
                            </div>
                            <div className="row_item ">
                              {el.auto_supply ? el.min_supply_quantity : '-'}
                            </div>
                            <div className="row_item ">
                              {el.auto_supply ? el.supply_quantity : '-'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="table_row " style={{ color: 'grey' }}>
                          This list is empty
                        </div>
                      )}
                    </div>
                  </div>
                  {certain_customer.count > 10 && (
                    <div className="pagination_info_wrapper">
                      <div className="pagination_block">
                        <Pagination
                          active={activePage - 1}
                          pageCount={certain_customer.total_pages}
                          onChange={this.doRequest}
                        />
                      </div>
                      <div className="info">
                        Displaying page {activePage} of {certain_customer.total_pages}, items{' '}
                        {activePage * 10 - 9} to{' '}
                        {activePage * 10 > certain_customer.count
                          ? certain_customer.count
                          : activePage * 10}{' '}
                        of {certain_customer.count}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {tab === '1' && <DemandsBlock match={match} />}
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    certain_customer: state.customers.certain_customer,

    info: state.customers.info,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearCustomerInner,
      getCertainCustomer,
      getUserInner,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersInner);

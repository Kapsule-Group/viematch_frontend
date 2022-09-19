import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FormControl from '@material-ui/core/FormControl';
import { getOption } from '../../helpers/functions';
import { Link } from 'react-router-dom';
import Pagination from '../HelperComponents/Pagination/Pagination';
import SelectComponent from '../HelperComponents/SelectComponent/SelectComponent';
import print_mini from '../../assets/image/print_mini.svg';
import './Subscriptions.scss';
import { getDemandSubs } from './../../actions/subscriptionsActions';
import moment from 'moment';

class DemandsBlock extends Component {
  state = {
    activePage: 1,
    inputValue: '',
    searchValue: '',
    option: { label: getOption('All statuses'), value: null },
    option_list: [
      { label: getOption('All statuses'), value: null },
      { label: getOption('Requested'), value: 'requested' },
      { label: getOption('Active'), value: 'active' },
      { label: getOption('Canceled'), value: 'canceled' },
    ],
    subscriptions: [
      {
        date: '1/12/2021',
        time: '12:42',
        number: '123698',
        name: 'test 1 ',
        name_link: '/',
        amount: '1',
        price: '$11.90',
        period: 'week',
        status: 'Demand',
        customer: 'Cummeratafort',
        sku: '212416',
        sku_link: '/',
        number_link: '/subscriptions/123',
        id: '1',
      },
      {
        date: '1/12/2021',
        time: '12:42',
        number: '123698',
        name: 'test 1',
        customer: 'Cummeratafort',
        sku: '212416',
        sku_link: '/',
        name_link: '/',
        amount: '123',
        price: '$11.90',
        period: 'month',
        status: 'Confirmed',
        number_link: '/subscriptions/123',
        id: '2',
      },
      {
        date: '1/12/2021',
        time: '12:42',
        number: '123698',
        number_link: '/subscriptions/123',
        name: 'Oxygen N',
        name_link: '/',
        amount: '2020',
        price: '$11.90',
        period: 'year',
        status: 'Canceled',
        customer: 'Cummeratafort',
        sku: '212416',
        sku_link: '/',
        id: '3',
      },
    ],
  };

  componentDidMount() {
    const { getDemandSubs } = this.props;
    getDemandSubs();
  }

  changePage = (page) => {
    const { getDemandSubs } = this.props;
    const { option, searchValue } = this.state;
    this.setState({ activePage: page.selected + 1 });
    getDemandSubs(page.selected + 1, searchValue, option && option.value);
  };

  render() {
    const { searchValue, option_list, activePage, option, subscriptions } = this.state;
    const { subs, getDemandSubs } = this.props;
    const { results, count } = subs;

    return (
      <div className="demands_block">
        <div className="table_panel">
          <div className="block_search">
            <div className="input-group">
              <div className="search_info">
                <input
                  type="text"
                  className="search_info reset"
                  placeholder="Search…"
                  onChange={(e) => {
                    const {
                      target: { value },
                    } = e;
                    this.setState({
                      searchValue: value,
                      activePage: 1,
                    });
                    getDemandSubs(1, value, option && option.value);
                  }}
                  value={searchValue}
                />
              </div>
            </div>
          </div>
          <FormControl className="select_wrapper">
            <SelectComponent
              value={option}
              options={option_list}
              change={(e) => {
                this.setState({ option: e, activePage: 1 });
                getDemandSubs(1, searchValue, e.value);
              }}
              isClearable={false}
              isSearchable={false}
            />
          </FormControl>
        </div>
        <div className="demands_table">
          <div className="table_container transactions_columns">
            <div className="table_header">
              <div className="table_row">
                <div className="row">
                  <div className="row_item">Date/time</div>
                  <div className="row_item">#</div>
                  <div className="row_item">Customer</div>
                  <div className="row_item">Product</div>
                  <div className="row_item">SKU</div>
                  <div className="row_item">Amount</div>
                  <div className="row_item">Price</div>
                  <div className="row_item">Status</div>
                  <div className="row_item" />
                </div>
              </div>
            </div>
            <div className="table_body">
              {results && results.length > 0 ? (
                results &&
                results.map(
                  ({
                    date,
                    price_per_unit,
                    status,
                    period,
                    quantity,
                    id,
                    product,
                    user,
                  }) => (
                    <div className="table_row" key={id}>
                      <div className="row">
                        <div className="row_item time">
                          <span>{moment(date).format('DD/MM/YYYY')}</span>
                          <span>{moment(date).format('HH:mm')}</span>
                        </div>
                        <div className="row_item link">
                          <Link to={`/main/subscriptions/${id}`}>
                            <span>{id}</span>
                          </Link>
                        </div>
                        <div className="row_item semi_bold">{user && user.username}</div>
                        <div className="row_item link">
                          <Link to={`/main/products?code=${product && product.code}`}>
                            <span>{product && product.name}</span>
                          </Link>
                        </div>
                        <div className="row_item link">
                          <Link to={`/main/products?code=${product && product.code}`}>
                            <span>{product && product.code}</span>
                          </Link>
                        </div>
                        <div className="row_item amount">
                          <span>{quantity}</span> <p>per</p> <span>{period}</span>
                        </div>
                        <div className="row_item">
                          {new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 0,
                          }).format(Number(price_per_unit).toFixed(0))}
                        </div>
                        <div className="row_item status">
                          <div
                            className={
                              status === 'requested'
                                ? 'demand'
                                : status === 'active'
                                ? 'confirmed'
                                : 'canceled'
                            }>
                            <span>
                              {status === 'requested'
                                ? 'demand'
                                : status === 'active'
                                ? 'confirmed'
                                : 'canceled'}
                            </span>
                          </div>
                        </div>
                        <div className="row_item">
                          {/* <button className="print">
                                                        <img
                                                            src={print_mini}
                                                            alt="print"
                                                        />
                                                    </button> */}
                        </div>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <div className="table_row">
                  <div className="row">no items</div>
                </div>
              )}
              {count > 10 && (
                <div className="pagination_info_wrapper">
                  <Pagination
                    active={activePage - 1}
                    pageCount={Math.ceil(count / 10)}
                    onChange={this.changePage}
                  />

                  <div className="info">
                    Displaying page {activePage} of {Math.ceil(count / 10)}, items{' '}
                    {activePage * 10 - 9} to {activePage * 10 > count ? count : activePage * 10} of{' '}
                    {count}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    subs: state.subscriptions.demandSubs,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getDemandSubs }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DemandsBlock);

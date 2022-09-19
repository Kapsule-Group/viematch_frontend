import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import './Subscriptions.scss';
import { getCalendar } from './../../actions/subscriptionsActions';
import moment from 'moment';

class SupplyScheduleBlock extends Component {
  state = {
    supply_schedule: [
      {
        date: 'Dec 2021',
        day: 'Thu',
        id: '1',
        number: '31',
        customer: [
          {
            id: '3',
            customer_link: '/',
            customer_name: 'Cummeratafort',
            product: 'Oxygen Nebulizer Mask Pediatric Size/S',
          },
        ],
      },
      {
        date: 'Dec 2021',
        day: 'Sat',
        id: '2',
        number: '18',
        customer: [
          {
            id: '4',
            customer_link: '/',
            customer_name: 'East Daynabury',
            product: 'Surgical Sutures Vicry rapid 3-0',
          },
          {
            id: '5',
            customer_link: '/',
            customer_name: 'East Daynabury',
            product: 'Oxygen Nasal Cannulas Adult',
          },
        ],
      },
      {
        date: 'Dec 2021',
        day: 'Thu',
        id: '4',
        number: '9',
        customer: [
          {
            id: '6',
            customer_link: '/',
            customer_name: 'Cummeratafort',
            product: 'Oxygen Nebulizer Mask Pediatric Size/S',
          },
        ],
      },
    ],
  };

  componentDidMount() {
    const { getCalendar } = this.props;
    getCalendar();
  }

  render() {
    const { supply_schedule } = this.state;
    const { calendar } = this.props;

    const data =
      calendar &&
      calendar.reduce((acc, el) => {
        const found = acc.findIndex((p) => p.date === el.date);

        if (found === -1) {
          acc.push({
            date: el.date,
            customer: [el.subscription],
          });
        } else {
          acc[found] = {
            date: acc[found].date,
            customer: [...acc[found].customer, el.subscription],
          };
        }
        return acc;
      }, []);

    return (
      <div className="supply_schedule_block">
        <div className="supply_schedule_table">
          <div className="table_container transactions_columns">
            <div className="table_header">
              <div className="table_row">
                <div className="row">
                  <div className="row_item">Date</div>
                  <div className="row_item">
                    <div>Customer</div>
                    <div>Product</div>
                    <div>Amount</div>
                    <div>Price</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table_body">
              {data && data.length > 0 ? (
                data &&
                data.map(({ date, customer }, idx) => (
                  <div className="table_row" key={idx}>
                    <div className="row">
                      <div className="row_item date">
                        <span>{moment(date).format('DD')}</span>{' '}
                        <span>{moment(date).format('MMM YYYY')}</span>{' '}
                        <p>{moment(date).format('ddd')}</p>
                      </div>
                      <div className="row_item">
                        {customer.map(({ id, product, user, quantity, price_per_unit }) => (
                          <div key={id}>
                            <div className=" link">
                              <Link to={`/main/customers/inner/${user && user.id}`}>
                                <span>{user && user.username}</span>
                              </Link>
                            </div>
                            <div className="row_item">{product && product.name}</div>
                            <div>{quantity}</div>
                            <div>
                              $
                              {new Intl.NumberFormat('en-US').format(
                                Number(price_per_unit).toFixed(0),
                              )}
                            </div>
                            
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="table_row">
                  <div className="row">no items</div>
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
    calendar: state.subscriptions.calendar,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getCalendar }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SupplyScheduleBlock);

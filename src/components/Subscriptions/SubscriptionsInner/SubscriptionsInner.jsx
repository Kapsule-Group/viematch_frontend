import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import DialogComponent from '../../HelperComponents/DialogComponent/DialogComponent';
import Path from '../../../assets/image/Path.svg';
import print from '../../../assets/image/print_img.svg';
import './SubscriptionsInner.scss';
import {
  getSingleSub,
  postSub,
  cancelSub,
  deleteSub,
} from './../../../actions/subscriptionsActions';
import { toast } from 'react-toastify';
import { toastErrors } from '../../../helpers/functions';
import { createNumberMask } from 'redux-form-input-masks';
import NumberFormat from 'react-number-format';

import RenderField from './../../HelperComponents/RenderField/RenderField';
class SubscriptionsInner extends Component {
  state = {
    openDialogConfirm: false,
    openDialogCancel: false,
    openDialogDelete: false,
    number: '',
    customer: '',
    name: '',
    code: '',
    quantity: '',
    period: '',
    price: '',
  };

  componentDidMount() {
    const {
      getSingleSub,
      match: {
        params: { id },
      },
    } = this.props;
    getSingleSub(id).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        const data = res.payload.data;
        this.setState({
          number: data.id,
          customer: data.user && data.user.username,
          name: data.product && data.product.name,
          code: data.product && data.product.code,
          quantity: data.quantity,
          period: data.period,
        });
        if (data.price_per_unit) {
          this.setState({ price: data.price_per_unit });
        }
      }
    });
  }

  toggleDialogConfirm = () => {
    this.setState(({ openDialogConfirm }) => ({
      openDialogConfirm: !openDialogConfirm,
    }));
  };
  toggleDialogCancel = () => {
    this.setState(({ openDialogCancel }) => ({
      openDialogCancel: !openDialogCancel,
    }));
  };

  toggleDialogDelete = () => {
    this.setState(({ openDialogDelete }) => ({
      openDialogDelete: !openDialogDelete,
    }));
  };
  render() {
    const {
      openDialogConfirm,
      openDialogCancel,
      openDialogDelete,
      number,
      customer,
      name,
      code,
      quantity,
      period,
      price,
    } = this.state;
    const {
      singleSub,
      postSub,
      cancelSub,
      deleteSub,
      match: {
        params: { id },
      },
      history,
    } = this.props;
    const { status } = singleSub;
    const currencyMask = createNumberMask({
      decimalPlaces: 0,
      locale: 'en-US',
    });

    return (
      <div className="subscriptions_page_inner content_block">
        <div className="title_block">
          <div>
            <div className="link_req">
              <Link to="/main/subscriptions">
                <img src={Path} alt="Path" />
                subscriptions
              </Link>
            </div>
            <div className="title_page">Subscriptions #{id}</div>
          </div>
          {/* <div>
                        <button><img src={print} alt="print"/> Print</button>
                    </div> */}
        </div>
        <div className="content_page">
          <div className="descriptions">general info</div>
          <div className="general">
            <div className="input_block">
              <span>#</span>
              <input type="text" value={number} disabled />
            </div>
            <div className="input_block">
              <span>Customer</span>
              <input type="text" value={customer} disabled />
            </div>
          </div>
          <div className="descriptions">product</div>
          <div className="product">
            <div className="input_block">
              <span>Name</span>
              <input type="text" value={name} disabled />
            </div>
            <div className="input_block">
              <span>SKU</span>
              <input type="text" value={code} disabled />
            </div>
            <div className="input_block">
              <span>Amount</span>
              <input type="text" value={quantity} disabled />
            </div>

            <div className="input_block">
              <span>Period</span>
              <input type="text" value={period} disabled />
            </div>
            <div className="input_block">
              <span>Price</span>

              <NumberFormat
                value={Number(price).toFixed(0)}
                thousandSeparator={','}
                decimalSeparator={'.'}
                onChange={(e, value) => {
                  this.setState({ price: e.target.value.split(',').join('') });
                }}
                component={RenderField}
              />

              <p>$</p>
            </div>
          </div>
          <div className="btn_block">
            {status === 'requested' && (
              <>
                <button
                  className="blue_btn_bg"
                  onClick={() => {
                    this.toggleDialogConfirm();
                  }}>
                  Confirm
                </button>
                <button
                  className="blue_btn"
                  onClick={() => {
                    if (price) {
                      postSub(id, {
                        price_per_unit: price,
                        proceed: false,
                      }).then((res) => {
                        if (res.payload && res.payload.status && res.payload.status === 200) {
                          history.push('/main/subscriptions');
                        }
                      });
                    } else {
                      toast('Price is required!', {
                        progressClassName: 'red-progress',
                      });
                    }
                  }}>
                  Save changes
                </button>
              </>
            )}
            {(status === 'requested' || status === 'active') && (
              <button className="red_btn" onClick={this.toggleDialogDelete}>
                Cancel
              </button>
            )}
            {status === 'canceled' && (
              <button className="red_btn" onClick={this.toggleDialogDelete}>
                Delete
              </button>
            )}
          </div>
        </div>
        <DialogComponent
          open={openDialogConfirm}
          onClose={() => {
            this.toggleDialogConfirm();
          }}>
          <div className="subscription_inner_dialog">
            <div className="title">Confirm subscription</div>
            <div className="descriptions">
              You are about to confirm a subscription request from <span>{customer}</span> to
              receive {quantity} unit of <span>{name}</span> every <span>{period}</span> at the
              following price:
            </div>
            <div className="block_field">
              <span>Price</span>
              <input
                type="number"
                value={price}
                onChange={(e) => this.setState({ price: e.target.value })}
              />
              <p>$</p>
            </div>
            <div className="btn_wrapper">
              <button className="cancel_btn" onClick={this.toggleDialogConfirm}>
                cancel
              </button>
              <button
                className="blue_btn"
                onClick={() => {
                  if (price) {
                    postSub(id, {
                      price_per_unit: price,
                      proceed: true,
                    }).then((res) => {
                      if (res.payload && res.payload.status && res.payload.status === 200) {
                        history.push('/main/subscriptions');
                      } else {
                        res.error &&
                          res.error.response &&
                          res.error.response.data &&
                          res.error.response.data.non_field_errors &&
                          toast(res.error.response.data.non_field_errors[0], {
                            progressClassName: 'red-progress',
                          });
                      }
                    });
                  } else {
                    toast('Price is required!', {
                      progressClassName: 'red-progress',
                    });
                  }
                }}>
                Confirm
              </button>
            </div>
          </div>
        </DialogComponent>
        <DialogComponent
          open={openDialogCancel}
          onClose={() => {
            this.toggleDialogCancel();
          }}>
          <div className="subscription_inner_dialog">
            <div className="title">Cancel subscription</div>
            <div className="descriptions">
              You are about to cancel a subscription request from <span>{customer}</span> to receive{' '}
              {quantity} unit of <span>{name}</span> every <span>{period}</span>. Are you sure?
            </div>

            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.toggleDialogCancel();
                }}>
                cancel
              </button>
              <button
                className="blue_btn"
                onClick={() =>
                  cancelSub(id).then((res) => {
                    if (res.payload && res.payload.status && res.payload.status === 200) {
                      history.push('/main/subscriptions');
                    }
                  })
                }>
                Confirm
              </button>
            </div>
          </div>
        </DialogComponent>
        <DialogComponent
          open={openDialogDelete}
          onClose={() => {
            this.toggleDialogDelete();
          }}>
          <div className="subscription_inner_dialog">
            <div className="title">Delete subscription</div>
            <div className="descriptions">
              You are about to delete a subscription request from <span>{customer}</span> to receive{' '}
              {quantity} unit of <span>{name}</span> every <span>{period}</span>. Are you sure?
            </div>

            <div className="btn_wrapper">
              <button
                className="cancel_btn"
                onClick={() => {
                  this.toggleDialogDelete();
                }}>
                cancel
              </button>
              <button
                className="red_btn"
                onClick={() =>
                  deleteSub(id).then((res) => {
                    if (res.payload && res.payload.status && res.payload.status === 204) {
                      history.push('/main/subscriptions');
                    }
                  })
                }>
                Delete
              </button>
            </div>
          </div>
        </DialogComponent>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    singleSub: state.subscriptions.singleSub,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getSingleSub, postSub, cancelSub, deleteSub }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionsInner);

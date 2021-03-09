import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { stockSettings } from '../../actions/stockActions';

import './StockSettings.scss';


class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            limits: { ...props.stock_settings },
            error: `"Out of stock" value must be less or equal to "Low stock" value`
        };
    }

    changeLimit = (status, limit, event) => {
        let { limits, prevLimits } = this.state;
        let { stockSettings, stock_settings } = this.props;

        switch (status) {
            case 'dec':
                this.setState(({ limits }) => ({ limits: { ...limits, [limit]: +limits[limit] - 1 >= 0 ? Number(limits[limit]) - 1 : Number(limits[limit]) } }))
                break;
            case 'inc':
                this.setState(({ limits }) => ({ limits: { ...limits, [limit]: +limits[limit] + 1 } }))
                break;
            case 'input':
                let newValue = event.target.value.replace(/\D/g, '');
                this.setState({ limits: { ...limits, [limit]: newValue === '' ? '' : newValue < 0 ? 0 : Number(newValue) } })
                break;
            case 'clear':
                this.setState({ prevLimits: limits, limits: { ...limits, [limit]: '' } })
                break;
            case 'unFocus':
                this.setState({ limits: { ...limits, [limit]: event.target.value === '' ? prevLimits[limit] || stock_settings[limit] : event.target.value } })
                break;
            case 'accept':
                stockSettings('PATCH', limits).then(res => {
                    if (res.error) {
                        this.setState({ error: res.error.response.data.non_field_errors });
                        //setTimeout(() => {this.setState({ error: '' });}, 5000);
                    }
                });
                break;
        }

    }

    render() {
        const { loading, limits, error } = this.state;
        //const { stock_setting_error } = this.props;
        if (loading) return null;
        return (
            <div className="user_management_page content_block">
                <div className="title_page">Stock Settings</div>
                <div className="content_page limits">
                    <span>Low stock is less than or equal</span>
                    <div class="stepper-input">
                        <div className={`change_limit_wrapper`}>
                            <button onClick={() => this.changeLimit('dec', 'low')}>-</button>

                            <input type="text" onFocus={() => this.changeLimit('clear', 'low')} onBlur={(e) => this.changeLimit('unFocus', 'low', e)} onChange={(e) => this.changeLimit('input', 'low', e)} min={0} value={limits[`low`]} />

                            <button onClick={() => this.changeLimit('inc', 'low')}>+</button>
                        </div>
                    </div>
                    <br />
                    <span>Out of stock is Less than</span>
                    <div class="stepper-input">
                        <div className={`change_limit_wrapper`}>
                            <button onClick={() => this.changeLimit('dec', 'out')}>-</button>

                            <input type="text" onFocus={() => this.changeLimit('clear', 'out')} onBlur={(e) => this.changeLimit('unFocus', 'out', e)} onChange={(e) => this.changeLimit('input', 'out', e)} min={0} value={limits[`out`]} />

                            <button onClick={() => this.changeLimit('inc', 'out')}>+</button>
                        </div>
                    </div>

                    <button className="blue_btn" onClick={() => this.changeLimit('accept')}>Save</button>
                    <div className={`error`}>{limits[`out`] > limits[`low`] ? error : ''}</div>
                </div>

            </div>
        );
    }
}

function mapStateToProps({ stock }) {
    return {
        //stock_setting_error: stock.stock_setting_error
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        stockSettings
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);

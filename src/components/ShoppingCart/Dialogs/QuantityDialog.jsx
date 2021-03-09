import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import RenderField from "../../HelperComponents/RenderField/RenderField";
import { patchCartQuantity, getStock } from "../../../actions/stockActions";

class QuantityDialog extends Component {

    state = {
    };

    submitForm = (data) => {
        const { patchCartQuantity, toggler, product_id, sign,reset, doRequest } = this.props;
        let { activePage } = this.props;
        let obj = {...data};
        console.log(obj)
        if (activePage === 0) {
            activePage = 1
        } 
        if(sign === '-'){
            obj.quantity = `-${data.quantity}`;
        }
        
        patchCartQuantity(product_id, obj).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                reset('QuantityDialog');
                toggler();
                
                doRequest(activePage);
            }
        });
    };


    render(){
        const {
            toggler,
            state,
            product_name,
            product_quantity,
            handleSubmit,
            sign,
            fail_err,
            startValue,
            reset,

        } = this.props;
        return (

            <DialogComponent
                open={state}
                onClose={() => {toggler(); reset('QuantityDialog')}}
            >
                <div className="quantity_dialog">
                    <div className="title">
                        <span>Change product quantity</span>
                    </div>
                    <div className="descriptions">
                        <span>You are about to change available amount of <span className='name'>{product_name}</span>. <br/>Enter the quantity of the required product to proceed.</span>
                    </div>
                    <form onSubmit={handleSubmit(this.submitForm)}>
                        <div className="block_field">
                            <span>Quantity</span>
                            <span className='back_error'>{fail_err && fail_err.quantity}</span>
                            {sign === '-' ?
                                <Field
                                    id='idx'
                                    name='quantity'
                                    type="number"
                                    max={product_quantity}
                                    component={RenderField}
                                    placeholder="Type here..."
                                    value={startValue}
                                /> :
                                <Field
                                    id='idx'
                                    name='quantity'
                                    type="number"
                                    component={RenderField}
                                    placeholder="Type here..."
                                    value={startValue}
                                />
                            }
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={(e) => {e.preventDefault(); toggler(); reset('QuantityDialog')}}>Cancel</button>
                            <button className="blue_btn">{sign === '-' ? 'remove' : 'add'}</button>
                        </div>
                    </form>
                </div>
            </DialogComponent>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.quantity) {
        errors.quantity = 'This field is required'
    }else if(values.quantity && /-/.test(values.quantity)){
        errors.quantity = 'Ensure this value is greater than or equal to 0'
    }
    return errors
};

QuantityDialog = reduxForm({
    form: 'QuantityDialog',
    validate
})(QuantityDialog);

function mapStateToProps(state) {
    return{
        fail_err: state.stock.error,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchCartQuantity,
        getStock
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuantityDialog);

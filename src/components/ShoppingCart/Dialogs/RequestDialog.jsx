import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import { bindActionCreators } from 'redux';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import RenderField from "../../HelperComponents/RenderField/RenderField";
import { postRequest } from "../../../actions/stockActions";

class RequestDialog extends Component {
    state = {
    };

    submitForm = (data) => {
        const { product_id, postRequest, toggler,reset, product_image, doRequest } = this.props;
        data.inventory_id = product_id;
        data.incart=true;
        data.image = product_image;
        console.log(data)
        postRequest(data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 201) {
                doRequest();
                toggler();
                reset('RequestDialog');
            }
        })

    };



    render(){
        const { toggler, state, product_name, handleSubmit, startValue, reset} = this.props;

        return (
            <DialogComponent
                open={state}
                onClose={() => { toggler(); reset('RequestDialog');
                }}
                
            >
                <div className="quantity_dialog">
                    
                    <div className="title">
                        <span>Request supply</span>
                    </div>
                    <div className="descriptions">
                        <span>You are about to send a request for supply of <span className='name'>{product_name}</span>.<br/>Enter the quantity of the required product to proceed.</span>
                    </div>
                    <form onSubmit={handleSubmit(this.submitForm)}>
                        <div className="block_field">
                            <span>Quantity</span>
                            <Field
                                id='ixd'
                                name="quantity"
                                type="number"
                                component={RenderField}
                                placeholder="Type here..."
                                value={startValue}
                            />
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={(e) => {e.preventDefault(); toggler(); reset('RequestDialog')}}>Cancel</button>
                            <button className="green_btn">send request</button>
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
    }else if(values.quantity && values.quantity <= 0){
        errors.quantity = 'Ensure this value is greater than 0'
    }
    return errors
};

RequestDialog = reduxForm({
    form: 'RequestDialog',
    validate
})(RequestDialog);

function mapStateToProps(state) {
    return{

    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postRequest,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestDialog);

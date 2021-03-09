import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import { getStock, postRequest } from "../../../actions/stockActions";
//import { patchQuantity } from "../../../actions/activityActions";

class CartDialogue extends Component {

    state = {
    };


    submitForm = (data) => {
        const { postRequest, request, toggler, activePage, doRequest } = this.props;
        postRequest(request, data).then(res => {
            console.log(request)
            if (res.payload && res.payload.status && res.payload.status === 200) {
                console.log(res.payload)
                toggler();
                doRequest(activePage);
                //doRequest( {selected: activePage});

            }
            console.log(res)
        });

    };


    render() {
        const {
            state,
            toggler,
            request,
            handleSubmit,
            fail_err,
            startValue,
            reset,

        } = this.props;
        return (

            <DialogComponent
                open={state}
                onClose={toggler}
            >
                <div className="quantity_dialog">
                    <div className="title">
                        <span>Submit Multiple Request</span>
                    </div>
                    <div className="descriptions">
                        <span>We will process your request shortly</span>
                    </div>
                    <form onSubmit={handleSubmit(this.submitForm)}>
                        <div className="block_field">
                            <span className='back_error'>{fail_err && fail_err.request}</span>
                           
                            <div className="btn_wrapper">
                                <button className="cancel_btn" onClick={(e) => { e.preventDefault(); toggler(); reset('CartDialogue') }}>Cancel</button>
                                <button className="blue_btn">Confirm</button>
                            </div> 
                        </div>
                    </form>
                </div>
            </DialogComponent>
        );
    }
}

CartDialogue = reduxForm({
    form: 'CartDialogue',

})(CartDialogue);

function mapStateToProps(state) {
    return {
        fail_err: state.stock.error,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postRequest,
        getStock
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CartDialogue);

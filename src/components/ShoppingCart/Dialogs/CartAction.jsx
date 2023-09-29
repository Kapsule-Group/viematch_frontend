import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import { postRequest } from "../../../actions/stockActions";

class CartDialogue extends Component {
    state = {};

    submitForm = data => {
        const { requestid, postRequest, toggler, reset, doRequest, product_image } = this.props;
        data.image = product_image;
        data.incart = false;
        let { activePage } = this.props;
        if (activePage === 0) {
            activePage = 1;
        }
        data.inventory_id = requestid;
        data.requestid = requestid;

        postRequest(data).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 201) {
                reset("CartDialogue");
                toggler();
                doRequest(activePage);
            }
        });
    };

    render() {
        const { toggler, state, handleSubmit, reset, loading } = this.props;

        return (
            <DialogComponent
                open={state}
                onClose={() => {
                    toggler();
                    reset("CartDialogue");
                }}
            >
                <div className="quantity_dialog">
                    <div className="title">
                        <span>Submit Request</span>
                    </div>
                    <div className="descriptions">
                        <span>Your request will be processed soon </span>
                    </div>
                    <form onSubmit={handleSubmit(this.submitForm)}>
                        <div className="btn_wrapper">
                            <button
                                className="cancel_btn"
                                onClick={e => {
                                    e.preventDefault();
                                    toggler();
                                    reset("CartDialogue");
                                }}
                            >
                                Cancel
                            </button>
                            <button disabled={loading} className={loading ? "unactive_btn" : "green_btn"}>
                                send request
                            </button>
                        </div>
                    </form>
                </div>
            </DialogComponent>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.requestid) {
        errors.requestid = "This field is required";
    }
    return errors;
};

CartDialogue = reduxForm({
    form: "CartDialogue",
    validate
})(CartDialogue);

function mapStateToProps(state) {
    return {
        fail_err: state.stock.error,
        loading: state.stock.loading
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            postRequest
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(CartDialogue);

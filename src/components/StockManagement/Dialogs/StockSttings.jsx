import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import { bindActionCreators } from 'redux';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import RenderField from "../../HelperComponents/RenderField/RenderField";
import { postRequestSettings } from "../../../actions/stockActions";

class StockSttings extends Component {
    state = {
    };

    submitForm = (data) => {
        const { amount, toggler, reset} = this.props;
        data.amount = amount;
        console.log(data)
        postRequestSettings(data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 201) {
                toggler();
                reset('StockSttings');
            }
        })

    };



    
}


StockSttings = reduxForm({
    form: 'StockSttings'
})(StockSttings);

function mapStateToProps(state) {
    return{

    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postRequestSettings,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StockSttings);

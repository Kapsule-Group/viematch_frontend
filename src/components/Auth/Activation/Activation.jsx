import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import DefaultButton from '../../Buttons/DefaultButton/DefaultButton';

// import { postActivation } from "../../../actions/authActions";

class Activation extends Component {
    state = {
      success: false
    };
    
    componentDidMount() {
        const { postActivation, location:{search}, history } = this.props;
        // if(search !== "") {
        //     let params = new URLSearchParams(search.substring(1));
        //     let obj = {
        //         user_id: params.get('user_id'),
        //         timestamp: params.get('timestamp'),
        //         signature: params.get('signature')
        //     };
        //     postActivation(obj).then(res => {
        //         if(res.payload && res.payload.status && res.payload.status === 200) {
        //             this.setState({success: true});
        //         } else {
        //             history.push('/auth/activation');
        //         }
        //     })
        // }
    }
    
    render(){
        const { success } = this.state;
        return (
            <div className="auth-block_wrapper form_start">
                <h3 className="auth-block_head">Активация</h3>
                {success ?
                    <Fragment>
                        <p>Ваш аккаунт успешно активирован! <br/> Теперь вы можете войти в свою учетную запись.</p>
                        <DefaultButton
                            variant="contained"
                            classes="full_btn_width"
                            type="link"
                            to="/auth"
                        >
                            Войти
                        </DefaultButton>
                    </Fragment>
                    :
                    <p>Мы отправили письмо с ссылкой для активации <br/> аккаунта на указанный Вами электронный адрес.</p>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Activation);
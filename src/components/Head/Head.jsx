import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import logout from '../../assets/image/logout.svg';
import './Head.scss';


class Head extends Component {

    handleOut = () => {
        const { history } = this.props;
        localStorage.clear();
        history.push('/auth/sign-in');
    };

    render(){
        const name = localStorage.username;
        const email = localStorage.email;
        return (
            <header className="header_wrapper">
                <div>
                    <div className="name">{name}</div>
                    <div className="email">{email}</div>
                </div>
                <button className="logout" onClick={this.handleOut}>
                    <img src={logout} alt="logout"/>
                </button>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return{

    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Head);
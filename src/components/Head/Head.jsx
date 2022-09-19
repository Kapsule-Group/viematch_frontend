import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import logout from "../../assets/image/logout.svg";
import "./Head.scss";
import { getRole } from "../../actions/authActions";
import logo_sidebar from "../../assets/image/new logo.svg";
import { Link } from "react-router-dom";

class Head extends Component {
    componentDidMount() {
        const { getRole } = this.props;
        getRole();
    }
    handleOut = () => {
        const { history } = this.props;
        localStorage.clear();
        history.push("/login");
    };

    render() {
        const {
            data: { role, username },
        } = this.props;

        return (
            <header className="header_wrapper">
                <div>
                    <Link to="/main/sales-requests" className="logo_head">
                        <img src={logo_sidebar} alt="head_sidebar" />
                    </Link>
                </div>
                <div className="right-wrapper">
                    <div className="name">{username}</div>
                    <button className="logout" onClick={this.handleOut}>
                        <img src={logout} alt="logout" />
                    </button>
                </div>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {
        data: state.auth.data,
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getRole }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Head);

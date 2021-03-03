import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import logout from '../../assets/image/logout.svg';
import './Head.scss';
import { Dropdown } from 'react-bootstrap';
import on from '../../assets/image/profile_pic.jpg';


class Head extends Component {

    handleOut = () => {
        const { history } = this.props;
        localStorage.clear();
        history.push('/auth/sign-in');
    };

    render() {
        const name = localStorage.username;
        //const email = localStorage.email;

        return (
            <header className="header_wrapper">
                <div>

                    <div className="email">{name}</div>
                </div>
                {/* <button className="logout" onClick={this.handleOut}>
                    <img src={logout} alt="logout"/>
                </button> */}
                <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Header>
                            <img src={on} style={{ width: '200px', height: '200px' }} alt={""} /><br />
                            <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{localStorage.email} </span>
                        </Dropdown.Header>

                        <Dropdown.Divider />
                        <Dropdown.Item href="/">Profile</Dropdown.Item>
                        <Dropdown.Item href="/main/user-management">Accounts</Dropdown.Item>
                        <Dropdown.Item href="/main/stock-management">Stock managment settings</Dropdown.Item>
                        <Dropdown.Item href="/main/activity">Activity Log</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={this.handleOut}>Sign Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {

    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Head);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import logo_sidebar from '../../assets/image/new logo.svg';
import catalog from '../../assets/image/catalog.svg';
import products from '../../assets/image/products.svg';
import dashboard from '../../assets/image/dashboard.svg';
import user_management from '../../assets/image/user_management.svg';
import activity from '../../assets/image/activity.svg';
import './Panel.scss';

class Panel extends Component {

    state = {
        reloading: false
    };

    componentDidUpdate(prevProps) {
        prevProps.location !== this.props.location && this.setState({ reloading: true })
    }
    
    render() {
        const role = localStorage.role;
        return (
            <div className="panel_wrapper">
                <div className="panel">
                    <Link to="/main/dashboard" className="logo_panel">
                        <img src={logo_sidebar} alt="logo_sidebar"/>
                    </Link>
                    <div className="block_link">
                        {role !== 'user' && <NavLink to="/main/dashboard"><img src={dashboard} alt="dashboard"/></NavLink>}
                        {role !== 'user' && <NavLink to="/main/catalog"><img src={catalog} alt="catalog"/></NavLink>}
                        <NavLink to="/main/stock-management"><img src={products} alt="products"/></NavLink>
                        {role === 'clinic' && <NavLink to="/main/user-management"><img src={user_management} alt="user_management"/></NavLink>}
                        {role !== 'user' && <NavLink to="/main/activity"><img src={activity} alt="activity"/></NavLink>}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    }
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
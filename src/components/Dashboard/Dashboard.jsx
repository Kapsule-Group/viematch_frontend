import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
    getClinicLog,
    getClinicDashBoard
} from "../../actions/dashboardActions";
import arrow_forward from '../../assets/image/arrow_forward copy.svg';
import './Dashboard.scss';

class Dashboard extends Component {
    state = {
        loading: true
    };

    componentDidMount(){
        const { getClinicLog, getClinicDashBoard } = this.props;
        getClinicLog().then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                getClinicDashBoard().then(res => {
                    if(res.payload && res.payload.status && res.payload.status === 200) {
                        this.setState({ loading: false });
                    }
                })
            }
        })
    }

    render(){
        const { clinicDashBoard, clinicLog } = this.props;
        const { loading } = this.state;
        if (loading) return null;
        return (
            <div className="dashboard_page content_block">
                <div className="title_page">Dashboard</div>
                <div className="info_block">
                    <div>
                        <p className="descriptions">total amount</p>
                        <span><span className={'small_price'}>RWF</span>{clinicDashBoard.total_amount}</span>

                    </div>
                    <div className="center_block">
                        <Link to={{pathname:"/main/stock-management", state:{tab: 0}}}  className="green_text">
                            products in stock
                            <img className="arrow" src={arrow_forward} alt="arrow_forward"/>
                        </Link>
                        <div className="info">
                            <span>{clinicDashBoard.in_stock}</span>
                        </div>
                    </div>
                    <div>
                        <Link to={{pathname:"/main/stock-management", state:{tab: 1}}} className="red_text">
                            products out of stock
                            <img className="arrow" src={arrow_forward} alt="arrow_forward"/>
                        </Link>
                        <div className="info">
                            <span>{clinicDashBoard.out_stock}</span>
                        </div>
                    </div>
                </div>
                <div className="dashboard_block" >
                    <div className="panel_dashboard">
                        <span>recent actions</span>
                        <Link to="/main/activity">view all</Link>
                    </div>
                    <div className="dashboard_info_wrapper" >
                        {clinicLog.length > 0 ?
                            clinicLog.map(el => (
                                <div key={el.id}>
                                    <span>{moment(el.date).format('DD/MM/YYYY HH:mm')}</span>
                                    {/*<p><span className="name_user">Ivan Simpson</span> added <span className="count_prod">10</span> items of <span className="name_prod">Product1</span></p>*/}
                                    <div dangerouslySetInnerHTML={{ __html: el.text }} />
                                </div>
                            ))
                            :
                            <h3>The list is empty.</h3>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        clinicLog: state.dashboard.clinicLog,
        clinicDashBoard: state.dashboard.clinicDashBoard
    }
};

const mapDispatchToProps = {
    getClinicLog,
    getClinicDashBoard
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

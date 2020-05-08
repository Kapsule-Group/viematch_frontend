import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Pagination from '../HelperComponents/Pagination/Pagination';
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '../HelperComponents/SelectComponent/SelectComponent';
import {getActivity} from "../../actions/activityActions";
import './Activity.scss';


class Activity extends Component {

    state = {
        activePage: 1,
        loading: true,
        activity:
            {label:
                <div className="status">
                    <div>All activities</div>
                </div>
                , value: ""
            },
        activities_list: [
            {label:
                <div className="status">
                    <div>All activities</div>
                </div>
                , value: ""
            },
            {label:
                <div className="status">
                    <div>Auto supply request</div>
                </div>
                ,value: "auto_supply_requests"},
            {label:
                <div className="status">
                    <div>Manual supply request</div>
                </div>
                ,value: "supply_requests"},
            {label:
                <div className="status">
                    <div>Product addition</div>
                </div>
                , value: "add_products"},
            {label:
                <div className="status">
                    <div>Product removal</div>
                </div>
                , value: "remove_products"},
        ],
    };

    componentDidMount(){
        this.doRequest();
    }

    componentWillUnmount(){
        clearTimeout(this.timeout);
    }

    doRequest = (page = 1) => {
        const {  getActivity } = this.props;
        const {  activity } = this.state;
        getActivity(activity.value, page).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({ loading: false });
            }
        })
    };

    changePage = (page) => {
        this.setState({ activePage: page.selected + 1});
        this.doRequest(page.selected + 1);
    };

    handleChange = name => event => {
        // const status = { status: event.value }
        this.setState({ [name]: event });
        this.timer = this.timeout = setTimeout(() => {
            this.doRequest();
        }, 0);
    };

    render(){

        const {activePage, activities_list, activity, loading } = this.state;
        const { activityLog } = this.props;
        if (loading) return null;
        return (
            <div className="activity_page content_block">
                <div className="title_page">Activity</div>
                <div className="activity_block">
                    <div className="panel_activity">
                        <FormControl className="select_wrapper">
                            <SelectComponent
                                value={activity}
                                options={activities_list}
                                // loading={!isArray(projects_list)}
                                change={this.handleChange('activity', )}
                                isClearable="false"
                                isSearchable = {false}
                            />
                        </FormControl>
                    </div>
                    <div className="activity_info_wrapper">
                        {activityLog.results && activityLog.results.length > 0 ?
                            activityLog.results.map(el => (
                                <div  key={el.id}>
                                    <div>
                                        <span>{moment(el.date).format('DD/MM/YYYY HH:mm')}</span>
                                        {/*<p><span className="name_user">Ivan Simpson</span> added <span className="count_prod">10</span> items of <span className="name_prod">Product1</span></p>*/}
                                        <div dangerouslySetInnerHTML={{ __html: el.text }} />
                                    </div>

                                </div>
                            ))
                            :
                            <h3>The list is empty.</h3>
                        }

                    </div>
                    {activityLog.count > 10 &&
                    <div className="pagination_info_wrapper">
                        <div className="pagination_block">

                            <Pagination
                                current={activePage}
                                pageCount={activityLog.total_pages}
                                onChange={this.changePage}
                            />

                        </div>
                        <div className="info">Displaying page {activePage} of {activityLog.total_pages},
                            items {activePage * 10 - 9} to {activePage * 10 > activityLog.count ? activityLog.count : activePage * 10} of {activityLog.count}</div>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return{
        activityLog: state.activity.activityLog,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getActivity
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity);

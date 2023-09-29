import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getFeaturedProd, getTrendsProd } from "../../actions/storeAction";

class Featured extends Component {
    constructor(props) {
        super(props);
        this.featuredProd();
    }

    state = {
        featuredProd: []
    };

    componentDidMount() {
        this.featuredProd();
    }

    componentWillUnmount() {
        this.featuredProd();
    }

    featuredProd = () => {
        const { getTrendsProd } = this.props;

        getTrendsProd().then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    featuredProd: res.payload.data
                });
            }
        });
    };

    render() {
        const role = localStorage.role;

        return <div></div>;
    }
}

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getTrendsProd
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Featured);

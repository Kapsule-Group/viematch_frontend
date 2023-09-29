import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import { getPhone, getListPhone } from "./../../../actions/UserActions";
import { ReactComponent as WhatsAppIcon } from "../../../assets/image/WhatsApp.svg";
import { ReactComponent as ArrowIcon } from "../../../assets/image/link_arrow.svg";
import "./WhatsApp.scss";

class WhatsApp extends Component {
    state = {
        open: false,
        loading: false
    };

    componentDidMount() {
        const { getListPhone, getPhone } = this.props;
        const token = localStorage.getItem("token");
        if (token) {
            getPhone();
        } else {
            getListPhone();
        }
    }

    toggleDialog = () => {
        this.setState(({ open }) => ({
            open: !open
        }));
    };

    render() {
        const { open } = this.state;
        const token = localStorage.getItem("token");
        const { listPhone, phone } = this.props;

        return (
            <>
                {token ? (
                    phone.phone_number != null ? (
                        <div className="btn_whats_app">
                            <a href={`https://wa.me/${phone.phone_number.split("+")[1]}`} target="_blank">
                                <WhatsAppIcon />
                            </a>
                        </div>
                    ) : null
                ) : (
                    listPhone &&
                    listPhone.map(el =>
                        el.phone_number === null || el.phone_number === "" ? null : (
                            <button className="btn_whats_app" onClick={this.toggleDialog}>
                                <WhatsAppIcon />
                            </button>
                        )
                    )
                )}
                <div></div>

                <DialogComponent open={open} onClose={this.toggleDialog}>
                    <div className="dialog_whats_app">
                        <div className="title">Choose your region</div>
                        {listPhone &&
                            listPhone.map(el =>
                                el.phone_number === null || el.phone_number === "" ? null : (
                                    <a href={`https://wa.me/${el.phone_number.split("+")[1]}`} target="_blank">
                                        {el.name}
                                        <ArrowIcon />
                                    </a>
                                )
                            )}
                    </div>
                </DialogComponent>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        listPhone: state.users.listPhone,
        phone: state.users.phone
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getPhone,
            getListPhone
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(WhatsApp);

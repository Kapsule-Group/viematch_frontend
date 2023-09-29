import React, { Fragment } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "../../components/Auth/Login/Login";
import SignUp from "../../components/Auth/Register/SignUp";
import SignUpStepSecond from "../../components/Auth/Register/SignUpStepSecond";
import SignUpStepThird from "../../components/Auth/Register/SignUpStepThird";
import FirstStep from "../../components/Auth/PasswordRecovery/FirstStep/FirstStep";
import SecondStep from "../../components/Auth/PasswordRecovery/SecondStep/SecondStep";
import ThirdStep from "../../components/Auth/PasswordRecovery/ThirdStep/ThirdStep";
import FourthStep from "../../components/Auth/PasswordRecovery/FourthStep/FourthStep";
import Logo from "../../assets/image/new logo.svg";
import bgImg from "../../assets/image/graph.png";
import { Link } from "react-router-dom";

import "./AuthContainer.scss";

const AuthContainer = props => {
    const { match } = props;
    if (!!localStorage.token) return <Redirect to="/main/catalog" />;

    return (
        <Fragment>
            <main className="auth_container">
                <div className="auth-box">
                    <div className="auth_bg">
                        <Link to="/main/catalog" className="auth_logo">
                            <img src={Logo} alt="logo" />
                        </Link>
                        <img className="bgImg" src={bgImg} alt="bgImg" />
                    </div>
                    <div className="auth_content">
                        <Switch>
                            <Route path={`${match.url}`} exact component={Login} />
                            <Route path={`${match.url}/sign-in`} exact component={Login} />
                            <Route path={`${match.url}/sign-up`} exact component={SignUp} />
                            <Route path={`${match.url}/sign-up/second-step`} exact component={SignUpStepSecond} />
                            <Route path={`${match.url}/sign-up/third-step`} exact component={SignUpStepThird} />
                            <Route path={`${match.url}/password-recovery/first-step`} exact component={FirstStep} />
                            <Route path={`${match.url}/password-recovery/second-step`} exact component={SecondStep} />
                            <Route path={`${match.url}/reset-password/approve`} component={ThirdStep} />
                            <Route path={`${match.url}/password-recovery/fourth-step`} exact component={FourthStep} />
                            <Route render={() => <p>Not found</p>} />
                        </Switch>
                    </div>
                </div>
            </main>
        </Fragment>
    );
};

export default AuthContainer;

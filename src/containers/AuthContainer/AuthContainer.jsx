import React, {Fragment} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from "../../components/Auth/Login/Login";
import Logo from '../../assets/image/new logo.svg';
import bgImg from '../../assets/image/graph.png';

import './AuthContainer.scss';


const AuthContainer = (props) => {
    const { match } = props;
    if(!!localStorage.token) return <Redirect to="/main" />;
    return (
        <Fragment>
            <main className="auth_container">
                <div className="auth-box">
                    <div className="auth_bg">
                        <div className="auth_logo">
                            <img src={Logo} alt="logo"/>
                        </div>
                        <img className="bgImg" src={bgImg} alt="bgImg"/>
                    </div>
                    <div className="auth_content">
                        <Switch>
                            <Route path={match.url} exact component={Login} />
                            <Route render={()=>(<p>Not found</p>)} />
                        </Switch>
                    </div>
                </div>
            </main>
        </Fragment>
    );
};

export default AuthContainer;
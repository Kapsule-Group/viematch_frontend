import React, {Fragment} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Store from "../../components/Store/Store";
import Cart from "../../components/Store/Cart";
import Product from "../../components/Store/Product";
import Listing from "../../components/Store/Listing";




const Storeurls = (props) => {
    const { match } = props;


    return (

        <Switch>
            <Route path={`${match.url}`} exact component={Store} />
            <Route path={`${match.url}/shopping-cart`} exact component={Cart} />
            <Route path={`${match.url}/product/:id`} exact component={Product} />
            <Route path={`${match.url}/:type/:value`} exact component={Listing} />
            <Route render={()=>(<p>Not found</p>)} />
        </Switch>

    );
};

export default Storeurls;

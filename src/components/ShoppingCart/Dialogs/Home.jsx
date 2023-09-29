import React, { Fragment } from "react";
import { useAlert } from "react-alert";
import { connect } from "react-redux";

const Home = j => {
    const alert = useAlert();

    return (
        <Fragment>
            {/*<button
                onClick={() => {
                    alert.show("Oh look, an alert!");
                }}
            >
                Show Alert
      </button>
            <button
                onClick={() => {
                    alert.error("You just broke something!");
                }}
            >
                Oops, an error
            </button>*/}
            <button
                onClick={() => {
                    alert.success("We have received yoour request");
                }}
            >
                Submit Request
            </button>
        </Fragment>
    );
};

export default Home;

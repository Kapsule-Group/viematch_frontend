import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";

// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

const styles = {
    root: {
        fontFamily: "Roboto",
        marginBottom: "20px"
    }
};

const Snack = ({ open, handleSnack, message, type }) => (
    <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleSnack}
        anchorOrigin={{
            vertical: "top",
            horizontal: "center"
        }}
        message={message}
    >
        {type === "warning" ? (
            <Alert onClose={handleSnack} severity="warning">
                {message}
            </Alert>
        ) : type === "error" ? (
            <Alert onClose={handleSnack} severity="error">
                {message}
            </Alert>
        ) : type === "info" ? (
            <Alert onClose={handleSnack} severity="info">
                {message}
            </Alert>
        ) : (
            <Alert onClose={handleSnack} severity="success">
                {message}
            </Alert>
        )}
    </Snackbar>
);

export default withStyles(styles)(Snack);

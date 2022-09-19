import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./ExpansionPanel.scss";

export default function SimpleExpansionPanel({
    children,
    message,
    anounce = "Additonal notes",
}) {
    return (
        <div className="expansion">
            <ExpansionPanel className="expansion_panel">
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    className="head"
                >
                    <div className="table_row">{children}</div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className="body">
                    <div className="info_wrapper">
                        <div>
                            {!message ? (
                                <div>There are no additional notes</div>
                            ) : (
                                <React.Fragment>
                                    <span>{anounce}</span>
                                    <div>{message}</div>
                                </React.Fragment>
                            )}
                        </div>
                        {/*<p className="no_info">{message}</p>*/}
                    </div>
                    <div />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    );
}

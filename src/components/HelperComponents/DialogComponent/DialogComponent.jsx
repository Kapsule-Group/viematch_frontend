import React from "react";
import Dialog from "@material-ui/core/Dialog";
import "./DialogComponent.scss";
import CloseDialogIcon from "../../../assets/image/close.svg";
const DialogComponent = ({ open, onClose, children, longDialog, onClick, paper_classes = "", root_classes = "" }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            classes={{
                root: `default_dialog_root ${root_classes}`,
                paper: `paper_custom_dialog ${paper_classes}`
            }}
        >
            <div onClick={onClick} className={longDialog ? "dialog_wrapper dialog_wrapper_long" : "dialog_wrapper"}>
                <button onClick={onClose} className="dialog_close_button">
                    <img src={CloseDialogIcon} alt="close icon" />
                </button>
                {children}
            </div>
        </Dialog>
    );
};

export default DialogComponent;

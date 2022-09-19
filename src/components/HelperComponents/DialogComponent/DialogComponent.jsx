import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import './DialogComponent.scss';
import CloseDialogIcon from '../../../assets/image/close.svg';
const DialogComponent = ({open, onClose, onClick, children, longDialog}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            classes={{
                root: 'default_dialog_root',
                paper:'paper_custom_dialog'
            }}
        >
            <div onClick={onClick} className={longDialog ? "dialog_wrapper dialog_wrapper_long" : "dialog_wrapper" }>
                <button
                    onClick={onClose}
                    className="dialog_close_button"

                >
                    <img src={CloseDialogIcon} alt="close icon"/>
                </button>
                {children}
            </div>
        </Dialog>
    );
};

export default DialogComponent;
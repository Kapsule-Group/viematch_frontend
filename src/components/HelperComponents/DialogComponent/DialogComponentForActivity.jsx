import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import './DialogComponent.scss';
import CloseDialogIcon from '../../../assets/image/close.svg';
const DialogComponent = ({ open, onClose, children, longDialog, onClick }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            classes={{
                root: 'default_dialog_root',
                paper: 'paper_custom_dialog'
            }}
        >
            {children}
        </Dialog>
    );
};

export default DialogComponent;
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import './DefaultButton.scss';

const DefaultButton = ({children, variant = 'contained', type = 'button', to, formAction, disabled, onClick, loading, classes = ''}) => {
    if(type === 'link') {
        return (
            <div className="default_button_wrapper">
                <Button
                    component={Link}
                    to={to}
                    disabled={disabled}
                    variant={variant}
                    classes={{
                        root: `default_button default_button_${variant} ${classes}`
                    }}
                >
                    {children}
                </Button>
            </div>
        );
    } else  {
        return (
            <div className="default_button_wrapper">
                <Button
                    type={formAction ? 'submit' : 'button'}
                    variant={variant}
                    disabled={disabled}
                    onClick={onClick}
                    classes={{
                        root: `default_button default_button_${variant} ${classes}`
                    }}
                >
                    {loading
                        ? <CircularProgress size={24} />
                        : children
                    }
                </Button>
            </div>
        );
    }

};

export default DefaultButton;
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './TransitionedBlock.scss';

const TransitionedBlock = ({children, classes = ''}) => (
    <ReactCSSTransitionGroup
        transitionName="page-animation"
        component="div"
        className={classes}
        transitionAppear={true}
        transitionAppearTimeout={900}
        transitionEnterTimeout={700}
        transitionLeaveTimeout={500}>
        {children}
    </ReactCSSTransitionGroup>
);

export default TransitionedBlock;
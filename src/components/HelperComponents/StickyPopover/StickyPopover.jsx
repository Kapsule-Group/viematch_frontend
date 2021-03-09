import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Overlay, Popover } from "react-bootstrap";

function StickyPopover({ delay, onMouseEnter, children, component, placement }) {
    const [showPopover, setShowPopover] = useState(false);
    const childNode = useRef(null);
    let setTimeoutConst = null;

    useEffect(() => {
        return () => {
            if (setTimeoutConst) {
                clearTimeout(setTimeoutConst);
            }
        };
    });

    const handleMouseEnter = () => {
        setTimeoutConst = setTimeout(() => {
            setShowPopover(true);
            onMouseEnter();
        }, delay);
    };

    const handleMouseLeave = () => {
        clearTimeout(setTimeoutConst);
        setShowPopover(false);
    };

    const displayChild = React.Children.map(children, child =>
        React.cloneElement(child, {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            ref: node => {
                childNode.current = node;
                const { ref } = child;
                if (typeof ref === "function") {
                    ref(node);
                }
            }
        })
    )[0];

    return (
        <>
            {displayChild}
            <Overlay show={showPopover} placement={placement} target={childNode} shouldUpdatePosition>
                <Popover
                    onMouseEnter={() => {
                        setShowPopover(true);
                    }}
                    onMouseLeave={handleMouseLeave}
                    id="tooltip-top"
                >
                    <Popover.Content>{component}</Popover.Content>
                </Popover>
            </Overlay>
        </>
    );
}

StickyPopover.propTypes = {
    children: PropTypes.element.isRequired,
    delay: PropTypes.number,
    onMouseEnter: PropTypes.func,
    component: PropTypes.node.isRequired,
    placement: PropTypes.string.isRequired
};

StickyPopover.defaultProps = {
    delay: 0,
    onMouseEnter: () => {}
};

export default StickyPopover;

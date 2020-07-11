import React from 'react';
import PropTypes from 'prop-types';
import Bevis from 'bevis';

import './loader.scss';

const block = new Bevis('loader');

const Loader = ({show}) => {
    return show ? (
            <div className={block.name()}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xlink="http://www.w3.org/1999/xlink"
                    style={{margin: 'auto', background: 'none', display: 'block', shapeRendering: 'auto'}}
                    width="100px"
                    height="100px"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                >
                    <circle
                        cx="50"
                        cy="50"
                        fill="none"
                        stroke="#c1c1c1"
                        strokeWidth="10"
                        r="35"
                        strokeDasharray="164.93361431346415 56.97787143782138"
                        transform="rotate(268.995 50 50)"
                    >
                        <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1s"
                        values="0 50 50;360 50 50"
                        keyTimes="0;1" />
                    </circle>
                </svg>
            </div>
        ) : null;
};

Loader.propTypes = {show: PropTypes.bool};

Loader.defaultProps = {show: true};

export default Loader;

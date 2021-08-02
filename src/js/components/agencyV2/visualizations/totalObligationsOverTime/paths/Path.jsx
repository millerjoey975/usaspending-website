/**
 * Path.jsx
 * Created by Jonathan Hill 04/13/21
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    data: PropTypes.array,
    description: PropTypes.string,
    xScale: PropTypes.func,
    yScale: PropTypes.func,
    xProperty: PropTypes.string,
    yProperty: PropTypes.string,
    height: PropTypes.number,
    padding: PropTypes.shape({
        left: PropTypes.number,
        right: PropTypes.number,
        bottom: PropTypes.number,
        top: PropTypes.number
    })
};

const Path = ({
    data = [],
    description,
    xScale = () => {},
    yScale = () => {},
    xProperty = 'endDate',
    yProperty = 'obligated',
    height,
    padding
}) => {
    const [d, setD] = useState('');

    useEffect(() => {
        if (xScale && yScale) {
            setD(data.reduce((path, currentItem, i) => {
                if (i === 0) {
                    const updatedPath = `${path}${xScale(currentItem[xProperty]) + padding.left},${height - yScale(currentItem[yProperty]) - padding.bottom}`;
                    return updatedPath;
                }
                const updatedPath = `${path}L${xScale(currentItem[xProperty]) + padding.left},${height - yScale(currentItem[yProperty]) - padding.bottom}`;
                return updatedPath;
            }, 'M'));
        }
    }, [data, xScale, yScale]);

    return (
        <g tabIndex="0">
            <desc>{`The linear line representative of the following periods, dates, and obligations: ${description}`}</desc>
            <path className="path" d={d} />
        </g>
    );
};

Path.propTypes = propTypes;
export default Path;

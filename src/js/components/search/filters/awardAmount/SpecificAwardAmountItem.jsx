/**
 * SpecificAwardAmountItem
 * Created by michaelbray on 3/7/17.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Analytics from 'helpers/analytics/Analytics';

import IndividualSubmit from 'components/search/filters/IndividualSubmit';

import * as AwardAmountHelper from 'helpers/awardAmountHelper';
import AwardAmountItem from './AwardAmountItem';

const propTypes = {
    searchSpecificRange: PropTypes.func
};

export default class SpecificAwardAmountItem extends React.Component {
    static logAmountRangeEvent(range) {
        Analytics.event({
            category: 'Search Page Filter Applied',
            action: 'Applied Award Amount Range Filter',
            label: range
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            min: 0,
            max: 0,
            hideCustom: true
        };

        this.searchSpecificRange = this.searchSpecificRange.bind(this);
    }

    componentDidMount() {
        this.setupInputListeners();
    }

    setupInputListeners() {
        [this.minValue, this.maxValue].forEach((target) => {
            target.addEventListener('keydown', (e) => {
                // Enter
                if (e.keyCode === 13) {
                    e.preventDefault();
                    this.searchSpecificRange();
                }
            });
        });
    }

    searchSpecificRange() {
        const min = AwardAmountHelper.ensureInputIsNumeric(this.minValue.value);
        let max = AwardAmountHelper.ensureInputIsNumeric(this.maxValue.value);

        if (min >= max) {
            // If minimum is larger than maximum, take minimum value
            max = 0;
        }

        this.setState({
            min,
            max,
            hideCustom: false
        });

        this.props.searchSpecificRange([min, max]);

        // Analytics
        const formattedRange = AwardAmountHelper.formatAwardAmountRange([min, max]);
        SpecificAwardAmountItem.logAmountRangeEvent(formattedRange);
    }

    render() {
        const hide = this.state.hideCustom ? ' hide' : '';

        return (
            <div className="specific-award-amount">
                <hr className="specific-award-amount-divider" />
                <div
                    className={`award-amount-item-wrapper${hide}`}
                    role="status">
                    <AwardAmountItem
                        {...this.props}
                        values={[this.state.min, this.state.max]}
                        key="award-range-specific"
                        rangeID="specific"
                        toggleSelection={this.searchSpecificRange.bind(this)} />
                </div>

                <div className="specific-award-amount-wrapper">
                    <span>$</span>
                    <input
                        type="text"
                        placeholder="Min"
                        className="specific-award-min"
                        ref={(input) => {
                            this.minValue = input;
                        }} />
                    <span>to</span>
                    <input
                        type="text"
                        placeholder="Max"
                        className="specific-award-max"
                        ref={(input) => {
                            this.maxValue = input;
                        }} />
                    <IndividualSubmit
                        className="award-amount-submit"
                        onClick={this.searchSpecificRange}
                        label="Filter by custom award amount range" />
                </div>
            </div>
        );
    }
}

SpecificAwardAmountItem.propTypes = propTypes;

/**
 * GrantDetails.jsx
 * Created by Lizzie Dabbs 03/06/2017
 **/

import React from 'react';
import moment from 'moment';
import DetailRow from '../DetailRow';

const propTypes = {
    selectedAward: React.PropTypes.object,
    seeAdditional: React.PropTypes.func
};

export default class GrantDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            description: "",
            date: "",
            place: "",
            typeDesc: "",
            programName: "",
            programDesc: ""
        };

        // bind functions
        this.setValues = this.setValues.bind(this);
    }

    componentWillReceiveProps() {
        this.setValues(this.props.selectedAward);
    }

    setValues() {
        let yearRangeTotal = "";
        let description = null;
        const award = this.props.selectedAward;
        const latestTransaction = award.latest_transaction;

        // Date Range
        const startDate = moment(award.period_of_performance_start_date, 'M/D/YYYY');
        const endDate = moment(award.period_of_performance_current_end_date, 'M/D/YYYY');
        const yearRange = endDate.diff(startDate, 'year');
        if (yearRange !== 0) {
            if (yearRange === 1) {
                yearRangeTotal = `${yearRange} year)`;
            }
            else {
                yearRangeTotal = `(${yearRange} years)`;
            }
        }
        const popDate = `${award.period_of_performance_start_date} -
            ${award.period_of_performance_current_end_date} ${yearRangeTotal}`;

        // Location
        let popPlace = "";
        let popZip = null;
        if (award.pop_zip) {
            popZip = award.pop_zip;
        }
        if (award.pop_city && award.pop_state_province && popZip) {
            popPlace = `${award.pop_city}, ${award.pop_state_province} ${popZip}`;
        }
        else if (award.pop_city && !award.pop_state_province && popZip) {
            popPlace = `${award.pop_city} ${popZip}`;
        }
        else if (award.pop_city && !award.pop_state_province && !popZip) {
            popPlace = award.pop_city;
        }
        else if (!award.pop_city && award.pop_state_province && popZip) {
            popPlace = `${award.pop_state_province} ${popZip}`;
        }
        else if (!award.pop_city && award.pop_state_province && !popZip) {
            popPlace = award.pop_state_province;
        }
        if (award.description) {
            description = award.description;
        }
        else {
            description = "Not Available";
        }

        // CFDA Data
        // TODO: get program description (objectives) for latest transaction
        const programName = `${latestTransaction.assistance_data.cfda_number} -
        ${latestTransaction.assistance_data.cfda_title}`;
        const programDescription = '';

        this.setState({
            description,
            programName,
            date: popDate,
            place: popPlace,
            typeDesc: award.type_description,
            programDesc: programDescription
        });
    }

    render() {
        return (
            <div className="contract-wrapper">
                <div className="contract-details">
                    <h3>Grant Details</h3>
                    <hr
                        className="results-divider"
                        ref={(hr) => {
                            this.sectionHr = hr;
                        }} />
                    <table>
                        <tbody>
                            <DetailRow
                                title="Description"
                                value={this.state.description} />
                            <DetailRow
                                title="Period of Performance"
                                value={this.state.date} />
                            <DetailRow
                                title="Primary Place of Performance"
                                value={this.state.place} />
                            <DetailRow
                                title="Grant Type"
                                value={this.state.typeDesc} />
                            <DetailRow
                                title="CFDA Program"
                                value={this.state.programName} />
                            <DetailRow
                                title="CFDA Program Description"
                                value={this.state.programDesc} />
                        </tbody>
                    </table>
                </div>
                <div className="see-more">
                    <button onClick={this.props.seeAdditional}>See Additional Details</button>
                </div>
            </div>
        );
    }
}
GrantDetails.propTypes = propTypes;

/**
 * RecipientOverview.jsx
 * Created by Lizzie Salita 8/24/17
 */

import React from 'react';
import PropTypes from 'prop-types';

import { CaretRight, Glossary } from 'components/sharedComponents/icons/Icons';

const propTypes = {
    recipient: PropTypes.object,
    showModal: PropTypes.func
};

export default class RecipientOverview extends React.Component {
    render() {
        const recipient = this.props.recipient.overview;
        let label = (
            <div className="recipient-overview__label">
                Recipient
            </div>
        );
        let viewChildren = null;
        let parent = null;
        if (recipient.level === 'C') {
            // This is a child recipient
            label = (
                <div className="recipient-overview__label recipient-overview__label_child">
                    Child Recipient
                </div>
            );
            let parentDuns = '';
            if (recipient.parentDuns) {
                parentDuns = `(${recipient.parentDuns})`;
            }
            parent = (
                <div className="recipient-overview__parent">
                    This recipient is a child of <a className="recipient-overview__parent-link" href={`#/recipient/${recipient.parentId}`}>{recipient.parentName} {parentDuns}</a>
                </div>
            );
        }
        else if (recipient.level === 'P') {
            // This is a parent recipient
            label = (
                <a
                    href={`#/recipient/${this.props.recipient.id}/?glossary=parent-duns`}
                    className="recipient-overview__label recipient-overview__label_parent">
                    Parent Recipient <Glossary />
                </a>
            );
            viewChildren = (
                <button
                    className="recipient-overview__children-button"
                    onClick={this.props.showModal}>
                    View child recipients <CaretRight />
                </button>
            );
        }

        // Format the location data
        let address = (
            <td>Address not provided in source system</td>
        );
        if (recipient.location.streetAddress || recipient.location.regionalAddress || recipient.location.fullCongressionalDistrict) {
            address = (
                <td>
                    <div>{recipient.location.streetAddress}</div>
                    <div>{recipient.location.regionalAddress}</div>
                    <div>{recipient.location.fullCongressionalDistrict}</div>
                </td>
            );
        }

        return (
            <div
                id="recipient-overview"
                className="recipient-section recipient-overview">
                <h2 className="recipient-overview__title">
                    {recipient.name}
                </h2>
                <hr className="results-divider" />
                <div className="recipient-overview__content">
                    {parent}
                    <div className="recipient-overview__children">
                        {label}
                        {viewChildren}
                    </div>
                    <div className="recipient-section__row">
                        <div className="recipient-section__viz totals">
                            <h3 className="recipient-overview__heading">
                                Total Transactions
                            </h3>
                            <div className="totals__amount">
                                {recipient.totalAmount}
                            </div>
                            <div className="totals__awards">
                                from <span className="state-overview__total">{recipient.totalTransactions}</span> transactions
                            </div>
                        </div>
                        <div className="recipient-section__viz details">
                            <h3 className="recipient-overview__heading">
                                Details
                            </h3>
                            <table className="details__table">
                                <tbody>
                                    <tr>
                                        <th>DUNS</th>
                                        <td>{recipient.duns}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        {address}
                                    </tr>
                                    <tr>
                                        <th>Business Types</th>
                                        <td>
                                            {recipient.businessTypes.map((type, i) =>
                                                <div key={i}>{type}</div>)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

RecipientOverview.propTypes = propTypes;

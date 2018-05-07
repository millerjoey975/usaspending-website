/**
 * SubawardsTable.jsx
 * Created by Kevin Li 4/17/17
 */

import React from 'react';
import PropTypes from 'prop-types';

import { measureTableHeader } from 'helpers/textMeasurement';

import IBTable from 'components/sharedComponents/IBTable/IBTable';

import subawardFields from 'dataMapping/contracts/subawardTable';

import TransactionTableGenericCell from 'components/award/table/cells/TransactionTableGenericCell';
import SubawardsHeaderCell from 'components/award/subawards/cells/SubawardsHeaderCell';
import SummaryPageTableMessage from 'components/award/table/SummaryPageTableMessage';


const rowHeight = 40;
// setting the table height to a partial row prevents double bottom borders and also clearly
// indicates when there's more data
const tableHeight = 10.5 * rowHeight;

const propTypes = {
    inFlight: PropTypes.bool,
    tableWidth: PropTypes.number,
    award: PropTypes.object,
    subawards: PropTypes.array,
    sort: PropTypes.object,
    loadNextPage: PropTypes.func,
    changeSort: PropTypes.func,
    tableInstance: PropTypes.string
};

export default class SubawardsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            xPos: 0,
            yPos: 0
        };

        this.headerCellRender = this.headerCellRender.bind(this);
        this.bodyCellRender = this.bodyCellRender.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tableInstance !== this.props.tableInstance) {
            if (this.tableComponent) {
                this.tableComponent.reloadTable();
            }
        }
    }

    headerCellRender(columnIndex) {
        const column = subawardFields.table._order[columnIndex];
        const isLast = columnIndex === subawardFields.table._order.length - 1;
        const displayName = subawardFields.table[column];

        const defaultSort = subawardFields.defaultSortDirection[column];

        return (
            <SubawardsHeaderCell
                label={displayName}
                column={column}
                order={this.props.sort}
                defaultDirection={defaultSort}
                isLastColumn={isLast}
                setSubawardSort={this.props.changeSort} />
        );
    }

    bodyCellRender(columnIndex, rowIndex) {
        const column = subawardFields.table._order[columnIndex];
        const isLast = columnIndex === subawardFields.table._order.length - 1;

        const item = this.props.subawards[rowIndex];

        return (
            <TransactionTableGenericCell
                rowIndex={rowIndex}
                data={`${item[column]}`}
                column={column}
                isLastColumn={isLast} />
        );
    }

    buildTable() {
        let totalWidth = 0;

        const columns = subawardFields.table._order.map((column, i) => {
            const isLast = i === subawardFields.table._order.length - 1;

            const displayName = subawardFields.table[column];
            const calculatedWidth = measureTableHeader(displayName);
            let columnWidth = Math.max(calculatedWidth, subawardFields.columnWidths[column]);
            if (isLast) {
                // make it fill out the remainder of the width necessary
                const remainingSpace = this.props.tableWidth - totalWidth;

                columnWidth = Math.max(remainingSpace, columnWidth);
            }

            const columnX = totalWidth;

            totalWidth += columnWidth;

            return {
                x: columnX,
                width: columnWidth,
                name: column
            };
        });

        return {
            columns,
            width: totalWidth
        };
    }

    render() {
        const tableValues = this.buildTable();

        let loadingClass = '';
        if (this.props.inFlight) {
            loadingClass = 'loading';
        }

        const totalValue = this.props.award.subawardTotal;

        let message = null;
        if (this.props.subawards.length === 0 && !this.props.inFlight) {
            message = (<SummaryPageTableMessage message="No Sub-Awards found" />);
        }

        return (
            <div>
                <div className="subaward-totals">
                    <div className="total-item">
                        <span className="total-label">
                            Total Number of Sub-Awards:&nbsp;
                        </span>
                        <span className="total-value">
                            {this.props.award.subawardCount}
                        </span>
                    </div>
                    <div className="total-item">
                        <span className="total-label">
                            Total Sub-Award Amount:&nbsp;
                        </span>
                        <span className="total-value">
                            {totalValue}
                        </span>
                    </div>
                </div>
                <div
                    className={`subawards-table ${loadingClass}`}
                    ref={(div) => {
                        this.wrapperDiv = div;
                    }}>
                    <IBTable
                        rowHeight={rowHeight}
                        rowCount={this.props.subawards.length}
                        headerHeight={50}
                        contentWidth={tableValues.width}
                        bodyWidth={this.props.tableWidth}
                        bodyHeight={tableHeight}
                        columns={tableValues.columns}
                        onReachedBottom={this.props.loadNextPage}
                        headerCellRender={this.headerCellRender}
                        bodyCellRender={this.bodyCellRender}
                        ref={(table) => {
                            this.tableComponent = table;
                        }} />
                </div>
                {message}
            </div>
        );
    }
}

SubawardsTable.propTypes = propTypes;

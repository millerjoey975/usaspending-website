/**
 * TotalObligationsOverTimeVisualizationHelper.js
 * Created by Jonathan Hill 04/09/2021
 */

export const getYDomain = (data, agencyBudget) => {
    const obligatedAmounts = data.map((x) => x.obligated);
    if (agencyBudget) obligatedAmounts.push(agencyBudget);
    return [0, Math.max(...obligatedAmounts)];
};

export const getMilliseconds = (date) => date.getTime();

const converISODateToDate = (date) => {
    const dateString = date.split('T')[0].split('-');
    const newDate = new Date(parseInt(dateString[0], 10), parseInt(dateString[1], 10) - 1, parseInt(dateString[2], 10));
    return newDate;
};

export const addSubmissionEndDatesToBudgetaryResources = (budgetaryResources, submissionPeriods, fy) => {
    const yearlySubmissions = submissionPeriods.filter((period) => `${period.submission_fiscal_year}` === fy);
    return budgetaryResources
        .map((budgetaryResource) => {
            /* eslint-disable camelcase */
            const yearlySubmissionEndDateByPeriod = yearlySubmissions.find((submission) => submission.submission_fiscal_month === budgetaryResource.period)?.period_end_date;
            if (yearlySubmissionEndDateByPeriod) {
                return {
                    ...budgetaryResource,
                    /* eslint-disable camelcase */
                    endDate: getMilliseconds(new Date(converISODateToDate(yearlySubmissionEndDateByPeriod)))
                };
            }
            return null;
        })
        .filter((budgetaryResource) => budgetaryResource);
};

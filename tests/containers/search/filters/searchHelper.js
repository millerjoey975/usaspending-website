import { mockLocationAutocomplete } from '../../../redux/reducers/search/mock/mockRecipient';
import { mockAwardResponse } from '../../../redux/reducers/award/mockAward';
import { accountProgramActivities }
    from '../../../redux/reducers/account/mockAccountProgramActivities';


// Fetch Locations for Autocomplete
export const fetchLocations = () => (
    {
        promise: new Promise((resolve) => {
            process.nextTick(() => {
                resolve({
                    data: mockLocationAutocomplete
                });
            });
        }),
        cancel: jest.fn()
    }
);

// Fetch Individual Awards
export const fetchAward = () => (
    {
        promise: new Promise((resolve) => {
            process.nextTick(() => {
                resolve({
                    data: mockAwardResponse
                });
            });
        }),
        cancel: jest.fn()
    }
);

// Fetch Program Activities
export const fetchProgramActivities = () => (
    {
        promise: new Promise((resolve) => {
            process.nextTick(() => {
                resolve({
                    data: accountProgramActivities
                });
            });
        }),
        cancel: jest.fn()
    }
);
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../UpdateUtility';

const initialState = {
    finished: false,
    sales: {}
}

const salesFinished = (state, action) => {
    //console.log("ACTION.SALES", action.sales);
    return updateObject(state, {
        finished: true,
        sales: action.sales,
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FINISHED_DOWNLOAD_SALES:
            return salesFinished(state, action);
        default:
            return state;
    }
}

export default reducer
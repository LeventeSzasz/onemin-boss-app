import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../UpdateUtility';

const initialState = {
    options: [],
    loading: true,
    productHasOptions: false,

    finished: false, //sales
    sales: {}
}

const startLoadingOptions = (state, action) => {
    return updateObject(state, {
        loading: true
    })
}

const finishLoadingOptions = (state, action) => {
    //módosítjuk az options statenek a szarjait :D
    //console.log("optionreducer: ", action.filteredOptionList, action.productHasOptions);
    return updateObject(state, { loading: false, options: action.filteredOptionList, productHasOptions: action.productHasOptions })
}

const salesFinished = (state, action) => {
    //console.log("ACTION.SALES", action.sales);
    return updateObject(state, {
        finished: true,
        sales: action.sales,
    })
}

const reducer = (state = initialState, action) => {
    //console.log("actiontype", action.type);
    switch (action.type) {
        case actionTypes.STARTED_LOADING_OPTIONS:
            return startLoadingOptions(state, action);
        case actionTypes.FINISHED_LOADING_OPTIONS:
            return finishLoadingOptions(state, action);
        case actionTypes.FINISHED_DOWNLOAD_SALES:
            return salesFinished(state, action);
        default:
            return state;
    }
}



export default reducer
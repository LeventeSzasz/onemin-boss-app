import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../UpdateUtility';

const initialState = {
    is_success: null,
    payment_type: '',
    payrefno: '',
    barion_order_id: '',
    szep_id: '',

}

const szepKartyaFinished = (state, action) => {
    return updateObject(state, {
        payment_type: "szep_kartya_web",
        is_success: action.is_success,
        szep_id: action.szep_id,
    })
}

const barionFinished = (state, action) => {
    return updateObject(state, {
        payment_type: "barion",
        is_success: action.is_success,
        barion_order_id: action.barion_order_id,
    })
}

const simplepayFinished = (state, action) => {
    return updateObject(state, {
        payment_type: "simplepay",
        is_success: action.is_success,
        payrefno: action.payrefno,
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SIMPLEPAY_FINISHED:
            return simplepayFinished(state, action);
        case actionTypes.BARION_FINISHED:
            return barionFinished(state, action);
        case actionTypes.SZEP_KARTYA_WEB_FINISHED:
            return szepKartyaFinished(state, action);
        default:
            return state;
    }
}

export default reducer
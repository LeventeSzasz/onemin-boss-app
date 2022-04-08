import * as actionTypes from './actionTypes';


export const szepKartyaFinished = (is_success, szep_id) => {
    return {
        type: actionTypes.SZEP_KARTYA_WEB_FINISHED,
        is_success: is_success,
        szep_id: szep_id

    }
}

export const barionFinished = (is_success, barion_order_id) => {
    return {
        type: actionTypes.BARION_FINISHED,
        is_success: is_success,
        barion_order_id: barion_order_id

    }
}

export const simplepayFinished = (is_success, payrefno) => {
    return {
        type: actionTypes.SIMPLEPAY_FINISHED,
        is_success: is_success,
        payrefno: payrefno

    }
}
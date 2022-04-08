import * as actionTypes from './actionTypes';

/*export const checkRegisterFields = (delivery_method) => {
    return dispatch => {
        dispatch(canRegisterNull_())
        dispatch(checkRegisterFields_(delivery_method));
    }
}*/

export const resetFieldStates = () => {
    return {
        type: actionTypes.RESET_FIELD_STATES,
    }
}

export const canPostOrderNULL = () => {
    return {
        type: actionTypes.CAN_POST_ORDER_NULL
    }
}


export const checkPostOrderFields = (is_logged_in, delivery_method) => {
    return {
        type: actionTypes.CHECK_POST_ORDER_FIELDS,
        is_logged_in: is_logged_in,
        delivery_method: delivery_method
    }
}


export const checkAddressScreenFields = (delivery_method) => {
    return {
        type: actionTypes.CHECK_ADDRESS_SCREEN_FIELDS,
        delivery_method: delivery_method
    }
}

export const canSaveAddressesToNULL = () => {
    return {
        type: actionTypes.CAN_SAVE_ADDRESSES_TO_NULL
    }
}


export const checkRegisterFields = (delivery_method) => {
    return {
        type: actionTypes.CHECK_REGISTER_FIELDS,
        delivery_method: delivery_method
    }
}

export const canRegisterNull_ = () => {
    return {
        type: actionTypes.CAN_REGISTER_NULL,
    }
}

export const updateStreets = (streets) => {
    return {
        type: actionTypes.UPDATE_STREETS,
        streets: streets,
    }
}

export const updateField = (field_name, text, second_text) => {
    return {
        type: actionTypes.REG_FIELD_UPDATE,
        field_name: field_name,
        text: text,
        second_text: second_text
    }
}

export const regHeightCorrection = () => {
    return {
        type: actionTypes.CALCULATE_REG_HEIGHT,
    }
}


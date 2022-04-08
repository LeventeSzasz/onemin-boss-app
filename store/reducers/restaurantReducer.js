import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../UpdateUtility';

const initialState = {
    selectedRestaurant: null,
    fresh_orders: null,
}

const setFreshOrders = (state, action) => {
    return updateObject(state, {
        fresh_orders: action.fresh_orders
    })
}

const setSelectedRestaurant = (state, action) => {
    return updateObject(state, {
        selectedRestaurant: action.selectedRestaurant
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_RESTAURANT:
            return setSelectedRestaurant(state, action);
        case actionTypes.SET_FRESH_ORDERS:
            return setFreshOrders(state, action);
        default:
            return state;
    }
}

export default reducer
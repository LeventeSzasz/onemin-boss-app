import * as actionTypes from './actionTypes';

export const setSelectedRestaurant = (selectedRestaurant) => {
    return {
        type: actionTypes.SET_SELECTED_RESTAURANT,
        selectedRestaurant: selectedRestaurant
    }
}

export const setFreshOrders = (fresh_orders) => {
    return {
        type: actionTypes.SET_FRESH_ORDERS,
        fresh_orders: fresh_orders
    }
}
import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../UpdateUtility';

const initialState = {
    options: [],
    loading: true,
    productHasOptions: false,
    productPrice: 0,
    currentProdPrice: 0,
    activeSale: null,
    OptionGroupPrices: 0,
    prodCount: 1,
    product_categories: {},
    finished: false
}

const resetStates = (state, action) => {
    return updateObject(state, {
        options: [],
        loading: true,
        productHasOptions: false,
        productPrice: 0,
        currentProdPrice: 0,
        activeSale: null,
        OptionGroupPrices: 0,
        prodCount: 1,
        //finished: false
    })
}

const calculateProductPrice = (state, action) => {
    return updateObject(state, {
        productPrice: action.productPrice
    })
}

const calculateOptionGroupsPrice = (state, action) => {
    return updateObject(state, {
        OptionGroupPrices: action.OptionGroupPrices
    })
}

const handleOptionPress = (state, action) => {
    //console.log("productReducer", state, action.options);
    return updateObject(state, {
        options: action.options
    })
}

const setCategories = (state, action) => {
    return updateObject(state, {
        product_categories: action.product_categories
    })
}

const recalculateProductPrice = (state, action) => {
    let count = state.prodCount
    let currentProdPrice = state.currentProdPrice
    let OptionGroupPrices = state.OptionGroupPrices
    let obj = {}

    if (action.count !== null) {
        count = action.count
        obj.prodCount = action.count
    }

    if (action.currentProdPrice !== null) {
        currentProdPrice = action.currentProdPrice
    }

    if (action.OptionGroupPrices !== null) {
        OptionGroupPrices = action.OptionGroupPrices
    }

    var finalPrice = parseFloat(currentProdPrice) + parseFloat(OptionGroupPrices);
    finalPrice = finalPrice * count;

    obj.productPrice = finalPrice

    return updateObject(state, obj)
}

const startLoadingOptions = (state, action) => {
    return updateObject(state, {
        loading: true
    })
}

const finishLoadingOptions = (state, action) => {
    //console.log("MIAFAZS: ", state.productPrice)
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

const discountCalculated = (state, action) => {
    return updateObject(state, {
        currentProdPrice: action.currentProdPrice,
        activeSale: action.activeSale
    })
}

const reducer = (state = initialState, action) => {
    //console.log("actiontype", action.type);
    switch (action.type) {
        case actionTypes.STARTED_LOADING_OPTIONS:
            return startLoadingOptions(state, action);
        case actionTypes.FINISHED_LOADING_OPTIONS:
            return finishLoadingOptions(state, action);
        case actionTypes.PRODUCT_PRICE_CALCULATE:
            return calculateProductPrice(state, action);
        case actionTypes.FINISHED_DOWNLOAD_SALES:
            return salesFinished(state, action);
        case actionTypes.DISCOUNT_CALCULATED:
            return discountCalculated(state, action);
        case actionTypes.RECALCULATE_PROD_PRICE:
            return recalculateProductPrice(state, action);
        case actionTypes.RESET_PROD_STATES:
            return resetStates(state, action);
        case actionTypes.CALCULATE_OPTIONS_PRICE:
            return calculateOptionGroupsPrice(state, action);
        case actionTypes.HANDLE_OPTION_PRESS:
            return handleOptionPress(state, action);
        case actionTypes.SET_CATEGORIES:
            return setCategories(state, action);
        default:
            return state;
    }
}

export default reducer
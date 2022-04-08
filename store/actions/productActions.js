import * as actionTypes from './actionTypes';
import { Platform } from 'react-native';

var configjson = require('../../config.json')

export const resetStates = () => {
    return {
        type: actionTypes.RESET_PROD_STATES
    }
}

export const onInitOptions = (endpoint) => {
    console.log("productActions ONINITOPTIONS", endpoint);
    return dispatch => {
        dispatch(resetStates());
        dispatch(startLoadingOptions());


        fetch(endpoint).then(response => response.json()).then(optionsJSON => {

            var filteredOptionList = optionsJSON.filter((value) => {
                return value.active === true;
            });

            let tmp = []
            filteredOptionList.sort((a, b) => a.ranking - b.ranking);
            for (let i = 0; i < filteredOptionList.length; i++) {
                if (filteredOptionList[i].options.length > 0) {
                    filteredOptionList[i].options.sort((a, b) => a.ranking - b.ranking);

                    // optionszüres activera
                    
                        filteredOptionList[i].options = filteredOptionList[i].options.filter((value) => {
                            return value.active === true;
                        });
                    
                    // -----------------------

                    tmp.push(filteredOptionList[i])
                }   
            }

            filteredOptionList = tmp

            if (filteredOptionList.length > 0) {
                dispatch(finishLoadingOptions(filteredOptionList, true))
            } else {
                dispatch(finishLoadingOptions(filteredOptionList, false))
            }
        });
    }
}

export const startLoadingOptions = () => {
    return {
        type: actionTypes.STARTED_LOADING_OPTIONS
    }
}

export const finishLoadingOptions = (filteredOptionList, productHasOptions) => {
    return {
        type: actionTypes.FINISHED_LOADING_OPTIONS,
        filteredOptionList,
        productHasOptions
    }
}

export const getSales = (restaurant_id) => {
    return dispatch => {
        //dispatch(startLoading());

        console.log(restaurant_id)

        fetch(configjson.base_url + 'sales?restaurant_id=' + restaurant_id + '&active=true')
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson)

                dispatch(salesFinished(responseJson));
            });
    }
}

export const salesFinished = (sales) => {
    return {
        type: actionTypes.FINISHED_DOWNLOAD_SALES,
        sales: sales,
    }
}

export const calculateDiscount = (sales, currentProdPrice, product, choosedSubproduct) => {
    return dispatch => {
        let activeSale = null;
        let minPrice = currentProdPrice;
        console.log("CALCULATEDISCOUNT")
        for (let i = 0; i < sales.length; i++) {
            console.log("SALES", sales[i].platform, Platform.OS, sales[i].platform == Platform.OS);
            if( sales[i].platform == null || Platform.OS === sales[i].platform ){
                console.log("belemegy");

                if (sales[i].target_type === "Restaurant") {
                    console.log("Restaurant")
                    if (sales[i].discount_type === "percent") {
                        let discountRate = (100 - sales[i].discount_value) / 100;
                        let discountedValue = currentProdPrice * discountRate;
                        if (minPrice > discountedValue) {
                            minPrice = discountedValue;
                            activeSale = sales[i];
                        }
                    }
                    if (sales[i].discount_type === "fixed_value") {
                        if (minPrice > currentProdPrice - sales[i].discount_value) {
                            minPrice = currentProdPrice - sales[i].discount_value;
                            activeSale = sales[i];
                        }
                    }
                }

                if (sales[i].target_type === "ProductCategory") {
                    //console.log("kajakategóriásSALE", product)
                    if (product.product_category_id === sales[i].target_id) {
                        if (sales[i].discount_type === "percent") {
                            let discountRate = (100 - sales[i].discount_value) / 100;
                            let discountedValue = currentProdPrice * discountRate;
                            if (minPrice > discountedValue) {
                                minPrice = discountedValue;
                                activeSale = sales[i];
                            }
                        }
                        if (sales[i].discount_type === "fixed_value") {
                            if (minPrice > currentProdPrice - sales[i].discount_value) {
                                minPrice = currentProdPrice - sales[i].discount_value;
                                activeSale = sales[i];
                            }
                        }
                    }
                }
            

                if (sales[i].target_type === "Subproduct") {
                    //TODO: product screenen IS ellenőrizni mivel több subproduct lehet,itt csak a 0-ásat megnézni esetleg?
                    //console.log("SzábprodáktosSzélsz", choosedSubproduct)
                    if (choosedSubproduct.id === sales[i].target_id) {
                        if (sales[i].discount_type === "percent") {
                            let discountRate = (100 - sales[i].discount_value) / 100;
                            let discountedValue = currentProdPrice * discountRate;
                            if (minPrice > discountedValue) {
                                minPrice = discountedValue;
                                activeSale = sales[i];
                            }
                        }
                        if (sales[i].discount_type === "fixed_value") {
                            if (minPrice > currentProdPrice - sales[i].discount_value) {
                                minPrice = currentProdPrice - sales[i].discount_value;
                                activeSale = sales[i];
                            }
                        }
                    }
                }
            }
        }

        let priceToReturn = 0;
        let saleToReturn = null;

        if (minPrice < currentProdPrice && minPrice > 0) {
            priceToReturn = minPrice;
            saleToReturn = activeSale;

            dispatch(discountCalculated(priceToReturn, saleToReturn));

        } else {

            priceToReturn = currentProdPrice;
            dispatch(discountCalculated(priceToReturn, saleToReturn));

        }

        dispatch(calculateProductPrice(priceToReturn, 0, 1));
    }
}

export const calculateOptionGroupsPrice = (options) => {

    let sumPrice = 0;
    for (let i = 0; i < options.length; i++) {
        let OptionsInGroup = options[i];

        for (let j = 0; j < OptionsInGroup.options.length; j++) {

            if (OptionsInGroup.options[j].type === "CheckBOX") {
                if (OptionsInGroup.options[j].selected) {
                    sumPrice += parseFloat(OptionsInGroup.options[j].price);
                }
            }
            if (OptionsInGroup.options[j].type === "OptionCounter") {
                if (OptionsInGroup.options[j].count > 0) {
                    let pricehelper = parseInt(OptionsInGroup.options[j].count) * parseFloat(OptionsInGroup.options[j].price);
                    sumPrice += pricehelper;
                }
            }

            if (OptionsInGroup.options[j].type === "RadioButton") {
                let radioIndex = OptionsInGroup.selectedIndex;
                sumPrice += parseFloat(OptionsInGroup.options[radioIndex].price);
                break;
            }
        }
    }

    return {
        type: actionTypes.CALCULATE_OPTIONS_PRICE,
        OptionGroupPrices: sumPrice
    }
}

export const handleOptionPress = (originalItem, originalOptions) => {

    let item = { ...originalItem };
    let options = [...originalOptions];
    //console.log("REDUXoptionPress", item, options);

    return dispatch => {
        let groupLength = options.length;
        for (let i = 0; i < groupLength; i++) {
            let optionsLength = options[i].options.length;

            for (let j = 0; j < optionsLength; j++) {

                //console.log( "REDUXoptionPress for let J", options[i].options[j].id, item.id )

                if (item.id === options[i].options[j].id) { // ----------------- we've got the item ----------------
                    switch (options[i].options[j].type) {
                        case "CheckBOX":

                            options[i].options[j].selected = !options[i].options[j].selected;
                            break;

                        case "RadioButton":

                            options[i].selectedIndex = j;
                            break;

                        case "OptionCounter":

                            var groupCount = calculateSumOfOptionGroup(options[i].options);
                            if (options[i].options[j].plus) {
                                if (groupCount < options[i].max_no_options) {
                                    options[i].options[j].count += 1;
                                }
                            } else {
                                if (options[i].options[j].count > 0) {
                                    options[i].options[j].count -= 1;
                                }
                            }

                            break;
                        default:
                            console.log("This option type is not defined in OptionTypes.js");
                    }
                    break;
                }
            }
        }

        //console.log("diszpeccseleőtt", options);

        dispatch(applyOptionChange(options));
        dispatch(calculateOptionGroupsPrice(options));
        dispatch(recalculateProductPrice(null, null, null));

    }
}

const calculateSumOfOptionGroup = (options) => {
    var count = 0;
    for (let i = 0; i < options.length; i++) {
        count += options[i].count;
    }

    return count;
}

const applyOptionChange = (options) => {

    //console.log("applyOptionChange", options);

    return {
        type: actionTypes.HANDLE_OPTION_PRESS,
        options: options
    }
}

export const discountCalculated = (priceToReturn, saleToReturn) => {
    return {
        type: actionTypes.DISCOUNT_CALCULATED,
        currentProdPrice: priceToReturn,
        activeSale: saleToReturn
    }
}

export const recalculateProductPrice = (currentProdPrice, OptionGroupPrices, productCount) => {
    return {
        type: actionTypes.RECALCULATE_PROD_PRICE,
        count: productCount,
        currentProdPrice: currentProdPrice,
        OptionGroupPrices: OptionGroupPrices
    }
}

export const setCategories = (product_categories) => {
    return {
        type: actionTypes.SET_CATEGORIES,
        product_categories: product_categories,
    }
}

export const calculateProductPrice = (currentProdPrice, OptionGroupPrices, productCount) => {

    var finalPrice = parseFloat(currentProdPrice) + parseFloat(OptionGroupPrices);
    finalPrice = finalPrice * productCount;

    return {
        type: actionTypes.PRODUCT_PRICE_CALCULATE,
        productPrice: finalPrice,
    }
}
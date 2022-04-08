import AsyncStorage from '@react-native-community/async-storage';
import Localized from '../../utils/Localized.js'
import * as actionTypes from './actionTypes';
var configjson = require('../../config.json');

export const getRestaurant = (id, is_secondary_language) => {
    return dispatch => {
        dispatch(startLoading());

        fetch( configjson.base_url + 'restaurants/' + configjson.test_restaurant_id )
            .then((response) => response.json())
            .then((responseJson) => {
                
                AsyncStorage.setItem("RESTAURANT", responseJson);
                //console.log("Restaurant Response", responseJson);

                setLanguage(responseJson["primary_language"], responseJson["secondary_language"], is_secondary_language)

                const stringified_delivery_regions = JSON.stringify(responseJson.delivery_regions)
                AsyncStorage.setItem("delivery_regions", stringified_delivery_regions);

                let app_options = {}

                configjson.partner_id = responseJson["partner_id"]
                configjson.currency = responseJson["currency"]

                responseJson.configs.map((item, index) => {
                    if(item.key === 'restaurantchooser') {
                        configjson.is_multi_restaurant = item.value
                    }

                    if(item.key === 'restaurant_chooser_bg') {
                        app_options.restaurant_chooser_bg = item.value
                    }

                    if(item.key === 'menulogo') {
                        app_options.menulogo = item.value
                    }

                    if(item.key === 'announcement') {
                        app_options.announcement = item.value
                    }

                    if (item.key === 'contactuspageid') {
                        AsyncStorage.setItem("contactuspageid", item.value);
                    }

                    if (item.key === 'termspageid') {
                        AsyncStorage.setItem("termspageid", item.value);
                    }

                    if (item.key === 'privacypageid') {
                        AsyncStorage.setItem("privacypageid", item.value);
                    }

                    //foodlistnamecolor , mobilpromocolor , mobilpromobg
                    if (item.key === 'mobilpromobg') {
                        //configjson.primaryColor = item.value
                        app_options.mobilpromobg = item.value
                        //globalStyle.appbarcontainer.backgroundColor = item.value
                    }

                    if (item.key === 'headerlogo') {
                        app_options.headerlogo = item.value
                    }

                    if (item.key === 'estdeliver_pri') {
                        app_options.estdeliver_pri = item.value
                    }

                    if (item.key === 'estdeliver_sec') {
                        app_options.estdeliver_sec = item.value
                    }

                    if (item.key === 'estdeliver_enable') {
                        app_options.estdeliver_enable = item.value
                    }


                    //app_options.app_header_icons_color = '#000000'


                    if (item.key === 'app_header_logo') {
                        app_options.app_header_logo = item.value
                    }
                    if (item.key === 'app_header_bg_color') {
                        app_options.app_header_bg_color = item.value
                        //
                    }
                    if (item.key === 'app_header_icons_color') {
                        app_options.app_header_icons_color = item.value
                        //
                    }
                    if (item.key === 'app_left_menu_bg_color') {
                        app_options.app_left_menu_bg_color = item.value
                        //
                    }

                    if (item.key === 'app_left_menu_text_color') {
                        app_options.app_left_menu_text_color = item.value
                    }

                    if (item.key === 'app_main_text_color') {
                        app_options.app_main_text_color = item.value
                    }
                    if (item.key === 'app_secondary_text_color') {
                        app_options.app_secondary_text_color = item.value
                    }
                    if (item.key === 'app_main_bg_color') {
                        app_options.app_main_bg_color = item.value
                    }
                    if (item.key === 'app_button_bg_color') {
                        app_options.app_button_bg_color = item.value
                        //
                    }
                    if (item.key === 'app_button_highlight_color') {
                        app_options.app_button_highlight_color = item.value
                    }
                    if (item.key === 'app_button_text_color') {
                        app_options.app_button_text_color = item.value
                        //
                    }
                    if (item.key === 'app_main_font') {
                        app_options.app_main_font = item.value
                    }
                    if (item.key === 'app_secondary_font') {
                        app_options.app_secondary_font = item.value
                    }

                    if (item.key === 'mobile_app_bg' ){
                        app_options.mobile_app_bg = item.value
                    }

                    if (item.key === 'app_template' ){
                        app_options.app_template = item.value
                    }

                    if (item.key === 'grid_columns_number' ){
                        app_options.grid_columns_number = item.value
                    }

                    if (item.key === 'category_name_on_img' ){
                        app_options.category_name_on_img = item.value === "true" ? true : false
                    }

                    if (item.key == 'fontFamilyRegular') {
                        configjson.fontFamilyRegular = item.value
                    }

                    if (item.key == 'fontFamilyBold') {
                        configjson.fontFamilyBold = item.value
                    }

                    if (item.key == 'fontFamilyItalic') {
                        configjson.fontFamilyItalic = item.value
                    }

                    if (item.key == 'fontFamilyThin') {
                        configjson.fontFamilyThin = item.value
                    }

                    if (item.key == 'extrapageid') {
                        app_options.extrapageid = item.value
                    }

                    if (item.key == 'headscript') {
                        app_options.headscript = item.value
                    }

                    if (item.key == 'cropped_food_images'){ 
                        app_options.cropped_food_images = item.value
                    }

                    if (item.key == 'mobil_app_logo'){ 
                        app_options.mobil_app_logo = item.value
                    }

                    /* ---------- LCT STUFF FROM HERE ---------------- */

                    if (item.key == 'lct_enable') {
                        app_options.lct_enable = item.value
                    }

                    if (item.key == 'lct_pin_home') {
                        app_options.lct_pin_home = item.value
                    }

                    if (item.key == 'lct_pin_restaurant'){
                        app_options.lct_pin_restaurant = item.value
                    }

                    if (item.key == 'lct_pin_courier'){
                        app_options.lct_pin_courier = item.value
                    }

                    if (item.key == 'lct_google_api_key'){
                        app_options.lct_google_api_key = item.value
                    }

                    if (item.key == 'lct_pin_delivered' ){
                        app_options.lct_pin_delivered = item.value
                    }

                    if (item.key == 'lct_pin_address'){ //elotted levo cim
                        app_options.lct_pin_address = item.value
                    }

                    // DRAWER ICONS

                    if (item.key == 'main_icon'){
                        app_options.main_icon = item.value
                    }

                    if (item.key == 'extrapage_icon'){
                        app_options.extrapage_icon = item.value
                    }

                    if (item.key == 'orders_icon'){
                        app_options.orders_icon = item.value
                    }

                    if (item.key == 'profile_icon'){
                        app_options.profile_icon = item.value
                    }

                    if (item.key == 'contact_icon'){
                        app_options.contact_icon = item.value
                    }

                    if (item.key == 'info_icon'){
                        app_options.info_icon = item.value
                    }

                    if (item.key == 'restchooser_icon'){
                        app_options.restchooser_icon = item.value
                    }

                    if (item.key == 'tracking_icon'){
                        app_options.tracking_icon = item.value
                    }

                    /*
                    
                    app_header_logo
                    app_header_bg_color
                    app_header_icons_color
                    app_left_menu_bg_color

                    app_main_text_color
                    app_secondary_text_color

                    app_main_bg_color
                    
                    app_button_bg_color
                    app_button_highlight_color
                    app_button_text_color

                    app_main_font
                    app_secondary_font

                    */



                    //foodcatcolor

                    //estdeliver_enable   -- true v false
                    //estdeliver_sec    ---link   background sec language
                    //estdeliver_pri    ---ling background primary language
                    //estimated_delivery_time


                    //headerlogo ---img

                })

                //console.log("responseJson.configs: ", responseJson.configs)
                console.log("app_options: ", app_options)

                setAsyncStorage("primary_language", responseJson)
                setAsyncStorage("secondary_language", responseJson)
                setAsyncStorage("delivery_method", responseJson)
                setAsyncStorage("domain", responseJson)

                /*let app_options = {
                    foodcatcolor: foodcatcolor,
                    headerlogo: headerlogo
                }*/

                dispatch(initFinished(true, app_options, responseJson))
            });

    }
}

export const setAsyncStorage = (name, responseJson) => {
    if (responseJson[name] != null) {
        AsyncStorage.setItem(name, responseJson[name].toString());
    } else {
        AsyncStorage.setItem(name, '');
    }
}

export const setLanguage = (primary_lang, secondary_lang, is_secondary_language) => {
    //console.log("SETTING LANG")
    //console.log("primary_lang:", primary_lang)
    //console.log("secondary_lang: ", secondary_lang)
    //console.log("is_secondary_language: ", is_secondary_language)
    if (primary_lang == null || primary_lang === "") {
        AsyncStorage.setItem("primary_language", "hu");
        Localized.setLanguage("hu");
        return;
    }

    if (secondary_lang == null || secondary_lang === "") {
        AsyncStorage.setItem("primary_language", primary_lang);
        Localized.setLanguage(primary_lang);
        return;
    }

    if (is_secondary_language === null) {
        Localized.setLanguage(primary_lang);
        return;
    }

    if (is_secondary_language === "1") {
        Localized.setLanguage(secondary_lang);
    } else {
        Localized.setLanguage(primary_lang);
    }
}

export const startLoading = () => {
    return {
        type: actionTypes.STARTED_LOADING_INIT_APP
    }
}

export const initFinished = (success, app_options, restaurant_info) => {
    return {
        type: actionTypes.FINISHED_LOADING_INIT_APP,
        success: success,
        app_options: app_options,
        restaurant_info: restaurant_info,
    }
}

export const saveDictionaries = (dict) => {
    return {
        type: actionTypes.SAVE_DICTIONARIES,
        dict: dict
    }
}
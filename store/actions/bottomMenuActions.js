import * as actionTypes from './actionTypes';

export const setNavigation = (navigation) => {
    return {
        type: actionTypes.SET_NAVIGATION,
        navigation: navigation
    }
}

export const setSelectedIndex = (index) => {
    return {
        type: actionTypes.SET_SELECTED_INDEX,
        index: index
    }
}

export const setIsMenuOpened = (is_menu_opened) => {
    return {
        type: actionTypes.SET_IS_MENU_OPENED,
        is_menu_opened: is_menu_opened
    }

}
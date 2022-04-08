import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../UpdateUtility';

const initialState = {
    index: -1,
    navigation: null,
    is_menu_opened: false,
}

const setNavigation = (state, action) => {
    // if (action.navigation != null) {
    //     console.log("REDUXGZ", action.navigation)

    //     return updateObject(state, {
    //         navigation: action.navigation
    //     })
    // }

    // return state
    //console.log("REDUXGZ", action.navigation)
    return updateObject(state, {
        navigation: action.navigation
    })
    
}

const setSelectedIndex = (state, action) => {
    return updateObject(state, {
        index: action.index
    })
}

const setIsMenuOpened = (state, action) => {
    //console.log("setIsMenuOpened", action.is_menu_opened)
    return updateObject(state, {
        is_menu_opened: action.is_menu_opened
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_INDEX:
            return setSelectedIndex(state, action);
        case actionTypes.SET_NAVIGATION:
            return setNavigation(state, action);
        case actionTypes.SET_IS_MENU_OPENED:
            return setIsMenuOpened(state, action);
        default:
            return state;
    }
}

export default reducer
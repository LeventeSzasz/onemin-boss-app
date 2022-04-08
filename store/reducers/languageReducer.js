import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../UpdateUtility';
import Localized from '../../utils/Localized';

const initialState = {
    language: "hu",
}

const setLanguage = (state, action) => {

    Localized.setLanguage(action.language);

    return updateObject(state, {
        language: action.language,
    })

}



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_LANGUAGE:
            return setLanguage(state, action);
        default:
            return state;
    }
}

export default reducer
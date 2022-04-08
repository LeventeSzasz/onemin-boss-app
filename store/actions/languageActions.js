import * as actionTypes from './actionTypes';

export const setLanguage = (language) => {
    return {
        type: actionTypes.SET_LANGUAGE,
        language: language
    }
}
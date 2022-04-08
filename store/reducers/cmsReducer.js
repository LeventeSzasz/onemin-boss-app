import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../UpdateUtility';

const initialState = {
    loading: false,
    cms_state: null,
    response_html: '',
    response_html_sec_lang: ''
}

const startLoading = (state, action) => {
    return updateObject(state, {
        loading: true,
        cms_state: null
    })
}

const stopLoading = (state, action) => {
    return updateObject(state, {
        loading: false
    })
}

const cmsResponsed = (state, action) => {
    return updateObject(state, {
        response_html: action.response_html,
        response_html_sec_lang: action.response_html_sec_lang,
        cms_state: action.isSuccess,
        loading: false,
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.STARTED_LOADING_CMS:
            return startLoading(state, action);
        case actionTypes.FINISHED_LOADING_CMS:
            return stopLoading(state, action);
        case actionTypes.CMS_RESPONSED:
            return cmsResponsed(state, action);
        default:
            return state;
    }
}

export default reducer
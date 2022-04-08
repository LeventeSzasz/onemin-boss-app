import * as actionTypes from './actionTypes';
//var configjson = require('../../config.json')

export const getCmsPage = (id) => {
    return dispatch => {
        dispatch(startLoading());

        fetch('cms_pages/' + id.toString())
            .then((response) => response.json())
                .then((responseJson) => {

                    console.log("RESPONSEJSON: ", responseJson);

                    dispatch(cmsResponsed(true, responseJson.content, responseJson.content_sec_lang));

                });
    }
 }

export const cmsResponsed = (isSuccess, response_html, response_html_sec_lang) => {
    return {
        type: actionTypes.CMS_RESPONSED,
        isSuccess: isSuccess,
        response_html: response_html,
        response_html_sec_lang: response_html_sec_lang
    }
}

export const startLoading = () => {
    return {
        type: actionTypes.STARTED_LOADING_CMS
    }
}

export const finishLoading = () => {
    return {
        type: actionTypes.FINISHED_LOADING_CMS
    }
}
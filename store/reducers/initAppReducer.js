import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../UpdateUtility";

const initialState = {
  loading: true,
  success: false,
  app_options: {},
  restaurant_info: {},
  dict: null
};

const saveDictionaries = (state, action) => {
    //console.log('DIKAZ ', action.dict)
  return updateObject(state, {
    dict: action.dict
  });
};

const startLoading = (state, action) => {
  return updateObject(state, {
    loading: true,
    success: false
  });
};

const initFinished = (state, action) => {
  //console.log("action.restaurant_info: ", action.restaurant_info)
  return updateObject(state, {
    loading: false,
    success: action.success,
    app_options: action.app_options,
    restaurant_info: action.restaurant_info
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.STARTED_LOADING_INIT_APP:
      return startLoading(state, action);
    case actionTypes.FINISHED_LOADING_INIT_APP:
      return initFinished(state, action);
    case actionTypes.SAVE_DICTIONARIES:
      return saveDictionaries(state, action);
    default:
      return state;
  }
};

export default reducer;

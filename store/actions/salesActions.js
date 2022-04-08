import * as actionTypes from "./actionTypes";

export const getSales = (restaurant_id) => {
  return dispatch => {
    //dispatch(startLoading());

    fetch(
      configjson.base_url +
        "sales?restaurant_id=" +
        restaurant_id +
        "&active=true"
    )
      .then(response => response.json())
      .then(responseJson => {
        dispatch(salesFinished(responseJson));
      });
  };
};

export const salesFinished = sales => {
  return {
    type: actionTypes.FINISHED_DOWNLOAD_SALES,
    sales: sales
  };
};

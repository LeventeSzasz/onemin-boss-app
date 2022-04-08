import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../UpdateUtility";
let configjson = require("../../config.json");

const initialState = {
  first_name: "",
  last_name: "",
  email: "",
  phone_1: "",
  city: "",
  selected_city_row: 0,
  street: "",
  street_id: "",
  premise_number: "",
  floor: "",
  door_number: "",
  doorbell: "",
  pass: "",
  firstNameError: "",
  lastNameError: "",
  emailError: "",
  phoneError: "",
  cityError: "",
  streetError: "",
  houseNumberError: "",
  passwordError: "",
  text_view_height_correction: 0,
  streets: [],
  can_register: null,
  register_body: {},
  comment: "",
  can_post_order: null,
  post_order_body: {},
  region_id: "",
  address_name: "",
  addressNameError: "",
  address_notes: "",
  can_save_addresses: null,
  actual_address_vars: {}
};

const resetStates = state => {
  return updateObject(state, {
    //first_name: '',
    //last_name: '',
    //email: '',
    phone_1: "",
    city: "",
    selected_city_row: 0,
    street: "",
    street_id: "",
    premise_number: "",
    floor: "",
    door_number: "",
    doorbell: "",
    pass: "",
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    phoneError: "",
    cityError: "",
    streetError: "",
    houseNumberError: "",
    passwordError: "",
    text_view_height_correction: 0,
    streets: [],
    can_register: null,
    register_body: {},
    comment: "",
    can_post_order: null,
    post_order_body: {},
    region_id: "",
    address_name: "",
    addressNameError: "",
    address_notes: "",
    can_save_addresses: null,
    actual_address_vars: {}
  });
};

const canPostOrderNULL = (state, action) => {
  return updateObject(state, {
    can_post_order: null
  });
};

const checkPostOrderFields = (state, action) => {

  console.log("CHECKPOSTORDERFIELDS", state, action)

  let can_post_order = true;
  let body = {};

  let firstNameError,
    lastNameError,
    emailError,
    phoneError,
    cityError,
    streetError,
    houseNumberError,
    passwordError = "";

  console.log("1");

  if (action.is_logged_in) {
    console.log("2");

    if (state.first_name == "") {
      can_post_order = false;
      firstNameError = "*";
      console.log("3");
    }

    if (state.last_name == "") {
      can_post_order = false;
      lastNameError = "*";
      console.log("4");
    }

    if (state.email == "") {
      can_post_order = false;
      emailError = "*";
      console.log("5");
    }

    if (can_post_order) {
      body.email = state.email;
      body.first_name = state.first_name;
      body.last_name = state.last_name;
      body.message = state.comment;
    }
  } else {
    console.log("6 is_logged_in_false");
    if (state.first_name == "") {
      can_post_order = false;
      firstNameError = "*";
      console.log("7");
    }

    if (state.last_name == "") {
      can_post_order = false;
      lastNameError = "*";
      console.log("8");
    }

    if (state.email == "") {
      can_post_order = false;
      emailError = "*";
      console.log("9");
    }

    if (state.phone_1 == "") {
      can_post_order = false;
      phoneError = "*";
      console.log("10");
    }

    // if (state.city === "") {
    //     can_post_order = false
    //     cityError = '*'
    //     console.log('11')
    // }

    if (state.street == "") {
      can_post_order = false;
      streetError = "*";
      console.log("12");
    }

    if (
      action.delivery_method === "street_based" ||
      action.delivery_method === "priced_street_based"
    ) {
      console.log("13");
      if (
        state.street_id === "" ||
        state.street_id == null ||
        state.street_id === 0
      ) {
        can_post_order = false;
        streetError = "*";
        console.log("14");
      }
      // if ( action.streets === [] ||
      //      action.streets === undefined ||
      //      action.streets === "" ){
      //   can_post_order = false;
      //   streetError = "*";
      //   console.log("13B");
      // }
    }

    if (state.premise_number == "") {
      can_post_order = false;
      houseNumberError = "*";
      console.log("15");
    }

    if (can_post_order) {
      body.email = state.email;
      body.first_name = state.first_name;
      body.last_name = state.last_name;
      body.city = state.city;
      body.street = state.street;
      body.premise_number = state.premise_number;
      body.floor = state.floor;
      body.door_number = state.door_number;
      body.doorbell = state.doorbell;
      body.phone_1 = state.phone_1;
      body.message = state.comment;
      body.delivery_data = '{"delivery_region_id":"' + state.region_id + '"}';
    }
  }

  return updateObject(state, {
    can_post_order: can_post_order,
    post_order_body: body,
    firstNameError,
    lastNameError,
    emailError,
    phoneError,
    cityError,
    streetError,
    houseNumberError,
    passwordError
  });
};

const canRegisterNull = state => {
  return updateObject(state, { can_register: null });
};

const checkAddressScreenFields = (state, action) => {
  let can_save_addresses = true;
  let addressNameError,
    phoneError,
    cityError,
    streetError,
    houseNumberError = "";
  let actual_address = {};

  if (state.address_name == "") {
    console.log("1");
    addressNameError = "*";
    can_save_addresses = false;
  }

  if (state.phone_1 == "") {
    console.log("2");
    phoneError = "*";
    can_save_addresses = false;
  }

  if (state.city == "") {
    console.log("3");
    cityError = "*";
    can_save_addresses = false;
  }

  if (state.street == "") {
    console.log("4");
    streetError = "*";
    can_save_addresses = false;
  }

  if (state.premise_number == "") {
    console.log("5");
    houseNumberError = "*";
    can_save_addresses = false;
  }

  if (
    action.delivery_method === "street_based" ||
    action.delivery_method === "priced_street_based"
  ) {
    console.log("6 delivery_method street/priced_street");
    if (
      state.street_id === "" ||
      state.street_id == null ||
      state.street_id === 0
    ) {
      console.log("7");
      streetError = "*";
      can_save_addresses = false;
    }
    console.log("CHECKADDRESSSCREENFIELDS", action.streets );
    // if ( action.streets === [] ||
    //      action.streets === undefined ||
    //      action.streets === "" ){
    //   can_save_addresses = false;
    //   streetError = "*";
    //   console.log("13B");
    // }
  }

  if (action.delivery_method === "region_based") {
    if (
      state.region_id === "" ||
      state.region_id == null ||
      state.region_id === 0
    ) {
      cityError = "*";
      can_save_addresses = false;
    }
  }

  /*if (state.premise_number == "") {
        console.log("8")
        houseNumberError = '*'
        can_save_addresses = false;

    }*/

  if (can_save_addresses) {
    actual_address = {
      premise_number: state.premise_number,
      address_name: state.address_name,
      address_notes: state.address_notes,
      phone_1: state.phone_1,
      city: state.city,
      delivery_region_id: state.region_id,
      selected_city_row: state.selected_city_row,
      street: state.street,
      street_id: state.street_id,
      floor: state.floor,
      door_number: state.door_number,
      doorbell: state.doorbell
    };
  }

  return updateObject(state, {
    can_save_addresses: can_save_addresses,
    actual_address_vars: actual_address,
    addressNameError,
    phoneError,
    cityError,
    streetError,
    houseNumberError
  });
};

const canSaveAddressesToNULL = (state, action) => {
  return updateObject(state, { can_save_addresses: null });
};

const checkFields = (state, action) => {
  let can_register = true;
  let firstNameError,
    lastNameError,
    emailError,
    phoneError,
    cityError,
    streetError,
    houseNumberError,
    passwordError = "";
  let body = {};

  if (state.first_name === "") {
    can_register = false;
    firstNameError = "*";
  }

  if (state.last_name === "") {
    can_register = false;
    lastNameError = "*";
  }

  if (state.email === "") {
    can_register = false;
    emailError = "*";
  }

  if (state.phone_1 === "") {
    can_register = false;
    phoneError = "*";
  }

  if (state.city === "") {
    can_register = false;
    cityError = "*";
  }

  if (state.street === "") {
    can_register = false;
    streetError = "*";
  }

  if (
    action.delivery_method === "street_based" ||
    action.delivery_method === "priced_street_based"
  ) {
    if (
      state.street_id === "" ||
      state.street_id == null ||
      state.street_id === 0
    ) {
      can_register = false;
      streetError = "*";
    }
  }

  if (action.delivery_method === "region_based") {
    if (
      state.region_id === "" ||
      state.region_id == null ||
      state.region_id === 0
    ) {
      can_register = false;
      cityError = "*";
    }
  }

  if (state.premise_number === "") {
    can_register = false;
    houseNumberError = "*";
  }

  if (state.pass.length < 6) {
    can_register = false;
    passwordError = "*";
  }

  if (can_register) {
    body = {
      email: state.email,
      password: state.pass,
      password_confirmation: state.pass,
      partner_id: configjson.partner_id,
      first_name: state.first_name,
      last_name: state.last_name,
      city: state.city,
      street: state.street,
      premise_number: state.premise_number,
      floor: state.floor,
      door_number: state.door_number,
      doorbell: state.doorbell,
      phone_1: state.phone_1
    };

    if (state.street_id != "" && state.street_id != null) {
      body.street_id = state.street_id;
    }

    if (
      state.region_id != "" &&
      state.region_id != null &&
      state.region_id != 0
    ) {
      body.delivery_region_id = state.region_id;
    }
  }

  return updateObject(state, {
    can_register: can_register,
    register_body: body,
    firstNameError,
    lastNameError,
    emailError,
    phoneError,
    cityError,
    streetError,
    houseNumberError,
    passwordError
  });
};

const heightCorrection = state => {
  var text_view_height_correction = 0;
  var corrector = 15;
  if (state.firstNameError != "" || state.lastNameError != "") {
    text_view_height_correction += corrector;
  }

  if (state.emailError != "") {
    text_view_height_correction += corrector;
  }

  if (state.phoneError != "") {
    text_view_height_correction += corrector;
  }

  if (state.cityError != "") {
    text_view_height_correction += corrector;
  }

  if (state.streetError != "") {
    text_view_height_correction += corrector;
  }

  if (state.houseNumberError != "") {
    text_view_height_correction += corrector;
  }

  if (state.passwordError != "") {
    text_view_height_correction += corrector;
  }

  text_view_height_correction += state.streets.length * 36;

  console.log("text_view_height_correction: ", text_view_height_correction);

  if (state.text_view_height_correction != text_view_height_correction) {
    return updateObject(state, {
      text_view_height_correction: text_view_height_correction
    });
    //state.text_view_height_correction = text_view_height_correction
  }

  return updateObject(state, {});
};

const updateStreets = (state, action) => {
  console.log("updateStreets2 : ", action.streets);
  return updateObject(state, { streets: action.streets });
};

const updateField = (state, action) => {
  let obj = {};
  let error_text = "*";
  switch (action.field_name) {
    case "first_name":
      if (action.text === "") {
        obj.firstNameError = error_text;
      } else {
        obj.firstNameError = "";
      }
      obj.first_name = action.text;
      break;
    case "last_name":
      if (action.text === "") {
        obj.lastNameError = error_text;
      } else {
        obj.lastNameError = "";
      }
      obj.last_name = action.text;
      break;
    case "email":
      if (action.text === "") {
        obj.emailError = error_text;
      } else {
        obj.emailError = "";
      }
      obj.email = action.text;
      break;
    case "phone_1":
      if (action.text === "") {
        obj.phoneError = error_text;
      } else {
        obj.phoneError = "";
      }
      obj.phone_1 = action.text;
      break;
    case "city":
      if (action.text === "") {
        obj.cityError = error_text;
      } else {
        obj.cityError = "";
      }
      obj.city = action.text;
      obj.selected_city_row = action.second_text;
      break;
    case "selected_city_row":
      obj.selected_city_row = action.text;
      break;
    case "street":
      if (action.text === "") {
        obj.streetError = error_text;
      } else {
        obj.streetError = "";
      }
      obj.street = action.text;
      //obj.street_id = action.second_text
      break;
    case "street_id":
      obj.street_id = action.text;
      break;
    case "premise_number":
      if (action.text === "") {
        obj.houseNumberError = error_text;
      } else {
        obj.houseNumberError = "";
      }
      obj.premise_number = action.text;
      break;
    case "floor":
      obj.floor = action.text;
      break;
    case "door_number":
      obj.door_number = action.text;
      break;
    case "doorbell":
      obj.doorbell = action.text;
      break;
    case "pass":
      if (action.text.length < 6) {
        obj.passwordError = error_text;
      } else {
        obj.passwordError = "";
      }
      obj.pass = action.text;
      break;
    case "comment":
      obj.comment = action.text;
      break;
    case "address_name":
      if (action.text === "") {
        obj.addressNameError = error_text;
      } else {
        obj.addressNameError = "";
      }
      obj.address_name = action.text;
      break;
    case "address_notes":
      obj.address_notes = action.text;
      break;
    case "region_id":
      obj.region_id = action.text;
      break;
  }
  //console.log("OBJ: ", obj);
  return updateObject(state, obj);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REG_FIELD_UPDATE:
      return updateField(state, action);
    case actionTypes.CALCULATE_REG_HEIGHT:
      return heightCorrection(state);
    case actionTypes.UPDATE_STREETS:
      return updateStreets(state, action);
    case actionTypes.CAN_REGISTER_NULL:
      return canRegisterNull(state);
    case actionTypes.CHECK_REGISTER_FIELDS:
      return checkFields(state, action);
    case actionTypes.RESET_FIELD_STATES:
      return resetStates(state);
    case actionTypes.CHECK_POST_ORDER_FIELDS:
      return checkPostOrderFields(state, action);
    case actionTypes.CAN_POST_ORDER_NULL:
      return canPostOrderNULL(state, action);
    case actionTypes.CHECK_ADDRESS_SCREEN_FIELDS:
      return checkAddressScreenFields(state, action);
    case actionTypes.CAN_SAVE_ADDRESSES_TO_NULL:
      return canSaveAddressesToNULL(state, action);
    default:
      return state;
  }
};

export default reducer;

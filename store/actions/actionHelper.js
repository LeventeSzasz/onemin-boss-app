//erre azé van szükség hogy bárhonnan elérhesssüke zeket a funkciókat valamijér ha kellene mégis netalántán esetleg használni őket meg könnyebb rá hivatkozni is.
// mert rövidíted a diszpeccser szintaxisát.

const {
    login,
    register,
    logoutFinished,
    setDate,
    setEndDate,
    setSelectingMode,
    setSegmentBy,
    setPaymethods
} = require("./loginActions");
const { setNavigation, setSelectedIndex, setIsMenuOpened } = require("./bottomMenuActions");
const { setSelectedRestaurant, setFreshOrders } = require("./restaurantActions");
const { getCmsPage } = require("./cmsActions");
const { setLanguage, setIsSecondaryLanguage, setLanguages } = require("./languageActions");
const { getRestaurant, startLoading, saveDictionaries } = require("./initAppActions");
const {
    getSales,
    calculateProductPrice,
    calculateDiscount,
    recalculateProductPrice,
    calculateOptionGroupsPrice,
    handleOptionPress,
    onInitOptions,
    setCategories
} = require("./productActions");
const { simplepayFinished, barionFinished, szepKartyaFinished } = require("./onlinePaymentActions");
const {
    updateField,
    updateStreets,
    checkRegisterFields,
    regHeightCorrection,
    canRegisterNull_,
    resetFieldStates,
    checkPostOrderFields,
    checkAddressScreenFields,
    canSaveAddressesToNULL,
    canPostOrderNULL
} = require("./regFieldActions");

module.exports = {
    updateField,
    updateStreets,
    checkRegisterFields,
    regHeightCorrection,
    canRegisterNull_,
    resetFieldStates,
    checkPostOrderFields,
    checkAddressScreenFields,
    canSaveAddressesToNULL,
    canPostOrderNULL,
    simplepayFinished,
    barionFinished,
    szepKartyaFinished,
    getSales,
    calculateProductPrice,
    calculateDiscount,
    recalculateProductPrice,
    calculateOptionGroupsPrice,
    handleOptionPress,
    getRestaurant,
    setLanguage,
    setLanguages,
    setIsSecondaryLanguage,
    onInitOptions,
    login,
    register,
    logoutFinished,
    setDate,
    setEndDate,
    setSelectingMode,
    setSegmentBy,
    setPaymethods,
    setNavigation,
    setSelectedIndex,
    setIsMenuOpened,
    setSelectedRestaurant,
    setFreshOrders,
    getCmsPage,
    setCategories,
    startLoading,
    saveDictionaries
};

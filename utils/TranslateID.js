import Localized from "./Localized";

export const TranslatePaymethod = {
    credit_card_on_delivery: Localized.credit_card_on_delivery,
    cash_on_delivery: Localized.cash_on_delivery,
    cash_sit_in: Localized.cash_sit_in,
    szep_kartya: Localized.szep_kartya,
    erzsebet_utalvany: Localized.erzsebet_utalvany,
    sodexo: Localized.sodexo,
    ticket_express: Localized.ticket_express,
    barion: Localized.barion,
    simplepay: Localized.simplepay,
    szep_kartya_web: Localized.szep_kartya_web,
    erzsebet_plusz: Localized.erzsebet_plusz,
    credit_card_sit_in: Localized.credit_card_sit_in,
    credit_card_phone: Localized.credit_card_phone,
    barion: Localized.barion,
    barion_email: Localized.barion_email,
    szep_kartya_web: Localized.szep_kartya_web,
    kah_szep_web: Localized.kah_szep_web,
    mkb_szep_web: Localized.mkb_szep_web,
    simplepay_merchant_id: Localized.simplepay_merchant_id,
    pizzagyar_pizza_coupon: Localized.pizzagyar_pizza_coupon,
    sms: Localized.sms,
    braintree: Localized.braintree,
    stripe: Localized.stripe,
    szep_kartya_sit_in: Localized.szep_kartya_sit_in,
    szep_kartya_phone: Localized.szep_kartya_phone,
    mkb_szep_sit_in: Localized.mkb_szep_sit_in,
    mkb_szep_on_delivery: Localized.mkb_szep_on_delivery,
    otp_szep_sit_in: Localized.otp_szep_sit_in,
    otp_szep_phone: Localized.otp_szep_phone,
    otp_szep_on_delivery: Localized.otp_szep_on_delivery,
    kah_szep_sit_in: Localized.kah_szep_sit_in,
    kah_szep_phone: Localized.kah_szep_phone,
    kah_szep_on_delivery: Localized.kah_szep_on_delivery,
    utalvany: Localized.utalvany,
    netpincer_card: Localized.netpincer_card,
    netpincer_szep: Localized.netpincer_szep,
    cash_phone: Localized.cash_phone,
    archived: Localized.archived
};

export function TranslateSegmentFunction(key) {
    return Localized[key];
}

export function getPaymethodLocalized(paymethods, paymethod) {
    for (let item of paymethods) {
        //console.log("translate", item, paymethod);
        if (paymethod === item.payment_key) {
            return item.name;
        }
    }
}

export const TranslatePlatform = {
    0: Localized.android,
    1: Localized.ios,
    2: Localized.browser,
    3: Localized.browser_ios,
    4: Localized.browser_android,
    5: Localized.facebook,
    6: Localized.messenger,
    7: Localized.sit_in,
    8: Localized.take_away,
    9: Localized.phone,
    10: Localized.pizzahu,
    11: Localized.ordit,
    12: Localized.netpincer,
    archived: Localized.archived
};

export function TranslatePlatformFunction(id) {
    switch (id) {
        case "0":
            return Localized.android;
        case "1":
            return Localized.ios;
        case "2":
            return Localized.browser;
        case "3":
            return Localized.browser_ios;
        case "4":
            return Localized.browser_android;
        case "5":
            return Localized.facebook;
        case "6":
            return Localized.messenger;
        case "7":
            return Localized.sit_in;
        case "8":
            return Localized.take_away;
        case "9":
            return Localized.phone;
        case "10":
            return Localized.pizzahu;
        case "11":
            return Localized.ordit;
        case "12":
            return Localized.netpincer;
        case "archived":
            return Localized.archived;
        default:
            return "undefiened platform";
    }
}

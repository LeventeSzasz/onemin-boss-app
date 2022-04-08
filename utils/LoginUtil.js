import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
var config = require("../config.json");

export function getMe(user_data) {
    let URL = config.base_url + "v3/admin/me";
    console.log("get ME", URL);

    let header = {};

    header.Accept = "application/json";
    header["Content-Type"] = "application/json";
    //header["Accept-Language"] = this.props.language;
    header.uid = user_data.uid;
    header.client = user_data.client;
    header["access-token"] = user_data.access_token;

    return fetch(URL, {
        method: "GET",
        headers: header
    });
}

export function getPermissions(user_data, language) {
    let URL = config.base_url + "v3/admin/permissions";
    console.log("getpermissions", URL);

    let header = {};

    header.Accept = "application/json";
    header["Content-Type"] = "application/json";
    header["Accept-Language"] = language;
    header.uid = user_data.uid;
    header.client = user_data.client;
    header["access-token"] = user_data.access_token;

    return fetch(URL, {
        method: "GET",
        headers: header
    });
}

export function getAppVersion(user_data) {
    let URL = `${config.base_url}v3/app-versions/boss_app_${Platform.OS}`;
    console.log("getAppversion", URL);

    let header = {};

    header.Accept = "application/json";
    header["Content-Type"] = "application/json";
    //header["Accept-Language"] = this.props.language;
    header.uid = user_data.uid;
    header.client = user_data.client;
    header["access-token"] = user_data.access_token;

    console.log("getappheaders", header);

    return fetch(URL, {
        method: "GET",
        headers: header
    });
}

export async function loadPermissions(user_data, language) {
    const [res0, res1] = await Promise.all([getMe(user_data), getPermissions(user_data, language)]);

    const myPermissions = await res0.json();
    const permissionList = await res1.json();

    const allowedPermissions = permissionList.filter(
        (permItem) => myPermissions.permission_ids.indexOf(permItem.id) >= 0
    );

    const permissionObject = {};

    for (let permission of allowedPermissions) {
        permissionObject[permission.key] = permission;
    }

    if (
        !permissionObject["admin_login"] ||
        !permissionObject["statistics"] ||
        !permissionObject["order"]
    ) {
        throw Error("NO_POS_ACCESS");
    }

    return myPermissions;
}

export async function checkForUpdate(user_data) {
    const backend_version = await (await getAppVersion(user_data)).json();

    console.log("backend versions", backend_version.version);

    let device_version = parseFloat(DeviceInfo.getVersion());
    let store_version = parseFloat(backend_version.version);

    return store_version > device_version;
}

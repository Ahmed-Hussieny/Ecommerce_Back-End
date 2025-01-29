import { systemRoles } from "../../utils/system-roles.js";

export const orderEndPointsRoles = {
    ADD_ORDER: [systemRoles.ADMIN, systemRoles.USER],
    CONVERT_CART_TO_ORDER: [systemRoles.ADMIN, systemRoles.USER],
    DELIVER_ORDER: [systemRoles.ADMIN],
    GET_ORDERS: [systemRoles.ADMIN],
    PAY_WITH_TAP: [systemRoles.ADMIN, systemRoles.USER],
};
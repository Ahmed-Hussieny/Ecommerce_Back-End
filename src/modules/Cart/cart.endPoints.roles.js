import { systemRoles } from "../../utils/system-roles.js";

export const cartEndPointsRoles = {
    ADD_TO_CART: [systemRoles.ADMIN, systemRoles.USER],
    REMOVE_FROM_CART: [systemRoles.ADMIN, systemRoles.USER],
    GET_CART: [systemRoles.ADMIN, systemRoles.USER],
    CLEAR_CART: [systemRoles.ADMIN, systemRoles.USER]
};
import { systemRoles } from "../../utils/system-roles.js";

export const couponEndPointsRoles = {
    ADD_COUPON: [systemRoles.ADMIN, systemRoles.USER],
    UPDATE_COUPON: [systemRoles.ADMIN, systemRoles.USER],
    DELETE_COUPON: [systemRoles.ADMIN, systemRoles.USER],
    GET_COUPON: [systemRoles.ADMIN, systemRoles.USER],
};
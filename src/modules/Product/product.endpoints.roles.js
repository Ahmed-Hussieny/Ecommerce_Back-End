import { systemRoles } from "../../utils/system-roles.js";

export const productEndPointsRoles = {
    ADD_PRODUCT: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    UPDATE_PRODUCT: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    DELETE_PRODUCT: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    GET_PRODUCT_BY_ID: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
};
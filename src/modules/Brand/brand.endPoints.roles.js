import { systemRoles } from "../../utils/system-roles.js";

export const brandEndPointsRoles = {
    ADD_BRAND: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    UPDATE_BRAND: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    DELETE_BRAND: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
};
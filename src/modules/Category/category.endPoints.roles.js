import { systemRoles } from "../../utils/system-roles.js";

export const categoryEndPointsRoles = {
    ADD_CATEGORY:  [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    UPDATE_CATEGORY:  [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    DELETE_CATEGORY:  [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER]
};
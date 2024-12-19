import { systemRoles } from "../../utils/system-roles.js";

export const subCategoryEndPointsRoles = {
    ADD_SUB_CATEGORY:  [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    UPDATE_SUB_CATEGORY:  [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    DELETE_SUB_CATEGORY:  [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER]
};
import { systemRoles } from "../../utils/system-roles.js";

export const userEndPointsRoles = {
    UPDATE_USER:[systemRoles.ADMIN, systemRoles.USER, systemRoles.SUPER_ADMIN],
    DELETE_USER:[systemRoles.ADMIN, systemRoles.USER, systemRoles.SUPER_ADMIN],
    GET_USER_BY_ID:[systemRoles.ADMIN, systemRoles.USER, systemRoles.SUPER_ADMIN],
    UPDATE_USER_PASSWORD:[systemRoles.ADMIN, systemRoles.USER, systemRoles.SUPER_ADMIN]
};
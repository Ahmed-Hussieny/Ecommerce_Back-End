import { systemRoles } from "../../utils/system-roles";

export const authEndPointsRoles = {
    SIGN_UP: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    VERIFY_EMAIL: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    SIGN_IN: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    FORGET_PASSWORD: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    VERIFY_RESET_CODE: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
    RESET_PASSWORD: [systemRoles.ADMIN, systemRoles.SUPER_ADMIN, systemRoles.USER],
};
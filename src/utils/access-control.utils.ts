import { LocalStore } from "./storage.utils"

export const can = (actions: string) => {
    const userData = LocalStore.get("USER_DATA");
    if (userData) {
        const permissions: [string] = userData.permissions;
        let hasPermission = permissions.filter(permission => permission.toUpperCase() === actions.toUpperCase());
        if (hasPermission.length > 0) {
            return true;
        }
    }
    return false;
}

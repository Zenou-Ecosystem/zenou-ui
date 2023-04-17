export const LocalStore = {
    set(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data))
    },
    get(key: string) {
        let val;
        if (localStorage.getItem(key)) {
            val = localStorage.getItem(key);
            return JSON.parse(val as any)
        }
        return false;
    },
    remove(key: string) {
        localStorage.removeItem(key)
    },
    clear(key: string) {
        localStorage.clear()
    }
}
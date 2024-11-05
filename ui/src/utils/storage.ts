export class storage {

    static SELECTED_LANGUAGE = "selected_language"
    static setItem = (key: string, value: string) => {
        if (value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
    static getItem = (key: string) => {
        let data = localStorage.getItem(key);
        if (data) {
            data = JSON.parse(data);
        }
        return data;
    }
}

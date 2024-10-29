import { ApiRequest } from "../types/data-types";

export enum MethodType {
    GET,
    POST
}

export class api {

    static Host =  "http://localhost:8080"

    static fetchRequestUri: ApiRequest = {
        url: () => (api.Host + "/request_uri"),
        methodType: MethodType.GET,
        headers: () => {
            return {
                "Content-Type": "application/json"
            }
        }
    }
 
}
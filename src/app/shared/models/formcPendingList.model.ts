// To parse this data:
//
//   import { Convert } from "./file";
//
//   const pendingListModel = Convert.toPendingListModel(json);

export interface PendingListModel {
    form_c_appl_id: null | string;
    given_name: null | string;
    surname: null | string;
    nationality: null | string;
    nationality_desc: null | string;
    country_outside_india: null | string;
    country_outside_india_desc: null | string;
    passnum: null | string;
    dob: null | string;
    img: null | string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toPendingListModel(json: string): PendingListModel[] {
        return JSON.parse(json);
    }

    public static pendingListModelToJson(value: PendingListModel[]): string {
        return JSON.stringify(value);
    }
}

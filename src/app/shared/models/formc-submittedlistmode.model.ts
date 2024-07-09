// To parse this data:
//
//   import { Convert } from "./file";
//
//   const submittedListModel = Convert.toSubmittedListModel(json);

export interface SubmittedListModel {
    form_c_appl_id:             string;
    given_name:                 null | string;
    surname:                    null | string;
    nationality:                null | string;
    nationality_desc:           null | string;
    country_outside_india:      string;
    country_outside_india_desc: string;
    passnum:                    null | string;
    dob:                        null | string;
    img:                        string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toSubmittedListModel(json: string): SubmittedListModel[] {
        return JSON.parse(json);
    }

    public static submittedListModelToJson(value: SubmittedListModel[]): string {
        return JSON.stringify(value);
    }
}

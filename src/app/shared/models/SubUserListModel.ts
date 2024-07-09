export interface SubUserListModel {
    userid: null | string;
    password: null | string;
    user_name: null | string;
    gender: null | string;
    designation: null | string;
    e_mail_id: null | string;
    phone_no: null | string;
    nationality: null | string;
    active: null | string;
  
}

// Converts JSON strings to/from your types
export class Convert {
    public static toSubUserListModel(json: string): SubUserListModel[] {
        return JSON.parse(json);
    }

    public static SubUserListModelToJson(value: SubUserListModel[]): string {
        return JSON.stringify(value);
    }
}
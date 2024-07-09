// To parse this data:
//
//   import { Convert } from "./file";
//
//   const formCDetails = Convert.toFormCDetails(json);

export interface FormCDetails {
    form_c_appl_id: string;
    acco_code: string;
    remark: string;
    entered_by: string;
    entered_on: string;
    name: string;
    surname: string;
    gender: string;
    genderDesc: string;
    dobformat: string;
    dob: string;
    nationality: string;
    nationalityDesc: string;
    addroutind: string;
    cityoutind: string;
    counoutind: string;
    counoutindDesc: string;
    passnum: string;
    passplace: string;
    passcoun: string;
    passcounDesc: string;
    passdate: string;
    passexpdate: string;
    visanum: string;
    visaplace: string;
    visacoun: string;
    visacounDesc: string;
    visadate: string;
    visaexpdate: string;
    visatype: string;
    visatypeDesc: string;
    visasubtype: string;
    visasubtypeDesc: string;
    arriplace: string;
    arricit: string;
    arricoun: string;
    arricounDesc: string;
    arridateind: string;
    arridatehotel: string;
    arritimehotel: string;
    durationofstay: string;
    nextdestplaceinind: string;
    nextdestdistinind: string;
    nextdestdistinindDesc: string;
    nextdeststateinind: string;
    nextdeststateinindDesc: string;
    nextdestcounflag: string;
    nextdestplaceoutind: string;
    nextdestcityoutind: string;
    nextdestcounoutind: string;
    nextdestcounoutindDesc: string;
    addrofrefinind: string;
    stateofrefinind: string;
    stateofrefinindDesc: string;
    cityofrefinind: string;
    cityofrefinindDesc: string;
    pincodeofref: string;
    mblnuminind: string;
    phnnuminind: string;
    mblnum: string;
    phnnum: string;
    employedinind: string;
    employedinindDesc: string;
    splcategorycode: string;
    splcategorycodeDesc: string;
    purposeofvisit: string;
    purposeofvisitDesc: string;
    img: string;
    frro_fro_code: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toFormCDetails(json: string): FormCDetails[] {
        return JSON.parse(json);
    }

    public static formCDetailsToJson(value: FormCDetails[]): string {
        return JSON.stringify(value);
    }
}

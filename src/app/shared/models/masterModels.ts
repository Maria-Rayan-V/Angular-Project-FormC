
export interface CountryModel {
    country_name: string;
    country_code: string;
}
export interface SplCategoryModel {
    splCatDesc: string;
    splCatCode: string;
}
export interface VisatypeModel {
    visaTypeCode: string;
    visaTypeDesc: string;
}
export interface StateModel {
    ststeName: string;
    stateCode: string;
}
export interface DistrictModel {
    districtName: string;
    districtCode: string;
}
export interface PurposeModel {
    purposeCode: string;
    purposeDesc: string;
}
export interface VisaSubtypeModel {
    visaSubType: string;
    purpose: string;
    purposeCode: string;
}
export interface AccoGradeModel {
    acco_grade:      string;
    acco_grade_desc: string;
}
export interface AccoTypeModel {
    acc_type_code: string;
    acc_type_name: string;
}

export interface FrroListModel {
    frro_fro_code: string;
    frro_fro_desc: string;
}

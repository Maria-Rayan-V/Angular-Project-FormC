export interface AccomodatorModel {
    accomName?:         string;
    accomCapacity?:     string;
    accomAddress?:      string;
    accomState?:        string;
    accomCityDist?:     string;
    frroTypeCode?:      string;
    accomodationType?:  string;
    accomodationGrade?: string;
    accomEmail?:        string;
    accomMobile?:       string;
    accomPhoneNum?:     string;
    ownerDetails?:      OwnerDetail[];
}

export interface OwnerDetail {
    name?:         string;
    address?:      string;
    state?:        string;
    stateName?:    null;
    cityDist?:     string;
    cityDistName?: null;
    emailID?:      string;
    phoneNum?:     string;
    mobile?:       string;
    accoCode?:     string;
    ownerCode?:    string;
    frroCode?:     string;
}

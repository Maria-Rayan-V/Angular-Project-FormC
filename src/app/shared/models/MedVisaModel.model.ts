export interface MedVisaModel{
fileRefNo?:string;
surname?: string;
medVisaRefno?:string;
patientName?: string;
patientGender?: string;
dob?: string;
patientNationality?: string;
pptNum?: string;
addressNative?: string;
addressIndia?: string;
patientState?: string;
patientCity?: string;
pincodeOfPatient?: string;
contactNative?: string;
contactIndia?: string;
emailId?: string;
treatment?: string;
doctorName?: string;
department?: string;
costOfTreatment?: string;
duration?: string;
tentativeDuration?: string;
visaNum?:string;
treatmentTaken?:string;
startingDate?:string;
attendantDetails?: AttendantModel[];

}
export interface AttendantModel{
  attSrno?:string;
    surname?: string;
    givenName?: string;
    gender?: string;
    dob?: string;
    nationality?: string;
    pptNum?: string;
    addressNative?: string;
    addressIndia?: string;
    attendanttState?: string;
    attendantCity?: string;
    pincodeOfAttendant?: string;
    contactNative?: string;
    contactIndia?: string;
    emailId?: string;
    relationship?:string;
}

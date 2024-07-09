import { DatePipe } from '@angular/common';
export const FORMC_GOV = `http://localhost:8082/formc`;
// export const FORMC_GOV=`https://indianfrro.gov.in/formc`;
// export const FORMC_GOV = `http://10.199.62.92:8082/formc`;
//  export const  FORMC_GOV = `http://10.199.62.79:8082/formc`;
// export const  FORMC_GOV = `http://10.248.140.157:8080/formc`;

export const LOGOUT_URL = `${FORMC_GOV}/formcLogout`;
export const GET_COUNTRY_URL = `${FORMC_GOV}/masters/country/`;
export const GET_ACCO_TYPE = `${FORMC_GOV}/masters/accommodation-type/`;
export const GET_ACCO_GRADE = `${FORMC_GOV}/masters/accommodation-grade/`;
export const GET_ARRIVAL_DETAIL_URL = `${FORMC_GOV}/get-arrivaldetail`;
export const POST_DEPART_DETAIL_URL = `${FORMC_GOV}/departdetail`;
export const GET_SPLCATEGORY_URL = `${FORMC_GOV}/masters/spl-category/`;
export const GET_STATE_URL = `${FORMC_GOV}/masters/state/`;
export const GET_DISTRICT_URL = `${FORMC_GOV}/masters/district-list/`;
export const GET_FRRO_LIST = `${FORMC_GOV}/masters/formc/frro-list/`;
export const GET_FRRO_DISTRICT = `${FORMC_GOV}/masters/frro-district/`;
export const GET_VISATYPE = `${FORMC_GOV}/masters/visa-type/`;
export const GET_VISASUBTYPE = `${FORMC_GOV}/masters/visa-subtype/`;
export const GET_VISIT_PURPOSE_URL = `${FORMC_GOV}/masters/visit-purpose/`;
export const POST_FORMC_DATA_URL = `${FORMC_GOV}/form-c`;
export const GET_APPDETAILSBY_PASSPORTANDNATIONALITY_URL = `${FORMC_GOV}/appdetail-by-passnum?`;
export const GET_APPLICANT_FULLDETAILS_URL = `${FORMC_GOV}/appdetail-by-appid?appid=`;
export const GET_APPLICANTS_LIST = `${FORMC_GOV}/userdetail?accoCode=`;
export const AUTHENTICATE_URL = `${FORMC_GOV}/authenticate`;
export const GET_SALT_URL = `${FORMC_GOV}/valid-user/formc/`;
export const GENERATE_APPLID = `${FORMC_GOV}/genrate-appid-web`;
export const GENERATE_MEDVISA_REFNO = `${FORMC_GOV}/generate-medvisa-refno`;
export const POST_PERSONAL_DETAILS = `${FORMC_GOV}/submit-personaldetails`;
export const POST_MEDVISA_DETAILS = `${FORMC_GOV}/submit-medvisa-details`;
export const POST_PATIENT_DETAILS = `${FORMC_GOV}/submit-patient-details`;
export const POST_TREATMENT_DETAILS = `${FORMC_GOV}/submit-treatment-details`;
export const POST_ATTENDANT_DETAILS = `${FORMC_GOV}/submit-attendant-details`;
export const POST_PASSPORTVISA_DETAILS = `${FORMC_GOV}/submit-passport-visa`;
export const POST_ARRIVALNXTDEST_DETAILS = `${FORMC_GOV}/submit-arrival-nextdest`;
export const POST_REFERENCEOTHERS_DETAILS = `${FORMC_GOV}/submit-refrence-contact`;
export const PHOTO_UPLOAD_URL = `${FORMC_GOV}/submit-photo`;
export const DOC_UPLOAD_URL = `${FORMC_GOV}/ih-document-upload`;
export const DOC_DOWNLOAD_URL = `${FORMC_GOV}/ih-document-download/`;
export const CHECK_CAPTCHA_URL = `${FORMC_GOV}/check-valid-captcha/`;
export const FINAL_SUBMIT_URL = `${FORMC_GOV}/formc-final-submit?appid=`;
export const PENDING_FORMC_DETAILS_LIST = `${FORMC_GOV}/pending-app-list?frroCode=`;
export const GET_FORMC_TEMPDETAILSBYAPPLID = `${FORMC_GOV}/edit-application?appid=`;
export const GET_MEDVISA_BY_ID = `${FORMC_GOV}/get-medvisa-details?fileRefno=`;
export const GET_SUBMITTED_MEDVISA_DTS = `${FORMC_GOV}/get-medvisa-submitted-details?fileRefno=`;
export const GET_FORMC_PENDINGAPPL_BYPASSNOANDNAT = `${FORMC_GOV}/pending-appdetail-by-passno-nat?passportNo=`;
export const GET_FORMC_SUBMITTEDAPPLBY_PPTNOANDNAT = `${FORMC_GOV}/submitted-appdetail-by-passno-nat?passportNo=`;
export const GET_FULL_DISTRICT_URL = `${FORMC_GOV}/masters/district`;
export const CURRENT_YEAR = new Date().getFullYear();
export const MAX_REGN_YR = new Date(CURRENT_YEAR - 10, 0, 1);
export const CURRENT_DATE = new Date();
export const snackbarDuration = 5000;
export const GET_PENDING_MEDVISA = `${FORMC_GOV}/pending-medvisa-details`;
export const GET_SUBMITTED_MEDVISA = `${FORMC_GOV}/submitted-medvisa-details`;
export const GET_MEDVISA_EXTN = `${FORMC_GOV}/get-medvisa-extn-details`;
export const GET_PENDINGBY_ACCOFRRO = `${FORMC_GOV}/temp-app-details?accoCode=`;
export const GET_PENDINGFORCHECKOUTBY_ACCOFRRO = `${FORMC_GOV}/app-details-pending-checkout?accoCode=`;
export const GET_DEPARTEDBY_ACCOFRRO = `${FORMC_GOV}/get-departed-details?accoCode=`;
export const GET_PENDINGLST_SUBUSER = `${FORMC_GOV}/temp-app-details-subuser?accoCode=`;
export const GET_PENDINGFORCHECKOUT_SUBUSER = `${FORMC_GOV}/pending-checkout-subuser?accoCode=`;
export const GET_DEPARTED_SUBUSER = `${FORMC_GOV}/departed-details-subuser?accoCode=`;
export const PRINT_DEPARTEDBY_APPLID = `${FORMC_GOV}/departuredetails/pdf/`;
export const CHANGE_PASSWORD_URL = `${FORMC_GOV}/change-passward`;
export const GENERATE_SUMMARY_ARRIVAL = `${FORMC_GOV}/generate-arrivaldetails-pdf`;
export const DELETE_PENDING_RECORD_BYAPPLID = `${FORMC_GOV}/delete-pending-appid/`;
export const GENERATE_SUMMARY_DEPARTURE = `${FORMC_GOV}/generate-departuredetails-pdf`;
export const GENERATE_SUMMARY_FORMCFEDDURING = `${FORMC_GOV}/generate-arrival-by-entredon-pdf`;
export const REFRESH_CAPTCHA_URL = `${FORMC_GOV}/valid-user/formc/refresh-captcha/`;
export const VALIDUSER_REGN_CAPTCHA = `${FORMC_GOV}/valid-user/formc/reg-captcha/`;
export const GET_MOBILE_OTP = `${FORMC_GOV}/valid-user/formc/mobile-otp/`;
export const GET_EMAIL_OTP = `${FORMC_GOV}/valid-user/formc/email-otp/`;
export const IH_USER_ACTIVATION = `${FORMC_GOV}/valid-user/formc/ih-user-activation`;
export const POST_USER_REGN_DTS = `${FORMC_GOV}/valid-user/formc/submit-user-details`;
export const POST_PSWD_UPDT_DTS = `${FORMC_GOV}/valid-user/formc/update-password`;
export const CHECK_PSWD_UPDT_DTS = `${FORMC_GOV}/valid-user/formc/forgot-password`;
export const POST_ACCOM_DTS = `${FORMC_GOV}/submit-accomdator-details`;
export const REG_FORM_FINAL_SUBMIT = `${FORMC_GOV}/submit-reg-form-details/`;
export const REG_FORM_PDF = `${FORMC_GOV}/user-reg-final-submit-pdf/`;
export const MEDVISA_PDF = `${FORMC_GOV}/medvisa-final-pdf/`;
export const FORMC_INDIVIDUAL_PDF = `${FORMC_GOV}/formc-individual-pdf/`;
export const POST_USR_PROF = `${FORMC_GOV}/update-profile`;
export const GET_ACCOM_DETAILS = `${FORMC_GOV}/get-accommodator-details?acco_code=`;
export const GET_UNAPPROVED_USERDTS = `${FORMC_GOV}/get-unapproved-userDts?frro_fro_code=`;
export const APPROVE_USERS = `${FORMC_GOV}/approve-user?frro_fro_code=`;
export const GET_MEDVISA_DETAILS = `${FORMC_GOV}/get-medvisa-details?fileRefno=`;
export const UPDATE_ACCOM_DETAILS = `${FORMC_GOV}/update-accomodator-details`;
export const GET_FORMC_COUNT = `${FORMC_GOV}/get-formc-applncnt/`;
export const POST_SUBUSER = `${FORMC_GOV}/add-subUser`;
export const GET_SUBUSER_DETAILS = `${FORMC_GOV}/get-subuser-list?frro_fro_code=`;
export const GET_SUBUSERS = `${FORMC_GOV}/get-subusers?frro_fro_code=`;
export const DELETE_SUB_USER = `${FORMC_GOV}/delete-sub-user/`;
export const UPDATE_SUBUSER_DETAILS = `${FORMC_GOV}/update-subUser-details`;
export const GENERATE_SUMMARY_BULK = `${FORMC_GOV}/generate-bulk-FormC-pdf`;
export const BULK_FORMC_SUBUSER = `${FORMC_GOV}/subuser-bulk-FormC`;
export const BULK_PRINT_ALL_SUBUSER = `${FORMC_GOV}/all-subuser-bulk-print`;
export const GENERATE_SUMMARY_SUBUSER = `${FORMC_GOV}/generate-summary-subuser`;
export const GENERATE_SUMMARY_ALL_SUBUSER = `${FORMC_GOV}/genSumm-all-subuser`;
export const UPDATE_MEDVISA_REFNODTS = `${FORMC_GOV}/update-medvisa-refno`;
export const UPDATE_PATIENT_DTS = `${FORMC_GOV}/update-patient-details`;
export const MEDVISA_EXTN_REFNO = `${FORMC_GOV}/generate-medvisaextn-refno`;
export const MEDVISA_FINAL_SUBMIT = `${FORMC_GOV}/medvisa-final-submit?appid=`;
export const MEDVISA_EXTN_FINAL_SUBMIT = `${FORMC_GOV}/medvisa-extn-final-submit?appid=`;
export const MEDVISA_PENDING_DELETE = `${FORMC_GOV}/delete-pending-medvisa/`;
export const PENDING_UNAPPROVED_USR = `${FORMC_GOV}/get-pending-unApprovedUserDts?frro_fro_code=`;
export const mbl_no_regn = '^[0-9]{10}$';
export const phn_no = '^[0-9+-]{6,15}$';

export function formatPendingDate(dateValue: string, date_format: string) {
  //'dd/MM/YYYY'
  if (dateValue) {
    let date_value = String(dateValue).replace(
      /(\d{2})-(\d{2})-(\d{4})/,
      '$2/$1/$3'
    );

    let formatted_date: string;
    //  console.log(date_value);
    const [year, month, day] = date_value.split('/');
    const date = day + '-' + month + '-' + year;
    try {
      formatted_date = new DatePipe('en-Us').transform(date_value, date_format);
      //console.log('Formatted', formatted_date);
    } catch (Error) {
      // console.log(Error.message);
      formatted_date = new DatePipe('en-Us').transform(date, date_format);
      // console.log('Formatted', formatted_date);
    }
    return formatted_date;
  } else {
    return null;
  }
}

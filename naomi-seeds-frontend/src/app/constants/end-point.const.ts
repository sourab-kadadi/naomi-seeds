/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import {environment} from '../../environments/environment';

export class EndPointConst {
    public static LOGIN = environment.server + '/auth/login';
    public static LOGOUT = environment.server + '/auth/logout';


/////AWS and other services
public static GET_PRESIGNED_S3_URL = environment.server + '/aws/preSignedUrl'



    ///////////////////////// Product list //////////////////////
    public static GET_PRODUCT_SCHEMA = environment.server + '/catalog/';
    public static PRODUCTS_LIST = environment.server + '/catalog/all';
    public static PRODUCT_ADD = environment.server + '/catalog/create';
    public static GET_PRODUCT_BY_ID = environment.server + '/catalog/find';
    public static PRODUCT_DROP_DOWN_ALL = environment.server + '/catalog/drop-down-active/all';
    public static PRODUCT_UPDATE = environment.server + '/catalog/update';
    
    ///////////////////////// Product Packing Size  //////////////////////
    public static PRODUCT_PACKING_SIZE_LIST = environment.server + '/product-packing-sizes/all';
    public static PRODUCT_PACKING_SIZE_ADD = environment.server + '/product-packing-sizes/create';
    public static GET_PRODUCT_PACKING_SIZE_BY_ID = environment.server + '/product-packing-sizes/find';
    public static PRODUCT_PACKING_SIZE_BY_ID_UPDATE = environment.server + '/product-packing-sizes/update';
    public static PACKING_SIZE_BY_PRODUCT_ID_DROPDOWN = environment.server + '/product-packing-sizes/dropdown-all-packing-size-by-product';


    
    ///////////////////////// Product Lot Data  //////////////////////
    public static CREATE_LOT_DATA_BASED_ON_PRODUCT = environment.server + '/LotData/create';
    public static UPDATE_LOT_DATA = environment.server + '/LotData/update';
    // public static DELETE_LOT_DATA = environment.server + '/LotData/delete';
    public static FIND_LOT_DETAILS_BY_ID = environment.server + '/LotData/find';
    // public static FIND_LOT_DETAILS_WITH_ACTIVEQUANTITY = environment.server + '/LotData/quantityAvailable/all';
    public static GET_LOT_DATA_ALL = environment.server + '/LotData/all';
    public static LOT_DATA_BY_PRODUCT_ID_DROPDOWN_BY_VALIDITY = environment.server + '/LotData/dropdown-all-lot-data-by-product-by-validity';
    // public static FIND_LOT_DETAILS_ALL_BY_PRODUCT_ID = environment.server + '/LotData/all';
    public static FIND_LOT_DETAILS_BY_ID_EXPANDED = environment.server + '/LotData/find-one-expanded';



    //////////////////////Products Category//////////////////////
    public static PRODUCTS_CATEGORY_LIST = environment.server + '/product-category/all';
    public static PRODUCT_CATEGORY_ADD = environment.server + '/product-category/create';
    public static GET_PRODUCT_CATEGORY_BY_ID = environment.server + '/product-category/find';
    public static PRODUCT_CATEGORY_UPDATE = environment.server + '/product-category/update';
    public static PRODUCT_CATEGORY_DROP_DOWN = environment.server + '/product-category/dropdown-all-product-category';



// not in use    ////////////////////////Inventory///////////////////////  not in use
///uot in use////    
public static CREATE_LOT_DATA = environment.server + '/LotData/create';
    // public static UPDATE_LOT_DATA = environment.server + '/LotData/update';
    public static DELETE_LOT_DATA = environment.server + '/LotData/delete';
    // public static FIND_LOT_DETAILS_BY_ID = environment.server + '/LotData/find';
    public static FIND_LOT_DETAILS_WITH_ACTIVEQUANTITY = environment.server + '/LotData/quantityAvailable/all';
    public static FIND_LOT_DETAILS_ALL = environment.server + '/LotData/all';






///////////////////////user -management //////////////////////
    public static REFRESH_TOKEN = environment.server + '/auth/renew-token'
    public static USER_REGISTRATION = environment.server + '/auth/signUp';
    public static GET_PERMISSIONS_DATA_BY_USER_ID = environment.server + '/auth/find';
public static GET_PERMISSIONS_DATA = environment.server + '/auth/user-permissions';
    public static GET_USER_DATA_BY_ID = environment.server + '/auth/find';
    public static UPDATE_USER = environment.server + '/auth/update';
    public static GET_ALL_USERS = environment.server + '/auth/all';
    public static GET_ALL_USERS_BASED_ON_USER_ROLE = environment.server + '/auth/dropdown-all-user-active';



///////////////////////////////Distributor List///////////////////

    public static DISTRIBUTOR_LIST = environment.server + '/profile/active/distributor';



/////////////////////////////Sales Person/////////////////////////

public static SALES_PERSON_LIST = environment.server + '/profile/all/sales-office';





//////////////latest//////////////////////////
/////////////////////////////orders///////////////
public static CREATE_SALES_ORDER_PM = environment.server + '/orders/createSalesPM';



public static ORDERS_LIST_ALL_ACTIVE = environment.server + '/orders/list-active/all';
public static GET_ORDER_DETAILS_BY_ID = environment.server + '/orders/find';
public static GET_PREVIOUS_LOT_SALE_PRICE = environment.server + '/orders/get-last-lot-sale-price';








//////////////Approvals and rejections/////////
public static FROM_PROFILE_APPROVAL_STAGE1 = environment.server + '/orders/fromProfileApprove';
public static FROM_PROFILE_REJECT_STAGE1 = environment.server + '/orders/fromProfileReject';
public static MANAGER_APPROVAL_DC_STAGE2 = environment.server + '/orders/managerApprovalDC';
public static MANAGER_REJECT_DC_STAGE2 = environment.server + '/orders/managerRejectDC';
public static SALES_OFFICER_APPROVAL_STAGE3 = environment.server + '/orders/salesOfficerShippingUpdate';
public static TO_PROFILE_APPROVAL_STAGE4 = environment.server + '/orders/receipentProfileConfirmation';
public static TO_PROFILE_REJECT_STAGE4 = environment.server + '/orders/receipentProfileReject';
public static MANAGER_FINAL_APPROVAL_STAGE5_ORDER = environment.server + '/orders/managerCompleteTxnorders';
public static MANAGER_FINAL_REJECT_STAGE5_ORDER = environment.server + '/orders/managerRejectCompleteTxnOrder';











///////////////////////old/////////////////
////remove below one////

public static CREATE_IPT = environment.server + '/ipt/createIPT';
public static IPT_ALL = environment.server + '/ipt/all';
public static GET_IPT_BY_SALES_PERSON = environment.server + '/ipt/sales/all';
public static GET_IPT_BY_ID = environment.server + '/ipt/find';
public static GET_IPT_BY_DISTRIBUTOR = environment.server + '/ipt/distributor/all';









///////////////Rejections//////











/////Delivery Challan//////////////////
///remove///
public static CREATE_DELIVERY_CHALLAN = environment.server + '/delivery-challan/create';
public static DELIVERY_CHALLAN_ALL = environment.server + '/delivery-challan/all';
public static GET_CHALLAN_BY_ID = environment.server + '/delivery-challan/find';
public static GET_CHALLAN_BY_SALES_PERSON = environment.server + '/delivery-challan/sales/all';
public static CHALLAN_APPROVAL = environment.server + '/delivery-challan/approveDelivaryChallan';

/////////////////////////////Invoice//////////////////////////////////////////
///remove///
public static CREATE_INVOICE = environment.server + '/invoice/create';
public static INVOICE_ALL = environment.server + '/invoice/all';
public static GET_INVOICE_BY_SALES_PERSON = environment.server + '/invoice/sales/all';


////////////////////////////////Payments Received//////////////////////

public static PAYMENT_RECEIVED = environment.server + '/payment/create';
public static PAYMENT_RECEIVED_ALL  = environment.server + '/payment/all';
public static UPDATE_PAYMENT_RECEIVED_ACCOUNTANT  = environment.server + '/payment/accountant-update';

public static GET_PAYMENT_RECEIVED_BY_ID  = environment.server + '/payment/find';

public static REJECT_PAYMENT_ACCOUNTANT  = environment.server + '/payment/reject-payment-accountant';






// ///////////////////////////Filter by user////////////////////

public static FILTER_FIND_SALES_ORDER_BY_USER  = environment.server + '/ipt/findByUser';






///////Dahsboard///////////
// DashBoard Distributor

public static FOR_DISTRIBUTOR_SUMMARY_DASHBOARD  = environment.server + '/ledger/dashboard/distributor/overview';
public static COMPANY_PERSPECTIVE_DISTRIBUTOR_DASHBOARD_DATA  = environment.server + '/ledger/dashboard/distributor/data';
public static DISTRIBUTOR_NET_QUANTITY_PURCHASED  = environment.server + '/ipt/dashboard/distributor/products-purchases';
public static DISTRIBUTOR_ACCOUNT_STATEMENT  = environment.server + '/ledger/statement/distributor';








////////////////////////////////Requirement//////////////////////

public static REQUIREMENT_CREATE = environment.server + '/requirement/create';
public static REQUIREMENT_GET_ALL  = environment.server + '/requirement/all';
public static REQUIREMENT_DASHBOARD  = environment.server + '/requirement/dashboard/totalRequirement';








////////////////////Ledgers///////////////////
public static LEDGER_GET = environment.server + '/ledger/statement/all';







////////////////////////general dropdowns/////////////////
public static GENERAL_DROPDOWNS_PAYMENTS_BUSINESS_CATEGORY = environment.server + '/drop-downs/activePaymentsBusinessCategory/all';
public static GENERAL_DROPDOWNS_DISTRIBUTOR_LEDGER = environment.server + '/drop-downs/activeLedgerDistributorCategory/all';
public static GENERAL_DROPDOWNS_STATES = environment.server + '/drop-downs/activeStates/all';
public static GENERAL_DROPDOWNS_DISTRICTS_BASED_ON_STATE = environment.server + '/drop-downs/activeDistricts-based-on-state/all';
public static GENERAL_DROPDOWNS_ZONES = environment.server + '/drop-downs/activeZones/all';





////////////// Roles and Permissions/////////////////

public static CREATE_ROLE_AND_PERMISSIONS = environment.server + '/roles-permissions/create';
public static UPDATE_PERMISSIONS = environment.server + '/roles-permissions/update';
public static GET_ROLE_AND_PERMISSION_BY_ID = environment.server + '/roles-permissions/find';
public static GET_ALL_ROLES_AND_PERMISSIONS = environment.server + '/roles-permissions/active/all';
// public static GET_ALL_ROLES = environment.server + '/roles-permissions/active/all';
public static GET_ALL_ACTIVE_ROLE_GROUPS_DROPDOWN = environment.server + '/roles-permissions/drop-down-role-groups/active/all';
public static GET_ALL_BY_USER_TYPE_ACTIVE_ROLE_GROUPS_DROPDOWN = environment.server + '/roles-permissions/drop-down-role-groups-by-user-types/active/all';
public static GET_ALL_BY_USER_TYPE_ACTIVE_ROLE_GROUPS_DROPDOWN_WITH_PERMISSIONS = environment.server + '/roles-permissions/drop-down-role-groups-by-user-types/active/all/with-permissions-data';

public static GET_ROLE_BY_SENIORITY_LEVEL = environment.server + '/roles-permissions/role-by-seniority-level';



////////////// Profile Management/////////////////

public static CREATE_PROFILE = environment.server + '/profile/create';
public static UPDATE_PROFILE = environment.server + '/profile/update';
public static GET_PROFILE_BY_ID = environment.server + '/profile/find';
public static GET_ALL_PROFILES = environment.server + '/profile/all';
public static GET_ALL_PROFILES_BASED_ON_PROFILE_ROLE = environment.server + '/profile/dropdown-all';
public static GET_ALL_DISTRIBUTOR_PROFILES = environment.server + '/profile/dropdown/distributors-all';
public static GET_ALL_DISTRIBUTOR_BY_USER_ALLOTMENT = environment.server + '/profile/find-all-alloted-distributors';






/////permissions from profile/////
// use the below after resolving authgaurd issue in backend
// public static GET_PERMISSIONS_DATA = environment.server + '/profile/profilePermissions';



public static GEN_TEST_PDF = environment.server + '/orders/trialPdf';



















    // category
    public static GET_ALL_CATEGORY = environment.server + '/category/active/all';
    public static GET_ALL_SUB_CATEGORY = environment.server + '/sub-category/active';













    
    //Profile   old//////////////////////
    public static GET_USER_ROLES = environment.server + '/profile/roles';
    public static GET_USER_LIST = environment.server + '/profile/all';

    // public static GET_SINGLE_USER_DATA = environment.server + '/profile/find';

    // public static FIND_JOB_DETAILS = environment.server + '/job-post/find';





    // public API

    // public static GET_ALL_COUNTRY = 'https://countriesnow.space/api/v0.1/countries/positions';
    // public static GET_ALL_CITY = 'https://countriesnow.space/api/v0.1/countries/state/cities';
    // public static GET_ALL_STATE = 'https://countriesnow.space/api/v0.1/countries/states';




    public static GET_CITY_STATE_INDIA_INDIAN_POSTAL_CODE = 'https://api.postalpincode.in/pincode';
    













}

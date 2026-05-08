import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Nav
    dashboard: "Dashboard",
    tenantDashboard: "Tenant Dashboard",
    landlordDashboard: "Landlord Dashboard",
    properties: "Properties",
    tenants: "Tenants",
    finance: "Finance",
    payments: "Payments",
    lease: "Lease",
    maintenance: "Maintenance",
    documents: "Documents",
    propertyInfo: "Property Info",
    communication: "Communication",
    settings: "Settings",
    logout: "Logout",
    profileInfo: "Profile Information",
    security: "Security",
    notifications: "Notifications",
    
    // Actions
    save: "Save Changes",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    verify: "Verify",
    reject: "Reject",
    upload: "Upload",
    download: "Download",
    view: "View",
    search: "Search",
    submit: "Submit",
    approve: "Approve",
    refresh: "Refresh List",
    editDetails: "Edit Details",
    
    // Dashboard / Headers
    welcome: "Welcome back",
    leaseOverview: "Here's your lease overview.",
    portfolioOverview: "Overview of your rental portfolio activity.",
    recentProperties: "Recent Properties",
    recentTenants: "Recent Tenants",
    rentDue: "Rent Due",
    activeProperties: "Active Properties",
    totalTenants: "Total Tenants",
    recentActivity: "Recent Activity",
    totalRevenue: "Total Revenue Collected",
    pendingVerifications: "Pending Verifications",
    awaitingApproval: "Awaiting Approval Amt",
    
    // Properties Form
    propertyName: "Property Name / Number",
    address: "Complete Address",
    landmark: "Landmark",
    pincode: "Pincode",
    propertyType: "Property Type",
    rentAmount: "Monthly Rent (₹)",
    securityDeposit: "Security Deposit (₹)",
    maintenanceCharges: "Maintenance Charges (₹)",
    maintenancePaidBy: "Maintenance Paid By",
    noticePeriod: "Notice Period (Months)",
    lockInPeriod: "Lock-in Period (Months)",
    electricityMeter: "Electricity Meter",
    waterSupply: "Water Supply",
    powerBackup: "Power Backup",
    parkingDetails: "Parking Details",
    furnishingStatus: "Furnishing Status",
    assetStatus: "Asset Status",
    addProperty: "Add New Property",
    editProperty: "Edit Property",
    
    // Tenants Form
    tenantName: "Tenant Name",
    email: "Email Address",
    phone: "Phone Number",
    rentStatus: "Rent Status",
    aadhaarNumber: "Aadhaar Number",
    panNumber: "PAN Number",
    occupation: "Occupation",
    leaseStart: "Lease Start Date",
    leaseEnd: "Lease End Date",
    emergencyContact: "Emergency Contact",
    addTenant: "Add New Tenant",
    editTenant: "Edit Tenant Details",
    
    // Payments
    recordPayment: "Record Payment",
    amountPaid: "Amount Paid",
    paymentMethod: "Payment Method",
    transactionId: "Transaction ID / Ref",
    paidFor: "Paid For",
    status: "Status",
    reference: "Reference",
    monthsCovered: "Select Months Covered",
    
    // Placeholders
    searchTenant: "Search by tenant...",
    enterName: "Enter full name",
    enterEmail: "e.g. tenant@email.com"
  },
  hi: {
    // Nav
    dashboard: "डैशबोर्ड",
    tenantDashboard: "किरायेदार डैशबोर्ड",
    landlordDashboard: "मकान मालिक डैशबोर्ड",
    properties: "संपत्तियां",
    tenants: "किरायेदार",
    finance: "वित्त",
    payments: "भुगतान",
    lease: "लीज",
    maintenance: "रखरखाव",
    documents: "दस्तावेज़",
    propertyInfo: "संपत्ति की जानकारी",
    communication: "संचार",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    profileInfo: "प्रोफ़ाइल जानकारी",
    security: "सुरक्षा",
    notifications: "सूचनाएं",
    
    // Actions
    save: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    verify: "सत्यापित करें",
    reject: "अस्वीकार करें",
    upload: "अपलोड करें",
    download: "डाउनलोड करें",
    view: "देखें",
    search: "खोजें",
    submit: "जमा करें",
    approve: "स्वीकार करें",
    refresh: "सूची ताज़ा करें",
    editDetails: "विवरण संपादित करें",
    
    // Dashboard / Headers
    welcome: "वापस स्वागत है",
    leaseOverview: "यहाँ आपकी लीज का विवरण है।",
    portfolioOverview: "आपकी रेंटल पोर्टफोलियो गतिविधि का अवलोकन।",
    recentProperties: "हाल की संपत्तियां",
    recentTenants: "हाल के किरायेदार",
    rentDue: "किराया देय",
    activeProperties: "सक्रिय संपत्तियां",
    totalTenants: "कुल किरायेदार",
    recentActivity: "हाल की गतिविधि",
    totalRevenue: "कुल राजस्व एकत्रित",
    pendingVerifications: "लंबित सत्यापन",
    awaitingApproval: "अनुमोदन की प्रतीक्षा राशि",
    
    // Properties Form
    propertyName: "संपत्ति का नाम / नंबर",
    address: "पूरा पता",
    landmark: "सीमा चिह्न",
    pincode: "पिनकोड",
    propertyType: "संपत्ति का प्रकार",
    rentAmount: "मासिक किराया (₹)",
    securityDeposit: "सुरक्षा जमा (₹)",
    maintenanceCharges: "रखरखाव शुल्क (₹)",
    maintenancePaidBy: "रखरखाव का भुगतान",
    noticePeriod: "नोटिस अवधि (महीने)",
    lockInPeriod: "लॉक-इन अवधि (महीने)",
    electricityMeter: "बिजली मीटर",
    waterSupply: "पानी की आपूर्ति",
    powerBackup: "पावर बैकअप",
    parkingDetails: "पार्किंग विवरण",
    furnishingStatus: "फर्नीचर की स्थिति",
    assetStatus: "संपत्ति की स्थिति",
    addProperty: "नई संपत्ति जोड़ें",
    editProperty: "संपत्ति संपादित करें",
    
    // Tenants Form
    tenantName: "किरायेदार का नाम",
    email: "ईमेल पता",
    phone: "फ़ोन नंबर",
    rentStatus: "किराया स्थिति",
    aadhaarNumber: "आधार नंबर",
    panNumber: "पैन नंबर",
    occupation: "व्यवसाय",
    leaseStart: "लीज शुरू होने की तारीख",
    leaseEnd: "लीज खत्म होने की तारीख",
    emergencyContact: "आपातकालीन संपर्क",
    addTenant: "नया किरायेदार जोड़ें",
    editTenant: "किरायेदार का विवरण संपादित करें",
    
    // Payments
    recordPayment: "भुगतान रिकॉर्ड करें",
    amountPaid: "भुगतान की गई राशि",
    paymentMethod: "भुगतान विधि",
    transactionId: "लेन-देन आईडी / संदर्भ",
    paidFor: "के लिए भुगतान किया गया",
    status: "स्थिति",
    reference: "संदर्भ",
    monthsCovered: "कवर किए गए महीनों का चयन करें",
    
    // Placeholders
    searchTenant: "खोजें...",
    enterName: "पूरा नाम दर्ज करें",
    enterEmail: "जैसे: tenant@email.com"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'en');

  useEffect(() => {
    localStorage.setItem('appLang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => useContext(LanguageContext);

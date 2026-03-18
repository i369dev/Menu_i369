
export type Page = 'work' | 'about' | 'curation' | 'contact' | 'admin';

export interface Project {
  id: number;
  title: string; // Excluded from translation
  subtitle: string;
  subtitle_si?: string;
  subtitle_ta?: string;
  year: string;
  location: string;
  category: string;
  image: string;
  video: string;
  description?: string;
  description_si?: string;
  description_ta?: string;
  services: string[];
  services_si?: string[];
  services_ta?: string[];
  credits?: { role: string; name: string }[];
  detailImages: string[];
  themeColor: string; // Background color for detail view
  textColor: string; // Text color for detail view
  isVisible?: boolean; // New Visibility Toggle
  pricing?: {
    designOnly: number;
    designAndPrint: {
      minQty: number;
      basePrice: number;
      unitPrice: number;
    };
  };
}

export interface CuratedItem {
  id: number;
  title: string;
  artist: string;
  image?: string;
  video?: string;
  isVisible?: boolean; // New Visibility Toggle
}

export interface Order {
  id: string;
  date: string;
  clientName: string; // Excluded
  mobile: string;
  business: string;
  projectName: string; // Excluded
  type: string;
  quantity: number | string;
  total: number;
  status: 'pending' | 'completed';
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  isVisible?: boolean; // New Visibility Toggle
}

export interface ContactEmail {
    id: number;
    email: string;
}

export interface TeamMember {
  id: number;
  name: string; // Excluded from translation
  role: string;
  role_si?: string;
  role_ta?: string;
  bio: string;
  bio_si?: string;
  bio_ta?: string;
  image: string;
  figLabel: string;
  isVisible?: boolean; // New Visibility Toggle
}

export interface TrustedClient {
  business_name: string;
  logo_url?: string;
  isVisible?: boolean; // New Visibility Toggle
}

export interface PrintRate {
  id: string;
  inkCoverage: string;
  paperType: string;
  weight: string; // Can be string like '-'
  sides: string;
  price_tier1: number; // Qty < 50
  price_tier2: number; // Qty 51-100
  price_tier3: number; // Qty 101-500
  price_tier4: number; // Qty 501-1000
  price_tier5: number; // Qty > 1000
}

export interface FinishingRatesConfig {
  pouchLaminating: { a4: number; a3: number };
  laminating: { 
    a4: { silky: number; matte: number; gloss: number; }; 
    a3: { silky: number; matte: number; gloss: number; }; 
  };
  boardPrice: { 
    sunboard_single: number; 
    sunboard_double: number; 
    cladding_single: number; 
    cladding_double: number; 
    corrugated_single: number; 
    corrugated_double: number; 
  };
  leatherCover: { 
    a5: number; 
    a4: number; 
    a3: number; 
    a3_third: number; 
  };
  binding: { 
    spiral: number; 
  };
}

export interface SiteConfig {
  unitPriceIncrease: number; // Keep for type compatibility if needed, though unused
  // Branding Assets
  logoLight: string;
  logoDark: string;
  loadingLogo: string;
  aboutLogo: string;
  footerLogo: string;
  whatsappIcon: string;
  
  // Contact & Social
  whatsappNumber: string;
  contactEmail: string; // Legacy/Primary support
  contactEmails: ContactEmail[]; // New Dynamic List
  socialLinks: SocialLink[];
  
  // Content / Copy
  aboutDescription: string;
  aboutDescription_si?: string;
  aboutDescription_ta?: string;
  
  aboutSpatial: string; // New Field
  aboutSpatial_si?: string; // New Field
  aboutSpatial_ta?: string; // New Field

  curationIntro: string;
  curationIntro_si?: string;
  curationIntro_ta?: string;
  agencyTagline: string;
  agencyTagline_si?: string;
  agencyTagline_ta?: string;
  
  // Privacy Policy Dynamic Content
  pp_introText: string;
  pp_introText_si?: string;
  pp_introText_ta?: string;

  pp_dataText: string;
  pp_dataText_si?: string;
  pp_dataText_ta?: string;

  pp_dataList: string[];
  pp_dataList_si?: string[];
  pp_dataList_ta?: string[];

  pp_usageText: string;
  pp_usageText_si?: string;
  pp_usageText_ta?: string;

  pp_usageList: string[];
  pp_usageList_si?: string[];
  pp_usageList_ta?: string[];

  pp_thirdPartyText: string;
  pp_thirdPartyText_si?: string;
  pp_thirdPartyText_ta?: string;

  pp_contactText: string;
  pp_contactText_si?: string;
  pp_contactText_ta?: string;

  // Quotation Template
  quotationHeader: string;
  quotationHeader_si?: string;
  quotationHeader_ta?: string;
  quotationTerms: string;
  quotationTerms_si?: string;
  quotationTerms_ta?: string;

  // Team
  teamMembers: TeamMember[];
}

export interface AppUser {
  uid: string;
  email: string;
  role: 'Super Admin' | 'Editor' | 'Sales';
  permissions: string[];
}

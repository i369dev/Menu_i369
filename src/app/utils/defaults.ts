
import { Project, CuratedItem, SiteConfig, TrustedClient, FinishingRatesConfig } from '../types';

export const initialProjects: Project[] = [];

export const initialCuratedItems: CuratedItem[] = [];

export const initialFinishingRates: FinishingRatesConfig = {
  pouchLaminating: { a4: 0, a3: 0 },
  laminating: {
    a4: { silky: 0, matte: 0, gloss: 0 },
    a3: { silky: 0, matte: 0, gloss: 0 }
  },
  boardPrice: {
    sunboard_single: 0,
    sunboard_double: 0,
    cladding_single: 0,
    cladding_double: 0,
    corrugated_single: 0,
    corrugated_double: 0
  },
  leatherCover: {
    a5: 0,
    a4: 0,
    a3: 0,
    a3_third: 0
  },
  binding: {
    spiral: 0
  }
};

export const initialConfig: SiteConfig = {
    unitPriceIncrease: 0,
    logoLight: "",
    logoDark: "",
    loadingLogo: "",
    aboutLogo: "",
    footerLogo: "",
    whatsappIcon: "",
    quotationLogo: "",
    
    whatsappNumber: "",
    contactEmail: "",
    contactEmails: [],
    
    socialLinks: [],
    
    aboutDescription: "",
    aboutDescription_si: "",
    aboutDescription_ta: "",

    aboutSpatial: "",
    aboutSpatial_si: "",
    aboutSpatial_ta: "",

    curationIntro: "",
    curationIntro_si: "",
    curationIntro_ta: "",

    agencyTagline: "",
    agencyTagline_si: "",
    agencyTagline_ta: "",
    
    pp_introText: "",
    pp_introText_si: "",
    pp_introText_ta: "",

    pp_dataText: "",
    pp_dataText_si: "",
    pp_dataText_ta: "",

    pp_dataList: [],
    pp_dataList_si: [],
    pp_dataList_ta: [],

    pp_usageText: "",
    pp_usageText_si: "",
    pp_usageText_ta: "",

    pp_usageList: [],
    pp_usageList_si: [],
    pp_usageList_ta: [],

    pp_thirdPartyText: "",
    pp_thirdPartyText_si: "",
    pp_thirdPartyText_ta: "",

    pp_contactText: "",
    pp_contactText_si: "",
    pp_contactText_ta: "",

    quotationHeader: "",
    quotationHeader_si: "",
    quotationHeader_ta: "",
    quotationTerms: "",
    quotationTerms_si: "",
    quotationTerms_ta: "",
    quoteMarkupPercentage: 0,

    teamMembers: []
};

export const initialClients: TrustedClient[] = [];

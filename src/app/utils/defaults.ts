
import { Project, CuratedItem, SiteConfig, TrustedClient, FinishingRatesConfig } from '../types';
import { getProjects } from './projectData';
import { translations } from './translations';

// Merge translations from the static projectData helper into the initial state
const enProjects = getProjects('en');
const siProjects = getProjects('si');
const taProjects = getProjects('ta');

export const initialProjects: Project[] = enProjects.map((p, i) => ({
    ...p,
    isVisible: true,
    subtitle_si: siProjects[i]?.subtitle || "",
    subtitle_ta: taProjects[i]?.subtitle || "",
    description_si: siProjects[i]?.description || "",
    description_ta: taProjects[i]?.description || "",
    services_si: siProjects[i]?.services || [],
    services_ta: taProjects[i]?.services || [],
}));

export const initialCuratedItems: CuratedItem[] = [
  { id: 1, title: "Motion Menu", artist: "Gastronomy", video: "https://videos.pexels.com/video-files/3196238/3196238-uhd_2560_1440_25fps.mp4", isVisible: true },
  { id: 2, title: "Print Fusion", artist: "Tactile", image: "https://images.unsplash.com/photo-1550921096-c6501fa06726?q=80&w=2070&auto=format&fit=crop", isVisible: true },
  { id: 3, title: "Culinary Set", artist: "Styling", video: "https://videos.pexels.com/video-files/4057321/4057321-uhd_2560_1440_25fps.mp4", isVisible: true },
  { id: 4, title: "Menu Layout", artist: "Typography", image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop", isVisible: true },
  { id: 5, title: "Digital Board", artist: "Motion", video: "https://videos.pexels.com/video-files/3205779/3205779-uhd_2560_1440_25fps.mp4", isVisible: true },
  { id: 6, title: "Table Setting", artist: "Ambience", image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1780&auto=format&fit=crop", isVisible: true },
  { id: 7, title: "Cinematic Pour", artist: "Detail", video: "https://videos.pexels.com/video-files/4114797/4114797-uhd_2560_1440_25fps.mp4", isVisible: true }
];

export const initialFinishingRates: FinishingRatesConfig = {
  pouchLaminating: { a4: 100, a3: 200 },
  laminating: {
    a4: { silky: 50, matte: 50, gloss: 50 },
    a3: { silky: 110, matte: 110, gloss: 110 }
  },
  boardPrice: {
    sunboard_single: 5,
    sunboard_double: 7,
    cladding_single: 7,
    cladding_double: 9,
    corrugated_single: 4,
    corrugated_double: 5
  },
  leatherCover: {
    a5: 700,
    a4: 1600,
    a3: 2000,
    a3_third: 1000
  },
  binding: {
    spiral: 300
  }
};

const defaultQuotationHeader = `
    <div style="font-weight: bold;">Imaginative369</div>
    <div>BADULLA Uva Province 90000</div>
    <div>SriLanka</div>
    <div>{{whatsappNumber}}</div>
    <div>{{contactEmail}}</div>
    <div>www.imaginative369.com</div>
`;

const defaultQuotationTerms = `
    <p><strong>A 50% advance is required</strong> to begin the project, with the remaining 50% payable before final delivery. For printed materials, full payment is required before dispatch and any relevant materials from you.</p>
    <p>
        Payments can be made via bank transfer to the following account:<br />
        <strong>D M M B N BANDARA</strong><br />
        <strong>105910004367</strong><br />
        <strong>Pan Asia Bank</strong>
    </p>
    <p><strong>Project Timelines:</strong> The completed designs will be delivered in agreed formats within 7 days after approval. Expedited delivery is available upon request.</p>
    <p><strong>Revisions:</strong> Unlimited revisions are included until the final approval.</p>
    <p><strong>Ownership Rights:</strong> Upon full payment, the client gains full usage rights to the designs. Imaginative369 retains the right to showcase the work in its portfolio.</p>
    <p><strong>Cancellation Policy:</strong> The advance payment is non-refundable if the client cancels after work begins.</p>
    <p><strong>Confidentiality:</strong> All client-provided materials and information will be treated as confidential.</p>
`;


export const initialConfig: SiteConfig = {
    unitPriceIncrease: 0,
    logoLight: "",
    logoDark: "",
    loadingLogo: "",
    aboutLogo: "",
    footerLogo: "",
    whatsappIcon: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    quotationLogo: "",
    
    whatsappNumber: "94770000000",
    contactEmail: "projects@imaginative369.com",
    contactEmails: [
        { id: 1, email: "projects@imaginative369.com" },
        { id: 2, email: "jobs@imaginative369.com" }
    ],
    
    aboutDescription: "Imaginative 369 is a multi-disciplinary design studio and creative consultancy nestled in the vibrant city of Düsseldorf, Germany. Established in 2024 by Seaver Rada, our expertise lies in the realms of interior design, art direction, and branding.",
    aboutDescription_si: "Imaginative 369 යනු ජර්මනියේ Düsseldorf හි පිහිටි බහුවිධ නිර්මාණ ස්ටුඩියෝවකි. 2024 දී Seaver Rada විසින් ආරම්භ කරන ලද අපගේ විශේෂඥතාව වන්නේ අභ්‍යන්තර නිර්මාණකරණය, කලා අධ්‍යක්ෂණය සහ සන්නාමකරණයයි.",
    aboutDescription_ta: "Imaginative 369 என்பது ஜெர்மனியின் Düsseldorf நகரில் அமைந்துள்ள வடிவமைப்பு ஸ்டுடியோ ஆகும். 2024 இல் Seaver Rada வால் தொடங்கப்பட்ட இது, இன்டீரியர் டிசைன், கலை இயக்கம் மற்றும் பிராண்டிங் ஆகியவற்றில் நிபுணத்துவம் பெற்றது.",

    aboutSpatial: "Spatial design is about creating environments that enrich human well-being. A thoughtfully crafted space calms the mind, inspires creativity, and evokes emotion.",
    aboutSpatial_si: "අවකාශීය නිර්මාණය යනු මානව යහපැවැත්ම ඉහළ නැංවීමයි. කල්පනාකාරීව නිමවූ අවකාශයක් මනස සන්සුන් කරමින් නිර්මාණශීලීත්වය අවදි කරයි.",
    aboutSpatial_ta: "இடஞ்சார்ந்த வடிவமைப்பு மனித நல்வாழ்வை மேம்படுத்துகிறது. சிந்தனையுடன் வடிவமைக்கப்பட்ட இடம் மனதை அமைதிப்படுத்தி படைப்பாற்றலைத் தூண்டுகிறது.",

    curationIntro: "A curated showcase of gastronomic visuals, motion menus, and print & digital fusion.",
    curationIntro_si: "ආහාරපාන කලාව, චලන මෙනු සහ මුද්‍රිත හා ඩිජිටල් නිර්මාණ එකතුවක්.",
    curationIntro_ta: "உணவுக்கலை காட்சிகள், மோஷன் மெனுக்கள் மற்றும் டிஜிட்டல் வடிவமைப்புகளின் தொகுப்பு.",

    agencyTagline: "Premier Hotel, Cafe & Restaurant Menu Design Agency",
    agencyTagline_si: "ප්‍රමුඛ පෙළේ හෝටල්, කැෆේ සහ අවන්හල් මෙනු නිර්මාණ ආයතනය",
    agencyTagline_ta: "முதன்மை ஹோட்டல், கஃபே & உணவக மெனு வடிவமைப்பு நிறுவனம்",
    
    // Privacy Policy Defaults
    pp_introText: translations.en.privacyPolicy.introText,
    pp_introText_si: translations.si.privacyPolicy.introText,
    pp_introText_ta: translations.ta.privacyPolicy.introText,

    pp_dataText: translations.en.privacyPolicy.dataText,
    pp_dataText_si: translations.si.privacyPolicy.dataText,
    pp_dataText_ta: translations.ta.privacyPolicy.dataText,

    pp_dataList: translations.en.privacyPolicy.dataList,
    pp_dataList_si: translations.si.privacyPolicy.dataList,
    pp_dataList_ta: translations.ta.privacyPolicy.dataList,

    pp_usageText: translations.en.privacyPolicy.usageText,
    pp_usageText_si: translations.si.privacyPolicy.usageText,
    pp_usageText_ta: translations.ta.privacyPolicy.usageText,

    pp_usageList: translations.en.privacyPolicy.usageList,
    pp_usageList_si: translations.si.privacyPolicy.usageList,
    pp_usageList_ta: translations.ta.privacyPolicy.usageList,

    pp_thirdPartyText: translations.en.privacyPolicy.thirdPartyText,
    pp_thirdPartyText_si: translations.si.privacyPolicy.thirdPartyText,
    pp_thirdPartyText_ta: translations.ta.privacyPolicy.thirdPartyText,

    pp_contactText: translations.en.privacyPolicy.contactText,
    pp_contactText_si: translations.si.privacyPolicy.contactText,
    pp_contactText_ta: translations.ta.privacyPolicy.contactText,

    // Quotation Template Defaults
    quotationHeader: defaultQuotationHeader,
    quotationHeader_si: defaultQuotationHeader, // Placeholder, should be translated
    quotationHeader_ta: defaultQuotationHeader, // Placeholder, should be translated
    quotationTerms: defaultQuotationTerms,
    quotationTerms_si: defaultQuotationTerms, // Placeholder, should be translated
    quotationTerms_ta: defaultQuotationTerms, // Placeholder, should be translated
    quoteMarkupPercentage: 0,

    socialLinks: [
      { id: 1, platform: "Facebook", url: "#", icon: "https://cdn-icons-png.flaticon.com/512/733/733547.png", isVisible: true },
      { id: 2, platform: "Instagram", url: "#", icon: "https://cdn-icons-png.flaticon.com/512/733/733558.png", isVisible: true },
      { id: 3, platform: "TikTok", url: "#", icon: "https://cdn-icons-png.flaticon.com/512/3046/3046121.png", isVisible: true }
    ],
    
    teamMembers: [
      {
          id: 1,
          role: "Owner",
          role_si: "හිමිකරු",
          role_ta: "உரிமையாளர்",
          name: "Seaver Rada",
          bio: "As a creative director and interior designer, my calling is to bring ideas to life. With a BSc. in Psychology, I combine a trained understanding of human behavior with a refined eye for design.",
          bio_si: "නිර්මාණාත්මක අධ්‍යක්ෂකවරයෙකු ලෙස මගේ අරමුණ අදහස් ජීවමාන කිරීමයි. මනෝවිද්‍යාව පිළිබඳ උපාධියක් (BSc) සමගින්, මම මිනිස් හැසිරීම් පිළිබඳ අවබෝධය නිර්මාණකරණයට මුසු කරමි.",
          bio_ta: "கிரியேட்டிவ் டைரக்டராக, யோசனைகளை உயிர்ப்பிப்பதே எனது நோக்கம். உளவியலில் (BSc) பட்டம் பெற்ற நான், மனித நடத்தை பற்றிய புரிதலை வடிவமைப்போடு இணைக்கிறேன்.",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
          figLabel: "Fig [01]",
          isVisible: true
      },
      {
          id: 2,
          role: "Video Editor",
          role_si: "වීඩියෝ සංස්කාරක",
          role_ta: "வீடியோ எடிட்டர்",
          name: "Alex Morgan",
          bio: "A visionary storyteller shaping narratives through rhythm and motion. Alex transforms raw footage into compelling visual experiences, ensuring every frame resonates with the brand's core identity.",
          bio_si: "රිද්මය සහ චලනය හරහා කතාන්දර මවන දූරදර්ශී නිර්මාණකරුවෙකි. ඇලෙක්ස් අමු දර්ශන ආකර්ෂණීය දෘශ්‍ය අත්දැකීම් බවට පරිවර්තනය කරයි, සෑම රූපරාමුවක්ම සන්නාමයේ අනන්‍යතාවය සමඟ අනුනාද වන බවට වග බලා ගනී.",
          bio_ta: "ரிதம் மற்றும் இயக்கம் மூலம் கதைகளை வடிவமைக்கும் ஒரு தொலைநோக்கு கதைசொல்லி. அலெக்ஸ் மூல காட்சிகளை கட்டாய காட்சி அனுபவங்களாக மாற்றுகிறார், ஒவ்வொரு சட்டமும் பிராண்டின் முக்கிய அடையாளத்துடன் எதிரொலிப்பதை உறுதிசெய்கிறார்.",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
          figLabel: "Fig [02]",
          isVisible: true
      }
    ]
};

export const initialClients: TrustedClient[] = [
    { business_name: "GOOGLE", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png", isVisible: true },
    { business_name: "AMAZON", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png", isVisible: true },
    { business_name: "NETFLIX", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Netflix_logo.svg/2560px-Netflix_logo.svg.png", isVisible: true },
    { business_name: "SPOTIFY", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png", isVisible: true },
    { business_name: "IMAGINATIVE CAFE", logo_url: undefined, isVisible: true },
    { business_name: "APPLE", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png", isVisible: true },
    { business_name: "MICROSOFT", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/2560px-Microsoft_logo_%282012%29.svg.png", isVisible: true },
    { business_name: "TESLA", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/2000px-Tesla_Motors.svg.png", isVisible: true },
    { business_name: "LUXURY HOTEL", logo_url: undefined, isVisible: true },
    { business_name: "SAMSUNG", logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png", isVisible: true }
];

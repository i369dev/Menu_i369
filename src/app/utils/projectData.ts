

import { Project } from '../types';
import { Language, translations } from './translations';

// Helper to get localized projects
export const getProjects = (lang: Language): Project[] => {
    const t = translations[lang].work;
    const commonT = translations[lang].common;
    
    // --- Data Definitions ---
    // Note: Project Titles (Names) MUST remain in English UPPERCASE.
    
    return [
      {
        id: 1,
        title: "A3 TRIFOLD MENU",
        subtitle: lang === 'si' ? "වාරික මුද්‍රණය" : lang === 'ta' ? "பிரீமியம் அச்சு" : "Premium Print",
        year: `${commonT.currency} 9,990`, 
        location: t.islandWide,
        category: "Menu Design",
        image: "https://images.unsplash.com/photo-1544257753-27d2c9cf0167?q=80&w=1900&auto=format&fit=crop",
        video: "https://videos.pexels.com/video-files/3196238/3196238-uhd_2560_1440_25fps.mp4",
        description: lang === 'si' 
            ? "සියුම් භෝජන සංග්‍රහයන් සඳහා අතිවිශිෂ්ට ස්පර්ශීය අත්දැකීමක්. මෙම A3 ත්‍රිත්ව-නැම්ුම් (Trifold) මෙනුව ඝන කපු කඩදාසි, 'blind debossing' සහ අවම යතුරුලියනය (typography) භාවිතා කරමින් සුඛෝපභෝගී බව මනාව විදහා දක්වයි."
            : lang === 'ta'
            ? "சிறந்த உணவருந்தும் அனுபவத்திற்கான ஒரு நேர்த்தியான வடிவமைப்பு. இந்த A3 Trifold மெனு கனமான காட்டன் காகிதம், 'blind debossing' மற்றும் குறைந்தபட்ச எழுத்துருக்களைக் கொண்டு ஆடம்பரத்தை வெளிப்படுத்துகிறது."
            : "An exquisite tactile experience for fine dining. This A3 Trifold menu features heavy cotton paper, blind debossing, and minimal typography to whisper luxury rather than shout it.",
        services: lang === 'si' 
            ? ["A3", "TRI FOLD", "310GSM", "GLOSS/MATTE LAMINATE", "අයිතම 120+", "පින්තූර", "මුද්‍රණය", t.delivery]
            : lang === 'ta'
            ? ["A3", "TRI FOLD", "310GSM", "GLOSS/MATTE LAMINATE", "120+ உருப்படிகள்", "படங்கள்", "அச்சு", t.delivery]
            : ["A3", "TRI FOLD", "310GSM", "GLOSS/ MATTE LAMINATE", "120+ ITEMS", "IMAGES", "PRINT", t.delivery],
        pricing: {
            designOnly: 4700,
            designAndPrint: {
                minQty: 10,
                basePrice: 9990,
                unitPrice: 280
            }
        },
        themeColor: "#f5f5f5", 
        textColor: "#1a1a1a",
        detailImages: [
            "https://images.unsplash.com/photo-1544257753-27d2c9cf0167?q=80&w=1900&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop",
        ]
      },
      {
          id: 2,
          title: "A4 MENU BOOKLET",
          subtitle: lang === 'si' ? "පොතක් ලෙස සකසන ලද" : lang === 'ta' ? "கட்டுப்பட்ட கையேடு" : "Bound Booklet",
          year: `${commonT.currency} 7,500`,
          location: t.islandWide,
          category: "Booklet Design",
          image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1900&auto=format&fit=crop",
          video: "https://videos.pexels.com/video-files/3205779/3205779-uhd_2560_1440_25fps.mp4",
          description: lang === 'si'
            ? "සංකීර්ණ සහ සාරවත් නිර්මාණයකි. විවිධ ආහාර වර්ග පිරිනමන ආයතන සඳහා මෙම A4 මෙනු පොත ඉතා සුදුසුය. උසස් තත්ත්වයේ කඩදාසිවල නිවැරදිව මුද්‍රණය කර ඇත."
            : lang === 'ta'
            ? "நவீனமான மற்றும் கணிசமான வடிவமைப்பு. A4 மெனு கையேடு, பலதரப்பட்ட உணவுகளைப் பட்டியலிடுவதற்கு ஏற்றது. பிரீமியம் தாளில் துல்லியமாக அச்சிடப்பட்டு கட்டமைக்கப்பட்டுள்ளது."
            : "Sophisticated and substantial. The A4 Menu Booklet allows for extensive listings, perfect for establishments with diverse offerings. Bound with precision and printed on premium stock.",
        services: lang === 'si'
            ? ["A4 SIZE", "BOOKLET BINDING", "PREMIUM PAPER", "CUSTOM COVER", "FULL COLOR"]
            : lang === 'ta'
            ? ["A4 SIZE", "BOOKLET BINDING", "PREMIUM PAPER", "CUSTOM COVER", "FULL COLOR"]
            : ["A4 SIZE", "BOOKLET BINDING", "PREMIUM PAPER", "CUSTOM COVER", "FULL COLOR"],
          pricing: {
            designOnly: 3500,
            designAndPrint: {
                minQty: 10,
                basePrice: 7500,
                unitPrice: 200
            }
          },
          themeColor: "#1a1a1a",
          textColor: "#ffffff",
          detailImages: [
              "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1900&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=2069&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1974&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1563823251945-86f3702e88a3?q=80&w=1974&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1536939460292-626a5cd59828?q=80&w=1974&auto=format&fit=crop"
          ]
      },
      {
        id: 3,
        title: "11.75x5.75 MENU BOOKLET",
        subtitle: lang === 'si' ? "විශේෂිත ප්‍රමාණය" : lang === 'ta' ? "தனிப்பயன் வடிவம்" : "Custom Format",
        year: `${commonT.currency} 6,800`,
        location: t.islandWide,
        category: "Specialty Format",
        image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1900&auto=format&fit=crop",
        video: "https://videos.pexels.com/video-files/4057321/4057321-uhd_2560_1440_25fps.mp4",
        description: lang === 'si'
            ? "අලංකාරය විදහා දක්වන සුවිශේෂී, සිහින් හැඩතලයකි. වයින් ලැයිස්තු, අතුරුපස මෙනු හෝ සීමිත තේරීම් සඳහා වඩාත් සුදුසුය."
            : lang === 'ta'
            ? "நேர்த்தியை வெளிப்படுத்தும் ஒரு தனித்துவமான, மெல்லிய வடிவம். ஒயின் பட்டியல்கள், இனிப்பு மெனுக்கள் அல்லது வரையறுக்கப்பட்ட தேர்வுகளுக்கு ஏற்றது."
            : "A unique, slender format that exudes elegance. Ideal for wine lists, dessert menus, or limited selection dining. The custom dimensions create a memorable hand-feel.",
        services: ["CUSTOM DIMENSION", "ELEGANT SLIM", "TEXTURED STOCK", "FOIL ACCENTS", "SADDLE STITCH"],
        pricing: {
            designOnly: 3200,
            designAndPrint: {
                minQty: 10,
                basePrice: 6800,
                unitPrice: 180
            }
        },
        themeColor: "#e5e5e5",
        textColor: "#1a1a1a",
        detailImages: [
            "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1900&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542181961-9523d76bd6fd?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=2073&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?q=80&w=2070&auto=format&fit=crop"
        ]
      },
      {
        id: 4,
        title: "A4 TRIFOLD",
        subtitle: lang === 'si' ? "සම්භාව්‍ය නිර්මාණය" : lang === 'ta' ? "சிறிய கிளாசிக்" : "Compact Classic",
        year: `${commonT.currency} 5,200`,
        location: t.islandWide,
        category: "Folded Menu",
        image: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070&auto=format&fit=crop",
        video: "https://videos.pexels.com/video-files/3196238/3196238-uhd_2560_1440_25fps.mp4", 
        description: lang === 'si'
            ? "බහුකාර්යතාව සඳහා කර්මාන්තයේ සම්මතය. අපගේ A4 Trifold මෙනුව මේසය මත අඩු ඉඩක් ගන්නා අතරම අයිතම සඳහා ප්‍රමාණවත් ඉඩක් ලබා දෙයි."
            : lang === 'ta'
            ? "பல்வேறு பயன்பாட்டிற்கான தொழில்துறை தரம். எங்களின் A4 Trifold மெனு, மேசையில் இடத்தைச் சேமிப்பதோடு உணவு வகைகளைப் பட்டியலிட போதுமான இடத்தையும் வழங்குகிறது."
            : "The industry standard for versatility. Our A4 Trifold offers ample space for items while remaining compact on the table. Durable laminate options ensure longevity in high-traffic environments.",
        services: ["A4", "TRI FOLD", "COMPACT DESIGN", "LAMINATED FINISH", "FULL COLOR"],
        pricing: {
            designOnly: 2500,
            designAndPrint: {
                minQty: 10,
                basePrice: 5200,
                unitPrice: 150
            }
        },
        themeColor: "#f5f5f5", 
        textColor: "#1a1a1a",
        detailImages: [
            "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1544257753-27d2c9cf0167?q=80&w=1900&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
        ]
      },
      {
        id: 5,
        title: "A3 TRIFOLD",
        subtitle: lang === 'si' ? "විශාල ප්‍රමාණය" : lang === 'ta' ? "பெரிய வடிவம்" : "Large Format",
        year: `${commonT.currency} 8,500`,
        location: t.islandWide,
        category: "Folded Menu",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=2069&auto=format&fit=crop",
        video: "https://videos.pexels.com/video-files/3205779/3205779-uhd_2560_1440_25fps.mp4", 
        description: lang === 'si'
            ? "උපරිම ආකර්ෂණය සහ පහසුව. A3 Trifold මෙනුව ආහාර ඡායාරූප සහ විස්තරාත්මක තොරතුරු සඳහා විශාල ඉඩක් ලබා දෙයි."
            : lang === 'ta'
            ? "அதிகபட்ச தாக்கம், வசதிக்காக மடிக்கப்பட்டது. A3 Trifold உணவுப் புகைப்படம் மற்றும் விரிவான விளக்கங்களுக்கு பெரிய இடத்தைத் தருகிறது."
            : "Maximum impact, folded for convenience. The A3 Trifold provides a large canvas for food photography and detailed descriptions, folding down to a manageable size for your guests.",
        services: ["A3", "TRI FOLD", "STANDARD", "HIGH GLOSS", "DURABLE"],
        pricing: {
            designOnly: 4000,
            designAndPrint: {
                minQty: 10,
                basePrice: 8500,
                unitPrice: 250
            }
        },
        themeColor: "#1a1a1a",
        textColor: "#ffffff",
        detailImages: [
            "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=2069&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1900&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1563823251945-86f3702e88a3?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1536939460292-626a5cd59828?q=80&w=1974&auto=format&fit=crop"
        ]
      },
      {
        id: 6,
        title: "A3",
        subtitle: lang === 'si' ? "පෝස්ටර් මෙනුව" : lang === 'ta' ? "போஸ்டர் மெனு" : "Poster Menu",
        year: `${commonT.currency} 3,000`,
        location: t.islandWide,
        category: "Single Sheet",
        image: "https://images.unsplash.com/photo-1542181961-9523d76bd6fd?q=80&w=2070&auto=format&fit=crop",
        video: "https://videos.pexels.com/video-files/4057321/4057321-uhd_2560_1440_25fps.mp4",
        description: lang === 'si'
            ? "සරල සහ ඵලදායී. මෙම A3 තනි පිටුවේ මෙනුව සාමාන්‍ය භෝජන සංග්‍රහ හෝ 'placemat' මෙනුවක් ලෙස භාවිතයට ඉතා සුදුසුය."
            : lang === 'ta'
            ? "எளிமையான மற்றும் நேரடியான வடிவமைப்பு. A3 ஒற்றை தாள் மெனு சாதாரண உணவருந்துமிடங்கள் அல்லது 'placemat' மெனுவாகப் பயன்படுத்த ஏற்றது."
            : "Simple, direct, and effective. The A3 single sheet menu is perfect for casual dining or as a placemat menu. Printed on thick cardstock to withstand the rigors of service.",
        services: ["A3 POSTER", "SINGLE SHEET", "THICK CARD", "MATTE/GLOSS", "PLACEMAT STYLE"],
        pricing: {
            designOnly: 1500,
            designAndPrint: {
                minQty: 10,
                basePrice: 3000,
                unitPrice: 100
            }
        },
        themeColor: "#e5e5e5",
        textColor: "#1a1a1a",
        detailImages: [
            "https://images.unsplash.com/photo-1542181961-9523d76bd6fd?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1900&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=2073&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1594149929911-78975a43d4f5?q=80&w=2070&auto=format&fit=crop"
        ]
      }
    ];
};

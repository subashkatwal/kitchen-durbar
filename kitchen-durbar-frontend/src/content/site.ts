import { useLanguage, type Language } from '../context/LanguageContext'
import type { Category } from '../types'

import equipmentLine from '../assets/design/equipment-line.jpg'
import heroKitchen from '../assets/design/hero-kitchen.jpg'
import kitchenPlanning from '../assets/design/kitchen-planning.jpg'
import projectBakery from '../assets/design/project-bakery.jpg'
import projectHotel from '../assets/design/project-hotel.jpg'
import projectInstitution from '../assets/design/project-institution.jpg'
import teamKitchenDurbar from '../assets/design/team-kitchen-durbar.jpg'

/**
 * Long-form marketing copy for the public site (home/about/solutions/...),
 * kept separate from the flat UI-string dictionaries in i18n/. Both languages
 * implement the same SiteContent shape, so TypeScript flags any section that's
 * missing a translation.
 */

/**
 * Every admin-replaceable photo slot on the storefront (Admin → Site Images),
 * with the design photo used until one is uploaded. Keys mirror
 * cms.models.SiteImage.Slot on the backend.
 */
export const SITE_IMAGE_SLOTS = {
  home_hero: { label: 'Home - hero', group: 'Page heroes', fallback: heroKitchen },
  about_hero: { label: 'About - hero', group: 'Page heroes', fallback: heroKitchen },
  solutions_hero: { label: 'Solutions - hero', group: 'Page heroes', fallback: projectHotel },
  products_hero: { label: 'Products - hero', group: 'Page heroes', fallback: equipmentLine },
  projects_hero: { label: 'Projects - hero', group: 'Page heroes', fallback: projectInstitution },
  services_hero: { label: 'Services - hero', group: 'Page heroes', fallback: kitchenPlanning },
  contact_hero: { label: 'Contact - hero', group: 'Page heroes', fallback: kitchenPlanning },
  home_approach: { label: 'Home - "Our approach"', group: 'Section photos', fallback: kitchenPlanning },
  about_partner: { label: 'About - "A complete partner"', group: 'Section photos', fallback: kitchenPlanning },
  about_team: { label: 'About - team photo', group: 'Section photos', fallback: teamKitchenDurbar },
  auth_panel: { label: 'Login / register side panel', group: 'Section photos', fallback: heroKitchen },
  category_burner: { label: 'Burner', group: 'Category tiles', fallback: equipmentLine },
  category_table: { label: 'Table', group: 'Category tiles', fallback: kitchenPlanning },
  category_rack: { label: 'Rack', group: 'Category tiles', fallback: projectInstitution },
  category_sink: { label: 'Sink', group: 'Category tiles', fallback: projectHotel },
  category_showcase: { label: 'Showcase', group: 'Category tiles', fallback: projectBakery },
  category_chiller: { label: 'Chiller', group: 'Category tiles', fallback: projectInstitution },
  category_fryer: { label: 'Fryer', group: 'Category tiles', fallback: equipmentLine },
  category_shelves: { label: 'Shelves', group: 'Category tiles', fallback: projectBakery },
  category_chimney: { label: 'Chimney', group: 'Category tiles', fallback: projectHotel },
  category_others: { label: 'Others', group: 'Category tiles', fallback: heroKitchen },
} as const

export type SiteImageSlot = keyof typeof SITE_IMAGE_SLOTS

export function categorySlot(category: Category): SiteImageSlot {
  return `category_${category.toLowerCase()}` as SiteImageSlot
}

/** Contact details shown in the footer, contact section and map. */
export const COMPANY = {
  phone: '+977 980 311 2717',
  phoneHref: 'tel:+9779803112717',
  email: 'kitchendurbarsolutions@gmail.com',
  mapEmbed: 'https://www.google.com/maps?q=KK+Mart+Bhaisepati+Kathmandu+Nepal&output=embed',
}

type Pair = readonly [title: string, copy: string]

interface Hero {
  eyebrow: string
  title: string
  copy: string
}

export interface SiteContent {
  address: { line1: string; line2: string; full: string }
  footerTagline: string
  footerCopyright: string
  cta: { eyebrow: string; title: string; copy: string }
  categoryLabels: Record<Category, string>
  sectors: Pair[]
  services: Pair[]
  steps: string[]
  home: {
    heroEyebrow: string
    heroTitle: string
    heroCopy: string
    stats: Pair[]
    sinceValue: string
    sinceLabel: string
    approachEyebrow: string
    approachTitle: string
    approachCopy: string
    approachPoints: string[]
    sectorsEyebrow: string
    sectorsTitle: string
    categoriesEyebrow: string
    categoriesTitle: string
    featuredEyebrow: string
    featuredTitle: string
    featuredCopy: string
    whyEyebrow: string
    whyTitle: string
    processEyebrow: string
    processTitle: string
    projectsEyebrow: string
    projectsTitle: string
    testimonialEyebrow: string
  }
  team: {
    eyebrow: string
    title: string
    copy: string
    empty: string
  }
  about: {
    hero: Hero
    partnerEyebrow: string
    partnerTitle: string
    partnerCopy: string
    stats: Pair[]
    teamEyebrow: string
    teamTitle: string
    teamCopy: string
    teamCopy2: string
    capabilitiesEyebrow: string
    capabilitiesTitle: string
  }
  solutions: { hero: Hero; eyebrow: string; title: string }
  products: { hero: Hero; eyebrow: string; title: string }
  product: {
    specifications: string
    applications: string
    applicationItems: string[]
    related: string
  }
  projectsPage: { hero: Hero; eyebrow: string; title: string; empty: string }
  servicesPage: {
    hero: Hero
    eyebrow: string
    title: string
    alsoEyebrow: string
    alsoTitle: string
    alsoItems: Pair[]
  }
  contact: {
    hero: Hero
    eyebrow: string
    title: string
    copy: string
    visitEyebrow: string
    visitTitle: string
  }
}

const en: SiteContent = {
  address: {
    line1: 'Near KK Mart, Bhaisepati',
    line2: 'Kathmandu, Nepal',
    full: 'Near KK Mart, Bhaisepati, Kathmandu, Nepal',
  },
  footerTagline: 'Complete commercial kitchen planning, equipment, fabrication, installation and support across Nepal.',
  footerCopyright: '© 2026 Kitchen Durbar Solutions. Built for professional kitchens.',
  cta: {
    eyebrow: 'Start a conversation',
    title: 'Planning a new kitchen?',
    copy: 'Bring us your menu, space and ambition. We’ll help shape the rest.',
  },
  categoryLabels: {
    Burner: 'Burners',
    Table: 'Tables',
    Rack: 'Racks',
    Sink: 'Sinks',
    Showcase: 'Showcases',
    Chiller: 'Chillers',
    Fryer: 'Fryers',
    Shelves: 'Shelves',
    Chimney: 'Chimneys',
    Others: 'Others',
  },
  sectors: [
    ['Restaurants', 'Fast, ergonomic lines designed around your menu.'],
    ['Hotels & Resorts', 'Multi-outlet systems for kitchens, banquets and bars.'],
    ['Bakeries & Cafés', 'Reliable production, display and beverage workflows.'],
    ['Hospitals & Institutions', 'Hygienic, high-volume systems built for compliance.'],
    ['Central Kitchens', 'Scalable production, storage and dispatch planning.'],
    ['Bars & Beverage', 'Compact, efficient stations shaped around service.'],
  ],
  services: [
    ['Consultation', 'Clarify capacity, cuisine, service model and investment priorities.'],
    ['Kitchen Planning', 'Map efficient workflows, utilities and equipment placement.'],
    ['Equipment Supply', 'Source dependable commercial equipment for every station.'],
    ['Custom Fabrication', 'Build made-to-measure stainless steel counters and systems.'],
    ['Installation', 'Coordinate delivery, placement, testing and handover.'],
    ['After-Sales Support', 'Support teams with training, service and practical guidance.'],
  ],
  steps: ['Consult', 'Plan', 'Select', 'Install', 'Support'],
  home: {
    heroEyebrow: 'Commercial kitchen specialists · Nepal',
    heroTitle: 'Built for kitchens that never stop.',
    heroCopy:
      'We plan, supply, fabricate and install complete commercial kitchens-engineered around your menu, team and service.',
    stats: [
      ['150+', 'Projects'],
      ['120+', 'Clients'],
      ['A–Z', 'Solutions'],
    ],
    sinceValue: 'Since 2017',
    sinceLabel: 'Hospitality expertise',
    approachEyebrow: 'Our approach',
    approachTitle: 'Complete kitchen solutions, from planning to installation.',
    approachCopy:
      'A productive kitchen begins long before equipment arrives. We align workflow, utilities, capacity and service demands-then bring every piece together with one accountable team.',
    approachPoints: ['Workflow-led planning', 'Reliable equipment', 'Custom fabrication', 'Local support'],
    sectorsEyebrow: 'Built around your operation',
    sectorsTitle: 'Solutions for every service environment.',
    categoriesEyebrow: 'Equipment categories',
    categoriesTitle: 'Everything a professional kitchen needs.',
    featuredEyebrow: 'Featured equipment',
    featuredTitle: 'Selected for serious service.',
    featuredCopy: 'Commercial-grade equipment chosen for dependable output, efficient operation and long working lives.',
    whyEyebrow: 'Why Kitchen Durbar Solutions',
    whyTitle: 'One team. Every stage.',
    processEyebrow: 'How we work',
    processTitle: 'Clear from first conversation to daily service.',
    projectsEyebrow: 'Selected projects',
    projectsTitle: 'Kitchens made to perform.',
    testimonialEyebrow: 'Client perspective',
  },
  team: {
    eyebrow: 'Our team',
    title: 'The people behind every kitchen.',
    copy: 'Planners, fabricators and installation technicians who stay with your project from the first sketch to the first service.',
    empty: 'Team profiles are on their way.',
  },
  about: {
    hero: {
      eyebrow: 'About Kitchen Durbar Solutions',
      title: 'Built on practical kitchen expertise.',
      copy: 'Since 2017, we have helped hospitality and institutional teams turn demanding briefs into dependable working kitchens.',
    },
    partnerEyebrow: 'A complete partner',
    partnerTitle: 'We think beyond the equipment list.',
    partnerCopy:
      'Every project is shaped by menu, capacity, staff movement, utilities, hygiene and service rhythm. Our role is to connect those details into one coherent kitchen-from initial consultation to training and after-sales support.',
    stats: [
      ['150+', 'Projects completed'],
      ['120+', 'Clients served'],
    ],
    teamEyebrow: 'How we work together',
    teamTitle: 'One team, accountable from plan to handover.',
    teamCopy:
      'Our planners, equipment specialists and installation technicians combine hospitality insight with hands-on technical experience.',
    teamCopy2:
      'We work closely across every stage, so design decisions, equipment selection and site execution remain aligned with your operation.',
    capabilitiesEyebrow: 'Our capabilities',
    capabilitiesTitle: 'Technical confidence at every step.',
  },
  solutions: {
    hero: {
      eyebrow: 'Sector expertise',
      title: 'Every operation works differently.',
      copy: 'We design equipment packages and workflows around the realities of your service model.',
    },
    eyebrow: 'Where we work',
    title: 'Solutions shaped by service.',
  },
  products: {
    hero: {
      eyebrow: 'Equipment catalogue',
      title: 'Specified for performance.',
      copy: 'Explore dependable commercial equipment for cooking, preparation, storage, washing and service.',
    },
    eyebrow: 'Browse equipment',
    title: 'Built for the pace of professional service.',
  },
  product: {
    specifications: 'Specifications',
    applications: 'Applications',
    applicationItems: ['Restaurants', 'Hotels & resorts', 'Central kitchens', 'Institutions'],
    related: 'Related equipment',
  },
  projectsPage: {
    hero: {
      eyebrow: 'Selected work',
      title: 'Designed to work beautifully.',
      copy: 'A cross-section of commercial kitchens built for high standards, demanding teams and daily performance.',
    },
    eyebrow: 'Project archive',
    title: 'From first plan to first service.',
    empty: 'Project photos are being added - check back soon.',
  },
  servicesPage: {
    hero: {
      eyebrow: 'Services',
      title: 'Expertise beyond equipment.',
      copy: 'One accountable team to guide your kitchen from early planning through installation, training and support.',
    },
    eyebrow: 'End-to-end support',
    title: 'A clear path to opening day.',
    alsoEyebrow: 'Beyond stainless steel',
    alsoTitle: 'Services that keep your kitchen running.',
    alsoItems: [
      ['Gas Pipeline Installation', 'Safe, code-conscious LPG pipeline layouts for every burner and range.'],
      ['Chimney & Ducting', 'Hoods, chimneys and ducting sized for proper extraction and airflow.'],
      ['Entire Kitchen Servicing', 'Routine maintenance and repairs to keep every station in service.'],
    ],
  },
  contact: {
    hero: {
      eyebrow: 'Contact',
      title: 'Bring us your kitchen brief.',
      copy: 'Whether you are opening, renovating or replacing equipment, we will help define the right next step.',
    },
    eyebrow: 'Contact',
    title: 'Let’s build a better kitchen.',
    copy: 'Speak with our team about a new opening, renovation or equipment requirement.',
    visitEyebrow: 'Visit our office',
    visitTitle: 'Find us in Bhaisepati.',
  },
}

const ne: SiteContent = {
  address: {
    line1: 'केके मार्ट नजिक, भैंसेपाटी',
    line2: 'काठमाडौं, नेपाल',
    full: 'केके मार्ट नजिक, भैंसेपाटी, काठमाडौं, नेपाल',
  },
  footerTagline: 'नेपालभर व्यावसायिक भान्साको योजना, उपकरण, फेब्रिकेसन, जडान र सहयोग - सबै एकै ठाउँमा।',
  footerCopyright: '© २०२६ किचन दरबार सोलुसन्स। व्यावसायिक भान्साका लागि निर्मित।',
  cta: {
    eyebrow: 'कुराकानी सुरु गरौं',
    title: 'नयाँ भान्साको योजना बनाउँदै हुनुहुन्छ?',
    copy: 'आफ्नो मेनु, ठाउँ र लक्ष्य लिएर आउनुहोस्। बाँकी हामी मिलेर आकार दिन्छौं।',
  },
  categoryLabels: {
    Burner: 'बर्नरहरू',
    Table: 'टेबलहरू',
    Rack: 'र्‍याकहरू',
    Sink: 'सिंकहरू',
    Showcase: 'शोकेसहरू',
    Chiller: 'चिलरहरू',
    Fryer: 'फ्रायरहरू',
    Shelves: 'सेल्फहरू',
    Chimney: 'चिम्नीहरू',
    Others: 'अन्य',
  },
  sectors: [
    ['रेस्टुरेन्ट', 'तपाईंको मेनु अनुसार डिजाइन गरिएका छिटो र सहज लाइनहरू।'],
    ['होटल तथा रिसोर्ट', 'भान्सा, भोज र बारका लागि बहु-आउटलेट प्रणाली।'],
    ['बेकरी तथा क्याफे', 'भरपर्दो उत्पादन, डिस्प्ले र पेय कार्यप्रवाह।'],
    ['अस्पताल तथा संस्था', 'मापदण्ड अनुरूप स्वच्छ, ठूलो क्षमताका प्रणाली।'],
    ['केन्द्रीय भान्सा', 'विस्तारयोग्य उत्पादन, भण्डारण र वितरण योजना।'],
    ['बार तथा पेय', 'सेवा अनुसार बनाइएका साना र प्रभावकारी स्टेसनहरू।'],
  ],
  services: [
    ['परामर्श', 'क्षमता, खानाको प्रकार, सेवा मोडेल र लगानी प्राथमिकता स्पष्ट गर्ने।'],
    ['भान्सा योजना', 'प्रभावकारी कार्यप्रवाह, युटिलिटी र उपकरणको स्थान निर्धारण।'],
    ['उपकरण आपूर्ति', 'हरेक स्टेसनका लागि भरपर्दो व्यावसायिक उपकरण।'],
    ['कस्टम फेब्रिकेसन', 'नाप अनुसार स्टेनलेस स्टिल काउन्टर र प्रणाली निर्माण।'],
    ['जडान', 'ढुवानी, स्थापना, परीक्षण र हस्तान्तरणको समन्वय।'],
    ['बिक्रीपछिको सेवा', 'तालिम, सर्भिस र व्यावहारिक मार्गदर्शनमार्फत सहयोग।'],
  ],
  steps: ['परामर्श', 'योजना', 'छनोट', 'जडान', 'सहयोग'],
  home: {
    heroEyebrow: 'व्यावसायिक भान्सा विशेषज्ञ · नेपाल',
    heroTitle: 'कहिल्यै नरोकिने भान्साका लागि।',
    heroCopy:
      'हामी तपाईंको मेनु, टोली र सेवा अनुसार पूर्ण व्यावसायिक भान्साको योजना, आपूर्ति, फेब्रिकेसन र जडान गर्छौं।',
    stats: [
      ['150+', 'परियोजना'],
      ['120+', 'ग्राहक'],
      ['A–Z', 'समाधान'],
    ],
    sinceValue: '२०१७ देखि',
    sinceLabel: 'आतिथ्य क्षेत्रको अनुभव',
    approachEyebrow: 'हाम्रो तरिका',
    approachTitle: 'योजनादेखि जडानसम्म, पूर्ण भान्सा समाधान।',
    approachCopy:
      'उत्पादक भान्सा उपकरण आउनुभन्दा धेरै अघि सुरु हुन्छ। हामी कार्यप्रवाह, युटिलिटी, क्षमता र सेवाको माग मिलाउँछौं-अनि एउटै जिम्मेवार टोलीमार्फत सबै कुरा जोड्छौं।',
    approachPoints: ['कार्यप्रवाहमा आधारित योजना', 'भरपर्दो उपकरण', 'कस्टम फेब्रिकेसन', 'स्थानीय सहयोग'],
    sectorsEyebrow: 'तपाईंको सञ्चालन अनुसार',
    sectorsTitle: 'हरेक सेवा वातावरणका लागि समाधान।',
    categoriesEyebrow: 'उपकरण श्रेणीहरू',
    categoriesTitle: 'व्यावसायिक भान्सालाई चाहिने सबै कुरा।',
    featuredEyebrow: 'विशेष उपकरण',
    featuredTitle: 'गम्भीर सेवाका लागि छानिएका।',
    featuredCopy: 'भरपर्दो उत्पादन, कुशल सञ्चालन र लामो आयुका लागि छानिएका व्यावसायिक स्तरका उपकरण।',
    whyEyebrow: 'किन किचन दरबार सोलुसन्स',
    whyTitle: 'एउटै टोली। हरेक चरण।',
    processEyebrow: 'हामी कसरी काम गर्छौं',
    processTitle: 'पहिलो कुराकानीदेखि दैनिक सेवासम्म स्पष्ट।',
    projectsEyebrow: 'छानिएका परियोजना',
    projectsTitle: 'काम गर्नकै लागि बनाइएका भान्सा।',
    testimonialEyebrow: 'ग्राहकको दृष्टिकोण',
  },
  team: {
    eyebrow: 'हाम्रो टोली',
    title: 'हरेक भान्सा पछाडिका मानिसहरू।',
    copy: 'पहिलो स्केचदेखि पहिलो सेवासम्म तपाईंको परियोजनासँगै रहने योजनाकार, फेब्रिकेटर र जडान प्राविधिकहरू।',
    empty: 'टोली परिचय छिट्टै आउँदैछ।',
  },
  about: {
    hero: {
      eyebrow: 'किचन दरबार सोलुसन्सको बारेमा',
      title: 'व्यावहारिक भान्सा अनुभवमा आधारित।',
      copy: '२०१७ देखि, हामीले आतिथ्य र संस्थागत टोलीहरूलाई कठिन आवश्यकताहरूलाई भरपर्दो भान्सामा बदल्न सहयोग गरेका छौं।',
    },
    partnerEyebrow: 'पूर्ण साझेदार',
    partnerTitle: 'हामी उपकरणको सूचीभन्दा पर सोच्छौं।',
    partnerCopy:
      'हरेक परियोजना मेनु, क्षमता, कर्मचारीको आवतजावत, युटिलिटी, स्वच्छता र सेवाको लयले आकार लिन्छ। हाम्रो काम ती सबैलाई जोडेर एउटा सुसंगत भान्सा बनाउनु हो-प्रारम्भिक परामर्शदेखि तालिम र बिक्रीपछिको सेवासम्म।',
    stats: [
      ['150+', 'सम्पन्न परियोजना'],
      ['120+', 'सेवा पाएका ग्राहक'],
    ],
    teamEyebrow: 'हामी सँगै कसरी काम गर्छौं',
    teamTitle: 'योजनादेखि हस्तान्तरणसम्म जिम्मेवार एउटै टोली।',
    teamCopy: 'हाम्रा योजनाकार, उपकरण विशेषज्ञ र जडान प्राविधिकहरूले आतिथ्यको बुझाइलाई प्राविधिक अनुभवसँग जोड्छन्।',
    teamCopy2:
      'हामी हरेक चरणमा नजिकबाट काम गर्छौं, ताकि डिजाइन, उपकरण छनोट र साइटको काम तपाईंको सञ्चालनसँग मेल खाओस्।',
    capabilitiesEyebrow: 'हाम्रा क्षमता',
    capabilitiesTitle: 'हरेक चरणमा प्राविधिक आत्मविश्वास।',
  },
  solutions: {
    hero: {
      eyebrow: 'क्षेत्रगत विशेषज्ञता',
      title: 'हरेक सञ्चालन फरक हुन्छ।',
      copy: 'हामी तपाईंको सेवा मोडेलको वास्तविकता अनुसार उपकरण प्याकेज र कार्यप्रवाह डिजाइन गर्छौं।',
    },
    eyebrow: 'हामी कहाँ काम गर्छौं',
    title: 'सेवाले आकार दिएका समाधान।',
  },
  products: {
    hero: {
      eyebrow: 'उपकरण सूची',
      title: 'कार्यक्षमताका लागि निर्दिष्ट।',
      copy: 'पकाउने, तयारी, भण्डारण, धुने र सेवाका लागि भरपर्दो व्यावसायिक उपकरण हेर्नुहोस्।',
    },
    eyebrow: 'उपकरण हेर्नुहोस्',
    title: 'व्यावसायिक सेवाको गतिका लागि बनाइएको।',
  },
  product: {
    specifications: 'विशेषताहरू',
    applications: 'प्रयोग क्षेत्र',
    applicationItems: ['रेस्टुरेन्ट', 'होटल तथा रिसोर्ट', 'केन्द्रीय भान्सा', 'संस्थाहरू'],
    related: 'सम्बन्धित उपकरण',
  },
  projectsPage: {
    hero: {
      eyebrow: 'छानिएका काम',
      title: 'सुन्दर ढंगले काम गर्न डिजाइन गरिएको।',
      copy: 'उच्च मापदण्ड, मेहनती टोली र दैनिक कार्यसम्पादनका लागि बनाइएका व्यावसायिक भान्साहरूको झलक।',
    },
    eyebrow: 'परियोजना संग्रह',
    title: 'पहिलो योजनादेखि पहिलो सेवासम्म।',
    empty: 'परियोजनाका तस्बिरहरू थपिँदैछन् - छिट्टै फेरि हेर्नुहोस्।',
  },
  servicesPage: {
    hero: {
      eyebrow: 'सेवाहरू',
      title: 'उपकरणभन्दा परको विशेषज्ञता।',
      copy: 'प्रारम्भिक योजनादेखि जडान, तालिम र सहयोगसम्म तपाईंको भान्सालाई मार्गदर्शन गर्ने एउटै जिम्मेवार टोली।',
    },
    eyebrow: 'सुरुदेखि अन्त्यसम्म सहयोग',
    title: 'उद्घाटन दिनसम्मको स्पष्ट बाटो।',
    alsoEyebrow: 'स्टेनलेस स्टिलभन्दा पर',
    alsoTitle: 'तपाईंको भान्सा चलिरहन चाहिने सेवाहरू।',
    alsoItems: [
      ['ग्यास पाइपलाइन जडान', 'हरेक बर्नर र रेन्जका लागि सुरक्षित एलपीजी पाइपलाइन।'],
      ['चिम्नी तथा डक्टिङ', 'राम्रो धुवाँ निकास र हावा प्रवाहका लागि मिलाइएका हुड, चिम्नी र डक्ट।'],
      ['सम्पूर्ण भान्सा सर्भिसिङ', 'हरेक स्टेसन चालु राख्न नियमित मर्मत र सम्भार।'],
    ],
  },
  contact: {
    hero: {
      eyebrow: 'सम्पर्क',
      title: 'आफ्नो भान्साको आवश्यकता बताउनुहोस्।',
      copy: 'नयाँ सुरु गर्दै हुनुहुन्छ, नवीकरण गर्दै हुनुहुन्छ वा उपकरण फेर्दै हुनुहुन्छ-हामी सही अर्को कदम तय गर्न सहयोग गर्छौं।',
    },
    eyebrow: 'सम्पर्क',
    title: 'सँगै राम्रो भान्सा बनाऔं।',
    copy: 'नयाँ सुरुवात, नवीकरण वा उपकरण आवश्यकताबारे हाम्रो टोलीसँग कुरा गर्नुहोस्।',
    visitEyebrow: 'हाम्रो कार्यालय',
    visitTitle: 'भैंसेपाटीमा भेट्नुहोस्।',
  },
}

const CONTENT: Record<Language, SiteContent> = { en, ne }

/** Marketing copy for the currently selected site language. */
export function useSiteContent(): SiteContent {
  const { language } = useLanguage()
  return CONTENT[language]
}

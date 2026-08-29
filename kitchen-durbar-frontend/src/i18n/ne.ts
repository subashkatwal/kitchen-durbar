import type { TranslationKey } from './en'

/** Nepali translations - must define exactly the same keys as en.ts. */
const ne: Record<TranslationKey, string> = {
  // --- Header / nav ---
  'nav.home': 'गृहपृष्ठ',
  'nav.products': 'उत्पादनहरू',
  'nav.admin': 'एडमिन',
  'nav.login': 'लगइन',
  'nav.logout': 'लगआउट',
  'nav.cart': 'कार्ट',
  'nav.openMenu': 'मेनु खोल्नुहोस्',
  'nav.closeMenu': 'मेनु बन्द गर्नुहोस्',
  'nav.logoutTitle': 'लगआउट गर्नुहोस्',
  'nav.logoutMessage': 'के तपाईं लगआउट गर्न निश्चित हुनुहुन्छ?',
  'nav.logoutConfirm': 'लगआउट गर्नुहोस्',
  'nav.logoutSuccess': 'सफलतापूर्वक लगआउट भयो',

  // --- Footer ---
  'footer.tagline': 'नेपालमा अर्डरमा बनाइने उच्च गुणस्तरीय व्यावसायिक भान्सा उपकरणहरू। व्यावसायिक भान्साका लागि बनाइएको स्टेनलेस स्टिल उपकरण।',
  'footer.quickLinks': 'द्रुत लिङ्कहरू',
  'footer.categories': 'श्रेणीहरू',
  'footer.burners': 'बर्नरहरू',
  'footer.tables': 'टेबलहरू',
  'footer.chillers': 'चिलरहरू',
  'footer.sinks': 'सिंकहरू',
  'footer.contact': 'सम्पर्क',
  'footer.address': 'काठमाडौं, नेपाल',
  'footer.whatsapp': 'WhatsApp: +977 9769400796',
  'footer.copyright': '© २०२६ किचन दरबार सोलुसन। सर्वाधिकार सुरक्षित।',

  // --- Common ---
  'common.cancel': 'रद्द गर्नुहोस्',
  'common.confirm': 'पुष्टि गर्नुहोस्',
  'common.save': 'सेभ गर्नुहोस्',
  'common.edit': 'सम्पादन गर्नुहोस्',
  'common.delete': 'मेटाउनुहोस्',
  'common.or': 'वा',
  'common.free': 'निःशुल्क',

  // --- Auth: shared ---
  'auth.email': 'इमेल',
  'auth.password': 'पासवर्ड',
  'auth.emailPasswordRequired': 'कृपया आफ्नो इमेल र पासवर्ड प्रविष्ट गर्नुहोस्।',
  'auth.passwordTooShort': 'पासवर्ड कम्तीमा ६ अक्षरको हुनुपर्छ।',
  'auth.passwordPlaceholder': 'कम्तीमा ६ अक्षर',

  // --- Auth: Login ---
  'login.title': 'फेरि स्वागत छ',
  'login.forgotPassword': 'पासवर्ड बिर्सनुभयो?',
  'login.signingIn': 'साइन इन हुँदैछ...',
  'login.signIn': 'साइन इन',
  'login.welcomeBack': 'फेरि स्वागत छ!',
  'login.error': 'गलत इमेल वा पासवर्ड। कृपया फेरि प्रयास गर्नुहोस्।',
  'login.noAccount': 'खाता छैन?',
  'login.register': 'रजिस्टर गर्नुहोस्',

  // --- Auth: Register ---
  'register.title': 'खाता खोल्नुहोस्',
  'register.nameEmailRequired': 'कृपया आफ्नो नाम र इमेल भर्नुहोस्।',
  'register.fullName': 'पुरा नाम',
  'register.phone': 'फोन',
  'register.creating': 'खाता खोलिँदैछ...',
  'register.submit': 'खाता खोल्नुहोस्',
  'register.success': 'खाता खोलियो! भेरिफिकेसन कोडको लागि आफ्नो इमेल जाँच गर्नुहोस्।',
  'register.error': 'खाता खोल्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',
  'register.haveAccount': 'पहिले नै खाता छ?',
  'register.signIn': 'साइन इन',

  // --- Auth: Forgot password ---
  'forgotPassword.title': 'पासवर्ड बिर्सनुभयो',
  'forgotPassword.subtitle': 'आफ्नो खाताको इमेल प्रविष्ट गर्नुहोस्, हामी पासवर्ड रिसेट गर्न एउटा कोड पठाउनेछौं।',
  'forgotPassword.emailRequired': 'कृपया आफ्नो इमेल ठेगाना प्रविष्ट गर्नुहोस्।',
  'forgotPassword.sending': 'कोड पठाइँदैछ...',
  'forgotPassword.submit': 'रिसेट कोड पठाउनुहोस्',
  'forgotPassword.success': 'यदि यो इमेलको खाता अवस्थित छ भने, एउटा कोड पठाइएको छ।',
  'forgotPassword.error': 'रिसेट कोड पठाउन सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',
  'forgotPassword.remembered': 'पासवर्ड सम्झनुभयो?',
  'forgotPassword.signIn': 'साइन इन',

  // --- Auth: Verify OTP ---
  'verifyOtp.invalidTitle': 'भेरिफिकेसन लिङ्क अमान्य छ',
  'verifyOtp.invalidSubtitle': 'भेरिफाई गर्न इमेल फेला परेन। कृपया फेरि सुरु गर्नुहोस्।',
  'verifyOtp.goBack': 'पछाडि जानुहोस्',
  'verifyOtp.codeRequired': 'कृपया आफ्नो इमेलमा आएको ६ अङ्कको कोड प्रविष्ट गर्नुहोस्।',
  'verifyOtp.signupSuccess': 'खाता प्रमाणित भयो! किचन दरबारमा स्वागत छ।',
  'verifyOtp.codeInvalid': 'यो कोड अमान्य छ वा म्याद सकिएको छ। कृपया नयाँ कोड अनुरोध गर्नुहोस्।',
  'verifyOtp.passwordsMismatch': 'पासवर्डहरू मेल खाँदैनन्।',
  'verifyOtp.resetSuccess': 'पासवर्ड अपडेट भयो! कृपया साइन इन गर्नुहोस्।',
  'verifyOtp.resetError': 'पासवर्ड अपडेट गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',
  'verifyOtp.resent': 'नयाँ कोड तपाईंको इमेलमा पठाइएको छ।',
  'verifyOtp.resendError': 'कोड पुनः पठाउन सकिएन। कृपया केही बेरमा फेरि प्रयास गर्नुहोस्।',
  'verifyOtp.signupTitle': 'आफ्नो इमेल प्रमाणित गर्नुहोस्',
  'verifyOtp.resetTitle': 'पासवर्ड रिसेट गर्नुहोस्',
  'verifyOtp.codeSentPrefix': 'हामीले ६ अङ्कको कोड यहाँ पठायौं',
  'verifyOtp.enterBelowTo': 'तल प्रविष्ट गर्नुहोस्',
  'verifyOtp.activateAccount': 'आफ्नो खाता सक्रिय गर्न।',
  'verifyOtp.continueReset': 'पासवर्ड रिसेट जारी राख्न।',
  'verifyOtp.codeVerified': 'कोड प्रमाणित भयो। तलबाट नयाँ पासवर्ड छान्नुहोस्।',
  'verifyOtp.code': 'भेरिफिकेसन कोड',
  'verifyOtp.verifying': 'प्रमाणित गर्दैछ...',
  'verifyOtp.verify': 'कोड प्रमाणित गर्नुहोस्',
  'verifyOtp.noCode': 'कोड आएन?',
  'verifyOtp.resendIn': '{n} सेकेन्डमा पुनः पठाउनुहोस्',
  'verifyOtp.resend': 'कोड पुनः पठाउनुहोस्',
  'verifyOtp.newPassword': 'नयाँ पासवर्ड',
  'verifyOtp.confirmNewPassword': 'नयाँ पासवर्ड पुष्टि गर्नुहोस्',
  'verifyOtp.confirmPlaceholder': 'आफ्नो नयाँ पासवर्ड फेरि प्रविष्ट गर्नुहोस्',
  'verifyOtp.updating': 'अपडेट हुँदैछ...',
  'verifyOtp.updatePassword': 'पासवर्ड अपडेट गर्नुहोस्',
  'verifyOtp.backToSignIn': 'साइन इनमा फर्कनुहोस्',

  // --- Google sign-in ---
  'google.notConfigured': 'गुगल साइन-इन अझै कन्फिगर गरिएको छैन - सक्षम गर्न .env मा VITE_GOOGLE_CLIENT_ID र GOOGLE_CLIENT_ID सेट गर्नुहोस्।',
  'google.success': 'गुगलबाट साइन इन भयो',
  'google.error': 'गुगल साइन-इन असफल भयो। कृपया फेरि प्रयास गर्नुहोस्।',

  // --- Cart / checkout ---
  'cart.title': 'शपिङ कार्ट',
  'cart.empty': 'तपाईंको कार्ट खाली छ।',
  'cart.browseProducts': 'उत्पादनहरू हेर्नुहोस्',
  'cart.remove': 'हटाउनुहोस्',
  'cart.orderSummary': 'अर्डर सारांश',
  'cart.subtotal': 'उप-जम्मा',
  'cart.discount': 'छुट',
  'cart.discountWithRate': 'छुट ({rate}%)',
  'cart.shipping': 'ढुवानी',
  'cart.total': 'जम्मा',
  'cart.placingOrder': 'अर्डर राखिँदैछ...',
  'cart.proceedToPayment': 'भुक्तानीमा अगाडि बढ्नुहोस्',
  'cart.madeToOrderNote': 'सबै उत्पादनहरू अर्डरमा बनाइन्छ। ७-१४ दिनमा डेलिभरी हुन्छ।',
  'cart.loginFirst': 'कृपया पहिले लगइन गर्नुहोस्',
  'cart.checkoutError': 'अर्डर राख्न सकिएन',

  // --- Checkout confirmation ---
  'checkout.received': 'अर्डर प्राप्त भयो!',
  'checkout.contactWhatsapp': 'WhatsApp मा सम्पर्क गर्नुहोस्',
  'checkout.continueShopping': 'किनमेल जारी राख्नुहोस्',

  // --- Products / product detail ---
  'products.title': 'सबै उत्पादनहरू',
  'products.searchPlaceholder': 'बर्नर, र्याक, चिलर खोज्नुहोस्...',
  'products.allCategories': 'सबै श्रेणीहरू',
  'products.sortBy': 'क्रमबद्ध गर्नुहोस्',
  'products.priceLowHigh': 'मूल्य: कमबाट बढी',
  'products.priceHighLow': 'मूल्य: बढीबाट कम',
  'products.nameAZ': 'नाम: A-Z',
  'products.notFound': 'तपाईंको खोजसँग मेल खाने कुनै उत्पादन फेला परेन।',
  'products.loadError': 'उत्पादनहरू लोड गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',
  'product.notFound': 'उत्पादन फेला परेन।',
  'product.backToProducts': 'उत्पादनहरूमा फर्कनुहोस्',
  'product.material': 'सामग्री:',
  'product.materialValue': 'स्टेनलेस स्टिल ३०४ ग्रेड',
  'product.delivery': 'डेलिभरी:',
  'product.deliveryValue': '७-१४ कार्य दिन (अर्डरमा बनाइने)',
  'product.warranty': 'वारेन्टी:',
  'product.warrantyValue': '१ वर्ष निर्माता वारेन्टी',
  'product.customization': 'अनुकूलन:',
  'product.customizationValue': 'अनुरोधमा उपलब्ध',
  'product.addToCart': 'कार्टमा थप्नुहोस्',
  'product.addedToCart': 'कार्टमा थपियो!',
  'product.madeToOrder': '(अर्डरमा बनाइने)',
  'product.loadError': 'यो उत्पादन लोड गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।',

  // --- Home ---
  'home.heroTitle': 'व्यावसायिक भान्सा उपकरणहरू',
  'home.heroSubtitle': 'तपाईंको आवश्यकता अनुसार बनाइएको उच्च गुणस्तरीय स्टेनलेस स्टिल उपकरण। अर्डरमा बनाइने, टिकाउका लागि बनाइएको।',
  'home.heroExtra':
    'किचन दरबारले स्टेनलेस स्टिलको साथसाथै ग्यास पाइपलाइन सुविधा, सम्पूर्ण किचन सर्भिसिङ, चिम्नी र डक्टिङ पनि प्रदान गर्दछ।',
  'home.getStarted': 'सुरु गर्नुहोस्',
  'home.browseByCategory': 'श्रेणी अनुसार हेर्नुहोस्',
  'home.featuredProducts': 'विशेष उत्पादनहरू',

  // --- Ads ---
  'ad.label': 'विज्ञापन',
  'ad.cta': 'किन्नुहोस्',
  'ad.close': 'बन्द गर्नुहोस्',

  // --- Admin ---
  'admin.dashboard': 'ड्यासबोर्ड',
  'admin.products': 'उत्पादनहरू',
  'admin.ads': 'विज्ञापनहरू',
  'admin.users': 'प्रयोगकर्ताहरू',
  'admin.orders': 'अर्डरहरू',
  'admin.backToStore': 'पसलमा फर्कनुहोस्',
}

export default ne

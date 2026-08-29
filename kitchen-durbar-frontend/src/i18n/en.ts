/**
 * English translation dictionary - the canonical key set. `ne.ts` must
 * define exactly the same keys (LanguageContext.t() falls back to the key
 * itself if a language is missing one, which would surface as a visible bug,
 * not a silent English fallback).
 */
const en = {
  // --- Header / nav ---
  'nav.home': 'Home',
  'nav.products': 'Products',
  'nav.admin': 'Admin',
  'nav.login': 'Login',
  'nav.logout': 'Logout',
  'nav.cart': 'Cart',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.logoutTitle': 'Log out',
  'nav.logoutMessage': 'Are you sure you want to log out?',
  'nav.logoutConfirm': 'Log out',
  'nav.logoutSuccess': 'Logged out successfully',

  // --- Footer ---
  'footer.tagline': 'Premium commercial kitchen appliances made to order in Nepal. Stainless steel equipment built for professional kitchens.',
  'footer.quickLinks': 'Quick Links',
  'footer.categories': 'Categories',
  'footer.burners': 'Burners',
  'footer.tables': 'Tables',
  'footer.chillers': 'Chillers',
  'footer.sinks': 'Sinks',
  'footer.contact': 'Contact',
  'footer.address': 'Kathmandu, Nepal',
  'footer.whatsapp': 'WhatsApp: +977 9769400796',
  'footer.copyright': '© 2026 Kitchen Durbar Solution. All rights reserved.',

  // --- Common ---
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.save': 'Save',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.or': 'or',
  'common.free': 'FREE',

  // --- Auth: shared ---
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.emailPasswordRequired': 'Please enter your email and password.',
  'auth.passwordTooShort': 'Password must be at least 6 characters.',
  'auth.passwordPlaceholder': 'At least 6 characters',

  // --- Auth: Login ---
  'login.title': 'Welcome Back',
  'login.forgotPassword': 'Forgot password?',
  'login.signingIn': 'Signing In...',
  'login.signIn': 'Sign In',
  'login.welcomeBack': 'Welcome back!',
  'login.error': 'Incorrect email or password. Please try again.',
  'login.noAccount': "Don't have an account?",
  'login.register': 'Register',

  // --- Auth: Register ---
  'register.title': 'Create Account',
  'register.nameEmailRequired': 'Please fill in your name and email.',
  'register.fullName': 'Full Name',
  'register.phone': 'Phone',
  'register.creating': 'Creating Account...',
  'register.submit': 'Create Account',
  'register.success': 'Account created! Check your email for a verification code.',
  'register.error': 'Could not create your account. Please try again.',
  'register.haveAccount': 'Already have an account?',
  'register.signIn': 'Sign In',

  // --- Auth: Forgot password ---
  'forgotPassword.title': 'Forgot Password',
  'forgotPassword.subtitle': "Enter your account email and we'll send you a code to reset your password.",
  'forgotPassword.emailRequired': 'Please enter your email address.',
  'forgotPassword.sending': 'Sending Code...',
  'forgotPassword.submit': 'Send Reset Code',
  'forgotPassword.success': 'If an account exists for this email, a code has been sent.',
  'forgotPassword.error': 'Could not send the reset code. Please try again.',
  'forgotPassword.remembered': 'Remembered your password?',
  'forgotPassword.signIn': 'Sign In',

  // --- Auth: Verify OTP ---
  'verifyOtp.invalidTitle': 'Verification Link Invalid',
  'verifyOtp.invalidSubtitle': "We couldn't find an email to verify. Please start again.",
  'verifyOtp.goBack': 'Go back',
  'verifyOtp.codeRequired': 'Please enter the 6-digit code from your email.',
  'verifyOtp.signupSuccess': 'Account verified! Welcome to Kitchen Durbar.',
  'verifyOtp.codeInvalid': 'That code is invalid or has expired. Please request a new one.',
  'verifyOtp.passwordsMismatch': 'Passwords do not match.',
  'verifyOtp.resetSuccess': 'Password updated! Please sign in.',
  'verifyOtp.resetError': 'Could not update your password. Please try again.',
  'verifyOtp.resent': 'A new code has been sent to your email.',
  'verifyOtp.resendError': 'Could not resend the code. Please try again shortly.',
  'verifyOtp.signupTitle': 'Verify Your Email',
  'verifyOtp.resetTitle': 'Reset Your Password',
  'verifyOtp.codeSentPrefix': 'We sent a 6-digit code to',
  'verifyOtp.enterBelowTo': 'Enter it below to',
  'verifyOtp.activateAccount': 'activate your account.',
  'verifyOtp.continueReset': 'continue resetting your password.',
  'verifyOtp.codeVerified': 'Code verified. Choose a new password below.',
  'verifyOtp.code': 'Verification Code',
  'verifyOtp.verifying': 'Verifying...',
  'verifyOtp.verify': 'Verify Code',
  'verifyOtp.noCode': "Didn't get a code?",
  'verifyOtp.resendIn': 'Resend in {n}s',
  'verifyOtp.resend': 'Resend Code',
  'verifyOtp.newPassword': 'New Password',
  'verifyOtp.confirmNewPassword': 'Confirm New Password',
  'verifyOtp.confirmPlaceholder': 'Re-enter your new password',
  'verifyOtp.updating': 'Updating...',
  'verifyOtp.updatePassword': 'Update Password',
  'verifyOtp.backToSignIn': 'Back to Sign In',

  // --- Google sign-in ---
  'google.notConfigured': "Google sign-in isn't configured yet - set VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID in .env to enable it.",
  'google.success': 'Signed in with Google',
  'google.error': 'Google sign-in failed. Please try again.',

  // --- Cart / checkout ---
  'cart.title': 'Shopping Cart',
  'cart.empty': 'Your cart is empty.',
  'cart.browseProducts': 'Browse Products',
  'cart.remove': 'Remove',
  'cart.orderSummary': 'Order Summary',
  'cart.subtotal': 'Subtotal',
  'cart.discount': 'Discount',
  'cart.discountWithRate': 'Discount ({rate}%)',
  'cart.shipping': 'Shipping',
  'cart.total': 'Total',
  'cart.placingOrder': 'Placing Order...',
  'cart.proceedToPayment': 'Proceed to Payment',
  'cart.madeToOrderNote': 'All products are made to order. Delivery in 7-14 days.',
  'cart.loginFirst': 'Please login first',
  'cart.checkoutError': 'Could not place order',

  // --- Checkout confirmation ---
  'checkout.received': 'Order Received!',
  'checkout.contactWhatsapp': 'Contact on WhatsApp',
  'checkout.continueShopping': 'Continue Shopping',

  // --- Products / product detail ---
  'products.title': 'All Products',
  'products.searchPlaceholder': 'Search burners, racks, chillers...',
  'products.allCategories': 'All Categories',
  'products.sortBy': 'Sort by',
  'products.priceLowHigh': 'Price: Low to High',
  'products.priceHighLow': 'Price: High to Low',
  'products.nameAZ': 'Name: A-Z',
  'products.notFound': 'No products found matching your search.',
  'products.loadError': 'Could not load products. Please try again.',
  'product.notFound': 'Product not found.',
  'product.backToProducts': 'Back to Products',
  'product.material': 'Material:',
  'product.materialValue': 'Stainless Steel 304 Grade',
  'product.delivery': 'Delivery:',
  'product.deliveryValue': '7-14 business days (Made to Order)',
  'product.warranty': 'Warranty:',
  'product.warrantyValue': '1 Year Manufacturer Warranty',
  'product.customization': 'Customization:',
  'product.customizationValue': 'Available on request',
  'product.addToCart': 'Add to Cart',
  'product.addedToCart': 'Added to cart!',
  'product.madeToOrder': '(Made to Order)',
  'product.loadError': 'Could not load this product. Please try again.',

  // --- Home ---
  'home.heroTitle': 'Commercial Kitchen Appliances',
  'home.heroSubtitle': 'Premium stainless steel equipment custom-made to your specifications. Built to order, built to last.',
  'home.getStarted': 'Get Started',
  'home.browseByCategory': 'Browse by Category',
  'home.featuredProducts': 'Featured Products',

  // --- Ads ---
  'ad.label': 'Advertisement',
  'ad.cta': 'Shop Now',
  'ad.close': 'Close',

  // --- Admin ---
  'admin.dashboard': 'Dashboard',
  'admin.products': 'Products',
  'admin.ads': 'Ads',
  'admin.users': 'Users',
  'admin.orders': 'Orders',
  'admin.backToStore': 'Back to Store',
} as const

export type TranslationKey = keyof typeof en
export default en

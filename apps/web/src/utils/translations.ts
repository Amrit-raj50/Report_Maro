import type { Language } from '../store/languageStore.js';

export interface Translations {
  // Utility bar
  helpline: string;
  support: string;
  skipToContent: string;
  signIn: string;
  logout: string;

  // Identity bar
  deptHindi: string;
  deptEnglish: string;
  portalTitleHindi: string;
  portalTitleEnglish: string;
  portalTagline: string;
  portalLogin: string;
  register: string;

  // Navigation
  navHome: string;
  navAbout: string;
  navCitizenDashboard: string;
  navProblems: string;
  navAnalytics: string;
  navUniversities: string;
  navGuidelines: string;
  navSubmitIssue: string;
  navTrack: string;

  // Hero Section
  initiativeTag: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtext: string;
  btnSubmitProblem: string;
  btnUniversityPortal: string;
  btnVideoGuide: string;
  nicSecurityNote: string;

  // Statistics Strip
  statProblemsSubmitted: string;
  statVerifiedToday: string;
  statUniversitiesOnboarded: string;
  statProjectsInProgress: string;
  statFieldValidation: string;
  statDistrictsCovered: string;
  statOutreach: string;

  // About the Scheme
  aboutMandateTag: string;
  aboutTitle: string;
  officialDirective: string;
  decreeBadge: string;
  stage01Title: string;
  stage01Desc: string;
  stage02Title: string;
  stage02Desc: string;
  stage03Title: string;
  stage03Desc: string;
  stage04Title: string;
  stage04Desc: string;

  // Workflow Section
  howItWorksTag: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;

  // Focus Domains
  domainsTag: string;
  domainsTitle: string;
  domainWater: string;
  domainWaterDesc: string;
  domainAgri: string;
  domainAgriDesc: string;
  domainEnergy: string;
  domainEnergyDesc: string;
  domainHealth: string;
  domainHealthDesc: string;
  domainEnv: string;
  domainEnvDesc: string;
  domainEdu: string;
  domainEduDesc: string;

  // Featured Projects
  projectsTag: string;
  projectsTitle: string;
  viewAllProjects: string;

  // CTA Section
  ctaTitle: string;
  ctaSubtext: string;
  ctaBtn: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    helpline: 'Helpline: 1800-345-6570',
    support: 'Support',
    skipToContent: 'Skip to Content',
    signIn: 'Sign In',
    logout: 'Logout',

    deptHindi: 'झारखंड सरकार · उच्च एवं तकनीकी शिक्षा विभाग',
    deptEnglish: 'GOVERNMENT OF JHARKHAND · DEPT. OF HIGHER & TECHNICAL EDUCATION',
    portalTitleHindi: 'समाधान सेतु',
    portalTitleEnglish: '/ SAMADHAN SETU',
    portalTagline:
      'A Digital Platform to Crowdsource Societal Challenges & Drive University-Industry R&D (PS 26043)',
    portalLogin: 'PORTAL LOGIN',
    register: 'REGISTER',

    navHome: 'Home',
    navAbout: 'About Scheme',
    navCitizenDashboard: 'Citizen Dashboard',
    navProblems: 'Problems / Track',
    navAnalytics: 'AI Analytics',
    navUniversities: 'Universities',
    navGuidelines: 'Guidelines',
    navSubmitIssue: 'SUBMIT ISSUE',
    navTrack: 'TRACK',

    initiativeTag: 'JHARKHAND R&D INITIATIVE',
    heroTitleLine1: 'Your Problem. Their Research.',
    heroTitleLine2: 'A Solution.',
    heroSubtext:
      'An institutional tripartite platform by the Department of Higher & Technical Education, Government of Jharkhand, bridging grassroots civic hardships directly with premier state university R&D engineering cells and sanctioned corporate CSR funding pipelines.',
    btnSubmitProblem: 'SUBMIT A PROBLEM →',
    btnUniversityPortal: '🏛️ University Portal',
    btnVideoGuide: 'Video Guide',
    nicSecurityNote:
      'All submissions timestamped & encrypted under National Informatics Centre (NIC) parameters.',

    statProblemsSubmitted: 'Problems Submitted',
    statVerifiedToday: 'today verified',
    statUniversitiesOnboarded: 'Universities Onboarded',
    statProjectsInProgress: 'Projects In Progress',
    statFieldValidation: 'Prototypes in field validation',
    statDistrictsCovered: 'Districts Covered',
    statOutreach: '100% Administrative outreach',

    aboutMandateTag: 'योजना परिचय · Institutional Mandate',
    aboutTitle: 'About the Scheme: Samadhan Setu',
    officialDirective: 'Official Directive: DHTE/2026/L99',
    decreeBadge:
      'Approved under State Innovation & Higher Education Directive No. DHTE/2026/L99',
    stage01Title: 'Citizen Problem Logging',
    stage01Desc: 'Geo-tagged evidence & documentary submission',
    stage02Title: 'AI Deduplication & Triage',
    stage02Desc: 'District and sector-level automated mapping',
    stage03Title: 'University Lab Allocation',
    stage03Desc: 'Faculty mentorship & multidisciplinary build',
    stage04Title: 'Industry Field Deployment',
    stage04Desc: 'CSR prototyping grants & field testing',

    howItWorksTag: 'CIVIC INNOVATION LIFECYCLE',
    howItWorksTitle: 'How Samadhan Setu Works',
    step1Title: 'Citizen Logs Civic Hardship',
    step1Desc:
      'Citizens upload geotagged photos and descriptions of infrastructure, water, or energy issues.',
    step2Title: 'AI Categorizes & Deduplicates',
    step2Desc:
      'Automated NLP verifies proximity, filters spam, and extracts engineering requirements.',
    step3Title: 'State University R&D Cell Adopts',
    step3Desc:
      'Faculty mentors and student investigators adopt verified problems as capstone research projects.',
    step4Title: 'CSR Sponsors Deploy Solution',
    step4Desc:
      'Sanctioned corporate CSR funds prototype manufacturing and field validation in the community.',

    domainsTag: 'झारखंड प्राथमिकता क्षेत्र',
    domainsTitle: 'Priority Civic Problem Domains',
    domainWater: 'Water Resources & Quality',
    domainWaterDesc:
      'Fluoride remediation, plateau borewell recharging, Arsenic testing kits, and check-dam IoT monitors.',
    domainAgri: 'Agriculture & Irrigation',
    domainAgriDesc:
      'Terrace cultivation telemetry, solar cold storages, lac farming technology, and soil nutrient sensors.',
    domainEnergy: 'Rural Energy & Microgrids',
    domainEnergyDesc:
      'Solar DC microgrids for remote forest villages, biomass generators, and smart metering.',
    domainHealth: 'Primary Health & Telemedicine',
    domainHealthDesc:
      'Battery-operated mobile diagnostic units, tribal health record sync, and vaccine cold-chain telemetry.',
    domainEnv: 'Mining Reclamation & Eco-Restoration',
    domainEnvDesc:
      'Fly-ash stabilization, acid mine drainage treatment, opencast slope monitoring, and green barriers.',
    domainEdu: 'Digital Rural Education',
    domainEduDesc:
      'Solar-powered smart classroom units, multilingual vernacular tutoring, and offline knowledge hubs.',

    projectsTag: 'सक्रिय अनुसंधान एवं प्रोटोटाइप',
    projectsTitle: 'Featured University R&D Projects',
    viewAllProjects: 'View All Projects →',

    ctaTitle: 'Have a Civic Hardship in Your Village or Ward?',
    ctaSubtext:
      'Report your problem with geotagged evidence. State university researchers and engineers will adopt it as a funded R&D project.',
    ctaBtn: 'LOG A CIVIC HARDSHIP NOW →',
  },
  hi: {
    helpline: 'हेल्पलाइन: 1800-345-6570',
    support: 'तकनीकी सहायता',
    skipToContent: 'मुख्य सामग्री पर जाएं',
    signIn: 'लॉग इन करें',
    logout: 'लॉग आउट',

    deptHindi: 'झारखंड सरकार · उच्च एवं तकनीकी शिक्षा विभाग',
    deptEnglish: 'उच्च एवं तकनीकी शिक्षा विभाग, झारखंड सरकार',
    portalTitleHindi: 'समाधान सेतु',
    portalTitleEnglish: '· समाधान सेतु',
    portalTagline:
      'नागरिक समस्याओं के समाधान एवं विश्वविद्यालय-उद्योग अनुसंधान का डिजिटल सेतु (समस्या निवारण)',
    portalLogin: 'पोर्टल लॉगिन',
    register: 'नया पंजीकरण',

    navHome: 'मुख्य पृष्ठ',
    navAbout: 'योजना परिचय',
    navCitizenDashboard: 'नागरिक डैशबोर्ड',
    navProblems: 'समस्याएं व ट्रैकिंग',
    navAnalytics: 'एआई विश्लेषण',
    navUniversities: 'विश्वविद्यालय',
    navGuidelines: 'दिशानिर्देश',
    navSubmitIssue: 'समस्या दर्ज करें',
    navTrack: 'स्थिति जांचें',

    initiativeTag: 'झारखंड अनुसंधान एवं विकास पहल',
    heroTitleLine1: 'आपकी समस्या। उनका शोध।',
    heroTitleLine2: 'सटीक समाधान।',
    heroSubtext:
      'उच्च एवं तकनीकी शिक्षा विभाग, झारखंड सरकार की संस्थागत पहल—जो जनसामान्य की जमीनी समस्याओं को सीधे राज्य के अग्रणी विश्वविद्यालयों की अनुसंधान शाखाओं और कॉर्पोरेट सीएसआर अनुदान से जोड़कर स्थायी समाधान तैयार करती है।',
    btnSubmitProblem: 'समस्या दर्ज करें →',
    btnUniversityPortal: '🏛️ विश्वविद्यालय पोर्टल',
    btnVideoGuide: 'वीडियो गाइड',
    nicSecurityNote:
      'सभी प्रविष्टियां राष्ट्रीय सूचना विज्ञान केंद्र (NIC) सुरक्षा मानकों के तहत समय-अंकित और सुरक्षित हैं।',

    statProblemsSubmitted: 'कुल दर्ज समस्याएं',
    statVerifiedToday: 'आज सत्यापित',
    statUniversitiesOnboarded: 'संबद्ध विश्वविद्यालय',
    statProjectsInProgress: 'प्रगतिशील शोध परियोजनाएं',
    statFieldValidation: 'प्रोटोटाइप फील्ड टेस्टिंग में',
    statDistrictsCovered: 'आच्छादित जिले',
    statOutreach: '100% प्रशासनिक पहुंच',

    aboutMandateTag: 'योजना परिचय · संस्थागत अधिदेश',
    aboutTitle: 'योजना परिचय: समाधान सेतु',
    officialDirective: 'आधिकारिक शासनादेश: DHTE/2026/L99',
    decreeBadge:
      'राज्य नवाचार एवं उच्च शिक्षा निर्देश संख्या DHTE/2026/L99 के अंतर्गत अनुमोदित',
    stage01Title: 'नागरिक समस्या पंजीकरण',
    stage01Desc: 'जियो-टैग्ड साक्ष्य एवं दस्तावेजी प्रमाण प्रस्तुतीकरण',
    stage02Title: 'एआई वर्गीकरण व विश्लेषण',
    stage02Desc: 'जिला एवं प्रभाग स्तर पर स्वचालित मैपिंग व डुप्लीकेशन जांच',
    stage03Title: 'विश्वविद्यालय लैब आवंटन',
    stage03Desc: 'प्राध्यापक मार्गदर्शन एवं बहुविषयक छात्र शोध दल निर्माण',
    stage04Title: 'उद्योग व क्षेत्रीय क्रियान्वयन',
    stage04Desc: 'सीएसआर प्रोटोटाइपिंग अनुदान एवं जमीनी फील्ड परीक्षण',

    howItWorksTag: 'नागरिक नवाचार जीवन चक्र',
    howItWorksTitle: 'समाधान सेतु कैसे कार्य करता है',
    step1Title: 'नागरिक समस्या दर्ज करें',
    step1Desc:
      'नागरिक पेयजल, सड़क, सिंचाई या ऊर्जा संबंधी समस्याओं को जियो-टैग्ड फोटो के साथ अपलोड करते हैं।',
    step2Title: 'एआई वर्गीकरण व विश्लेषण',
    step2Desc:
      'प्राकृतिक भाषा प्रसंस्करण द्वारा समस्या की प्राथमिकता तय होती है और तकनीकी आवश्यकताओं का विश्लेषण होता है।',
    step3Title: 'विश्वविद्यालय शोध व प्रोटोटाइप',
    step3Desc:
      'अग्रणी राज्य विश्वविद्यालयों के प्राध्यापक व छात्र इसे आधिकारिक शोध परियोजना के रूप में अपनाते हैं।',
    step4Title: 'सीएसआर वित्तपोषण व समाधान',
    step4Desc:
      'उद्योग साझेदार सीएसआर अनुदान से प्रोटोटाइप का निर्माण और गांव में व्यावहारिक क्रियान्वयन करते हैं।',

    domainsTag: 'झारखंड प्राथमिकता क्षेत्र',
    domainsTitle: 'प्राथमिक नागरिक समस्या क्षेत्र',
    domainWater: 'पेयजल एवं जल संसाधन',
    domainWaterDesc:
      'फ्लोराइड निवारण, पठारी बोरवेल रिचार्जिंग, आर्सेनिक परीक्षण किट एवं चेक-डैम आईओटी निगरानी तंत्र।',
    domainAgri: 'कृषि एवं सूक्ष्म सिंचाई',
    domainAgriDesc:
      'सीढ़ीदार खेती टेलीमेट्री, सौर शीतगृह, लाह उत्पादन तकनीक एवं मृदा पोषण सेंसर।',
    domainEnergy: 'ग्रामीण ऊर्जा एवं सौर माइक्रोग्रिड',
    domainEnergyDesc:
      'सुदूर वन ग्रामों हेतु सौर डीसी माइक्रोग्रिड, बायोमास जनरेटर एवं स्मार्ट मीटरिंग।',
    domainHealth: 'प्राथमिक स्वास्थ्य एवं टेलीमेडिसिन',
    domainHealthDesc:
      'बैटरी चालित मोबाइल डायग्नोस्टिक यूनिट, जनजातीय स्वास्थ्य रिकॉर्ड एवं वैक्सीन कोल्ड-चेन ट्रैकिंग।',
    domainEnv: 'खनन भूमि सुधार एवं पर्यावरण',
    domainEnvDesc:
      'फ्लाई-ऐश स्थिरीकरण, खदान जल शोधन, ओपनकास्ट ढलान निगरानी एवं हरित पट्टी निर्माण।',
    domainEdu: 'डिजिटल ग्रामीण शिक्षा',
    domainEduDesc:
      'सौर ऊर्जा संचालित स्मार्ट कक्षाएं, स्थानीय भाषा शिक्षण एवं ऑफलाइन ज्ञान केंद्र।',

    projectsTag: 'सक्रिय अनुसंधान एवं प्रोटोटाइप',
    projectsTitle: 'प्रमुख विश्वविद्यालय अनुसंधान परियोजनाएं',
    viewAllProjects: 'सभी परियोजनाएं देखें →',

    ctaTitle: 'क्या आपके गांव या वार्ड में कोई नागरिक समस्या है?',
    ctaSubtext:
      'जियो-टैग्ड साक्ष्य के साथ अपनी समस्या दर्ज करें। राज्य विश्वविद्यालय के शोधकर्ता इसे वित्तपोषित परियोजना के रूप में अपनाएंगे।',
    ctaBtn: 'अभी नागरिक समस्या दर्ज करें →',
  },
};

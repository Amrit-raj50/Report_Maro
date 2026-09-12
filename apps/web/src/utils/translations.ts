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
  navGovtDashboard: string;
  navNotices: string;
  navGuidelines: string;
  navSubmitIssue: string;
  navTrack: string;
  industryCsr: string;

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
  aboutPara1: string;
  aboutPara2: string;
  aboutPara3: string;
  aboutPara4: string;
  stage01Title: string;
  stage01Desc: string;
  stage02Title: string;
  stage02Desc: string;
  stage03Title: string;
  stage03Desc: string;
  stage04Title: string;
  stage04Desc: string;

  // Leadership Section
  leadershipTag: string;
  leadershipTitle: string;
  cmName: string;
  cmDesignation: string;
  cmGovt: string;
  cmRole: string;
  ministerName: string;
  ministerDesignation: string;
  ministerDept: string;
  ministerRole: string;
  secretaryName: string;
  secretaryDesignation: string;
  secretaryDept: string;
  secretaryRole: string;

  // Key Problem Sectors
  sectorsTag: string;
  sectorsTitle: string;
  sectorsSubtitle: string;
  openChallengesBadge: string;
  viewSectorBrief: string;

  secEducationTitle: string;
  secEducationSub: string;
  secEducationDesc: string;

  secHealthTitle: string;
  secHealthSub: string;
  secHealthDesc: string;

  secAgriTitle: string;
  secAgriSub: string;
  secAgriDesc: string;

  secWaterTitle: string;
  secWaterSub: string;
  secWaterDesc: string;

  secEnvTitle: string;
  secEnvSub: string;
  secEnvDesc: string;

  secEnergyTitle: string;
  secEnergySub: string;
  secEnergyDesc: string;

  secUrbanTitle: string;
  secUrbanSub: string;
  secUrbanDesc: string;

  secAccessTitle: string;
  secAccessSub: string;
  secAccessDesc: string;

  secLivelihoodTitle: string;
  secLivelihoodSub: string;
  secLivelihoodDesc: string;

  // Notices Board
  noticesTitle: string;
  noticesGazetteRef: string;
  notice1Title: string;
  notice1Dept: string;
  notice1Action: string;
  notice2Title: string;
  notice2Dept: string;
  notice3Title: string;
  notice3Dept: string;
  notice4Title: string;
  notice4Dept: string;
  noticesArchiveNote: string;
  browseAllChallenges: string;

  // Video Guide Modal
  videoModalTitle: string;
  videoModalSub: string;
  videoModalDuration: string;
  videoModalNode: string;
  videoModalClose: string;

  // Footer
  footerCopyright: string;
  footerAbout: string;
  footerAccessibility: string;
  footerPrivacy: string;
  footerTerms: string;
  footerHyperlink: string;
  footerSitemap: string;
  footerHelpdesk: string;
  footerNicNode: string;
  footerVersion: string;
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
    navGovtDashboard: 'Govt Dashboard',
    navNotices: 'Notices',
    navGuidelines: 'Guidelines',
    navSubmitIssue: 'SUBMIT A PROBLEM',
    navTrack: 'TRACK',
    industryCsr: 'Industry & CSR',

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
    aboutPara1:
      'The Samadhan Setu framework represents an institutionalized civic-scientific bridge mandated by the Department of Higher & Technical Education, Government of Jharkhand. By establishing a direct digital pipeline between rural and urban citizen grievances and academic faculties, the portal converts daily livelihood and infrastructure hardships into actionable, accredited final-year engineering and postgraduate thesis topics under the tenets of the National Education Policy (NEP 2020).',
    aboutPara2:
      'Under this mechanism, problems logged by citizens undergo natural language AI deduplication, geographic clustering, and district officer validation. Once categorized into designated technical taxonomy, dossiers are assigned to institutional R&D laboratories across thirty-eight premier technical institutes within the state.',
    aboutPara3:
      'Faculty mentors and student investigator teams work directly with field data collected via geotagged mobile uploads. The State Innovation Grant Board concurrently reviews validated prototypes to sanction seed capital through corporate social responsibility (CSR) pacts signed with regional industrial powerhouses in steel, mining, renewable infrastructure, and agribusiness.',
    aboutPara4:
      'This institutional loop ensures transparent public accountability, accelerates applied scientific solutions tailored precisely to Jharkhand’s socio-ecological topography, and prevents redundant academic publications disconnected from immediate regional development necessities.',

    stage01Title: 'Citizen Problem Logging',
    stage01Desc: 'Geo-tagged evidence & documentary submission',
    stage02Title: 'AI Deduplication & Triage',
    stage02Desc: 'District and sector-level automated mapping',
    stage03Title: 'University Lab Allocation',
    stage03Desc: 'Faculty mentorship & multidisciplinary build',
    stage04Title: 'Industry Field Deployment',
    stage04Desc: 'CSR prototyping grants & field testing',

    leadershipTag: 'विभागीय नेतृत्व · Apex Leadership',
    leadershipTitle: 'Leadership & Departmental Direction',
    cmName: 'Shri Hemant Soren',
    cmDesignation: "Hon'ble Chief Minister",
    cmGovt: 'Government of Jharkhand',
    cmRole: 'Patron-in-Chief · Samadhan Setu',
    ministerName: 'Dr. Baidyanath Ram',
    ministerDesignation: "Hon'ble Minister",
    ministerDept: 'Dept. of Higher & Technical Education',
    ministerRole: 'Chairperson · Steering Apex Committee',
    secretaryName: 'Shri Rahul Purwar, IAS',
    secretaryDesignation: 'Principal Secretary',
    secretaryDept: 'Dept. of Higher & Technical Education',
    secretaryRole: 'Executive Director · Implementation Mission',

    sectorsTag: 'समस्या वर्गीकरण · Thematic Domains',
    sectorsTitle: 'Key Problem Sectors & Open Challenges',
    sectorsSubtitle:
      'Select a domain to inspect ongoing R&D thesis allocations or file district challenges.',
    openChallengesBadge: 'Open Challenges',
    viewSectorBrief: 'View Sector Brief →',

    secEducationTitle: 'Education',
    secEducationSub: 'शिक्षा एवं डिजिटल शिक्षण',
    secEducationDesc:
      'Smart rural classrooms, vernacular language STEM tools, and offline digital attendance in tribal school belts.',

    secHealthTitle: 'Healthcare',
    secHealthSub: 'स्वास्थ्य सेवाएं एवं प्राथमिक उपचार',
    secHealthDesc:
      'Telemedicine diagnostics for remote Primary Health Centres, sickle-cell detection kits, and cold-chain vaccine transit.',

    secAgriTitle: 'Agriculture',
    secAgriSub: 'कृषि एवं सूक्ष्म सिंचाई तंत्र',
    secAgriDesc:
      'Low-cost micro-drip irrigation, post-harvest lac processing mechanics, and soil acidity neutralization formulas.',

    secWaterTitle: 'Water Resources',
    secWaterSub: 'पेयजल एवं जल संसाधन स्वच्छता',
    secWaterDesc:
      'Fluoride remediation, plateau borewell recharging, Arsenic testing kits, and check-dam IoT monitors.',

    secEnvTitle: 'Environment',
    secEnvSub: 'पर्यावरण एवं वन संपदा',
    secEnvDesc:
      'Mine tailing rehabilitation, real-time forest fire warning telemetry, and elephant migration route geo-fencing.',

    secEnergyTitle: 'Energy',
    secEnergySub: 'ऊर्जा एवं नवीकरणीय ऊर्जा',
    secEnergyDesc:
      'Decentralized solar micro-grids for hill villages, biomass briquette units, and rural transformer load balancing.',

    secUrbanTitle: 'Urban Development',
    secUrbanSub: 'नगर विकास एवं ठोस अपशिष्ट',
    secUrbanDesc:
      'Municipal plastic pyrolysis systems, decentralized bio-gas digestors, and traffic bottleneck AI modeling for Ranchi and Dhanbad.',

    secAccessTitle: 'Accessibility',
    secAccessSub: 'दिव्यांगजन सुगमता एवं सहायक यंत्र',
    secAccessDesc:
      'Affordable prosthetic limbs tailored for agricultural labor, screen readers in regional Ho and Santhali scripts.',

    secLivelihoodTitle: 'Rural Livelihoods',
    secLivelihoodSub: 'ग्रामीण आजीविका एवं कुटीर उद्योग',
    secLivelihoodDesc:
      'Mechanical Tussar silk reeler looms, motorized Sal leaf plate pressing machines, and honey extractor centrifuges.',

    noticesTitle: 'Official Notices, Circulars & SIH 2026 Directives',
    noticesGazetteRef: 'Gazette Section · Dept. Ref: JHK/DHTE/GAZ/2026',
    notice1Title:
      'Guidelines for University Faculty Mentors on Submitting R&D Project Proposals for Smart India Hackathon 2026',
    notice1Dept: 'Directorate of Technical Education',
    notice1Action: 'Launch R&D Portal →',
    notice2Title:
      'Gazette Notification: District-Level Field Verification Protocol for Water & Agritech Issues',
    notice2Dept: 'Dept. of Drinking Water & Sanitation',
    notice3Title:
      'Call for CSR and Industry Partners for Seed Stage Prototyping Grants (Phase II Allocation)',
    notice3Dept: 'Jharkhand Innovation Council',
    notice4Title:
      'Standard Operating Procedure (SOP) for Citizen Problem Geo-Tagging & Video Verification',
    notice4Dept: 'State NIC E-Governance Cell',
    noticesArchiveNote:
      'Archived notifications from 2024 to 2026 are accessible under the State Gazette Digital Repository.',
    browseAllChallenges: 'Browse All Open Challenges →',

    videoModalTitle: 'Portal Workflow Video Guide · समाधान सेतु',
    videoModalSub: 'Tripartite Workflow Presentation: SIH 2026 PS 26043',
    videoModalDuration: 'Duration: 03m 42s · High Definition Video Guide (Hindi & English)',
    videoModalNode: 'NIC Video Stream Node: JH-RANCHI-01',
    videoModalClose: 'Close Guide',

    footerCopyright:
      '© 2026 Government of Jharkhand. All Rights Reserved. Content Owned, Maintained and Updated by Department of Higher & Technical Education.',
    footerAbout: 'About Samadhan Setu',
    footerAccessibility: 'Accessibility Statement',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Use',
    footerHyperlink: 'Hyperlinking Policy',
    footerSitemap: 'Sitemap',
    footerHelpdesk: 'Helpdesk & FAQs',
    footerNicNode:
      'National Informatics Centre (NIC) Server Node: JH-RANCHI-01 · Last Updated: 10 September 2026',
    footerVersion: 'Version 1.0 (NIC Standard) | Best viewed in Chrome, Edge, Firefox',
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
    navGovtDashboard: 'शासकीय डैशबोर्ड',
    navNotices: 'सूचनाएं व विज्ञप्ति',
    navGuidelines: 'दिशानिर्देश',
    navSubmitIssue: 'समस्या दर्ज करें',
    navTrack: 'स्थिति जांचें',
    industryCsr: 'उद्योग व सीएसआर',

    initiativeTag: 'झारखंड अनुसंधान एवं विकास पहल',
    heroTitleLine1: 'आपकी समस्या। उनका शोध।',
    heroTitleLine2: 'सटीक समाधान।',
    heroSubtext:
      'उच्च एवं तकनीकी शिक्षा विभाग, झारखंड सरकार की संस्थागत पहल—जो जनसामान्य की जमीनी समस्याओं को सीधे राज्य के अग्रणी विश्वविद्यालयों की अनुसंधान शाखाओं और कॉर्पोरेट सीएसआर अनुदान से जोड़कर स्थायी समाधान तैयार करती है।',
    btnSubmitProblem: 'समस्या दर्ज करें →',
    btnUniversityPortal: '🏛️ विश्वविद्यालय पोर्टल',
    btnVideoGuide: 'वीडियो मार्गदर्शिका',
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
    aboutPara1:
      'समाधान सेतु ढांचा उच्च एवं तकनीकी शिक्षा विभाग, झारखंड सरकार द्वारा अधिदिष्ट एक संस्थागत नागरिक-वैज्ञानिक सेतु है। ग्रामीण एवं शहरी नागरिकों की शिकायतों को सीधे विश्वविद्यालय संकायों से जोड़कर, यह पोर्टल दैनिक जनसमस्याओं को राष्ट्रीय शिक्षा नीति (NEP 2020) के सिद्धांतों के तहत अंतिम वर्ष के इंजीनियरिंग और स्नातकोत्तर शोध प्रबंध विषयों में रूपांतरित करता है।',
    aboutPara2:
      'इस व्यवस्था के तहत, नागरिकों द्वारा दर्ज समस्याओं का प्राकृतिक भाषा प्रसंस्करण (AI) द्वारा डुप्लीकेशन परीक्षण, भौगोलिक क्लस्टरिंग और जिला अधिकारियों द्वारा सत्यापन किया जाता है। तकनीकी वर्गीकरण के उपरांत, समस्याओं के डोजियर राज्य के 38 प्रमुख तकनीकी व अनुसंधान संस्थानों को आवंटित किए जाते हैं।',
    aboutPara3:
      'प्राध्यापक मार्गदर्शक और छात्र अन्वेषक दल जियो-टैग्ड मोबाइल साक्ष्यों से संकलित वास्तविक क्षेत्रीय डेटा पर कार्य करते हैं। राज्य नवाचार अनुदान बोर्ड सत्यापित प्रोटोटाइप की समीक्षा करता है और इस्पात, खनन, नवीकरणीय ऊर्जा एवं कृषि उद्योग के साथ हस्ताक्षरित कॉर्पोरेट सामाजिक उत्तरदायित्व (CSR) अनुबंधों के माध्यम से सीड कैपिटल स्वीकृत करता है।',
    aboutPara4:
      'यह संस्थागत चक्र पारदर्शी सार्वजनिक जवाबदेही सुनिश्चित करता है, झारखंड के सामाजिक-पारिस्थितिक परिवेश के अनुकूल व्यावहारिक वैज्ञानिक समाधानों को गति प्रदान करता है, तथा वास्तविक क्षेत्रीय आवश्यकताओं से कटे सैद्धांतिक प्रकाशनों को रोकता है।',

    stage01Title: 'नागरिक समस्या पंजीकरण',
    stage01Desc: 'जियो-टैग्ड साक्ष्य एवं दस्तावेजी प्रमाण प्रस्तुतीकरण',
    stage02Title: 'एआई वर्गीकरण व विश्लेषण',
    stage02Desc: 'जिला एवं प्रभाग स्तर पर स्वचालित मैपिंग व डुप्लीकेशन जांच',
    stage03Title: 'विश्वविद्यालय लैब आवंटन',
    stage03Desc: 'प्राध्यापक मार्गदर्शन एवं बहुविषयक छात्र शोध दल निर्माण',
    stage04Title: 'उद्योग व क्षेत्रीय क्रियान्वयन',
    stage04Desc: 'सीएसआर प्रोटोटाइपिंग अनुदान एवं जमीनी फील्ड परीक्षण',

    leadershipTag: 'विभागीय नेतृत्व · शीर्ष नेतृत्व',
    leadershipTitle: 'नेतृत्व एवं विभागीय मार्गदर्शन',
    cmName: 'श्री हेमन्त सोरेन',
    cmDesignation: 'माननीय मुख्यमंत्री',
    cmGovt: 'झारखंड सरकार',
    cmRole: 'मुख्य संरक्षक · समाधान सेतु',
    ministerName: 'डॉ. बैद्यनाथ राम',
    ministerDesignation: 'माननीय मंत्री',
    ministerDept: 'उच्च एवं तकनीकी शिक्षा विभाग',
    ministerRole: 'अध्यक्ष · संचालन शीर्ष समिति',
    secretaryName: 'श्री राहुल पुरवार, भा.प्र.से.',
    secretaryDesignation: 'प्रधान सचिव',
    secretaryDept: 'उच्च एवं तकनीकी शिक्षा विभाग',
    secretaryRole: 'कार्यकारी निदेशक · क्रियान्वयन मिशन',

    sectorsTag: 'समस्या वर्गीकरण · विषयगत प्रभाग',
    sectorsTitle: 'प्रमुख समस्या क्षेत्र एवं खुली चुनौतियां',
    sectorsSubtitle:
      'प्रगतिशील अनुसंधान थीसिस देखने अथवा जिला स्तर की चुनौतियां दर्ज करने हेतु क्षेत्र चुनें।',
    openChallengesBadge: 'सक्रिय चुनौतियां',
    viewSectorBrief: 'क्षेत्र विवरण देखें →',

    secEducationTitle: 'शिक्षा',
    secEducationSub: 'शिक्षा एवं डिजिटल शिक्षण',
    secEducationDesc:
      'स्मार्ट ग्रामीण कक्षाएं, जनजातीय भाषाओं में एसटीईएम शिक्षण उपकरण एवं दुर्गम क्षेत्रों में ऑफलाइन डिजिटल उपस्थिति प्रणाली।',

    secHealthTitle: 'स्वास्थ्य सेवाएं',
    secHealthSub: 'स्वास्थ्य सेवाएं एवं प्राथमिक उपचार',
    secHealthDesc:
      'सुदूर प्राथमिक स्वास्थ्य केंद्रों हेतु टेलीमेडिसिन जांच उपकरण, सिकल-सेल परीक्षण किट एवं कोल्ड-चेन वैक्सीन परिवहन प्रणाली।',

    secAgriTitle: 'कृषि',
    secAgriSub: 'कृषि एवं सूक्ष्म सिंचाई तंत्र',
    secAgriDesc:
      'कम लागत वाली माइक्रो-ड्रिप सिंचाई, कटाई उपरांत लाह प्रसंस्करण यांत्रिकी एवं पठारी मृदा अम्लता सुधार फॉर्मूला।',

    secWaterTitle: 'जल संसाधन',
    secWaterSub: 'पेयजल एवं जल संसाधन स्वच्छता',
    secWaterDesc:
      'फ्लोराइड निवारण तकनीक, पठारी बोरवेल रिचार्जिंग, आर्सेनिक परीक्षण किट एवं चेक-डैम आईओटी निगरानी तंत्र।',

    secEnvTitle: 'पर्यावरण',
    secEnvSub: 'पर्यावरण एवं वन संपदा',
    secEnvDesc:
      'खनन अवशेष सुधार, वनाग्नि चेतावनी टेलीमेट्री प्रणाली एवं मानव-हाथी संघर्ष निवारण हेतु जियो-फेंसिंग तंत्र।',

    secEnergyTitle: 'ऊर्जा',
    secEnergySub: 'ऊर्जा एवं नवीकरणीय ऊर्जा',
    secEnergyDesc:
      'पहाड़ी गांवों हेतु विकेंद्रीकृत सौर माइक्रोग्रिड, बायोमास ब्रिकेट इकाइयां एवं ग्रामीण ट्रांसफार्मर लोड संतुलन तंत्र।',

    secUrbanTitle: 'नगर विकास',
    secUrbanSub: 'नगर विकास एवं ठोस अपशिष्ट प्रबंधन',
    secUrbanDesc:
      'नगरपालिका प्लास्टिक पायरोलिसिस प्रणाली, विकेंद्रीकृत बायो-गैस संयंत्र एवं रांची-धनबाद हेतु ट्रैफिक एआई मॉडलिंग।',

    secAccessTitle: 'सुगमता',
    secAccessSub: 'दिव्यांगजन सुगमता एवं सहायक उपकरण',
    secAccessDesc:
      'कृषि कार्य हेतु किफायती कृत्रिम अंग तथा हो व संथाली क्षेत्रीय भाषाओं में स्क्रीन रीडर सॉफ्टवेयर।',

    secLivelihoodTitle: 'ग्रामीण आजीविका',
    secLivelihoodSub: 'ग्रामीण आजीविका एवं कुटीर उद्योग',
    secLivelihoodDesc:
      'यांत्रिक तसर रेशम रीलर लूम, मोटर चालित सखुआ पत्ता प्लेट मशीनें एवं शहद निष्कर्षण सेंट्रीफ्यूज उपकरण।',

    noticesTitle: 'आधिकारिक सूचनाएं, परिपत्र एवं एसआईएच 2026 निर्देश',
    noticesGazetteRef: 'राजपत्र अनुभाग · विभागीय संदर्भ: JHK/DHTE/GAZ/2026',
    notice1Title:
      'स्मार्ट इंडिया हैकाथॉन 2026 हेतु विश्वविद्यालय प्राध्यापक मार्गदर्शकों द्वारा शोध प्रस्ताव जमा करने संबंधी दिशानिर्देश',
    notice1Dept: 'तकनीकी शिक्षा निदेशालय',
    notice1Action: 'शोध पोर्टल खोलें →',
    notice2Title:
      'राजपत्र अधिसूचना: जल एवं कृषि-तकनीकी समस्याओं के जिला-स्तरीय क्षेत्रीय सत्यापन हेतु मानक प्रोटोकॉल',
    notice2Dept: 'पेयजल एवं स्वच्छता विभाग',
    notice3Title:
      'सीड स्टेज प्रोटोटाइपिंग अनुदान हेतु कॉर्पोरेट सीएसआर एवं उद्योग साझेदारों से सहभागिता आमंत्रण (द्वितीय चरण)',
    notice3Dept: 'झारखंड नवाचार परिषद',
    notice4Title:
      'नागरिक समस्या जियो-टैगिंग एवं वीडियो सत्यापन हेतु मानक संचालन प्रक्रिया (SOP)',
    notice4Dept: 'राज्य एनआईसी ई-गवर्नेंस सेल',
    noticesArchiveNote:
      'वर्ष 2024 से 2026 तक की सभी ऐतिहासिक अधिसूचनाएं राज्य राजपत्र डिजिटल अभिलेखागार में उपलब्ध हैं।',
    browseAllChallenges: 'सभी खुली चुनौतियां देखें →',

    videoModalTitle: 'पोर्टल कार्यप्रणाली वीडियो मार्गदर्शिका · समाधान सेतु',
    videoModalSub: 'त्रिपक्षीय कार्यप्रणाली प्रस्तुतीकरण: एसआईएच 2026 पीएस 26043',
    videoModalDuration: 'अवधि: 03 मिनट 42 सेकंड · उच्च गुणवत्ता वीडियो गाइड (हिंदी व अंग्रेजी)',
    videoModalNode: 'एनआईसी वीडियो स्ट्रीम नोड: JH-RANCHI-01',
    videoModalClose: 'गाइड बंद करें',

    footerCopyright:
      '© 2026 झारखंड सरकार। सर्वाधिकार सुरक्षित। सामग्री प्रबंधन एवं अद्यतनीकरण: उच्च एवं तकनीकी शिक्षा विभाग।',
    footerAbout: 'समाधान सेतु परिचय',
    footerAccessibility: 'सुगमता विवरण',
    footerPrivacy: 'गोपनीयता नीति',
    footerTerms: 'उपयोग के नियम',
    footerHyperlink: 'हाइपरलिंकिंग नीति',
    footerSitemap: 'साइटमैप',
    footerHelpdesk: 'हेल्पडेस्क एवं प्रश्नोत्तरी',
    footerNicNode:
      'राष्ट्रीय सूचना विज्ञान केंद्र (NIC) सर्वर नोड: JH-RANCHI-01 · अंतिम अद्यतन: 10 सितंबर 2026',
    footerVersion: 'संस्करण 1.0 (एनआईसी मानक) | क्रोम, एज, फायरफॉक्स में सर्वोत्तम दृश्यमान',
  },
};

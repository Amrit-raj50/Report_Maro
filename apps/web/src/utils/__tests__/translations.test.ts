import { describe, it, expect, beforeEach } from 'vitest';
import { useLanguageStore } from '../../store/languageStore.js';
import { translations } from '../translations.js';

describe('Language Store & Bilingual Translations', () => {
  beforeEach(() => {
    useLanguageStore.setState({ lang: 'en' });
    localStorage.clear();
  });

  it('initializes in English by default', () => {
    expect(useLanguageStore.getState().lang).toBe('en');
    expect(translations.en.navHome).toBe('Home');
    expect(translations.en.btnSubmitProblem).toContain('SUBMIT A PROBLEM');
  });

  it('toggles language between English and Hindi', () => {
    useLanguageStore.getState().toggleLang();
    expect(useLanguageStore.getState().lang).toBe('hi');

    const tHi = translations[useLanguageStore.getState().lang];
    expect(tHi.navHome).toBe('मुख्य पृष्ठ');
    expect(tHi.btnSubmitProblem).toContain('समस्या दर्ज करें');

    useLanguageStore.getState().toggleLang();
    expect(useLanguageStore.getState().lang).toBe('en');
    const tEn = translations[useLanguageStore.getState().lang];
    expect(tEn.navHome).toBe('Home');
  });

  it('allows explicitly setting language', () => {
    useLanguageStore.getState().setLang('hi');
    expect(useLanguageStore.getState().lang).toBe('hi');
    expect(translations.hi.statProblemsSubmitted).toBe('कुल दर्ज समस्याएं');
  });

  it('contains complete parity between English and Hindi keys', () => {
    const enKeys = Object.keys(translations.en) as (keyof typeof translations.en)[];
    const hiKeys = Object.keys(translations.hi) as (keyof typeof translations.hi)[];

    expect(enKeys.sort()).toEqual(hiKeys.sort());

    enKeys.forEach((k) => {
      expect(translations.en[k]).toBeTruthy();
      expect(translations.hi[k]).toBeTruthy();
    });
  });

  it('translates narrative, leadership, sectors, notices, and footer correctly', () => {
    const hi = translations.hi;
    expect(hi.aboutTitle).toBe('योजना परिचय: समाधान सेतु');
    expect(hi.cmName).toBe('श्री हेमन्त सोरेन');
    expect(hi.ministerName).toBe('डॉ. बैद्यनाथ राम');
    expect(hi.secretaryName).toContain('श्री राहुल पुरवार');
    expect(hi.secEducationTitle).toBe('शिक्षा');
    expect(hi.secWaterTitle).toBe('जल संसाधन');
    expect(hi.noticesTitle).toContain('आधिकारिक सूचनाएं');
    expect(hi.footerAbout).toBe('समाधान सेतु परिचय');
    expect(hi.footerCopyright).toContain('झारखंड सरकार');
  });
});

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'bm';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    'settings.title': 'Configuration Système',
    'settings.subtitle': 'Gérez l\'établissement, les abonnements et préférences',
    'settings.export': 'Exporter les données',
    'settings.refresh': 'Actualiser',
    'settings.subscription': 'Abonnement & Statut',
    'settings.license_active': 'Licence Active',
    'settings.license_expired': 'Licence Expirée',
    'settings.expires_on': 'Expire le :',
    'settings.not_defined': 'Non définie',
    'settings.limited_access': 'Votre accès est actuellement limité. Veuillez activer une nouvelle clé de licence.',
    'settings.available_plans': 'Plans d\'abonnement disponibles',
    'settings.plan_standard': 'Plan Standard (Trimestre)',
    'settings.plan_standard_desc': 'Idéal pour les petites écoles',
    'settings.plan_premium': 'Plan Premium (Annuel)',
    'settings.popular': 'POPULAIRE',
    'settings.plan_premium_desc': 'Complet avec support prioritaire',
    'settings.plan_unlimited': 'Plan Illimité',
    'settings.plan_unlimited_desc': 'Accès à toutes les fonctionnalités avancées',
    'settings.license_activation': 'Activation de Licence',
    'settings.license_desc': 'Entrez votre clé d\'activation reçue après votre paiement ou demandez une nouvelle licence.',
    'settings.license_key': 'Clé de Licence',
    'settings.activate_btn': 'Activer maintenant',
    'settings.activating': 'Activation...',
    'settings.need_license': 'Besoin d\'une nouvelle licence ?',
    'settings.need_license_desc': 'Si vous n\'avez pas de clé ou si vous souhaitez renouveler votre abonnement, envoyez une demande à notre équipe commerciale.',
    'settings.request_license': 'Demander une licence',
    'settings.requesting': 'Envoi...',
    'settings.help_manual': 'Aide & Manuel',
    'settings.manual_title': 'Manuel d\'utilisation',
    'settings.manual_desc': 'Guide complet au format PDF (12 Mo)',
    'settings.support_contacts': 'Contacts du Support Technique',
    'settings.call': 'Appeler',
    'settings.whatsapp': 'WhatsApp',
    'settings.email': 'Email',
    'settings.website': 'Site Web',
    'settings.open_help_center': 'Ouvrir le centre d\'aide',
    'settings.appearance_system': 'Apparence & Système',
    'settings.theme': 'Thème de l\'interface',
    'settings.theme_desc': 'Basculer entre les modes d\'affichage',
    'settings.language': 'Langue par défaut',
    'settings.language_desc': 'Sélectionnez la langue du système',
    'settings.notifications': 'Notifications',
    'settings.notifications_desc': 'Activer les alertes sonores',
    'settings.danger_zone': 'Zone de Danger',
    'settings.danger_desc': 'La réinitialisation de l\'établissement supprimera toutes les données académiques. Cette action est irréversible.',
    'settings.reset_school': 'Réinitialiser l\'établissement',
    'settings.footer': 'KalanSira Mali v2.4.0 • Tous droits réservés © 2026',
    
    // Themes
    'theme.light': 'Mode Clair',
    'theme.dark': 'Mode Sombre',
    'theme.ocean': 'Mode Océan',
    'theme.nature': 'Mode Nature',
    
    // Languages
    'lang.fr': 'Français (Mali)',
    'lang.en': 'English',
    'lang.bm': 'Bamanankan (Bambara)',
  },
  en: {
    'settings.title': 'System Configuration',
    'settings.subtitle': 'Manage institution, subscriptions and preferences',
    'settings.export': 'Export Data',
    'settings.refresh': 'Refresh',
    'settings.subscription': 'Subscription & Status',
    'settings.license_active': 'Active License',
    'settings.license_expired': 'Expired License',
    'settings.expires_on': 'Expires on:',
    'settings.not_defined': 'Not defined',
    'settings.limited_access': 'Your access is currently limited. Please activate a new license key.',
    'settings.available_plans': 'Available Subscription Plans',
    'settings.plan_standard': 'Standard Plan (Quarterly)',
    'settings.plan_standard_desc': 'Ideal for small schools',
    'settings.plan_premium': 'Premium Plan (Annual)',
    'settings.popular': 'POPULAR',
    'settings.plan_premium_desc': 'Complete with priority support',
    'settings.plan_unlimited': 'Unlimited Plan',
    'settings.plan_unlimited_desc': 'Access to all advanced features',
    'settings.license_activation': 'License Activation',
    'settings.license_desc': 'Enter your activation key received after your payment or request a new license.',
    'settings.license_key': 'License Key',
    'settings.activate_btn': 'Activate now',
    'settings.activating': 'Activating...',
    'settings.need_license': 'Need a new license?',
    'settings.need_license_desc': 'If you do not have a key or wish to renew your subscription, send a request to our sales team.',
    'settings.request_license': 'Request a license',
    'settings.requesting': 'Sending...',
    'settings.help_manual': 'Help & Manual',
    'settings.manual_title': 'User Manual',
    'settings.manual_desc': 'Complete PDF guide (12 MB)',
    'settings.support_contacts': 'Technical Support Contacts',
    'settings.call': 'Call',
    'settings.whatsapp': 'WhatsApp',
    'settings.email': 'Email',
    'settings.website': 'Website',
    'settings.open_help_center': 'Open Help Center',
    'settings.appearance_system': 'Appearance & System',
    'settings.theme': 'Interface Theme',
    'settings.theme_desc': 'Switch between display modes',
    'settings.language': 'Default Language',
    'settings.language_desc': 'Select the system language',
    'settings.notifications': 'Notifications',
    'settings.notifications_desc': 'Enable sound alerts',
    'settings.danger_zone': 'Danger Zone',
    'settings.danger_desc': 'Resetting the institution will delete all academic data. This action is irreversible.',
    'settings.reset_school': 'Reset Institution',
    'settings.footer': 'KalanSira Mali v2.4.0 • All rights reserved © 2026',
    
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'theme.ocean': 'Ocean Mode',
    'theme.nature': 'Nature Mode',
    
    'lang.fr': 'French (Mali)',
    'lang.en': 'English',
    'lang.bm': 'Bamanankan (Bambara)',
  },
  bm: {
    'settings.title': 'Sistɛmu Labɛnni',
    'settings.subtitle': 'Kalanso kofɛla, foroba-sɛbɛnni ni suguya lajɛ',
    'settings.export': 'Kunnafoniw Bɔ',
    'settings.refresh': 'Kura',
    'settings.subscription': 'Sɛbɛnni & Jɔyɔrɔ',
    'settings.license_active': 'Lisansi Bɛ Baara Kɛ',
    'settings.license_expired': 'Lisansi Saara',
    'settings.expires_on': 'Bɛ sa:',
    'settings.not_defined': 'A ma lajɛ',
    'settings.limited_access': 'I ka donni danmadɔnnen don. I ka lisansi kura jigi.',
    'settings.available_plans': 'Sɛbɛnni plani bɛ',
    'settings.plan_standard': 'Plani Standard (Kalo saba)',
    'settings.plan_standard_desc': 'Ka ɲi kalanso fitiniw ye',
    'settings.plan_premium': 'Plani Premium (San kɔnɔ)',
    'settings.popular': 'BƐƝƐ',
    'settings.plan_premium_desc': 'Daɲɛ bɛɛ ni dɛmɛn fɔlɔ',
    'settings.plan_unlimited': 'Plani Danmatɛ',
    'settings.plan_unlimited_desc': 'Donni fɛɛrɛ bɛɛ la',
    'settings.license_activation': 'Lisansi Kununni',
    'settings.license_desc': 'I ka kununni kɛlɛ don i tɛmɛsira kɔfɛ wala lisansi kura ɲini.',
    'settings.license_key': 'Lisansi Kɛlɛ',
    'settings.activate_btn': 'Kunun sisan',
    'settings.activating': 'Kununni...',
    'settings.need_license': 'Mako bɛ lisansi kura la?',
    'settings.need_license_desc': 'Ni kɛlɛ tɛ i bolo wala i b\'a fɛ ka sɛbɛnni kura kɛ, ɲinini ci an ka baarakɛlaw ma.',
    'settings.request_license': 'Lisansi ɲini',
    'settings.requesting': 'Ci kɛ...',
    'settings.help_manual': 'Dɛmɛn & Kitabu',
    'settings.manual_title': 'Baarakɛla Kitabu',
    'settings.manual_desc': 'PDF kitabu dafa (12 MB)',
    'settings.support_contacts': 'Dɛmɛn Kɔntaktiw',
    'settings.call': 'Weele',
    'settings.whatsapp': 'WhatsApp',
    'settings.email': 'I-mɛl',
    'settings.website': 'Siti',
    'settings.open_help_center': 'Dɛmɛn yɔrɔ dayɛlɛ',
    'settings.appearance_system': 'Yeli & Sistɛmu',
    'settings.theme': 'Yeli Tɛmɛ',
    'settings.theme_desc': 'Yeli suguya yɛlɛma',
    'settings.language': 'Kan',
    'settings.language_desc': 'Sistɛmu kan sugandi',
    'settings.notifications': 'Kibaru',
    'settings.notifications_desc': 'Makan kibaruw kunun',
    'settings.danger_zone': 'Fari Yɔrɔ',
    'settings.danger_desc': 'Kalanso labɛnni kura bɛ kunnafoni bɛɛ josi. O kɛwaleyali tɛ se ka segin.',
    'settings.reset_school': 'Kalanso labɛn kura',
    'settings.footer': 'KalanSira Mali v2.4.0 • Hakɛ bɛɛ mara © 2026',
    
    'theme.light': 'Tile Yeli',
    'theme.dark': 'Sufa Yeli',
    'theme.ocean': 'Kɔgɔji Yeli',
    'theme.nature': 'Tufin Yeli',
    
    'lang.fr': 'Tubabukan (Mali)',
    'lang.en': 'Angilɛkan',
    'lang.bm': 'Bamanankan',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved && ['fr', 'en', 'bm'].includes(saved) ? saved : 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, variables?: Record<string, string>) => {
    let text = translations[language]?.[key] || translations['fr'][key] || key;
    if (variables) {
      Object.keys(variables).forEach((k) => {
        text = text.replace(`{${k}}`, variables[k]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

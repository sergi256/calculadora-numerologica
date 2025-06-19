// localizationManager.js

import { translations } from './translations.js'; // Assegura't que la ruta sigui correcta

/**
 * Gestiona la traducció dels elements de la interfície d'usuari.
 */
export class LocalizationManager {
    constructor() {
        this.currentLang = this.getBrowserLanguage() || 'ca'; // Obté l'idioma del navegador o usa 'ca' per defecte
        this.texts = translations[this.currentLang];

        if (!this.texts) {
            console.warn(`[LocalizationManager] No s'han trobat traduccions per a l'idioma: ${this.currentLang}. Usant 'ca' com a fallback.`);
            this.currentLang = 'ca'; // Fallback al català si l'idioma del navegador no té traduccions
            this.texts = translations[this.currentLang];
        }
        this.translateUI();
    }

    /**
     * Intenta obtenir l'idioma preferit del navegador.
     * @returns {string} El codi de l'idioma (e.g., 'ca', 'es') o null si no es pot determinar.
     */
    getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang) {
            // Retorna només la part principal de l'idioma (e.g., 'ca' de 'ca-ES')
            return lang.split('-')[0];
        }
        return null;
    }

    /**
     * Retorna l'objecte de traduccions per a l'idioma actual.
     * @returns {object} L'objecte amb els textos traduïts.
     */
    getTranslatedTexts() {
        return this.texts;
    }

    /**
     * Tradueix tots els elements del DOM amb l'atribut `data-i18n` a l'idioma actual.
     * Ha de ser cridat després que el DOM estigui completament carregat.
     */
    translateUI() {
        if (!this.texts) {
            console.error('[LocalizationManager] No hi ha textos de traducció carregats.');
            return;
        }

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.texts[key]) {
                element.innerText = this.texts[key];
            } else {
                console.warn(`[LocalizationManager] Clau de traducció no trobada per a l'element '${key}' en l'idioma '${this.currentLang}'.`);
            }
        });
        
        // Traducció manual del <title>
        const titleKey = 'title_main';
        if (this.texts[titleKey]) {
            document.title = this.texts[titleKey];


            
                console.log("Nou títol:", document.title); // <-- Afegit per depurar

        }
    }

    /**
     * Permet canviar l'idioma de la interfície d'usuari i actualitzar les traduccions.
     * @param {string} newLang - El nou codi de l'idioma (e.g., 'ca', 'es').
     */
    setLanguage(newLang) {
        if (translations[newLang]) {
            this.currentLang = newLang;
            this.texts = translations[newLang];
            this.translateUI(); // Re-tradueix la UI amb el nou idioma
            document.documentElement.lang = newLang; // Actualitza l'atribut lang de l'HTML
        } else {
            console.warn(`[LocalizationManager] L'idioma '${newLang}' no està disponible a les traduccions.`);
        }
    }
}
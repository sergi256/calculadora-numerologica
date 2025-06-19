// main.js
console.log("main.js carregat");

import { CalculadoraNumerologia } from './numerologiaCalculadora.js';
import { UIManager } from './uiManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Assegura't que l'element #nomInput i altres existeixen abans d'intentar crear UIManager.
    // UIManager ja fa una validació, però és bo que el DOM estigui carregat.
    const calculadora = new CalculadoraNumerologia();
    const uiManager = new UIManager(calculadora);

    // --- Codi per als botons d'idioma ---
    const catBtn = document.getElementById('catBtn');
    const esBtn = document.getElementById('esBtn');

    // Funció per actualitzar la classe 'active' als botons d'idioma
    const updateLangButtonState = (selectedLang) => {
        if (catBtn) {
            catBtn.classList.toggle('active', selectedLang === 'ca');
        }
        if (esBtn) {
            esBtn.classList.toggle('active', selectedLang === 'es');
        }
    };

    if (catBtn) {
        catBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que l'enllaç recarregui la pàgina
            uiManager.localizationManager.setLanguage('ca');
            updateLangButtonState('ca'); // Actualitza l'estat visual dels botons
        });
    }

    if (esBtn) {
        esBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que l'enllaç recarregui la pàgina
            uiManager.localizationManager.setLanguage('es');
            updateLangButtonState('es'); // Actualitza l'estat visual dels botons
        });
    }

    // Opcional: Actualitzar l'estat inicial dels botons segons l'idioma detectat pel LocalizationManager
    // Això és útil per si l'idioma per defecte no és 'ca' i el navegador detecta 'es' per exemple.
    updateLangButtonState(uiManager.localizationManager.currentLang);

    // --- Fi Codi per als botons d'idioma ---
	
	
    // Lògica per mostrar/amagar el disclaimer (si vols que es gestioni aquí)
    const nouDisclaimerBanner = document.getElementById('nou-disclaimer-proves');
    const MOSTRAR_NOU_DISCLAIMER_PROVES = true; // Defineix si vols mostrar-lo o no
    if (nouDisclaimerBanner) {
        if (MOSTRAR_NOU_DISCLAIMER_PROVES) {
            nouDisclaimerBanner.classList.remove('is-hidden');
        } else {
            nouDisclaimerBanner.classList.add('is-hidden');
        }
    }

    // Si tinguessis un selector d'idioma a l'HTML:
    // const selectorIdioma = document.getElementById('selector-idioma');
    // if (selectorIdioma) {
    //     selectorIdioma.addEventListener('change', (event) => {
    //         uiManager.localizationManager.setLanguage(event.target.value);
    //     });
    // }
});
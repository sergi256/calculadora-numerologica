// uiManager.js

// --- Lògica d'Interfície d'Usuari i Gestió del DOM ---

import { LocalizationManager } from './localizationManager.js'; // Importa el gestor de localització
// NO NECESSITEM IMPORTAR 'translations' AQUÍ DIRECTAMENT, JA QUE LocalizationManager S'ENCARREGA D'AIXÒ.
// import { translations } from './translations.js'; // <-- Aquesta línia ja no és necessària

import { CalculadoraNumerologia } from './numerologiaCalculadora.js'; // Assegura't que la ruta sigui correcta


// Defineix NUMEROS_MESTRES i reduirNumeroSimple globalment si no estan ja en un altre fitxer compartit
// S'utilitzen per la visualització, no per la lògica de càlcul de la calculadora
const NUMEROS_MESTRES = [11, 22, 33];

// Funció GLOBAL per reduir qualsevol número a un dígit simple (1-9)
// PERÒ REDUEIX ELS NÚMEROS MESTRES A LA SEVA ARREL (11 -> 2, 22 -> 4, 33 -> 6).
function reduirNumeroSimple(num) {
    if (typeof num !== 'number' || isNaN(num)) {
        return '-';
    }
    // Si és un número mestre (11, 22, 33), el reduïm a la seva arrel per la visualització.
    // Això és diferent de `CalculadoraNumerologia.reduirNumero` que els manté com a mestres.
    if (NUMEROS_MESTRES.includes(num)) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }

    while (num > 9) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
}


// Refactoritzem 'ui' a una classe UIManager
export class UIManager {
    constructor(calculadora) {
        this.calculadora = calculadora;
        this.localizationManager = new LocalizationManager();

        // Elements del DOM centralitzats amb els IDs i selectors correctes del teu HTML
        this.elements = {
            nomInput: document.getElementById("nomInput"),
            diaInput: document.getElementById("dia"),
            mesInput: document.getElementById("mes"),
            anyInput: document.getElementById("any"),
            pdfButton: document.getElementById("pdfButton"),
            errorPDF: document.getElementById("errorPDF"),
            taulaDades: document.getElementById("taulaDades"), // La taula completa
            nouDisclaimerBanner: document.getElementById('nou-disclaimer-proves'),

            // Elements de la taula d'Àrees Clau (els teus <td> amb ID)
            camivida: document.getElementById('camivida'),
            anima: document.getElementById('anima'),
            personalitat: document.getElementById('personalitat'),
            expressio: document.getElementById('expressio'),
            missiocosmica: document.getElementById('missiocosmica'),
            forca: document.getElementById('forca'),
            equilibri: document.getElementById('equilibri'),
            iniespiritual: document.getElementById('iniespiritual'),
        };

        // Validació per assegurar que tots els elements essencials existeixen
        for (const key in this.elements) {
            if (this.elements[key] === null || this.elements[key] === undefined) {
                 console.warn(`Advertència: Element amb ID/selector '${key}' no trobat al DOM. Alguna funcionalitat pot no funcionar.`);
                 // Mantinc la advertència. Si algun és crític per a la inicialització,
                 // podríem canviar a 'throw new Error()'
            }
        }

        this.initEventListeners();
        this.loadInitialData();
        this.actualitzarCalculs(); // Realitza els càlculs inicials i actualitza la UI
    }

    initEventListeners() {
        this.elements.nomInput.addEventListener('input', () => this.handleInputChange());
        this.elements.diaInput.addEventListener('input', () => this.handleInputChange());
        this.elements.mesInput.addEventListener('input', () => this.handleInputChange());
        this.elements.anyInput.addEventListener('input', () => this.handleInputChange());
        
        if (this.elements.pdfButton) {
            this.elements.pdfButton.addEventListener('click', () => this.generarPDF());
        }

        // Listeners per als botons d'idioma
        document.getElementById('catBtn')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.localizationManager.setLanguage('ca');
            this.localizationManager.translateUI();
        });

        document.getElementById('esBtn')?.addEventListener('click', (event) => {
            event.preventDefault();
            this.localizationManager.setLanguage('es');
            this.localizationManager.translateUI();
        });
    }

    loadInitialData() {
        const MOSTRAR_NOU_DISCLAIMER_PROVES = true;
        if (this.elements.nouDisclaimerBanner) {
            if (MOSTRAR_NOU_DISCLAIMER_PROVES) {
                this.elements.nouDisclaimerBanner.classList.remove('is-hidden');
            } else {
                this.elements.nouDisclaimerBanner.classList.add('is-hidden');
            }
        }
    }

    handleInputChange() {
        if (this.elements.errorPDF) {
            this.elements.errorPDF.style.display = 'none';
        }
        this.actualitzarCalculs();
    }

    // Aquesta funció ja no és estrictament necessària si sempre accedeixes directament via this.elements.idInput.value
    // Però la deixo ja que la tenies.
    getInputValor(id) {
        const element = document.getElementById(id);
        return element ? element.value : '';
    }

    netejarResultats() {
        // Netejar els resultats de la taula d'Àrees Clau
        this.elements.camivida.textContent = '-';
        this.elements.anima.textContent = '-';
        this.elements.personalitat.textContent = '-';
        this.elements.expressio.textContent = '-';
        this.elements.missiocosmica.textContent = '-';
        this.elements.forca.textContent = '-';
        this.elements.equilibri.textContent = '-';
        this.elements.iniespiritual.textContent = '-';

        // Llista d'ids de files de dades
        const filesDades = [
            'fila-habitants',
            'fila-induccio1',
            'fila-induccio2',
            'fila-induccio3',
            'fila-ponts',
            'fila-propostaEvolucio',
            'fila-inconscient',
            'fila-induccioInconscient1',
            'fila-induccioInconscient2',
            'fila-induccioInconscient3'
        ];

        filesDades.forEach(id => {
            document.querySelectorAll(`#${id} td:not(:first-child)`).forEach(cell => {
                cell.textContent = '-';
            });
        });
    }
    // ...existing code...
    actualitzarCalculs() {
        this.netejarResultats();

        const nom = this.elements.nomInput.value.trim();
        const dia = parseInt(this.elements.diaInput.value);
        const mes = parseInt(this.elements.mesInput.value);
        const any = parseInt(this.elements.anyInput.value);

        // Re-instanciem la calculadora amb les dades actuals (potser incompletes)
        this.calculadora = new CalculadoraNumerologia(nom, dia, mes, any);

        const texts = this.localizationManager.getTranslatedTexts();

        // Àrees clau: calcula només si hi ha prou dades per a cada càlcul
        const resultatsCalculats = {
            camivida: (!isNaN(dia) && !isNaN(mes) && !isNaN(any) && dia > 0 && mes > 0 && any > 0)
                ? this.calculadora.calcularCamiVida() : "-",
            anima: (nom) ? this.calculadora.calcularAnima() : "-",
            personalitat: (nom) ? this.calculadora.calcularPersonalitat() : "-",
            expressio: (nom) ? this.calculadora.calcularExpressio() : "-",
            missiocosmica: (nom && !isNaN(dia) && !isNaN(mes) && !isNaN(any) && dia > 0 && mes > 0 && any > 0)
                ? this.calculadora.calcularMissioCosmica() : "-",
            forca: (nom && !isNaN(dia) && !isNaN(mes) && !isNaN(any) && dia > 0 && mes > 0 && any > 0)
                ? this.calculadora.calcularForca() : "-",
            equilibri: (nom && !isNaN(dia) && !isNaN(mes) && !isNaN(any) && dia > 0 && mes > 0 && any > 0)
                ? this.calculadora.calcularEquilibri() : "-",
            iniespiritual: (nom && !isNaN(dia) && !isNaN(mes) && !isNaN(any) && dia > 0 && mes > 0 && any > 0)
                ? this.calculadora.calcularIniciacioEspiritual() : "-",
        };

        for (const tipus in resultatsCalculats) {
            const valorCompleix = resultatsCalculats[tipus];
            const element = this.elements[tipus];

            if (element) {
                if (valorCompleix === "-") {
                    element.textContent = "-";
                    element.classList.remove("numero-mestre");
                } else {
                    const valorParts = String(valorCompleix).split('/');
                    const valorReduit = parseInt(valorParts.slice(-1)[0]);
                    if (NUMEROS_MESTRES.includes(valorReduit)) {
                        element.textContent = `${valorReduit}/${reduirNumeroSimple(valorReduit)}`;
                        element.classList.add("numero-mestre");
                    } else {
                        element.textContent = valorCompleix;
                        element.classList.remove("numero-mestre");
                    }
                }
                // Actualitza el significat
                const fila = element.closest('tr');
                if (fila) {
                    const tdSignificat = fila.querySelector('[data-i18n$="_significat"]');
                    if (tdSignificat && texts[`${tipus}_significat`]) {
                        tdSignificat.innerText = texts[`${tipus}_significat`];
                    }
                }
            }
        }

        // Taula de dades: només omple si hi ha prou dades bàsiques
        if (nom || (!isNaN(dia) && !isNaN(mes) && !isNaN(any) && dia > 0 && mes > 0 && any > 0)) {
            // Si vols, pots afinar encara més la lògica per omplir només files concretes
            try {
                const habitants = this.calculadora.calcularHabitants();
                const inconscient = this.calculadora.calcularInconscient(habitants);
                const induccionsCalculades = this.calculadora.calcularInduccio(habitants);
                const induccionsInconscientsCalculades = this.calculadora.calcularInduccioInconscient(inconscient);
                const ponts = this.calculadora.calcularPonts(habitants);
                const propostaEvolucio = this.calculadora.calcularPropostaEvolucio(habitants);

                this.omplirTaulaDades(
                    habitants,
                    induccionsCalculades,
                    ponts,
                    propostaEvolucio,
                    inconscient,
                    induccionsInconscientsCalculades
                );
            } catch (e) {
                // Si hi ha error de càlcul, deixa la taula buida
            }
        }
    }
    

    omplirTaulaDades(
        habitants,
        induccionsCalculades,
        ponts,
        propostaEvolucio,
        inconscient,
        induccionsInconscientsCalculades
    ) {
        const taulaDadesBody = this.elements.taulaDades; // L'element table en si, ja que no hi ha <tbody> explícit
        if (!taulaDadesBody) {
            console.error("No s'ha trobat la taulaDades.");
            return;
        }
        
        // Obtenim les files del body (excloent la fila de capçalera "Cases")
        // table.rows és una HTMLCollection, que és com un array.
        const rows = Array.from(taulaDadesBody.rows);

        // Fila 1: Habitants
        const habitantsCells = document.querySelectorAll('#fila-habitants td:not(:first-child)');
        habitantsCells.forEach((cell, i) => {
            if (habitants[i] !== undefined) cell.textContent = (habitants[i] === 0) ? '*' : reduirNumeroSimple(habitants[i]);
            else cell.textContent = '-';
        });

        // Fila 2: Inducció 1r nivell
        const induccio1Cells = document.querySelectorAll('#fila-induccio1 td:not(:first-child)');
        induccio1Cells.forEach((cell, i) => {
            if (induccionsCalculades.nivell1[i] !== undefined) cell.textContent = (induccionsCalculades.nivell1[i] === 0) ? '*' : reduirNumeroSimple(induccionsCalculades.nivell1[i]);
            else cell.textContent = '-';
        });

        // Fila 3: Inducció 2n nivell
        const induccio2Cells = document.querySelectorAll('#fila-induccio2 td:not(:first-child)');
        induccio2Cells.forEach((cell, i) => {
            if (induccionsCalculades.nivell2[i] !== undefined) cell.textContent = (induccionsCalculades.nivell2[i] === 0) ? '*' : reduirNumeroSimple(induccionsCalculades.nivell2[i]);
            else cell.textContent = '-';
        });

        // Fila 4: Inducció 3r nivell
        const induccio3Cells = document.querySelectorAll('#fila-induccio3 td:not(:first-child)');
        induccio3Cells.forEach((cell, i) => {
            if (induccionsCalculades.nivell3[i] !== undefined) cell.textContent = (induccionsCalculades.nivell3[i] === 0) ? '*' : reduirNumeroSimple(induccionsCalculades.nivell3[i]);
            else cell.textContent = '-';
        });

        // Fila 5: Ponts
        const pontsCells = document.querySelectorAll('#fila-ponts td:not(:first-child)');
        pontsCells.forEach((cell, i) => {
            const valorCalculatDelPont = ponts[i];
            if (valorCalculatDelPont === 0) { // Quan el pont és 0, mostra el número de la casa (1-9)
                cell.textContent = String(i + 1);
            } else if (valorCalculatDelPont !== undefined) {
                cell.textContent = reduirNumeroSimple(valorCalculatDelPont);
            } else {
                cell.textContent = '-';
            }
        });

        // Fila 6: Proposta Evolució
        const propostaEvolucioCells = document.querySelectorAll('#fila-propostaEvolucio td:not(:first-child)');
        propostaEvolucioCells.forEach((cell, i) => {
            if (propostaEvolucio[i] !== undefined) cell.textContent = (propostaEvolucio[i] === 0) ? '*' : reduirNumeroSimple(propostaEvolucio[i]);
            else cell.textContent = '-';
        });

        // Fila 7: Inconscient
        const inconscientCells = document.querySelectorAll('#fila-inconscient td:not(:first-child)');
        inconscientCells.forEach((cell, i) => {
            if (inconscient[i] !== undefined) cell.textContent = (inconscient[i] === 0) ? '*' : reduirNumeroSimple(inconscient[i]);
            else cell.textContent = '-';
        });

        // Fila 8: Inducció 1r nivell Inconscient
        const induccioInconscient1Cells = document.querySelectorAll('#fila-induccioInconscient1 td:not(:first-child)');
        induccioInconscient1Cells.forEach((cell, i) => {
            if (induccionsInconscientsCalculades.nivell1[i] !== undefined) cell.textContent = (induccionsInconscientsCalculades.nivell1[i] === 0) ? '*' : reduirNumeroSimple(induccionsInconscientsCalculades.nivell1[i]);
            else cell.textContent = '-';
        });

        // Fila 9: Inducció 2n nivell Inconscient
        const induccioInconscient2Cells = document.querySelectorAll('#fila-induccioInconscient2 td:not(:first-child)');
        induccioInconscient2Cells.forEach((cell, i) => {
            if (induccionsInconscientsCalculades.nivell2[i] !== undefined) cell.textContent = (induccionsInconscientsCalculades.nivell2[i] === 0) ? '*' : reduirNumeroSimple(induccionsInconscientsCalculades.nivell2[i]);
            else cell.textContent = '-';
        });

        // Fila 10: Inducció 3r nivell Inconscient
        const induccioInconscient3Cells = document.querySelectorAll('#fila-induccioInconscient3 td:not(:first-child)');
        induccioInconscient3Cells.forEach((cell, i) => {
            if (induccionsInconscientsCalculades.nivell3[i] !== undefined) cell.textContent = (induccionsInconscientsCalculades.nivell3[i] === 0) ? '*' : reduirNumeroSimple(induccionsInconscientsCalculades.nivell3[i]);
            else cell.textContent = '-';
        });

        // Les altres 4 files de relacions i objectiu de vida que tenies comentades al final de l'original
        // Si les descomentes en el teu HTML, hauràs de crear els elements pertinents
        // i afegir la lògica aquí per omplir-les. Per ara, no estan incloses.
    }

    generarPDF() {
        try {
            if (this.elements.errorPDF) {
                this.elements.errorPDF.style.display = 'none';
            }

            const nom = this.elements.nomInput.value.trim();
            const camivida = this.elements.camivida.innerText;
            const anima = this.elements.anima.innerText;

            const texts = this.localizationManager.getTranslatedTexts();

            // Validació més estricta per a la generació del PDF
            if (!nom || nom.trim() === '' || camivida === "-" || anima === "-") {
                throw new Error(texts.error_pdf_dades_incompletes);
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.text(`${texts.informe_titol} - ${nom || texts.informe_subtitol_anonim}`, 15, 15);

            const rowsMainTable = [
                [texts.taula_capcalera_tipus, texts.taula_capcalera_valor, texts.taula_capcalera_significat],
                [texts.camivida_label, this.elements.camivida.innerText, texts.camivida_significat],
                [texts.anima_label, this.elements.anima.innerText, texts.anima_significat],
                [texts.personalitat_label, this.elements.personalitat.innerText, texts.personalitat_significat],
                [texts.expressio_label, this.elements.expressio.innerText, texts.expressio_significat],
                [texts.missiocosmica_label, this.elements.missiocosmica.innerText, texts.missiocosmica_significat],
                [texts.forca_label, this.elements.forca.innerText, texts.forca_significat],
                [texts.equilibri_label, this.elements.equilibri.innerText, texts.equilibri_significat],
                [texts.iniespiritual_label, this.elements.iniespiritual.innerText, texts.iniespiritual_significat],
            ];

            doc.autoTable({
                startY: 25,
                head: [rowsMainTable[0]],
                body: rowsMainTable.slice(1),
                styles: { fontSize: 10 }
            });

            // Preparar dades de la segona taula (taulaDades) amb textos traduïts
            const taulaDadesHTML = this.elements.taulaDades;
            // Fem un slice(1) per saltar la primera fila de l'HTML (la de "Cases")
            const dadesTaulaSecundaria = Array.from(taulaDadesHTML.rows).slice(1).map((row, rowIndex) => {
                let label = '';
                // rowIndex aquí es correspon amb l'índex de la fila DESPRÉS de fer slice(1)
                // O sigui, Habitants és rowIndex 0, Inducció 1r és rowIndex 1, etc.
                switch(rowIndex) {
                    case 0: label = texts.taulaDades_habitants; break;
                    case 1: label = texts.taulaDades_induccio1; break;
                    case 2: label = texts.taulaDades_induccio2; break;
                    case 3: label = texts.taulaDades_induccio3; break;
                    case 4: label = texts.taulaDades_ponts; break;
                    case 5: label = texts.taulaDades_propostaEvolucio; break;
                    case 6: label = texts.taulaDades_inconscient; break;
                    case 7: label = texts.taulaDades_induccioInconscient1; break;
                    case 8: label = texts.taulaDades_induccioInconscient2; break;
                    case 9: label = texts.taulaDades_induccioInconscient3; break;
                }
                // Retorna un array amb l'etiqueta i el contingut de les cel·les de la fila (excloent la primera cel·la de l'etiqueta)
                return [label, ...Array.from(row.cells).slice(1).map(cell => cell.textContent.trim() || "-")]; 
            });

            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 15,
                head: [['', '1', '2', '3', '4', '5', '6', '7', '8', '9']], // Capçalera numèrica pel PDF
                body: dadesTaulaSecundaria,
                styles: {
                    fontSize: 9,
                    halign: "center",
                    cellPadding: 2,
                    valign: "middle"
                },
                columnStyles: {
                    0: { fontStyle: "bold", cellWidth: 22 }
                },
                headStyles: {
                    fillColor: [106, 27, 154],
                    textColor: 255
                },
                didDrawCell: (data) => {
                    const adjustedColors = {
                        // Aquests índexs corresponen a `data.row.index` del body del PDF.
                        // Recorda que `dadesTaulaSecundaria` ja ha fet un `slice(1)` de les files HTML.
                        4: [6, 69, 173],    // Fila 'Ponts' (rowIndex 4 de dadesTaulaSecundaria)
                        5: [34, 139, 34],    // Fila 'Proposta Evolució' (rowIndex 5)
                        6: [139, 0, 139],    // Fila 'Inconscient' (rowIndex 6)
                        7: [139, 0, 139],    // Fila 'Inducció 1r nivell (Inc.)' (rowIndex 7)
                        8: [139, 0, 139],    // Fila 'Inducció 2n nivell (Inc.)' (rowIndex 8)
                        9: [139, 0, 139]     // Fila 'Inducció 3r nivell (Inc.)' (rowIndex 9)
                    };

                    if (adjustedColors[data.row.index]) {
                        const color = adjustedColors[data.row.index];
                        doc.setTextColor(color[0], color[1], color[2]);
                        data.cell.styles.fontStyle = "bold";
                    }
                },
                willDrawCell: (data) => {
                    if (data.row.index % 2 === 0 && data.row.index > 0) {
                        doc.setFillColor(245, 245, 245);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, "F");
                    }
                }
            });

            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text(texts.pdf_nota_induccio_inconscient, 15, doc.lastAutoTable.finalY + 10);

            doc.save(`${texts.informe_titol} - ${(nom || texts.informe_subtitol_anonim).substring(0, 10)}.pdf`);
        } catch (error) {
            console.error("Error al generar PDF:", error);
            const texts = this.localizationManager.getTranslatedTexts();
            this.elements.errorPDF.textContent = error.message.includes("Si us plau") ? error.message : texts.error_pdf_generacio;
            this.elements.errorPDF.style.display = 'block';
        }
    }
}
// --- Lògica d'Interfície d'Usuari i Gestió del DOM ---

const ui = {
	elements: {
		nomInput: document.getElementById("nomInput"),
		diaInput: document.getElementById("dia"),
		mesInput: document.getElementById("mes"),
		anyInput: document.getElementById("any"),
		pdfButton: document.getElementById("pdfButton"),
		errorPDF: document.getElementById("errorPDF"),
		taulaPrincipal: document.querySelector("table:first-of-type"), // La primera taula amb els càlculs bàsics
		taulaDades: document.getElementById("taulaDades"),
	},

	// Inicialitza els listeners d'esdeveniments
	init() {
		// Validació bàsica d'existència d'elements
		for (const key in this.elements) {
			if (!this.elements[key]) {
				console.error(`Error: Element amb ID/selector '${key}' no trobat.`);
				// Podem optar per llançar un error o simplement sortir
				return; 
			}
		}

		// Attach events
		this.elements.nomInput.addEventListener('input', this.handleInputChange.bind(this));
		this.elements.diaInput.addEventListener('input', this.handleInputChange.bind(this));
		this.elements.mesInput.addEventListener('input', this.handleInputChange.bind(this));
		this.elements.anyInput.addEventListener('input', this.handleInputChange.bind(this));
		this.elements.pdfButton.addEventListener('click', this.generarPDF.bind(this));
	},

	// Gestor de canvis als inputs
	handleInputChange() {
		// CORRECCIÓ AQUÍ: Accedir a errorPDF a través de this.elements
		this.elements.errorPDF.style.display = 'none'; // Abans era this.errorPDF
		this.actualitzarCalculs();            
	},
	
	getInputValor: function(id) {
		//console.log(`Intentant obtenir valor de l'element amb ID: ${id}`); // DEBUG
		const element = document.getElementById(id);
		if (element) {
			//console.log(`Element ${id} trobat. Valor: ${element.value}`); // DEBUG
			return element.value;
		} else {
			//console.warn(`Element amb ID '${id}' no trobat.`); // DEBUG
			return ''; // Retorna una cadena buida si l'element no existeix
		}
	},
	
	// Reseteja els resultats a la interfície
	netejarResultats() {
		// Netejar els camps individuals de resultats
		document.querySelectorAll("td[id]").forEach(td => {
			td.innerHTML = "-"; // Sempre un guió per defecte
			td.classList.remove("numero-mestre");
		});

		// Netejar la fila d'Habitants
		document.querySelectorAll('.habitants-cell').forEach(cell => cell.textContent = '-');

		// Netejar les 9 files de dades (Inducció, Ponts, etc.)
		const taulaDades = this.elements.taulaDades;
		// Comencem des de la fila 3 (índex 2), fins al final de la taula.
		// Això garanteix que les dues primeres files (Cases i Habitants) es mantenen.
		for (let r = 2; r < taulaDades.rows.length; r++) { 
			for (let c = 1; c < taulaDades.rows[r].cells.length; c++) { // Comencem des de la 2a columna (índex 1)
				taulaDades.rows[r].cells[c].textContent = '-';
			}
		}
	},
	// Actualitza tots els càlculs i els mostra a la UI
	// ... (Totes les teves funcions, incloent reduirNumeroSimple, calcularHabitants, actualitzarTaulaDades) ...

	actualitzarCalculs() {
		this.netejarResultats(); // Neteja totes les cel·les amb '-' o buit al principi

		const nom = this.getInputValor('nomInput');
		const dia = parseInt(this.getInputValor('dia'));
		const mes = parseInt(this.getInputValor('mes'));
		const any = parseInt(this.getInputValor('any'));

		// Creació de la instància de CalculadoraNumerologia
		const calculadora = new CalculadoraNumerologia(nom, dia, mes, any);

		// --- Càlcul i actualització dels resultats de l'arbre (Anima, Personalitat, Expressio, CamiVida, etc.) ---
		const resultatsCalculats = {
			anima: calculadora.calcularAnima(),
			personalitat: calculadora.calcularPersonalitat(),
			expressio: calculadora.calcularExpressio(),
			camivida: calculadora.calcularCamiVida(),
			missiocosmica: calculadora.calcularMissioCosmica(),
			forca: calculadora.calcularForca(),
			equilibri: calculadora.calcularEquilibri(),
			iniespiritual: calculadora.calcularIniciacioEspiritual(),
		};

		for (const tipus in resultatsCalculats) {
			const element = document.getElementById(tipus);
			if (element) {
				const valorCompleix = resultatsCalculats[tipus];
				if (valorCompleix === '-') {
					element.innerHTML = "-";
					element.classList.remove("numero-mestre");
					continue;
				}

				const valorParts = String(valorCompleix).split('/');
				const valorReduit = parseInt(valorParts.pop());

				if (NUMEROS_MESTRES.includes(valorReduit)) {
					// ARA ÉS UNA FUNCIÓ GLOBAL, SENSE 'this.'
					element.innerHTML = `${valorReduit}/${reduirNumeroSimple(valorReduit)}`; // <-- CORRECCIÓ
					element.classList.add("numero-mestre");
				} else {
					element.innerHTML = valorCompleix;
					element.classList.remove("numero-mestre");
				}
			}
		}
		
		// --- Càlcul i actualització de les taules dependents de l'estructura (Habitants, Inducció, Ponts, etc.) ---
		// Aquí és on calculem les variables una sola vegada i en l'ordre correcte.
		
		// Calculem Habitants primer
		const habitants = calculadora.calcularHabitants(); // Aquest 'habitants' és l'array de comptadors [0,1,2,...]
		
		// Calculem Inconscient (depèn d'habitants)
		const inconscient = calculadora.calcularInconscient(habitants); 

		// Calculem les induccions (ara retornen objectes amb 3 nivells)
		const induccionsCalculades = calculadora.calcularInduccio(habitants); 
		const induccionsInconscientsCalculades = calculadora.calcularInduccioInconscient(inconscient);

		// Calculem la resta de variables per a actualitzarTaulaDades
		const ponts = calculadora.calcularPonts(habitants);
		const propostaEvolucio = calculadora.calcularPropostaEvolucio(habitants);

		// Finalment, actualitzem la taula amb totes les dades
		// Aquesta crida enviarà l'array 'habitants' a 'actualitzarTaulaDades',
		// que ja té la lògica per recórrer-lo i reduir cada element.
		this.actualitzarTaulaDades(
			habitants,
			induccionsCalculades, // Passem l'objecte complet
			ponts,
			propostaEvolucio,
			inconscient,
			induccionsInconscientsCalculades // Passem l'objecte complet
		);
	},
	
	obtenirValorTaulaDades(valor) { // Ja no necessita 'calculadora' aquí
		if (valor === '-' || valor === 0 || valor === undefined || isNaN(valor)) {
			return '-';
		}
		// Ara crida la funció GLOBAL 'reduirNumeroSimple'
		return reduirNumeroSimple(valor);
	},			

	// Funció per afegir/actualitzar les files a taulaDades
	actualitzarTaulaDades(
		habitants, // ATENCIÓ: Aquest 'habitants' és l'ARRAY de comptadors (e.g., [0, 1, 2, ...])
		induccionsCalculades, 
		ponts, 
		propostaEvolucio, 
		inconscient, 
		induccionsInconscientsCalculades
		// Si tens més paràmetres com relacioAnimaInconscient, etc. afegeix-los aquí
	) {
		const taulaDades = this.elements.taulaDades;

		// Funció auxiliar per obtenir el valor a mostrar a la taulaDades
		// Sempre redueix el número si no és un guió.
		const obtenirValorTaulaDades = (valor) => {
			if (valor === '-' || valor === 0 || valor === undefined || isNaN(valor)) {
				return '-';
			}
			// Si és un número, el reduïm a un sol dígit
			// Utilitzem la instància de la calculadora passada com a argument
			return reduirNumeroSimple(valor);
		};
		
		// Fila 2 (índex 1): habitants
		// 1. Selecciona totes les cel·les amb la classe 'habitants-cell'
		const habitantsCells = document.querySelectorAll('.habitants-cell'); 
		
		// 2. Recorre l'array de comptadors d'Habitants
		// i assigna el valor reduït a la cel·la corresponent.
		// L'índex 'i' correspondrà a la posició (0-8) de l'array 'habitants'
		// i també a la cel·la (0-8) dins del NodeList 'habitantsCells'.
		for (let i = 0; i < habitants.length; i++) {
			const valorOriginal = habitants[i]; // Aquest és el comptador (e.g., 10, 12)
			const valorReduit = this.obtenirValorTaulaDades(valorOriginal); // Aquí el reduïm
			
			// Assegura't que hi ha una cel·la corresponent en la llista seleccionada
			if (habitantsCells[i]) {
				habitantsCells[i].textContent = valorReduit;
			} else {
				console.warn(`No s'ha trobat una cel·la 'habitants-cell' per a l'índex ${i}. La taula HTML pot no tenir 9 cel·les per Habitants.`);
			}
		}

		// Fila 3 (índex 2): Inducció 1r nivell
		for (let i = 0; i < 9; i++) {
			const valor = induccionsCalculades.nivell1[i];
			taulaDades.rows[2].cells[i + 1].textContent = this.obtenirValorTaulaDades(valor);
		}

		// Fila 4 (índex 3): Inducció 2n nivell
		for (let i = 0; i < 9; i++) {
			const valor = induccionsCalculades.nivell2[i];
			taulaDades.rows[3].cells[i + 1].textContent = this.obtenirValorTaulaDades(valor);
		}

		// Fila 5 (índex 4): Inducció 3r nivell
		for (let i = 0; i < 9; i++) {
			const valor = induccionsCalculades.nivell3[i];
			taulaDades.rows[4].cells[i + 1].textContent = this.obtenirValorTaulaDades(valor);
		}

		// Fila 6 (índex 5): Ponts
		for (let i = 0; i < 9; i++) {
			const valorCalculatDelPont = ponts[i]; // Aquest és el valor calculat per calculadora.calcularPonts()
			const valorCasa = i + 1; // La casa és el número 1-9 (l'índex + 1)

			// Si el valor del pont és 0, mostra el número de la Casa (valorCasa),
			// si no, mostra el valor del pont (reduït si cal, amb obtenirValorTaulaDades).
			if (valorCalculatDelPont === 0) {
				taulaDades.rows[5].cells[i + 1].textContent = String(valorCasa);
			} else {
				taulaDades.rows[5].cells[i + 1].textContent = reduirNumeroSimple(valorCalculatDelPont);
			}
		}
		
		// Fila 7 (índex 6): Proposta Evolució
		for (let i = 0; i < 9; i++) {
			const valor = propostaEvolucio[i];
			taulaDades.rows[6].cells[i + 1].textContent = this.obtenirValorTaulaDades(valor);
		}

		// Fila 8 (índex 7): Inconscient
		for (let i = 0; i < 9; i++) {
			const valor = inconscient[i]; // Aquest valor potser ja ha de ser reduït de la Calculadora
			taulaDades.rows[7].cells[i + 1].textContent = this.obtenirValorTaulaDades(valor);
		}

		// Fila 9 (índex 8): Inducció 1r nivell Inconscient
		for (let i = 0; i < 9; i++) {
			const valor = induccionsInconscientsCalculades.nivell1[i];
			taulaDades.rows[8].cells[i + 1].textContent = this.obtenirValorTaulaDades(valor);
		}

		// Fila 10 (índex 9): Inducció 2n nivell Inconscient
		for (let i = 0; i < 9; i++) {
			const valor = induccionsInconscientsCalculades.nivell2[i];
			taulaDades.rows[9].cells[i + 1].textContent = this.obtenirValorTaulaDades(valor);
		}

		// Fila 11 (índex 10): Inducció 3r nivell Inconscient
		for (let i = 0; i < 9; i++) {
			const valor = induccionsInconscientsCalculades.nivell3[i];
			taulaDades.rows[10].cells[i + 1].textContent = this.obtenirValorTaulaDades(valor);
		}

		// Si tens les altres 4 files (Relació Anima-Inconscient, etc.) a l'HTML,
		// descomenta i omple aquestes línies, aplicant també la funció obtenirValorTaulaDades.
		/*
		const calculadora = new CalculadoraNumerologia(
			this.elements.nomInput.value.trim(),
			this.elements.diaInput.value,
			this.elements.mesInput.value,
			this.elements.anyInput.value
		);

		// Aquests càlculs ja estan dissenyats per retornar X/Y o directament el reduït.
		// Si vols que només es mostri el reduït final, aplica obtenirValorTaulaDades.
		const relacioAnimaInconscient = calculadora.calcularRelacio(calculadora.calcularAnima(), calculadora.calcularInconscient([]));
		const relacioInconscientExpressio = calculadora.calcularRelacio(calculadora.calcularInconscient([]), calculadora.calcularExpressio());
		const relacioAnimaExpressio = calculadora.calcularRelacio(calculadora.calcularAnima(), calculadora.calcularExpressio());
		const objectiuVida = calculadora.calcularObjectiuVida();
		
		// Per aquests, si la funció de calcular ja retorna un número simple,
		// no caldria `obtenirValorTaulaDades` a menys que siguin X/Y.
		// Si la teva calculadora ja els retorna reduïts o '-', n'hi ha prou amb:
		taulaDades.rows[11].cells[1].textContent = relacioAnimaInconscient;
		taulaDades.rows[12].cells[1].textContent = relacioInconscientExpressio;
		taulaDades.rows[13].cells[1].textContent = relacioAnimaExpressio;
		taulaDades.rows[14].cells[1].textContent = objectiuVida;

		// Si tornen X/Y i vols només el final reduït:
		// taulaDades.rows[11].cells[1].textContent = obtenirValorTaulaDades(relacioAnimaInconscient);
		// etc.
		*/
	},
	
	// Funció per generar el PDF
	generarPDF() {
		try {
			// CORRECCIÓ AQUÍ TAMBÉ (per consistència i robustesa):
			this.elements.errorPDF.style.display = 'none'; // Abans era this.elements.errorPDF

			const nom = this.elements.nomInput.value.trim();
			const camivida = document.getElementById("camivida").innerText;
			const anima = document.getElementById("anima").innerText;

			if (camivida === "-" || anima === "-") {
				throw new Error("Si us plau, omple el nom i la data de naixement abans de generar el PDF.");
			}

			const { jsPDF } = window.jspdf;
			const doc = new jsPDF();
			
			doc.text(`Informe Numerològic - ${nom || "Anònim"}`, 15, 15);
			
			// Preparar dades de la primera taula
			const rowsMainTable = [
				["Tipus", "Valor", "Significat"],
				["Número Camí de Vida", camivida, "Propòsit existencial"],
				["Número d'Ànima o impuls espiritual", anima, "Essència del nostre Ser profund"],
				["Número de la Personalitat", document.getElementById("personalitat").innerText, "Aspectes a desenvolupar per ajudar l'ànima"],
				["Número de l'Expressió", document.getElementById("expressio").innerText, "Revela el nostre comportament exterior en la vida"],
				["Número de la Missió Còsmica", document.getElementById("missiocosmica").innerText, "Representa el propòsit de la nostra vida en el nostre procés evolutiu"],
				["Número de Força", document.getElementById("força").innerText, "Representa els dons que tenim que podem usar com a comodíns o acceleradors de la vida"],
				["Número d'Equilibri", document.getElementById("equilibri").innerText, "Representa les eines que hem de desenvolupar per adquirir l'equilibri a la nostra vida"],
				["Número d'Iniciació Espiritual", document.getElementById("iniespiritual").innerText, "Ens proposa un camí espiritual que ens ajudarà a complir els nostres objectius en aquesta vida"],
			];

			doc.autoTable({
				startY: 25,
				head: [rowsMainTable[0]],
				body: rowsMainTable.slice(1),
				styles: { fontSize: 10 }
			});

			// Preparar dades de la segona taula (taulaDades)
			const taulaDadesHTML = this.elements.taulaDades;
			const dadesTaulaSecundaria = Array.from(taulaDadesHTML.rows).map(row => 
				Array.from(row.cells).map(cell => cell.textContent.trim() || "0")
			);

			doc.autoTable({
				startY: doc.lastAutoTable.finalY + 15, // Posiciona sota la primera taula
				head: [dadesTaulaSecundaria[0]], // Cases
				body: dadesTaulaSecundaria.slice(1), // Habitants + files addicionals
				styles: {
					fontSize: 9,
					halign: "center",
					cellPadding: 2,
					valign: "middle"
				},
				columnStyles: {
					0: { fontStyle: "bold", cellWidth: 22 } // Columna d'etiquetes
				},
				headStyles: {
					fillColor: [106, 27, 154], // Morat
					textColor: 255
				},
				didDrawCell: (data) => {
					const colors = {
						5: [6, 69, 173],    // Proposta Evolució (blau)
						6: [34, 139, 34],    // Inconscient (verd)
						7: [139, 0, 139],    // Ind. 1r nivell (violeta)
						8: [139, 0, 139],    // Ind. 2n nivell 
						9: [139, 0, 139]     // Ind. 3r nivell
					};
					
					// Ajustar l'índex de la fila per als colors, ja que l'índex de `data.row.index` és respecte a la `body` de la taula.
					// La fila "Proposta Evolució" al HTML és la 7a, però a `dadesTaulaSecundaria.slice(1)` seria la 5a (índex 4).
					// A `autoTable` l'índex comença des de 0 per a la primera fila del `body`.
					// Les nostres files especials comencen a l'índex 4 (Proposta Evolució) de les dades (dadesTaulaSecundaria.slice(1)).
					// Ajustem l'índex de data.row.index sumant un offset.
					// Fila "Habitants" és index 0 a `body`
					// Fila "1r nivell (inducció original)" és index 1 a `body`
					// ...
					// Fila "Proposta Evolució" és index 4 a `body` (era index 5 al teu codi original, però ara és +2 per la nova estructura de `actualitzarTaulaDades`)
					// Fila "Inconscient" és index 5 a `body`
					// Fila "Ind. 1r nivell" és index 6 a `body`
					// Així que si vols aplicar els colors a les mateixes files que abans, hauries de reajustar els índexs de `colors`.
					// Per simplicitat, usarem els índexs directes de la `body` de la taula generada.
					// Si 'Proposta Evolució' és la 5a fila del BODY (índex 4), etc.

					// Reajust dels índexs de `colors` per correspondre a les files del `body` passat a `autoTable`
					// Habitants: Index 0
					// Inducció 1r nivell: Index 1
					// Inducció 2n nivell: Index 2
					// Inducció 3r nivell: Index 3
					// Ponts: Index 4
					// Proposta Evolució: Index 5
					// Inconscient: Index 6
					// Ind. 1r nivell (inconscient): Index 7
					// Ind. 2n nivell (inconscient): Index 8
					// Ind. 3r nivell (inconscient): Index 9
					const adjustedColors = {
						5: [6, 69, 173],    // Proposta Evolució (blau)
						6: [34, 139, 34],    // Inconscient (verd)
						7: [139, 0, 139],    // Ind. 1r nivell (inconscient)
						8: [139, 0, 139],    // Ind. 2n nivell (inconscient)
						9: [139, 0, 139]     // Ind. 3r nivell (inconscient)
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
			doc.text("* Les files d'Inducció es calculen a partir de l'Inconscient", 15, doc.lastAutoTable.finalY + 10);
			
			doc.save(`Informe Numerològic - ${(nom || "Anonim").substring(0, 10)}.pdf`);
		} catch (error) {
			console.error("Error al generar PDF:", error);
			this.elements.errorPDF.textContent = error.message;
			this.elements.errorPDF.style.display = 'block';
		}
	}
};

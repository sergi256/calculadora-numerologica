// numerologiaCalculadora.js

// Funció global reduirNumeroSimple
function reduirNumeroSimple(num) {
	num = parseInt(num);
	if (isNaN(num)) {
		return '-'; // Retorna guió si no és un número vàlid
	}
	while (num > 9) {
		num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
	}
	return num;
}

// Posa 'true' per mostrar el bàner de proves, 'false' per amagar-lo.
const MOSTRAR_NOU_DISCLAIMER_PROVES = true; // <-- NOU NOM I CONTROL NOMÉS PER AQUEST

// --- Lògica per gestionar el bàner ---
document.addEventListener('DOMContentLoaded', () => {
	// Seleccionem el nou bàner específicament per la seva ID
	const nouDisclaimerBanner = document.getElementById('nou-disclaimer-proves');

	if (nouDisclaimerBanner) { // Assegura't que l'element existeix
		if (MOSTRAR_NOU_DISCLAIMER_PROVES) {
			nouDisclaimerBanner.classList.remove('is-hidden'); // Si true, treu la classe per mostrar-lo
		} else {
			nouDisclaimerBanner.classList.add('is-hidden');    // Si false, afegeix la classe per amagar-lo
		}
	}
});

// Constants per als valors numerològics
const VALORS_LLETRES_NUMEROLOGIA = {
	A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
	J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
	S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

const VALORS_VOCALS_ANIMA = { A: 1, E: 5, I: 9, O: 6, U: 3 };
const NUMEROS_MESTRES = [11, 22, 33];


// --- Lògica de Càlcul de Numerologia ---
export class CalculadoraNumerologia {
    constructor(nomComplet, dia, mes, any) {
        // Assegurem que 'nomComplet' sigui sempre una cadena abans d'aplicar qualsevol mètode.
        // Si 'nomComplet' és null, undefined o qualsevol valor "falsy", es convertirà en una cadena buida.
        // Amb String() ens assegurem que el tipus de dada sigui estrictament una string abans del || ''.
        const nomProcesar = String(nomComplet || ''); 

        // Ara, apliquem les transformacions a 'nomProcesar', que sabem que és una cadena.
        this.nomComplet = nomProcesar
            .normalize("NFD") // 1. Descompon els caràcters accentuats (p. ex., 'á' en 'a' + '´')
            .replace(/[\u0300-\u036f]/g, "") // 2. Elimina els accents i altres diacrítics (Aquesta és la teva línia 52)
            .toUpperCase() // 3. Converteix a majúscules (ja ho feies)
            .trim(); // 4. Elimina espais en blanc (ja ho feies)

        this.diaNaixement = parseInt(dia) || 0;
        this.mesNaixement = parseInt(mes) || 0;
        this.anyNaixement = parseInt(any) || 0;
    }
	
	// Funció genèrica per reduir un número a un sol dígit o número mestre
	reduirNumero(num) {
		while (num > 9 && !NUMEROS_MESTRES.includes(num)) {
			num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
		}
		return num;
	}

	// Funció per sumar valors de lletres d'una cadena
	sumarValorsLletres(cadena, valorsMap) {
		let suma = 0;
		for (const lletra of cadena.toUpperCase()) {
			suma += valorsMap[lletra] || 0;
		}
		return suma;
	}
	
	// Calcula el Camí de Vida
	// (càlcul: la suma del dia, el mes i l'any)
	calcularCamiVida() {
		// IMPORTANT: Verifiquem si les dades són vàlides (no undefined/NaN/0)
		if (!this.diaNaixement || !this.mesNaixement || !this.anyNaixement ||
			isNaN(this.diaNaixement) || isNaN(this.mesNaixement) || isNaN(this.anyNaixement)) {
			return "-";
		}
		const suma = this.diaNaixement + this.mesNaixement + this.anyNaixement;
		const reduit = this.reduirNumero(suma);
		return suma > 78 ? String(reduit) : `${suma}/${reduit}`;
	}

	// Calcula el Número d'Ànima 
	// (càlcul: la suma del valor de totes les vocals)
	calcularAnima() {
		if (!this.nomComplet || this.nomComplet.length < 2) return "-"; // Si no hi ha nom, retornem '-'
		const vocals = this.nomComplet.match(/[AEIOUÁÉÍÓÚÀÈÌÒÙÄËÏÖÜ]/gi) || [];
		const total = this.sumarValorsLletres(vocals.join(''), VALORS_VOCALS_ANIMA);
		// Si el total és 0 (per exemple, nom sense vocals o massa curt), també retornem '-'
		if (total === 0 && this.nomComplet.length < 2) return "-"; 
		const reduit = NUMEROS_MESTRES.includes(total) ? total : this.reduirNumero(total);
		return total > 78 ? String(reduit) : `${total}/${reduit}`;
	}

	// Calcula el Número de la Personalitat
	// (càlcul: la suma del valor de totes les consonants)
	calcularPersonalitat() {
		if (!this.nomComplet || this.nomComplet.length < 2) return "-"; // Si no hi ha nom, retornem '-'
		const consonants = this.nomComplet.match(/[BCDFGHJKLMNPQRSTVWXYZÇ]/gi) || [];
		const total = this.sumarValorsLletres(consonants.join(''), VALORS_LLETRES_NUMEROLOGIA);
		 // Si el total és 0 (per exemple, nom sense consonants o massa curt), també retornem '-'
		if (total === 0 && this.nomComplet.length < 2) return "-";
		const reduit = this.reduirNumero(total);
		return total > 78 ? String(reduit) : `${total}/${reduit}`;
	}
	
	// Funció auxiliar per obtenir el valor numèric sense reduir d'un resultat "X/Y"
	_obtenirTotalSenseReduir(resultatCalcul) {
		// Aquesta funció ha de gestionar el guió si el càlcul previ ha retornat '-'
		if (resultatCalcul === "-") return 0; // O algun valor que no afecti sumes posteriors
		const parts = String(resultatCalcul).split('/');
		return parseInt(parts[0]);
	}

	// Calcula el Número de l'Expressió
	// (càlcul: la suma del número de l'Ànima i el de la Personalitat)
	calcularExpressio() {
		if (!this.nomComplet || this.nomComplet.length < 2) return "-";
		// Calculem els totals crus (sense reduir) de Anima i Personalitat
		const totalAnima = this._obtenirTotalSenseReduir(this.calcularAnima());
		const totalPersonalitat = this._obtenirTotalSenseReduir(this.calcularPersonalitat());
		
		// Si alguna de les parts és 0 (indicant que no hi havia nom o no es podia calcular),
		// i el nom no és prou llarg, o si ambdós són 0, retornem '-'
		if ((totalAnima === 0 && totalPersonalitat === 0) || this.nomComplet.length < 2) return "-";
		
		const sumaTotal = totalAnima + totalPersonalitat;
		const reduit = this.reduirNumero(sumaTotal);
		return sumaTotal > 78 ? String(reduit) : `${sumaTotal}/${reduit}`;
	}

	// Calcula la Missió Còsmica
	// (càlcul: la suma del número del Camí de Vida i el d'Expressió)
	calcularMissioCosmica() {
		if (!this.diaNaixement || !this.mesNaixement || !this.anyNaixement || !this.nomComplet || this.nomComplet.length < 2) return "-";
		
		const totalCamiVida = this._obtenirTotalSenseReduir(this.calcularCamiVida());
		const totalExpressio = this._obtenirTotalSenseReduir(this.calcularExpressio());

		if (totalCamiVida === 0 || totalExpressio === 0) return "-"; // Si alguna part és invàlida, retornem '-'

		const sumaTotal = totalCamiVida + totalExpressio;
		const reduit = this.reduirNumero(sumaTotal);
		return sumaTotal > 78 ? String(reduit) : `${sumaTotal}/${reduit}`;
	}

	// Calcula el Número de Força
	// (càlcul: es suma el dia i el mes de naixement)
	calcularForca() {
		if (!this.diaNaixement || !this.mesNaixement || isNaN(this.diaNaixement) || isNaN(this.mesNaixement)) return "-";
		const suma = this.diaNaixement + this.mesNaixement;
		const reduit = this.reduirNumero(suma);
		return suma > 78 ? String(reduit) : `${suma}/${reduit}`;
	}

	// Calcula el Número d'Equilibri
	// (càlcul: es sumen els valors de les inicials del nom i els cognoms)
	calcularEquilibri() {
		if (!this.nomComplet || this.nomComplet.length < 2) return "-";
		const inicials = this.nomComplet.split(' ')
			.filter(paraula => paraula.length > 0)
			.map(paraula => paraula[0]);
		// Si no hi ha inicials vàlides (ex: nom molt curt), retornem '-'
		if (inicials.length === 0) return "-";
		const suma = this.sumarValorsLletres(inicials.join(''), VALORS_LLETRES_NUMEROLOGIA);
		const reduit = this.reduirNumero(suma);
		return suma > 78 ? String(reduit) : `${suma}/${reduit}`;
	}

	// Calcula el Número d'Iniciació Espiritual. p211
	// (càlcul: la suma de 3 números, la Missió Cósmica, el dia de Naixement i el número d'Ànima)
	// (es mantenen els números mestres)
	calcularIniciacioEspiritual() {
		if (!this.diaNaixement || !this.mesNaixement || !this.anyNaixement || !this.nomComplet || this.nomComplet.length < 2) return "-";

		const totalMissioCosmica = this._obtenirTotalSenseReduir(this.calcularMissioCosmica());
		const totalAnima = this._obtenirTotalSenseReduir(this.calcularAnima());

		if (totalMissioCosmica === 0 || totalAnima === 0) return "-";

		const sumaTotal = this.diaNaixement + totalMissioCosmica + totalAnima;
		const reduit = this.reduirNumero(sumaTotal);
		return sumaTotal > 78 ? String(reduit) : `${sumaTotal}/${reduit}`;
	}

	/* Funcions que calculen les files de la TaulaDades */
	
	// Calcula els Habitants (quantes lletres hi ha de cada valor 1-9)
	calcularHabitants() {
		if (!this.nomComplet || this.nomComplet.length === 0) {
			return new Array(9).fill(0); // Retorna un array de 9 zeros si el nom és invàlid
		}
		
		const comptadors = Array(9).fill(0); // [0,0,0,0,0,0,0,0,0]
	    const nomSenseEspais = this.nomComplet.replace(/\s/g, ''); // Elimina tots els espais
		
		[...this.nomComplet].forEach(lletra => {
			if (VALORS_LLETRES_NUMEROLOGIA.hasOwnProperty(lletra)) {
				const num = VALORS_LLETRES_NUMEROLOGIA[lletra];
				comptadors[num - 1]++;
			}
		});
		return comptadors;
	}


	// Calcula els 3 nivells d'Inducció
	calcularInduccio(habitants) {
		if (!Array.isArray(habitants) || habitants.every(h => h === 0)) {
			return {
				nivell1: new Array(9).fill(0),
				nivell2: new Array(9).fill(0),
				nivell3: new Array(9).fill(0)
			};
		}

		// valorsCases ja no és estrictament necessari aquí perquè fem el mapatge a l'índex directament
		// const valorsCases = this.valorsCases; 

		const nivell1 = [];
		for (let i = 0; i < 9; i++) {
			const valorHabitantsDeLaCasaActual = habitants[i]; // Aquest és el teu 'X' (pot ser > 9)

			if (valorHabitantsDeLaCasaActual > 0) { // Només si hi ha habitants en aquesta casa
				// REDUÏM EL VALOR DELS HABITANTS DE LA CASA ACTUAL ABANS D'UTILITZAR-LO PER APUNTAR A LA CASA INDUCTORA
				const valorXReduit = reduirNumeroSimple(valorHabitantsDeLaCasaActual);

				// Ara, utilitzem el valor reduït per trobar la casa que indueix
				// (valorXReduit - 1) és l'índex a l'array 'habitants'
				const habitantDeLaCasaQueIndueix = habitants[valorXReduit - 1];
				
				// Afegim el valor trobat. Si l'índex apuntat no existeix (cosa que no hauria de passar ara amb la reducció),
				// o si el valor és undefined (per exemple, si habitants[valorXReduit - 1] no existeix), afegim 0.
				nivell1.push(habitantDeLaCasaQueIndueix !== undefined ? habitantDeLaCasaQueIndueix : 0);
				
				// console.log(`Casa ${i+1}: Habitant=${valorHabitantsDeLaCasaActual}. ValorXReduit=${valorXReduit}. Buscant habitant de Casa ${valorXReduit}. Trobat: ${habitantDeLaCasaQueIndueix}. Nivell 1: ${nivell1[i]}`); // DEBUG
			} else {
				// Si l'habitant de la casa actual és 0, la inducció és 0
				nivell1.push(0);
			}
		}
		// console.log('calcularInduccio: Nivell 1 calculat:', nivell1); // DEBUG

		const nivell2 = [];
		for (let i = 0; i < 9; i++) {
			const valorNivell1Actual = nivell1[i]; // Aquest és el valor que s'indueix

			if (valorNivell1Actual > 0) {
				// REDUÏM EL VALOR DEL NIVELL 1 ABANS D'UTILITZAR-LO PER APUNTAR
				const valorXReduit = reduirNumeroSimple(valorNivell1Actual);
				const habitantDeLaCasaQueIndueix = habitants[valorXReduit - 1];
				nivell2.push(habitantDeLaCasaQueIndueix !== undefined ? habitantDeLaCasaQueIndueix : 0);
			} else {
				nivell2.push(0);
			}
		}
		// console.log('calcularInduccio: Nivell 2 calculat:', nivell2); // DEBUG

		const nivell3 = [];
		for (let i = 0; i < 9; i++) {
			const valorNivell2Actual = nivell2[i];

			if (valorNivell2Actual > 0) {
				// REDUÏM EL VALOR DEL NIVELL 2 ABANS D'UTILITZAR-LO PER APUNTAR
				const valorXReduit = reduirNumeroSimple(valorNivell2Actual);
				const habitantDeLaCasaQueIndueix = habitants[valorXReduit - 1];
				nivell3.push(habitantDeLaCasaQueIndueix !== undefined ? habitantDeLaCasaQueIndueix : 0);
			} else {
				nivell3.push(0);
			}
		}
		// console.log('calcularInduccio: Nivell 3 calculat:', nivell3); // DEBUG

		return { nivell1, nivell2, nivell3 };
	}
	
	// Calcula els Ponts iniciàtics p.232
	// (càlcul: la diferència entre la casa i l'habitant de la casa)
	// (s'usen la totalitat dels habitants sense reduïr)
	// (en cas de número kàrmic el pont correspon a la casa on es troba) 
	calcularPonts(habitants) {
		if (!Array.isArray(habitants) || habitants.every(h => h === 0)) {
			return new Array(9).fill(0);
		}
		const ponts = [];
		for (let casa = 0; casa < 9; casa++) {
			const valorCasa = casa + 1; // La casa és el número 1-9
			const valorHabitants = habitants[casa];
			ponts.push(Math.abs(valorCasa - valorHabitants));
		}
		return ponts;
	}

	// Calcula la Proposta d'Evolució
	// (Càlcul: comencem per la casa 1 i busquem *quantes* cases tenen habitants igual a 1. Aquesta quantitat la sumem al valor de l'habitant de la casa 1 i tenim el valor de l'evolució per la casa 1.).
	calcularPropostaEvolucio(habitants) {
		if (!Array.isArray(habitants) || habitants.every(h => h === 0)) {
			return new Array(9).fill(0);
		}

		const propostaEvolucio = [];

		// Pre-calcular les freqüències de cada número (1-9) en l'array d'habitants.
		// Això ens permetrà consultar-les ràpidament.
		const comptadorValors = {};
		for (let i = 1; i <= 9; i++) { // Iterem pels valors de l'1 al 9
			// Comptem quantes vegades apareix el número 'i' com a habitant
			// de QUALSEVOL casa (després de reduir-lo si és necessari).
			const freq = habitants.filter(h => reduirNumeroSimple(h) === i).length;
			comptadorValors[i] = freq;
		}

		// Ara, apliquem la lògica per a cada casa (de l'1 al 9)
		for (let i = 0; i < 9; i++) {
			const valorHabitantActual = habitants[i]; // El valor de l'habitant d'aquesta casa (p. ex., 8 per a Casa 1)
			const valorHabitantReduit = reduirNumeroSimple(valorHabitantActual);

			let quantitatACometar;

			// Si l'habitant actual no es pot reduir a un número vàlid (e.g., és '-'),
			// o si el valor reduït no existeix en el comptador (per exemple, si reduirNumeroSimple retorna un mestre
			// que no es gestiona en el comptador 1-9), tractem-ho.
			if (valorHabitantReduit === '-' || !comptadorValors.hasOwnProperty(valorHabitantReduit)) {
				 quantitatACometar = 0; // O el que sigui la teva regla per a valors no numèrics
			} else {
				// Aquesta és la quantitat de cases que tenen un habitant amb valor igual a la CASA ACTUAL (i+1)
				// No és la freqüència del 'valorHabitantReduit' en sí, sinó la freqüència del número de la casa.
				// Segons la teva última explicació: "si estem a la Casa 1, comptem quantes cases tenen un 1 com a habitant".
				// Això vol dir que la "quantitat" que se suma és la freqüència del NÚMERO DE LA CASA (i+1).
				const numeroDeLaCasa = i + 1;
				quantitatACometar = comptadorValors[numeroDeLaCasa] || 0;
			}

			// El resultat és el valor de l'habitant de la casa actual (reduït) + la quantitat calculada
			let sumaTotal = valorHabitantReduit + quantitatACometar;
			
			propostaEvolucio.push(sumaTotal);
		}
		return propostaEvolucio;
	}	
	
	// Calcula l'Inconscient
	// (càlcul: per cada casa mirem quin és el valor del seu habitant (X) i el resultat de l'inconscient d'aquella casa és el valor de la lletra del seu nom que es troba en la posició X, descartant els espais)
	calcularInconscient(habitants) {
		if (!Array.isArray(habitants) || habitants.every(h => h === 0)) {
			return new Array(9).fill(0); // Retorna un array de zeros si no hi ha dades
		}

		// El nom sense espais i ja processat (majúscules, accents eliminats)
		const nomSenseEspais = this.nomComplet.replace(/\s/g, '');

		const inconscientResultat = [];

		for (let i = 0; i < 9; i++) { // Iterem per cada una de les 9 cases
			const valorHabitantX = habitants[i]; // El valor de l'habitant de la casa actual (p. ex., 8)

			// Validació: si el valor de l'habitant no és un número vàlid, és zero, o excedeix la longitud del nom,
			// retornem 0 per a aquesta posició.
			if (isNaN(valorHabitantX) || valorHabitantX <= 0 || valorHabitantX > nomSenseEspais.length) {
				inconscientResultat.push(0);
				continue;
			}

			// La posició de la lletra en el nom (ajustant per índex base 0)
			// Si l'habitant és 8, l'índex és 7.
			const indexLletra = valorHabitantX - 1;

			// Obtenim la lletra en aquesta posició
			const lletra = nomSenseEspais[indexLletra];

			// Obtenim el valor numerològic de la lletra
			// Si la lletra no es troba en VALORS_LLETRES_NUMEROLOGIA, el valor és 0
			const valorLletra = VALORS_LLETRES_NUMEROLOGIA[lletra] || 0;

			inconscientResultat.push(valorLletra);
		}
		return inconscientResultat;
	}
	
	// Calcula la Inducció de l'Inconscient
	calcularInduccioInconscient(inconscient) {
		if (!Array.isArray(inconscient) || inconscient.every(i => i === 0)) {
			return {
				nivell1: new Array(9).fill(0),
				nivell2: new Array(9).fill(0),
				nivell3: new Array(9).fill(0)
			};
		}

		const nivell1 = [];
		for (let i = 0; i < 9; i++) {
			const valorInconscientActual = inconscient[i]; // El valor 'X' és l'habitant de la casa actual
			if (valorInconscientActual > 0) {
				const valorXReduit = reduirNumeroSimple(valorInconscientActual);
				// APUNTA A L'ARRAY ORIGINAL 'inconscient' per trobar la casa que indueix
				const inconscientDeLaCasaQueIndueix = inconscient[valorXReduit - 1];
				nivell1.push(inconscientDeLaCasaQueIndueix !== undefined ? inconscientDeLaCasaQueIndueix : 0);
			} else {
				nivell1.push(0);
			}
		}

		const nivell2 = [];
		for (let i = 0; i < 9; i++) {
			const valorNivell1Actual = nivell1[i];
			if (valorNivell1Actual > 0) {
				const valorXReduit = reduirNumeroSimple(valorNivell1Actual);
				// APUNTA A L'ARRAY ORIGINAL 'inconscient'
				const inconscientDeLaCasaQueIndueix = inconscient[valorXReduit - 1];
				nivell2.push(inconscientDeLaCasaQueIndueix !== undefined ? inconscientDeLaCasaQueIndueix : 0);
			} else {
				nivell2.push(0);
			}
		}

		const nivell3 = [];
		for (let i = 0; i < 9; i++) {
			const valorNivell2Actual = nivell2[i];
			if (valorNivell2Actual > 0) {
				const valorXReduit = reduirNumeroSimple(valorNivell2Actual);
				// APUNTA A L'ARRAY ORIGINAL 'inconscient'
				const inconscientDeLaCasaQueIndueix = inconscient[valorXReduit - 1];
				nivell3.push(inconscientDeLaCasaQueIndueix !== undefined ? inconscientDeLaCasaQueIndueix : 0);
			} else {
				nivell3.push(0);
			}
		}

		return { nivell1, nivell2, nivell3 };
	}
}

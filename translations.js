// translations.js

/**
 * Objecte que conté totes les traduccions de la interfície d'usuari
 * i els textos utilitzats per generar el PDF, organitzats per idioma.
 *
 * Cada clau de primer nivell és un codi d'idioma (e.g., 'ca', 'es').
 * Dins de cada idioma, les claus corresponen a les IDs dels elements HTML
 * o a claus lògiques per a textos dinàmics/missatges.
 */
export const translations = {
    // --- Català (ca) ---
    'ca': {
        'title_main': 'Calculadora Numerològica', // S'usa per el <title> i per a <h1>
        'meta_description': 'Calculadora numerològica per descobrir els teus números personals.',
        'disclaimer-banner_text': 'Aquesta pàgina automatitza el càlcul de les <b>Àrees Clau</b> i de la <b>Inclusió</b> tal com explica <b>Martine Coquatrix</b> en el seu llibre <a href="https://libreriaepsilon.com/catalogo/la-numerologia-a-la-luz-del-arbol-de-la-vida-y-las-letras-hebraicas" target="_blank" rel="noopener noreferrer">La numerología a la luz del árbol de vida y las letras hebraicas</a>. El propòsit és facilitar aquests càlculs a les persones que vulguin endinsar-se en aquest llibre tan interessant.',
        'title_camp_text': 'El teu Nom i els teus quatre Cognoms:',
        'nomInput_placeholder': 'Introdueix el teu nom complet',
        'data_naixement_label': 'Data de Naixement:', // Etiqueta per al camp de data de naixement
        'dia_naixement_placeholder': 'Dia',
        'mes_naixement_placeholder': 'Mes',
        'any_naixement_placeholder': 'Any',
        'pdfButton_text': 'Descarregar com a PDF',
        'contacte_titol': 'Contacta amb mi',
        'contacte_text': 'Si tens qualsevol pregunta o comentari, no dubtis en omplir el següent formulari:',
        'contacte_button': 'Comentari',
        'footer_line1': '© 2025 Sergi Ximenes Catà de la Torra. <a href="https://github.com/sergi256/calculadora-numerologica/" target="_blank" rel="noopener noreferrer">Codi</a> disponible sota <a href="LICENSE" target="_blank" rel="noopener noreferrer">GNU AFFERO GENERAL PUBLIC LICENSE Version 3</a>',
        'footer_line2': 'Totes les imatges d\'aquesta pàgina són de domini públic (sense restriccions de copyright).',

        // Textos del PDF - Secció "Informe Numerològic"
        'informe_titol': 'Informe Numerològic',
        'informe_subtitol_anonim': 'Anònim',
        'taula_capcalera_tipus': 'Tipus',
        'taula_capcalera_valor': 'Valor',
        'taula_capcalera_significat': 'Significat',

        // Textos de les Àrees Clau (taulaAreesClau) - usant les IDs dels elements
        // Aquests són els valors que aniran a la columna "Tipus" de la taula principal del PDF
        'camivida_label': 'Número Camí de Vida',
        'anima_label': 'Número d\'Ànima o impuls espiritual',
        'personalitat_label': 'Número de la Personalitat',
        'expressio_label': 'Número de l\'Expressió',
        'missiocosmica_label': 'Número de la Missió Còsmica',
        'forca_label': 'Número de Força',
        'equilibri_label': 'Número d\'Equilibri',
        'iniespiritual_label': 'Número d\'Iniciació Espiritual',

        // Significats de les Àrees Clau (columna "Significat" del PDF)
        'camivida_significat': 'Propòsit existencial',
        'anima_significat': 'Essència del nostre Ser profund',
        'personalitat_significat': 'Aspectes a desenvolupar per ajudar l\'ànima',
        'expressio_significat': 'Revela el nostre comportament exterior en la vida',
        'missiocosmica_significat': 'Representa el propòsit de la nostra vida en el nostre procés evolutiu',
        'forca_significat': 'Representa els dons que tenim que podem usar com a comodíns o acceleradors de la vida',
        'equilibri_significat': 'Representa les eines que hem de desenvolupar per adquirir l\'equilibri a la nostra vida',
        'iniespiritual_significat': 'Ens proposa un camí espiritual que ens ajudarà a complir els nostres objectius en aquesta vida',

        // Textos de la segona taula (taulaDades) del PDF (les etiquetes de la primera columna)
        // Aquests són els 'th' o 'td' de la primera columna de taulaDades
        'taulaDades_cases': 'Cases', // Si la primera fila té una capçalera
        'taulaDades_habitants': 'Habitants',
        'taulaDades_induccio1': 'Inducció 1.r nivell',
        'taulaDades_induccio2': 'Inducció 2.n nivell',
        'taulaDades_induccio3': 'Inducció 3.r nivell',
        'taulaDades_ponts': 'Ponts',
        'taulaDades_propostaEvolucio': 'Proposta Evolució',
        'taulaDades_inconscient': 'Inconscient',
        'taulaDades_induccioInconscient1': 'Inducció 1.r nivell (Inc.)',
        'taulaDades_induccioInconscient2': 'Inducció 2.n nivell (Inc.)',
        'taulaDades_induccioInconscient3': 'Inducció 3.r nivell (Inc.)',
        // Si tens les altres 4 files al PDF
        // 'taulaDades_relacioAnimaInconscient': 'Relació Ànima-Inconscient',
        // 'taulaDades_relacioInconscientExpressio': 'Relació Inconscient-Expressió',
        // 'taulaDades_relacioAnimaExpressio': 'Relació Ànima-Expressió',
        // 'taulaDades_objectiuVida': 'Objectiu de Vida',


        // Missatges d'error i disclaimers
        'error_pdf_dades_incompletes': 'Si us plau, omple el nom i la data de naixement abans de generar el PDF.',
        'pdf_nota_induccio_inconscient': '* Les files d\'Inducció de l\'Inconscient es calculen a partir de l\'Inconscient',
        'disclaimer_proves': 'Pàgina en proves. Les dades poden no ser definitives.'
    },

    // --- Castellano (es) ---
    'es': {
        'title_main': 'Calculadora Numerológica', // S'usa per al <title> i per a <h1>
        'meta_description': 'Calculadora numerológica para descubrir tus números personales.',        
        'disclaimer-banner_text': 'Esta página automatiza el cálculo de las <b>Áreas Clave</b> y de la <b>Inclusión</b> tal como explica <b>Martine Coquatrix</b> en su libro <a href="https://libreriaepsilon.com/catalogo/la-numerologia-a-la-luz-del-arbol-de-la-vida-y-las-letras-hebraicas" target="_blank" rel="noopener noreferrer">La Numerología a la luz del Árbol de Vida y las Letras Hebraicas</a>. El propósito es facilitar estos cálculos a las personas que quieran adentrarse en este libro tan interesante.',
        'title_camp_text': 'Tu Nombre y tus cuatro Apellidos:',
        'nomInput_placeholder': 'Introduce tu nombre completo',
        'data_naixement_label': 'Fecha de Nacimiento:', // Etiqueta para el campo de fecha de nacimiento
        'dia_naixement_placeholder': 'Día',
        'mes_naixement_placeholder': 'Mes',
        'any_naixement_placeholder': 'Año',
        'pdfButton_text': 'Descargar como PDF',
        'contacte_titol': 'Contacta conmigo',
        'contacte_text': 'Si tienes cualquier pregunta o comentario, no dudes en rellenar el siguiente formulario:',
        'contacte_button': 'Comentario',
        'footer_line1': '© 2025 Sergi Ximenes Catà de la Torra. <a href="https://github.com/sergi256/calculadora-numerologica/" target="_blank" rel="noopener noreferrer">Código</a> disponible bajo <a href="LICENSE" target="_blank" rel="noopener noreferrer">GNU AFFERO GENERAL PUBLIC LICENSE Version 3</a>',
        'footer_line2': 'Todas las imágenes de esta página son de dominio público (sin restricciones de copyright).',



        // Textos del PDF - Sección "Informe Numerológico"
        'informe_titol': 'Informe Numerológico',
        'informe_subtitol_anonim': 'Anónimo',
        'taula_capcalera_tipus': 'Tipo',
        'taula_capcalera_valor': 'Valor',
        'taula_capcalera_significat': 'Significado',

        // Textos de las Áreas Clave (taulaAreesClau) - usando las IDs de los elementos
        'camivida_label': 'Número Camino de Vida',
        'anima_label': 'Número de Alma o impulso espiritual',
        'personalitat_label': 'Número de la Personalidad',
        'expressio_label': 'Número de la Expresión',
        'missiocosmica_label': 'Número de la Misión Cósmica',
        'forca_label': 'Número de Fuerza',
        'equilibri_label': 'Número de Equilibrio',
        'iniespiritual_label': 'Número de Iniciación Espiritual',

        // Significados de las Áreas Clave (columna "Significado" del PDF)
        'camivida_significat': 'Propósito existencial',
        'anima_significat': 'Esencia de nuestro Ser profundo',
        'personalitat_significat': 'Aspectos a desarrollar para ayudar al alma',
        'expressio_significat': 'Revela nuestro comportamiento exterior en la vida',
        'missiocosmica_significat': 'Representa el propósito de nuestra vida en nuestro proceso evolutivo',
        'forca_significat': 'Representa los dones que tenemos que podemos usar como comodines o aceleradores de la vida',
        'equilibri_significat': 'Representa las herramientas que debemos desarrollar para adquirir el equilibrio en nuestra vida',
        'iniespiritual_significat': 'Nos propone un camino espiritual que nos ayudará a cumplir nuestros objetivos en esta vida',

        // Textos de la segunda tabla (taulaDades) del PDF
        'taulaDades_cases': 'Casas',
        'taulaDades_habitants': 'Habitantes',
        'taulaDades_induccio1': 'Inducción 1.º nivel',
        'taulaDades_induccio2': 'Inducción 2.º nivel',
        'taulaDades_induccio3': 'Inducción 3.º nivel',
        'taulaDades_ponts': 'Puentes',
        'taulaDades_propostaEvolucio': 'Propuesta Evolución',
        'taulaDades_inconscient': 'Inconsciente',
        'taulaDades_induccioInconscient1': 'Inducción 1.º nivel (Inc.)',
        'taulaDades_induccioInconscient2': 'Inducción 2.º nivel (Inc.)',
        'taulaDades_induccioInconscient3': 'Inducción 3.º nivel (Inc.)',
        // Si tienes las otras 4 filas en el PDF
        // 'taulaDades_relacioAnimaInconscient': 'Relación Alma-Inconsciente',
        // 'taulaDades_relacioInconscientExpressio': 'Relación Inconsciente-Expresión',
        // 'taulaDades_relacioAnimaExpressio': 'Relación Alma-Expresión',
        // 'taulaDades_objectiuVida': 'Objetivo de Vida',

        // Mensajes de error y disclaimers
        'error_pdf_dades_incompletes': 'Por favor, rellena el nombre y la fecha de nacimiento antes de generar el PDF.',
        'pdf_nota_induccio_inconscient': '* Las filas de Inducción del Inconsciente se calculan a partir del Inconsciente',
        'disclaimer_proves': 'Página en pruebas. Los datos pueden no ser definitivos.'
    }
    // Puedes añadir más idiomas aquí (e.g., 'en' para inglés)
};
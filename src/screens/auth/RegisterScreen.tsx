"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
  Modal,
} from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "src/types"
import { colors } from "src/styles/colors"
import { isValidEmail } from "src/utils/helpers"
import LoginErrorModal from "src/components/modals/LoginErrorModal"
import CustomCheckbox from "src/components/common/CustomCheckbox"
import Ionicons from "react-native-vector-icons/Ionicons"
import TermsConditionsModal from "src/components/modals/TermsConditionsModal"
import PrivacyPolicyModal from "src/components/modals/PrivacyPolicyModal"

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, "Register">

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp
}

interface PasswordRequirement {
  label: string
  isValid: boolean
  regex: RegExp
}

interface LocationItem {
  label: string
  value: string
  normalizedLabel?: string // Añadimos esta propiedad para pre-normalizar
}

const { width, height } = Dimensions.get("window")

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
}

// Datos de departamentos de Colombia con etiquetas normalizadas
const departamentos: LocationItem[] = [
  { label: "Amazonas", value: "amazonas" },
  { label: "Antioquia", value: "antioquia" },
  { label: "Arauca", value: "arauca" },
  { label: "Atlántico", value: "atlantico" },
  { label: "Bolívar", value: "bolivar" },
  { label: "Boyacá", value: "boyaca" },
  { label: "Caldas", value: "caldas" },
  { label: "Caquetá", value: "caqueta" },
  { label: "Casanare", value: "casanare" },
  { label: "Cauca", value: "cauca" },
  { label: "Cesar", value: "cesar" },
  { label: "Chocó", value: "choco" },
  { label: "Córdoba", value: "cordoba" },
  { label: "Cundinamarca", value: "cundinamarca" },
  { label: "Guainía", value: "guainia" },
  { label: "Guaviare", value: "guaviare" },
  { label: "Huila", value: "huila" },
  { label: "La Guajira", value: "la_guajira" },
  { label: "Magdalena", value: "magdalena" },
  { label: "Meta", value: "meta" },
  { label: "Nariño", value: "narino" },
  { label: "Norte de Santander", value: "norte_de_santander" },
  { label: "Putumayo", value: "putumayo" },
  { label: "Quindío", value: "quindio" },
  { label: "Risaralda", value: "risaralda" },
  { label: "San Andrés y Providencia", value: "san_andres_y_providencia" },
  { label: "Santander", value: "santander" },
  { label: "Sucre", value: "sucre" },
  { label: "Tolima", value: "tolima" },
  { label: "Valle del Cauca", value: "valle_del_cauca" },
  { label: "Vaupés", value: "vaupes" },
  { label: "Vichada", value: "vichada" },
  { label: "Bogotá D.C.", value: "bogota_dc" },
].map((item) => ({
  ...item,
  normalizedLabel: normalizeText(item.label),
}))

// Datos de ciudades por departamento con etiquetas normalizadas
const ciudadesPorDepartamento: Record<string, LocationItem[]> = {
  amazonas: [
    { label: "Leticia", value: "leticia" },
    { label: "Puerto Nariño", value: "puerto_narino" },
    { label: "La Chorrera", value: "la_chorrera" },
    { label: "Tarapacá", value: "tarapaca" },
    { label: "El Encanto", value: "el_encanto" },
    { label: "La Pedrera", value: "la_pedrera" },
    { label: "Mirití-Paraná", value: "miriti_parana" },
    { label: "Puerto Alegría", value: "puerto_alegria" },
    { label: "Puerto Arica", value: "puerto_arica" },
    { label: "Puerto Santander", value: "puerto_santander_amazonas" },
  ],
  antioquia: [
    { label: "Medellín", value: "medellin" },
    { label: "Bello", value: "bello" },
    { label: "Envigado", value: "envigado" },
    { label: "Itagüí", value: "itagui" },
    { label: "Rionegro", value: "rionegro" },
    { label: "Apartadó", value: "apartado" },
    { label: "Turbo", value: "turbo" },
    { label: "Caucasia", value: "caucasia" },
    { label: "Sabaneta", value: "sabaneta" },
    { label: "La Estrella", value: "la_estrella" },
    { label: "Caldas", value: "caldas_antioquia" },
    { label: "Copacabana", value: "copacabana" },
    { label: "Girardota", value: "girardota" },
    { label: "Barbosa", value: "barbosa_antioquia" },
    { label: "Santa Fe de Antioquia", value: "santa_fe_de_antioquia" },
    { label: "Puerto Berrío", value: "puerto_berrio" },
    { label: "Andes", value: "andes" },
    { label: "Yarumal", value: "yarumal" },
    { label: "Ciudad Bolívar", value: "ciudad_bolivar" },
    { label: "Marinilla", value: "marinilla" },
    { label: "El Carmen de Viboral", value: "el_carmen_de_viboral" },
    { label: "Guarne", value: "guarne" },
    { label: "La Ceja", value: "la_ceja" },
    { label: "Sonsón", value: "sonson" },
    { label: "Urrao", value: "urrao" },
  ],
  arauca: [
    { label: "Arauca", value: "arauca" },
    { label: "Saravena", value: "saravena" },
    { label: "Tame", value: "tame" },
    { label: "Arauquita", value: "arauquita" },
    { label: "Fortul", value: "fortul" },
    { label: "Puerto Rondón", value: "puerto_rondon" },
    { label: "Cravo Norte", value: "cravo_norte" },
  ],
  atlantico: [
    { label: "Barranquilla", value: "barranquilla" },
    { label: "Soledad", value: "soledad" },
    { label: "Malambo", value: "malambo" },
    { label: "Sabanalarga", value: "sabanalarga" },
    { label: "Galapa", value: "galapa" },
    { label: "Puerto Colombia", value: "puerto_colombia" },
    { label: "Baranoa", value: "baranoa" },
    { label: "Santo Tomás", value: "santo_tomas" },
    { label: "Palmar de Varela", value: "palmar_de_varela" },
    { label: "Sabanagrande", value: "sabanagrande" },
    { label: "Luruaco", value: "luruaco" },
    { label: "Manatí", value: "manati" },
    { label: "Candelaria", value: "candelaria_atlantico" },
    { label: "Campo de la Cruz", value: "campo_de_la_cruz" },
    { label: "Juan de Acosta", value: "juan_de_acosta" },
    { label: "Polonuevo", value: "polonuevo" },
    { label: "Repelón", value: "repelon" },
    { label: "Suán", value: "suan" },
    { label: "Tubará", value: "tubara" },
    { label: "Usiacurí", value: "usiacuri" },
    { label: "Piojó", value: "piojo" },
    { label: "Santa Lucía", value: "santa_lucia" },
  ],
  bogota_dc: [{ label: "Bogotá", value: "bogota" }],
  bolivar: [
    { label: "Cartagena", value: "cartagena" },
    { label: "Magangué", value: "magangue" },
    { label: "Turbaco", value: "turbaco" },
    { label: "Arjona", value: "arjona" },
    { label: "El Carmen de Bolívar", value: "el_carmen_de_bolivar" },
    { label: "San Juan Nepomuceno", value: "san_juan_nepomuceno" },
    { label: "María La Baja", value: "maria_la_baja" },
    { label: "Santa Rosa del Sur", value: "santa_rosa_del_sur" },
    { label: "Mompós", value: "mompos" },
    { label: "San Pablo", value: "san_pablo" },
    { label: "Achí", value: "achi" },
    { label: "Pinillos", value: "pinillos" },
    { label: "San Jacinto", value: "san_jacinto" },
    { label: "Simití", value: "simiti" },
    { label: "Córdoba", value: "cordoba_bolivar" },
    { label: "Mahates", value: "mahates" },
    { label: "San Estanislao", value: "san_estanislao" },
    { label: "Calamar", value: "calamar_bolivar" },
    { label: "Villanueva", value: "villanueva_bolivar" },
    { label: "Cantagallo", value: "cantagallo" },
    { label: "Clemencia", value: "clemencia" },
    { label: "San Cristóbal", value: "san_cristobal_bolivar" },
    { label: "Santa Catalina", value: "santa_catalina" },
    { label: "Soplaviento", value: "soplaviento" },
    { label: "Tiquisio", value: "tiquisio" },
  ],
  boyaca: [
    { label: "Tunja", value: "tunja" },
    { label: "Duitama", value: "duitama" },
    { label: "Sogamoso", value: "sogamoso" },
    { label: "Chiquinquirá", value: "chiquinquira" },
    { label: "Paipa", value: "paipa" },
    { label: "Moniquirá", value: "moniquira" },
    { label: "Puerto Boyacá", value: "puerto_boyaca" },
    { label: "Villa de Leyva", value: "villa_de_leyva" },
    { label: "Garagoa", value: "garagoa" },
    { label: "Samacá", value: "samaca" },
    { label: "Nobsa", value: "nobsa" },
    { label: "Soatá", value: "soata" },
    { label: "Tibasosa", value: "tibasosa" },
    { label: "Ventaquemada", value: "ventaquemada" },
    { label: "Belén", value: "belen_boyaca" },
    { label: "Guateque", value: "guateque" },
    { label: "Miraflores", value: "miraflores_boyaca" },
    { label: "Ramiriquí", value: "ramiriqui" },
    { label: "Socha", value: "socha" },
    { label: "Tuta", value: "tuta" },
    { label: "Aquitania", value: "aquitania" },
    { label: "Chiscas", value: "chiscas" },
    { label: "Muzo", value: "muzo" },
    { label: "Toca", value: "toca" },
    { label: "Zetaquira", value: "zetaquira" },
  ],
  caldas: [
    { label: "Manizales", value: "manizales" },
    { label: "Chinchiná", value: "chinchina" },
    { label: "La Dorada", value: "la_dorada" },
    { label: "Villamaría", value: "villamaria" },
    { label: "Anserma", value: "anserma" },
    { label: "Riosucio", value: "riosucio" },
    { label: "Supía", value: "supia" },
    { label: "Aguadas", value: "aguadas" },
    { label: "Manzanares", value: "manzanares" },
    { label: "Neira", value: "neira" },
    { label: "Palestina", value: "palestina_caldas" },
    { label: "Pensilvania", value: "pensilvania" },
    { label: "Salamina", value: "salamina" },
    { label: "Samaná", value: "samana" },
    { label: "Viterbo", value: "viterbo" },
    { label: "Aranzazu", value: "aranzazu" },
    { label: "Belalcázar", value: "belalcazar" },
    { label: "Filadelfia", value: "filadelfia" },
    { label: "La Merced", value: "la_merced" },
    { label: "Marmato", value: "marmato" },
    { label: "Marquetalia", value: "marquetalia" },
    { label: "Marulanda", value: "marulanda" },
    { label: "Pácora", value: "pacora" },
    { label: "Risaralda", value: "risaralda_caldas" },
    { label: "San José", value: "san_jose_caldas" },
    { label: "Victoria", value: "victoria" },
  ],
  caqueta: [
    { label: "Florencia", value: "florencia" },
    { label: "San Vicente del Caguán", value: "san_vicente_del_caguan" },
    { label: "Belén de los Andaquíes", value: "belen_de_los_andaquies" },
    { label: "Cartagena del Chairá", value: "cartagena_del_chaira" },
    { label: "El Doncello", value: "el_doncello" },
    { label: "Puerto Rico", value: "puerto_rico" },
    { label: "Albania", value: "albania_caqueta" },
    { label: "Curillo", value: "curillo" },
    { label: "El Paujil", value: "el_paujil" },
    { label: "La Montañita", value: "la_montanita" },
    { label: "Milán", value: "milan" },
    { label: "Morelia", value: "morelia" },
    { label: "San José del Fragua", value: "san_jose_del_fragua" },
    { label: "Solano", value: "solano" },
    { label: "Solita", value: "solita" },
    { label: "Valparaíso", value: "valparaiso_caqueta" },
  ],
  casanare: [
    { label: "Yopal", value: "yopal" },
    { label: "Aguazul", value: "aguazul" },
    { label: "Villanueva", value: "villanueva" },
    { label: "Tauramena", value: "tauramena" },
    { label: "Paz de Ariporo", value: "paz_de_ariporo" },
    { label: "Monterrey", value: "monterrey" },
    { label: "Maní", value: "mani" },
    { label: "Pore", value: "pore" },
    { label: "Hato Corozal", value: "hato_corozal" },
    { label: "Orocué", value: "orocue" },
    { label: "San Luis de Palenque", value: "san_luis_de_palenque" },
    { label: "Trinidad", value: "trinidad" },
    { label: "Sabanalarga", value: "sabanalarga_casanare" },
    { label: "Nunchía", value: "nunchia" },
    { label: "Támara", value: "tamara" },
    { label: "La Salina", value: "la_salina" },
    { label: "Recetor", value: "recetor" },
    { label: "Chámeza", value: "chameza" },
    { label: "Sácama", value: "sacama" },
  ],
  cauca: [
    { label: "Popayán", value: "popayan" },
    { label: "Santander de Quilichao", value: "santander_de_quilichao" },
    { label: "Puerto Tejada", value: "puerto_tejada" },
    { label: "Patía", value: "patia" },
    { label: "Miranda", value: "miranda" },
    { label: "Caloto", value: "caloto" },
    { label: "Piendamó", value: "piendamo" },
    { label: "Cajibío", value: "cajibio" },
    { label: "Corinto", value: "corinto" },
    { label: "El Tambo", value: "el_tambo" },
    { label: "Guachené", value: "guachene" },
    { label: "Guapi", value: "guapi" },
    { label: "Inzá", value: "inza" },
    { label: "Jambaló", value: "jambalo" },
    { label: "La Sierra", value: "la_sierra" },
    { label: "La Vega", value: "la_vega" },
    { label: "López de Micay", value: "lopez_de_micay" },
    { label: "Mercaderes", value: "mercaderes" },
    { label: "Morales", value: "morales" },
    { label: "Padilla", value: "padilla" },
    { label: "Páez", value: "paez" },
    { label: "Piamonte", value: "piamonte" },
    { label: "Rosas", value: "rosas" },
    { label: "San Sebastián", value: "san_sebastian" },
    { label: "Santa Rosa", value: "santa_rosa_cauca" },
    { label: "Silvia", value: "silvia" },
    { label: "Sotará", value: "sotara" },
    { label: "Suárez", value: "suarez" },
    { label: "Sucre", value: "sucre_cauca" },
    { label: "Timbío", value: "timbio" },
    { label: "Timbiquí", value: "timbiqui" },
    { label: "Toribío", value: "toribio" },
    { label: "Totoró", value: "totoro" },
    { label: "Villa Rica", value: "villa_rica" },
  ],
  cesar: [
    { label: "Valledupar", value: "valledupar" },
    { label: "Aguachica", value: "aguachica" },
    { label: "Agustín Codazzi", value: "agustin_codazzi" },
    { label: "Bosconia", value: "bosconia" },
    { label: "La Jagua de Ibirico", value: "la_jagua_de_ibirico" },
    { label: "El Copey", value: "el_copey" },
    { label: "Chiriguaná", value: "chiriguana" },
    { label: "Curumaní", value: "curumani" },
    { label: "Pailitas", value: "pailitas" },
    { label: "San Alberto", value: "san_alberto" },
    { label: "Astrea", value: "astrea" },
    { label: "Becerril", value: "becerril" },
    { label: "Chimichagua", value: "chimichagua" },
    { label: "El Paso", value: "el_paso" },
    { label: "Gamarra", value: "gamarra" },
    { label: "González", value: "gonzalez" },
    { label: "La Gloria", value: "la_gloria" },
    { label: "La Paz", value: "la_paz" },
    { label: "Manaure Balcón del Cesar", value: "manaure_balcon_del_cesar" },
    { label: "Pelaya", value: "pelaya" },
    { label: "Pueblo Bello", value: "pueblo_bello" },
    { label: "Río de Oro", value: "rio_de_oro" },
    { label: "San Diego", value: "san_diego" },
    { label: "San Martín", value: "san_martin_cesar" },
    { label: "Tamalameque", value: "tamalameque" },
  ],
  choco: [
    { label: "Quibdó", value: "quibdo" },
    { label: "Istmina", value: "istmina" },
    { label: "Tadó", value: "tado" },
    { label: "Bahía Solano", value: "bahia_solano" },
    { label: "Acandí", value: "acandi" },
    { label: "Condoto", value: "condoto" },
    { label: "Riosucio", value: "riosucio_choco" },
    { label: "Medio Atrato", value: "medio_atrato" },
    { label: "Alto Baudó", value: "alto_baudo" },
    { label: "Bajo Baudó", value: "bajo_baudo" },
    { label: "Bojayá", value: "bojaya" },
    { label: "El Carmen de Atrato", value: "el_carmen_de_atrato" },
    { label: "Lloró", value: "lloro" },
    { label: "Medio Baudó", value: "medio_baudo" },
    { label: "Nóvita", value: "novita" },
    { label: "Nuquí", value: "nuqui" },
    { label: "San José del Palmar", value: "san_jose_del_palmar" },
    { label: "Sipí", value: "sipi" },
    { label: "Unguía", value: "unguia" },
    { label: "Unión Panamericana", value: "union_panamericana" },
    { label: "Atrato", value: "atrato" },
    { label: "Bagadó", value: "bagado" },
    { label: "Cantón de San Pablo", value: "canton_de_san_pablo" },
    { label: "Carmen del Darién", value: "carmen_del_darien" },
    { label: "Cértegui", value: "certegui" },
    { label: "Juradó", value: "jurado" },
    { label: "Litoral del San Juan", value: "litoral_del_san_juan" },
    { label: "Medio San Juan", value: "medio_san_juan" },
    { label: "Río Iró", value: "rio_iro" },
    { label: "Río Quito", value: "rio_quito" },
  ],
  cordoba: [
    { label: "Montería", value: "monteria" },
    { label: "Cereté", value: "cerete" },
    { label: "Sahagún", value: "sahagun" },
    { label: "Lorica", value: "lorica" },
    { label: "Planeta Rica", value: "planeta_rica" },
    { label: "Montelíbano", value: "montelibano" },
    { label: "Tierralta", value: "tierralta" },
    { label: "Puerto Libertador", value: "puerto_libertador" },
    { label: "Ayapel", value: "ayapel" },
    { label: "Chinú", value: "chinu" },
    { label: "Ciénaga de Oro", value: "cienaga_de_oro" },
    { label: "San Andrés de Sotavento", value: "san_andres_de_sotavento" },
    { label: "San Antero", value: "san_antero" },
    { label: "San Bernardo del Viento", value: "san_bernardo_del_viento" },
    { label: "San Carlos", value: "san_carlos" },
    { label: "San Pelayo", value: "san_pelayo" },
    { label: "Valencia", value: "valencia_cordoba" },
    { label: "Buenavista", value: "buenavista_cordoba" },
    { label: "Canalete", value: "canalete" },
    { label: "Chimá", value: "chima" },
    { label: "Cotorra", value: "cotorra" },
    { label: "La Apartada", value: "la_apartada" },
    { label: "Los Córdobas", value: "los_cordobas" },
    { label: "Momil", value: "momil" },
    { label: "Moñitos", value: "monitos" },
    { label: "Pueblo Nuevo", value: "pueblo_nuevo" },
    { label: "Puerto Escondido", value: "puerto_escondido" },
    { label: "Purísima", value: "purisima" },
    { label: "Tuchín", value: "tuchin" },
  ],
  cundinamarca: [
    { label: "Zipaquirá", value: "zipaquira" },
    { label: "Chía", value: "chia" },
    { label: "Facatativá", value: "facatativa" },
    { label: "Fusagasugá", value: "fusagasuga" },
    { label: "Mosquera", value: "mosquera" },
    { label: "Soacha", value: "soacha" },
    { label: "Madrid", value: "madrid" },
    { label: "Funza", value: "funza" },
    { label: "Cajicá", value: "cajica" },
    { label: "Girardot", value: "girardot" },
    { label: "Cota", value: "cota" },
    { label: "La Calera", value: "la_calera" },
    { label: "Tocancipá", value: "tocancipa" },
    { label: "Sopó", value: "sopo" },
    { label: "Sibaté", value: "sibate" },
    { label: "Tenjo", value: "tenjo" },
    { label: "Tabio", value: "tabio" },
    { label: "Gachancipá", value: "gachancipa" },
    { label: "Guaduas", value: "guaduas" },
    { label: "Villeta", value: "villeta" },
    { label: "Pacho", value: "pacho" },
    { label: "Ubaté", value: "ubate" },
    { label: "La Mesa", value: "la_mesa" },
    { label: "Anapoima", value: "anapoima" },
    { label: "Apulo", value: "apulo" },
    { label: "Arbeláez", value: "arbelaez" },
    { label: "Bojacá", value: "bojaca" },
    { label: "Cabrera", value: "cabrera" },
    { label: "Cachipay", value: "cachipay" },
    { label: "Cogua", value: "cogua" },
    { label: "Chocontá", value: "choconta" },
    { label: "El Colegio", value: "el_colegio" },
    { label: "El Rosal", value: "el_rosal" },
    { label: "Fómeque", value: "fomeque" },
    { label: "Gachetá", value: "gacheta" },
    { label: "Guachetá", value: "guacheta" },
    { label: "Guatavita", value: "guatavita" },
    { label: "La Vega", value: "la_vega_cundinamarca" },
    { label: "Nemocón", value: "nemocon" },
    { label: "Silvania", value: "silvania" },
    { label: "Subachoque", value: "subachoque" },
    { label: "Suesca", value: "suesca" },
    { label: "Sutatausa", value: "sutatausa" },
    { label: "Tena", value: "tena" },
    { label: "Tocaima", value: "tocaima" },
    { label: "Ubalá", value: "ubala" },
    { label: "Villapinzón", value: "villapinzon" },
    { label: "Viotá", value: "viota" },
    { label: "Zipacón", value: "zipacon" },
  ],
  guainia: [
    { label: "Inírida", value: "inirida" },
    { label: "Barranco Minas", value: "barranco_minas" },
    { label: "Mapiripana", value: "mapiripana" },
    { label: "San Felipe", value: "san_felipe" },
    { label: "Puerto Colombia", value: "puerto_colombia_guainia" },
    { label: "La Guadalupe", value: "la_guadalupe" },
    { label: "Cacahual", value: "cacahual" },
    { label: "Pana Pana", value: "pana_pana" },
    { label: "Morichal", value: "morichal" },
  ],
  guaviare: [
    { label: "San José del Guaviare", value: "san_jose_del_guaviare" },
    { label: "El Retorno", value: "el_retorno" },
    { label: "Calamar", value: "calamar" },
    { label: "Miraflores", value: "miraflores" },
  ],
  huila: [
    { label: "Neiva", value: "neiva" },
    { label: "Pitalito", value: "pitalito" },
    { label: "Garzón", value: "garzon" },
    { label: "La Plata", value: "la_plata" },
    { label: "Campoalegre", value: "campoalegre" },
    { label: "Palermo", value: "palermo" },
    { label: "Aipe", value: "aipe" },
    { label: "Algeciras", value: "algeciras" },
    { label: "Baraya", value: "baraya" },
    { label: "Colombia", value: "colombia_huila" },
    { label: "Gigante", value: "gigante" },
    { label: "Hobo", value: "hobo" },
    { label: "Íquira", value: "iquira" },
    { label: "Isnos", value: "isnos" },
    { label: "La Argentina", value: "la_argentina" },
    { label: "Nátaga", value: "nataga" },
    { label: "Oporapa", value: "oporapa" },
    { label: "Paicol", value: "paicol" },
    { label: "Rivera", value: "rivera" },
    { label: "Saladoblanco", value: "saladoblanco" },
    { label: "San Agustín", value: "san_agustin" },
    { label: "Santa María", value: "santa_maria_huila" },
    { label: "Suaza", value: "suaza" },
    { label: "Tarqui", value: "tarqui" },
    { label: "Tello", value: "tello" },
    { label: "Teruel", value: "teruel" },
    { label: "Tesalia", value: "tesalia" },
    { label: "Timaná", value: "timana" },
    { label: "Villavieja", value: "villavieja" },
    { label: "Yaguará", value: "yaguara" },
    { label: "Acevedo", value: "acevedo" },
    { label: "Agrado", value: "agrado" },
    { label: "Altamira", value: "altamira" },
    { label: "Elías", value: "elias" },
    { label: "Guadalupe", value: "guadalupe_huila" },
    { label: "Palestina", value: "palestina_huila" },
    { label: "Pital", value: "pital" },
  ],
  la_guajira: [
    { label: "Riohacha", value: "riohacha" },
    { label: "Maicao", value: "maicao" },
    { label: "Uribia", value: "uribia" },
    { label: "Manaure", value: "manaure" },
    { label: "Fonseca", value: "fonseca" },
    { label: "San Juan del Cesar", value: "san_juan_del_cesar" },
    { label: "Barrancas", value: "barrancas" },
    { label: "Dibulla", value: "dibulla" },
    { label: "Distracción", value: "distraccion" },
    { label: "El Molino", value: "el_molino" },
    { label: "Hatonuevo", value: "hatonuevo" },
    { label: "La Jagua del Pilar", value: "la_jagua_del_pilar" },
    { label: "Urumita", value: "urumita" },
    { label: "Villanueva", value: "villanueva_guajira" },
    { label: "Albania", value: "albania_guajira" },
  ],
  magdalena: [
    { label: "Santa Marta", value: "santa_marta" },
    { label: "Ciénaga", value: "cienaga" },
    { label: "Fundación", value: "fundacion" },
    { label: "Plato", value: "plato" },
    { label: "El Banco", value: "el_banco" },
    { label: "Zona Bananera", value: "zona_bananera" },
    { label: "Aracataca", value: "aracataca" },
    { label: "Pivijay", value: "pivijay" },
    { label: "Ariguaní", value: "ariguani" },
    { label: "Algarrobo", value: "algarrobo" },
    { label: "Cerro de San Antonio", value: "cerro_de_san_antonio" },
    { label: "Chivolo", value: "chivolo" },
    { label: "Concordia", value: "concordia_magdalena" },
    { label: "El Piñón", value: "el_pinon" },
    { label: "El Retén", value: "el_reten" },
    { label: "Guamal", value: "guamal_magdalena" },
    { label: "Nueva Granada", value: "nueva_granada" },
    { label: "Pedraza", value: "pedraza" },
    { label: "Pijiño del Carmen", value: "pijino_del_carmen" },
    { label: "Puebloviejo", value: "puebloviejo" },
    { label: "Remolino", value: "remolino" },
    { label: "Sabanas de San Ángel", value: "sabanas_de_san_angel" },
    { label: "Salamina", value: "salamina_magdalena" },
    { label: "San Sebastián de Buenavista", value: "san_sebastian_de_buenavista" },
    { label: "San Zenón", value: "san_zenon" },
    { label: "Santa Ana", value: "santa_ana" },
    { label: "Santa Bárbara de Pinto", value: "santa_barbara_de_pinto" },
    { label: "Sitionuevo", value: "sitionuevo" },
    { label: "Tenerife", value: "tenerife" },
    { label: "Zapayán", value: "zapayan" },
  ],
  meta: [
    { label: "Villavicencio", value: "villavicencio" },
    { label: "Acacías", value: "acacias" },
    { label: "Granada", value: "granada" },
    { label: "Puerto López", value: "puerto_lopez" },
    { label: "La Macarena", value: "la_macarena" },
    { label: "San Martín", value: "san_martin" },
    { label: "Puerto Gaitán", value: "puerto_gaitan" },
    { label: "Cumaral", value: "cumaral" },
    { label: "Vistahermosa", value: "vistahermosa" },
    { label: "Restrepo", value: "restrepo_meta" },
    { label: "Guamal", value: "guamal_meta" },
    { label: "Castilla la Nueva", value: "castilla_la_nueva" },
    { label: "Barranca de Upía", value: "barranca_de_upia" },
    { label: "Cabuyaro", value: "cabuyaro" },
    { label: "Cubarral", value: "cubarral" },
    { label: "El Calvario", value: "el_calvario" },
    { label: "El Castillo", value: "el_castillo" },
    { label: "El Dorado", value: "el_dorado" },
    { label: "Fuente de Oro", value: "fuente_de_oro" },
    { label: "Lejanías", value: "lejanias" },
    { label: "Mapiripán", value: "mapiripan" },
    { label: "Mesetas", value: "mesetas" },
    { label: "Puerto Concordia", value: "puerto_concordia" },
    { label: "Puerto Lleras", value: "puerto_lleras" },
    { label: "Puerto Rico", value: "puerto_rico_meta" },
    { label: "San Carlos de Guaroa", value: "san_carlos_de_guaroa" },
    { label: "San Juan de Arama", value: "san_juan_de_arama" },
    { label: "San Juanito", value: "san_juanito" },
    { label: "Uribe", value: "uribe" },
  ],
  narino: [
    { label: "Pasto", value: "pasto" },
    { label: "Ipiales", value: "ipiales" },
    { label: "Tumaco", value: "tumaco" },
    { label: "Túquerres", value: "tuquerres" },
    { label: "La Unión", value: "la_union" },
    { label: "Samaniego", value: "samaniego" },
    { label: "Sandoná", value: "sandona" },
    { label: "Buesaco", value: "buesaco" },
    { label: "Chachagüí", value: "chachagui" },
    { label: "Consacá", value: "consaca" },
    { label: "Cumbal", value: "cumbal" },
    { label: "Guachucal", value: "guachucal" },
    { label: "Guaitarilla", value: "guaitarilla" },
    { label: "Imués", value: "imues" },
    { label: "La Cruz", value: "la_cruz" },
    { label: "La Florida", value: "la_florida" },
    { label: "Linares", value: "linares" },
    { label: "Mallama", value: "mallama" },
    { label: "Ospina", value: "ospina" },
    { label: "Pupiales", value: "pupiales" },
    { label: "Ricaurte", value: "ricaurte" },
    { label: "Sapuyes", value: "sapuyes" },
    { label: "Taminango", value: "taminango" },
    { label: "Tangua", value: "tangua" },
    { label: "Yacuanquer", value: "yacuanquer" },
    { label: "Albán", value: "alban_narino" },
    { label: "Aldana", value: "aldana" },
    { label: "Ancuyá", value: "ancuya" },
    { label: "Arboleda", value: "arboleda" },
    { label: "Barbacoas", value: "barbacoas" },
    { label: "Belén", value: "belen_narino" },
    { label: "Colón", value: "colon" },
    { label: "Contadero", value: "contadero" },
    { label: "Córdoba", value: "cordoba_narino" },
    { label: "Cuaspud", value: "cuaspud" },
    { label: "Cumbitara", value: "cumbitara" },
    { label: "El Charco", value: "el_charco" },
    { label: "El Peñol", value: "el_penol" },
    { label: "El Rosario", value: "el_rosario" },
    { label: "El Tablón de Gómez", value: "el_tablon_de_gomez" },
    { label: "El Tambo", value: "el_tambo_narino" },
    { label: "Francisco Pizarro", value: "francisco_pizarro" },
    { label: "Funes", value: "funes" },
    { label: "Gualmatán", value: "gualmatan" },
    { label: "Iles", value: "iles" },
    { label: "La Llanada", value: "la_llanada" },
    { label: "La Tola", value: "la_tola" },
    { label: "Leiva", value: "leiva" },
    { label: "Los Andes", value: "los_andes" },
    { label: "Magüí Payán", value: "magui_payan" },
    { label: "Mosquera", value: "mosquera_narino" },
    { label: "Nariño", value: "narino" },
    { label: "Olaya Herrera", value: "olaya_herrera" },
    { label: "Policarpa", value: "policarpa" },
    { label: "Potosí", value: "potosi" },
    { label: "Providencia", value: "providencia_narino" },
    { label: "Puerres", value: "puerres" },
    { label: "Roberto Payán", value: "roberto_payan" },
    { label: "San Bernardo", value: "san_bernardo" },
    { label: "San Lorenzo", value: "san_lorenzo" },
    { label: "San Pablo", value: "san_pablo_narino" },
    { label: "San Pedro de Cartago", value: "san_pedro_de_cartago" },
    { label: "Santa Bárbara", value: "santa_barbara_narino" },
    { label: "Santacruz", value: "santacruz" },
  ],
  norte_de_santander: [
    { label: "Cúcuta", value: "cucuta" },
    { label: "Ocaña", value: "ocana" },
    { label: "Pamplona", value: "pamplona" },
    { label: "Villa del Rosario", value: "villa_del_rosario" },
    { label: "Los Patios", value: "los_patios" },
    { label: "Tibú", value: "tibu" },
    { label: "Ábrego", value: "abrego" },
    { label: "Chinácota", value: "chinacota" },
    { label: "Convención", value: "convencion" },
    { label: "El Zulia", value: "el_zulia" },
    { label: "Sardinata", value: "sardinata" },
    { label: "Teorama", value: "teorama" },
    { label: "Arboledas", value: "arboledas" },
    { label: "Bochalema", value: "bochalema" },
    { label: "Bucarasica", value: "bucarasica" },
    { label: "Cáchira", value: "cachira" },
    { label: "Cácota", value: "cacota" },
    { label: "Chitagá", value: "chitaga" },
    { label: "Cucutilla", value: "cucutilla" },
    { label: "Durania", value: "durania" },
    { label: "El Carmen", value: "el_carmen" },
    { label: "El Tarra", value: "el_tarra" },
    { label: "Gramalote", value: "gramalote" },
    { label: "Hacarí", value: "hacari" },
    { label: "Herrán", value: "herran" },
    { label: "La Esperanza", value: "la_esperanza" },
    { label: "La Playa", value: "la_playa" },
    { label: "Labateca", value: "labateca" },
    { label: "Lourdes", value: "lourdes" },
    { label: "Mutiscua", value: "mutiscua" },
    { label: "Puerto Santander", value: "puerto_santander" },
    { label: "Ragonvalia", value: "ragonvalia" },
    { label: "Salazar", value: "salazar" },
    { label: "San Calixto", value: "san_calixto" },
    { label: "San Cayetano", value: "san_cayetano" },
    { label: "Santiago", value: "santiago" },
    { label: "Silos", value: "silos" },
    { label: "Toledo", value: "toledo" },
  ],
  putumayo: [
    { label: "Mocoa", value: "mocoa" },
    { label: "Puerto Asís", value: "puerto_asis" },
    { label: "Orito", value: "orito" },
    { label: "Valle del Guamuez", value: "valle_del_guamuez" },
    { label: "Puerto Guzmán", value: "puerto_guzman" },
    { label: "Villagarzón", value: "villagarzon" },
    { label: "Colón", value: "colon_putumayo" },
    { label: "Leguízamo", value: "leguizamo" },
    { label: "Puerto Caicedo", value: "puerto_caicedo" },
    { label: "San Francisco", value: "san_francisco" },
    { label: "San Miguel", value: "san_miguel" },
    { label: "Santiago", value: "santiago_putumayo" },
    { label: "Sibundoy", value: "sibundoy" },
  ],
  quindio: [
    { label: "Armenia", value: "armenia" },
    { label: "Calarcá", value: "calarca" },
    { label: "Montenegro", value: "montenegro" },
    { label: "Quimbaya", value: "quimbaya" },
    { label: "La Tebaida", value: "la_tebaida" },
    { label: "Circasia", value: "circasia" },
    { label: "Filandia", value: "filandia" },
    { label: "Génova", value: "genova" },
    { label: "Pijao", value: "pijao" },
    { label: "Salento", value: "salento" },
    { label: "Buenavista", value: "buenavista_quindio" },
    { label: "Córdoba", value: "cordoba_quindio" },
  ],
  risaralda: [
    { label: "Pereira", value: "pereira" },
    { label: "Dosquebradas", value: "dosquebradas" },
    { label: "Santa Rosa de Cabal", value: "santa_rosa_de_cabal" },
    { label: "La Virginia", value: "la_virginia" },
    { label: "Belén de Umbría", value: "belen_de_umbria" },
    { label: "Quinchía", value: "quinchia" },
    { label: "Apía", value: "apia" },
    { label: "Balboa", value: "balboa" },
    { label: "Guática", value: "guatica" },
    { label: "La Celia", value: "la_celia" },
    { label: "Marsella", value: "marsella" },
    { label: "Mistrató", value: "mistrato" },
    { label: "Pueblo Rico", value: "pueblo_rico" },
    { label: "Santuario", value: "santuario" },
  ],
  san_andres_y_providencia: [
    { label: "San Andrés", value: "san_andres" },
    { label: "Providencia", value: "providencia" },
    { label: "Santa Catalina", value: "santa_catalina_san_andres" },
  ],
  santander: [
    { label: "Bucaramanga", value: "bucaramanga" },
    { label: "Floridablanca", value: "floridablanca" },
    { label: "Girón", value: "giron" },
    { label: "Piedecuesta", value: "piedecuesta" },
    { label: "Barrancabermeja", value: "barrancabermeja" },
    { label: "San Gil", value: "san_gil" },
    { label: "Barbosa", value: "barbosa_santander" },
    { label: "Cimitarra", value: "cimitarra" },
    { label: "Málaga", value: "malaga" },
    { label: "Socorro", value: "socorro" },
    { label: "Vélez", value: "velez" },
    { label: "Zapatoca", value: "zapatoca" },
    { label: "Aratoca", value: "aratoca" },
    { label: "Barichara", value: "barichara" },
    { label: "Charalá", value: "charala" },
    { label: "Confines", value: "confines" },
    { label: "Contratación", value: "contratacion" },
    { label: "El Carmen de Chucurí", value: "el_carmen_de_chucuri" },
    { label: "El Playón", value: "el_playon" },
    { label: "Florian", value: "florian" },
    { label: "Guaca", value: "guaca" },
    { label: "Guadalupe", value: "guadalupe_santander" },
    { label: "Guapotá", value: "guapota" },
    { label: "Guavatá", value: "guavata" },
    { label: "Güepsa", value: "guepsa" },
    { label: "Hato", value: "hato" },
    { label: "Jesús María", value: "jesus_maria" },
    { label: "Jordán", value: "jordan" },
    { label: "La Belleza", value: "la_belleza" },
    { label: "La Paz", value: "la_paz_santander" },
    { label: "Landázuri", value: "landazuri" },
    { label: "Lebrija", value: "lebrija" },
    { label: "Los Santos", value: "los_santos" },
    { label: "Macaravita", value: "macaravita" },
    { label: "Matanza", value: "matanza" },
    { label: "Mogotes", value: "mogotes" },
    { label: "Molagavita", value: "molagavita" },
    { label: "Ocamonte", value: "ocamonte" },
    { label: "Oiba", value: "oiba" },
    { label: "Onzaga", value: "onzaga" },
    { label: "Palmar", value: "palmar" },
    { label: "Palmas del Socorro", value: "palmas_del_socorro" },
    { label: "Páramo", value: "paramo" },
    { label: "Pinchote", value: "pinchote" },
    { label: "Puente Nacional", value: "puente_nacional" },
    { label: "Puerto Parra", value: "puerto_parra" },
    { label: "Puerto Wilches", value: "puerto_wilches" },
    { label: "Rionegro", value: "rionegro_santander" },
    { label: "Sabana de Torres", value: "sabana_de_torres" },
    { label: "San Andrés", value: "san_andres_santander" },
    { label: "San Benito", value: "san_benito" },
    { label: "San Joaquín", value: "san_joaquin" },
    { label: "San José de Miranda", value: "san_jose_de_miranda" },
    { label: "San Miguel", value: "san_miguel_santander" },
    { label: "San Vicente de Chucurí", value: "san_vicente_de_chucuri" },
    { label: "Santa Bárbara", value: "santa_barbara_santander" },
    { label: "Santa Helena del Opón", value: "santa_helena_del_opon" },
    { label: "Simacota", value: "simacota" },
    { label: "Suaita", value: "suaita" },
    { label: "Sucre", value: "sucre_santander" },
    { label: "Suratá", value: "surata" },
    { label: "Tona", value: "tona" },
    { label: "Valle de San José", value: "valle_de_san_jose" },
    { label: "Villanueva", value: "villanueva_santander" },
  ],
  sucre: [
    { label: "Sincelejo", value: "sincelejo" },
    { label: "Corozal", value: "corozal" },
    { label: "San Marcos", value: "san_marcos" },
    { label: "San Onofre", value: "san_onofre" },
    { label: "Tolú", value: "tolu" },
    { label: "Sampués", value: "sampues" },
    { label: "Sincé", value: "since" },
    { label: "Majagual", value: "majagual" },
    { label: "Coveñas", value: "covenas" },
    { label: "Galeras", value: "galeras" },
    { label: "Los Palmitos", value: "los_palmitos" },
    { label: "Morroa", value: "morroa" },
    { label: "Ovejas", value: "ovejas" },
    { label: "San Benito Abad", value: "san_benito_abad" },
    { label: "San Juan de Betulia", value: "san_juan_de_betulia" },
    { label: "San Luis de Sincé", value: "san_luis_de_since" },
    { label: "San Pedro", value: "san_pedro" },
    { label: "Sucre", value: "sucre_sucre" },
    { label: "Tolú Viejo", value: "tolu_viejo" },
    { label: "Buenavista", value: "buenavista_sucre" },
    { label: "Caimito", value: "caimito" },
    { label: "Chalán", value: "chalan" },
    { label: "Coloso", value: "coloso" },
    { label: "El Roble", value: "el_roble" },
    { label: "Guaranda", value: "guaranda" },
    { label: "La Unión", value: "la_union_sucre" },
  ],
  tolima: [
    { label: "Ibagué", value: "ibague" },
    { label: "Espinal", value: "espinal" },
    { label: "Chaparral", value: "chaparral" },
    { label: "Mariquita", value: "mariquita" },
    { label: "Líbano", value: "libano" },
    { label: "Honda", value: "honda" },
    { label: "Flandes", value: "flandes" },
    { label: "Melgar", value: "melgar" },
    { label: "Cajamarca", value: "cajamarca" },
    { label: "Fresno", value: "fresno" },
    { label: "Guamo", value: "guamo" },
    { label: "Lérida", value: "lerida" },
    { label: "Ortega", value: "ortega" },
    { label: "Planadas", value: "planadas" },
    { label: "Purificación", value: "purificacion" },
    { label: "Rioblanco", value: "rioblanco" },
    { label: "Rovira", value: "rovira" },
    { label: "Saldaña", value: "saldana" },
    { label: "Venadillo", value: "venadillo" },
    { label: "Alvarado", value: "alvarado" },
    { label: "Ambalema", value: "ambalema" },
    { label: "Anzoátegui", value: "anzoategui" },
    { label: "Armero", value: "armero" },
    { label: "Ataco", value: "ataco" },
    { label: "Carmen de Apicalá", value: "carmen_de_apicala" },
    { label: "Casabianca", value: "casabianca" },
    { label: "Coello", value: "coello" },
    { label: "Coyaima", value: "coyaima" },
    { label: "Cunday", value: "cunday" },
    { label: "Dolores", value: "dolores" },
    { label: "Falan", value: "falan" },
    { label: "Herveo", value: "herveo" },
    { label: "Icononzo", value: "icononzo" },
    { label: "Murillo", value: "murillo" },
    { label: "Natagaima", value: "natagaima" },
    { label: "Palocabildo", value: "palocabildo" },
    { label: "Piedras", value: "piedras" },
    { label: "Prado", value: "prado" },
    { label: "Roncesvalles", value: "roncesvalles" },
    { label: "San Antonio", value: "san_antonio" },
    { label: "San Luis", value: "san_luis" },
    { label: "Santa Isabel", value: "santa_isabel" },
    { label: "Suárez", value: "suarez_tolima" },
    { label: "Valle de San Juan", value: "valle_de_san_juan" },
    { label: "Villarrica", value: "villarrica" },
  ],
  valle_del_cauca: [
    { label: "Cali", value: "cali" },
    { label: "Buenaventura", value: "buenaventura" },
    { label: "Palmira", value: "palmira" },
    { label: "Tuluá", value: "tulua" },
    { label: "Yumbo", value: "yumbo" },
    { label: "Jamundí", value: "jamundi" },
    { label: "Cartago", value: "cartago" },
    { label: "Buga", value: "buga" },
    { label: "Candelaria", value: "candelaria_valle" },
    { label: "Florida", value: "florida" },
    { label: "Pradera", value: "pradera" },
    { label: "Zarzal", value: "zarzal" },
    { label: "Caicedonia", value: "caicedonia" },
    { label: "Dagua", value: "dagua" },
    { label: "El Cerrito", value: "el_cerrito" },
    { label: "Ginebra", value: "ginebra" },
    { label: "Guacarí", value: "guacari" },
    { label: "La Unión", value: "la_union_valle" },
    { label: "Roldanillo", value: "roldanillo" },
    { label: "Sevilla", value: "sevilla" },
    { label: "Andalucía", value: "andalucia" },
    { label: "Ansermanuevo", value: "ansermanuevo" },
    { label: "Argelia", value: "argelia" },
    { label: "Bolívar", value: "bolivar_valle" },
    { label: "Bugalagrande", value: "bugalagrande" },
    { label: "Calima", value: "calima" },
    { label: "El Águila", value: "el_aguila" },
    { label: "El Cairo", value: "el_cairo" },
    { label: "El Dovio", value: "el_dovio" },
    { label: "La Cumbre", value: "la_cumbre" },
    { label: "La Victoria", value: "la_victoria" },
    { label: "Obando", value: "obando" },
    { label: "Restrepo", value: "restrepo_valle" },
    { label: "Riofrío", value: "riofrio" },
    { label: "San Pedro", value: "san_pedro_valle" },
    { label: "Toro", value: "toro" },
    { label: "Trujillo", value: "trujillo" },
    { label: "Ulloa", value: "ulloa" },
    { label: "Versalles", value: "versalles" },
    { label: "Vijes", value: "vijes" },
    { label: "Yotoco", value: "yotoco" },
  ],
  vaupes: [
    { label: "Mitú", value: "mitu" },
    { label: "Carurú", value: "caruru" },
    { label: "Taraira", value: "taraira" },
    { label: "Papunaua", value: "papunaua" },
    { label: "Yavaraté", value: "yavarate" },
    { label: "Pacoa", value: "pacoa" },
  ],
  vichada: [
    { label: "Puerto Carreño", value: "puerto_carreno" },
    { label: "La Primavera", value: "la_primavera" },
    { label: "Santa Rosalía", value: "santa_rosalia" },
    { label: "Cumaribo", value: "cumaribo" },
  ],
}

// Pre-normalizar todas las ciudades
Object.keys(ciudadesPorDepartamento).forEach((key) => {
  ciudadesPorDepartamento[key] = ciudadesPorDepartamento[key].map((item) => ({
    ...item,
    normalizedLabel: normalizeText(item.label),
  }))
})

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [idNumber, setIdNumber] = useState<string>("")
  const [birthDate, setBirthDate] = useState<string>("")

  // Estados para los inputs de ubicación
  const [departamento, setDepartamento] = useState<string>("")
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState<string | null>(null)
  const [showDepartamentoSuggestions, setShowDepartamentoSuggestions] = useState<boolean>(false)
  const [departamentoSuggestions, setDepartamentoSuggestions] = useState<LocationItem[]>([])
  const [departamentoLabel, setDepartamentoLabel] = useState<string>("")

  const [ciudad, setCiudad] = useState<string>("")
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string | null>(null)
  const [showCiudadSuggestions, setShowCiudadSuggestions] = useState<boolean>(false)
  const [ciudadSuggestions, setCiudadSuggestions] = useState<LocationItem[]>([])
  const [ciudadLabel, setCiudadLabel] = useState<string>("")

  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false)
  const [ageConfirmed, setAgeConfirmed] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Estados para los modales de términos y condiciones y política de privacidad
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false)

  // Modales para selección
  const [showDepartamentoModal, setShowDepartamentoModal] = useState<boolean>(false)
  const [showCiudadModal, setShowCiudadModal] = useState<boolean>(false)

  const scrollViewRef = useRef<ScrollView>(null)
  const departamentoInputRef = useRef<TextInput>(null)
  const ciudadInputRef = useRef<TextInput>(null)

  // Filtrar sugerencias de departamentos con lógica mejorada
  useEffect(() => {
    if (departamento.length > 0) {
      const searchTerm = normalizeText(departamento)

      // Filtrar con múltiples estrategias para mayor flexibilidad
      const filteredSuggestions = departamentos.filter((item) => {
        const normalizedLabel = item.normalizedLabel || normalizeText(item.label)

        // 1. Coincidencia exacta (prioridad más alta)
        if (normalizedLabel === searchTerm) return true

        // 2. Comienza con el término de búsqueda
        if (normalizedLabel.startsWith(searchTerm)) return true

        // 3. Contiene el término de búsqueda
        if (normalizedLabel.includes(searchTerm)) return true

        // 4. Coincidencia por palabras individuales
        const words = normalizedLabel.split(" ")
        if (words.some((word) => word.startsWith(searchTerm))) return true

        // 5. Coincidencia por caracteres iniciales (para abreviaturas)
        if (searchTerm.length >= 2) {
          const initials = words.map((word) => word.charAt(0)).join("")
          if (initials.includes(searchTerm)) return true
        }

        return false
      })

      // Ordenar resultados por relevancia
      const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
        const aLabel = a.normalizedLabel || normalizeText(a.label)
        const bLabel = b.normalizedLabel || normalizeText(b.label)

        // Priorizar coincidencias exactas y que comienzan con el término
        if (aLabel.startsWith(searchTerm) && !bLabel.startsWith(searchTerm)) return -1
        if (!aLabel.startsWith(searchTerm) && bLabel.startsWith(searchTerm)) return 1

        // Luego ordenar por longitud (nombres más cortos primero)
        return aLabel.length - bLabel.length
      })

      setDepartamentoSuggestions(sortedSuggestions)
    } else {
      // Si el campo está vacío, mostrar todos los departamentos
      setDepartamentoSuggestions(departamentos)
    }
  }, [departamento])

  // Filtrar sugerencias de ciudades con lógica mejorada
  useEffect(() => {
    if (departamentoSeleccionado) {
      const ciudadesDisponibles = ciudadesPorDepartamento[departamentoSeleccionado] || []

      if (ciudad.length > 0) {
        const searchTerm = normalizeText(ciudad)

        // Aplicar la misma lógica de filtrado mejorada
        const filteredSuggestions = ciudadesDisponibles.filter((item) => {
          const normalizedLabel = item.normalizedLabel || normalizeText(item.label)

          if (normalizedLabel === searchTerm) return true
          if (normalizedLabel.startsWith(searchTerm)) return true
          if (normalizedLabel.includes(searchTerm)) return true

          const words = normalizedLabel.split(" ")
          if (words.some((word) => word.startsWith(searchTerm))) return true

          return false
        })

        // Ordenar por relevancia
        const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
          const aLabel = a.normalizedLabel || normalizeText(a.label)
          const bLabel = b.normalizedLabel || normalizeText(b.label)

          if (aLabel.startsWith(searchTerm) && !bLabel.startsWith(searchTerm)) return -1
          if (!aLabel.startsWith(searchTerm) && bLabel.startsWith(searchTerm)) return 1

          return aLabel.length - bLabel.length
        })

        setCiudadSuggestions(sortedSuggestions)
      } else {
        // Si el campo está vacío, mostrar todas las ciudades del departamento
        setCiudadSuggestions(ciudadesDisponibles)
      }
    } else {
      setCiudadSuggestions([])
    }
  }, [ciudad, departamentoSeleccionado])

  const handleDepartamentoSelect = (item: LocationItem) => {
    setDepartamento(item.label)
    setDepartamentoLabel(item.label)
    setDepartamentoSeleccionado(item.value)
    setShowDepartamentoModal(false)
    setCiudad("")
    setCiudadLabel("")
    setCiudadSeleccionada(null)

    // Enfocar automáticamente el campo de ciudad
    setTimeout(() => {
      if (ciudadInputRef.current) {
        ciudadInputRef.current.focus()
      }
    }, 100)
  }

  const handleCiudadSelect = (item: LocationItem) => {
    setCiudad(item.label)
    setCiudadLabel(item.label)
    setCiudadSeleccionada(item.value)
    setShowCiudadModal(false)
  }

  const passwordRequirements: PasswordRequirement[] = [
    {
      label: "Mínimo 8 caracteres",
      isValid: password.length >= 8,
      regex: /.{8,}/,
    },
    {
      label: "Al menos una letra mayúscula",
      isValid: /[A-Z]/.test(password),
      regex: /[A-Z]/,
    },
    {
      label: "Al menos un número",
      isValid: /[0-9]/.test(password),
      regex: /[0-9]/,
    },
    {
      label: "Al menos un carácter especial",
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.isValid)

  // Función para formatear la fecha automáticamente mientras el usuario escribe
  const handleBirthDateChange = (text: string) => {
    // Eliminar cualquier carácter que no sea número
    const cleaned = text.replace(/[^0-9]/g, "")

    // Limitar a 8 dígitos (DDMMAAAA)
    const limited = cleaned.substring(0, 8)

    // Formatear con barras (DD/MM/AAAA)
    let formatted = ""
    if (limited.length > 0) {
      // Añadir los primeros dos dígitos (DD)
      formatted = limited.substring(0, 2)

      // Añadir barra y los siguientes dos dígitos (MM) si existen
      if (limited.length > 2) {
        formatted += "/" + limited.substring(2, 4)

        // Añadir barra y los últimos cuatro dígitos (AAAA) si existen
        if (limited.length > 4) {
          formatted += "/" + limited.substring(4, 8)
        }
      }
    }

    setBirthDate(formatted)
  }

  const handleRegister = (): void => {
    // Validación básica
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Por favor, ingresa tu nombre completo.")
      setShowErrorModal(true)
      return
    }

    if (!idNumber.trim()) {
      setErrorMessage("Por favor, ingresa tu número de identificación.")
      setShowErrorModal(true)
      return
    }

    if (!birthDate.trim()) {
      setErrorMessage("Por favor, ingresa tu fecha de nacimiento.")
      setShowErrorModal(true)
      return
    }

    if (!departamentoSeleccionado) {
      setErrorMessage("Por favor, selecciona tu departamento.")
      setShowErrorModal(true)
      return
    }

    if (!ciudadSeleccionada) {
      setErrorMessage("Por favor, selecciona tu ciudad.")
      setShowErrorModal(true)
      return
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.")
      setShowErrorModal(true)
      return
    }

    if (!phone.trim()) {
      setErrorMessage("Por favor, ingresa tu número de celular.")
      setShowErrorModal(true)
      return
    }

    if (!isPasswordValid) {
      setErrorMessage("Por favor, ingresa una contraseña válida que cumpla con todos los requisitos.")
      setShowErrorModal(true)
      return
    }

    if (!termsAccepted) {
      setErrorMessage("Debes aceptar los términos y condiciones.")
      setShowErrorModal(true)
      return
    }

    if (!privacyAccepted) {
      setErrorMessage("Debes aceptar la política de privacidad.")
      setShowErrorModal(true)
      return
    }

    if (!ageConfirmed) {
      setErrorMessage("Debes confirmar que eres mayor de edad.")
      setShowErrorModal(true)
      return
    }

    // Navegar a la pantalla principal (MainApp) después del registro exitoso
    navigation.navigate("MainApp")
  }

  const handleLogin = (): void => {
    navigation.navigate("Login")
  }

  const handleGoogleLogin = (): void => {
    // Implementación futura de login con Google
    console.log("Login con Google")
  }

  const handleAppleLogin = (): void => {
    // Implementación futura de login con Apple
    console.log("Login con Apple")
  }

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword)
  }

  // Manejadores para los modales de términos y condiciones y política de privacidad
  const handleOpenTermsModal = () => {
    setShowTermsModal(true)
  }

  const handleCloseTermsModal = () => {
    setShowTermsModal(false)
  }

  const handleAcceptTerms = () => {
    setTermsAccepted(true)
    setShowTermsModal(false)
  }

  const handleOpenPrivacyModal = () => {
    setShowPrivacyModal(true)
  }

  const handleClosePrivacyModal = () => {
    setShowPrivacyModal(false)
  }

  const handleAcceptPrivacy = () => {
    setPrivacyAccepted(true)
    setShowPrivacyModal(false)
  }

  // Renderizar el modal de selección de departamento
  const renderDepartamentoModal = () => (
    <Modal
      visible={showDepartamentoModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDepartamentoModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona un departamento</Text>
            <TouchableOpacity onPress={() => setShowDepartamentoModal(false)}>
              <Ionicons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalSearchInput}
            placeholder="Buscar departamento"
            placeholderTextColor="#B0C8EA"
            value={departamento}
            onChangeText={setDepartamento}
            autoCapitalize="words"
          />

          <ScrollView style={styles.modalList}>
            {departamentoSuggestions.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.modalItem}
                onPress={() => handleDepartamentoSelect(item)}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  // Renderizar el modal de selección de ciudad
  const renderCiudadModal = () => (
    <Modal
      visible={showCiudadModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCiudadModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecciona una ciudad</Text>
            <TouchableOpacity onPress={() => setShowCiudadModal(false)}>
              <Ionicons name="close" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalSearchInput}
            placeholder="Buscar ciudad"
            placeholderTextColor="#B0C8EA"
            value={ciudad}
            onChangeText={setCiudad}
            autoCapitalize="words"
          />

          <ScrollView style={styles.modalList}>
            {ciudadSuggestions.map((item) => (
              <TouchableOpacity key={item.value} style={styles.modalItem} onPress={() => handleCiudadSelect(item)}>
                <Text style={styles.modalItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Fondo y logo fijo */}
      <ImageBackground
        source={require("src/assets/images/Fondo3_FORTU.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollView}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {/* Logo en la esquina superior izquierda */}
              <View style={styles.logoWrapper}>
                <View style={styles.logoContainer}>
                  <Image source={require("src/assets/images/logo_t.png")} style={styles.logo} resizeMode="contain" />
                </View>
              </View>

              <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>¡Hola!</Text>
                <Text style={styles.headerSubtitle}>Crear una cuenta nueva</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.rowContainer}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Nombres</Text>
                    <TextInput
                      style={styles.input}
                      placeholder=""
                      placeholderTextColor="#B0C8EA"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Apellidos</Text>
                    <TextInput
                      style={styles.input}
                      placeholder=""
                      placeholderTextColor="#B0C8EA"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}># de Identificación</Text>
                    <TextInput
                      style={styles.input}
                      placeholder=""
                      placeholderTextColor="#B0C8EA"
                      value={idNumber}
                      onChangeText={setIdNumber}
                      keyboardType="number-pad"
                    />
                  </View>

                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Fecha de nacimiento</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#B0C8EA"
                      value={birthDate}
                      onChangeText={handleBirthDateChange}
                      keyboardType="number-pad"
                      maxLength={10} // DD/MM/AAAA = 10 caracteres
                    />
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Departamento</Text>
                    <TouchableOpacity
                      style={styles.selectInput}
                      onPress={() => {
                        setShowDepartamentoModal(true)
                      }}
                    >
                      <Text style={[styles.selectInputText, !departamentoLabel && { color: "#B0C8EA" }]}>
                        {departamentoLabel || ""}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#B0C8EA" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.halfInputContainer}>
                    <Text style={styles.inputLabel}>Ciudad</Text>
                    <TouchableOpacity
                      style={[styles.selectInput, !departamentoSeleccionado && styles.disabledInput]}
                      onPress={() => {
                        if (departamentoSeleccionado) {
                          setShowCiudadModal(true)
                        }
                      }}
                      disabled={!departamentoSeleccionado}
                    >
                      <Text style={[styles.selectInputText, !ciudadLabel && { color: "#B0C8EA" }]}>
                        {ciudadLabel || ""}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#B0C8EA" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.fullInputContainer}>
                  <Text style={styles.inputLabel}>Correo electrónico</Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    placeholderTextColor="#B0C8EA"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.fullInputContainer}>
                  <Text style={styles.inputLabel}>Celular</Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    placeholderTextColor="#B0C8EA"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.fullInputContainer}>
                  <Text style={styles.inputLabel}>Contraseña</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder=""
                      placeholderTextColor="#B0C8EA"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      style={styles.eyeIconContainer}
                      onPress={togglePasswordVisibility}
                      activeOpacity={0.7}
                    >
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#B0C8EA" />
                    </TouchableOpacity>
                  </View>
                </View>

                {(passwordFocused || password.length > 0) && (
                  <View style={styles.passwordRequirementsContainer}>
                    {passwordRequirements.map((requirement, index) => (
                      <View key={index} style={styles.passwordRequirementItem}>
                        <View style={[styles.checkCircle, requirement.isValid && styles.checkCircleFilled]}>
                          {requirement.isValid && <Text style={styles.checkMark}>✓</Text>}
                        </View>
                        <Text
                          style={[
                            styles.passwordRequirementText,
                            { color: requirement.isValid ? colors.primary : "#666666" },
                          ]}
                        >
                          {requirement.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                <CustomCheckbox
                  checked={termsAccepted}
                  onPress={handleOpenTermsModal}
                  label={
                    <Text style={styles.checkboxText}>
                      He leído y acepto los{" "}
                      <Text style={styles.checkboxLink} onPress={handleOpenTermsModal}>
                        términos y condiciones
                      </Text>
                    </Text>
                  }
                  containerStyle={styles.checkboxContainer}
                />

                <CustomCheckbox
                  checked={privacyAccepted}
                  onPress={handleOpenPrivacyModal}
                  label={
                    <Text style={styles.checkboxText}>
                      He leído y acepto la{" "}
                      <Text style={styles.checkboxLink} onPress={handleOpenPrivacyModal}>
                        política de privacidad y tratamiento de datos
                      </Text>
                    </Text>
                  }
                  containerStyle={styles.checkboxContainer}
                />

                <CustomCheckbox
                  checked={ageConfirmed}
                  onPress={() => setAgeConfirmed(!ageConfirmed)}
                  label={<Text style={styles.checkboxText}>Confirmo que soy mayor de edad</Text>}
                  containerStyle={styles.checkboxContainer}
                />

                <View style={styles.socialButtonsContainer}>
                  <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                    <Image
                      source={require("src/assets/images/google_logo.jpg")}
                      style={styles.socialLogo}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Continuar con google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
                    <Image
                      source={require("src/assets/images/apple_logo.png")}
                      style={styles.socialLogo}
                      resizeMode="contain"
                    />
                    <Text style={styles.socialButtonText}>Continuar AppleID</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.continueButton} onPress={handleRegister} activeOpacity={0.7}>
                  <Image source={require("src/assets/images/arrow_right.png")} style={styles.arrowIcon} />
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>¿Ya tienes una cuenta en Fortu?</Text>
                  <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Inicia Sesión</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>

      {/* Modales para selección */}
      {renderDepartamentoModal()}
      {renderCiudadModal()}

      {/* Modal de términos y condiciones */}
      <TermsConditionsModal visible={showTermsModal} onClose={handleCloseTermsModal} onAccept={handleAcceptTerms} />

      {/* Modal de política de privacidad */}
      <PrivacyPolicyModal visible={showPrivacyModal} onClose={handleClosePrivacyModal} onAccept={handleAcceptPrivacy} />

      <LoginErrorModal visible={showErrorModal} onClose={() => setShowErrorModal(false)} message={errorMessage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  // Contenedor para posicionar el logo en la esquina superior izquierda
  logoWrapper: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: 20,
    marginBottom: 20,
  },
  logoContainer: {
    width: 60,
    height: 60,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 20,
    width: width * 0.9,
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  halfInputContainer: {
    width: "48%",
  },
  fullInputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  // Estilos para los inputs de selección
  selectInput: {
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectInputText: {
    fontSize: 16,
    color: colors.text.primary,
    flex: 1,
  },
  disabledInput: {
    backgroundColor: "#E5E5E5",
    opacity: 0.7,
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  modalSearchInput: {
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 15,
  },
  modalList: {
    maxHeight: height * 0.5,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  // Estilos para el campo de contraseña con icono de ojo
  passwordInputContainer: {
    flexDirection: "row",
    backgroundColor: "#D1DFFA",
    borderRadius: 10,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  eyeIconContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordRequirementsContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#EFF4FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1DFFA",
  },
  passwordRequirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666666",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  passwordRequirementText: {
    fontSize: 14,
    fontWeight: "500",
  },
  checkboxContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxText: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
    flexWrap: "wrap",
  },
  checkboxLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  socialButtonsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    height: 50,
  },
  socialLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  arrowIcon: {
    width: 30,
    height: 30,
  },
  loginContainer: {
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 5,
  },
  loginButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})

export default RegisterScreen

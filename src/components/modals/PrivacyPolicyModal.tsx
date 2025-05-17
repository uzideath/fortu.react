import type React from "react"
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from "react-native"
import { colors } from "src/styles/colors"

interface PrivacyPolicyModalProps {
  visible: boolean
  onClose: () => void
  onAccept: () => void
}

const { width, height } = Dimensions.get("window")

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ visible, onClose, onAccept }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Política de privacidad</Text>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={true}>
            <Text style={styles.paragraph}>
              En Fortu, valoramos y respetamos su privacidad. Esta Política de Privacidad explica cómo recopilamos,
              utilizamos, divulgamos y protegemos su información cuando utiliza nuestra aplicación móvil, sitio web y
              servicios relacionados (colectivamente, los "Servicios").
            </Text>

            <Text style={styles.sectionTitle}>1. Información que Recopilamos</Text>
            <Text style={styles.paragraph}>
              1.1 Información Personal: Podemos recopilar información personal que usted nos proporciona directamente,
              como su nombre, dirección de correo electrónico, número de teléfono, dirección, fecha de nacimiento,
              información de identificación, información de pago y cualquier otra información que elija proporcionar.
            </Text>
            <Text style={styles.paragraph}>
              1.2 Información de Uso: Recopilamos información sobre cómo interactúa con nuestros Servicios, incluyendo
              el tipo de dispositivo que utiliza, su dirección IP, tipo de navegador, páginas visitadas, tiempo de
              permanencia en la página, y otra información de diagnóstico.
            </Text>
            <Text style={styles.paragraph}>
              1.3 Información de Ubicación: Con su consentimiento, podemos recopilar y procesar información sobre su
              ubicación para proporcionar ciertas funciones de nuestros Servicios.
            </Text>

            <Text style={styles.sectionTitle}>2. Cómo Utilizamos Su Información</Text>
            <Text style={styles.paragraph}>
              2.1 Proporcionar y Mantener nuestros Servicios: Utilizamos la información recopilada para proporcionar,
              mantener y mejorar nuestros Servicios.
            </Text>
            <Text style={styles.paragraph}>
              2.2 Comunicaciones: Podemos utilizar su información para comunicarnos con usted, responder a sus consultas
              y proporcionarle información sobre nuestros Servicios.
            </Text>
            <Text style={styles.paragraph}>
              2.3 Análisis y Mejora: Utilizamos la información para analizar cómo se utilizan nuestros Servicios, para
              mejorar su funcionalidad y para desarrollar nuevos productos y servicios.
            </Text>
            <Text style={styles.paragraph}>
              2.4 Seguridad: Utilizamos la información para proteger nuestros Servicios y a nuestros usuarios, para
              detectar y prevenir fraudes y para cumplir con nuestras obligaciones legales.
            </Text>

            <Text style={styles.sectionTitle}>3. Divulgación de Su Información</Text>
            <Text style={styles.paragraph}>
              3.1 Proveedores de Servicios: Podemos compartir su información con proveedores de servicios de terceros
              que realizan servicios en nuestro nombre, como procesamiento de pagos, análisis de datos, entrega de
              correo electrónico, servicios de alojamiento, servicio al cliente y asistencia de marketing.
            </Text>
            <Text style={styles.paragraph}>
              3.2 Cumplimiento Legal: Podemos divulgar su información si creemos de buena fe que dicha acción es
              necesaria para cumplir con una obligación legal, proteger y defender nuestros derechos o propiedad,
              prevenir o investigar posibles irregularidades en relación con los Servicios, proteger la seguridad
              personal de los usuarios de los Servicios o del público, o proteger contra responsabilidad legal.
            </Text>
            <Text style={styles.paragraph}>
              3.3 Transferencias Comerciales: Si estamos involucrados en una fusión, adquisición o venta de activos, su
              información puede ser transferida como parte de esa transacción. Notificaremos sobre cualquier cambio en
              la propiedad o el uso de su información personal.
            </Text>

            <Text style={styles.sectionTitle}>4. Seguridad de los Datos</Text>
            <Text style={styles.paragraph}>
              Implementamos medidas de seguridad diseñadas para proteger su información contra acceso no autorizado,
              alteración, divulgación o destrucción. Sin embargo, ningún método de transmisión por Internet o método de
              almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su seguridad absoluta.
            </Text>

            <Text style={styles.sectionTitle}>5. Sus Derechos</Text>
            <Text style={styles.paragraph}>
              Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, como el
              derecho a acceder, corregir, eliminar o restringir el procesamiento de su información personal. Para
              ejercer estos derechos, por favor contáctenos a través de la información proporcionada al final de esta
              Política.
            </Text>

            <Text style={styles.sectionTitle}>6. Cambios a Esta Política de Privacidad</Text>
            <Text style={styles.paragraph}>
              Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio
              publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "última
              actualización" en la parte superior de esta Política de Privacidad.
            </Text>

            <Text style={styles.sectionTitle}>7. Contacto</Text>
            <Text style={styles.paragraph}>
              Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos a través de la sección
              de soporte en nuestra aplicación o enviando un correo electrónico a privacidad@fortu.com.
            </Text>

            <Text style={styles.paragraph}>
              Al utilizar nuestros Servicios, usted reconoce que ha leído, entendido y acepta esta Política de
              Privacidad.
            </Text>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Volver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.acceptButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: width * 0.85,
    maxHeight: height * 0.7,
    padding: 20,
    borderWidth: 6,
    borderColor: colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  scrollContent: {
    maxHeight: height * 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  acceptButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 12,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PrivacyPolicyModal

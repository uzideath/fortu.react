import type React from "react"
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from "react-native"
import { colors } from "src/styles/colors"

interface TermsConditionsModalProps {
  visible: boolean
  onClose: () => void
  onAccept: () => void
}

const { width, height } = Dimensions.get("window")

const TermsConditionsModal: React.FC<TermsConditionsModalProps> = ({ visible, onClose, onAccept }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Términos y condiciones</Text>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={true}>
            <Text style={styles.sectionTitle}>1. Introducción</Text>
            <Text style={styles.paragraph}>
              1.1 Bienvenido a Fortu (incluyendo sus subdominios, contenido, marcas y servicios). Fortu es una marca de
              Fortu S.A.S, una empresa constituida bajo las leyes de Colombia, con número de registro ******** y sede en
              ********
            </Text>

            <Text style={styles.paragraph}>
              1.2 Este documento ("Términos de Uso"), junto con los Términos de Juegos Suplementarios, el Aviso de
              Privacidad, la Política de Cookies y los Términos de Servicios (en adelante, los "Términos" o los
              "Términos del Sitio"), define los términos y condiciones del acuerdo entre Fortu ("nosotros", "nos",
              "nuestro") y cualquier persona que se registre y acceda al Sitio como usuario registrado ("Jugador",
              "Usuario", "usted", "su"), y, en la medida aplicable, a cualquier persona que acceda al Sitio como
              visitante. Debe leer y aceptar estos Términos cuidadosamente al registrar una cuenta en Fortu.com. Si en
              algún momento no está de acuerdo con los Términos, no podrá utilizar ni continuar utilizando el Sitio.
            </Text>

            <Text style={styles.paragraph}>
              1.3 Fortu se reserva el derecho de modificar estos Términos en cualquier momento, publicando los Términos
              modificados en el Sitio. Cualquier modificación entrará en vigor inmediatamente después de su publicación.
              Su uso continuado del Sitio después de la publicación de los Términos modificados constituirá su
              aceptación de dichos cambios.
            </Text>

            <Text style={styles.sectionTitle}>2. Definiciones</Text>
            <Text style={styles.paragraph}>
              "Fortu", "nosotros", "nos" o "nuestro" se refiere a la empresa propietaria y operadora de la aplicación
              Fortu.
            </Text>
            <Text style={styles.paragraph}>
              "Usuario", "usted" o "su" se refiere a cualquier persona que acceda o utilice nuestros Servicios.
            </Text>
            <Text style={styles.paragraph}>
              "Contenido" se refiere a toda la información y materiales que se encuentran en nuestros Servicios,
              incluyendo texto, imágenes, audio, video, gráficos, y software.
            </Text>

            <Text style={styles.sectionTitle}>3. Uso de los Servicios</Text>
            <Text style={styles.paragraph}>
              3.1 Elegibilidad: Para utilizar nuestros Servicios, usted debe tener al menos 18 años de edad y la
              capacidad legal para celebrar un contrato vinculante.
            </Text>
            <Text style={styles.paragraph}>
              3.2 Registro de Cuenta: Para acceder a ciertas funciones de nuestros Servicios, es posible que deba crear
              una cuenta. Usted es responsable de mantener la confidencialidad de su información de cuenta y contraseña,
              y de restringir el acceso a su dispositivo. Usted acepta la responsabilidad por todas las actividades que
              ocurran bajo su cuenta.
            </Text>
            <Text style={styles.paragraph}>
              3.3 Uso Prohibido: Usted acepta no utilizar nuestros Servicios para ningún propósito ilegal o prohibido
              por estos Términos. No puede utilizar nuestros Servicios de manera que pueda dañar, deshabilitar,
              sobrecargar o deteriorar nuestros Servicios, o interferir con el uso y disfrute de nuestros Servicios por
              parte de terceros.
            </Text>

            <Text style={styles.sectionTitle}>4. Contenido y Propiedad Intelectual</Text>
            <Text style={styles.paragraph}>
              4.1 Propiedad del Contenido: Todo el Contenido proporcionado a través de nuestros Servicios es propiedad
              de Fortu o de nuestros licenciantes y está protegido por leyes de propiedad intelectual.
            </Text>
            <Text style={styles.paragraph}>
              4.2 Licencia Limitada: Sujeto a su cumplimiento de estos Términos, le otorgamos una licencia limitada, no
              exclusiva, no transferible y revocable para acceder y utilizar nuestros Servicios para su uso personal y
              no comercial.
            </Text>

            <Text style={styles.sectionTitle}>5. Privacidad</Text>
            <Text style={styles.paragraph}>
              Su privacidad es importante para nosotros. Nuestra Política de Privacidad explica cómo recopilamos,
              utilizamos y protegemos su información personal. Al utilizar nuestros Servicios, usted acepta nuestra
              Política de Privacidad.
            </Text>

            <Text style={styles.sectionTitle}>6. Modificaciones</Text>
            <Text style={styles.paragraph}>
              Nos reservamos el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en
              vigor inmediatamente después de su publicación en nuestros Servicios. Su uso continuado de nuestros
              Servicios después de la publicación de las modificaciones constituye su aceptación de los Términos
              modificados.
            </Text>

            <Text style={styles.sectionTitle}>7. Terminación</Text>
            <Text style={styles.paragraph}>
              Podemos terminar o suspender su acceso a nuestros Servicios inmediatamente, sin previo aviso o
              responsabilidad, por cualquier razón, incluyendo, sin limitación, si usted incumple estos Términos.
            </Text>

            <Text style={styles.sectionTitle}>8. Limitación de Responsabilidad</Text>
            <Text style={styles.paragraph}>
              En ningún caso Fortu, sus directores, empleados, socios, agentes, proveedores o afiliados serán
              responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo, incluyendo, sin
              limitación, pérdida de beneficios, datos, uso, buena voluntad, u otras pérdidas intangibles, resultantes
              de su acceso o uso o incapacidad para acceder o usar los Servicios.
            </Text>

            <Text style={styles.sectionTitle}>9. Ley Aplicable</Text>
            <Text style={styles.paragraph}>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de Colombia, sin tener en cuenta sus
              disposiciones sobre conflictos de leyes.
            </Text>

            <Text style={styles.sectionTitle}>10. Contacto</Text>
            <Text style={styles.paragraph}>
              Si tiene alguna pregunta sobre estos Términos, por favor contáctenos a través de la sección de soporte en
              nuestra aplicación o enviando un correo electrónico a soporte@fortu.com.
            </Text>

            <Text style={styles.paragraph}>
              Al utilizar nuestros Servicios, usted reconoce que ha leído, entendido y acepta estar sujeto a estos
              Términos y Condiciones.
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

export default TermsConditionsModal

"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"

interface ColoredLoadingWheelProps {
  size?: number | "small" | "large"
  primaryColor?: string
  secondaryColor?: string
  segmentCount?: number
}

const ColoredLoadingWheel: React.FC<ColoredLoadingWheelProps> = ({
  size = "large",
  primaryColor = "#FEC937",
  secondaryColor = "#59CDF1",
  segmentCount = 8,
}) => {
  // Convertir tamaño a número
  const sizeNum = typeof size === "number" ? size : size === "small" ? 20 : 50

  // Referencia para la animación de rotación
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Crear animación de rotación continua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500, // Una rotación completa cada 1.5 segundos
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start()

    return () => {
      rotateAnim.stopAnimation()
    }
  }, [rotateAnim])

  // Crear un array con el número de segmentos
  const segments = Array(segmentCount).fill(0)

  // Calcular el ángulo para cada segmento
  const segmentAngle = 360 / segmentCount

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: sizeNum,
          height: sizeNum,
          transform: [
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        },
      ]}
    >
      {segments.map((_, index) => {
        // Alternar colores entre primario y secundario
        const segmentColor = index % 2 === 0 ? primaryColor : secondaryColor

        // Calcular el ángulo de inicio para este segmento
        const startAngle = index * segmentAngle

        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                width: sizeNum,
                height: sizeNum,
                backgroundColor: "transparent",
                position: "absolute",
                transform: [{ rotate: `${startAngle}deg` }],
              },
            ]}
          >
            <View
              style={{
                width: sizeNum / 10,
                height: sizeNum / 3,
                backgroundColor: segmentColor,
                borderRadius: sizeNum / 20,
                marginLeft: sizeNum / 2 - sizeNum / 20,
                opacity: 0.7 + (0.3 * index) / segmentCount, // Variar opacidad para efecto visual
              }}
            />
          </View>
        )
      })}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  segment: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
})

export default ColoredLoadingWheel

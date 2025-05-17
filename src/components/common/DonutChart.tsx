// src/components/common/DonutChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';

// Usando rutas absolutas para importaciones (si las necesitas)
// import { colors } from '@/styles/colors';

interface ChartDataItem {
  id: string;
  name: string;
  amount: number;
  color: string;
}

interface DonutChartProps {
  data: ChartDataItem[];
  size?: number;
  thickness?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  size = 220, 
  thickness = 30 
}) => {
  const radius = size / 2;
  const innerRadius = radius - thickness;
  const centerX = radius;
  const centerY = radius;
  const totalValue = data.reduce((sum, item) => sum + item.amount, 0);
  const formattedTotal = totalValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Si no hay datos, mostrar un círculo vacío
  if (data.length === 0 || totalValue === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius - thickness/2}
            stroke="#F5F5F5"
            strokeWidth={thickness}
            fill="transparent"
          />
        </Svg>
        <View style={[styles.hole, { width: innerRadius * 2, height: innerRadius * 2 }]}>
          <Text style={styles.text}>$0</Text>
        </View>
      </View>
    );
  }

  // Calcular los segmentos
  let startAngle = 0;
  const segments = data.map((item) => {
    const percentage = item.amount / totalValue;
    const angle = percentage * 2 * Math.PI;
    const segment = {
      ...item,
      startAngle,
      endAngle: startAngle + angle,
      percentage,
    };
    startAngle += angle;
    return segment;
  });

  // Función para convertir ángulos a coordenadas SVG
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInRadians: number) => {
    return {
      x: centerX + (radius * Math.cos(angleInRadians - Math.PI / 2)),
      y: centerY + (radius * Math.sin(angleInRadians - Math.PI / 2))
    };
  };

  // Función para crear el path de un arco
  const createArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G>
          {segments.map((segment, index) => {
            const outerRadius = radius - 1; // Pequeño ajuste para evitar bordes
            const innerRadius = radius - thickness + 1;
            
            // Crear arcos externo e interno
            const outerArc = createArc(centerX, centerY, outerRadius, segment.startAngle, segment.endAngle);
            const innerArc = createArc(centerX, centerY, innerRadius, segment.endAngle, segment.startAngle);
            
            // Crear path para el segmento
            const path = [
              outerArc,
              "L", centerX + innerRadius * Math.cos(segment.endAngle - Math.PI/2), 
                   centerY + innerRadius * Math.sin(segment.endAngle - Math.PI/2),
              innerArc,
              "L", centerX + outerRadius * Math.cos(segment.startAngle - Math.PI/2), 
                   centerY + outerRadius * Math.sin(segment.startAngle - Math.PI/2),
              "Z"
            ].join(" ");
            
            return (
              <Path
                key={segment.id}
                d={path}
                fill={segment.color}
              />
            );
          })}
        </G>
      </Svg>
      <View style={[styles.hole, { width: innerRadius * 2, height: innerRadius * 2 }]}>
        <Text style={styles.text}>${formattedTotal}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hole: {
    position: 'absolute',
    borderRadius: 1000, // Valor alto para asegurar forma circular
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
});

export default DonutChart;
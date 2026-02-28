import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface ColorStepperProps {
  label: string;
  color: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

export const ColorStepper: React.FC<ColorStepperProps> = React.memo(
  ({ label, color, value, max, onChange }) => {
    return (
      <View style={styles.row}>
        <View style={styles.labelRow}>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={[styles.btn, value <= 0 && styles.btnDisabled]}
            onPress={() => value > 0 && onChange(value - 1)}
            disabled={value <= 0}
          >
            <Text style={[styles.btnText, value <= 0 && styles.btnTextDisabled]}>-</Text>
          </TouchableOpacity>
          <Text style={styles.value}>{value}</Text>
          <TouchableOpacity
            style={[styles.btn, value >= max && styles.btnDisabled]}
            onPress={() => value < max && onChange(value + 1)}
            disabled={value >= max}
          >
            <Text style={[styles.btnText, value >= max && styles.btnTextDisabled]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  label: {
    fontSize: 13,
    color: 'rgba(252, 211, 77, 0.7)',
    fontWeight: 'bold',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  btnDisabled: {
    borderColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: 'transparent',
  },
  btnText: {
    fontSize: 16,
    color: '#fcd34d',
    fontWeight: 'bold',
  },
  btnTextDisabled: {
    color: 'rgba(252, 211, 77, 0.3)',
  },
  value: {
    fontSize: 16,
    color: '#fcd34d',
    fontWeight: 'bold',
    minWidth: 24,
    textAlign: 'center',
  },
});

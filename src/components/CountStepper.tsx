import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface CountStepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export const CountStepper: React.FC<CountStepperProps> = React.memo(
  ({ label, value, min, max, onChange }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={[styles.btn, value <= min && styles.btnDisabled]}
            onPress={() => value > min && onChange(value - 1)}
            disabled={value <= min}
          >
            <Text style={[styles.btnText, value <= min && styles.btnTextDisabled]}>-</Text>
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
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: 'rgba(252, 211, 77, 0.8)',
    fontWeight: 'bold',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontSize: 18,
    color: '#fcd34d',
    fontWeight: 'bold',
  },
  btnTextDisabled: {
    color: 'rgba(252, 211, 77, 0.3)',
  },
  value: {
    fontSize: 18,
    color: '#fcd34d',
    fontWeight: 'bold',
    minWidth: 28,
    textAlign: 'center',
  },
});

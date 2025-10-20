import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomSheetPicker, PickerOption } from './bottom-sheet-picker';

interface PickerInputProps<T extends string = string> {
  label: string;
  value: T;
  placeholder?: string;
  options: PickerOption<T>[];
  onSelect: (value: T) => void;
  pickerTitle: string;
  error?: string;
  disabled?: boolean;
}

export const PickerInput = <T extends string = string>({
  label,
  value,
  placeholder,
  options,
  onSelect,
  pickerTitle,
  error,
  disabled = false,
}: PickerInputProps<T>) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || '';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.inputWrapper, error && styles.inputWrapperError, disabled && styles.inputWrapperDisabled]}
        onPress={() => !disabled && setPickerVisible(true)}
        disabled={disabled}
      >
        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          value={displayValue}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          editable={false}
          pointerEvents="none"
        />
        <Ionicons name="chevron-down" size={20} color={disabled ? Colors.textSecondary : Colors.text} style={styles.icon} />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <BottomSheetPicker
        visible={pickerVisible}
        title={pickerTitle}
        options={options}
        selectedValue={value}
        onSelect={onSelect}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 5,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputWrapperError: {
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 15,
  },
  inputWrapperDisabled: {
    opacity: 0.6,
  },
  input: {
    backgroundColor: Colors.input,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 16,
    color: Colors.text,
  },
  inputDisabled: {
    backgroundColor: Colors.shapes,
  },
  icon: {
    position: 'absolute',
    right: 20,
    top: 18,
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
    marginTop: 5,
    marginLeft: 5,
  },
});

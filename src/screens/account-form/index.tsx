import { PickerOption } from '@/components/bottom-sheet-picker';
import { PickerInput } from '@/components/picker-input';
import { FormField } from '@/components/ui/form-field';
import { Header } from '@/components/ui/header';
import { WarningBanner } from '@/components/ui/warning-banner';
import { ACCOUNT_TYPE_OPTIONS } from '@/constants/account-types';
import { commonStyles } from '@/constants/common-styles';
import { Colors } from '@/constants/theme';
import { useAccounts } from '@/contexts/accounts.context';
import { useFormAnimation } from '@/hooks/useFormAnimation';
import { AccountFormData, accountFormSchema } from '@/schemas/account.schema';
import { AccountType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Animated,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export const AccountForm = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { accounts, saveAccount, suggestCode } = useAccounts();

  const [loading, setLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const isParentIdFromParams = !!(params.parentId && typeof params.parentId === 'string');

  const { getFieldAnimatedStyle, formScale, formOpacity } = useFormAnimation(5);

  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerTranslateY = useRef(new Animated.Value(-20)).current;

  const {
    control,
    handleSubmit: hookFormHandleSubmit,
    setValue,
    watch,
    setError,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      parentId: params.parentId && typeof params.parentId === 'string' ? params.parentId : undefined,
      code: '',
      name: '',
      type: 'receipt',
      acceptsEntries: true,
    },
  });

  const parentId = watch('parentId');

  const applyCodeMask = (text: string) => {
    return text.replace(/[^0-9.]/g, '').replace(/\.{2,}/g, '.');
  };

  const parentOptions = useMemo((): PickerOption[] => {
    const parents = accounts.filter((acc) => !acc.acceptsEntries);
    return [
      { label: 'Nova conta', value: '' },
      ...parents.map((acc) => ({
        label: `${acc.code} - ${acc.name}`,
        value: acc.id,
      })),
    ];
  }, [accounts]);

  const acceptsEntriesOptions: PickerOption[] = [
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' },
  ];

  useEffect(() => {
    const loadSuggestedCode = async () => {
      const suggestion = await suggestCode(parentId || undefined);

      if (suggestion.parentChanged) {
        setValue('parentId', suggestion.suggestedParentId || undefined);
        setWarningMessage(suggestion.reason || 'O pai foi alterado automaticamente');

        Animated.parallel([
          Animated.timing(bannerOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bannerTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }

      setValue('code', suggestion.suggestedCode);
    };

    loadSuggestedCode();
  }, [parentId, suggestCode, setValue, bannerOpacity, bannerTranslateY]);

  useEffect(() => {
    if (parentId) {
      const parent = accounts.find((acc) => acc.id === parentId);
      if (parent) {
        setValue('type', parent.type);
      }
    }
  }, [parentId, accounts, setValue]);

  const onSubmit = async (data: AccountFormData) => {
    setLoading(true);

    try {
      const result = await saveAccount({
        code: data.code,
        name: data.name,
        type: data.type,
        acceptsEntries: data.acceptsEntries,
        parentId: data.parentId || undefined,
      });

      if (result.success) {
        router.back();
      } else {
        if (result.fieldErrors && result.fieldErrors.length > 0) {
          result.fieldErrors.forEach((error) => {
            setError(error.field as keyof AccountFormData, {
              type: 'manual',
              message: error.message,
            });
          });
        } else {
          Alert.alert('Erro', result.errors.join('\n'));
        }
      }
    } catch {
      Alert.alert('Erro', 'Erro inesperado ao salvar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = hookFormHandleSubmit(onSubmit);

  const SaveButton = (
    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
      {loading ? <ActivityIndicator color={Colors.icon} /> : <Ionicons name="checkmark" size={28} color={Colors.icon} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Header title="Inserir Conta" onBack={() => router.back()} rightAction={SaveButton} />

      <Animated.View
        style={[
          commonStyles.roundedTopContainer,
          {
            opacity: formOpacity,
            transform: [{ scale: formScale }],
          },
        ]}
      >
        <WarningBanner
          message={warningMessage || ''}
          visible={!!warningMessage}
          animatedOpacity={bannerOpacity}
          animatedTranslateY={bannerTranslateY}
        />

        <KeyboardAwareScrollView
          ScrollViewComponent={ScrollView}
          bottomOffset={60}
          contentContainerStyle={styles.formContent}
          style={styles.scrollView}
        >
          <Animated.View style={getFieldAnimatedStyle(0)}>
            <Controller
              control={control}
              name="parentId"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <PickerInput
                  label="Conta pai"
                  value={value || ''}
                  options={parentOptions}
                  onSelect={(val) => {
                    if (val === '') setWarningMessage(null);
                    onChange(val || undefined);
                  }}
                  pickerTitle="Selecione a conta pai"
                  placeholder="Selecione a conta pai"
                  error={error?.message}
                  disabled={isParentIdFromParams}
                />
              )}
            />
          </Animated.View>

          <Animated.View style={getFieldAnimatedStyle(1)}>
            <Controller
              control={control}
              name="code"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormField label="Código" error={error?.message}>
                  <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={value}
                    onChangeText={(text) => onChange(applyCodeMask(text))}
                    onBlur={onBlur}
                    placeholder="Código sugerido automaticamente"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </FormField>
              )}
            />
          </Animated.View>

          <Animated.View style={getFieldAnimatedStyle(2)}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormField label="Nome" error={error?.message}>
                  <TextInput
                    style={[styles.input, error && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Nome da conta"
                    placeholderTextColor={Colors.textSecondary}
                  />
                </FormField>
              )}
            />
          </Animated.View>

          <Animated.View style={getFieldAnimatedStyle(3)}>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <PickerInput
                  label="Tipo"
                  value={value}
                  options={ACCOUNT_TYPE_OPTIONS}
                  onSelect={(val) => onChange(val as AccountType)}
                  pickerTitle="Selecione o tipo"
                  error={error?.message}
                  disabled={!!parentId}
                />
              )}
            />
          </Animated.View>

          <Animated.View style={getFieldAnimatedStyle(4)}>
            <Controller
              control={control}
              name="acceptsEntries"
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <PickerInput
                  label="Aceita lançamentos"
                  value={String(value)}
                  options={acceptsEntriesOptions}
                  onSelect={(val) => onChange(val === 'true')}
                  pickerTitle="Aceita lançamentos?"
                  error={error?.message}
                />
              )}
            />
          </Animated.View>
        </KeyboardAwareScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: Colors.input,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.danger,
  },
});

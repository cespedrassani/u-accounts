import { animateField, animateFormContainer } from '@/utils/animations';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface FormAnimationField {
  opacity: Animated.Value;
  translateY: Animated.Value;
}

interface UseFormAnimationReturn {
  fields: FormAnimationField[];
  formScale: Animated.Value;
  formOpacity: Animated.Value;
  getFieldAnimatedStyle: (index: number) => {
    opacity: Animated.Value;
    transform: { translateY: Animated.Value }[];
  };
}

/**
 * Hook para gerenciar animações de formulários
 * @param fieldCount - Número de campos a serem animados
 * @param startDelay - Delay inicial antes de começar as animações (padrão: 250ms)
 * @param fieldDelay - Delay entre cada campo (padrão: 50ms)
 */
export const useFormAnimation = (
  fieldCount: number,
  startDelay: number = 250,
  fieldDelay: number = 50
): UseFormAnimationReturn => {
  const formScale = useRef(new Animated.Value(0.95)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  const fields = useRef(
    Array.from({ length: fieldCount }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  useEffect(() => {
    animateFormContainer(formScale, formOpacity);

    fields.forEach((field, index) => {
      const delay = startDelay + index * fieldDelay;
      animateField(field.opacity, field.translateY, delay);
    });
  }, [fields, formScale, formOpacity, startDelay, fieldDelay]);

  const getFieldAnimatedStyle = (index: number) => ({
    opacity: fields[index].opacity,
    transform: [{ translateY: fields[index].translateY }],
  });

  return {
    fields,
    formScale,
    formOpacity,
    getFieldAnimatedStyle,
  };
};

import { CODE_LIMITS } from '@/constants/values';
import { z } from 'zod';

export const accountFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Código é obrigatório')
    .regex(/^[0-9]{1,3}(\.[0-9]{1,3})*$/, 'Formato inválido. Use: 999.999.999')
    .refine(
      (code) => {
        const segments = code.split('.');
        return segments.every((segment) => {
          const num = parseInt(segment, 10);
          return num >= CODE_LIMITS.MIN_SEGMENT_VALUE && num <= CODE_LIMITS.MAX_SEGMENT_VALUE;
        });
      },
      { message: `Cada segmento deve ser entre ${CODE_LIMITS.MIN_SEGMENT_VALUE} e ${CODE_LIMITS.MAX_SEGMENT_VALUE}` }
    ),
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  type: z.enum(['receipt', 'expense'], {
    errorMap: () => ({ message: 'Tipo deve ser Receita ou Despesa' }),
  }),
  acceptsEntries: z.boolean({
    errorMap: () => ({ message: 'Campo obrigatório' }),
  }),
  parentId: z.string().optional(),
});

export type AccountFormData = z.infer<typeof accountFormSchema>;

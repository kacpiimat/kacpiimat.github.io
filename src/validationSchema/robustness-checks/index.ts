import * as yup from 'yup';

export const robustnessCheckValidationSchema = yup.object().shape({
  result: yup.string().required(),
  model_id: yup.string().nullable(),
});

import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRobustnessCheck } from 'apiSdk/robustness-checks';
import { Error } from 'components/error';
import { robustnessCheckValidationSchema } from 'validationSchema/robustness-checks';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ModelInterface } from 'interfaces/model';
import { getModels } from 'apiSdk/models';
import { RobustnessCheckInterface } from 'interfaces/robustness-check';

function RobustnessCheckCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RobustnessCheckInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRobustnessCheck(values);
      resetForm();
      router.push('/robustness-checks');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RobustnessCheckInterface>({
    initialValues: {
      result: '',
      model_id: (router.query.model_id as string) ?? null,
    },
    validationSchema: robustnessCheckValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Robustness Check
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="result" mb="4" isInvalid={!!formik.errors?.result}>
            <FormLabel>Result</FormLabel>
            <Input type="text" name="result" value={formik.values?.result} onChange={formik.handleChange} />
            {formik.errors.result && <FormErrorMessage>{formik.errors?.result}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ModelInterface>
            formik={formik}
            name={'model_id'}
            label={'Select Model'}
            placeholder={'Select Model'}
            fetcher={getModels}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'robustness_check',
    operation: AccessOperationEnum.CREATE,
  }),
)(RobustnessCheckCreatePage);

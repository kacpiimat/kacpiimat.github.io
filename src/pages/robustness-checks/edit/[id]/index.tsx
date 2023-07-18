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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRobustnessCheckById, updateRobustnessCheckById } from 'apiSdk/robustness-checks';
import { Error } from 'components/error';
import { robustnessCheckValidationSchema } from 'validationSchema/robustness-checks';
import { RobustnessCheckInterface } from 'interfaces/robustness-check';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ModelInterface } from 'interfaces/model';
import { getModels } from 'apiSdk/models';

function RobustnessCheckEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RobustnessCheckInterface>(
    () => (id ? `/robustness-checks/${id}` : null),
    () => getRobustnessCheckById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RobustnessCheckInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRobustnessCheckById(id, values);
      mutate(updated);
      resetForm();
      router.push('/robustness-checks');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RobustnessCheckInterface>({
    initialValues: data,
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
            Edit Robustness Check
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(RobustnessCheckEditPage);

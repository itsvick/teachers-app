import { createCohort } from '@/services/CreateUserService';
import useSubmittedButtonStore from '@/store/useSubmittedButtonStore';
import { FormContext, FormContextType } from '@/utils/app.constant';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Divider,
  Fade,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import DynamicForm from '../DynamicForm';
import FormButtons from '../FormButtons';
import { GenerateSchemaAndUiSchema } from '../GeneratedSchemas';
import { showToastMessage } from '../Toastify';
import { useFormRead } from '@/hooks/useFormRead';
import Loader from '../Loader';
import DependentFields from './DependentFields';

interface CreateBlockModalProps {
  open: boolean;
  handleClose: () => void;
  onCenterAdded: () => void;
}

interface CustomField {
  fieldId: any;
  value: any;
}

interface CohortDetails {
  name: string;
  type: string;
  parentId: string | null;
  customFields: CustomField[];
}

const CreateCenterModal: React.FC<CreateBlockModalProps> = ({
  open,
  handleClose,
  onCenterAdded,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [schema, setSchema] = React.useState<any>();
  const [uiSchema, setUiSchema] = React.useState<any>();
  const [formData, setFormData] = useState<any>();
  const { data: formResponse, isPending } = useFormRead(
    FormContext.COHORTS,
    FormContextType.COHORT
  );
  const [customFormData, setCustomFormData] = useState<any>();
  const [areDependentFieldsFilled, setAreDependentFieldsFilled] =
    useState(false);

  const setSubmittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.setSubmittedButtonStatus
  );

  function removeHiddenFields(formResponse: any) {
    return {
      ...formResponse,
      fields: formResponse.fields.filter((field: any) => !field.isHidden),
    };
  }

  useEffect(() => {
    if (formResponse) {
      const updatedFormResponse = removeHiddenFields(formResponse);
      if (updatedFormResponse) {
        let { schema, uiSchema } = GenerateSchemaAndUiSchema(
          updatedFormResponse,
          t
        );
        setSchema(schema);
        setUiSchema(uiSchema);
        setCustomFormData(formResponse);
      }
    }
  }, [formResponse]);

  const handleDependentFieldsChange = (areFieldsFilled: boolean) => {
    setAreDependentFieldsFilled(areFieldsFilled);
  };

  const handleSubmit = async (
    data: IChangeEvent<any, RJSFSchema, any>,
    event: React.FormEvent<any>
  ) => {
    setTimeout(() => {
      setFormData(data.formData);
    });
  };

  useEffect(() => {
    if (formData) {
      handleButtonClick();
    }
  }, [formData]);

  const handleButtonClick = async () => {
    console.log('Form data:', formData);
    setSubmittedButtonStatus(true);
    if (formData) {
      console.log('Form data submitted:', formData);

      const parentId = localStorage.getItem('blockParentId');
      const cohortDetails: CohortDetails = {
        name: formData.name,
        type: 'COHORT',
        parentId: parentId,
        customFields: [],
      };
      if (typeof window !== 'undefined' && window.localStorage) {
        const fieldData = JSON.parse(localStorage.getItem('fieldData') ?? '');
        const bmgsData = JSON.parse(localStorage.getItem('BMGSData') ?? '');
        Object.entries(formData).forEach(([fieldKey]) => {
          const fieldSchema = schema.properties[fieldKey];
          const fieldId = fieldSchema?.fieldId;
          if (fieldId !== null) {
            cohortDetails.customFields.push({
              fieldId: fieldId,
              value: formData.cohort_type,
            });
            cohortDetails.customFields.push({
              fieldId: fieldData?.state?.stateId,
              value: [fieldData?.state?.stateCode],
            });
            cohortDetails.customFields.push({
              fieldId: fieldData?.state?.districtId,
              value: [fieldData?.state?.districtCode],
            });
            cohortDetails.customFields.push({
              fieldId: fieldData?.state?.blockId,
              value: [fieldData?.state?.blockCode],
            });
          }
          if (bmgsData) {
            cohortDetails.customFields.push({
              fieldId: bmgsData.board.fieldId,
              value: bmgsData.board.boardName,
            });
            cohortDetails.customFields.push({
              fieldId: bmgsData.medium.fieldId,
              value: bmgsData.medium.mediumName,
            });
            cohortDetails.customFields.push({
              fieldId: bmgsData.grade.fieldId,
              value: bmgsData.grade.gradeName,
            });
            cohortDetails.customFields.push({
              fieldId: bmgsData.subject.fieldId,
              value: bmgsData.subject.subjectName.join(', '),
            });
          }
        });
      }
      cohortDetails.customFields = Array.from(
        new Map(
          cohortDetails.customFields.map((item) => [item.fieldId, item])
        ).values()
      );

      const cohortData = await createCohort(cohortDetails);
      if (cohortData) {
        showToastMessage(t('CENTERS.CENTER_CREATED'), 'success');
        onCenterAdded();
        handleClose();
        localStorage.removeItem('BMGSData');
      }
    }
  };

  const handleChange = (event: IChangeEvent<any>) => {
    console.log('Form data changed:', event.formData);
  };

  const handleError = (errors: any) => {
    console.log('Form errors:', errors);
  };

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            backgroundColor: 'white',
            boxShadow: 24,
            maxWidth: 400,
            width: '90%',
            margin: 'auto',
            borderRadius: 3,
            outline: 'none',
            p: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              color={theme?.palette?.text?.primary}
            >
              {t('CENTERS.NEW_CENTER')}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: theme?.palette?.text?.primary }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: -2, mx: -2 }} />

          {isPending && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
            </Box>
          )}
          {!isPending && schema && uiSchema && (
            <>
              <DependentFields
                customFormData={customFormData}
                onFieldsChange={handleDependentFieldsChange}
              />
              {areDependentFieldsFilled && (
                <DynamicForm
                  schema={schema}
                  uiSchema={uiSchema}
                  onSubmit={handleSubmit}
                  onChange={handleChange}
                  onError={handleError}
                  widgets={{}}
                  showErrorList={true}
                >
                  <FormButtons
                    formData={formData}
                    onClick={handleButtonClick}
                    isCreateCentered={true}
                    isCreatedFacilitator={false}
                  />
                </DynamicForm>
              )}
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateCenterModal;

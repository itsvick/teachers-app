import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const CreatePassword = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showValidationMessages, setShowValidationMessages] = useState(false);

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    setShowValidationMessages(!!value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmPasswordError(value !== password);
  };

  const validatePassword = (value: any) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const isValid =
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isValidLength;
    setPasswordError(!isValid);

    return isValid;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid =
    !passwordError && !confirmPasswordError && password && confirmPassword;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        px: '16px',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          '@media (min-width: 900px)': {
            width: '50%',
          },
          width: '100%',
          marginTop: '8rem',
        }}
      >
        <Box
          sx={{
            color: theme.palette.warning['300'],
            fontWeight: '400',
            fontSize: '22px',
            textAlign: 'center',
          }}
        >
          {t('LOGIN_PAGE.CREATE_STRONG_PASSWORD')}
        </Box>
        <Box
          sx={{
            color: theme.palette.warning['300'],
            fontWeight: '400',
            fontSize: '14px',
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          {t('LOGIN_PAGE.CREATE_NEW')}
        </Box>

        <Box
          sx={{
            width: '668px',
            '@media (max-width: 768px)': {
              width: '100%',
            },
            '@media (min-width: 900px)': {
              width: '100%',
            },
          }}
          margin={'3.2rem 0 0'}
        >
          <TextField
            id="password"
            InputLabelProps={{
              shrink: true,
            }}
            type={'password'}
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            FormHelperTextProps={{
              sx: {
                color: passwordError
                  ? theme.palette.warning['A200']
                  : 'inherit',
              },
            }}
            helperText={passwordError && t('LOGIN_PAGE.YOUR_PASSWORD_NEEDS_TO')}
            label={t('LOGIN_PAGE.PASSWORD')}
            fullWidth
            sx={{
              '.MuiFormHelperText-root.Mui-error': {
                color: theme.palette.warning['A200'],
              },
            }}
          />
        </Box>

        {showValidationMessages && passwordError && (
          <Box sx={{ mt: 1, pl: '16px' }}>
            <Typography
              variant="body2"
              color={passwordError ? 'error' : 'textPrimary'}
              sx={{
                color: theme.palette.warning['A200'],
                fontSize: '16px',
                fontWeight: '400',
              }}
            >
              <Box
                sx={{
                  color:
                    password.match(/[A-Z]/) && password.match(/[a-z]/)
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                }}
              >
                ✓ {t('LOGIN_PAGE.INCLUDE_BOTH')}
              </Box>
              <Box
                sx={{
                  color: password.match(/\d/)
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                }}
              >
                ✓ {t('LOGIN_PAGE.INCLUDE_NUMBER')}
              </Box>
              <Box
                sx={{
                  color: password.match(/[!@#$%^&*(),.?":{}|<>]/)
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                }}
              >
                ✓ {t('LOGIN_PAGE.INCLUDE_SPECIAL')}
              </Box>
              <Box
                sx={{
                  color:
                    password.length >= 8
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  fontSize: '12px',
                  fontWeight: '400',
                }}
              >
                ✓ {t('LOGIN_PAGE.MUST_BE_AT')}
              </Box>
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            width: '668px',
            '@media (max-width: 768px)': {
              width: '100%',
            },
            '@media (min-width: 900px)': {
              width: '100%',
            },
          }}
          margin={'2rem 0 0'}
        >
          <TextField
            id="confirm-password"
            InputLabelProps={{
              shrink: true,
            }}
            type={'password'}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            error={confirmPasswordError}
            helperText={confirmPasswordError && t('LOGIN_PAGE.NOT_MATCH')}
            label={t('LOGIN_PAGE.CONFIRM_PASSWORD')}
            fullWidth
            sx={{
              '.MuiFormHelperText-root.Mui-error': {
                color: theme.palette.error.main,
              },
            }}
          />
        </Box>

        <Box>
          <Box
            alignContent={'center'}
            textAlign={'center'}
            marginTop={'2.5rem'}
            width={'100%'}
          >
            <Button
              variant="contained"
              type="submit"
              fullWidth={true}
              sx={{
                '@media (min-width: 900px)': {
                  width: '50%',
                },
              }}
              disabled={!isFormValid}
            >
              {t('LOGIN_PAGE.RESET_PASSWORD')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default CreatePassword;

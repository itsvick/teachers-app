'use client';

import { Button, FormControl, IconButton, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Drawer from '@mui/material/Drawer';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import config from '../../config.json';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import useStore from '@/store/store';
import { accessGranted } from '@/utils/Helper';
import { accessControl } from '../../app.config';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import checkBook from '../assets/images/checkbook.svg';
import board from '../assets/images/Board.svg';
import Image from 'next/image';
import { useDirection } from '../hooks/useDirection';
import { isEliminatedFromBuild } from '../../featureEliminationUtil';
import { getAcademicYear } from '../services/AcademicYearService';
import { AcademicYear } from '@/utils/Interfaces';

interface DrawerProps {
  toggleDrawer?: (open: boolean) => () => void;
  open: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  handleToggleDrawer?: (open: boolean) => () => void;
}

const MenuDrawer: React.FC<DrawerProps> = ({
  toggleDrawer,
  open,
  language,
  setLanguage,
  handleToggleDrawer,
}) => {
  const theme = useTheme<any>();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [isOpen, setIsOpen] = useState(open);
  const [academicYearList, setAcademicYearList] = useState<AcademicYear[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  const { i18n, t } = useTranslation();
  const router = useRouter();
  const store = useStore();
  const userRole = store.userRole;
  const { isRTL } = useDirection();

  useEffect(() => setIsOpen(open), [open]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedList = localStorage.getItem('academicYearList');
      try {
        setAcademicYearList(storedList ? JSON.parse(storedList) : []);
        const selectedAcademicYearId = localStorage.getItem('academicYearId');
        setSelectedSessionId(selectedAcademicYearId ?? '');
        console.log('Retrieved academicYearList:', academicYearList);
      } catch (error) {
        console.error('Error parsing stored academic year list:', error);
        setAcademicYearList([]);
        setSelectedSessionId('');
      }
    }
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    setLanguage(newLocale);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('preferredLanguage', newLocale);
      router.replace(router.pathname, router.asPath, { locale: newLocale });
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedSessionId(event.target.value);
    console.log('selected academic year id', event.target.value);
    localStorage.setItem('academicYearId', event.target.value);
    window.location.reload();
  };

  const closeDrawer = () => {
    if (toggleDrawer) {
      toggleDrawer(false)();
    } else if (handleToggleDrawer) {
      handleToggleDrawer(false)();
    }
  };

  const navigateToDashboard = () => {
    closeDrawer();
    router.push('/dashboard');
  };

  const navigateToWorkspace = () => {
    closeDrawer();
    router.push('/workspace/content/create');
  };

  const navigateToObservation = () => {
    closeDrawer();
    router.push('/observation');
  };

  const isDashboard = router.pathname === '/dashboard';
  const isTeacherCenter = router.pathname.includes('/centers');
  const isCoursePlanner = router.pathname.includes('/course-planner');
  const isObservation = router.pathname.includes('/observation');
  const isWorkspace = router.pathname.includes('/workspace/');

  const isAssessments = router.pathname.includes('/assessments');
  const isBoard = router.pathname.includes('/board-enrollment');

  return (
    <Drawer
      open={isDesktop || isOpen}
      onClose={closeDrawer}
      transitionDuration={{ enter: 500, exit: 500 }}
      anchor={isRTL ? 'right' : 'left'}
      className="backgroundFaded"
      variant={isDesktop ? 'persistent' : 'temporary'}
      sx={{
        '& .MuiPaper-root': {
          borderRight: `1px solid ${theme.palette.warning['A100']}`,
          zIndex: '998 !important',
          left: isRTL ? '0px !important' : '0px !important',

          width: isRTL ? '350px !important' : 'unset !important',
        },
      }}
    >
      <Box
        sx={{ padding: '16px 16px 12px 16px', width: '350px' }}
        role="presentation"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            className="fs-14 fw-500"
            sx={{ color: theme.palette.warning['A200'] }}
          >
            {t('DASHBOARD.MENU')}
          </Box>
          {!isDesktop && (
            <Box>
              <IconButton onClick={closeDrawer}>
                <ClearIcon sx={{ color: theme.palette.warning['300'] }} />
              </IconButton>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '22px 0 15px 0',
            gap: '30px',
          }}
        >
          <Box sx={{ flexBasis: '30%' }} className="joyride-step-5">
            <FormControl className="drawer-select" sx={{ width: '100%' }}>
              <Select
                value={i18n.language} // Directly use the language from i18n
                onChange={handleChange}
                displayEmpty
                sx={{
                  borderRadius: '0.5rem',
                  color: theme.palette.warning['200'],
                  width: '100%',
                  '& .MuiSelect-icon': {
                    right: isRTL ? 'unset' : '7px',
                    left: isRTL ? '7px' : 'unset',
                  },
                  '& .MuiSelect-select': {
                    paddingRight: isRTL ? '10px' : '32px',
                    paddingLeft: isRTL ? '32px' : '12px',
                  },
                }}
              >
                {config?.languages.map((lang) => (
                  <MenuItem value={lang.code} key={lang.code}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flexBasis: '70%' }}>
            <FormControl className="drawer-select" sx={{ width: '100%' }}>
              <Select
                onChange={handleSelectChange}
                value={selectedSessionId}
                className="select-languages"
                displayEmpty
                sx={{
                  borderRadius: '0.5rem',
                  color: theme.palette.warning['200'],
                  width: '100%',
                  marginBottom: '0rem',
                  '& .MuiSelect-icon': {
                    right: isRTL ? 'unset' : '7px',
                    left: isRTL ? '7px' : 'unset',
                  },
                  '& .MuiSelect-select': {
                    paddingRight: isRTL ? '10px !important' : '32px !important',
                    paddingLeft: isRTL ? '32px' : '12px',
                  },
                }}
              >
                {academicYearList.map(({ id, session }) => (
                  <MenuItem key={id} value={id}>
                    {session}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box>
          <Button
            className="fs-14"
            sx={{
              gap: '10px',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: isDashboard
                ? theme.palette.primary.main
                : 'transparent',
              padding: isDashboard
                ? '16px 18px !important'
                : '0px 18px !important',
              marginTop: '25px',
              color: isDashboard ? '#2E1500' : theme.palette.warning.A200,
              fontWeight: isDashboard ? '600' : 500,
              '&:hover': {
                background: isDashboard
                  ? theme.palette.primary.main
                  : 'transparent',
              },
            }}
            startIcon={
              <DashboardOutlinedIcon sx={{ fontSize: '24px !important' }} />
            }
            onClick={navigateToDashboard}
          >
            {t('DASHBOARD.DASHBOARD')}
          </Button>
        </Box>
        <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14 joyride-step-6"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: isTeacherCenter
                ? theme.palette.primary.main
                : 'transparent',

              padding: isTeacherCenter
                ? '16px 18px !important'
                : '0px 18px !important',
              color: isTeacherCenter ? '#2E1500' : theme.palette.warning.A200,
              fontWeight: isTeacherCenter ? '600' : 500,
              '&:hover': {
                background: isTeacherCenter
                  ? theme.palette.primary.main
                  : 'transparent',
              },
              marginTop: '15px',
              gap: '10px',
            }}
            startIcon={
              <LocalLibraryOutlinedIcon sx={{ fontSize: '24px !important' }} />
            }
            onClick={() => {
              router.push(`/centers`); // Check route
            }}
          >
            {accessGranted('showTeachingCenter', accessControl, userRole)
              ? t('DASHBOARD.TEACHING_CENTERS')
              : t('DASHBOARD.MY_TEACHING_CENTERS')}
          </Button>
        </Box>
        <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: isObservation
                ? theme.palette.primary.main
                : 'transparent',
              gap: '10px',
              padding: isObservation
                ? '16px 18px !important'
                : '0px 18px !important',
              color: isObservation ? '#2E1500' : theme.palette.warning.A200,
              fontWeight: isObservation ? '600' : 500,
              '&:hover': {
                background: isObservation
                  ? theme.palette.primary.main
                  : 'transparent',
              },
              marginTop: '15px',
            }}
            startIcon={<EditNoteIcon sx={{ fontSize: '24px !important' }} />}
            onClick={navigateToObservation}
          >
            {t('COMMON.OBSERVATIONS_FORMS')}
          </Button>
        </Box>
        <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14 joyride-step-7"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: isCoursePlanner
                ? theme.palette.primary.main
                : 'transparent',

              padding: isCoursePlanner
                ? '16px 18px !important'
                : '0px 18px !important',
              color: isCoursePlanner ? '#2E1500' : theme.palette.warning.A200,
              fontWeight: isCoursePlanner ? '600' : 500,
              '&:hover': {
                background: isCoursePlanner
                  ? theme.palette.primary.main
                  : 'transparent',
              },
              marginTop: '15px',
              gap: '10px',
            }}
            startIcon={
              <Image
                src={checkBook}
                alt="CheckBook Icon"
                width={24}
                height={24}
              />
            }
            onClick={() => {
              router.push(`/course-planner`);
            }}
          >
            {t('COURSE_PLANNER.COURSE_PLANNER')}
          </Button>
        </Box>
        {!isEliminatedFromBuild('Assessments', 'feature') && (
          <Box sx={{ marginTop: '18px' }}>
            <Button
              className="fs-14 joyride-step-8"
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                background: isAssessments
                  ? theme.palette.primary.main
                  : 'transparent',

                padding: isAssessments
                  ? '16px 18px !important'
                  : '0px 18px !important',
                color: isAssessments ? '#2E1500' : theme.palette.warning.A200,
                fontWeight: isAssessments ? '600' : 500,
                '&:hover': {
                  background: isAssessments
                    ? theme.palette.primary.main
                    : 'transparent',
                },
                marginTop: '15px',
                gap: '10px',
              }}
              startIcon={
                <EventAvailableOutlinedIcon
                  sx={{ fontSize: '24px !important' }}
                />
              }
              onClick={() => {
                router.push(`/assessments`);
              }}
            >
              {t('ASSESSMENTS.ASSESSMENTS')}
            </Button>
          </Box>
        )}
        <Box>
          <Button
            className="fs-14"
            sx={{
              gap: '10px',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: isWorkspace
                ? theme.palette.primary.main
                : 'transparent',
              padding: isWorkspace
                ? '16px 18px !important'
                : '0px 18px !important',
              marginTop: '25px',
              color: isWorkspace ? '#2E1500' : theme.palette.warning.A200,
              fontWeight: isWorkspace ? '600' : 500,
              '&:hover': {
                background: isWorkspace
                  ? theme.palette.primary.main
                  : 'transparent',
              },
            }}
            startIcon={
              <DashboardOutlinedIcon sx={{ fontSize: '24px !important' }} />
            }
            onClick={navigateToWorkspace}
          >
            {t('DASHBOARD.WORKSPACE')}
          </Button>
        </Box>

        {/* <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14 joyride-step-8"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: isBoard ? theme.palette.primary.main : 'transparent',
              gap: '10px',
              padding: isBoard ? '16px 18px !important' : '0px 18px !important',
              color: isBoard ? '#2E1500' : theme.palette.warning.A200,
              fontWeight: isBoard ? '600' : 500,
              '&:hover': {
                background: isBoard
                  ? theme.palette.primary.main
                  : 'transparent',
              },
              marginTop: '15px',
            }}
            startIcon={
              <Image src={board} alt="badge Icon" width={24} height={24} />
            }
            onClick={() => {
              router.push(`/board-enrollment`);
            }}
          >
            {t('BOARD_ENROLMENT.BOARD_ENROLLMENT')}
          </Button>
        </Box> */}
        <Box sx={{ marginTop: '18px' }}>
          <Button
            className="fs-14"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              background: 'transparent',
              padding: '0px 18px !important',
              gap: '10px',
              color: theme.palette.secondary.main,
              fontWeight: 500,
              '&:hover': {
                background: 'transparent',
              },
              marginTop: '15px',
            }}
            endIcon={<ErrorOutlineIcon sx={{ fontSize: '18px !important' }} />}
            onClick={() => {
              localStorage.removeItem('hasSeenTutorial');
              setTimeout(() => {
                closeDrawer();
                router.push(`/`);
              }, 0);
            }}
          >
            {t('GUIDE_TOUR.LEARN_HOW_TO_USE')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;

import React from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
interface StudentsStatsListProps {
  name: string;
  presentPercent: number;
  classesMissed: number;
  userId?: string;
  cohortId?: string;
}

const StudentsStatsList: React.FC<StudentsStatsListProps> = ({
  name,
  presentPercent,
  classesMissed,
  userId,
  cohortId,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const textColor =
    presentPercent > 60 ? theme.palette.success.main : theme.palette.error.main;

  //   const handleStudentDetails = () => {
  //     router.push(`/student-details/${cohortId}/${userId}`);
  //   };

  return (
    <Stack>
      <Box
        height="60px"
        borderTop={`1px solid  ${theme.palette.warning['300']}`}
        margin="0px"
        alignItems={'center'}
        // padding="1rem"
      >
        <Grid
          container
          alignItems="center"
          textAlign={'center'}
          justifyContent="space-between"
          p={2}
        >
          <Grid item xs={4} textAlign={'left'}>
            <Link href={`/learner-profile/${userId}`}> {name}</Link>
          </Grid>
          <Grid item xs={4}>
            <Typography
              fontSize="1rem"
              fontWeight="bold"
              lineHeight="1.5rem"
              // color={theme.palette.text.primary}
              color={textColor}
              textAlign="center"
            >
              {presentPercent}%
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              fontSize="1rem"
              fontWeight="bold"
              lineHeight="1.5rem"
              color={theme.palette.text.primary}
              textAlign="center"
            >
              {classesMissed}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default StudentsStatsList;
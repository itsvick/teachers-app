import dynamic from 'next/dynamic';

import Header from '@/components/Header';
import ObservationCard from '@/components/ObservationCard';
import { useEffect, useState } from 'react';
import { Box, useTheme , Typography} from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { GetStaticPaths } from 'next';
import { fetchQuestion } from '@/services/ObservationServices';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';

const ObservationComponent = dynamic(
  () => import('@/components/observations/ObservationComponent'),
  {
    ssr: false,
    // loading: () => <p>Loading Questionnaire App...</p>,
  }
);

const ObservationQuestions: React.FC = () => {
  const router = useRouter();
  const { Id } = router.query;
  const { entityId } = router.query;
  const { observationName } = router.query;

  const [questionResponse, setQuestionResponseResponse] =
  useState<any>(null);
  const theme = useTheme<any>();

  useEffect(() => {
    const fetchQuestionsList = async () => {
      try {
       const observationId=Id;
        //const entityId=entityId;  
        if(observationId && Id)
        {
          const response=await fetchQuestion({observationId,entityId})
          const combinedData = {
            solution: response.solution,
            assessment: {
              ...response.assessment, // Spread all properties from assessment

            }
          };
       
          setQuestionResponseResponse(
            combinedData
          )
          console.log("setQuestionResponseResponse", combinedData)
        }
      } catch (error) {
        console.error('Error fetching cohort list', error);
      }
    };
    fetchQuestionsList();
  }, [Id, entityId]);
  
  return (
    <Box>
      <Header />
      <ObservationComponent observationName={observationName} observationQuestions={questionResponse} />
    </Box>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default ObservationQuestions;
import React, { useEffect } from 'react';
// Import necessary modules
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// const Login = dynamic(() => import('./Login'), { ssr: false });
// const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });

const Home: React.FC = () => {
  const {  push } = useRouter();
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const refreshToken = localStorage.getItem('refreshToken');
      setLoading(false);
      if (refreshToken) {
        push('/dashboard');
      } else {
        push('/login', undefined, { locale: 'en' });
      }
    }
  }, []);

  return (
    <>
      {loading && <p>{t('COMMON.LOADING')}...</p>}
    </>
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

export default Home;

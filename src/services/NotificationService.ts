import { SendCredentialsRequest } from '@/utils/Interfaces';
import { post } from './RestClient';
import { toPascalCase } from '@/utils/Helper';

export const sendCredentialService = async ({
  isQueue,
  context,
  key,
  replacements,
  email,
}: SendCredentialsRequest): Promise<any> => {
  const apiUrl: string = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/notification/send`;
  try {
    const response = await post(apiUrl, {
      isQueue,
      context,
      key,
      replacements,
      email,
    });
    return response?.data?.result;
  } catch (error) {
    console.error('error in sending mail', error);

    return error;
  }
};

export const sendEmailOnFacilitatorCreation = async (
  name: string,
  username: string,
  password: string,
  email: string
) => {
  const replacements = {
    '{FirstName}': toPascalCase(name),
    '{UserName}': username,
    '{Password}': password,
  };

  const sendTo = {
    receipients: [email],
  };

  return sendCredentialService({
    isQueue: false,
    context: 'USER',
    key: 'onFacilitatorCreated',
    replacements,
    email: sendTo,
  });
};

export const sendEmailOnLearnerCreation = async (
  name: string,
  username: string,
  password: string,
  email: string,
  learnerName: string
) => {
  const replacements = {
    '{FirstName}': toPascalCase(name),
    '{UserName}': username,
    '{Password}': password,
    '{LearnerName}': learnerName,
  };

  const sendTo = {
    receipients: [email],
  };

  return sendCredentialService({
    isQueue: false,
    context: 'USER',
    key: 'onLearnerCreated',
    replacements,
    email: sendTo,
  });
};

import { Response } from 'express';

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  id: string,
): void => {
  res.cookie('accessToken', accessToken, {
    httpOnly: false, // It should be tru on Prod
    secure: false, // It should be tru on Prod
    sameSite: 'lax',
  });

  res.cookie('id', id, {
    httpOnly: false, // It should be tru on Prod
    secure: false, // It should be tru on Prod
    sameSite: 'lax',
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.cookie('accessToken', '', {
    httpOnly: false, // It should be tru on Prod
    secure: false, // It should be tru on Prod
    sameSite: 'lax',
    expires: new Date(0),
  });

  res.cookie('id', '', {
    httpOnly: false, // It should be tru on Prod
    secure: false, // It should be tru on Prod
    sameSite: 'lax',
    expires: new Date(0),
  });
};

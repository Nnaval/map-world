'use client'

import React from 'react';
import { Session } from 'next-auth'; // Import Session type from next-auth
import { SessionProvider } from 'next-auth/react';

const Provider = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
};

export default Provider;

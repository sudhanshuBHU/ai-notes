"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';

const ToastProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  )
}

export default ToastProvider;
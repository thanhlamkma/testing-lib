import React from 'react';

export const Dashboard = React.lazy(() => delayForDemo(import('@/pages/dashboard/Dashboard')));
export const About = React.lazy(() => delayForDemo(import('@/pages/about/About')));
export const Setting = React.lazy(() => delayForDemo(import('@/pages/setting/Setting')));
export const FlowProvider = React.lazy(() => delayForDemo(import('@/pages/flow/FlowProvider')));
export const TestPage = React.lazy(() => delayForDemo(import('@/pages/test/TestPage')));
export const Wedding = React.lazy(() => delayForDemo(import('@/pages/wedding/Wedding')));

function delayForDemo<T>(promise: Promise<T>) {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  }).then(() => promise);
}

import { PropsWithChildren } from 'react';
import { LearnerShell } from '../../components/shells/LearnerShell';

export default function AppLayout({ children }: PropsWithChildren) {
  return <LearnerShell>{children}</LearnerShell>;
}

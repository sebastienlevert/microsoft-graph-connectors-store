import * as React from 'react';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

export interface ILoadingProps {
  message?: string;
}

export const Loading: React.FunctionComponent<ILoadingProps> = (props: ILoadingProps) => {
  return <Spinner label={props.message ? props.message : 'Loading...'} />;
};

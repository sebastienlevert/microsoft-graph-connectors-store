import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import { mergeStyles } from '@fluentui/react';
import { RecoilRoot } from 'recoil';
import { Loading } from './components/Loading';

// Inject some global styles
mergeStyles({
  ':global(body,html,#root)': {
    margin: 0,
    padding: 0,
    height: '100vh',
  },
});

ReactDOM.render(
  <RecoilRoot>
    <React.Suspense fallback={<Loading />}>
      <App />
    </React.Suspense>
  </RecoilRoot>,
  document.getElementById('root')
);

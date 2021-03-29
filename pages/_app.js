import React, { useMemo } from 'react'
import { TinaProvider, TinaCMS } from 'tinacms'
import '../styles/styles.css'
import { MarkdownFieldPlugin } from 'react-tinacms-editor'
import { GitClient, GitMediaStore } from '@tinacms/git-client'
import { GlobalStyles as TinaStyles } from '@tinacms/styles'

import {resources} from '../i18n/Strings';
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n';

// import { I18nProvider } from '@react-aria/i18n'
// import { I18nProvider, FormattedString } from "i18nlib";


const App = ({ Component, pageProps }) => {

  const gitClient = useMemo(() => {
    return new GitClient(`/___tina`)
  }, [])
  const cms = useMemo(() => {
    return new TinaCMS({
      enabled: process.env.NODE_ENV !== "production",
      sidebar: true,
      toolbar: { hidden: false },
      plugins: [MarkdownFieldPlugin], 
      apis: {
        git: gitClient,
      },
      media: {
        store: new GitMediaStore(gitClient),
      },
    })
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <TinaProvider cms={cms}>
        <div className="container">
          <TinaStyles />
          <Component {...pageProps} />
        </div>
      </TinaProvider>
    </I18nextProvider>
  )
}

export default App
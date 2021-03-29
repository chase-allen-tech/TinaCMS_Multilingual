import Head from 'next/head'
import { parseMdFile } from '../helpers/markdown'
import ReactMarkdown from 'react-markdown'
import { useForm, usePlugin, useCMS } from 'tinacms'
import { InlineForm, InlineText, InlineBlocks, InlineField } from 'react-tinacms-inline'
import { InlineWysiwyg } from 'react-tinacms-editor'
// import ProductCard from '../components/productCard'
// import ProductList from '../components/productList'
// import createProductBlock from '../blocks/productListBlock'
// import { useMemo } from 'react'
// import heroBlock from '../blocks/heroBlock'
import { toMarkdownString } from 'next-tinacms-markdown'
import { useState } from 'react'
import { Button } from '@tinacms/styles'

import { useTranslation } from 'react-i18next';

const Home = ({ markdownFile }) => {

  const ENGLISH = "English";
  const SPANISH = "Spanish";
  const EDITMODE = "Edit Mode";
  const VIEWMODE = "View Mode";

  const [btn_lang, setBtnLang] = useState("English");
  const [btn_mode, setBtnMode] = useState("Edit Mode");
  const { t, i18n } = useTranslation('common');

  const cms = useCMS()
  const [editableData, form] = useForm({
    initialValues: markdownFile,
    id: markdownFile.fileName,
    label: markdownFile.fileName,
    fields: [],
    onSubmit: (formState) => {
      toMarkdownString(formState)
      return cms.api.git.writeToDisk({
        fileRelativePath: markdownFile.fileRelativePath,
        content: toMarkdownString(formState),
      }).then(() => {
        cms.alerts.success('Home page saved!')
      })
    },
  })

  const [input_value, setInputValue] = useState(editableData.frontmatter.title);

  usePlugin(form)

  var onInputChange = (e) => {
    setInputValue(e.target.value);
    editableData.frontmatter.title = e.target.value;
  }

  var onClickLangBtn = () => {
    if (btn_lang == ENGLISH) { setBtnLang(SPANISH) }
    else { setBtnLang(ENGLISH) }
    setInputValue(editableData.frontmatter.title);
  }

  var onClickModeBtn = () => {
    if (btn_mode == EDITMODE) { setBtnMode(VIEWMODE) }
    else { setBtnMode(EDITMODE) }
    setInputValue(editableData.frontmatter.title);
  }

  return (
    <InlineForm form={form}>
      <Head>
        <title>Temp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {t('title')}

      <Button onClick={onClickLangBtn}>{btn_lang}</Button>
      <Button onClick={onClickModeBtn}>{btn_mode}</Button>
      <InlineField name="title">
        {({ input }) => {
          if (cms.enabled) {
            if (btn_mode == VIEWMODE)
              return <h1><InlineText name="frontmatter.title" className="editfield mt-5" focusRing={false} /></h1>
            else
              return <h1>{editableData.frontmatter.title}</h1>
          } else {
            if (btn_mode == VIEWMODE)
              return <input value={input_value} onChange={onInputChange} className="front-edit mt-5" />
            else
              return <h1>{editableData.frontmatter.title}</h1>
          }
        }}
      </InlineField>
    </InlineForm>
  )
}

const getStaticProps = async () => {
  return {
    props: {
      markdownFile: parseMdFile('pages/home.md')
    }
  }
}

export default Home
export {
  getStaticProps
}
import Head from 'next/head'
import { parseMdFile } from '../helpers/markdown'
import ReactMarkdown from 'react-markdown'
import { useForm, usePlugin, useCMS } from 'tinacms'
import { InlineForm, InlineText, InlineBlocks, InlineField } from 'react-tinacms-inline'
import { InlineWysiwyg } from 'react-tinacms-editor'
// import createProductBlock from '../blocks/productListBlock'
// import { useMemo } from 'react'
// import heroBlock from '../blocks/heroBlock'
import { toMarkdownString } from 'next-tinacms-markdown'
import { useState, useEffect } from 'react'
import { Button } from '@tinacms/styles'

import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const Home = ({ markdownFile }) => {

    const ENGLISH = "English";
    const SPANISH = "Spanish";
    const EDITMODE = "Edit Mode";
    const VIEWMODE = "View Mode";

    const [input_value, setInputValue] = useState('');
    const [btn_lang, setBtnLang] = useState("English");
    const [btn_mode, setBtnMode] = useState("Edit Mode");
    const { t, i18n } = useTranslation('common');


    const [constructorHasRun, setConstructorHasRun] = useState(false);
    const constructor = () => {
        if (constructorHasRun) return;
        var lang = btn_lang == ENGLISH ? 'es' : 'en';
        setInputValue(localStorage.getItem(lang))
        setConstructorHasRun(true);
    };


    useEffect(() => {
        constructor();
    })

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
    usePlugin(form)
    var onInputChange = (e) => {
        setInputValue(e.target.value);
        editableData.frontmatter.title = e.target.value;
    }
    var writeToDB = () => {
        var lang = btn_lang == ENGLISH ? 'es' : 'en';
        console.log(input_value, lang);
        localStorage.setItem(lang, input_value);
    }
    var onClickLangBtn = () => {
        if (btn_lang == ENGLISH) {
            setBtnLang(SPANISH)
            i18n.changeLanguage('es')
            writeToDB();
            setInputValue(localStorage.getItem('en'))
        } else {
            setBtnLang(ENGLISH)
            i18n.changeLanguage('en')
            writeToDB();
            setInputValue(localStorage.getItem('es'))
        }
        // setInputValue(editableData.frontmatter.title);
    }

    var onClickModeBtn = () => {
        if (btn_mode == EDITMODE) { setBtnMode(VIEWMODE) }
        else { setBtnMode(EDITMODE) }
        // setInputValue(editableData.frontmatter.title);
    }

    return (
        <InlineForm form={form}>
            <Head><title>Temp</title></Head>

            <h2>{t('title')}</h2>

            <Button onClick={onClickLangBtn}>{t('langbutton')}</Button>
            <Button onClick={onClickModeBtn}>{t('mode')}</Button>
            <InlineField name="title">
                {({ input }) => {
                    if (cms.enabled) {
                        if (btn_mode == VIEWMODE)
                            return <input value={input_value} onChange={onInputChange} className="front-edit mt-5" />
                        else
                            return <h1>{input_value}</h1>
                    } else {
                        if (btn_mode == VIEWMODE)
                            return <input value={input_value} onChange={onInputChange} className="front-edit mt-5" />
                        else
                            return <h1>{input_value}</h1>
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
import { useEffect } from 'react'

import { strings } from '../content'
import type { Lang } from '../content'
import { useStored } from './storage'

/*
  The site language. Only the strings in `strings` (src/content.ts) are
  translated: the nav, the hero and the cookie banner. Saved in this browser.
*/
export function useLang() {
  const [lang, setLang] = useStored<Lang>('lang', 'en')
  const safe: Lang = lang in strings ? lang : 'en'
  useEffect(() => {
    document.documentElement.lang = safe
  }, [safe])
  return { lang: safe, t: strings[safe], setLang }
}

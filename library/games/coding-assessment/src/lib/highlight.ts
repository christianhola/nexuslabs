/*
  A small JavaScript tokenizer for the editor's highlight layer. It is not a
  parser: it colours keywords, strings, numbers, comments and call names,
  which is all a challenge editor needs.
*/
const KEYWORDS = new Set('const let var function return if else for while do of in new class extends break continue switch case default try catch finally throw typeof instanceof await async yield import export from null undefined true false this'.split(' '))

export type Token = { t: 'kw' | 'str' | 'num' | 'fn' | 'com' | 'punc' | 'id' | 'ws'; v: string }

const RE = /(\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\n]*)|("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?|`(?:\\.|[^`\\])*`?)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z_$\d"'`/]+|\/)/g

export function tokenize(src: string): Token[] {
  const out: Token[] = []
  RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = RE.exec(src))) {
    if (m[1]) out.push({ t: 'com', v: m[1] })
    else if (m[2]) out.push({ t: 'str', v: m[2] })
    else if (m[3]) out.push({ t: 'num', v: m[3] })
    else if (m[4]) {
      const rest = src.slice(RE.lastIndex)
      out.push({ t: KEYWORDS.has(m[4]) ? 'kw' : /^\s*\(/.test(rest) ? 'fn' : 'id', v: m[4] })
    } else if (m[5]) out.push({ t: 'ws', v: m[5] })
    else out.push({ t: 'punc', v: m[0] })
  }
  return out
}

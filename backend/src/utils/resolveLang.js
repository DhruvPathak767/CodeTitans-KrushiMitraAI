/**
 * Resolve the language from the request.
 * Priority: 1. Query param `lang`  2. Accept-Language header  3. Default 'en'
 * Accepts only: 'en', 'hi', 'gu'
 */
function resolveLang(req) {
  const SUPPORTED = ['en', 'hi', 'gu'];

  // 1. Explicit query param is most reliable (sent by frontend fetch URL)
  const queryLang = req.query?.lang?.trim()?.toLowerCase();
  if (queryLang && SUPPORTED.includes(queryLang)) {
    return queryLang;
  }

  // 2. Accept-Language header — take ONLY the first tag, strip quality factor
  const headerLang = req.headers['accept-language']
    ?.split(',')[0]
    ?.split(';')[0]
    ?.trim()
    ?.toLowerCase();
  if (headerLang && SUPPORTED.includes(headerLang)) {
    return headerLang;
  }

  // 3. Default English
  return 'en';
}

export default resolveLang;

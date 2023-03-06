import { getURLParameters, getMetaId, isMeta } from '../core/src/utils'

test('getURLParameters test case', () => {
  expect(getURLParameters('name=Adam&surname=Smith')).toEqual({ name: 'Adam', surname: "Smith" })
  expect(getURLParameters('mdx:preview:demo12')).toEqual({ })
  expect(getURLParameters('mdx:preview:demo12:')).toEqual({ })
  expect(getURLParameters('mdx:preview:demo12:ab=1')).toEqual({ "mdx:preview:demo12:ab": "1" }); // 🔴
  expect(getURLParameters('mdx:preview:demo12?name=Adam&surname=Smith')).toEqual({ name: 'Adam', surname: "Smith" })
  expect(getURLParameters('mdx:preview:demo12&name=Adam&surname=Smith')).toEqual({ name: 'Adam', surname: "Smith" })
  expect(getURLParameters('mdx:preview:demo12&code=true&boreder=0')).toEqual({ code: 'true', boreder: "0" })
});

test('getMetaId test case', () => {
  expect(getMetaId('name=Adam&surname=Smith')).toEqual('')
  expect(getMetaId('mdx:preview:demo12')).toEqual('demo12')
  expect(getMetaId('mdx:preview:&code=true')).toEqual('')
  expect(getMetaId('mdx:preview&code=true')).toEqual('')
  expect(getMetaId('mdx:preview:demo12&name=Adam&surname=Smith')).toEqual('demo12')
  expect(getMetaId('mdx:preview:demo12&code=true&boreder=0')).toEqual('demo12')
});

test('isMeta test case', () => {
  expect(isMeta('name=Adam&surname=Smith')).toBeFalsy()
  expect(isMeta('mdx:preview:demo12')).toBeTruthy()
  expect(isMeta('mdx:preview')).toBeTruthy()
  expect(isMeta('mdx:preview&code=true')).toBeTruthy()
  expect(isMeta('mdx:preview:demo12&name=Adam&surname=Smith')).toBeTruthy()
  expect(isMeta('mdx:preview:demo12&code=true&boreder=0')).toBeTruthy()
});

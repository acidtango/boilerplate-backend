import { Language } from '../../domain/models/Language.ts'

export const CONCHA_ASENSIO = {
  id: 'b741e452-a5ca-48f3-92f0-5bdbc4d84c81',
  name: 'Concha Asensio',
  language: Language.SPANISH,
  email: 'concha-asensio@gmail.com',
  password: 'xpRules123',
  age: 30,
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODQzMzM4MDAsInN1YiI6ImI3NDFlNDUyLWE1Y2EtNDhmMy05MmYwLTViZGJjNGQ4NGM4MSIsImV4cCI6Mjk0NTc3MzgwMCwicm9sZSI6IlNQRUFLRVIifQ.kyRriZE4Rj9iCWMmRKwwTLkSTlDHuPHBHA7ZgjJDAlE',
}

export const JORGE_AGUIAR: typeof CONCHA_ASENSIO = {
  id: 'c0f1e467-a382-4984-a1b0-7a760fc5270b',
  name: 'Jorge Aguiar',
  language: Language.SPANISH,
  email: 'jorge-aguiar@gmail.com',
  age: 57,
  password: 'tddIsAwesome999',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODQzMzM4MDAsInN1YiI6ImMwZjFlNDY3LWEzODItNDk4NC1hMWIwLTdhNzYwZmM1MjcwYiIsImV4cCI6Mjk0NTc3MzgwMCwicm9sZSI6IlNQRUFLRVIifQ.UXEWWKQxPEl39j5ah59KP3t2z-01QP4DSRjUqpJUwvc',
}

export const NOT_IMPORTANT_SPEAKER: typeof CONCHA_ASENSIO = {
  id: '2fee65ff-d811-4501-8d8a-c6f45ad2e245',
  name: 'No one',
  language: Language.ENGLISH,
  email: 'noone@example.com',
  age: 25,
  password: 'not important',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODQzMzM4MDAsInN1YiI6IjJmZWU2NWZmLWQ4MTEtNDUwMS04ZDhhLWM2ZjQ1YWQyZTI0NSIsImV4cCI6Mjk0NTc3MzgwMCwicm9sZSI6IlNQRUFLRVIifQ.j6PzvdpT1DvrPZQl0Tm2lUnpNGT6TpVIir2S2TUX40o',
}

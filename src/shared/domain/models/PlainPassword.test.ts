import { describe, expect, it } from 'vitest'
import { HashedPassword } from './HashedPassword.ts'
import { PlainPassword } from './PlainPassword.ts'

describe('PlainPassword', () => {
  const hashOfPasswordAndSalt = HashedPassword.fromPrimitives(
    'afe6c5530785b6cc6b1c6453384731bd5ee432ee549fd42fb6695779ad8a1c5bf59de69c48f774efc4007d5298f9033c0241d5ab69305e7b64eceeb8d834cfec',
  )

  it('converts to a hashed password', () => {
    const plainPassword = new PlainPassword('password')
    const salt = 'salt'
    const hashedPassword = plainPassword.toHashed(salt)

    expect(hashedPassword.equalsTo(hashOfPasswordAndSalt)).toBe(true)
  })

  it('comparison fails if password is wrong', () => {
    const plainPassword = new PlainPassword('wrong password')
    const salt = 'salt'
    const hashedPassword = plainPassword.toHashed(salt)

    expect(hashedPassword.equalsTo(hashOfPasswordAndSalt)).toBe(false)
  })

  it('comparison fails if salt is wrong', () => {
    const plainPassword = new PlainPassword('password')
    const salt = 'wrong salt'
    const hashedPassword = plainPassword.toHashed(salt)

    expect(hashedPassword.equalsTo(hashOfPasswordAndSalt)).toBe(false)
  })
})

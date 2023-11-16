import { mockserver } from './mockserver.mjs'
describe('mockserver', () => {
  it('should work', () => {
    expect(mockserver()).toEqual('mockserver')
  })
})

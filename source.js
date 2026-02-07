export default new class LunarysTest {
  async single() {
    return [{
      title: 'TESTE LUNARYS',
      link: 'magnet:?xt=urn:btih:TEST',
      hash: 'TEST',
      seeders: 1,
      leechers: 0,
      downloads: 0,
      size: 0,
      date: new Date(),
      accuracy: 'high',
      type: 'torrent'
    }]
  }

  batch = this.single
  movie = this.single

  async test() {
    return true
  }
}()

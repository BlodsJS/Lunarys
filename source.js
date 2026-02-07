export default new class AnimePTBR {
  base = 'https://torrent-search-api-livid.vercel.app/api/nyaasi/'

  async single({ titles, episode }) {
    if (!titles?.length) return []
    return this.search(titles[0], episode)
  }

  batch = this.single
  movie = this.single
  async single({ titles, episode }) {
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
      type: 'sub'
    }]
  }


  async search(title, episode) {
    let query = title.replace(/[^\w\s-]/g, ' ').trim()
    if (episode) query += ` ${episode.toString().padStart(2, '0')}`

    const res = await fetch(this.base + encodeURIComponent(query))
    const data = await res.json()
    if (!Array.isArray(data)) return []

    return data
      .map(item => this.map(item))
      .filter(item => this.isPTBR(item.title))
  }

  isPTBR(title) {
    const tags = ['pt-br', 'portuguese', 'brsub', 'legenda pt']
    title = title.toLowerCase()
    return tags.some(t => title.includes(t))
  }

  map(item) {
    return {
      title: item.Name,
      link: item.Magnet,
      hash: item.Magnet?.match(/btih:([A-Fa-f0-9]+)/)?.[1] || '',
      seeders: Number(item.Seeders || 0),
      leechers: Number(item.Leechers || 0),
      downloads: Number(item.Downloads || 0),
      size: 0,
      date: new Date(item.DateUploaded),
      accuracy: 'medium',
      type: 'alt'
    }
  }

  async test() {
    const res = await fetch(this.base + 'naruto')
    return res.ok
  }
}()

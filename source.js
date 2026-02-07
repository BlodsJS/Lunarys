import AbstractSource from './abstract.js'

export default new class AnimePTBR extends AbstractSource {
  base = 'https://torrent-search-api-livid.vercel.app/api/nyaasi/'

  async single({ titles, episode }) {
    if (!titles?.length) return []

    const query = this.buildQuery(titles[0], episode)
    const url = `${this.base}${encodeURIComponent(query)}`
    const res = await fetch(url)
    const data = await res.json()

    if (!Array.isArray(data)) return []

    return this.map(data)
      .filter(item => this.isPTBR(item.title))
  }

  batch = this.single
  movie = this.single

  buildQuery(title, episode) {
    let q = title.replace(/[^\w\s-]/g, ' ')
    if (episode) q += ` ${episode.toString().padStart(2, '0')}`
    return q
  }

  isPTBR(title) {
    const tags = [
      'pt-br',
      'portuguese',
      'dual',
      'multi',
      'brsub',
      'legenda pt'
    ]
    title = title.toLowerCase()
    return tags.some(t => title.includes(t))
  }

  map(data) {
    return data.map(item => {
      const hash = item.Magnet?.match(/btih:([a-fA-F0-9]+)/)?.[1] || ''

      return {
        title: item.Name,
        link: item.Magnet,
        hash,
        seeders: Number(item.Seeders || 0),
        leechers: Number(item.Leechers || 0),
        downloads: Number(item.Downloads || 0),
        size: this.parseSize(item.Size),
        date: new Date(item.DateUploaded),
        verified: false,
        type: 'sub',
        accuracy: 'high'
      }
    })
  }

  parseSize(str) {
    if (!str) return 0
    const m = str.match(/([\d.]+)\s*(GiB|MiB|GB|MB)/i)
    if (!m) return 0
    const v = parseFloat(m[1])
    return m[2].toUpperCase().includes('G')
      ? v * 1024 ** 3
      : v * 1024 ** 2
  }

  async test() {
    try {
      const r = await fetch(this.base + 'naruto pt-br')
      return r.ok
    } catch {
      return false
    }
  }
}()

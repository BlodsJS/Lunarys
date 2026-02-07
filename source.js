export default new class AnimePTBR {
  base = 'https://torrent-search-api-livid.vercel.app/api/nyaasi/'

  async single({ titles, episode }) {
    if (!titles?.length) return []

    return this.search(titles[0], episode)
  }

  batch = this.single
  movie = this.single

  async search(title, episode) {
    let query = title.replace(/[^\w\s-]/g, ' ').trim()
    if (episode) query += ` ${episode.toString().padStart(2, '0')}`

    const res = await fetch(this.base + encodeURIComponent(query))
    const data = await res.json()
    if (!Array.isArray(data)) return []

    return data
      .map(item => this.map(item))
      .filter(item => this.isLikelyPT(item.title))
  }

  // ⚠️ FILTRO REALISTA PARA NYAA
  isLikelyPT(title) {
    title = title.toLowerCase()

    // Forte (raros, mas certeiros)
    const strong = [
      'pt-br',
      'ptbr',
      'leg pt',
      '[pt]',
      '(pt)'
    ]

    // Fracos (muito comuns no Nyaa)
    const weak = [
      ' pt ',
      '-pt-',
      'multi',
      'dual'
    ]

    // Fansubs brasileiros / latinos conhecidos
    const fansubs = [
      'darkside',
      'animeforce',
      'fênix',
      'fenix',
      'erai',
      'brsub'
    ]

    return (
      strong.some(t => title.includes(t)) ||
      fansubs.some(t => title.includes(t)) ||
      weak.some(t => title.includes(t))
    )
  }

  map(item) {
    return {
      title: item.Name || 'Unknown',
      link: item.Magnet || '',
      hash: item.Magnet?.match(/btih:([A-Fa-f0-9]+)/)?.[1] || '',
      seeders: Number(item.Seeders || 0),
      leechers: Number(item.Leechers || 0),
      downloads: Number(item.Downloads || 0),
      size: 0,
      date: new Date(item.DateUploaded),
      accuracy: 'medium',
      type: 'sub'
    }
  }

  async test() {
    try {
      const res = await fetch(this.base + 'naruto pt')
      return res.ok
    } catch {
      return false
    }
  }
}()

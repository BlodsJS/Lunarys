export default new (class AnimePTBR {
  base = "https://feed.animetosho.org/json?search=";

  async single({ titles, episode }) {
    if (!titles?.length) return [];

    return this.search(titles[0], episode);
  }

  batch = this.single;
  movie = this.single;

  async search(title, episode) {
    let query = title.replace(/[^\w\s-]/g, " ").trim();

    // NÃO força episódio (deixa mais solto)
    if (episode) {
      query += ` ${episode}`;
    }

    const res = await fetch(this.base + encodeURIComponent(query));
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((item) => this.map(item));
    // 🔥 temporariamente desativa filtro
    // .filter(item => this.isLikelyPT(item.title))
  }

  // ⚠️ FILTRO REALISTA PARA NYAA
  isLikelyPT(title) {
    title = title.toLowerCase();

    // Forte (raros, mas certeiros)
    const strong = ["pt-br", "ptbr", "leg pt", "[pt]", "(pt)"];

    // Fracos (muito comuns no Nyaa)
    const weak = [" pt ", "-pt-", "multi", "dual", "mult-subs", "subs"];

    // Fansubs brasileiros / latinos conhecidos
    const fansubs = [
      "darkside",
      "animeforce",
      "fênix",
      "fenix",
      "erai",
      "brsub",
    ];

    return (
      strong.some((t) => title.includes(t)) ||
      fansubs.some((t) => title.includes(t)) ||
      weak.some((t) => title.includes(t))
    );
  }

  map(item) {
    return {
      title: item.title,
      link: item.magnet_uri || "",
      hash: item.info_hash || "",
      seeders: Number(item.seeders || 0),
      leechers: Number(item.leechers || 0),
      downloads: 0,
      size: item.total_size || 0,
      date: new Date(item.timestamp * 1000),
      accuracy: "medium",
      type: "sub",
    };
  }

  async test() {
    try {
      const res = await fetch(this.base + "naruto pt");
      return res.ok;
    } catch {
      return false;
    }
  }
})();

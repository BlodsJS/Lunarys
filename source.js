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

    if (episode) {
      query += ` ${episode}`;
    }

    const res = await fetch(this.base + encodeURIComponent(query));
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const normalizedTitle = title.toLowerCase();

    return data
      .map((item) => this.map(item))
      .filter((item) => {
        const t = item.title.toLowerCase();

        // 🎯 Garante que o anime corresponde ao nome
        return (
          t.includes(normalizedTitle) ||
          normalizedTitle.split(" ").every((word) => t.includes(word))
        );
      })
      .sort((a, b) => {
        // 🌙 Prioriza PT-BR sem excluir outros
        const ptA = this.isLikelyPT(a.title);
        const ptB = this.isLikelyPT(b.title);

        if (ptA !== ptB) return ptB - ptA;

        // 🌟 Se empate, usa seeders
        return b.seeders - a.seeders;
      });
  }

  isLikelyPT(title) {
    title = title.toLowerCase();

    const strong = ["pt-br", "ptbr", "leg pt", "[pt]", "(pt)"];
    const weak = [" pt ", "-pt-", "multi", "dual", "mult-subs", "subs"];
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
      title: item.title || "Unknown",
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
      const res = await fetch(this.base + encodeURIComponent("naruto"));
      return res.ok;
    } catch {
      return false;
    }
  }
})();

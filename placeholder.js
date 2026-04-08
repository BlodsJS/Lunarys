export default {
  async test() {
    return true;
  },

  async single({ titles, episode }) {
    return [];
  },

  batch({ titles, episode }) {
    return this.single({ titles, episode });
  },

  movie({ titles }) {
    return this.single({ titles });
  },
};

// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from "./0000_previous_thunderball.sql";
import m0001 from "./0001_red_pyro.sql";
import m0002 from "./0002_settings_json.sql";
import m0003 from "./0003_glossy_wendell_rand.sql";
import m0004 from "./0004_strong_starbolt.sql";
import m0005 from "./0005_flimsy_madame_masque.sql";
import m0006 from "./0006_low_shooting_star.sql";
import m0007 from "./0007_melted_angel.sql";
import journal from "./meta/_journal.json";

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004,
    m0005,
    m0006,
    m0007,
  },
};

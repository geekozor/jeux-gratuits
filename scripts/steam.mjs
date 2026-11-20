// Résultats de la recherche Steam (results_html) -> [{ appid, titre }] des jeux à -100 % (gratuits à garder).
// Les packs (data-ds-bundleid, sans appid) et les réductions partielles sont ignorés.
export function offresSteam(html) {
  return (html ?? '').split('<a href="https://store.steampowered.com/app/').slice(1)
    .map((b) => ({ appid: b.match(/data-ds-appid="(\d+)"/)?.[1], titre: b.match(/<span class="title">([^<]+)/)?.[1], remise: b.match(/data-discount="(\d+)"/)?.[1] }))
    .filter((o) => o.appid && o.titre && o.remise === '100')
    .map(({ appid, titre }) => ({ appid, titre }));
}

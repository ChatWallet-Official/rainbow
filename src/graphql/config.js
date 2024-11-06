exports.config = {
  ens: {
    __name: 'ens',
    document: './queries/ens.graphql',
    schema: {
      method: 'POST',
      url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
      headers: {
        'x-api-key': '23c50d7a1168dcff3f0d5d4bc3889c52',
      },
    },
  },
  metadata: {
    __name: 'metadata',
    document: './queries/metadata.graphql',
    schema: { method: 'GET', url: 'https://metadata.p.rainbow.me/v1/graph' },
  },
  metadataPOST: {
    __name: 'metadataPOST',
    document: './queries/metadata.graphql',
    schema: { method: 'POST', url: 'https://metadata.p.rainbow.me/v1/graph' },
  },
  arc: {
    __name: 'arc',
    document: './queries/arc.graphql',
    schema: {
      method: 'GET',
      url: 'https://arc-graphql.rainbow.me/graphql',
      headers: {
        'x-api-key': 'ARC_GRAPHQL_API_KEY',
      },
    },
  },
  arcDev: {
    __name: 'arcDev',
    document: './queries/arc.graphql',
    schema: {
      method: 'GET',
      url: 'https://arc-graphql.rainbowdotme.workers.dev/graphql',
      headers: {},
    },
  },
};

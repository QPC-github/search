const Typesense = require('typesense')

async function main () {
  const client = new Typesense.Client({
    'nodes': [{
      'host': 'ts.dev.ietf.org',
      'port': '443',
      'protocol': 'https'
    }],
    'apiKey': process.env.TS_API_KEY,
    'connectionTimeoutSeconds': 5
  })

  const resp = await client.keys().create({
    'description': 'Search-only documents key',
    'actions': ['documents:search'],
    'collections': ['documents']
  })

  console.info(resp)
}

main()
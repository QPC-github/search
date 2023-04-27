const fs = require('node:fs/promises')
const Typesense = require('typesense')
const _ = require('lodash')

async function main () {
  const client = new Typesense.Client({
    'nodes': [{
      'host': 'ts.dev.ietf.org',
      'port': '443',
      'protocol': 'https'
    }],
    'apiKey': process.env.TS_API_KEY,
    'connectionTimeoutSeconds': 300
  })

  await client.collections().create({
    name: 'documents',
    fields: [
      {
        name: 'title',
        type: 'string',
        facet: false
      },
      {
        name: 'abstract',
        type: 'string',
        facet: false
      },
      {
        name: 'keywords',
        type: 'string[]',
        facet: true
      },
      {
        name: 'status',
        type: 'string',
        facet: true
      },
      {
        name: 'pageCount',
        type: 'int32',
        facet: false
      },
      {
        name: 'authors',
        type: 'string[]',
        facet: true
      }
    ]
  })

  const docs = []

  for (const filename of await fs.readdir('./data/ietf-ftp/rfc')) {
    if (filename.endsWith('.json')) {
      try {
        const doc = JSON.parse(await fs.readFile(`./data/ietf-ftp/rfc/${filename}`, 'utf8'))
        if (!doc || !doc.title) { continue }
        docs.push({
          id: doc.doc_id,
          title: doc.title.trim(),
          abstract: doc.abstract?.trim() || '',
          keywords: doc.keywords || [],
          status: doc.status || 'UNKNOWN',
          pageCount: _.toSafeInteger(doc.page_count) || 0,
          authors: doc.authors || []
        })
      } catch (err) {
        console.warn(err)
      }
    }
  }

  let idx = 0
  for (const chunk of _.chunk(docs, 100)) {
    console.info(`Importing chunk ${idx * 100}-${(idx + 1) * 100}...`)
    await client.collections('documents').documents().import(chunk, { action: 'create', batch_size: 100 })
    idx++
  }
}

main()
import fs from 'node:fs/promises'
import Typesense from 'typesense'
import _ from 'lodash-es'
import postgres from 'postgres'
import { DateTime } from 'luxon'

async function main () {
  const sql = postgres({
    host: 'localhost',
    port: 5432,
    database: 'datatracker',
    username: 'django',
    password: 'RkTkDPFnKpko'
  })

  const ts = new Typesense.Client({
    'nodes': [{
      'host': 'ts.dev.ietf.org',
      'port': '443',
      'protocol': 'https'
    }],
    'apiKey': process.env.TS_API_KEY,
    'connectionTimeoutSeconds': 300
  })

  await ts.collections('docs').delete()

  await ts.collections().create({
    name: 'docs',
    fields: [
      {
        name: 'ref',
        type: 'string',
        facet: false
      },
      {
        name: 'filename',
        type: 'string',
        facet: false
      },
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
        name: 'type',
        type: 'string',
        facet: true
      },
      {
        name: 'state',
        type: 'string[]',
        facet: true
      },
      {
        name: 'pages',
        type: 'int32',
        facet: false
      },
      {
        name: 'date',
        type: 'int64',
        facet: false
      },
      {
        name: 'expires',
        type: 'int64',
        facet: false
      },
      {
        name: 'group',
        type: 'string',
        facet: true
      },
      {
        name: 'groupName',
        type: 'string',
        facet: false
      },
      {
        name: 'area',
        type: 'string',
        facet: true
      },
      {
        name: 'areaName',
        type: 'string',
        facet: false
      },
      {
        name: 'stream',
        type: 'string',
        facet: true
      },
      {
        name: 'authors',
        type: 'string[]',
        facet: true
      },
      {
        name: 'adName',
        type: 'string',
        facet: true
      },
    ]
  })

  let idx = 0
  await sql`
    SELECT
      doc.*,
      grp.acronym AS groupacronym,
      grp.name AS groupname,
      grpar.acronym AS areaacronym,
      grpar.name AS areaname,
      p.name AS adName,
      array(
        SELECT ARRAY[ds.slug, ds.type_id]
        FROM doc_document_states dds
        LEFT JOIN doc_state ds on dds.state_id = ds.id
        WHERE dds.document_id = doc.id
      ) AS states,
      array(
        SELECT ARRAY[pp.name, da.affiliation]
        FROM doc_documentauthor da
        LEFT JOIN person_person pp on da.person_id = pp.id
        WHERE da.document_id = doc.id
        ORDER BY da."order"
      ) AS authors
    FROM doc_document doc
    LEFT JOIN group_group grp ON (doc.group_id = grp.id)
    LEFT JOIN group_group grpar ON (grp.parent_id = grpar.id)
    LEFT JOIN person_person p on doc.ad_id = p.id
  `.cursor(100, async rows => {
    console.info(`Importing chunk ${idx * 100}-${(idx + 1) * 100}...`)
    const docs = []
    
    for (const r of rows) {
    //   switch (r.type_id) {
    //     case 'draft': {
    //       try {
    //         const doc = JSON.parse(await fs.readFile(`./data/ietf-ftp/rfc/${filename}`, 'utf8'))
    //         if (!doc || !doc.title) { continue }
    //         docs.push({
    //           id: doc.id,
    //           docId: doc.doc_id,
    //           title: doc.title.trim(),
    //           abstract: doc.abstract?.trim() || '',
    //           keywords: (doc.keywords || []).map(a => a.trim()).filter(a => a),
    //           status: doc.status || 'UNKNOWN',
    //           pageCount: _.toSafeInteger(doc.page_count) || 0,
    //           authors: (doc.authors || []).map(a => a.trim()).filter(a => a),
    //           stream: r.stream_id ?? ''
    //         })
    //       } catch (err) {
    //         console.warn(err)
    //       }
    //       break
    //     }
    //   }

      docs.push({
        id: `doc-${r.id}`,
        ref: '',
        title: r.title?.trim() ?? r.name ?? '',
        filename: r.name ?? '',
        abstract: r.abstract?.replace(/(?:\r\n|\r|\n)/g, ' ').trim().replaceAll(/\s\s+/g, ' ') ?? '',
        keywords: (r.keywords || []).map(a => a.trim()).filter(a => a),
        pages: _.toSafeInteger(r.pages) || 0,
        date: r.time ? DateTime.fromJSDate(r.time).toUnixInteger() : 0,
        expires: r.expires ? DateTime.fromJSDate(r.expires).toUnixInteger() : 0,
        group: r.groupacronym ?? '',
        groupName: r.groupname ?? '',
        area: r.areaacronym ?? '',
        areaName: r.areaname ?? '',
        keywords: [],
        type: r.type_id,
        state: r.states.map(s => s[0]) ?? [],
        stream: r.stream_id ?? '',
        authors: r.authors.map(a => a[1] ? `${a[0]} (${a[1]})` : a[0]) ?? [],
        adName: r.adname ?? ''
      })
    }
    await ts.collections('docs').documents().import(docs, { action: 'create', batch_size: 100 })
    idx++
  })

  // for await (const filename of await fs.readdir('./data/ietf-ftp/rfc')) {
  //   if (filename.endsWith('.json')) {
  //     try {
  //       const doc = JSON.parse(await fs.readFile(`./data/ietf-ftp/rfc/${filename}`, 'utf8'))
  //       if (!doc || !doc.title) { continue }
  //       docs.push({
  //         id: doc.id,
  //         docId: doc.doc_id,
  //         title: doc.title.trim(),
  //         abstract: doc.abstract?.trim() || '',
  //         keywords: (doc.keywords || []).map(a => a.trim()).filter(a => a),
  //         status: doc.status || 'UNKNOWN',
  //         pageCount: _.toSafeInteger(doc.page_count) || 0,
  //         authors: (doc.authors || []).map(a => a.trim()).filter(a => a)
  //       })
  //     } catch (err) {
  //       console.warn(err)
  //     }
  //   }
  // }
}

main()
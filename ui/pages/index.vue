<template>
  <div>
    <HomeHero></HomeHero>
    <ais-instant-search :index-name="indexName" :search-client="searchClient" :initial-ui-state="initialUiState">
      <div class="container mx-auto">
        <div class="flex flex-row flex-wrap pb-4">
          <aside class="w-full sm:w-1/3 md:w-1/4 px-2">
            <div class="sticky top-0 px-2 w-full">
              <div class="card bg-zinc-50 p-4 shadow-md">
                <span class="font-medium">Type</span>
                <ais-refinement-list attribute="type" :transform-items="transformTypeFacet" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">State</span>
                <ais-refinement-list attribute="state.slug" :limit="5" :transform-items="transformStateFacet" show-more :sort-by="['isRefined', 'name']" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Author</span>
                <ais-refinement-list attribute="authors.name" searchable :limit="5" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Group</span>
                <ais-refinement-list attribute="group" searchable :limit="10" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Area</span>
                <ais-refinement-list attribute="area" :limit="10" show-more :show-more-limit="100" :sort-by="['isRefined', 'name']" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Area Director</span>
                <ais-refinement-list attribute="adName" searchable :limit="5" class="mt-2" />
              </div>
              <!-- <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Keywords</span>
                <ais-refinement-list attribute="keywords" :transform-items="cleanRefinementItems" :limit="5" class="mt-2" />
              </div> -->
              <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Stream</span>
                <ais-refinement-list attribute="stream" class="mt-2" />
              </div>
              <ais-clear-refinements class="mt-4" />
            </div>
          </aside>
          <main role="main" class="w-full sm:w-2/3 md:w-3/4 px-2">
            <ais-search-box>
              <template v-slot="{ currentRefinement, isSearchStalled, refine }">
                <div class="flex flex-row items-center">
                  <input type="search" :value="currentRefinement" @input="refine($event.currentTarget.value)" placeholder="Search..." class="input input-bordered w-full" />
                  <span v-show="isSearchStalled" class="loading loading-spinner text-primary me-2"></span>
                  <ais-stats>
                    <template v-slot="{ nbHits, processingTimeMS }">
                      <div class="ms-4 text-sm w-max text-zinc-500"><span class="font-medium">{{ nbHits.toLocaleString('en', { useGrouping: true }) }}</span> hits in <span class="font-medium">{{ processingTimeMS }}ms</span></div>
                    </template>
                  </ais-stats>
                </div>
              </template>
            </ais-search-box>
            <ais-hits class="mt-4">
              <template v-slot="{
                items,
                sendEvent
              }">
                <ul>
                  <li v-for="item in items" :key="item.objectID" class="card bg-zinc-50 p-4 shadow-sm mb-2">
                    <div class="flex flex-row">
                      <h1 class="font-medium grow"><a :href="`https://datatracker.ietf.org/doc/` + item.filename + `/`">{{ item.title }}</a></h1>
                      <span v-if="item.ref" class="text-sm font-medium text-rose-800">{{ item.ref.toUpperCase() }}</span>
                      <span v-else class="text-sm font-medium text-teal-800">{{ typeLabels[item.type] ?? '' }}</span>
                    </div>
                    <span class="text-sm font-medium text-gray-600">{{ item.filename }}</span>
                    <span class="text-sm line-clamp-2 mt-2"><em>{{ item.abstract }}</em></span>
                    <div class="flex flex-row mt-2">
                      <div class="text-sm font-medium text-sky-700 grow">{{ item.authors?.map(a => a.name).join(', ') }}</div>
                      <div v-if="item.groupName" class="text-right">
                        <div class="text-sm text-orange-800">{{ item.groupName }}</div>
                        <div v-if="item.areaName" class="text-xs text-orange-800">{{ item.areaName }}</div>
                      </div>
                    </div>
                  </li>
                  <div class="flex flex-row justify-center"><ais-pagination /></div>
                </ul>
              </template>
            </ais-hits>
          </main>
        </div>
      </div>
    </ais-instant-search>
  </div>
</template>

<script setup>
import 'instantsearch.css/themes/satellite.css'
import {
  AisInstantSearch,
  AisSearchBox,
  AisStats,
  AisHits,
  AisPagination,
  AisRefinementList,
  AisClearRefinements
} from 'vue-instantsearch/vue3/es'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "xf3EOyUrqUehUeqKiveKiVdv1wZu5fTi", // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: "ts.dev.ietf.org",
        path: "",
        port: "443",
        protocol: "https",
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: "rfcNumber,ref,filename,aliases,title,abstract,keywords,authors,adName,group,groupName,area,areaName",
  }
})

const indexName = 'docs' 
const searchClient = typesenseInstantsearchAdapter.searchClient

const initialUiState = {
  // docs: {
  //   refinementList: {
  //     type: ['draft']
  //   }
  // }
}

const typeLabels = {
  draft: 'Internet-Draft',
  rfc: 'RFC'
}

const stateLabels = {
  active: 'Active',
  expired: 'Expired',
  repl: 'Replaced',
  idexists: 'I-D Exists',
  pub: 'Published',
  'wg-doc': 'WG Document',
  rfcedack: 'RFC-Ed-Ack',
  changed: 'Changed',
  dead: 'Dead',
  'sub-pub': 'Submitted to IESG for Publication',
  noic: 'No IANA Actions',
  'adopt-wg': 'Adopted by a WG',
  'c-adopt': 'Call For Adoption By WG Issued',
  'ok-act': 'IANA OK - Actions Needed',
  'ok-noact': 'IANA OK - No Actions Needed',
  'reviewers-ok': 'Expert Reviews OK',
  'wg-cand': 'Candidate for WG Adoption',
  rfcqueue: 'RFC Ed Queue',
  'wg-lc': 'In WG Last Call',
  writeupw: 'Waiting for Writeup'
}

function transformStateFacet (items) {
  return items.map(item => ({
    ...item,
    label: stateLabels[item.value] ?? item.label
  }))
}

function transformTypeFacet (items) {
  return items.map(item => ({
    ...item,
    label: typeLabels[item.value] ?? item.label
  }))
}

function cleanRefinementItems (items) {
  return items.filter(item => item.label?.trim())
}
</script>
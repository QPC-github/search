<template>
  <div>
    <HomeHero></HomeHero>
    <ais-instant-search :index-name="indexName" :search-client="searchClient">
      <div class="container mx-auto">
        <div class="flex flex-row flex-wrap pb-4">
          <aside class="w-full sm:w-1/3 md:w-1/4 px-2">
            <div class="sticky top-0 px-2 w-full">
              <div class="card bg-zinc-50 p-4 shadow-md">
                <span class="font-medium">Type</span>
                <ais-refinement-list attribute="type" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 shadow-md">
                <span class="font-medium">State</span>
                <ais-refinement-list attribute="state" :limit="5" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 shadow-md">
                <span class="font-medium">Group</span>
                <ais-refinement-list attribute="group" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 shadow-md">
                <span class="font-medium">Area</span>
                <ais-refinement-list attribute="area" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 shadow-md">
                <span class="font-medium">Area Director</span>
                <ais-refinement-list attribute="adName" :limit="5" class="mt-2" />
              </div>
              <!-- <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Keywords</span>
                <ais-refinement-list attribute="keywords" :transform-items="cleanRefinementItems" :limit="5" class="mt-2" />
              </div> -->
              <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Stream</span>
                <ais-refinement-list attribute="stream" :limit="5" class="mt-2" />
              </div>
              <div class="card bg-zinc-50 p-4 mt-4 shadow-md">
                <span class="font-medium">Author</span>
                <ais-refinement-list attribute="authors" :limit="5" class="mt-2" />
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
            <ais-infinite-hits class="mt-4">
              <template v-slot="{
                items,
                refinePrevious,
                refineNext,
                isLastPage,
                sendEvent,
              }">
                <ul>
                  <li v-for="item in items" :key="item.objectID" class="card bg-zinc-50 p-4 shadow-sm mb-2">
                    <h1 class="font-medium">{{ item.title }}</h1>
                    <span class="text-sm line-clamp-2 mt-2">{{ item.abstract }}</span>
                    <div class="flex flex-row mt-2">
                      <span class="text-sm font-medium text-sky-700 grow">{{ item.authors.join(', ') }}</span>
                      <span class="text-sm font-medium text-teal-800">{{ item.status }}</span>
                    </div>
                  </li>
                  <li v-if="!isLastPage">
                    <button class="btn" @click="refineNext">
                      Show more results
                    </button>
                  </li>
                </ul>
              </template>
            </ais-infinite-hits>
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
  AisInfiniteHits,
  AisRefinementList,
  AisClearRefinements
} from 'vue-instantsearch/vue3/es'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "B7mDVZr4lFfk4qakjwZeHGUv0s508GAE", // Be sure to use an API key that only allows search operations
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
    query_by: "ref,title,abstract,keywords,authors,adName,group,groupName,area,areaName",
  }
})

const indexName = 'docs' 
const searchClient = typesenseInstantsearchAdapter.searchClient

function cleanRefinementItems (items) {
  return items.filter(item => item.label?.trim())
}
</script>
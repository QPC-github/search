<template>
  <header>
    <div class="px-3 py-2 text-bg-dark">
      <div class="container">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" class="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
            <img src="@/assets/ietf-logo-white.svg" class="logo me-4" height="50" />
            <h1 class="h5 pt-2">Datatracker</h1>
          </a>

          <ul class="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
            <li>
              <a href="#" class="nav-link text-secondary">
                <i class="bi bi-house-door-fill fs-4 text-center d-block mx-auto mb-1"></i>
                Home
              </a>
            </li>
            <li>
              <a href="#" class="nav-link text-white">
                <i class="bi bi-people-fill fs-4 text-center d-block mx-auto mb-1"></i>
                Groups
              </a>
            </li>
            <li>
              <a href="#" class="nav-link text-white">
                <i class="bi bi-file-text-fill fs-4 text-center d-block mx-auto mb-1"></i>
                Documents
              </a>
            </li>
            <li>
              <a href="#" class="nav-link text-white">
                <i class="bi bi-calendar3 fs-4 text-center d-block mx-auto mb-1"></i>
                Meetings
              </a>
            </li>
            <li>
              <a href="#" class="nav-link text-white">
                <i class="bi bi-fire fs-4 text-center d-block mx-auto mb-1"></i>
                Other
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="px-3 py-2 border-bottom mb-3">
      <div class="container d-flex flex-wrap justify-content-center">
        <form class="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto" role="search">
          <input type="search" class="form-control" placeholder="Search..." aria-label="Search">
        </form>

        <div class="text-end">
          <button type="button" class="btn btn-light text-dark me-2">Register</button>
          <button type="button" class="btn btn-primary">Login</button>
        </div>
      </div>
    </div>
  </header>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'

</script>

<style lang="scss">

</style>

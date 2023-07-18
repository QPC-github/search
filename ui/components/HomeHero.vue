<template>
  <div class="hero bg-base-100">
    <div class="hero-content text-center pt-8">
      <div class="max-w-4xl">
        <div class="flex flex-row justify-center items-center">
          <img class="w-32 me-4" src="https://static.ietf.org/logos/ietf.svg" alt="IETF">
          <h1 class="text-5xl font-bold ms-4 colorized">Datatracker</h1>
        </div>
        <p class="py-6">
          The IETF Datatracker is the day-to-day front-end to the IETF database for people who work on IETF standards.<br />
          It contains data about the documents, working groups, meetings, agendas, minutes, presentations, and more, of the IETF.
        </p>
        <p class="pb-6">The primary public face of the IETF is at <a class="link" href="https://www.ietf.org">www.ietf.org</a>.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.colorized {
  background: linear-gradient(220deg,#0d6efd 20%,#6f42c1 70%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
<script setup lang="ts">
  definePageMeta({
    layout: 'docs',
  });
</script>

<template>
  <section class="p-6">
    <DocTitle>Introduction</DocTitle>
    <DocText>
      <b>PseudoRESTAPI</b> is a passion project that I have built and continue
      to maintain in my free time.
    </DocText>
    <DocText>
      I had three goals in mind when I started with this project:
    </DocText>
    <DocList>
      <DocListItem>
        To create a valuable tool for developers and QA engineers. One common
        pain point that developers experience when creating client prototypes is
        the need for server fetching. While developers with backend engineering
        knowledge can create their own server applications, the effort may not
        always be justifiable, especially when time constraints are present. To
        address this, I developed <b>PseudoRESTAPI</b> as a platform that offers
        a faster way to develop and deploy mock servers. Additionally,
        professionals like QA engineers can benefit from this tool for
        practicing manual and automated API testing.
      </DocListItem>
      <DocListItem>
        To learn Nuxt3 with Supabase. Vue3 is one of my favorite front-end
        frameworks, and when Nuxt3 was officially released in 2022, I was
        thrilled to learn and utilize this technology in a project.
        Additionally, I have been tinkering with Supabase for over a year now,
        making it a natural fit to combine both technologies for this project.
      </DocListItem>
      <DocListItem>
        To deploy a "production-ready" open-source project. While I have
        previously worked on personal open-source projects, only Space
        Distortion was released as production-ready. Since 2022, I have been
        eager to start another project, and <b>PseudoRESTAPI</b> presented the
        perfect opportunity for me to do so.
      </DocListItem>
    </DocList>
    <DocText>
      That is the brief history of this project. To get started with
      <b>PseudoRESTAPI</b>, please continue
      <DocLink to="/docs/getting-started">here</DocLink>.
    </DocText>
  </section>
</template>

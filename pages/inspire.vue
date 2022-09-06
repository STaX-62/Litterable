<template>
  <v-row>
    <v-col class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5">
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
        </footer>
      </blockquote>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'InspirePage',
  mounted() {
    (async () => {
      let result = await this.$socket.invoke('host', { uid: this.$user.id });

      let channel = this.$socket.subscribe(result);
      for await (let data of channel) {
        await this.$socket.invokePublish('foo', 'This is some more data');
      }
    })();
  },
}
</script>

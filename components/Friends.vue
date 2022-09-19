<template>
  <v-navigation-drawer v-model="rightDrawer" right app>
    <v-list dense>
      <v-subheader> Amis </v-subheader>
      <v-text-field
        class="mx-2"
        dense
        outlined
        prepend-inner-icon="mdi-magnify"
        :append-outer-icon="friends.length && search != '' ? '' : 'mdi-plus'"
        @click:append-outer="addFriend"
      >
      </v-text-field>
      <v-list-item-group
        v-for="(friend, index) in friends"
        :key="index"
        color="primary"
      >
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-avatar :color="getAvatarColor(friend)" size="40">
              {{ friend.name.slice(0, 1) }}
            </v-avatar>
          </v-list-item-action>
          <v-list-item-title>
            {{ friend.name }}#{{ friend.id }}
          </v-list-item-title>
          <v-btn icon class="ml-2" @click.stop="Invite(friend)">
            <v-icon>mdi-email</v-icon>
          </v-btn>
        </v-list-item>
      </v-list-item-group>
      <v-divider v-if="user.friendlistmode == 1"></v-divider>
      <div v-if="user.friendlistmode == 1">
        <v-subheader>
          Whitelist d'amis
          <v-spacer></v-spacer>
          <v-btn icon><v-icon>mdi-plus</v-icon></v-btn>
        </v-subheader>
        <v-list-item-group
          v-for="(friend, index) in friends"
          :key="index"
          color="primary"
        >
          <v-list-item @click.native="right = !right">
            <v-list-item-action>
              <v-avatar :color="getAvatarColor(friend)" size="40">
                {{ friend.name.slice(0, 1) }}
              </v-avatar>
            </v-list-item-action>
            <v-list-item-title>
              {{ friend.name }}#{{ friend.id }}
            </v-list-item-title>
            <v-btn icon class="ml-2" @click.stop="Invite(friend)">
              <v-icon>mdi-email</v-icon>
            </v-btn>
          </v-list-item>
        </v-list-item-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Friends",
  props: {
    rightDrawer: Boolean,
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    getAvatarColor(friend) {
      let color = "red";
      if (friend.isOnline) {
        color = "primary";
      }
      if (this.Lobby.filter((u) => u.id == friend.id).length > 0) {
        color = "success";
      }
      return color;
    },
    addFriend() {
      this.sent = true;
      // this.$axios
      //   .post("addfriend", this.search, {
      //     headers: {
      //       "Access-Control-Allow-Origin": "*",
      //       "Access-Control-Allow-Methods": "POST",
      //       Authorization: "Bearer " + token,
      //     },
      //   })
      //   .then((res) => console.log(res));
    },
  },
  computed: {
    Lobby() {
      return [];
    },
    friends() {
      return this.$store.getters.getFriends.filter((f) =>
        f.startsWith(search.toLowerCase())
      );
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style>
</style>
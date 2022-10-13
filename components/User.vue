<!-- Please remove this file from your project -->
<template>
  <div class="d-flex align-center">
    <h4 class="mx-2">lvl. {{ LVL() }}</h4>
    <v-progress-linear
      :value="XptoLevel()"
      style="width: 100px"
      color="#EDAFB8"
    />
    <h4 class="mx-2">{{ user.username }}</h4>
    <user-profile></user-profile>
  </div>
</template>

<script>
import UserProfile from "./UserProfile.vue";
export default {
  components: { UserProfile },
  name: "User",
  data() {
    return {
      rightDrawer: false,
      title: "Litterable",
      notifications: 2,
      LobbyUsers: [],
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
    LVL(xp) {
      return Math.floor((1 + Math.sqrt(1 + (8 * this.user.exp) / 100)) / 2);
    },
    XptoLevel() {
      var level = this.LVL(this.user.exp);
      var xplevel = ((Math.pow(level, 2) - level) * 100) / 2;
      var xpnextlevel = ((Math.pow(level + 1, 2) - (level + 1)) * 100) / 2;

      return ((this.user.exp - xplevel) / (xpnextlevel - xplevel)) * 100;
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
};
</script>

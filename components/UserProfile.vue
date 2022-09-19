<!-- Please remove this file from your project -->
<template>
  <div class="">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="350"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          bordered
          dot
          :value="user.notifications.length"
          color="deep-purple accent-4"
          offset-x="13"
          offset-y="13"
        >
          <v-btn icon v-bind="attrs" v-on="on">
            <v-avatar color="pink" size="40">
              {{ user.username.slice(0, 1) }}
            </v-avatar>
          </v-btn>
        </v-badge>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar color="pink" size="40">
                {{ user.username.slice(0, 1).toUpperCase() }}
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.username }}</v-list-item-title>
              <!-- <v-list-item-subtitle>Founder of Vuetify</v-list-item-subtitle> -->
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                :href="'https://www.twitch.tv/' + user.username"
                target="_blank"
              >
                <v-icon>mdi-twitch</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        <v-tabs v-model="tabs" fixed-tabs>
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#menu-tabs-info" class="primary--text">
            <v-icon>mdi-information-outline</v-icon>
          </v-tab>

          <v-tab href="#menu-tabs-notifications" class="primary--text">
            <v-icon>{{
              user.notifications.length ? "mdi-bell-badge" : "mdi-bell"
            }}</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs">
          <v-tab-item value="menu-tabs-info">
            <v-card flat>
              <v-card-text>
                Liste d'amis
                <v-progress-circular
                  class="ml-2"
                  size="15"
                  width="2"
                  indeterminate
                  v-if="loading"
                ></v-progress-circular>
                <v-slider
                  v-model="friendlistmode"
                  :tick-labels="ticksLabels"
                  :max="2"
                  step="1"
                  ticks="always"
                  tick-size="2"
                  :disabled="loading"
                >
                </v-slider>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item value="menu-tabs-notifications">
            <v-card flat>
              <v-list dense>
                <v-subheader v-if="!user.notifications.length"
                  >Pas de Notifications</v-subheader
                >
                <v-list-item-group>
                  <v-list-item v-for="(item, i) in user.notifications" :key="i">
                    <v-list-item-icon class="my-auto">
                      <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        class="mr-4"
                        v-text="item.text"
                      ></v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon>mdi-check-circle-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-icon>mdi-close-circle-outline</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="Disconnect()">
            Deconnexion
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "UserProfile",
  data: () => ({
    menu: false,
    message: false,
    hints: true,
    tabs: null,
    ticksLabels: ["Ouverte", "Whitelist", "Fermée"],
  }),
  methods: {
    Disconnect() {
      localStorage.removeItem("token");
      location.reload();
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    loading() {
      return this.$store.getters.getLoadingChanges;
    },
    friendlistmode: {
      get() {
        return this.$store.state.user.friendlistmode;
      },
      set(value) {
        this.$store.dispatch("setFriendlistmode", value);
      },
    },
  },
};
</script>

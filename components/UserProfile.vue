<!-- Please remove this file from your project -->
<template>
    <div class="">
        <v-badge bordered bottom :icon="isReady(player) ? 'mdi-check' : 'mdi-close'" :color="isReady(player) ? 'success' : 'red'" offset-x="15" offset-y="22">
            <!--
                offset-x="20"
              offset-y="23"
              -->
            <v-btn icon class="my-3" @click="ReadyOther(player)">
                <v-avatar :color="avatarColor(player)" size="40">
                    {{ player.name.slice(0, 1) }}
                </v-avatar>
            </v-btn>
        </v-badge>
    </div>
</template>

<script>
export default {
    name: 'Player',
    methods: {

    }
}
</script>

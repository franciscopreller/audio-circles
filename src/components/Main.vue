<template>
  <div>
    <h1 class="cover-heading">{{ caption }}</h1>
    <player />
  </div>
</template>

<script>
import Player from './Player';

export default {
  name: 'Main',
  components: {
    Player,
  },
  data: () => ({
    caption: 'See Sounds',
  }),
};
</script>

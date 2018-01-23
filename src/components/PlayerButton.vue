<template>
  <button
    type="button"
    class="btn btn-lg"
    :disabled="disabled"
    v-bind:class="{
      'btn-dark': disabled,
      'btn-primary': !disabled,
    }">
    <i class="fa" v-bind:class="[`fa-${icon}`, (loading) ? 'fa-spinner fa-spin' : '']"></i>
  </button>
</template>

<script>
export default {
  name: 'PlayerButton',
  props: [
    'icon',
    'disabled',
    'loading',
    '@click',
  ],
};
</script>

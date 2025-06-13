<template>
    <button class="btn btn-neutral btn-square font-light text-3xl">
        <span class="-mt-2 opacity-90">
            {{ i }}
        </span>
    </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    i: {
        type: String,
        required: true
    }
});

</script>
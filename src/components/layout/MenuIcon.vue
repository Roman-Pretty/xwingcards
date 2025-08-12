<template>
    <button class="btn btn-ghost font-light border-white ">
        <span class="-mt-2 opacity-90 font-[xwing] text-2xl">
            {{ i }}
        </span>
        <span class="ml-1">
            Filter
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
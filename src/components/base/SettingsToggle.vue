/**
 * SettingsToggle.vue
 * 
 * A reusable toggle component for boolean settings with proper labeling and descriptions.
 */
<template>
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-white font-medium">{{ title }}</h3>
      <p class="text-sm text-gray-400">{{ description }}</p>
    </div>
    <input 
      type="checkbox" 
      class="toggle toggle-primary" 
      :checked="modelValue"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * Component props interface
 */
interface Props {
  /** The title of the setting */
  title: string
  /** Description text explaining what the setting does */
  description: string
  /** Current value of the toggle */
  modelValue: boolean
}

/**
 * Component events interface
 */
interface Emits {
  /** Emitted when toggle value changes */
  (e: 'update:modelValue', value: boolean): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * Handle toggle change event
 * @param event - The change event from the input
 */
function handleChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

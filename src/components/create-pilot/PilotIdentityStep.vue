/**
 * PilotIdentityStep Component
 * 
 * First step of pilot creation - name input with validation
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
    <StepHeader step-number="1" title="Pilot Identity" />
    
    <div class="ml-11">
      <label for="pilot-name" class="block text-sm font-medium text-gray-300 mb-2">
        Pilot Name
      </label>
      <input 
        id="pilot-name"
        v-model="localName"
        type="text" 
        required 
        placeholder="Enter your pilot's name..."
        maxlength="50"
        class="input input-bordered w-full max-w-md bg-neutral-700 text-white placeholder-gray-400 border-neutral-600 focus:border-blue-500"
        :class="{ 'border-red-500': error }"
        @input="handleInput"
      />
      <ValidationMessage :error="error" :success="localName && !error" success-text="✓ Name is suitable!" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import StepHeader from './StepHeader.vue'
import ValidationMessage from './ValidationMessage.vue'

/**
 * Component props
 */
const props = defineProps({
  /** Current name value */
  name: {
    type: String,
    default: ''
  },
  /** Validation error message */
  error: {
    type: String,
    default: ''
  }
})

/**
 * Component events
 */
const emit = defineEmits(['update:name', 'validate'])

/**
 * Local name value for v-model
 */
const localName = ref(props.name)

/**
 * Watch for external name changes
 */
watch(() => props.name, (newName) => {
  localName.value = newName
})

/**
 * Handle input changes
 */
const handleInput = () => {
  emit('update:name', localName.value)
  emit('validate', localName.value)
}
</script>

/**
 * FormActions Component
 * 
 * Action buttons and form summary for pilot creation form
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
    <div class="flex flex-col sm:flex-row gap-4 justify-between">
      <button 
        v-if="showCancel"
        type="button" 
        class="btn btn-ghost flex-1 sm:flex-none sm:w-32" 
        @click="$emit('cancel')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left">
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
        Cancel
      </button>
      
      <button 
        type="submit" 
        class="btn btn-primary flex-1 sm:flex-none sm:w-40" 
        :disabled="!canCreate"
        :class="{ 'btn-disabled': !canCreate }"
        @click="$emit('submit')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/>
          <line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
        Create Pilot
      </button>
    </div>
    
    <FormSummary 
      v-if="formData.name || formData.pilotClass || formData.startingShip"
      :form-data="formData"
      class="mt-4 pt-4 border-t border-neutral-700"
    />
  </div>
</template>

<script setup>
import FormSummary from './FormSummary.vue'

/**
 * Component props
 */
defineProps({
  /** Whether form can be submitted */
  canCreate: {
    type: Boolean,
    default: false
  },
  /** Whether to show cancel button */
  showCancel: {
    type: Boolean,
    default: true
  },
  /** Form data for summary display */
  formData: {
    type: Object,
    required: true
  }
})

/**
 * Component events
 */
defineEmits(['cancel', 'submit'])
</script>

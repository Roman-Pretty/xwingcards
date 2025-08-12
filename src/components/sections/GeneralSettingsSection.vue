/**
 * GeneralSettingsSection.vue
 * 
 * Component for general application settings with toggle controls.
 */
<template>
  <div class="bg-neutral-800 border border-neutral-700 rounded-lg p-6 flex-1">
    <h2 class="text-xl font-semibold text-white mb-4">General Settings</h2>
    
    <div class="space-y-4">
      <SettingsToggle
        title="Enable Custom Cards"
        description="Show custom cards in the shop (owned custom cards will always be visible)"
        :model-value="enableCustomCards"
        @update:model-value="$emit('update:enableCustomCards', $event)"
      />

      <SettingsToggle
        title="Enable Faction Filtering"
        description="Only show cards from your class's allowed factions in the shop"
        :model-value="enableFactionFiltering"
        @update:model-value="$emit('update:enableFactionFiltering', $event)"
      />

      <SettingsToggle
        title="Enable Unique Card Restriction"
        description="Prevent multiple pilots from equipping unique cards with the same name"
        :model-value="enableUniqueCardRestriction"
        @update:model-value="$emit('update:enableUniqueCardRestriction', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsToggle from '../base/SettingsToggle.vue'

/**
 * Component props interface
 */
interface Props {
  /** Whether custom cards are enabled */
  enableCustomCards: boolean
  /** Whether faction filtering is enabled */
  enableFactionFiltering: boolean
  /** Whether unique card restriction is enabled */
  enableUniqueCardRestriction: boolean
}

/**
 * Component events interface
 */
interface Emits {
  /** Emitted when custom cards setting changes */
  (e: 'update:enableCustomCards', value: boolean): void
  /** Emitted when faction filtering setting changes */
  (e: 'update:enableFactionFiltering', value: boolean): void
  /** Emitted when unique card restriction setting changes */
  (e: 'update:enableUniqueCardRestriction', value: boolean): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

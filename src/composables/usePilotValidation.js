/**
 * Pilot validation composable
 * 
 * Provides validation logic for pilot creation form
 */
import { ref } from 'vue'
import { usePilotStore } from '../stores/PilotStore'

/**
 * Composable for pilot form validation
 * @returns {Object} Validation functions and reactive errors
 */
export function usePilotValidation() {
  const store = usePilotStore()
  
  /**
   * Reactive error state
   */
  const errors = ref({
    name: '',
    class: '',
    ship: ''
  })

  /**
   * Validate pilot name
   * @param {string} name - The name to validate
   * @returns {boolean} True if name is valid
   */
  const validateName = (name) => {
    errors.value.name = ""
    const trimmedName = name?.trim() || ""
    
    if (trimmedName.length === 0) {
      return false
    }
    
    if (trimmedName.length < 2) {
      errors.value.name = "Name must be at least 2 characters long"
      return false
    }
    
    if (trimmedName.length > 50) {
      errors.value.name = "Name must be less than 50 characters"
      return false
    }
    
    // Check for duplicate names
    const existingPilot = store.pilots.find(p => 
      p.name.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (existingPilot) {
      errors.value.name = "A pilot with this name already exists"
      return false
    }
    
    // Check for invalid characters
    if (!/^[a-zA-Z0-9\s\-'_.]+$/.test(trimmedName)) {
      errors.value.name = "Name contains invalid characters"
      return false
    }
    
    return true
  }

  /**
   * Clear specific error
   * @param {string} field - The field to clear error for
   */
  const clearError = (field) => {
    if (errors.value[field]) {
      errors.value[field] = ''
    }
  }

  return {
    errors,
    validateName,
    clearError
  }
}

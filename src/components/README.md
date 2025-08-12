# Component Organization

This document outlines the professional component organization structure used in this Vue.js application.

## 📁 Folder Structure

```
src/components/
├── base/           # Fundamental, reusable UI components
├── cards/          # Card-related components and modals
├── layout/         # Layout and structural components
├── modals/         # All modal dialog components
├── pilots/         # Pilot management components
├── sections/       # Page sections and feature-specific components
├── slots/          # Equipment slot components
└── index.ts        # Central export point
```

## 📦 Component Categories

### Base Components (`/base`)
Fundamental, reusable UI building blocks that can be used throughout the application.

**Components:**
- `SettingsToggle.vue` - Reusable toggle component for boolean settings

**Usage:**
```typescript
import { SettingsToggle } from '@/components/base'
```

### Layout Components (`/layout`)
Components that handle page structure, navigation, and layout concerns.

**Components:**
- `SettingsHeader.vue` - Page header with title and close functionality
- `MenuIcon.vue` - Navigation menu icon component

**Usage:**
```typescript
import { SettingsHeader, MenuIcon } from '@/components/layout'
```

### Modal Components (`/modals`)
All modal dialog components for user interactions and data input.

**Components:**
- `BaseModal.vue` - Base modal component for extending
- `ConfirmationModal.vue` - Generic confirmation dialog
- `AddXpModal.vue` - XP addition modal
- `EditPilotModal.vue` - Pilot editing modal
- `DeletePilotModal.vue` - Pilot deletion confirmation
- `FactionSelectionModal.vue` - Faction selection interface
- `SettingsModal.vue` - Application settings modal
- `RankPurchaseModal.vue` - Rank purchase interface
- `ShipPurchaseModal.vue` - Ship purchase interface

**Usage:**
```typescript
import { ConfirmationModal, EditPilotModal } from '@/components/modals'
```

### Card Components (`/cards`)
Components related to card display, management, and interactions.

**Components:**
- `Card.vue` - Individual card display component
- `CardSummary.vue` - Card summary/overview component
- `CardEquipModal.vue` - Card equipment modal
- `CardPurchaseModal.vue` - Card purchase interface
- `CardSwapModal.vue` - Card swapping interface

**Usage:**
```typescript
import { Card, CardSummary, CardEquipModal } from '@/components/cards'
```

### Pilot Components (`/pilots`)
Components for pilot management, display, and related functionality.

**Components:**
- `PilotTabs.vue` - Pilot navigation tabs
- `PilotManagementSection.vue` - Pilot management interface

**Usage:**
```typescript
import { PilotTabs, PilotManagementSection } from '@/components/pilots'
```

### Slot Components (`/slots`)
Components for equipment slot management and interactions.

**Components:**
- `Slot.vue` - Individual slot component
- `Slots.vue` - Multiple slots container
- `SlotCombinationModal.vue` - Slot combination interface
- `SlotPurchaseModal.vue` - Slot purchase interface

**Usage:**
```typescript
import { Slot, Slots, SlotCombinationModal } from '@/components/slots'
```

### Section Components (`/sections`)
Page sections and feature-specific components that organize content areas.

**Components:**
- `GeneralSettingsSection.vue` - General application settings
- `QuickActionsSection.vue` - Quick action buttons
- `DownloadResourcesSection.vue` - Resource download interface
- `ResourceCategory.vue` - Resource category grouping
- `RankList.vue` - Rank listing component
- `Ships.vue` - Ship management section

**Usage:**
```typescript
import { GeneralSettingsSection, QuickActionsSection } from '@/components/sections'
```

## 🔄 Import Patterns

### Individual Component Import
```typescript
import SettingsToggle from '@/components/base/SettingsToggle.vue'
```

### Category Import
```typescript
import { SettingsToggle } from '@/components/base'
import { Card, CardSummary } from '@/components/cards'
```

### Central Import
```typescript
import { SettingsToggle, Card, ConfirmationModal } from '@/components'
```

## 📋 Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Category Placement**: Place components in the most appropriate category
3. **Naming Convention**: Use PascalCase for component names
4. **Index Exports**: Always export new components through the category index.ts
5. **Documentation**: Document component purpose and usage in JSDoc comments

## 🔧 Adding New Components

1. Create the component in the appropriate category folder
2. Add proper TypeScript types and JSDoc documentation
3. Export the component in the category's `index.ts` file
4. Update this README if adding a new category

## 🎯 Benefits

- **Better Organization**: Components are logically grouped by functionality
- **Easier Navigation**: Developers can quickly find related components
- **Improved Maintainability**: Changes to related components are co-located
- **Scalability**: Structure supports growth without becoming unwieldy
- **Type Safety**: Comprehensive TypeScript support with proper exports
- **Developer Experience**: Clean imports and good documentation

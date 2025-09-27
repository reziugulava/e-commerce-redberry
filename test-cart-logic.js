// Simple test to debug the cart selection logic
// This can be run in the browser console

// Simulate the setCartSelection function
function setCartSelection(selection) {
  const CART_SELECTIONS_KEY = 'cart_selections'
  
  try {
    const stored = localStorage.getItem(CART_SELECTIONS_KEY)
    const selections = stored ? JSON.parse(stored) : []
    
    const existingIndex = selections.findIndex(
      s =>
        s.productId === selection.productId &&
        s.selected_color === selection.selected_color &&
        s.selected_size === selection.selected_size
    )

    console.log('setCartSelection called:', {
      selection,
      existingIndex,
      existingSelections: selections.length,
      existing: existingIndex >= 0 ? selections[existingIndex] : null,
      allSelections: selections
    })

    const newSelection = {
      ...selection,
      timestamp: Date.now(),
    }

    if (existingIndex >= 0) {
      const updatedQuantity = selections[existingIndex].quantity + (selection.quantity || 1)
      selections[existingIndex] = {
        ...newSelection,
        quantity: updatedQuantity,
      }
      console.log('🔥 UPDATED EXISTING VARIANT - THIS MIGHT BE THE BUG:', updatedQuantity)
    } else {
      selections.push({
        ...newSelection,
        quantity: selection.quantity || 1,
      })
      console.log('✅ Added new variant, quantity:', selection.quantity || 1)
    }

    localStorage.setItem(CART_SELECTIONS_KEY, JSON.stringify(selections))
    console.log('Final selections after setCartSelection:', selections)
    return selections
  } catch (error) {
    console.error('Error saving cart selection to localStorage:', error)
  }
}

// Clear localStorage first
localStorage.removeItem('cart_selections')
console.log('=== CLEARED LOCALSTORAGE ===')

// Test case 1: Add Product 1, Red, M, quantity 1
console.log('\n=== TEST 1: Add Product 1, Red, M, quantity 1 ===')
setCartSelection({
  productId: 1,
  selected_color: 'Red',
  selected_size: 'M',
  quantity: 1
})

// Test case 2: Add Product 1, Blue, L, quantity 1
console.log('\n=== TEST 2: Add Product 1, Blue, L, quantity 1 ===')
setCartSelection({
  productId: 1,
  selected_color: 'Blue',
  selected_size: 'L',
  quantity: 1
})

// Test case 3: Add Product 1, Red, M, quantity 1 again (should increment)
console.log('\n=== TEST 3: Add Product 1, Red, M, quantity 1 again (should increment) ===')
setCartSelection({
  productId: 1,
  selected_color: 'Red',
  selected_size: 'M',
  quantity: 1
})

console.log('\n=== FINAL RESULT ===')
const final = JSON.parse(localStorage.getItem('cart_selections') || '[]')
console.log('Final localStorage state:', final)
console.log('Expected: 2 entries - Red/M with quantity 2, Blue/L with quantity 1')
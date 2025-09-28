# Authentication Error Messages Test Guide

## Overview
The authentication system now provides specific, user-friendly error messages for different types of login and registration failures.

## Login Error Messages

### 1. Invalid Credentials (401 Unauthenticated)
**Trigger:** Enter wrong email or password
**Expected Message:** 
- "Incorrect email or password. Please check your credentials and try again."
- OR "Authentication failed. Please check your email and password."

### 2. Validation Errors (422)
**Trigger:** Enter invalid data format (invalid email, etc.)
**Expected Message:** Shows the specific validation error from the API

### 3. Rate Limiting (429)
**Trigger:** Too many login attempts
**Expected Message:** "Too many login attempts. Please wait a moment and try again."

### 4. Server Error (500)
**Trigger:** Server is down or experiencing issues
**Expected Message:** "Server error. Please try again later."

### 5. Network Error
**Trigger:** No internet connection
**Expected Message:** "Network error. Please check your internet connection and try again."

## Register Error Messages

### 1. Email Already Exists (409)
**Expected Message:** "An account with this email already exists."

### 2. Validation Errors (422)
**Trigger:** 
- Weak password
- Invalid email format
- Username too short
- Passwords don't match
**Expected Message:** Shows specific validation error (first error if multiple)

### 3. File Upload Errors
**Trigger:** Upload file that's too large or wrong format
**Expected Message:** Shows specific file validation error

## Testing Steps

### Test Login Errors
1. Go to `/login`
2. Enter `wrong@email.com` / `wrongpassword`
3. Click Login
4. **Verify:** Error shows "Incorrect email or password..." message
5. **Verify:** No page refresh occurs
6. **Verify:** Error clears when you start typing

### Test Registration Errors
1. Go to `/register`
2. Enter existing email
3. Click Register
4. **Verify:** Shows "An account with this email already exists"
5. **Verify:** Error clears when you start typing

### Test Network Errors
1. Disconnect internet
2. Try to login/register
3. **Verify:** Shows network error message

## Error Message Priority

The system shows errors in this priority order:
1. **Specific API error message** (most detailed)
2. **HTTP status-based message** (generic but appropriate)
3. **Fallback message** (last resort)

## Error UX Features

✅ **Clear error styling** - Red background with border
✅ **Error persistence** - Errors stay until user starts typing
✅ **No page refresh** - Errors display without navigation
✅ **Specific messages** - Different errors for different problems
✅ **User-friendly language** - No technical jargon
<?php
/**
 * SignBridge - User Registration API
 * File: C:\xampp\htdocs\signbridge\backend\api\register.php
 * 
 * This endpoint handles user registration
 * Accepts: POST request with JSON body {name, email, password}
 * Returns: JSON response with success status
 */

require_once 'config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Only POST method is allowed', [], 405);
}

// Get JSON input from request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if JSON is valid
if (json_last_error() !== JSON_ERROR_NONE) {
    sendResponse(false, 'Invalid JSON data', [], 400);
}

// Extract and sanitize input data
$name = sanitizeInput($data['name'] ?? '');
$email = sanitizeInput($data['email'] ?? '');
$password = $data['password'] ?? '';

// ========== VALIDATION ==========

// Check if all fields are provided
if (empty($name) || empty($email) || empty($password)) {
    sendResponse(false, 'All fields are required (name, email, password)', [], 400);
}

// Validate name length
if (strlen($name) < 2) {
    sendResponse(false, 'Name must be at least 2 characters long', [], 400);
}

if (strlen($name) > 100) {
    sendResponse(false, 'Name must not exceed 100 characters', [], 400);
}

// Validate email format
if (!validateEmail($email)) {
    sendResponse(false, 'Invalid email format. Please enter a valid email address.', [], 400);
}

// Validate password strength
if (strlen($password) < 8) {
    sendResponse(false, 'Password must be at least 8 characters long', [], 400);
}

if (strlen($password) > 255) {
    sendResponse(false, 'Password is too long. Maximum 255 characters.', [], 400);
}

// Optional: Additional password strength validation
// Uncomment the lines below for stronger password requirements
/*
if (!preg_match('/[A-Z]/', $password)) {
    sendResponse(false, 'Password must contain at least one uppercase letter', [], 400);
}
if (!preg_match('/[a-z]/', $password)) {
    sendResponse(false, 'Password must contain at least one lowercase letter', [], 400);
}
if (!preg_match('/[0-9]/', $password)) {
    sendResponse(false, 'Password must contain at least one number', [], 400);
}
*/

// ========== DATABASE OPERATIONS ==========

// Get database connection
$conn = getDBConnection();

try {
    // Check if email already exists in database
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $stmt->close();
        $conn->close();
        sendResponse(false, 'Email already registered. Please use a different email or try logging in.', [], 409);
    }
    $stmt->close();
    
    // Hash password using bcrypt (industry standard)
    // Cost factor of 12 provides good security vs performance balance
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    
    if ($hashedPassword === false) {
        $conn->close();
        sendResponse(false, 'Failed to process password. Please try again.', [], 500);
    }
    
    // Insert new user into database
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $name, $email, $hashedPassword);
    
    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        
        $stmt->close();
        $conn->close();
        
        // Send success response
        sendResponse(true, 'Registration successful! You can now login with your credentials.', [
            'user_id' => $userId,
            'name' => $name,
            'email' => $email
        ], 201);
    } else {
        throw new Exception('Failed to insert user into database: ' . $stmt->error);
    }
    
} catch (Exception $e) {
    // Clean up resources
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
    
    // Log error for debugging (in production, log to file instead)
    error_log('Registration error: ' . $e->getMessage());
    
    // Send generic error to user (don't expose internal errors)
    sendResponse(false, 'Registration failed due to a server error. Please try again later.', [], 500);
}
?>
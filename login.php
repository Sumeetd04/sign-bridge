<?php
/**
 * SignBridge - User Login API
 * File: C:\xampp\htdocs\signbridge\backend\api\login.php
 * 
 * This endpoint handles user authentication
 * Accepts: POST request with JSON body {email, password}
 * Returns: JSON response with user data if successful
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
$email = sanitizeInput($data['email'] ?? '');
$password = $data['password'] ?? '';

// ========== VALIDATION ==========

// Check if both fields are provided
if (empty($email) || empty($password)) {
    sendResponse(false, 'Email and password are required', [], 400);
}

// Validate email format
if (!validateEmail($email)) {
    sendResponse(false, 'Invalid email format. Please enter a valid email address.', [], 400);
}

// ========== DATABASE OPERATIONS ==========

// Get database connection
$conn = getDBConnection();

try {
    // Fetch user data by email
    $stmt = $conn->prepare("SELECT id, name, email, password, created_at, last_login FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Check if user exists
    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        
        // Generic error message (don't reveal if email exists or not for security)
        sendResponse(false, 'Invalid email or password. Please check your credentials and try again.', [], 401);
    }
    
    // Get user data
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // ========== PASSWORD VERIFICATION ==========
    
    // Verify password using password_verify (handles bcrypt automatically)
    if (!password_verify($password, $user['password'])) {
        $conn->close();
        
        // Generic error message for security
        sendResponse(false, 'Invalid email or password. Please check your credentials and try again.', [], 401);
    }
    
    // ========== UPDATE LAST LOGIN ==========
    
    // Update last login timestamp
    $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $updateStmt->bind_param("i", $user['id']);
    $updateStmt->execute();
    $updateStmt->close();
    
    // ========== PREPARE RESPONSE ==========
    
    // Remove sensitive data from response
    unset($user['password']);
    
    // Close database connection
    $conn->close();
    
    // Send success response with user data
    sendResponse(true, 'Login successful! Welcome back, ' . $user['name'] . '!', [
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'created_at' => $user['created_at'],
            'last_login' => $user['last_login']
        ]
    ], 200);
    
} catch (Exception $e) {
    // Clean up resources
    if (isset($stmt)) $stmt->close();
    if (isset($updateStmt)) $updateStmt->close();
    if (isset($conn)) $conn->close();
    
    // Log error for debugging (in production, log to file)
    error_log('Login error: ' . $e->getMessage());
    
    // Send generic error to user (don't expose internal errors)
    sendResponse(false, 'Login failed due to a server error. Please try again later.', [], 500);
}
?>
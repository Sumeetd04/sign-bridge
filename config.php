<?php
/**
 * SignBridge - Database Configuration & Helper Functions
 * File: C:\xampp\htdocs\signbridge\backend\api\config.php
 * 
 * This file contains:
 * - Database connection settings
 * - CORS headers for API access
 * - Helper functions for common operations
 */

// ========== ERROR REPORTING (Development Mode) ==========
// Enable detailed error reporting for development
// IMPORTANT: Disable in production for security!
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', dirname(__FILE__) . '/../../error.log');

// ========== CORS HEADERS ==========
// Allow frontend to communicate with backend API
// These headers enable cross-origin requests
header("Access-Control-Allow-Origin: *");  // Allow all origins
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");  // Allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization");  // Allowed headers
header("Content-Type: application/json; charset=UTF-8");  // Response type

// Handle preflight OPTIONS requests
// Browsers send OPTIONS request before actual request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ========== DATABASE CONFIGURATION ==========
// MySQL database connection settings
// Default XAMPP values:
define('DB_HOST', 'localhost');      // Database server (usually localhost)
define('DB_USER', 'root');           // Database username (default: root)
define('DB_PASS', '');               // Database password (default: empty for XAMPP)
define('DB_NAME', 'signbridge');     // Database name

// Alternative configuration for production:
// define('DB_HOST', 'your-server.com');
// define('DB_USER', 'your_username');
// define('DB_PASS', 'your_secure_password');
// define('DB_NAME', 'signbridge');

// ========== DATABASE CONNECTION FUNCTION ==========
/**
 * Get Database Connection
 * 
 * Creates and returns a MySQLi database connection
 * Terminates script with error message if connection fails
 * 
 * @return mysqli Database connection object
 */
function getDBConnection() {
    // Create new MySQLi connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check if connection was successful
    if ($conn->connect_error) {
        // Log the actual error for debugging
        error_log('Database connection failed: ' . $conn->connect_error);
        
        // Send user-friendly error response
        http_response_code(500);
        die(json_encode([
            'success' => false, 
            'message' => 'Database connection failed. Please try again later.',
            'error' => 'Connection error' // Don't expose actual error to users in production
        ]));
    }
    
    // Set charset to utf8mb4 for full Unicode support (including emojis)
    if (!$conn->set_charset("utf8mb4")) {
        error_log('Error setting charset: ' . $conn->error);
    }
    
    return $conn;
}

// ========== RESPONSE HELPER FUNCTION ==========
/**
 * Send JSON Response
 * 
 * Standardized function to send JSON responses
 * Automatically sets HTTP status code and terminates script
 * 
 * @param bool $success Success status (true/false)
 * @param string $message Response message for user
 * @param array $data Additional data to include (optional)
 * @param int $httpCode HTTP status code (default: 200)
 * 
 * @return void (terminates script)
 */
function sendResponse($success, $message, $data = [], $httpCode = 200) {
    // Set HTTP response code
    http_response_code($httpCode);
    
    // Build response array
    $response = [
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')  // Add timestamp to response
    ];
    
    // Merge additional data if provided
    if (!empty($data)) {
        $response = array_merge($response, $data);
    }
    
    // Send JSON response and terminate
    echo json_encode($response, JSON_PRETTY_PRINT);
    exit();
}

// ========== VALIDATION HELPER FUNCTIONS ==========

/**
 * Validate Email Format
 * 
 * Checks if email address is in valid format
 * 
 * @param string $email Email address to validate
 * @return bool True if valid, false otherwise
 */
function validateEmail($email) {
    // Use PHP's built-in email validation
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Sanitize Input
 * 
 * Removes whitespace, slashes, and special characters
 * Helps prevent XSS attacks
 * 
 * @param string $data Input data to sanitize
 * @return string Sanitized data
 */
function sanitizeInput($data) {
    // Remove whitespace from beginning and end
    $data = trim($data);
    
    // Remove backslashes
    $data = stripslashes($data);
    
    // Convert special characters to HTML entities
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    
    return $data;
}

/**
 * Validate Password Strength
 * 
 * Checks if password meets minimum requirements
 * 
 * @param string $password Password to validate
 * @return array ['valid' => bool, 'message' => string]
 */
function validatePasswordStrength($password) {
    $errors = [];
    
    // Check minimum length
    if (strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters long';
    }
    
    // Check maximum length
    if (strlen($password) > 255) {
        $errors[] = 'Password must not exceed 255 characters';
    }
    
    // Optional: Check for uppercase letter
    // Uncomment to enable
    // if (!preg_match('/[A-Z]/', $password)) {
    //     $errors[] = 'Password must contain at least one uppercase letter';
    // }
    
    // Optional: Check for lowercase letter
    // if (!preg_match('/[a-z]/', $password)) {
    //     $errors[] = 'Password must contain at least one lowercase letter';
    // }
    
    // Optional: Check for number
    // if (!preg_match('/[0-9]/', $password)) {
    //     $errors[] = 'Password must contain at least one number';
    // }
    
    // Optional: Check for special character
    // if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
    //     $errors[] = 'Password must contain at least one special character';
    // }
    
    return [
        'valid' => empty($errors),
        'message' => empty($errors) ? 'Password is valid' : implode('. ', $errors)
    ];
}

// ========== SECURITY HELPER FUNCTIONS ==========

/**
 * Generate CSRF Token
 * 
 * Creates a random token for CSRF protection
 * Store in session and verify on form submissions
 * 
 * @return string Random token
 */
function generateCSRFToken() {
    return bin2hex(random_bytes(32));
}

/**
 * Rate Limiting Check (Simple Implementation)
 * 
 * Prevents too many requests from same IP
 * Use Redis or Memcached for production
 * 
 * @param string $action Action being performed (e.g., 'login', 'register')
 * @param int $maxAttempts Maximum attempts allowed
 * @param int $timeWindow Time window in seconds
 * @return bool True if allowed, false if rate limited
 */
function checkRateLimit($action, $maxAttempts = 5, $timeWindow = 300) {
    // Get client IP address
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Create unique key for this IP and action
    $key = $action . '_' . $ip;
    
    // Store in session (for simple implementation)
    // In production, use Redis or Memcached
    session_start();
    
    $now = time();
    
    if (!isset($_SESSION['rate_limit'][$key])) {
        $_SESSION['rate_limit'][$key] = ['count' => 1, 'reset' => $now + $timeWindow];
        return true;
    }
    
    $data = $_SESSION['rate_limit'][$key];
    
    // Check if time window has expired
    if ($now > $data['reset']) {
        $_SESSION['rate_limit'][$key] = ['count' => 1, 'reset' => $now + $timeWindow];
        return true;
    }
    
    // Check if max attempts exceeded
    if ($data['count'] >= $maxAttempts) {
        return false;
    }
    
    // Increment counter
    $_SESSION['rate_limit'][$key]['count']++;
    return true;
}

// ========== LOGGING HELPER FUNCTION ==========

/**
 * Log Activity
 * 
 * Logs user activities to file or database
 * 
 * @param string $action Action performed
 * @param array $data Additional data to log
 * @return void
 */
function logActivity($action, $data = []) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'action' => $action,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'data' => $data
    ];
    
    // Log to file
    $logFile = dirname(__FILE__) . '/../../logs/activity.log';
    $logDir = dirname($logFile);
    
    // Create logs directory if it doesn't exist
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    // Write log entry
    file_put_contents($logFile, json_encode($logEntry) . PHP_EOL, FILE_APPEND);
}

// ========== CONFIGURATION COMPLETE ==========
// All helper functions loaded and ready to use
?>
<?php
/**
 * SignBridge - Database Test Script
 * File: C:\xampp\htdocs\signbridge\backend\api\test_db.php
 * 
 * Use this to test if your database connection is working
 */

require_once 'config.php';

echo "<h2>SignBridge Database Connection Test</h2>";

try {
    // Test database connection
    $conn = getDBConnection();
    
    if ($conn->connect_error) {
        echo "<p style='color: red;'>❌ Database connection failed: " . $conn->connect_error . "</p>";
    } else {
        echo "<p style='color: green;'>✅ Database connection successful!</p>";
        
        // Test if users table exists
        $result = $conn->query("SHOW TABLES LIKE 'users'");
        if ($result->num_rows > 0) {
            echo "<p style='color: green;'>✅ Users table exists</p>";
            
            // Count users
            $countResult = $conn->query("SELECT COUNT(*) as count FROM users");
            $count = $countResult->fetch_assoc()['count'];
            echo "<p>📊 Total users: " . $count . "</p>";
            
            // Show sample users
            if ($count > 0) {
                $usersResult = $conn->query("SELECT id, name, email, created_at FROM users LIMIT 5");
                echo "<h3>Sample Users:</h3>";
                echo "<table border='1' cellpadding='5'>";
                echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Created At</th></tr>";
                while ($user = $usersResult->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>" . $user['id'] . "</td>";
                    echo "<td>" . $user['name'] . "</td>";
                    echo "<td>" . $user['email'] . "</td>";
                    echo "<td>" . $user['created_at'] . "</td>";
                    echo "</tr>";
                }
                echo "</table>";
            }
        } else {
            echo "<p style='color: orange;'>⚠️ Users table doesn't exist. Run the database.sql script first.</p>";
        }
    }
    
    $conn->close();
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h3>Next Steps:</h3>";
echo "<ol>";
echo "<li>Run the database.sql file in phpMyAdmin</li>";
echo "<li>Test registration at: <a href='http://localhost/signbridge/backend/api/register.php'>register.php</a></li>";
echo "<li>Test login at: <a href='http://localhost/signbridge/backend/api/login.php'>login.php</a></li>";
echo "</ol>";
?>
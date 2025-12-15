-- File: C:\xampp\htdocs\signbridge\database\database.sql
-- SignBridge Database Schema
-- Import this file into phpMyAdmin or run via MySQL command line

-- Create database
CREATE DATABASE IF NOT EXISTS signbridge CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE signbridge;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User quiz progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_type VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((score / total_questions) * 100) STORED,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_quiz (user_id, quiz_type),
    INDEX idx_completed (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User dictionary favorites table
CREATE TABLE IF NOT EXISTS user_dictionary_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    word VARCHAR(100) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_word (user_id, category, word),
    INDEX idx_user_category (user_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Learning sessions table (tracks user study sessions)
CREATE TABLE IF NOT EXISTS learning_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    section VARCHAR(50) NOT NULL,
    duration_seconds INT DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sessions (user_id, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing (optional)
-- Uncomment the lines below to create a test user
-- Password: test123456 (hashed with bcrypt)

-- INSERT INTO users (name, email, password) VALUES 
-- ('Test User', 'test@signbridge.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5OfmxqfX0PLAC');

-- Create views for analytics (optional)

-- View: User quiz statistics
CREATE OR REPLACE VIEW user_quiz_stats AS
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    COUNT(up.id) AS total_quizzes,
    AVG(up.percentage) AS avg_score,
    MAX(up.percentage) AS best_score,
    MIN(up.percentage) AS lowest_score
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
GROUP BY u.id, u.name, u.email;

-- View: Recent user activity
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
    u.id AS user_id,
    u.name,
    up.quiz_type,
    up.score,
    up.total_questions,
    up.percentage,
    up.completed_at
FROM users u
INNER JOIN user_progress up ON u.id = up.user_id
ORDER BY up.completed_at DESC
LIMIT 50;

-- Success message
SELECT 'Database schema created successfully!' AS message;
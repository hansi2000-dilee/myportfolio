CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS personal_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    hero_description TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    photo_url VARCHAR(500),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    facebook VARCHAR(255),
    cv_url VARCHAR(500),
    years_experience VARCHAR(50),
    projects_completed VARCHAR(50),
    happy_clients VARCHAR(50),
    certifications VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS skill_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    duration VARCHAR(100),
    description TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    duration VARCHAR(100),
    description TEXT
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies VARCHAR(255),
    image_url VARCHAR(500), -- Legacy/Fallback
    link VARCHAR(255),
    demo_link VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    title VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    date VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    link VARCHAR(500)
);

-- Insert Default Admin (Password: admin123)
-- We use IGNORE so we don't duplicate if run multiple times
INSERT IGNORE INTO admin (username, password) VALUES ('admin', 'admin123');

-- Insert Initial Data (based on your profile) if table is empty
INSERT INTO personal_details (name, title, description, email, phone, address, photo_url, linkedin, github, facebook) 
SELECT 'Hansi Dileesha', 'Full-stack Software Engineer', 'A passionate and results-driven Software Engineer...', 'hansidileesha206@gmail.com', '94 775650717', 'No .205, Saman Pedesa, Ratnapura', '', 'https://www.linkedin.com/in/hansi-dileesha-65b1aa255/', 'https://github.com/hansi2000-dilee', 'https://www.facebook.com/profile.php?id=100071022406204'
WHERE NOT EXISTS (SELECT * FROM personal_details);

CREATE DATABASE dtephase1

CREATE TABLE colleges (
    college_id SERIAL PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    district VARCHAR(255),
    established_year INTEGER
);


CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255) NOT NULL,
    college_id INT,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id) ON DELETE CASCADE
);


CREATE TABLE job_posts (
    job_id SERIAL PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT,
    eligibility TEXT,
    department_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gov_order_id VARCHAR(255),
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user'))
);

{/*
"jobTitle": "Assistant Professor",
    "jobDescription": "Teaching courses and guiding students",
    "eligibility": "PhD in Computer Science",
    "collegeName": "Government Engineering College, Kozhikode",
    "depName": "Mechanical Engineering",
    "orderNo": "GO-121" */}



import pool from './config/db';

async function createTables() {
  try {
    // Create Admin table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Admin (
        email VARCHAR(100) NOT NULL PRIMARY KEY,
        password VARCHAR(255) NOT NULL
      );
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Category (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Item (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        quantity INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(12,2) NOT NULL,
        category_id VARCHAR(64) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES Category(id)
      );
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS School (
        id VARCHAR(64) PRIMARY KEY, 
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        contactNumber VARCHAR(50) NOT NULL,
        contactEmail VARCHAR(255) NOT NULL,
        numberOfStudents INTEGER NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS SchoolItem (
        schoolId VARCHAR(64) NOT NULL,
        itemId VARCHAR(64) NOT NULL,
        name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (schoolId, itemId),
        FOREIGN KEY (schoolId) REFERENCES School(id)
      );
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Student (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        class VARCHAR(100) NOT NULL,
        contact VARCHAR(50) NOT NULL,
        emailId VARCHAR(255),
        address TEXT,
        details TEXT,
        dateOfBirth DATE NOT NULL,
        dateOfAdmission DATE NOT NULL,
        fatherName VARCHAR(255),
        motherName VARCHAR(255),
        fatherPhone VARCHAR(50),
        motherPhone VARCHAR(50),
        imageUrl VARCHAR(512),
        schoolId VARCHAR(64) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (schoolId) REFERENCES School(id)
      );
    `);

    await pool.execute(`
    CREATE TABLE IF NOT EXISTS Transaction (
    id VARCHAR(64) PRIMARY KEY,
    date DATE NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(255) NOT NULL,
    schoolName VARCHAR(255),
    schoolId VARCHAR(64),
    studentId VARCHAR(64),
    itemName VARCHAR(255),
    quantity INT,           
    price DECIMAL(15,2),    
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schoolId) REFERENCES School(id),
    FOREIGN KEY (studentId) REFERENCES Student(id)
  );
    `);
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Alumni (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        class VARCHAR(100) NOT NULL,
        contact VARCHAR(50) NOT NULL,
        emailId VARCHAR(255),
        address TEXT,
        details TEXT,
        dateOfBirth DATE NOT NULL,
        dateOfAdmission DATE NOT NULL,
        fatherName VARCHAR(255),
        motherName VARCHAR(255),
        fatherPhone VARCHAR(50),
        motherPhone VARCHAR(50),
        imageUrl VARCHAR(512),
        schoolId VARCHAR(64) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (schoolId) REFERENCES School(id)
      );
    `);


    await pool.query(`
      CREATE VIEW  PurchaseHistory AS
      SELECT 
        date,
        schoolId,
        studentId,
        itemName,
        quantity
      FROM Transaction
      WHERE type = 'income' AND itemName IS NOT NULL;
    `);


    console.log('Tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

createTables();
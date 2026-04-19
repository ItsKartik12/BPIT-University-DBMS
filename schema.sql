-- 1. Colleges Table
CREATE TABLE COLLEGES (
    CollegeID INT PRIMARY KEY,
    Name VARCHAR(100),
    Address VARCHAR(255),
    Contact_No VARCHAR(15)
);

-- 2. Departments Table (1:N relationship with Colleges)
CREATE TABLE DEPARTMENTS (
    DeptID INT PRIMARY KEY,
    Dept_Name VARCHAR(100),
    Contact_No VARCHAR(15),
    HOD_Name VARCHAR(100),
    CollegeID INT,
    FOREIGN KEY (CollegeID) REFERENCES COLLEGES(CollegeID)
);

-- 3. Students Table
CREATE TABLE STUDENTS (
    RollNo VARCHAR(20) PRIMARY KEY,
    Name VARCHAR(100),
    Year INT,
    Address VARCHAR(255),
    Contact_No VARCHAR(15)
);

-- 4. Progress Report Table (Weak entity dependent on Students)
CREATE TABLE PROGRESS_REPORT (
    ReportID INT PRIMARY KEY,
    Year INT,
    Grade VARCHAR(2),
    Rank INT,
    RollNo VARCHAR(20),
    FOREIGN KEY (RollNo) REFERENCES STUDENTS (RollNo) ON DELETE CASCADE
);

-- 5. Courses Table (1:N relationship with Departments)
CREATE TABLE COURSES (
    CourseNo VARCHAR(20) PRIMARY KEY,
    Course_Title VARCHAR(100),
    Year INT,
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES DEPARTMENTS(DeptID)
);

-- 6. Faculty Table (1:N relationship with Departments)
CREATE TABLE FACULTY (
    FacultyID INT PRIMARY KEY,
    Name VARCHAR(100),
    Designation VARCHAR(50),
    Qualification VARCHAR(50),
    Address VARCHAR(255),
    Contact_No VARCHAR(15),
    DeptID INT,
    FOREIGN KEY (DeptID) REFERENCES DEPARTMENTS(DeptID)
);

-- 7. Teaches Junction Table (M:N relationship between Faculty and Courses)
CREATE TABLE TEACHES (
    FacultyID INT,
    CourseNo VARCHAR(20),
    PRIMARY KEY (FacultyID, CourseNo),
    FOREIGN KEY (FacultyID) REFERENCES FACULTY (FacultyID),
    FOREIGN KEY (CourseNo) REFERENCES COURSES (CourseNo)
);

-- 8. Enrolled Junction Table (M:N relationship between Students and Courses)
CREATE TABLE ENROLLED (
    RollNo VARCHAR(20),
    CourseNo VARCHAR(20),
    PRIMARY KEY (RollNo, CourseNo),
    FOREIGN KEY (RollNo) REFERENCES STUDENTS(RollNo),
    FOREIGN KEY (CourseNo) REFERENCES COURSES(CourseNo)
);
-- Populating Colleges
INSERT INTO COLLEGES VALUES (1, 'BPIT', 'Rohini, Delhi', '011-2704');

-- Populating Departments
INSERT INTO DEPARTMENTS VALUES (101, 'CSE', '9999999999', 'Dr. Vishal', 1);
INSERT INTO DEPARTMENTS VALUES (102, 'IT', '9811111111', 'Dr. Akansha', 1);

-- Populating Students
INSERT INTO STUDENTS VALUES ('09320802724', 'Kartik Goyal', 2, 'Delhi, India', '9876543210');
INSERT INTO STUDENTS VALUES ('09320802725', 'Anjali Sharma', 2, 'Dwarka, Delhi', '9866666666');

-- Populating Faculty
INSERT INTO FACULTY VALUES (201, 'Ms. Tanisha Madan', 'Assistant Professor', 'M.Tech', 'Delhi', '9833333333', 101);
INSERT INTO FACULTY VALUES (202, 'Dr. Vishal', 'HOD', 'Ph.D', 'Rohini', '9844444444', 101);

-- Populating Courses
INSERT INTO COURSES VALUES ('CIC-206', 'Theory of Computation', 2, 101);
INSERT INTO COURSES VALUES ('CIC-210', 'Database Management', 2, 101);

-- Linking Faculty to Courses (TEACHES)
INSERT INTO TEACHES VALUES (201, 'CIC-206');
INSERT INTO TEACHES VALUES (201, 'CIC-210');

-- Linking Students to Courses (ENROLLED)
INSERT INTO ENROLLED VALUES ('09320802724', 'CIC-206');
INSERT INTO ENROLLED VALUES ('09320802724', 'CIC-210');

-- Populating Progress Reports
INSERT INTO PROGRESS_REPORT VALUES (8001, 2026, 'A', 1, '09320802724');
INSERT INTO PROGRESS_REPORT VALUES (8002, 2026, 'A+', 1, '09320802725');
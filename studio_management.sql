CREATE TABLE Departments (
    DepartmentID NVARCHAR(20) PRIMARY KEY,
    Name NVARCHAR(100)
);

CREATE TABLE Employees (
    EmployeeID NVARCHAR(20) PRIMARY KEY,
    Name NVARCHAR(100),
    Email NVARCHAR(100) UNIQUE,
    Password NVARCHAR(100),
    Role NVARCHAR(100),
    DepartmentID NVARCHAR(20),
    Status NVARCHAR(20),
    SystemRole NVARCHAR(20),
    Phone NVARCHAR(20),
    Street NVARCHAR(100),
    City NVARCHAR(50),
    State NVARCHAR(50),
    Zip NVARCHAR(10),
    ReportsTo NVARCHAR(20) NULL,
    RevenueGenerated DECIMAL(12,2),
    ReferralCode NVARCHAR(50),
    LeaveAnnual INT,
    LeaveSick INT,
    LeavePersonal INT,
    CONSTRAINT FK_Employees_Department FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
    CONSTRAINT FK_Employees_ReportsTo FOREIGN KEY (ReportsTo) REFERENCES Employees(EmployeeID)
);

CREATE TABLE Customers (
    CustomerID NVARCHAR(20) PRIMARY KEY,
    Name NVARCHAR(100),
    Company NVARCHAR(100),
    Email NVARCHAR(100),
    Phone NVARCHAR(20),
    Street NVARCHAR(100),
    City NVARCHAR(50),
    State NVARCHAR(50),
    Zip NVARCHAR(10),
    LastActivity DATE,
    Status NVARCHAR(20)
);

CREATE TABLE Projects (
    ProjectID NVARCHAR(20) PRIMARY KEY,
    Name NVARCHAR(100),
    Client NVARCHAR(100),
    Status NVARCHAR(20),
    Progress INT,
    Budget DECIMAL(12,2),
    Spent DECIMAL(12,2),
    Deadline DATE,
    CustomerID NVARCHAR(20),
    CONSTRAINT FK_Projects_Customer FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE ProjectTeams (
    ProjectID NVARCHAR(20),
    EmployeeID NVARCHAR(20),
    Role NVARCHAR(50),
    PRIMARY KEY(ProjectID, EmployeeID),
    CONSTRAINT FK_ProjectTeams_Project FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID),
    CONSTRAINT FK_ProjectTeams_Employee FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);

CREATE TABLE Tasks (
    TaskID NVARCHAR(20) PRIMARY KEY,
    Title NVARCHAR(200),
    Status NVARCHAR(20),
    Priority NVARCHAR(20),
    AssigneeID NVARCHAR(20),
    ProjectID NVARCHAR(20),
    Points INT,
    StartDate DATE,
    Deadline DATE,
    CONSTRAINT FK_Tasks_Assignee FOREIGN KEY (AssigneeID) REFERENCES Employees(EmployeeID),
    CONSTRAINT FK_Tasks_Project FOREIGN KEY (ProjectID) REFERENCES Projects(ProjectID)
);

CREATE TABLE WalletTransactions (
    TransactionID NVARCHAR(20) PRIMARY KEY,
    EmployeeID NVARCHAR(20),
    [Date] DATE,
    Description NVARCHAR(200),
    Amount DECIMAL(10,2),
    Type NVARCHAR(50),
    CONSTRAINT FK_WalletTransactions_Employee FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID)
);

CREATE TABLE Categories (
    CategoryID NVARCHAR(20) PRIMARY KEY,
    Name NVARCHAR(100)
);

CREATE TABLE Products (
    ProductID NVARCHAR(20) PRIMARY KEY,
    Name NVARCHAR(100),
    SKU NVARCHAR(50),
    CategoryID NVARCHAR(20),
    Price DECIMAL(10,2),
    Description NVARCHAR(500),
    Image NVARCHAR(255),
    Stock INT,
    CreatedAt DATE,
    CONSTRAINT FK_Products_Category FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);

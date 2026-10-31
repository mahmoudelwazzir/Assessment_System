USE [ElsewedySchoolSys];

-- 1. Insert Instructors
IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundInstructor] WHERE CourseRoundId = 10 AND InstructorAccountId = 4)
BEGIN
    INSERT INTO [dbo].[CourseRoundInstructor] (CourseRoundId, InstructorAccountId, CourseRoundInstructorSubRole_StatusID, RoleId, AssignedDate)
    VALUES (10, 4, 65, 24, SYSDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundInstructor] WHERE CourseRoundId = 10 AND InstructorAccountId = 8421)
BEGIN
    INSERT INTO [dbo].[CourseRoundInstructor] (CourseRoundId, InstructorAccountId, CourseRoundInstructorSubRole_StatusID, RoleId, AssignedDate)
    VALUES (10, 8421, 65, 7, SYSDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundInstructor] WHERE CourseRoundId = 10 AND InstructorAccountId = 8417)
BEGIN
    INSERT INTO [dbo].[CourseRoundInstructor] (CourseRoundId, InstructorAccountId, CourseRoundInstructorSubRole_StatusID, RoleId, AssignedDate)
    VALUES (10, 8417, 67, 7, SYSDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundInstructor] WHERE CourseRoundId = 11 AND InstructorAccountId = 4)
BEGIN
    INSERT INTO [dbo].[CourseRoundInstructor] (CourseRoundId, InstructorAccountId, CourseRoundInstructorSubRole_StatusID, RoleId, AssignedDate)
    VALUES (11, 4, 65, 24, SYSDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundInstructor] WHERE CourseRoundId = 11 AND InstructorAccountId = 8417)
BEGIN
    INSERT INTO [dbo].[CourseRoundInstructor] (CourseRoundId, InstructorAccountId, CourseRoundInstructorSubRole_StatusID, RoleId, AssignedDate)
    VALUES (11, 8417, 67, 7, SYSDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundInstructor] WHERE CourseRoundId = 22 AND InstructorAccountId = 8421)
BEGIN
    INSERT INTO [dbo].[CourseRoundInstructor] (CourseRoundId, InstructorAccountId, CourseRoundInstructorSubRole_StatusID, RoleId, AssignedDate)
    VALUES (22, 8421, 65, 7, SYSDATETIME());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundInstructor] WHERE CourseRoundId = 22 AND InstructorAccountId = 8417)
BEGIN
    INSERT INTO [dbo].[CourseRoundInstructor] (CourseRoundId, InstructorAccountId, CourseRoundInstructorSubRole_StatusID, RoleId, AssignedDate)
    VALUES (22, 8417, 67, 7, SYSDATETIME());
END

-- 2. Insert Assignments
IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundAssignments] WHERE CourseRoundId = 7)
BEGIN
    INSERT INTO [dbo].[CourseRoundAssignments] (Title, Description, AssignmentLink, Deadline, TotalGrade, CourseRoundId, InstructorId, StatusId, CreatedAt)
    VALUES 
    (N'Lab Assessment 1: Truth Table & Karnaugh Map Simplification', N'Analyze logic diagrams and reduce combinational logic expressions to minimal SOP form.', N'https://portal.elsewedy.edu.eg/materials/lab-circuits-01.pdf', DATEADD(day, 14, GETDATE()), 25, 7, 4, 1, GETDATE()),
    (N'Practical Lab 2: Breadboard Logic Circuit Wiring & Multimeter Validation', N'Implement 4-bit adder/subtractor circuit using 74LS series ICs and verify voltage thresholds.', N'https://portal.elsewedy.edu.eg/materials/lab-circuits-02.pdf', DATEADD(day, 21, GETDATE()), 50, 7, 4, 1, GETDATE()),
    (N'Quality Gate 3: Safety Interlocks & Oral Technical Defense', N'Demonstrate circuit safety, fail-safe disconnect logic, and answer technical oral interview questions.', N'https://portal.elsewedy.edu.eg/materials/lab-circuits-03.pdf', DATEADD(day, 28, GETDATE()), 25, 7, 4, 1, GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundAssignments] WHERE CourseRoundId = 8)
BEGIN
    INSERT INTO [dbo].[CourseRoundAssignments] (Title, Description, AssignmentLink, Deadline, TotalGrade, CourseRoundId, InstructorId, StatusId, CreatedAt)
    VALUES 
    (N'Coding Task 1: Algorithmic Flowchart & Structured Pseudocode', N'Develop structured modular logic for sensor data acquisition and averaging algorithm.', N'https://portal.elsewedy.edu.eg/materials/code-task-01.pdf', DATEADD(day, 14, GETDATE()), 30, 8, 4, 1, GETDATE()),
    (N'Coding Task 2: C Application Implementation & Unit Test Verification', N'Implement C program according to STA code standard conventions and pass edge cases.', N'https://portal.elsewedy.edu.eg/materials/code-task-02.pdf', DATEADD(day, 21, GETDATE()), 40, 8, 4, 1, GETDATE()),
    (N'Coding Task 3: Defect Diagnosis, Code Refactoring & Boundary Testing', N'Identify logic bugs in legacy code sample and rewrite with clean error handling.', N'https://portal.elsewedy.edu.eg/materials/code-task-03.pdf', DATEADD(day, 28, GETDATE()), 30, 8, 4, 1, GETDATE());
END

IF NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundAssignments] WHERE CourseRoundId = 16)
BEGIN
    INSERT INTO [dbo].[CourseRoundAssignments] (Title, Description, AssignmentLink, Deadline, TotalGrade, CourseRoundId, InstructorId, StatusId, CreatedAt)
    VALUES 
    (N'RTOS Milestone 1: Priority Preemptive Scheduler Configuration', N'Configure FreeRTOS kernel ticks, configure preemptive round-robin, and analyze context switch times.', N'https://portal.elsewedy.edu.eg/materials/rtos-task-01.pdf', DATEADD(day, 14, GETDATE()), 35, 16, 8421, 1, GETDATE()),
    (N'RTOS Milestone 2: Inter-Task Queues, Mutexes & Priority Inversion Prevention', N'Implement mutexes with priority inheritance to prevent starvation across high/low priority tasks.', N'https://portal.elsewedy.edu.eg/materials/rtos-task-02.pdf', DATEADD(day, 21, GETDATE()), 35, 16, 8421, 1, GETDATE()),
    (N'RTOS Milestone 3: Real-Time Hardware-in-the-Loop Validation', N'Deploy RTOS firmware to STM32 target and demonstrate jitter-free telemetry acquisition.', N'https://portal.elsewedy.edu.eg/materials/rtos-task-03.pdf', DATEADD(day, 28, GETDATE()), 30, 16, 8421, 1, GETDATE());
END

-- 3. Populate Submissions & Competency Results for Real Students
DECLARE @StudentIds TABLE (Id bigint, RowNum int);
INSERT INTO @StudentIds (Id, RowNum)
SELECT a.Id, ROW_NUMBER() OVER (ORDER BY a.Id)
FROM [dbo].[Account] a
WHERE a.RoleId IN (4, 15, 22, 51) AND a.IsActive = 1
ORDER BY a.Id;

-- Submissions for Course 7 (Performs the Logical Circuits)
DECLARE @AsgnId1 bigint = (SELECT TOP 1 Id FROM [dbo].[CourseRoundAssignments] WHERE CourseRoundId = 7 ORDER BY Id ASC);
DECLARE @AsgnId2 bigint = (SELECT TOP 1 Id FROM [dbo].[CourseRoundAssignments] WHERE CourseRoundId = 7 ORDER BY Id DESC);

IF @AsgnId1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundAssignmentSubmissions] WHERE AssignmentId = @AsgnId1)
BEGIN
    INSERT INTO [dbo].[CourseRoundAssignmentSubmissions] (AssignmentId, StudentId, SubmissionLink, SubmittedAt, Grade, Feedback, StatusId)
    SELECT 
        @AsgnId1,
        s.Id,
        N'https://github.com/sta-student-submissions/lab-01-' + CAST(s.Id AS nvarchar(20)),
        DATEADD(day, - (s.RowNum % 10), GETDATE()),
        CASE WHEN s.RowNum % 10 = 0 THEN 18.5 ELSE 22.0 + (s.RowNum % 3) END,
        N'Logic diagrams reviewed and verified.',
        1
    FROM @StudentIds s
    WHERE s.RowNum <= 120;
END;

IF @AsgnId2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM [dbo].[CourseRoundAssignmentSubmissions] WHERE AssignmentId = @AsgnId2)
BEGIN
    INSERT INTO [dbo].[CourseRoundAssignmentSubmissions] (AssignmentId, StudentId, SubmissionLink, SubmittedAt, Grade, Feedback, StatusId)
    SELECT 
        @AsgnId2,
        s.Id,
        N'https://github.com/sta-student-submissions/lab-02-' + CAST(s.Id AS nvarchar(20)),
        DATEADD(day, - (s.RowNum % 8), GETDATE()),
        CASE WHEN s.RowNum % 10 = 0 THEN 19.0 ELSE 23.5 + (s.RowNum % 2) END,
        N'Breadboard wiring tested and approved.',
        1
    FROM @StudentIds s
    WHERE s.RowNum <= 120;
END;

-- Results for Course 7 in Round 10
IF NOT EXISTS (SELECT 1 FROM [dbo].[CompetencyResult] WHERE CourseId = 7 AND CourseRoundId = 10)
BEGIN
    INSERT INTO [dbo].[CompetencyResult] (StudentId, CourseId, CourseRoundId, TotalScore, MaxScore, ResultStatusId, AssessorId, Notes, GradedAt, CreatedAt)
    SELECT
        s.Id,
        7,  -- Course: Performs the Logical Circuits
        10, -- CourseRound: 10
        CASE 
            WHEN s.RowNum % 12 = 0 THEN 58.0   -- Failed / Retake
            WHEN s.RowNum % 10 = 0 THEN 79.5   -- Pending Verification
            ELSE 85.0 + (s.RowNum % 13)        -- Passed (85 - 97)
        END,
        100.0,
        CASE 
            WHEN s.RowNum % 12 = 0 THEN 109    -- Failed
            WHEN s.RowNum % 10 = 0 THEN 110    -- Pending Verification
            ELSE 108                           -- Passed
        END,
        4, -- Assessor: Eng.Zainab
        CASE 
            WHEN s.RowNum % 12 = 0 THEN N'Requires retake on Karnaugh Map minimization criteria.'
            WHEN s.RowNum % 10 = 0 THEN N'Practical criteria met. Awaiting second verifier sign-off.'
            ELSE N'Demonstrated excellent proficiency in digital circuit implementation and safety.'
        END,
        DATEADD(day, - (s.RowNum % 6), GETDATE()),
        DATEADD(day, - (s.RowNum % 6), GETDATE())
    FROM @StudentIds s
    WHERE s.RowNum <= 120;
END;

-- Results for Course 8 in Round 11
IF NOT EXISTS (SELECT 1 FROM [dbo].[CompetencyResult] WHERE CourseId = 8 AND CourseRoundId = 11)
BEGIN
    INSERT INTO [dbo].[CompetencyResult] (StudentId, CourseId, CourseRoundId, TotalScore, MaxScore, ResultStatusId, AssessorId, Notes, GradedAt, CreatedAt)
    SELECT
        s.Id,
        8,  -- Course: Develop simple programs
        11, -- CourseRound: 11
        CASE 
            WHEN s.RowNum % 15 = 0 THEN 62.0   -- Failed
            WHEN s.RowNum % 8 = 0 THEN 81.0    -- Pending
            ELSE 88.0 + (s.RowNum % 11)        -- Passed
        END,
        100.0,
        CASE 
            WHEN s.RowNum % 15 = 0 THEN 109    -- Failed
            WHEN s.RowNum % 8 = 0 THEN 110     -- Pending
            ELSE 108                           -- Passed
        END,
        4, -- Assessor: Eng.Zainab
        N'Algorithm and modular C implementation assessed.',
        DATEADD(day, - (s.RowNum % 5), GETDATE()),
        DATEADD(day, - (s.RowNum % 5), GETDATE())
    FROM @StudentIds s
    WHERE s.RowNum <= 120;
END;

-- Results for Course 16 in Round 22
IF NOT EXISTS (SELECT 1 FROM [dbo].[CompetencyResult] WHERE CourseId = 16 AND CourseRoundId = 22)
BEGIN
    INSERT INTO [dbo].[CompetencyResult] (StudentId, CourseId, CourseRoundId, TotalScore, MaxScore, ResultStatusId, AssessorId, Notes, GradedAt, CreatedAt)
    SELECT
        s.Id,
        16, -- Course: Deploying and Designing Real-Time Operating Systems
        22, -- CourseRound: 22
        CASE 
            WHEN s.RowNum % 14 = 0 THEN 55.0
            WHEN s.RowNum % 9 = 0 THEN 82.0
            ELSE 86.0 + (s.RowNum % 12)
        END,
        100.0,
        CASE 
            WHEN s.RowNum % 14 = 0 THEN 109
            WHEN s.RowNum % 9 = 0 THEN 110
            ELSE 108
        END,
        8421, -- Assessor: Nour karam
        N'FreeRTOS task preemption and inter-task communication verified on target.',
        DATEADD(day, - (s.RowNum % 4), GETDATE()),
        DATEADD(day, - (s.RowNum % 4), GETDATE())
    FROM @StudentIds s
    WHERE s.RowNum <= 120;
END;

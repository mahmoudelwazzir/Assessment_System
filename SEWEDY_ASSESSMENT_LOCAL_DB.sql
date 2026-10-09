-- ============================================================================
-- ELSEWEDY ASSESSMENT SYSTEM - COMPLETE LOCAL DATABASE SCRIPT
-- ============================================================================
-- This script sets up the complete AssessmentDB database with all 66 tables
-- and all seed data (Accounts, Courses, CourseRounds, Assignments, Roles, Status).
--
-- How to run:
-- sqlcmd -S '(localdb)\MSSQLLocalDB' -i SEWEDY_ASSESSMENT_LOCAL_DB.sql
-- ============================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'AssessmentDB')
BEGIN
    CREATE DATABASE AssessmentDB;
    PRINT 'Created AssessmentDB database.';
END
GO

USE [AssessmentDB];
GO

IF OBJECT_ID('[__EFMigrationsHistory]', 'U') IS NULL
BEGIN
CREATE TABLE [__EFMigrationsHistory] (
    [MigrationId] nvarchar(150) NOT NULL,
    [ProductVersion] nvarchar(32) NOT NULL,
    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED ([MigrationId])
);
END;
GO

IF OBJECT_ID('[AbsenceRecords]', 'U') IS NULL
BEGIN
CREATE TABLE [AbsenceRecords] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [StudentId] bigint NOT NULL,
    [ClassId] bigint NOT NULL,
    [DateOfAbsence] date NOT NULL,
    [lectuerID] bigint NULL,
    [SessionID] bigint NULL,
    [AbsenceTypeId] int NULL,
    CONSTRAINT [PK_AbsenceRecords] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Account]', 'U') IS NULL
BEGIN
CREATE TABLE [Account] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [NationalId] nvarchar(50) NOT NULL,
    [PasswordHash] nvarchar(MAX) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [Phone] nvarchar(MAX) NULL,
    [RoleId] bigint NULL,
    [FullNameEN] nvarchar(MAX) NOT NULL,
    [FullNameAR] nvarchar(MAX) NOT NULL,
    [ResetToken] nvarchar(MAX) NULL,
    [ResetTokenExpiry] datetime2 NULL,
    [Created_at] date NULL,
    [IsActive] bit NOT NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Account_Temp]', 'U') IS NULL
BEGIN
CREATE TABLE [Account_Temp] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [NationalId] nvarchar(50) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [Phone] nvarchar(MAX) NULL,
    [City] varchar(MAX) NULL,
    [FullNameEN] nvarchar(MAX) NULL,
    [FullNameAR] nvarchar(MAX) NULL,
    [Created_at] date NULL,
    [IsActive] bit NOT NULL,
    [StatusId] bigint NOT NULL,
    [governoratesID] bigint NULL,
    CONSTRAINT [PK_Account_Temp] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[AccountRoles]', 'U') IS NULL
BEGIN
CREATE TABLE [AccountRoles] (
    [ID] bigint IDENTITY(1,1) NOT NULL,
    [RoleID] bigint NULL,
    [AccountID] bigint NULL,
    [BusinessEntityName] nvarchar(MAX) NULL,
    CONSTRAINT [PK_AccountRoles] PRIMARY KEY CLUSTERED ([ID])
);
END;
GO

IF OBJECT_ID('[Achievements]', 'U') IS NULL
BEGIN
CREATE TABLE [Achievements] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(MAX) NULL,
    [Description] nvarchar(MAX) NOT NULL,
    [ImageUrl] nvarchar(MAX) NOT NULL,
    CONSTRAINT [PK_Achievements] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[AdmissionProfile]', 'U') IS NULL
BEGIN
CREATE TABLE [AdmissionProfile] (
    [AccountId] bigint NOT NULL,
    [DateOfBirth] date NULL,
    [Location] nvarchar(MAX) NULL,
    [PhoneNumber] nvarchar(MAX) NULL,
    [SoftwareInterviewScore] decimal(5, 2) NULL,
    [MathInterviewScore] decimal(5, 2) NULL,
    [EnglishInterviewScore] decimal(5, 2) NULL,
    [ArabicInterviewScore] decimal(5, 2) NULL,
    [StudentName] nvarchar(MAX) NULL,
    [MathScore] decimal(5, 2) NULL,
    [EnglishScore] decimal(5, 2) NULL,
    [ThirdPrepScore] decimal(5, 2) NULL,
    [IsAcceptanceLetterReceived] bit NOT NULL,
    [StatusId] bigint NOT NULL,
    [HasOnlineTrainingCourses] bit NOT NULL,
    [HasICDLLicense] bit NOT NULL,
    [HasLaptop] bit NOT NULL,
    [ParentPhoneNumber] nvarchar(20) NULL,
    [PreviousSchoolType] nvarchar(MAX) NULL,
    [MinistryExamPercentage] decimal(5, 2) NOT NULL,
    [ParentOccupation] nvarchar(MAX) NULL,
    [City] nvarchar(MAX) NULL,
    [District] nvarchar(MAX) NULL,
    [StreetName] nvarchar(MAX) NULL,
    [BuildingNo] nvarchar(MAX) NULL,
    [BirthCertificatePath] nvarchar(MAX) NULL,
    [SuccessReportPath] nvarchar(MAX) NULL,
    [TuitionFeeReceiptPath] nvarchar(MAX) NULL,
    [PreferencesSheetPath] nvarchar(MAX) NULL,
    [Created_At] date NULL,
    CONSTRAINT [PK_AdmissionProfile] PRIMARY KEY CLUSTERED ([AccountId])
);
END;
GO

IF OBJECT_ID('[AdmissionQuiz_MATH]', 'U') IS NULL
BEGIN
CREATE TABLE [AdmissionQuiz_MATH] (
    [Question] varchar(4000) NULL,
    [a] varchar(4000) NULL,
    [b] varchar(4000) NULL,
    [c] varchar(4000) NULL,
    [d] varchar(4000) NULL,
    [Answer] varchar(4000) NULL,
    [CorrectAnswer_Txt] varchar(4000) NULL
);
END;
GO

IF OBJECT_ID('[Application]', 'U') IS NULL
BEGIN
CREATE TABLE [Application] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [CourseRoundId] bigint NOT NULL,
    [ApplicationDate] datetime NOT NULL,
    [StatusId] bigint NOT NULL,
    [Answer1] nvarchar(MAX) NULL,
    [Answer2] nvarchar(MAX) NULL,
    [Answer3] nvarchar(MAX) NULL,
    [Answer4] nvarchar(MAX) NULL,
    [Answer5] nvarchar(MAX) NULL,
    [Answer6] nvarchar(MAX) NULL,
    [Answer7] nvarchar(MAX) NULL,
    [Answer8] nvarchar(MAX) NULL,
    [Answer9] nvarchar(MAX) NULL,
    [Answer10] nvarchar(MAX) NULL,
    [AccountId] bigint NOT NULL,
    CONSTRAINT [PK_Application] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[AttendanceRecords]', 'U') IS NULL
BEGIN
CREATE TABLE [AttendanceRecords] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [StudentId] bigint NOT NULL,
    [Date] datetime NOT NULL,
    [SessionNumber] int NOT NULL,
    [IsPresent] bit NOT NULL,
    [NoteId] bigint NULL,
    [ClassId] bigint NULL,
    CONSTRAINT [PK_AttendanceRecords] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[BehaviorNotes]', 'U') IS NULL
BEGIN
CREATE TABLE [BehaviorNotes] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [AttendanceRecordId] bigint NOT NULL,
    [Title] nvarchar(255) NOT NULL,
    [Description] nvarchar(MAX) NULL,
    [ImageUrl] nvarchar(255) NULL,
    [NoteType] nvarchar(50) NOT NULL,
    [gen] nvarchar(MAX) NULL,
    CONSTRAINT [PK_BehaviorNotes] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[CapstoneSupervisorExtension]', 'U') IS NULL
BEGIN
CREATE TABLE [CapstoneSupervisorExtension] (
    [AccountId] bigint NOT NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_CapstoneSupervisorExtension] PRIMARY KEY CLUSTERED ([AccountId])
);
END;
GO

IF OBJECT_ID('[CompetencyResult]', 'U') IS NULL
BEGIN
CREATE TABLE [CompetencyResult] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [StudentId] bigint NOT NULL,
    [CourseId] bigint NOT NULL,
    [CourseRoundId] bigint NOT NULL,
    [TotalScore] decimal(18, 2) NULL,
    [MaxScore] decimal(18, 2) NULL,
    [ResultStatusId] bigint NOT NULL,
    [AssessorId] bigint NOT NULL,
    [Notes] nvarchar(500) NULL,
    [GradedAt] datetime NOT NULL,
    [CreatedAt] datetime NOT NULL,
    CONSTRAINT [PK_CompetencyResult] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[CourseMaterial]', 'U') IS NULL
BEGIN
CREATE TABLE [CourseMaterial] (
    [ID] bigint IDENTITY(1,1) NOT NULL,
    [CourseRoundID] bigint NULL,
    [Created_byAccountID] bigint NULL,
    [WeekID] bigint NULL,
    [ParentMaterialID] bigint NULL,
    [StatusID] bigint NULL,
    [MaterialTypeStatusID] bigint NULL,
    [Title] nvarchar(MAX) NULL,
    [Description] nvarchar(MAX) NULL,
    [Link] nvarchar(MAX) NULL,
    [MeetingID] nvarchar(MAX) NULL,
    [MeetingPassword] nvarchar(MAX) NULL,
    CONSTRAINT [PK_CourseMaterial] PRIMARY KEY CLUSTERED ([ID])
);
END;
GO

IF OBJECT_ID('[CourseRound]', 'U') IS NULL
BEGIN
CREATE TABLE [CourseRound] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [CourseId] bigint NOT NULL,
    [RoundNumber] decimal(10, 2) NULL,
    [StartDate] datetime NULL,
    [EndDate] datetime NULL,
    [MaxStudents] bigint NULL,
    [StatusId] bigint NOT NULL,
    [CreatedAt] datetime NOT NULL,
    [Question1] nvarchar(MAX) NULL,
    [Question2] nvarchar(MAX) NULL,
    [Question3] nvarchar(MAX) NULL,
    [Question4] nvarchar(MAX) NULL,
    [Question5] nvarchar(MAX) NULL,
    [Question6] nvarchar(MAX) NULL,
    [Question7] nvarchar(MAX) NULL,
    [Question8] nvarchar(MAX) NULL,
    [Question9] nvarchar(MAX) NULL,
    [Question10] nvarchar(MAX) NULL,
    [MinStudents] bigint NULL,
    [Price] decimal(10, 2) NULL,
    [AutomatedWorkFlowJump] int NULL,
    [CourseRoundGroupId] bigint NULL,
    CONSTRAINT [PK_CourseRound] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[CourseRoundAssignments]', 'U') IS NULL
BEGIN
CREATE TABLE [CourseRoundAssignments] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(MAX) NOT NULL,
    [Description] nvarchar(MAX) NULL,
    [AssignmentLink] nvarchar(MAX) NULL,
    [Deadline] datetime NOT NULL,
    [TotalGrade] decimal(18, 0) NOT NULL,
    [CourseRoundId] bigint NOT NULL,
    [InstructorId] bigint NOT NULL,
    [CourseMaterialId] bigint NULL,
    [StatusId] bigint NULL,
    [CreatedAt] datetime NOT NULL,
    CONSTRAINT [PK_CourseRoundAssignments] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[CourseRoundAssignmentSubmissions]', 'U') IS NULL
BEGIN
CREATE TABLE [CourseRoundAssignmentSubmissions] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [AssignmentId] bigint NOT NULL,
    [StudentId] bigint NOT NULL,
    [SubmissionLink] nvarchar(MAX) NOT NULL,
    [SubmittedAt] datetime NOT NULL,
    [Grade] decimal(18, 0) NULL,
    [Feedback] nvarchar(MAX) NULL,
    [StatusId] bigint NULL,
    CONSTRAINT [PK_CourseRoundAssignmentSubmissions] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[CourseRoundInstructor]', 'U') IS NULL
BEGIN
CREATE TABLE [CourseRoundInstructor] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [CourseRoundId] bigint NOT NULL,
    [InstructorAccountId] bigint NOT NULL,
    [RoleId] bigint NULL,
    [AssignedDate] date NOT NULL,
    CONSTRAINT [PK_CourseRoundInstructor] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Courses]', 'U') IS NULL
BEGIN
CREATE TABLE [Courses] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(MAX) NOT NULL,
    [Description] nvarchar(MAX) NOT NULL,
    [LevelStatusId] bigint NULL,
    [DurationHours] bigint NULL,
    [BusinessEntity] nvarchar(100) NULL,
    CONSTRAINT [PK_Courses] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[EducationalLevel]', 'U') IS NULL
BEGIN
CREATE TABLE [EducationalLevel] (
    [Id] bigint NOT NULL,
    [Name] nvarchar(MAX) NOT NULL,
    CONSTRAINT [PK_EducationalLevel] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[EmailSettings]', 'U') IS NULL
BEGIN
CREATE TABLE [EmailSettings] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [SmtpServer] nvarchar(MAX) NULL,
    [SmtpPort] int NULL,
    [SmtpUsername] nvarchar(MAX) NULL,
    [SmtpPassword] nvarchar(MAX) NULL,
    [SenderEmail] nvarchar(MAX) NULL,
    CONSTRAINT [PK_EmailSettings] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[EmploymentRequests]', 'U') IS NULL
BEGIN
CREATE TABLE [EmploymentRequests] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [CompanyName] nvarchar(MAX) NOT NULL,
    [LinkedInUrl] nvarchar(MAX) NOT NULL,
    [CompanyEmail] nvarchar(MAX) NOT NULL,
    [CompanyPhone] nvarchar(MAX) NOT NULL,
    [Address] nvarchar(MAX) NOT NULL,
    [Specialization] nvarchar(MAX) NOT NULL,
    [Amount] nvarchar(MAX) NOT NULL,
    [OwnerName] nvarchar(MAX) NOT NULL,
    [OwnerPhone] nvarchar(MAX) NOT NULL,
    [OwnerEmail] nvarchar(MAX) NOT NULL,
    [EmploymentType] nvarchar(MAX) NOT NULL,
    [StatusId] bigint NOT NULL,
    [RequestDate] datetime2 NOT NULL,
    CONSTRAINT [PK_EmploymentRequests] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Exam_Details]', 'U') IS NULL
BEGIN
CREATE TABLE [Exam_Details] (
    [Exam_ID] bigint IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(MAX) NULL,
    [Exam_Subject] nvarchar(MAX) NULL,
    [Exam_Description] nvarchar(MAX) NULL,
    [StartDate] datetime2 NULL,
    [EndDate] datetime2 NULL,
    [CreatedBy_AccID] bigint NOT NULL,
    [Class_ID] nvarchar(MAX) NULL,
    [Grade_ID] bigint NULL,
    [Subject_ID] bigint NULL,
    CONSTRAINT [PK_Exam_Details] PRIMARY KEY CLUSTERED ([Exam_ID])
);
END;
GO

IF OBJECT_ID('[Exam_QuestionBank]', 'U') IS NULL
BEGIN
CREATE TABLE [Exam_QuestionBank] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [Exam_ID] bigint NULL,
    [Question_ID] bigint NULL,
    [CourseRound_ID] bigint NULL,
    CONSTRAINT [PK_Exam_QuestionBank] PRIMARY KEY CLUSTERED ([ID])
);
END;
GO

IF OBJECT_ID('[ExamQuestion]', 'U') IS NULL
BEGIN
CREATE TABLE [ExamQuestion] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [QuestionTitle] nvarchar(MAX) NOT NULL,
    [Choice1] nvarchar(MAX) NOT NULL,
    [Choice2] nvarchar(MAX) NOT NULL,
    [Choice3] nvarchar(MAX) NOT NULL,
    [Choice4] nvarchar(MAX) NOT NULL,
    [CorrectAnswer] nvarchar(MAX) NOT NULL,
    [SectionId] bigint NOT NULL,
    CONSTRAINT [PK_ExamQuestion] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[ExamQuestion_Math]', 'U') IS NULL
BEGIN
CREATE TABLE [ExamQuestion_Math] (
    [Question] nvarchar(MAX) NULL,
    [Option A] nvarchar(MAX) NULL,
    [Option B] nvarchar(MAX) NULL,
    [Option C] nvarchar(MAX) NULL,
    [Option D] nvarchar(MAX) NULL,
    [Correct Answer] nvarchar(255) NULL,
    [CorrectAnswer_Txt] nvarchar(MAX) NULL,
    [SectionID] int NULL
);
END;
GO

IF OBJECT_ID('[ExternalStudent]', 'U') IS NULL
BEGIN
CREATE TABLE [ExternalStudent] (
    [Id] bigint NOT NULL,
    [AccountId] bigint NULL,
    [FullName] nvarchar(MAX) NOT NULL,
    [DOB] date NULL,
    [GenderStatesId] bigint NULL,
    [PhoneNumber] nvarchar(MAX) NULL,
    [StatusId] bigint NULL,
    [GovernoratesId] bigint NULL,
    [RegistrationDate] datetime NOT NULL,
    [Email] nvarchar(MAX) NULL,
    [Password] nvarchar(MAX) NULL,
    CONSTRAINT [PK_ExternalStudent] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Gender]', 'U') IS NULL
BEGIN
CREATE TABLE [Gender] (
    [Id] bigint NOT NULL,
    [Name] nvarchar(MAX) NOT NULL,
    CONSTRAINT [PK_Gender] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[governorates]', 'U') IS NULL
BEGIN
CREATE TABLE [governorates] (
    [Id] bigint NOT NULL,
    [governorate_name_ar] nvarchar(MAX) NOT NULL,
    [governorate_name_en] nvarchar(MAX) NOT NULL,
    CONSTRAINT [PK_governorates] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Grade]', 'U') IS NULL
BEGIN
CREATE TABLE [Grade] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [GradeName] nvarchar(MAX) NOT NULL,
    [ParentGradeId] bigint NULL,
    [AdminAccountId] bigint NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_Grade] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[InterviewScore]', 'U') IS NULL
BEGIN
CREATE TABLE [InterviewScore] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [AccountId] bigint NOT NULL,
    [InterviewerId] bigint NOT NULL,
    [Score] decimal(5, 2) NOT NULL,
    CONSTRAINT [PK_InterviewScore] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Juniors]', 'U') IS NULL
BEGIN
CREATE TABLE [Juniors] (
    [#] float NULL,
    [Class] float NULL,
    [NationalID] float NULL,
    [Email] nvarchar(255) NULL,
    [PhoneNumber ] nvarchar(255) NULL,
    [FullNameAR] nvarchar(255) NULL,
    [FullNameEN] nvarchar(255) NULL,
    [Grad] float NULL,
    [ClassID] float NULL,
    [F10] nvarchar(255) NULL
);
END;
GO

IF OBJECT_ID('[Level]', 'U') IS NULL
BEGIN
CREATE TABLE [Level] (
    [Id] bigint NOT NULL,
    [Name] nvarchar(MAX) NOT NULL,
    CONSTRAINT [PK_Level] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Login]', 'U') IS NULL
BEGIN
CREATE TABLE [Login] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [AccountId] bigint NOT NULL,
    [Email] nvarchar(MAX) NOT NULL,
    [PasswordHash] nvarchar(MAX) NOT NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_Login] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Notifications]', 'U') IS NULL
BEGIN
CREATE TABLE [Notifications] (
    [ID] bigint IDENTITY(1,1) NOT NULL,
    [AccountId] bigint NULL,
    [Title] nvarchar(MAX) NOT NULL,
    [Message] nvarchar(MAX) NOT NULL,
    [Read_statusID] bigint NULL,
    [CreatedAt] datetime NULL,
    CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED ([ID])
);
END;
GO

IF OBJECT_ID('[Project]', 'U') IS NULL
BEGIN
CREATE TABLE [Project] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [NameAR] nvarchar(MAX) NULL,
    [NameEN] nvarchar(MAX) NOT NULL,
    [CompanyName] nvarchar(MAX) NOT NULL,
    [AdditionalInformation] nvarchar(MAX) NULL,
    [DateOfCreation] datetime2 NOT NULL,
    [ProjectDescription] nvarchar(MAX) NOT NULL,
    [StatusId] bigint NOT NULL,
    [SupervisorAccountId] bigint NOT NULL,
    CONSTRAINT [PK_Project] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Question_Bank]', 'U') IS NULL
BEGIN
CREATE TABLE [Question_Bank] (
    [Question_ID] bigint IDENTITY(1,1) NOT NULL,
    [Question_Title] nvarchar(MAX) NULL,
    [OptionA] nvarchar(MAX) NULL,
    [OptionB] nvarchar(MAX) NULL,
    [OptionC] nvarchar(MAX) NULL,
    [OptionD] nvarchar(MAX) NULL,
    [OptionE] nvarchar(MAX) NULL,
    [OptionF] nvarchar(MAX) NULL,
    [OptionG] nvarchar(MAX) NULL,
    [OptionH] nvarchar(MAX) NULL,
    [UsedOptions] int NULL,
    [CorrectAnswer] nvarchar(MAX) NULL,
    [Question_Subject] nvarchar(MAX) NULL,
    [Mark] decimal(5, 2) NULL,
    [BankDescription] nvarchar(MAX) NULL,
    [BankKey] nvarchar(MAX) NULL,
    [BankTitle] nvarchar(MAX) NULL,
    [Grade_ID] bigint NULL,
    [AccountId] bigint NOT NULL,
    CONSTRAINT [PK_Question_Bank] PRIMARY KEY CLUSTERED ([Question_ID])
);
END;
GO

IF OBJECT_ID('[Report]', 'U') IS NULL
BEGIN
CREATE TABLE [Report] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(MAX) NOT NULL,
    [SubmissionDate] datetime NOT NULL,
    [ReportMessage] nvarchar(MAX) NOT NULL,
    [SubmitterAccountId] bigint NOT NULL,
    [StatusId] bigint NOT NULL,
    [Reviewer_ID] nvarchar(MAX) NULL,
    CONSTRAINT [PK_Report] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[ReportSpecialist]', 'U') IS NULL
BEGIN
CREATE TABLE [ReportSpecialist] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [date_report] datetime NOT NULL,
    [StudentName] nvarchar(MAX) NOT NULL,
    [Description] nvarchar(MAX) NOT NULL,
    [SpecialistSignature] nvarchar(MAX) NOT NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_ReportSpecialist] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[ReviewerSupervisorExtension]', 'U') IS NULL
BEGIN
CREATE TABLE [ReviewerSupervisorExtension] (
    [AccountId] bigint NOT NULL,
    [AssignedClassId] bigint NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_ReviewerSupervisorExtension] PRIMARY KEY CLUSTERED ([AccountId])
);
END;
GO

IF OBJECT_ID('[Roles]', 'U') IS NULL
BEGIN
CREATE TABLE [Roles] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [RoleName] nvarchar(50) NOT NULL,
    [OrderNo] int NULL,
    [BusinessEntity] nvarchar(MAX) NULL,
    CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Scholarship]', 'U') IS NULL
BEGIN
CREATE TABLE [Scholarship] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [ScholarshipName] nvarchar(MAX) NOT NULL,
    [Amount] money NOT NULL,
    [ProviderName] nvarchar(MAX) NOT NULL,
    [StartDate] date NULL,
    [EndDate] date NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_Scholarship] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Section]', 'U') IS NULL
BEGIN
CREATE TABLE [Section] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [SectionName] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_Section] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Seniors]', 'U') IS NULL
BEGIN
CREATE TABLE [Seniors] (
    [#] float NULL,
    [Class] float NULL,
    [NationalID] float NULL,
    [Email] nvarchar(255) NULL,
    [PhoneNumber ] nvarchar(255) NULL,
    [FullNameAR] nvarchar(255) NULL,
    [FullNameEN] nvarchar(255) NULL,
    [Grad] float NULL,
    [ClassID] float NULL
);
END;
GO

IF OBJECT_ID('[Session]', 'U') IS NULL
BEGIN
CREATE TABLE [Session] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [SessionNo] int NULL,
    [FromDate] time NULL,
    [ToDate] time NULL,
    [StatusId] bigint NOT NULL,
    [Note] nvarchar(MAX) NULL,
    CONSTRAINT [PK_Session] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Status]', 'U') IS NULL
BEGIN
CREATE TABLE [Status] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [StatusName] nvarchar(MAX) NOT NULL,
    [BusinessEntity] nvarchar(MAX) NULL,
    [OrderNo] int NULL,
    CONSTRAINT [PK_Status] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[StudentExamAnswer]', 'U') IS NULL
BEGIN
CREATE TABLE [StudentExamAnswer] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [AccountId] bigint NOT NULL,
    [ExamQuestionId] bigint NULL,
    [ChoosedAnswer] nvarchar(MAX) NOT NULL,
    [Score] bit NOT NULL,
    [QuestionbankId] bigint NULL,
    [ExamDetailsID] bigint NULL,
    CONSTRAINT [PK_StudentExamAnswer] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[StudentExamAnswer_Tmmp]', 'U') IS NULL
BEGIN
CREATE TABLE [StudentExamAnswer_Tmmp] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [AccountId] bigint NOT NULL,
    [ExamId] bigint NOT NULL,
    [ChoosedAnswer] nvarchar(MAX) NOT NULL,
    [Score] bit NOT NULL,
    [QuestionbankId] bigint NULL,
    [ExamDetailsID] bigint NULL,
    CONSTRAINT [PK_StudentExamAnswer_Tmmp] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[StudentExamResult]', 'U') IS NULL
BEGIN
CREATE TABLE [StudentExamResult] (
    [AccountId] bigint NOT NULL,
    [ExamArabicScore] int NOT NULL,
    [ExamEnglishScore] int NOT NULL,
    [ExamMathScore] int NOT NULL,
    [ExamSoftwareScore] int NOT NULL,
    CONSTRAINT [PK_StudentExamResult] PRIMARY KEY CLUSTERED ([AccountId])
);
END;
GO

IF OBJECT_ID('[StudentExtension]', 'U') IS NULL
BEGIN
CREATE TABLE [StudentExtension] (
    [AccountId] bigint NOT NULL,
    [IsLeader] bit NOT NULL,
    [ClassId] bigint NULL,
    [StatusId] bigint NOT NULL,
    [MACAddress] nvarchar(MAX) NULL,
    [EducationalLevelStatusId] bigint NULL,
    [HostName] nvarchar(MAX) NULL,
    CONSTRAINT [PK_StudentExtension] PRIMARY KEY CLUSTERED ([AccountId])
);
END;
GO

IF OBJECT_ID('[StudentProfile]', 'U') IS NULL
BEGIN
CREATE TABLE [StudentProfile] (
    [Id] int NOT NULL,
    [Name] nvarchar(100) NULL,
    [Age] int NULL,
    [Grade] nvarchar(50) NULL,
    CONSTRAINT [PK_StudentProfile] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[StudentProfile_Selected]', 'U') IS NULL
BEGIN
CREATE TABLE [StudentProfile_Selected] (
    [Id] int NULL,
    [Name] nvarchar(100) NULL,
    [Email] nvarchar(100) NULL,
    [PhoneNumber] nvarchar(50) NULL,
    [Age] int NULL,
    [City] nvarchar(100) NULL,
    [Country] nvarchar(100) NULL,
    [DaysAbsent] int NULL,
    [GoodNotesJson] nvarchar(MAX) NULL,
    [BadNotesJson] nvarchar(MAX) NULL,
    [CreatedAt] datetime NULL,
    [ClassName] nvarchar(10) NULL
);
END;
GO

IF OBJECT_ID('[StudentProfile_tobeDeleted]', 'U') IS NULL
BEGIN
CREATE TABLE [StudentProfile_tobeDeleted] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(255) NULL,
    [Email] nvarchar(255) NULL,
    [PhoneNumber] nvarchar(50) NULL,
    [Age] int NULL,
    [City] nvarchar(100) NULL,
    [Country] nvarchar(100) NULL,
    [DaysAbsent] int NULL,
    [GoodNotesJson] nvarchar(1) NULL,
    [BadNotesJson] nvarchar(1) NULL,
    [CreatedAt] datetime NULL,
    [ClassId] bigint NULL,
    CONSTRAINT [PK_StudentProfile_tobeDeleted] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[StudentTask]', 'U') IS NULL
BEGIN
CREATE TABLE [StudentTask] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [StudentAccountId] bigint NOT NULL,
    [TaskId] bigint NOT NULL,
    [IsCompleted] bit NOT NULL,
    [CompletedAt] datetime NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_StudentTask] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[SubordinateTicket]', 'U') IS NULL
BEGIN
CREATE TABLE [SubordinateTicket] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [SupervisorAccountId] bigint NULL,
    [GradeId] bigint NULL,
    [ClassId] bigint NULL,
    [SessionId] bigint NULL,
    [SubordinateAccountId] bigint NULL,
    [TicketTypeId] bigint NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_SubordinateTicket] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[SuperAdminExtension]', 'U') IS NULL
BEGIN
CREATE TABLE [SuperAdminExtension] (
    [AccountId] bigint NOT NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_SuperAdminExtension] PRIMARY KEY CLUSTERED ([AccountId])
);
END;
GO

IF OBJECT_ID('[TaskSubmission]', 'U') IS NULL
BEGIN
CREATE TABLE [TaskSubmission] (
    [TaskSubmission_ID] bigint IDENTITY(1,1) NOT NULL,
    [Team_ID] bigint NOT NULL,
    [TeamLeader_ID] bigint NOT NULL,
    [Task_ID] bigint NOT NULL,
    [Grade_ID] bigint NULL,
    [GLink] nvarchar(255) NULL,
    [Note] nvarchar(MAX) NULL,
    [Status_ID] bigint NOT NULL,
    [Created_At] datetime2 NOT NULL,
    [Updated_At] datetime2 NOT NULL,
    [Feedback] nvarchar(MAX) NULL,
    [Reviewer_ID] nvarchar(MAX) NULL,
    CONSTRAINT [PK_TaskSubmission] PRIMARY KEY CLUSTERED ([TaskSubmission_ID])
);
END;
GO

IF OBJECT_ID('[tbl_absencetype]', 'U') IS NULL
BEGIN
CREATE TABLE [tbl_absencetype] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [OrderNumber] int NOT NULL,
    [AbsenceType] nvarchar(MAX) NOT NULL,
    CONSTRAINT [PK_tbl_absencetype] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Tbl_Class]', 'U') IS NULL
BEGIN
CREATE TABLE [Tbl_Class] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [ClassName] nvarchar(MAX) NOT NULL,
    [GradeId] bigint NOT NULL,
    [StatusId] bigint NOT NULL
);
END;
GO

IF OBJECT_ID('[tbl_media]', 'U') IS NULL
BEGIN
CREATE TABLE [tbl_media] (
    [ID] bigint IDENTITY(1,1) NOT NULL,
    [TableName] nvarchar(MAX) NULL,
    [Table_ID] bigint NULL,
    [FilePath] nvarchar(MAX) NULL
);
END;
GO

IF OBJECT_ID('[Tbl_Task]', 'U') IS NULL
BEGIN
CREATE TABLE [Tbl_Task] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [TaskName] nvarchar(MAX) NOT NULL,
    [TaskDescription] nvarchar(MAX) NULL,
    [AssignedToID] bigint NULL,
    [AssignedByID] bigint NULL,
    [DueDate] date NULL,
    [CreatedAt] date NULL,
    [TaskDeadline] datetime NOT NULL,
    [GradeId] bigint NULL,
    [AdminAccountId] bigint NULL,
    [StatusId] bigint NOT NULL,
    [Class_Id] int NULL,
    [Team_Id] int NULL,
    [WeekID] int NOT NULL,
    CONSTRAINT [PK_Tbl_Task] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Team]', 'U') IS NULL
BEGIN
CREATE TABLE [Team] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [TeamName] nvarchar(MAX) NOT NULL,
    [TeamLeaderAccountId] bigint NULL,
    [ClassId] bigint NOT NULL,
    [SupervisorAccountId] bigint NULL,
    [ProjectId] bigint NULL,
    [StatusId] bigint NOT NULL,
    [TeamCode] int NULL,
    CONSTRAINT [PK_Team] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[TeamMember]', 'U') IS NULL
BEGIN
CREATE TABLE [TeamMember] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [TeamId] bigint NOT NULL,
    [TeamMemberAccountId] bigint NOT NULL,
    [TeamMemberDescription] nvarchar(MAX) NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_TeamMember] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[TicketType]', 'U') IS NULL
BEGIN
CREATE TABLE [TicketType] (
    [Id] bigint IDENTITY(1,1) NOT NULL,
    [TicketTypeName] nvarchar(MAX) NOT NULL,
    [OrderNo] int NULL,
    [BusinessEntity] nvarchar(MAX) NULL,
    [StatusId] bigint NOT NULL,
    CONSTRAINT [PK_TicketType] PRIMARY KEY CLUSTERED ([Id])
);
END;
GO

IF OBJECT_ID('[Weeks]', 'U') IS NULL
BEGIN
CREATE TABLE [Weeks] (
    [WeekTitle] nvarchar(MAX) NULL,
    [StartDate] date NULL,
    [EndDate] date NULL,
    [BusinessEntityName] nvarchar(MAX) NULL,
    [ID] bigint IDENTITY(1,1) NOT NULL
);
END;
GO

IF OBJECT_ID('[WHEELERS]', 'U') IS NULL
BEGIN
CREATE TABLE [WHEELERS] (
    [#] float NULL,
    [Class] float NULL,
    [NationalID] float NULL,
    [Email] nvarchar(255) NULL,
    [PhoneNumber ] nvarchar(255) NULL,
    [FullNameAR] nvarchar(255) NULL,
    [FullNameEN] nvarchar(255) NULL,
    [Grad] float NULL,
    [ClassID] float NULL
);
END;
GO



-- Data for Status
IF OBJECTPROPERTY(OBJECT_ID('[Status]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Status] ON;
INSERT INTO [Status] ([Id], [StatusName], [BusinessEntity], [OrderNo]) VALUES (1, N'Active', N'Account', 1);
INSERT INTO [Status] ([Id], [StatusName], [BusinessEntity], [OrderNo]) VALUES (2, N'Inactive', N'Account', 2);
INSERT INTO [Status] ([Id], [StatusName], [BusinessEntity], [OrderNo]) VALUES (50, N'Assessor', N'UserRole', 3);
INSERT INTO [Status] ([Id], [StatusName], [BusinessEntity], [OrderNo]) VALUES (51, N'Control', N'UserRole', 4);
INSERT INTO [Status] ([Id], [StatusName], [BusinessEntity], [OrderNo]) VALUES (52, N'Verifier', N'UserRole', 5);
INSERT INTO [Status] ([Id], [StatusName], [BusinessEntity], [OrderNo]) VALUES (53, N'Pass', N'Assessment', 1);
INSERT INTO [Status] ([Id], [StatusName], [BusinessEntity], [OrderNo]) VALUES (54, N'NotPass', N'Assessment', 2);
IF OBJECTPROPERTY(OBJECT_ID('[Status]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Status] OFF;
GO

-- Data for Roles
IF OBJECTPROPERTY(OBJECT_ID('[Roles]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Roles] ON;
INSERT INTO [Roles] ([Id], [RoleName], [OrderNo], [BusinessEntity]) VALUES (1, N'Assessor', 3, N'Assessment');
INSERT INTO [Roles] ([Id], [RoleName], [OrderNo], [BusinessEntity]) VALUES (2, N'Control', 4, N'Assessment');
INSERT INTO [Roles] ([Id], [RoleName], [OrderNo], [BusinessEntity]) VALUES (3, N'Verifier', 5, N'Assessment');
INSERT INTO [Roles] ([Id], [RoleName], [OrderNo], [BusinessEntity]) VALUES (4, N'Student', 10, N'Assessment');
IF OBJECTPROPERTY(OBJECT_ID('[Roles]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Roles] OFF;
GO

-- Data for Courses
IF OBJECTPROPERTY(OBJECT_ID('[Courses]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Courses] ON;
INSERT INTO [Courses] ([Id], [Title], [Description], [LevelStatusId], [DurationHours], [BusinessEntity]) VALUES (1, N'Intro to Engineering', N'Foundational technical course', 3, 60, N'Assessment');
INSERT INTO [Courses] ([Id], [Title], [Description], [LevelStatusId], [DurationHours], [BusinessEntity]) VALUES (2, N'Advanced Automation', N'Deep dive into automated factory lines', 1, 60, N'Assessment');
IF OBJECTPROPERTY(OBJECT_ID('[Courses]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Courses] OFF;
GO

-- Data for CourseRound
IF OBJECTPROPERTY(OBJECT_ID('[CourseRound]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CourseRound] ON;
INSERT INTO [CourseRound] ([Id], [CourseId], [RoundNumber], [StartDate], [EndDate], [MaxStudents], [StatusId], [CreatedAt], [Question1], [Question2], [Question3], [Question4], [Question5], [Question6], [Question7], [Question8], [Question9], [Question10], [MinStudents], [Price], [AutomatedWorkFlowJump], [CourseRoundGroupId]) VALUES (5, 2, 1.00, '2026-06-14 00:00:00.000', '2026-07-04 00:00:00.000', NULL, 1, '2026-06-17 07:22:09.190', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
IF OBJECTPROPERTY(OBJECT_ID('[CourseRound]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CourseRound] OFF;
GO

-- Data for Account
IF OBJECTPROPERTY(OBJECT_ID('[Account]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Account] ON;
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (55, N'29901010100001', N'AQAAAAEAACcQAAAAEHash001==', N'ahmed.hassan1@school.com', N'01000000001', 4, N'Ahmed Hassan Mahmoud', N'أحمد حسن محمود', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (56, N'29901010100002', N'AQAAAAEAACcQAAAAEHash002==', N'mohamed.ali2@school.com', N'01000000002', 4, N'Mohamed Ali Ibrahim', N'محمد علي إبراهيم', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (57, N'29901010100003', N'AQAAAAEAACcQAAAAEHash003==', N'omar.khaled3@school.com', N'01000000003', 4, N'Omar Khaled Saeed', N'عمر خالد سعيد', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (58, N'29901010100004', N'AQAAAAEAACcQAAAAEHash004==', N'youssef.tarek4@school.com', N'01000000004', 4, N'Youssef Tarek Fahmy', N'يوسف طارق فهمي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (59, N'29901010100005', N'AQAAAAEAACcQAAAAEHash005==', N'karim.adel5@school.com', N'01000000005', 4, N'Karim Adel Mostafa', N'كريم عادل مصطفى', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (60, N'29901010100006', N'AQAAAAEAACcQAAAAEHash006==', N'mahmoud.sami6@school.com', N'01000000006', 4, N'Mahmoud Sami Reda', N'محمود سامي رضا', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (61, N'29901010100007', N'AQAAAAEAACcQAAAAEHash007==', N'amr.nabil7@school.com', N'01000000007', 4, N'Amr Nabil Shawky', N'عمرو نبيل شوقي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (62, N'29901010100008', N'AQAAAAEAACcQAAAAEHash008==', N'hassan.fady8@school.com', N'01000000008', 4, N'Hassan Fady Lotfy', N'حسن فادي لطفي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (63, N'29901010100009', N'AQAAAAEAACcQAAAAEHash009==', N'ali.ramy9@school.com', N'01000000009', 4, N'Ali Ramy Anwar', N'علي رامي أنور', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (64, N'29901010100010', N'AQAAAAEAACcQAAAAEHash010==', N'sherif.hany10@school.com', N'01000000010', 4, N'Sherif Hany Younis', N'شريف هاني يونس', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (65, N'29901010100011', N'AQAAAAEAACcQAAAAEHash011==', N'ibrahim.waleed11@school.com', N'01000000011', 4, N'Ibrahim Waleed Sobhy', N'إبراهيم وليد صبحي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (66, N'29901010100012', N'AQAAAAEAACcQAAAAEHash012==', N'mostafa.essam12@school.com', N'01000000012', 4, N'Mostafa Essam Gaber', N'مصطفى عصام جابر', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (67, N'29901010100013', N'AQAAAAEAACcQAAAAEHash013==', N'tarek.fawzy13@school.com', N'01000000013', 4, N'Tarek Fawzy Naguib', N'طارق فوزي نجيب', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (68, N'29901010100014', N'AQAAAAEAACcQAAAAEHash014==', N'khaled.atef14@school.com', N'01000000014', 4, N'Khaled Atef Sorour', N'خالد عاطف سرور', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (69, N'29901010100015', N'AQAAAAEAACcQAAAAEHash015==', N'adel.maged15@school.com', N'01000000015', 4, N'Adel Maged Rabie', N'عادل ماجد ربيع', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (70, N'29901010100016', N'AQAAAAEAACcQAAAAEHash016==', N'sami.gamal16@school.com', N'01000000016', 4, N'Sami Gamal Hosny', N'سامي جمال حسني', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (71, N'29901010100017', N'AQAAAAEAACcQAAAAEHash017==', N'nabil.kareem17@school.com', N'01000000017', 4, N'Nabil Kareem Zaki', N'نبيل كريم زكي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (72, N'29901010100018', N'AQAAAAEAACcQAAAAEHash018==', N'fady.bassem18@school.com', N'01000000018', 4, N'Fady Bassem Eid', N'فادي باسم عيد', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (73, N'29901010100019', N'AQAAAAEAACcQAAAAEHash019==', N'ramy.wael19@school.com', N'01000000019', 4, N'Ramy Wael Sami', N'رامي وائل سامي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (74, N'29901010100020', N'AQAAAAEAACcQAAAAEHash020==', N'hany.medhat20@school.com', N'01000000020', 4, N'Hany Medhat Farouk', N'هاني مدحت فاروق', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (75, N'29901010100021', N'AQAAAAEAACcQAAAAEHash021==', N'waleed.tamer21@school.com', N'01000000021', 4, N'Waleed Tamer Shaker', N'وليد تامر شاكر', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (76, N'29901010100022', N'AQAAAAEAACcQAAAAEHash022==', N'essam.hossam22@school.com', N'01000000022', 4, N'Essam Hossam Marzouk', N'عصام حسام مرزوق', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (77, N'29901010100023', N'AQAAAAEAACcQAAAAEHash023==', N'fawzy.osama23@school.com', N'01000000023', 4, N'Fawzy Osama Helmy', N'فوزي أسامة حلمي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (78, N'29901010100024', N'AQAAAAEAACcQAAAAEHash024==', N'atef.sherif24@school.com', N'01000000024', 4, N'Atef Sherif Aziz', N'عاطف شريف عزيز', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (79, N'29901010100025', N'AQAAAAEAACcQAAAAEHash025==', N'maged.amr25@school.com', N'01000000025', 4, N'Maged Amr Salama', N'ماجد عمرو سلامة', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (80, N'29901010100026', N'AQAAAAEAACcQAAAAEHash026==', N'gamal.hassan26@school.com', N'01000000026', 4, N'Gamal Hassan Diab', N'جمال حسن دياب', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (81, N'29901010100027', N'AQAAAAEAACcQAAAAEHash027==', N'kareem.ali27@school.com', N'01000000027', 4, N'Kareem Ali Negm', N'كريم علي نجم', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (82, N'29901010100028', N'AQAAAAEAACcQAAAAEHash028==', N'bassem.omar28@school.com', N'01000000028', 4, N'Bassem Omar Sultan', N'باسم عمر سلطان', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (83, N'29901010100029', N'AQAAAAEAACcQAAAAEHash029==', N'wael.youssef29@school.com', N'01000000029', 4, N'Wael Youssef Mansour', N'وائل يوسف منصور', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (84, N'29901010100030', N'AQAAAAEAACcQAAAAEHash030==', N'medhat.karim30@school.com', N'01000000030', 4, N'Medhat Karim Galal', N'مدحت كريم جلال', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (85, N'29901010100031', N'AQAAAAEAACcQAAAAEHash031==', N'tamer.mahmoud31@school.com', N'01000000031', 4, N'Tamer Mahmoud Hegazy', N'تامر محمود حجازي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (86, N'29901010100032', N'AQAAAAEAACcQAAAAEHash032==', N'hossam.amr32@school.com', N'01000000032', 4, N'Hossam Amr Selim', N'حسام عمرو سليم', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (87, N'29901010100033', N'AQAAAAEAACcQAAAAEHash033==', N'osama.hassan33@school.com', N'01000000033', 4, N'Osama Hassan Ezzat', N'أسامة حسن عزت', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (88, N'29901010100034', N'AQAAAAEAACcQAAAAEHash034==', N'sherif.ali34@school.com', N'01000000034', 4, N'Sherif Ali Qotb', N'شريف علي قطب', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (89, N'29901010100035', N'AQAAAAEAACcQAAAAEHash035==', N'amr.sherif35@school.com', N'01000000035', 4, N'Amr Sherif Wahba', N'عمرو شريف وهبة', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (90, N'29901010100036', N'AQAAAAEAACcQAAAAEHash036==', N'hassan.omar36@school.com', N'01000000036', 4, N'Hassan Omar Fares', N'حسن عمر فارس', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (91, N'29901010100037', N'AQAAAAEAACcQAAAAEHash037==', N'ali.youssef37@school.com', N'01000000037', 4, N'Ali Youssef Bahaa', N'علي يوسف بهاء', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (92, N'29901010100038', N'AQAAAAEAACcQAAAAEHash038==', N'mohamed.kareem38@school.com', N'01000000038', 4, N'Mohamed Kareem Naeem', N'محمد كريم نعيم', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (93, N'29901010100039', N'AQAAAAEAACcQAAAAEHash039==', N'ahmed.tarek39@school.com', N'01000000039', 4, N'Ahmed Tarek Soliman', N'أحمد طارق سليمان', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (94, N'29901010100040', N'AQAAAAEAACcQAAAAEHash040==', N'omar.fady40@school.com', N'01000000040', 4, N'Omar Fady Mansy', N'عمر فادي منسي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (95, N'29901010100041', N'AQAAAAEAACcQAAAAEHash041==', N'youssef.ramy41@school.com', N'01000000041', 4, N'Youssef Ramy Aboud', N'يوسف رامي عبود', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (96, N'29901010100042', N'AQAAAAEAACcQAAAAEHash042==', N'karim.hany42@school.com', N'01000000042', 4, N'Karim Hany Shahin', N'كريم هاني شاهين', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (97, N'29901010100043', N'AQAAAAEAACcQAAAAEHash043==', N'mahmoud.waleed43@school.com', N'01000000043', 4, N'Mahmoud Waleed Korany', N'محمود وليد قرني', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (98, N'29901010100044', N'AQAAAAEAACcQAAAAEHash044==', N'amr.essam44@school.com', N'01000000044', 4, N'Amr Essam Behairy', N'عمرو عصام بحيري', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (99, N'29901010100045', N'AQAAAAEAACcQAAAAEHash045==', N'hassan.fawzy45@school.com', N'01000000045', 4, N'Hassan Fawzy Megahed', N'حسن فوزي مجاهد', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (100, N'29901010100046', N'AQAAAAEAACcQAAAAEHash046==', N'ali.atef46@school.com', N'01000000046', 4, N'Ali Atef Sabry', N'علي عاطف صبري', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (101, N'29901010100047', N'AQAAAAEAACcQAAAAEHash047==', N'sherif.maged47@school.com', N'01000000047', 4, N'Sherif Maged Tolba', N'شريف ماجد طلبة', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (102, N'29901010100048', N'AQAAAAEAACcQAAAAEHash048==', N'ibrahim.gamal48@school.com', N'01000000048', 4, N'Ibrahim Gamal Aly', N'إبراهيم جمال علي', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (103, N'29901010100049', N'AQAAAAEAACcQAAAAEHash049==', N'mostafa.kareem49@school.com', N'01000000049', 4, N'Mostafa Kareem Fahim', N'مصطفى كريم فهيم', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (104, N'29901010100050', N'AQAAAAEAACcQAAAAEHash050==', N'tarek.bassem50@school.com', N'01000000050', 4, N'Tarek Bassem Riad', N'طارق باسم رياض', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (105, N'2302839218932', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', N'controler@gmail.com', N'4354353454345', 2, N'controller', N'متحكم', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (106, N'3028772326362', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', N'eng@gmail.com', N'23213213213453', NULL, N'mohamed', N'محمد', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (107, N'33028772326362', N'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', N'eng2@gmail.com', N'23213213213453', NULL, N'ahmed', N'احمد', NULL, NULL, '2026-06-17 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (108, N'29901011234999', N'724936cd9b665b34b178904d938970b9fffede7f6fcbae3e0f61b87170c06feb', N'controller.dev.test@sewedy.local', N'01000000000', 2, N'Dev Controller', N'????? ??????', NULL, NULL, '2026-08-27 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (109, N'29901011234003', N'724936cd9b665b34b178904d938970b9fffede7f6fcbae3e0f61b87170c06feb', N'assessor.dev.test@sewedy.local', N'01000000003', NULL, N'Dev Assessor', N'???? ??????', NULL, NULL, '2026-08-27 00:00:00.000', 1, 1);
INSERT INTO [Account] ([Id], [NationalId], [PasswordHash], [Email], [Phone], [RoleId], [FullNameEN], [FullNameAR], [ResetToken], [ResetTokenExpiry], [Created_at], [IsActive], [StatusId]) VALUES (110, N'29901011234001', N'724936cd9b665b34b178904d938970b9fffede7f6fcbae3e0f61b87170c06feb', N'admin.dev.test@sewedy.local', N'01000000001', 2, N'Dev Admin', N'???? ??????', NULL, NULL, '2026-08-27 00:00:00.000', 1, 1);
IF OBJECTPROPERTY(OBJECT_ID('[Account]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Account] OFF;
GO

-- Data for CourseRoundInstructor
IF OBJECTPROPERTY(OBJECT_ID('[CourseRoundInstructor]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CourseRoundInstructor] ON;
INSERT INTO [CourseRoundInstructor] ([Id], [CourseRoundId], [InstructorAccountId], [RoleId], [AssignedDate]) VALUES (7, 5, 106, 3, '2026-06-17 00:00:00.000');
INSERT INTO [CourseRoundInstructor] ([Id], [CourseRoundId], [InstructorAccountId], [RoleId], [AssignedDate]) VALUES (8, 5, 107, 1, '2026-06-17 00:00:00.000');
INSERT INTO [CourseRoundInstructor] ([Id], [CourseRoundId], [InstructorAccountId], [RoleId], [AssignedDate]) VALUES (9, 5, 109, 1, '2026-08-27 00:00:00.000');
IF OBJECTPROPERTY(OBJECT_ID('[CourseRoundInstructor]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CourseRoundInstructor] OFF;
GO

-- Data for CourseRoundAssignments
IF OBJECTPROPERTY(OBJECT_ID('[CourseRoundAssignments]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CourseRoundAssignments] ON;
INSERT INTO [CourseRoundAssignments] ([Id], [Title], [Description], [AssignmentLink], [Deadline], [TotalGrade], [CourseRoundId], [InstructorId], [CourseMaterialId], [StatusId], [CreatedAt]) VALUES (3, N'Task 1', N'Subtasks: Create a website using html: 50 points, design the website using css: 50 points', NULL, '2026-07-17 06:40:29.430', 100, 1, 107, NULL, 1, '2026-06-17 06:40:31.037');
INSERT INTO [CourseRoundAssignments] ([Id], [Title], [Description], [AssignmentLink], [Deadline], [TotalGrade], [CourseRoundId], [InstructorId], [CourseMaterialId], [StatusId], [CreatedAt]) VALUES (4, N'Task 1', N'Subtasks: make automation using n8n: 100 points', NULL, '2026-07-17 06:41:26.163', 100, 2, 107, NULL, 1, '2026-06-17 06:41:27.767');
INSERT INTO [CourseRoundAssignments] ([Id], [Title], [Description], [AssignmentLink], [Deadline], [TotalGrade], [CourseRoundId], [InstructorId], [CourseMaterialId], [StatusId], [CreatedAt]) VALUES (5, N'Task 2', N'Subtasks: Use Make.com: 50 points, add automation workflow: 50 points', NULL, '2026-07-17 06:41:26.573', 100, 2, 107, NULL, 1, '2026-06-17 06:41:28.400');
INSERT INTO [CourseRoundAssignments] ([Id], [Title], [Description], [AssignmentLink], [Deadline], [TotalGrade], [CourseRoundId], [InstructorId], [CourseMaterialId], [StatusId], [CreatedAt]) VALUES (6, N'task 1', N'Subtasks: make a project: 100 points', NULL, '2026-07-17 06:45:27.450', 100, 3, 107, NULL, 1, '2026-06-17 06:45:28.997');
IF OBJECTPROPERTY(OBJECT_ID('[CourseRoundAssignments]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CourseRoundAssignments] OFF;
GO

-- Data for CourseRoundAssignmentSubmissions
IF OBJECTPROPERTY(OBJECT_ID('[CourseRoundAssignmentSubmissions]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CourseRoundAssignmentSubmissions] ON;
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (23, 4, 55, N'', '2026-06-17 06:42:27.363', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (24, 5, 55, N'', '2026-06-17 06:42:27.363', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (25, 4, 56, N'', '2026-06-17 06:42:27.393', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (26, 5, 56, N'', '2026-06-17 06:42:27.393', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (27, 4, 57, N'', '2026-06-17 06:42:27.393', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (28, 5, 57, N'', '2026-06-17 06:42:27.393', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (29, 4, 58, N'', '2026-06-17 06:42:27.393', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (30, 5, 58, N'', '2026-06-17 06:42:27.393', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (31, 4, 59, N'', '2026-06-17 06:42:27.393', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (32, 5, 59, N'', '2026-06-17 06:42:27.393', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (33, 3, 101, N'', '2026-06-17 06:43:40.890', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (34, 3, 102, N'', '2026-06-17 06:43:40.890', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (35, 3, 103, N'', '2026-06-17 06:43:40.890', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (36, 3, 104, N'', '2026-06-17 06:43:40.890', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (37, 3, 58, N'', '2026-06-17 06:57:58.407', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (38, 3, 59, N'', '2026-06-17 06:57:58.407', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (39, 3, 60, N'', '2026-06-17 06:57:58.407', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (40, 3, 61, N'', '2026-06-17 06:57:58.407', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (41, 3, 62, N'', '2026-06-17 06:57:58.407', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (42, 3, 55, N'', '2026-08-27 18:01:03.403', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (43, 3, 56, N'', '2026-08-27 18:06:46.420', NULL, NULL, 1);
INSERT INTO [CourseRoundAssignmentSubmissions] ([Id], [AssignmentId], [StudentId], [SubmissionLink], [SubmittedAt], [Grade], [Feedback], [StatusId]) VALUES (44, 3, 57, N'', '2026-08-27 18:06:46.420', NULL, NULL, 1);
IF OBJECTPROPERTY(OBJECT_ID('[CourseRoundAssignmentSubmissions]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CourseRoundAssignmentSubmissions] OFF;
GO

-- Data for CompetencyResult
IF OBJECTPROPERTY(OBJECT_ID('[CompetencyResult]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CompetencyResult] ON;
INSERT INTO [CompetencyResult] ([Id], [StudentId], [CourseId], [CourseRoundId], [TotalScore], [MaxScore], [ResultStatusId], [AssessorId], [Notes], [GradedAt], [CreatedAt]) VALUES (16, 55, 2, 5, 200.00, 200.00, 53, 107, NULL, '2026-06-17 07:29:08.287', '2026-06-17 07:29:09.717');
INSERT INTO [CompetencyResult] ([Id], [StudentId], [CourseId], [CourseRoundId], [TotalScore], [MaxScore], [ResultStatusId], [AssessorId], [Notes], [GradedAt], [CreatedAt]) VALUES (17, 56, 2, 5, 70.00, 200.00, 54, 107, NULL, '2026-06-17 07:32:27.143', '2026-06-17 07:32:28.407');
IF OBJECTPROPERTY(OBJECT_ID('[CompetencyResult]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [CompetencyResult] OFF;
GO

-- Data for Login
IF OBJECTPROPERTY(OBJECT_ID('[Login]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Login] ON;
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (33, 105, N'controler@gmail.com', N'9a0479f9dc3ceb93adee186bd87196ceca29258b747066a827cae1ed8378f032', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (34, 106, N'eng@gmail.com', N'841c6ed89d0d2299b336fcf5471b9d2998c6595b527a9f2f905764d60e9ff7a6', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (35, 107, N'eng2@gmail.com', N'0be380848152677609c29229b07a6e684248d7fc1966c81ea19b1d1dea0eb0ae', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (36, 105, N'controler@gmail.com', N'9ea59296a32e53015d9a56e91c571f8a168ac1635ed3ec74167eaccd47954d21', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (37, 105, N'controler@gmail.com', N'696e3112b50b8942d2b6459fb1934123092a72e218947e86911d35a95ceb2734', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (38, 106, N'eng@gmail.com', N'1a6fe2126ac868281d7f52677b39972ea3c65fe50806eda9bd0c27c9609f0964', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (39, 105, N'controler@gmail.com', N'871a531760afa009bde3e8aa404cfde3e83abb66068ba22a08d0f06718737239', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (40, 106, N'eng@gmail.com', N'46e41ca21b9d8051195e3a349e299e7fb58dc9a69e1da71d09809780e165b6ee', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (41, 107, N'eng2@gmail.com', N'be412e40b5dfc3acf8c6adbfb4c2138f770564b34e87c0423448abb6b771be1e', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (42, 105, N'controler@gmail.com', N'6b139a5a3131917d82b77f4f5e989aedbf82dc50236ed423c5b7072721dd781d', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (43, 106, N'eng@gmail.com', N'0a71ae3e3f4b889ea3a86f7acbf41a68ff12ae759ca7fdecbf922336417b7367', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (44, 107, N'eng2@gmail.com', N'3889a2392cb57bc84111d0bea0f68164842877c5034a9a796a5e035aa070568d', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (45, 105, N'controler@gmail.com', N'0cb16d9fcf65694e9ea0f86351f7c4f4b9b7fc7a903f0c7c9f144ffc9aa2a40e', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (46, 107, N'eng2@gmail.com', N'0ab9a9ba981330a0ae424a5017b4263f6fe0bd0aaf3c98820571a05b96fc547c', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (47, 106, N'eng@gmail.com', N'dab94144dc3bbacf45679619aa0f2a97b37e33afa32eba63340c801edfc84bbc', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (48, 105, N'controler@gmail.com', N'a24939d8eb78a3c5dc761762ad0c889c3813a821a63734b8cf209ff7b6d831ab', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (49, 106, N'eng@gmail.com', N'c8d5e1aefe801a719530b6a8272ac91fd25cca7bdf13f698f7cc07e41955d7d0', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (50, 105, N'controler@gmail.com', N'6aaf8438043fbeda8ccc7cc4b4ed36cf62b41a12f00ae020adea7c44b48d4ae0', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (51, 107, N'eng2@gmail.com', N'e317e8b9ece5e73dfed7dcd316170d1a10266ce5cd0a3b5bd0f7e30cec977279', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (52, 106, N'eng@gmail.com', N'caaf72ec6e19b5ea56914e669c3167a5d6541414742fff6ee8314133a7134c2a', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (53, 105, N'controler@gmail.com', N'2b00d7ea7902abd47002edc2f5161afc4ff0b06defa75d04b851a20e33bf8b33', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (54, 106, N'eng@gmail.com', N'5bbecd31a192417e726974606eec0a7043ebf31fff218fef771c332a6e281943', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (55, 107, N'eng2@gmail.com', N'e5e810cf54edbbc962207d9cbb654d40a7e56ae1ecc9b0f0860ae7228d4cab53', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (56, 106, N'eng@gmail.com', N'204f77a56d34e24abd38914719ba6542eb99a45e97e4de36d99a92fa877efa6e', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (57, 105, N'controler@gmail.com', N'bfe633575092e25799d5feb49dce46c89446d1f42a7e790a75426da60923b3c8', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (58, 106, N'eng@gmail.com', N'b48229087ec461def2bc3addafc5e5c03ecbb30a618113ff113f8584c66cebda', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (59, 105, N'controler@gmail.com', N'b672623d885820a870325f12e18153c7de04f4fe85bd7fbeb1338f03d731d33a', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (60, 106, N'eng@gmail.com', N'294de729de43378882ceaeee41ad9608c24860d2441620523471ee078b4fd90c', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (61, 105, N'controler@gmail.com', N'3907c78adfdbd99cfaf763252ca6f431417c0bc313f0c517a6d6c72019f46243', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (62, 106, N'eng@gmail.com', N'0a2cb86bc2a4d440127996a6780b0a7d10ca16bf75fc66c80924fbb750b4422f', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (63, 107, N'eng2@gmail.com', N'c212e1319af10b85c19f46b865bbd155d3a6bc4702ba1e53660a11f66814575c', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (64, 105, N'controler@gmail.com', N'cd8cf4491ddc9c0bb6348bd2fc5d01cf90538727c800f9f291c6489391d3d7c0', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (65, 107, N'eng2@gmail.com', N'f3eda840c15dad3a8547a711fbf56c6d66d1d89728dc77af5a16c7802594daf5', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (66, 108, N'controller.dev.test@sewedy.local', N'43b14be28adf73da9d59b7c5859b7080b74fe008269470225a9c6b02b6f10f75', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (67, 108, N'controller.dev.test@sewedy.local', N'53b0218419e31fb70391c1c9d4b1bd37dbda22403a647d44d6034d683b7b9804', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (68, 108, N'controller.dev.test@sewedy.local', N'635c0c1d0ac2cbf993968c5d81587c1dc09c8df1cb1526791ff5b573a845fa1d', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (69, 108, N'controller.dev.test@sewedy.local', N'a0c0c2b573866757fa328077cab6f3700d20083b1245ca05fb471f361358f0f5', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (70, 109, N'assessor.dev.test@sewedy.local', N'3d594f8ddbdb02e2c4a98bd5ba1ad0e89b02ec0fdaa2a7ebcd75192faa735ac7', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (71, 110, N'admin.dev.test@sewedy.local', N'5ad4af0d11638fd72b47a6bd02ce3421248c06341856cda087772a42df212bae', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (72, 109, N'assessor.dev.test@sewedy.local', N'53bbd36fac226d968d6714beddf0aac924e6e08e03475a7d7e40ca6ad0946af9', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (73, 108, N'controller.dev.test@sewedy.local', N'1f40b163116e80a036f41b07a923a7d16dd223287e610001dada614991cd3b64', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (74, 109, N'assessor.dev.test@sewedy.local', N'a6b39132326bedc7c7747adc325f52e7629b978e5e346eacd716e2534edd043a', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (75, 108, N'controller.dev.test@sewedy.local', N'93f548172d37a42283cf580a78667ab926916bed4507766bf535b0e7094a036e', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (76, 109, N'assessor.dev.test@sewedy.local', N'e185719670c0cd312ec1c10550803bd8e050f29d95888d8ed58230cb338097bf', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (77, 108, N'controller.dev.test@sewedy.local', N'df11d870943aa9d5e091298b1420b96ec1d54f35cd8f2a26d1e9325aaca9a9f6', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (78, 110, N'admin.dev.test@sewedy.local', N'6f98c7b5860b3f78236f521655628cc934dc4896551aa6582ebb6bc892d3e658', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (79, 110, N'admin.dev.test@sewedy.local', N'65f81e64060868e2cb1c5ac8ffcdc920136807f879f10bfab3a5ba2d769b7e4a', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (80, 110, N'admin.dev.test@sewedy.local', N'ddbc977aa9c58f629a397922623579053ebfda014dfd65624a85f43bc25961a9', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (81, 110, N'admin.dev.test@sewedy.local', N'c12efd536ee460903e5dcb045a8132d683c008258e9b47e130b8c3ef3eb3c76b', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (82, 110, N'admin.dev.test@sewedy.local', N'c8fd54568d48011d44b570244860ba40061be2e89bd07f83a5b91cf367e67e4a', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (83, 110, N'admin.dev.test@sewedy.local', N'17e8aa34dd4e9f7b67c337dcef863f53e029a5045c47f486a8b61e2c42724a77', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (84, 110, N'admin.dev.test@sewedy.local', N'c9e8778aa9b127dd8b28741f1a440b877abaf5443954fe16a28161d7c632d0c2', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (85, 110, N'admin.dev.test@sewedy.local', N'055341633ad3a73445c591508e19fdc87d27c424a9a6410448a2306c896409bd', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (86, 109, N'assessor.dev.test@sewedy.local', N'4c73a32682d84136e4177602ad4ddd83a829b0563bb536974d7d23a8c98d57c6', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (87, 105, N'controler@gmail.com', N'2c25178f3c4577378ae5209b31c1913029437270226ee3e55ba7d6e635d4d036', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (88, 107, N'eng2@gmail.com', N'0b5b615cc54b1ac16c4d50a58dbfd90893543963984c1c74d8adc01389bbd0a1', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (89, 106, N'eng@gmail.com', N'74f41fae0f0e26c66c6b2bb134190f09e3917e6adac7c3ca90298b3037f12743', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (90, 106, N'eng@gmail.com', N'17d1ec1eed127a525515a4ffd3dbe8d6cd2afd7733222473e8d290c587dbe407', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (91, 106, N'eng@gmail.com', N'd28787f87f76e1d343a8ed68631c433aa9ce1e73d3122591833e52958ee955f3', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (92, 106, N'eng@gmail.com', N'75b81fe8d149b1e41bfa3e4c5d85cbb6695e6a7cd62047e64375e6837a030b75', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (93, 106, N'eng@gmail.com', N'52a7634964737766f1b9b17b73840d6bd0359c14072d50879a3bf8a9167d56d8', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (94, 105, N'controler@gmail.com', N'1509af47af5c38f7fdedcb3171439c27f76117360e92d9bbb170a9607bd36da0', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (95, 107, N'eng2@gmail.com', N'4de0d21c73a8861918010908e25dd3650f3061afeb9be4744748d7b5d762e6ca', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (96, 106, N'eng@gmail.com', N'491bfb7c9503e2c1537ffafaeda78eb1b8d7632b7e143ea0a65e3af51ac5fa96', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (97, 107, N'eng2@gmail.com', N'ffd1ab204ba1ade9554aab1cf7f310af19f3f690bd0d041d0632cdbf52338135', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (98, 107, N'eng2@gmail.com', N'd78206b40fbebd8c3237d3838b1b17c447d5377b9e683af8b58dd0f8e2953167', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (99, 105, N'controler@gmail.com', N'123015b8138549772e8399da87121d5a0e85c2edbccec226794df4743bcf74c8', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (100, 105, N'controler@gmail.com', N'9dcec09a502270bf253c28b4c8085da22c75e5399fb80c27630789a9b3960e44', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (101, 107, N'eng2@gmail.com', N'97ed80e08dd6f0f0b399ebef907f3947c9a25dad942cdc508aba99727c546fe1', 1);
INSERT INTO [Login] ([Id], [AccountId], [Email], [PasswordHash], [StatusId]) VALUES (102, 105, N'controler@gmail.com', N'566a9620cb62cd247da24bd209abeb271d446f9143d631ae624918bff1481634', 1);
IF OBJECTPROPERTY(OBJECT_ID('[Login]'), 'TableHasIdentity') = 1 SET IDENTITY_INSERT [Login] OFF;
GO


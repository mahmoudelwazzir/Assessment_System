# =============================================================================
# Automated Database Restore Script for Elsewedy Assessment System
# Restores ElsewedySchoolSys onto (localdb)\MSSQLLocalDB
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host " ElsewedySchoolSys Database Restore Script" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$zipPath = Join-Path $scriptDir "ElsewedySchoolSysDB_Backup.zip"
$tempExtractDir = Join-Path $scriptDir "temp_extracted"
$mdfPath = Join-Path $scriptDir "ElsewedySchoolSys.mdf"
$ldfPath = Join-Path $scriptDir "ElsewedySchoolSys_log.ldf"

# 1. Start LocalDB
Write-Host "[1/5] Starting LocalDB instance (MSSQLLocalDB)..." -ForegroundColor Green
sqllocaldb start MSSQLLocalDB

# 2. Extract backup .bak
Write-Host "[2/5] Extracting database backup from zip..." -ForegroundColor Green
if (Test-Path $tempExtractDir) { Remove-Item -Recurse -Force $tempExtractDir }
New-Item -ItemType Directory -Path $tempExtractDir | Out-Null
Expand-Archive -Path $zipPath -DestinationPath $tempExtractDir -Force

$nestedZip = Get-ChildItem -Path $tempExtractDir -Filter "*.zip" -Recurse | Select-Object -First 1
if ($nestedZip) {
    Expand-Archive -Path $nestedZip.FullName -DestinationPath $tempExtractDir -Force
}

$bakFile = Get-ChildItem -Path $tempExtractDir -Filter "*.bak" -Recurse | Select-Object -First 1
if (-not $bakFile) {
    throw "Backup .bak file not found inside zip."
}
Write-Host "Found backup: $($bakFile.FullName)" -ForegroundColor Gray

# 3. Restore Database
Write-Host "[3/5] Restoring database to: $mdfPath..." -ForegroundColor Green
$restoreSql = @"
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ElsewedySchoolSys')
BEGIN
    ALTER DATABASE [ElsewedySchoolSys] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [ElsewedySchoolSys];
END;

RESTORE DATABASE [ElsewedySchoolSys]
FROM DISK = '$($bakFile.FullName)'
WITH MOVE 'ElsewedySchoolSysDB_DEV' TO '$mdfPath',
     MOVE 'ElsewedySchoolSysDB_DEV_log' TO '$ldfPath',
     REPLACE;

ALTER AUTHORIZATION ON DATABASE::ElsewedySchoolSys TO sa;
ALTER DATABASE [ElsewedySchoolSys] SET RECOVERY SIMPLE;
DBCC SHRINKFILE (ElsewedySchoolSys_log, 10);
"@

sqlcmd -S "(localdb)\MSSQLLocalDB" -Q $restoreSql

# 4. Apply Schema Extensions
Write-Host "[4/5] Applying assessment module schema extensions..." -ForegroundColor Green
$schemaSql = @"
USE [ElsewedySchoolSys];

IF NOT EXISTS (SELECT * FROM sys.views WHERE name = 'Courses')
BEGIN
    EXEC('CREATE VIEW [dbo].[Courses] AS SELECT Id, Title, Description, LevelStatusId, DurationHours, BusinessEntity, GradeID FROM [dbo].[Course];');
END;

IF NOT EXISTS (SELECT * FROM sys.key_constraints WHERE name = 'PK_CourseMaterial')
BEGIN
    ALTER TABLE [dbo].[CourseMaterial] ADD CONSTRAINT PK_CourseMaterial PRIMARY KEY ([ID]);
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'audit_log')
BEGIN
    CREATE TABLE [dbo].[audit_log] (
        [id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [user_id] bigint NULL,
        [action_type] nvarchar(100) NOT NULL,
        [entity_name] nvarchar(100) NOT NULL,
        [entity_id] bigint NULL,
        [old_values] nvarchar(max) NULL,
        [new_values] nvarchar(max) NULL,
        [ip_address] nvarchar(50) NULL,
        [user_agent] nvarchar(255) NULL,
        [created_at] datetime2 NOT NULL DEFAULT (sysutcdatetime())
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'controller_reports')
BEGIN
    CREATE TABLE [dbo].[controller_reports] (
        [id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [cycle_id] bigint NOT NULL,
        [report_type] nvarchar(50) NOT NULL,
        [summary_json] nvarchar(max) NOT NULL,
        [assessor_breakdown_json] nvarchar(max) NOT NULL,
        [competency_breakdown_json] nvarchar(max) NOT NULL,
        [generated_by] bigint NOT NULL,
        [generated_at] datetime2 NOT NULL DEFAULT (sysutcdatetime()),
        [status] nvarchar(20) NOT NULL DEFAULT 'Generated'
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CourseRoundAssignments')
BEGIN
    CREATE TABLE [dbo].[CourseRoundAssignments] (
        [Id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CourseId] bigint NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(max) NULL,
        [MaterialId] bigint NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT (sysutcdatetime()),
        [IsActive] bit NOT NULL DEFAULT 1
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CourseRoundAssignmentSubmissions')
BEGIN
    CREATE TABLE [dbo].[CourseRoundAssignmentSubmissions] (
        [Id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [AssignmentId] bigint NOT NULL,
        [StudentId] bigint NOT NULL,
        [SubmittedAt] datetime2 NOT NULL DEFAULT (sysutcdatetime()),
        [StatusId] bigint NOT NULL DEFAULT 1,
        [Remarks] nvarchar(max) NULL
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CompetencyResult')
BEGIN
    CREATE TABLE [dbo].[CompetencyResult] (
        [Id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [StudentId] bigint NOT NULL,
        [CourseId] bigint NOT NULL,
        [CourseRoundId] bigint NOT NULL,
        [AssessorId] bigint NOT NULL,
        [AttemptNumber] int NOT NULL DEFAULT 1,
        [TotalScore] decimal(18,2) NOT NULL,
        [MaxScore] decimal(18,2) NOT NULL,
        [ResultStatusId] bigint NOT NULL DEFAULT 1,
        [Feedback] nvarchar(max) NULL,
        [GradedAt] datetime2 NOT NULL DEFAULT (sysutcdatetime()),
        [IsApprovedByVerifier] bit NOT NULL DEFAULT 0,
        [VerifierId] bigint NULL,
        [VerifierNotes] nvarchar(max) NULL,
        [VerifiedAt] datetime2 NULL
    );
END;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.CourseRoundInstructor') AND name = 'RoleId')
BEGIN
    ALTER TABLE [dbo].[CourseRoundInstructor] ADD [RoleId] bigint NULL;
END;
"@

sqlcmd -S "(localdb)\MSSQLLocalDB" -Q $schemaSql

# 5. Clean up temp extract
Write-Host "[5/5] Cleaning up temporary files..." -ForegroundColor Green
if (Test-Path $tempExtractDir) { Remove-Item -Recurse -Force $tempExtractDir }

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host " [SUCCESS] ElsewedySchoolSys restored & configured successfully!" -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Cyan


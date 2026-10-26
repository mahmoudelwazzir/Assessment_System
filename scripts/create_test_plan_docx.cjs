const fs = require('fs');
const path = require('path');
const {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  AlignmentType,
  HeadingLevel,
  Packer,
  Header,
  Footer,
  PageNumber
} = require('docx');

// Colors
const COLOR_PRIMARY = 'C8102E'; // Elsewedy Crimson Red
const COLOR_SECONDARY = '1E293B'; // Deep Navy / Slate
const COLOR_TEXT = '2D3748';
const COLOR_MUTED = '64748B';
const COLOR_BG_HEADER = 'F1F5F9';
const COLOR_BORDER = 'CBD5E1';
const COLOR_ZEBRA = 'F8FAFC';

// Helpers
const createHeading1 = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    border: {
      bottom: { color: COLOR_PRIMARY, space: 4, value: BorderStyle.SINGLE, size: 12 }
    },
    run: {
      color: COLOR_PRIMARY,
      bold: true,
      size: 28,
      font: 'Segoe UI'
    }
  });

const createHeading2 = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    run: {
      color: COLOR_SECONDARY,
      bold: true,
      size: 24,
      font: 'Segoe UI'
    }
  });

const createHeading3 = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 60 },
    run: {
      color: COLOR_PRIMARY,
      bold: true,
      size: 20,
      font: 'Segoe UI'
    }
  });

const createParagraph = (text, options = {}) =>
  new Paragraph({
    spacing: { before: 60, after: 60, line: 276 },
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text: text,
        size: options.size || 21,
        font: 'Segoe UI',
        color: options.color || COLOR_TEXT,
        bold: options.bold || false,
        italics: options.italics || false
      })
    ]
  });

const createBullet = (boldPrefix, normalText) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
    children: [
      new TextRun({
        text: boldPrefix,
        bold: true,
        size: 21,
        font: 'Segoe UI',
        color: COLOR_SECONDARY
      }),
      new TextRun({
        text: normalText,
        size: 21,
        font: 'Segoe UI',
        color: COLOR_TEXT
      })
    ]
  });

// Table styling helper
const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
  left: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
  right: { style: BorderStyle.SINGLE, size: 6, color: COLOR_BORDER },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
  insideVertical: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
};

const createTableHeaderCell = (text, widthPercent) =>
  new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: text,
            bold: true,
            color: 'FFFFFF',
            size: 20,
            font: 'Segoe UI'
          })
        ]
      })
    ]
  });

const createTableCell = (text, widthPercent, isZebra = false, isCenter = false, isBold = false) =>
  new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: isZebra ? { type: ShadingType.CLEAR, fill: COLOR_ZEBRA } : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: isCenter ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text,
            color: COLOR_TEXT,
            size: 19,
            font: 'Segoe UI',
            bold: isBold
          })
        ]
      })
    ]
  });

const buildDocument = () => {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            color: COLOR_TEXT
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Elsewedy Technical Academy (STA) | Competency Assessment Platform',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Confidential & Proprietary — Page ',
                    size: 16,
                    color: COLOR_MUTED
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT]
                  }),
                  new TextRun({
                    text: ' of ',
                    size: 16,
                    color: COLOR_MUTED
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES]
                  })
                ]
              })
            ]
          })
        },
        children: [
          // Title Banner
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: 'ELSEWEDY TECHNICAL ACADEMY (STA)',
                bold: true,
                size: 26,
                color: COLOR_PRIMARY,
                font: 'Segoe UI'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 140 },
            children: [
              new TextRun({
                text: 'Elsewedy Assessment & Competency Management System',
                size: 34,
                bold: true,
                color: COLOR_SECONDARY,
                font: 'Segoe UI'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 300 },
            children: [
              new TextRun({
                text: 'SOFTWARE QUALITY ASSURANCE & SYSTEM TEST PLAN',
                bold: true,
                size: 22,
                color: COLOR_PRIMARY,
                font: 'Segoe UI'
              }),
              new TextRun({
                text: ' | Version 1.0 (Release-Ready)',
                italics: true,
                size: 18,
                color: COLOR_MUTED
              })
            ]
          }),

          // 1. Introduction
          createHeading1('1. Introduction'),
          createParagraph(
            'The purpose of this Test Plan is to provide a comprehensive, rigorous framework for testing and verifying the Elsewedy Assessment & Competency Management System (STA Platform). This platform is an enterprise-grade digital solution designed for Elsewedy Electrometer and Elsewedy Technical Academy (STA) to oversee, administer, and verify practical skills and technical competencies for vocational academy students.'
          ),
          createParagraph(
            'The system replaces legacy manual and paper-based grading with an automated 3-tier operational governance model consisting of Control (المتحكم), Assessor (المُقيّم), and Verifier (المُدقّق). This plan outlines all required testing phases, test strategies, environmental dependencies, personnel responsibilities, release schedules, and formal sign-offs necessary to guarantee data integrity, strict access control, reliable audit trails, and uninterrupted field usability.'
          ),

          // 2. Scope
          createHeading1('2. Scope'),
          createHeading2('In Scope:'),
          createBullet('Authentication & Role-Based Access Control (RBAC): ', 'Verification of unified login (/login), SHA-256 hashed password verification, JWT/session handling, and strict client/server route protection between Control, Assessor, Verifier, and Student roles.'),
          createBullet('Control Module (المتحكم): ', 'Creation and lifecycle management of Course Rounds (CourseRound), assignment of lead instructors and engineers (CourseRoundInstructor, CourseRoundAssignment), student roster bulk enrollment, question bank setup, automated grading rule definition, and enterprise reporting generation.'),
          createBullet('Assessor Module (المُقيّم): ', 'Student evaluation workflows, assessment rubric scoring across sequential attempts (Attempt A, B, C, and D), practical task grading (TblTask, TaskSubmission), criteria checklist validation, and submission feedback recording.'),
          createBullet('Verifier Module (المُدقّق): ', 'Independent audit and quality assurance workflows, review of assessor grading rubrics (CompetencyResult), submission inspection, dispute handling/revision requests, final competency validation, and verification logging.'),
          createBullet('Backend REST API & Entity Framework Core 10: ', 'Testing all endpoints across AuthController, StudentsController, CoursesController, CourseRoundController, DashboardController, CompetencyResultController, and ReportsController against Microsoft SQL Server.'),
          createBullet('Audit Logging & Data Integrity: ', 'Verification that every status transition, grade submission, and verification action is immutably logged in the AuditLog repository.'),
          createBullet('UI/UX, Accessibility & Brand Compliance: ', 'Validation of the responsive web interface, Next.js 16 Turbopack rendering, Elsewedy Brand Identity (#c8102e), Dark/Light theme switching, and interactive toast feedback (Sonner).'),

          createHeading2('Out of Scope:'),
          createBullet('External Commercial Payment Gateways: ', 'Tuition/fee payment processing is outside the scope of this internal academy competency evaluation platform.'),
          createBullet('Physical Biometric Hardware Devices: ', 'Hardware turnstiles and fingerprint scanners are managed by separate facility systems; this system consumes attendance and assessment records digitally.'),
          createBullet('Full Legacy Corporate ERP Integration: ', 'Synchronizing historical data from third-party legacy HRMS databases is handled via scheduled batch DB jobs and is not covered in this application test cycle.'),
          createBullet('Native Mobile App Packaging: ', 'Direct testing of Google Play or Apple App Store native binaries (the platform is deployed as a fully responsive progressive web application).'),

          // 3. Test Strategy
          createHeading1('3. Test Strategy'),
          createParagraph(
            'A multi-layered test pyramid approach ensures early defect detection, business logic reliability, and smooth cross-role workflow execution:'
          ),
          createBullet('Unit Testing: ', 'Automated unit tests for backend C# controllers and service repositories (xUnit / Moq), validating business rules, grade computation, and input validation. Frontend unit testing of React 19 UI components and hooks.'),
          createBullet('Integration & API Testing: ', 'End-to-end endpoint testing using Postman and automated PowerShell scripts, verifying HTTP status codes (200, 201, 400, 401, 403, 404, 500), JSON DTO serialization, and Entity Framework Core 10 database transactions.'),
          createBullet('System & Role-Handshake Testing: ', 'Simulating the entire assessment lifecycle across roles: Control initiates cycle -> Assessor enters marks across attempts A-D -> Verifier audits and locks results -> System publishes analytics.'),
          createBullet('Security & RBAC Enforcement Testing: ', 'Negative testing verifying that Assessors cannot access /controller routes, Verifiers cannot modify original student marks without generating audit flags, and unauthenticated requests are strictly rejected.'),
          createBullet('Database & Concurrency Testing: ', 'Stress testing simultaneous grade submissions on the cloud Microsoft SQL Server (db56344.public.databaseasp.net), ensuring ACID compliance, transaction isolation, and foreign key integrity.'),
          createBullet('User Acceptance Testing (UAT): ', 'Execution of real-world assessment scenarios by Elsewedy Technical Academy supervisors and certified engineers prior to final production cutover.'),

          // 4. Environmental Needs
          createHeading1('4. Environmental Needs'),
          createHeading2('Software Requirements:'),
          createBullet('Web Browsers: ', 'Google Chrome (v120+), Microsoft Edge (v120+), Mozilla Firefox (v120+), Safari (v17+).'),
          createBullet('Frontend Runtime: ', 'Next.js 16 (App Router with Turbopack), Node.js v20+ / v24, React 19, Tailwind CSS.'),
          createBullet('Backend Framework: ', 'ASP.NET Core Web API (.NET 10 SDK), Entity Framework Core 10.'),
          createBullet('Database Management System: ', 'Microsoft SQL Server 2022 / Cloud Database (db56344.public.databaseasp.net).'),
          createBullet('Testing & Automation Tools: ', 'Playwright for E2E automation, Swagger UI (http://localhost:5247/swagger), Postman, xUnit, PowerShell 7+.'),
          createBullet('Operating Systems: ', 'Windows 11 / Windows 10, Windows Server 2022, Ubuntu Linux 22.04 LTS (Docker/Cloud Host), macOS.'),

          createHeading2('Hardware Requirements:'),
          createBullet('API & Database Server: ', 'Minimum 4 CPU Cores (2.4 GHz+), 16 GB RAM, 50 GB SSD storage, 100 Mbps network interface.'),
          createBullet('Assessor / Verifier Client Terminals: ', 'Laptops, desktops, or workshop tablets (Intel Core i3/i5 or equivalent), 8 GB RAM, minimum screen resolution 1366x768 (1920x1080 recommended).'),
          createBullet('Network Infrastructure: ', 'Reliable Academy Local Area Network (LAN) / Wi-Fi with minimum 15 Mbps low-latency connection to the cloud database server.'),

          // 5. Staff & Responsibilities
          createHeading1('5. Staff & Responsibilities'),
          new Paragraph({ spacing: { after: 120 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Role', 25),
                  createTableHeaderCell('Staff Member', 25),
                  createTableHeaderCell('Responsibilities', 50)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('QA Lead / Test Manager', 25, false, false, true),
                  createTableCell('Eng. Mahmoud Elwazzir', 25, false, true),
                  createTableCell('Overall test strategy, schedule oversight, test plan approval, defect triage, and final QA certification.', 50)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Senior E2E & Automation QA', 25, true, false, true),
                  createTableCell('QA Automation Team', 25, true, true),
                  createTableCell('Playwright test script development, automated regression execution, cross-browser verification, and CI/CD test gates.', 50, true)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Backend & API Tester', 25, false, false, true),
                  createTableCell('Backend Lead & QA', 25, false, true),
                  createTableCell('ASP.NET Core API testing, EF Core query optimization verification, cloud SQL integrity tests, and security penetration testing.', 50)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Frontend & UI/UX Tester', 25, true, false, true),
                  createTableCell('Frontend QA Specialist', 25, true, true),
                  createTableCell('Next.js component verification, theme switching, responsive design audit, form validation (Zod/React Hook Form), and toast notifications.', 50, true)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('STA Academy Domain Expert', 25, false, false, true),
                  createTableCell('Head of Evaluation (STA)', 25, false, true),
                  createTableCell('Business scenario validation, competency rubric compliance (Attempts A-D), user acceptance criteria, and UAT sign-off.', 50)
                ]
              })
            ]
          }),

          // 6. Deliverables & Scheduling
          createHeading1('6. Deliverables & Scheduling'),
          new Paragraph({ spacing: { after: 120 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Deliverables / Milestone', 28),
                  createTableHeaderCell('Start date', 16),
                  createTableHeaderCell('Duration', 14),
                  createTableHeaderCell('End date', 16),
                  createTableHeaderCell('Comments', 26)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Test Plan Formulation & Baselining', 28, false, false, true),
                  createTableCell('Oct 15, 2026', 16, false, true),
                  createTableCell('3 Days', 14, false, true),
                  createTableCell('Oct 17, 2026', 16, false, true),
                  createTableCell('Finalized test strategy, scope, and stakeholder alignment.', 26)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Test Environment Setup & Cloud DB Seeding', 28, true, false, true),
                  createTableCell('Oct 18, 2026', 16, true, true),
                  createTableCell('2 Days', 14, true, true),
                  createTableCell('Oct 19, 2026', 16, true, true),
                  createTableCell('Seeded accounts (Control, Assessor, Verifier, Students).', 26, true)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Backend API & Integration Test Execution', 28, false, false, true),
                  createTableCell('Oct 20, 2026', 16, false, true),
                  createTableCell('5 Days', 14, false, true),
                  createTableCell('Oct 24, 2026', 16, false, true),
                  createTableCell('Controllers, DTOs, EF Core repository validations.', 26)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Frontend Functional & RBAC Route Guard Testing', 28, true, false, true),
                  createTableCell('Oct 25, 2026', 16, true, true),
                  createTableCell('4 Days', 14, true, true),
                  createTableCell('Oct 28, 2026', 16, true, true),
                  createTableCell('Cross-browser, UI state, responsive layouts, Next.js routes.', 26, true)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('3-Tier Role Handshake & Competency Flow E2E', 28, false, false, true),
                  createTableCell('Oct 29, 2026', 16, false, true),
                  createTableCell('4 Days', 14, false, true),
                  createTableCell('Nov 01, 2026', 16, false, true),
                  createTableCell('Simulating full cycle: Cycle -> Mark A-D -> Audit -> Report.', 26)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Security, AuditLog & Negative Testing', 28, true, false, true),
                  createTableCell('Nov 02, 2026', 16, true, true),
                  createTableCell('3 Days', 14, true, true),
                  createTableCell('Nov 04, 2026', 16, true, true),
                  createTableCell('Role bypass attempts, tamper-proofing, audit verification.', 26, true)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('User Acceptance Testing (UAT) with STA Engineers', 28, false, false, true),
                  createTableCell('Nov 05, 2026', 16, false, true),
                  createTableCell('4 Days', 14, false, true),
                  createTableCell('Nov 08, 2026', 16, false, true),
                  createTableCell('Conducted with academy instructors on live test workshop data.', 26)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Final Test Summary Report & Release Readiness', 28, true, false, true),
                  createTableCell('Nov 09, 2026', 16, true, true),
                  createTableCell('2 Days', 14, true, true),
                  createTableCell('Nov 10, 2026', 16, true, true),
                  createTableCell('Formal sign-off for Production Deployment.', 26, true)
                ]
              })
            ]
          }),

          // 7. Review and Approvals
          createHeading1('7. Review and Approvals'),
          createParagraph(
            'By signing below, the undersigned stakeholders acknowledge that they have reviewed this Test Plan, agreed to the proposed scope, test strategy, resource allocation, and criteria for production acceptance.'
          ),
          new Paragraph({ spacing: { after: 120 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorders,
            rows: [
              new TableRow({
                children: [
                  createTableHeaderCell('Role', 25),
                  createTableHeaderCell('Name', 25),
                  createTableHeaderCell('Date', 20),
                  createTableHeaderCell('Signature', 30)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('QA Lead / Test Manager', 25, false, false, true),
                  createTableCell('Eng. Mahmoud Elwazzir', 25, false, true),
                  createTableCell('Nov 10, 2026', 20, false, true),
                  createTableCell('Approved & Verified (Signed)', 30, false, true)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Lead Software Architect', 25, true, false, true),
                  createTableCell('Technical Lead (.NET / Next.js)', 25, true, true),
                  createTableCell('Nov 10, 2026', 20, true, true),
                  createTableCell('Approved (Signed)', 30, true, true)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Project Manager', 25, false, false, true),
                  createTableCell('STA Project Director', 25, false, true),
                  createTableCell('Nov 11, 2026', 20, false, true),
                  createTableCell('Approved (Signed)', 30, false, true)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Elsewedy Operations Director', 25, true, false, true),
                  createTableCell('Head of Quality Assurance (STA)', 25, true, true),
                  createTableCell('Nov 11, 2026', 20, true, true),
                  createTableCell('Executive Approval (Signed)', 30, true, true)
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  return doc;
};

async function main() {
  const doc = buildDocument();
  const outputPath = path.join(__dirname, '..', 'Test_Plan_Elsewedy_Assessment_System.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Test Plan Word Document successfully generated at: ${outputPath}`);
}

main().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});

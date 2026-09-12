import { type ProjectItem, type ChallengeItem } from '../components/university/universityData.js';

export interface DossierRecord {
  projectCode: string;
  projectTitle: string;
  sector: string;
  targetDepartment: string;
  challengeRef: string;
  district: string;
  facultyMentor: string;
  mentorDept: string;
  studentLead: string;
  teamSize: number;
  budgetAllocated: number;
  fundsUtilized: number;
  utilizationRate: number;
  progressPercent: number;
  healthStatus: 'On Track' | 'Ahead of Schedule' | 'Field Trial' | 'Under Review';
  currentMilestone: string;
  citizenImpact: string;
}

export function parseIndianCurrency(val: string | undefined): number {
  if (!val) return 0;
  const digits = val.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

export function formatIndianCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export function compileDossierRecords(
  projects: ProjectItem[],
  challenges: ChallengeItem[],
  selectedDepartment: string = 'all'
): DossierRecord[] {
  const challengeMap = new Map<string, ChallengeItem>();
  challenges.forEach((c) => challengeMap.set(c.code, c));

  return projects
    .map((proj) => {
      const challenge = challengeMap.get(proj.challengeRef);
      const budget = parseIndianCurrency(proj.budgetAllocated);
      // Realistic funds utilized calculation based on milestone progress
      const utilizationRate = Math.min(100, Math.max(15, Math.round(proj.progress * 0.92)));
      const fundsUtilized = Math.round((budget * utilizationRate) / 100);

      // Map sector to State Department
      let targetDept = 'Dept. of Higher & Technical Education';
      if (proj.sector.toLowerCase().includes('water')) {
        targetDept = 'Dept. of Drinking Water & Sanitation (DWSD)';
      } else if (proj.sector.toLowerCase().includes('agri')) {
        targetDept = 'Dept. of Agriculture, Animal Husbandry & Co-operative';
      } else if (proj.sector.toLowerCase().includes('health') || proj.sector.toLowerCase().includes('clinical')) {
        targetDept = 'Dept. of Health, Medical Education & Family Welfare';
      } else if (proj.sector.toLowerCase().includes('mining') || proj.sector.toLowerCase().includes('environment')) {
        targetDept = 'Dept. of Mines & Geology / Forest & Environment';
      } else if (proj.sector.toLowerCase().includes('energy') || proj.sector.toLowerCase().includes('urja')) {
        targetDept = 'Dept. of Energy (JBVNL / JREDA)';
      } else if (proj.sector.toLowerCase().includes('it') || proj.sector.toLowerCase().includes('ai')) {
        targetDept = 'Dept. of Information Technology & e-Governance';
      }

      let healthStatus: DossierRecord['healthStatus'] = 'On Track';
      if (proj.progress >= 80) healthStatus = 'Field Trial';
      else if (proj.progress >= 70) healthStatus = 'Ahead of Schedule';
      else if (proj.progress < 40) healthStatus = 'Under Review';

      const firstStudent = proj.students && proj.students.length > 0 ? proj.students[0] : undefined;
      const studentLead = firstStudent
        ? `${firstStudent.name} (${firstStudent.dept})`
        : 'Student Research Cell';

      return {
        projectCode: proj.code,
        projectTitle: proj.title,
        sector: proj.sector,
        targetDepartment: targetDept,
        challengeRef: proj.challengeRef,
        district: challenge?.district || 'Ranchi',
        facultyMentor: `${proj.mentorName} (${proj.mentorTitle})`,
        mentorDept: proj.mentorDept,
        studentLead,
        teamSize: proj.teamSize || (proj.students ? proj.students.length : 4),
        budgetAllocated: budget,
        fundsUtilized,
        utilizationRate,
        progressPercent: proj.progress,
        healthStatus,
        currentMilestone: proj.currentMilestone || 'System Validation',
        citizenImpact: challenge?.potentialImpact || 'Direct civic remediation across regional habitations',
      };
    })
    .filter((record) => {
      if (selectedDepartment === 'all') return true;
      return record.targetDepartment.toLowerCase().includes(selectedDepartment.toLowerCase());
    });
}

export function exportDossierToCSV(records: DossierRecord[], departmentFilterName: string = 'All Departments') {
  const headers = [
    'Project Code',
    'Project Title',
    'Target State Department',
    'Sector',
    'Challenge Reference',
    'District',
    'Faculty Principal Investigator',
    'Mentor Department',
    'Student Lead',
    'Team Size',
    'Sanctioned Budget (INR)',
    'Funds Utilized (INR)',
    'Fund Utilization Rate (%)',
    'Project Progress (%)',
    'Project Health Status',
    'Current Active Milestone',
    'Citizen Impact / Civic Outcome',
  ];

  const rows = records.map((r) => [
    `"${r.projectCode}"`,
    `"${r.projectTitle.replace(/"/g, '""')}"`,
    `"${r.targetDepartment}"`,
    `"${r.sector}"`,
    `"${r.challengeRef}"`,
    `"${r.district}"`,
    `"${r.facultyMentor}"`,
    `"${r.mentorDept}"`,
    `"${r.studentLead}"`,
    r.teamSize,
    r.budgetAllocated,
    r.fundsUtilized,
    `${r.utilizationRate}%`,
    `${r.progressPercent}%`,
    `"${r.healthStatus}"`,
    `"${r.currentMilestone.replace(/"/g, '""')}"`,
    `"${r.citizenImpact.replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const cleanDeptName = departmentFilterName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Jharkhand_Govt_Dossier_${cleanDeptName}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerDossierPrint(printableElementId: string) {
  const element = document.getElementById(printableElementId);
  if (!element) {
    window.print();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    document.body.removeChild(iframe);
    return;
  }

  // Copy stylesheets from head
  const headHtml = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Govt of Jharkhand - Samadhan Setu Institutional Progress Dossier</title>
        ${headHtml}
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 12mm 14mm 12mm;
          }
          body {
            background-color: #ffffff !important;
            color: #111827 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          table {
            page-break-inside: auto;
            width: 100%;
            border-collapse: collapse;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
          .page-break-before {
            page-break-before: always;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Wait for styles/fonts to register in iframe before printing
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1500);
  }, 400);
}

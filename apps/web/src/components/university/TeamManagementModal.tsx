import { useState } from 'react';
import type { ProjectItem, FacultyMentor, StudentInvestigator } from './universityData.js';
import {
  X,
  UserCheck,
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle2,
  Building,
} from 'lucide-react';

interface Props {
  project: ProjectItem;
  mentors: FacultyMentor[];
  students: StudentInvestigator[];
  onClose: () => void;
  onSave: (
    projectId: string,
    mentor: FacultyMentor,
    assignedStudents: { name: string; rollNo: string; role: string; dept: string }[],
  ) => void;
}

const FALLBACK_MENTOR: FacultyMentor = {
  id: 'fac-01',
  name: 'Dr. Rajesh Sharma',
  designation: 'Professor & Dean (R&D)',
  department: 'Dept. of Environmental Science & Engineering',
  qualifications: 'Ph.D. (IIT Roorkee)',
  experienceYears: 14,
  specialization: ['Water Quality'],
  activeProjects: 2,
  maxCapacity: 3,
  email: 'rsharma@bitmesra.ac.in',
  phone: '+91 651 227 5444',
};

export function TeamManagementModal({ project, mentors, students, onClose, onSave }: Props) {
  const currentMentor =
    mentors.find((m) => m.name === project.mentorName) || mentors[0] || FALLBACK_MENTOR;
  const [selectedMentorId, setSelectedMentorId] = useState(currentMentor.id);
  const [teamMembers, setTeamMembers] = useState(project.students);
  const [newStudentId, setNewStudentId] = useState('');
  const [newStudentRole, setNewStudentRole] = useState('Student Investigator');

  const selectedMentor =
    mentors.find((m) => m.id === selectedMentorId) || currentMentor;

  const handleAddStudent = () => {
    if (!newStudentId) return;
    const student = students.find((s) => s.id === newStudentId);
    if (!student) return;

    if (teamMembers.some((m) => m.rollNo === student.rollNo)) {
      alert('Student is already part of this project team.');
      return;
    }

    setTeamMembers([
      ...teamMembers,
      {
        name: student.name,
        rollNo: student.rollNo,
        role: newStudentRole,
        dept: student.department,
      },
    ]);
    setNewStudentId('');
    setNewStudentRole('Student Investigator');
  };

  const handleRemoveStudent = (rollNo: string) => {
    setTeamMembers(teamMembers.filter((m) => m.rollNo !== rollNo));
  };

  const handleSave = () => {
    onSave(project.id, selectedMentor, teamMembers);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col border border-border bg-paper shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-navy px-6 py-3 text-white">
          <div className="flex items-center gap-2.5">
            <UserCheck className="h-5 w-5 text-turmeric" />
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-turmeric uppercase">
                संकाय एवं छात्र दल प्रबंधन | MULTIDISCIPLINARY R&D TEAM ALLOCATION
              </p>
              <h2 className="font-display text-base font-semibold">
                Form & Configure Research Team
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border border-white/20 p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Project Meta Banner */}
        <div className="border-b border-border bg-white px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs font-semibold text-navy">{project.code}</span>
              <span className="mx-2 text-border">·</span>
              <span className="font-mono text-xs text-ink-muted">Ref: {project.challengeRef}</span>
            </div>
            <span className="border border-turmeric bg-turmeric/10 px-2 py-0.5 font-mono text-xs font-semibold text-ink">
              Status: {project.status} ({project.progress}% Complete)
            </span>
          </div>
          <h3 className="mt-1 font-display text-sm font-semibold text-navy">{project.title}</h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Assign Faculty Mentor */}
          <div className="border border-border bg-white p-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-navy" />
                <h4 className="text-xs font-semibold text-navy uppercase tracking-wider">
                  Lead Faculty Mentor / Principal Investigator (PI)
                </h4>
              </div>
              <span className="text-[11px] text-forest font-semibold">Verified Faculty Roster</span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-medium text-ink-muted uppercase">
                  Select Faculty Mentor:
                </label>
                <select
                  value={selectedMentorId}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                  className="mt-1 w-full border border-border bg-paper p-2 text-xs font-medium text-ink focus:border-navy focus:outline-none"
                >
                  {mentors.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border border-border bg-paper p-2.5 text-xs">
                <span className="font-semibold text-navy">{selectedMentor.name}</span>
                <p className="text-[11px] text-ink-muted">{selectedMentor.designation}</p>
                <p className="text-[11px] text-ink-muted">{selectedMentor.department}</p>
                <div className="mt-1 flex items-center justify-between text-[10px] text-ink-muted">
                  <span>Capacity: {selectedMentor.activeProjects}/{selectedMentor.maxCapacity} Projects</span>
                  <span className="font-mono text-forest font-medium">{selectedMentor.qualifications}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Hierarchy Tree Visualization */}
          <div className="border border-border bg-white p-4">
            <h4 className="text-xs font-semibold text-navy uppercase tracking-wider border-b border-border pb-2">
              Current Institutional Project Hierarchy
            </h4>
            <div className="mt-3 font-mono text-xs text-ink bg-paper p-3 border border-border/80">
              <div className="text-navy font-bold">
                Project {project.challengeRef.replace('JH-', '#')}
              </div>
              <div className="ml-4 border-l-2 border-border pl-3 pt-1">
                <div className="font-semibold text-turmeric-deep">
                  └── Mentor: {selectedMentor.name} ({selectedMentor.department})
                </div>
                <div className="ml-4 border-l-2 border-border pl-3 pt-1 space-y-1">
                  {teamMembers.map((st, i) => (
                    <div key={st.rollNo} className="text-ink">
                      {i === teamMembers.length - 1 ? '└──' : '├──'} {st.name} ({st.rollNo}) —{' '}
                      <span className="text-forest font-medium">{st.role}</span>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <div className="text-ink-muted italic">No students assigned yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Student Investigators Team List */}
          <div className="border border-border bg-white p-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-navy" />
                <h4 className="text-xs font-semibold text-navy uppercase tracking-wider">
                  Assigned Student Investigators ({teamMembers.length})
                </h4>
              </div>
              <span className="text-[11px] text-ink-muted">B.Tech / M.Tech Accredited</span>
            </div>

            <div className="mt-3 space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.rollNo}
                  className="flex items-center justify-between border border-border bg-paper px-3 py-2 text-xs"
                >
                  <div>
                    <span className="font-semibold text-navy">{member.name}</span>
                    <span className="mx-2 font-mono text-ink-muted">({member.rollNo})</span>
                    <span className="text-ink-muted">· {member.dept}</span>
                    <div className="text-[11px] font-medium text-forest">{member.role}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(member.rollNo)}
                    className="border border-border p-1 text-ink-muted hover:border-urgent hover:bg-urgent/10 hover:text-urgent"
                    title="Remove from team"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Student Sub-form */}
            <div className="mt-4 border-t border-border pt-3">
              <label className="text-[11px] font-semibold text-navy uppercase tracking-wider">
                Enroll Student Investigator:
              </label>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="border border-border bg-paper p-2 text-xs text-ink focus:border-navy focus:outline-none sm:col-span-2"
                >
                  <option value="">Select Eligible Student from Directory...</option>
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.rollNo}) — {st.department} [CGPA: {st.cgpa}]
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Role (e.g., IoT Firmware)"
                  value={newStudentRole}
                  onChange={(e) => setNewStudentRole(e.target.value)}
                  className="border border-border bg-paper p-2 text-xs text-ink focus:border-navy focus:outline-none"
                />
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleAddStudent}
                  disabled={!newStudentId}
                  className="flex items-center gap-1.5 border border-navy bg-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-navy-deep disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add to Project Team
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-paper px-6 py-3">
          <span className="text-xs text-ink-muted">
            All assigned students will be issued digital research credentials.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="border border-border bg-white px-3 py-1.5 text-xs text-ink hover:bg-paper"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 border border-turmeric-deep bg-turmeric px-4 py-1.5 text-xs font-bold text-ink uppercase tracking-wider hover:bg-turmeric-deep"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Save Team & Confirm Allocation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

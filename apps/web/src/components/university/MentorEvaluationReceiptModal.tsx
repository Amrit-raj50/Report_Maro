import React from 'react';
import { type EvaluationReceipt } from './mentorData.js';
import { triggerDossierPrint } from '../../utils/dossierExporter.js';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Award,
  RotateCcw,
} from 'lucide-react';

interface MentorEvaluationReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: EvaluationReceipt | null;
}

export const MentorEvaluationReceiptModal: React.FC<MentorEvaluationReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
}) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    triggerDossierPrint('mentor-evaluation-receipt-print-area');
  };

  const isApproved = receipt.decision === 'approved';

  const criteriaList = [
    {
      title: 'Technical Feasibility',
      description: 'System architecture, telemetry stability, sensor interface precision & edge latency',
      score: receipt.rubric.technicalFeasibility,
    },
    {
      title: 'Civic Impact / State Problem Solved',
      description: 'Real-world efficacy in remediating documented Jharkhand civic grievances',
      score: receipt.rubric.civicImpact,
    },
    {
      title: 'Code & Prototype Quality',
      description: 'Firmware modularity, test suite coverage, model quantization & documentation',
      score: receipt.rubric.codePrototypeQuality,
    },
    {
      title: 'Field Testing Data',
      description: 'Sample size adequacy, ground-truth assay rigor & CPCB calibration compliance',
      score: receipt.rubric.fieldTestingData,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl flex flex-col bg-white border-2 border-navy shadow-2xl text-ink">
        
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between border-b border-border bg-paper px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center bg-navy text-white text-xs font-bold">
              JH
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest">
                Formal Academic Evaluation Record
              </span>
              <h3 className="text-sm font-bold text-navy">
                Faculty Mentor Review Receipt #{receipt.receiptId}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 border border-navy bg-navy px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-navy-deep active:scale-95"
              title="Print or Save official PDF Receipt"
            >
              <Printer className="h-3.5 w-3.5 text-turmeric" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="border border-border bg-white p-1.5 text-ink-muted transition hover:bg-paper hover:text-ink"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh] bg-paper-light">
          <div
            id="mentor-evaluation-receipt-print-area"
            className="mx-auto bg-white border border-border p-6 sm:p-8 shadow-sm space-y-6"
          >
            {/* OFFICIAL RECEIPT HEADER */}
            <div className="border-b-2 border-navy pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 flex-col items-center justify-center border-2 border-navy bg-paper p-1 text-center">
                    <span className="text-[8px] font-black uppercase text-navy">GOVT OF</span>
                    <span className="font-display text-sm font-black text-navy leading-none my-0.5">JH</span>
                    <span className="text-[7px] font-bold text-forest">R&D EVAL</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-navy/70">
                      झारखंड सरकार · उच्च एवं तकनीकी शिक्षा विभाग
                    </div>
                    <h1 className="font-display text-base sm:text-lg font-bold text-navy uppercase">
                      Samadhan Setu · Formal Evaluation Receipt
                    </h1>
                    <div className="text-xs text-ink-muted">
                      {receipt.institutionName} · Institutional Innovation Cell
                    </div>
                  </div>
                </div>

                <div className="border border-navy/20 bg-paper p-2.5 text-right text-xs min-w-[180px]">
                  <div className="text-[9px] font-bold uppercase text-forest">
                    VERIFIED EVALUATION RECEIPT
                  </div>
                  <div className="font-mono text-xs font-bold text-navy mt-0.5">
                    {receipt.receiptId}
                  </div>
                  <div className="text-[10px] text-ink-muted mt-1">
                    Date: <strong>{receipt.evaluatedAt}</strong>
                  </div>
                  <div className="text-[10px] text-ink-muted">
                    Submission Ref: <strong>#{receipt.submissionNumber}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* PROJECT & CANDIDATE DOSSIER STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border bg-paper/50 p-3.5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                  Candidate & Role
                </span>
                <div className="font-bold text-navy text-sm mt-0.5">{receipt.studentName}</div>
                <div className="text-ink-muted">{receipt.studentRole}</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                  Project Title
                </span>
                <div className="font-bold text-navy text-sm mt-0.5">{receipt.projectTitle}</div>
                <div className="text-forest font-semibold">{receipt.deliverableTitle}</div>
              </div>
            </div>

            {/* SECTION: 4-TIER RUBRIC EVALUATION BREAKDOWN */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-navy flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-forest" />
                  <span>Structured 5-Point Peer Evaluation Rubric</span>
                </span>
                <span className="text-[10px] text-ink-muted">Standard State Evaluation Framework v2.4</span>
              </div>

              <div className="border border-border overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-paper text-[11px] font-bold text-navy">
                      <th className="p-2.5 border-r border-border">Evaluation Criterion</th>
                      <th className="p-2.5 border-r border-border">Assessment Scope</th>
                      <th className="p-2.5 border-r border-border text-center w-24">Rating (1-5)</th>
                      <th className="p-2.5 text-center w-28">Score Bar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {criteriaList.map((crit) => (
                      <tr key={crit.title} className="hover:bg-paper/30">
                        <td className="p-2.5 border-r border-border font-bold text-navy">
                          {crit.title}
                        </td>
                        <td className="p-2.5 border-r border-border text-ink-muted text-[11px]">
                          {crit.description}
                        </td>
                        <td className="p-2.5 border-r border-border text-center font-mono font-bold text-sm text-navy">
                          {crit.score} / 5
                        </td>
                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`h-2.5 w-2.5 rounded-full ${
                                  star <= crit.score ? 'bg-forest' : 'bg-border'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-navy bg-paper text-xs font-bold text-navy">
                      <td colSpan={2} className="p-2.5 border-r border-border text-right uppercase">
                        Cumulative Evaluation Score:
                      </td>
                      <td className="p-2.5 border-r border-border text-center font-mono text-base text-forest">
                        {receipt.rubric.totalScore} / 20
                      </td>
                      <td className="p-2.5 text-center font-mono text-navy font-bold">
                        {receipt.rubric.scorePercentage}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* PERFORMANCE SCORECARD & GRADE BADGE */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-2 border-navy bg-navy/5 p-4 gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Official Academic Assessment Band
                </div>
                <div className="text-base sm:text-lg font-bold text-navy mt-0.5">
                  {receipt.rubric.gradeBand}
                </div>
                <div className="text-xs text-ink-muted mt-0.5">
                  Based on 4-dimensional faculty evaluation criteria
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                    isApproved
                      ? 'bg-forest text-white border-forest'
                      : 'bg-urgent text-white border-urgent'
                  }`}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>APPROVED & SANCTIONED</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      <span>CHANGES MANDATED</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* PROFESSOR WRITTEN REMARKS */}
            <div className="border border-border bg-white p-4 space-y-1.5 text-xs">
              <span className="font-bold text-navy block uppercase text-[10px] tracking-wider">
                Official Faculty Feedback & Technical Appraisal:
              </span>
              <p className="text-ink leading-relaxed italic bg-paper p-3 border-l-4 border-navy">
                "{receipt.feedbackText}"
              </p>
            </div>

            {/* SIGNATURE & TAMPER-EVIDENT VALIDATION */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-mono text-[10px] text-ink-muted">
                  CRYPTOGRAPHIC CHECKSUM (SHA-256):
                </div>
                <div className="font-mono text-[10px] font-bold text-navy break-all max-w-sm">
                  {receipt.verificationHash}
                </div>
                <div className="text-[10px] text-forest font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>State Innovation Mission Verifiable Credential</span>
                </div>
              </div>

              <div className="border border-border p-3 text-center min-w-[200px] bg-paper/40">
                <div className="h-8 flex items-center justify-center font-display italic text-navy font-bold text-sm">
                  {receipt.evaluatorName}
                </div>
                <div className="border-t border-border pt-1">
                  <div className="font-bold text-navy text-[11px]">{receipt.evaluatorName}</div>
                  <div className="text-[10px] text-ink-muted">{receipt.evaluatorTitle}</div>
                  <div className="text-[9px] text-forest font-semibold">{receipt.evaluatorDept}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="border-t border-border bg-white px-4 py-3 flex items-center justify-between text-xs">
          <span className="text-ink-muted text-[11px]">
            Official evaluation receipt recorded in Jharkhand University Consortium database.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 border border-navy bg-navy px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-navy-deep transition"
            >
              <Printer className="h-3.5 w-3.5 text-turmeric" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="border border-border bg-paper hover:bg-paper-light px-3.5 py-1.5 text-ink font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

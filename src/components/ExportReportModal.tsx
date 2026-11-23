'use client';

import React from 'react';
import { MatchAnalysisResult, TargetWrestler } from '@/types/wrestling';
import { X, Printer, Copy, Check, FileText } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchData: MatchAnalysisResult;
  selectedTarget: TargetWrestler;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  matchData,
  selectedTarget,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const red = matchData.wrestlers.red;
  const green = matchData.wrestlers.green;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `
# 🤼 MatVision AI Coach Scouting Report
**Match:** ${matchData.title}
**Weight Class:** ${matchData.weightClass || 'N/A'} | **Date:** ${matchData.dateAnalyzed}
**Final Score:** ${red.name} ${matchData.finalScore.red} - ${matchData.finalScore.green} ${green.name}

---

## 📋 Overall Match Summary
${matchData.overallMatchSummary}

---

## ⏱️ Key Match Events
${matchData.events
  .map(
    (e) =>
      `- **[${Math.floor(e.timestamp / 60)}:${(e.timestamp % 60)
        .toString()
        .padStart(2, '0')}]** Period ${e.period}: ${e.moveName} (${
        e.wrestler.toUpperCase()
      }) -> Score: ${e.runningScore.red}-${e.runningScore.green}\n  *Note:* ${
        e.description
      }`
  )
  .join('\n')}

---

## 💡 Coaching Technique & Biomechanics
### ${red.name} (Grade: ${red.overallRating}/100)
- **Stance & Motion:** ${red.stanceAndPositioning.headPosition}
- **Neutral Offense:** ${red.neutralOffense.shotMechanicsFeedback}
- **Neutral Defense:** ${red.neutralDefense.sprawlReactionTime} (TD Def: ${red.neutralDefense.takedownDefensePercent}%)
- **Mat Control:** Riding time: ${Math.floor(matchData.ridingTime.redSeconds / 60)}m ${matchData.ridingTime.redSeconds % 60}s

### ${green.name} (Grade: ${green.overallRating}/100)
- **Stance & Motion:** ${green.stanceAndPositioning.headPosition}
- **Neutral Offense:** ${green.neutralOffense.shotMechanicsFeedback}
- **Neutral Defense:** ${green.neutralDefense.sprawlReactionTime} (TD Def: ${green.neutralDefense.takedownDefensePercent}%)
- **Mat Control:** Riding time: ${Math.floor(matchData.ridingTime.greenSeconds / 60)}m ${matchData.ridingTime.greenSeconds % 60}s

---

## 🏋️ Recommended Practice Drills
${red.drills
  .map(
    (d) =>
      `### ${d.name} (${d.targetSkill})\n- **Fixes Flaw:** ${d.targetedMistake}\n- **Prescription:** ${d.recommendedSets}\n- **Key Cue:** ${d.keyCoachingPoint}\n- **Instructions:** ${d.description}\n`
  )
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-extrabold text-white">
              Coach Scouting & Match Film Report
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy MD'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs leading-relaxed print:text-black print:bg-white">
          {/* Header */}
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              MATVISION FILM SCOUTING SHEET
            </span>
            <h1 className="text-xl font-black text-white mt-0.5">{matchData.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-slate-400">
              <span><strong>Weight:</strong> {matchData.weightClass || 'Collegiate'}</span>
              <span><strong>Date Analyzed:</strong> {matchData.dateAnalyzed}</span>
              <span>
                <strong>Result:</strong> {red.name} ({matchData.finalScore.red}) vs {green.name} ({matchData.finalScore.green})
              </span>
            </div>
          </div>

          {/* Overall Summary */}
          <div>
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-1">
              Overall Film Summary
            </h3>
            <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300">
              {matchData.overallMatchSummary}
            </p>
          </div>

          {/* Event Log */}
          <div>
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-2">
              Match Timeline & Scoring Log
            </h3>
            <div className="space-y-1.5">
              {matchData.events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-400 font-bold">
                      {Math.floor(ev.timestamp / 60)}:{(ev.timestamp % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-white">{ev.moveName}</span>
                    <span className="text-slate-400">- {ev.description}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-300">
                    {ev.runningScore.red} - {ev.runningScore.green}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Prescribed Drills */}
          <div>
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-2">
              Prescribed Practice Drills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {red.drills.map((d) => (
                <div key={d.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-white">{d.name}</h4>
                    <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-indigo-300">
                      {d.recommendedSets}
                    </span>
                  </div>
                  <p className="text-rose-400 text-[11px] mb-1">Fixes: {d.targetedMistake}</p>
                  <p className="text-slate-300 mb-2">{d.description}</p>
                  <p className="text-emerald-400 text-[11px] font-semibold">Coach Cue: {d.keyCoachingPoint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

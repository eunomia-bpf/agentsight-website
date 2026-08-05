import {
  contentPath,
  getPage as getSourcePage,
  getPages as getSourcePages,
  type ContentKind,
  type ContentPage,
} from './content';

export { contentPath };
export type { ContentKind, ContentPage };

const directReplacements: Array<[RegExp, string]> = [
  [/Export evidence that another engineer can inspect\./gi, 'Export a shareable run report.'],
  [/Review AI-generated pull requests with run evidence/gi, 'Review AI-generated pull requests with execution history'],
  [/Treat the trace as review evidence/gi, 'Use the trace during code review'],
  [/Each answer should point to recorded evidence\./gi, 'Each answer should point to a recorded command, path, process, or network event.'],
  [/Compare agents through a shared evidence model\./gi, 'Compare agents through the same process, file, and network views.'],
  [/Review evidence, not just alerts/gi, 'Review recorded activity, not just alerts'],
  [/requires evidence about/gi, 'requires details about'],
  [/agent-specific system evidence/gi, 'agent-specific system activity'],
  [/add evidence that normal instrumentation misses/gi, 'add local activity that normal instrumentation misses'],
  [/AgentSight evidence from the local agent process/gi, 'AgentSight activity from the local agent process'],
  [/System evidence fills a different gap/gi, 'Local system activity covers a different gap'],
  [/closed-source and system-effect evidence/gi, 'closed-source and system-activity visibility'],
  [/is a different kind of evidence/gi, 'is a different kind of runtime data'],
  [/Export only the evidence needed for review\./gi, 'Export only the run details needed for review.'],
  [/Each view projects the same session evidence differently\./gi, 'Each view groups the same recorded sessions differently.'],
  [/system evidence shows/gi, 'system activity shows'],
  [/Process and file evidence says/gi, 'Process and file activity shows'],
  [/System evidence does not replace application context/gi, 'System activity does not replace application context'],
  [/Raw traces are evidence stores/gi, 'Raw traces are data sources'],
  [/return to the original evidence/gi, 'return to the original trace'],
  [/Export evidence for code review\./gi, 'Export a run report for code review.'],
  [/This keeps the evidence easier to attribute/gi, 'This keeps the recorded activity easier to attribute'],
  [/Compare effects through one evidence model\./gi, 'Compare agents through the same process, file, and network views.'],
  [/Use evidence for debugging and review/gi, 'Use the run profile for debugging and review'],
  [/Export evidence for review\./gi, 'Export a run report for review.'],
  [/test and file evidence/gi, 'test and file activity'],
  [/run evidence/gi, 'execution history'],
  [/review evidence/gi, 'recorded activity'],
  [/system evidence/gi, 'system activity'],
  [/source evidence/gi, 'source data'],
  [/process and file evidence/gi, 'process and file activity'],
  [/recorded evidence/gi, 'recorded activity'],
  [/missing evidence/gi, 'missing data'],
  [/evidence gaps/gi, 'missing data'],
  [/evidence gap/gi, 'visibility gap'],
  [/evidence model/gi, 'process, file, and network views'],
  [/evidence stores/gi, 'data sources'],
  [/evidence workflow/gi, 'review workflow'],
  [/evidence artifact/gi, 'run report'],
  [/evidence boundary/gi, 'capture scope'],
  [/evidence about/gi, 'details about'],
  [/evidence that/gi, 'recorded data that'],
  [/evidence for/gi, 'run details for'],
  [/evidence from/gi, 'activity from'],
];

function rewriteText(text: string) {
  let result = text;
  for (const [pattern, replacement] of directReplacements) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/\bevidence\b/gi, (match) =>
    match[0] === match[0].toUpperCase() ? 'Recorded data' : 'recorded data',
  );
}

export function publicPage(page: ContentPage): ContentPage {
  return {
    ...page,
    title: rewriteText(page.title),
    description: rewriteText(page.description),
    eyebrow: rewriteText(page.eyebrow),
    lede: rewriteText(page.lede),
    outcomes: page.outcomes.map(rewriteText),
    sections: page.sections.map((section) => ({
      title: rewriteText(section.title),
      body: rewriteText(section.body),
    })),
    related: page.related.map((item) => ({ ...item, label: rewriteText(item.label) })),
  };
}

export function getPages(kind: ContentKind) {
  return getSourcePages(kind).map(publicPage);
}

export function getPage(kind: ContentKind, slug: string) {
  const page = getSourcePage(kind, slug);
  return page ? publicPage(page) : undefined;
}

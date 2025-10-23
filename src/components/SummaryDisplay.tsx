import { FileText, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SummaryDisplayProps {
  summary: string;
  fileName: string;
  onReset: () => void;
}

export const SummaryDisplay = ({ summary, fileName, onReset }: SummaryDisplayProps) => {
  const downloadSummary = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace('.pdf', '')}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card 
        className="p-6 rounded-2xl border-2"
        style={{ 
          boxShadow: 'var(--shadow-card)',
          background: 'var(--gradient-card)'
        }}
      >
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground">Original document</p>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div 
            className="p-2 rounded-lg shrink-0"
            style={{ background: 'var(--gradient-hero)' }}
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">AI Summary</h3>
            <p className="text-sm text-muted-foreground">Generated with advanced AI</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="text-foreground whitespace-pre-wrap leading-relaxed">
            {summary}
          </div>
        </div>
      </Card>

      <div className="flex gap-3 justify-center">
        <Button
          onClick={downloadSummary}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download Summary
        </Button>
        <Button
          onClick={onReset}
          size="lg"
          className="gap-2"
          style={{ background: 'var(--gradient-hero)' }}
        >
          <FileText className="w-4 h-4" />
          Summarize Another
        </Button>
      </div>
    </div>
  );
};

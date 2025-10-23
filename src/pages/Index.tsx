import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { PDFUploader } from '@/components/PDFUploader';
import { SummaryDisplay } from '@/components/SummaryDisplay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [summary, setSummary] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleTextExtracted = async (text: string, name: string) => {
    setIsGenerating(true);
    setFileName(name);

    try {
      const { data, error } = await supabase.functions.invoke('summarize-pdf', {
        body: { pdfText: text }
      });

      if (error) throw error;

      if (data?.summary) {
        setSummary(data.summary);
        toast({
          title: 'Summary generated!',
          description: 'Your PDF has been successfully summarized.',
        });
      }
    } catch (error: any) {
      console.error('Error generating summary:', error);
      toast({
        title: 'Error generating summary',
        description: error.message || 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSummary('');
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient background effects */}
      <div 
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'var(--gradient-hero)' }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: 'var(--gradient-hero)' }}
      />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
          </div>
          
          <h1 
            className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent animate-in slide-in-from-bottom duration-700"
            style={{ backgroundImage: 'var(--gradient-hero)' }}
          >
            AI PDF Summarizer
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform lengthy documents into clear, concise summaries in seconds with the power of AI
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <div 
                  className="absolute inset-0 blur-2xl opacity-50"
                  style={{ background: 'var(--gradient-hero)' }}
                />
                <Loader2 className="w-20 h-20 text-primary animate-spin relative" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">
                  Generating Summary...
                </h3>
                <p className="text-muted-foreground">
                  AI is analyzing your document and creating a summary
                </p>
              </div>
            </div>
          ) : summary ? (
            <SummaryDisplay 
              summary={summary} 
              fileName={fileName}
              onReset={handleReset}
            />
          ) : (
            <PDFUploader onTextExtracted={handleTextExtracted} />
          )}
        </div>

        {/* Features */}
        {!summary && !isGenerating && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Get summaries in seconds' },
              { icon: '🎯', title: 'Accurate', desc: 'Captures key points precisely' },
              { icon: '🔒', title: 'Secure', desc: 'Your documents stay private' },
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-center transition-all duration-300 hover:scale-105"
                style={{ boxShadow: 'var(--shadow-card)' }}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

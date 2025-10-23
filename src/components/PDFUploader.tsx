import { useCallback, useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PDFUploaderProps {
  onTextExtracted: (text: string, fileName: string) => void;
}

export const PDFUploader = ({ onTextExtracted }: PDFUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File) => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      if (!fullText.trim()) {
        throw new Error('No text found in PDF');
      }

      onTextExtracted(fullText, file.name);
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      toast({
        title: 'Error processing PDF',
        description: 'Failed to extract text from PDF. Please try another file.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFile = useCallback((file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a PDF smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    extractTextFromPDF(file);
  }, [toast, onTextExtracted]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed 
        transition-all duration-300 cursor-pointer
        ${isDragging 
          ? 'border-primary bg-primary/5 scale-105' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
        }
        ${isProcessing ? 'pointer-events-none opacity-60' : ''}
      `}
      style={{
        background: isDragging ? 'var(--gradient-card)' : undefined,
        boxShadow: isDragging ? 'var(--shadow-glow)' : 'var(--shadow-card)',
      }}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={onFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        {isProcessing ? (
          <>
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Processing PDF...
            </h3>
            <p className="text-muted-foreground">
              Extracting text from your document
            </p>
          </>
        ) : (
          <>
            <div className="relative mb-6">
              <div 
                className="absolute inset-0 blur-2xl opacity-50"
                style={{ background: 'var(--gradient-hero)' }}
              />
              <div className="relative rounded-full bg-gradient-to-br from-primary to-accent p-4">
                {isDragging ? (
                  <FileText className="w-12 h-12 text-primary-foreground" />
                ) : (
                  <Upload className="w-12 h-12 text-primary-foreground" />
                )}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {isDragging ? 'Drop your PDF here' : 'Upload PDF Document'}
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Drag and drop your PDF file here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Maximum file size: 10MB
            </p>
          </>
        )}
      </div>
    </div>
  );
};

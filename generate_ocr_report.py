import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "Technical Report: Document OCR & Multimodal Transformer Architecture")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 36, footer_text)
        self.drawString(54, 36, "Confidential - Academic & Project Evaluation Documentation")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 48, 558, 48)
        self.restoreState()

def generate_pdf(filename="OCR_Algorithm_and_Architecture_Report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    primary_color = colors.HexColor("#1E3A8A")   # Deep navy
    secondary_color = colors.HexColor("#0284C7") # Cerulean blue
    dark_neutral = colors.HexColor("#0F172A")    # Slate 900
    body_color = colors.HexColor("#334155")      # Slate 700
    bg_light = colors.HexColor("#F8FAFC")        # Off-white / light slate
    accent_green = colors.HexColor("#059669")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=secondary_color,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=secondary_color,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=body_color,
        spaceAfter=6
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=14,
        textColor=dark_neutral
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=body_color
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=dark_neutral
    )

    story = []

    # Title & Subtitle
    story.append(Paragraph("Document OCR & Layout Understanding Architecture", title_style))
    story.append(Paragraph("Technical Report on Deep Learning Methodology & Vision-Language Algorithms", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=12))

    # Executive Summary Box
    exec_text = (
        "<b>Executive Summary:</b> In this project, character and layout extraction is handled through a "
        "state-of-the-art <b>Multimodal Vision-Language Transformer (VLM)</b> architecture powered by Google's Gemini foundational models. "
        "Unlike legacy Optical Character Recognition (OCR) systems such as Tesseract, our approach bypasses fragmented, rule-based heuristics "
        "and implements an unified <b>End-to-End Sequence-to-Sequence (Seq2Seq)</b> network that performs character recognition, 2D spatial layout analysis, "
        "and semantic error-correction in a single forward pass."
    )
    exec_table = Table([[Paragraph(exec_text, callout_style)]], colWidths=[504])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(exec_table)
    story.append(Spacer(1, 10))

    # Section 1
    story.append(Paragraph("1. Technical Motivation: Modern VLM vs. Legacy OCR", h1_style))
    p1 = (
        "Traditional OCR engines (e.g., Tesseract 3/4, Abbyy) rely on cascaded pipelines: Image Binarization → Line/Character Segmentation → "
        "CNN Feature Extraction → LSTM/HMM decoding with Connectionist Temporal Classification (CTC) loss. "
        "This pipeline suffers from <b>compounding cascade errors</b>: if character segmentation fails due to noise, skewed orientation, or complex multi-column formatting, "
        "downstream recognition collapses. "
        "To achieve robust production performance across diverse resumes and job postings, we adopted a modern <b>Transformer-based Multimodal Model</b>."
    )
    story.append(Paragraph(p1, body_style))

    # Section 2: Pipeline
    story.append(Paragraph("2. Algorithmic Pipeline & Theoretical Foundations", h1_style))
    
    story.append(Paragraph("Phase A: Visual Tokenization via Vision Transformer (ViT)", h2_style))
    p_a = (
        "The input document page is treated as an image tensor <i>I</i>. Rather than scanning via sliding-window convolutions, "
        "the architecture partitions the document into uniform 2D spatial patches (e.g., 16×16 pixels). Each patch is linearly projected into "
        "a fixed-dimension embedding vector. To preserve reading hierarchy (headers, bullet points, multiple columns), "
        "learnable <b>2D Positional Encodings</b> are injected into the patch vectors."
    )
    story.append(Paragraph(p_a, body_style))

    story.append(Paragraph("Phase B: Spatial Modeling via Multi-Head Self-Attention", h2_style))
    p_b = (
        "The visual tokens pass through stacked Transformer Encoder blocks governed by the canonical <b>Scaled Dot-Product Attention</b>: "
        "<br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>Attention(Q, K, V) = softmax( (Q · K<sup>T</sup>) / √d<sub>k</sub> ) · V</b><br/>"
        "This mechanism computes global pairwise dependencies across every visual patch on the page simultaneously. "
        "Consequently, cross-column tables, sidebars, and nested headers maintain correct relative spatial context."
    )
    story.append(Paragraph(p_b, body_style))

    story.append(Paragraph("Phase C: Cross-Modal Alignment & Autoregressive Decoding", h2_style))
    p_c = (
        "The visual feature representations are integrated with query instructions through <b>Cross-Modal Attention</b> layers. "
        "The text decoder models token probabilities autoregressively: <b>P(y<sub>t</sub> | y<sub>&lt;t</sub>, Visual Tokens)</b>. "
        "Because the decoder contains pre-trained language semantics, it inherently resolves optical ambiguities "
        "(e.g., distinguishing between '0' and 'O', or deciphering low-contrast fonts) by evaluating linguistic likelihood."
    )
    story.append(Paragraph(p_c, body_style))

    # Section 3: Comparative Analysis Table
    story.append(Spacer(1, 4))
    story.append(Paragraph("3. Architectural Comparison Matrix", h1_style))
    
    col_widths = [110, 194, 200]
    table_data = [
        [
            Paragraph("Evaluation Metric", table_header_style),
            Paragraph("Legacy Pipeline (e.g., Tesseract)", table_header_style),
            Paragraph("Vision-Language Model (Gemini Architecture)", table_header_style)
        ],
        [
            Paragraph("Core Architecture", table_cell_bold),
            Paragraph("CNN Feature Extractor + BiLSTM + CTC Loss", table_cell_style),
            Paragraph("Vision Transformer (ViT) + Autoregressive Decoder", table_cell_style)
        ],
        [
            Paragraph("Pipeline Design", table_cell_bold),
            Paragraph("Cascaded multi-stage (segmentation → OCR → regex)", table_cell_style),
            Paragraph("End-to-End unified multimodal inference", table_cell_style)
        ],
        [
            Paragraph("Attention Mechanism", table_cell_bold),
            Paragraph("None or localized 1D temporal recurrent pooling", table_cell_style),
            Paragraph("Global Multi-Head Self-Attention & Cross-Attention", table_cell_style)
        ],
        [
            Paragraph("Layout & Table Parsing", table_cell_bold),
            Paragraph("Rigid bounding boxes, easily disrupted by multi-columns", table_cell_style),
            Paragraph("Learned 2D positional spatial awareness", table_cell_style)
        ],
        [
            Paragraph("Noise & Degradation", table_cell_bold),
            Paragraph("High error rates on smudged or stylized typography", table_cell_style),
            Paragraph("Linguistic context automatically corrects optical noise", table_cell_style)
        ],
        [
            Paragraph("Output Generation", table_cell_bold),
            Paragraph("Raw unstructured plain text strings", table_cell_style),
            Paragraph("Structured JSON / Markdown with semantic entity parsing", table_cell_style)
        ]
    ]

    comp_table = Table(table_data, colWidths=col_widths, repeatRows=1)
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 10))

    # Section 4: Academic Defense / Viva Guide
    story.append(Paragraph("4. Academic Defense Guide (Questions & Model Answers)", h1_style))

    q1 = "<b>Q1: Why was a Multimodal Transformer chosen instead of training a custom CNN+LSTM?</b><br/>" \
         "<i>Answer:</i> Classical CNN+LSTM pipelines with CTC loss are restricted to linear 1D text strips and completely lack " \
         "semantic awareness. Training an OCR model from scratch requires millions of synthetic annotated samples, yet still fails " \
         "on complex 2D document structures. Foundation Vision-Language Transformers generalize zero-shot to any layout, " \
         "handling font variance, tables, and document hierarchies with state-of-the-art accuracy."
    story.append(Paragraph(q1, body_style))
    story.append(Spacer(1, 4))

    q2 = "<b>Q2: How does the model preserve reading order and spatial structure?</b><br/>" \
         "<i>Answer:</i> The Vision Transformer integrates 2D sinusoidal or learned positional embeddings during the initial patch projection phase. " \
         "These spatial coordinate tokens allow the multi-head attention mechanism to map horizontal margins, vertical alignments, " \
         "and columnar divisions without requiring separate heuristic bounding-box segmenters."
    story.append(Paragraph(q2, body_style))
    story.append(Spacer(1, 4))

    # Direct presentation script box
    story.append(Paragraph("5. Recommended Presentation Script for Evaluator / Teacher", h1_style))
    script_content = (
        "<b>Verbal Presentation Script:</b><br/>"
        "<i>\"In our system, optical character recognition and document understanding are driven by an "
        "<b>End-to-End Multimodal Vision Transformer</b> powered by Google's Gemini deep neural architecture. "
        "Traditional OCR algorithms break down on complex resumes and job postings because they separate character detection "
        "from contextual comprehension. In our pipeline, the document image is divided into spatial patches via a Vision Transformer (ViT), "
        "processed through global self-attention to preserve layout geometry, and decoded via an autoregressive language model. "
        "This allows our application to not only extract text with high optical fidelity, but also structure information "
        "directly into clean, semantic schema in a single pass.\"</i>"
    )
    script_table = Table([[Paragraph(script_content, callout_style)]], colWidths=[504])
    script_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#93C5FD")),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(script_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {os.path.abspath(filename)}")

if __name__ == "__main__":
    generate_pdf()

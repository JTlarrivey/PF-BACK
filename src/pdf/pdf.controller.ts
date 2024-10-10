import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import PDFDocument from 'pdfkit';

@Controller('pdf')
export class PdfController {
  @Get('info')
  async generatePdfWithInfo(@Res() res: Response) {
    // Crea un nuevo documento PDF
    const doc = new PDFDocument();

    // Configura el encabezado de la respuesta para que se trate como un PDF
    res.setHeader('Content-disposition', 'inline; filename=document.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe el PDF a la respuesta
    doc.pipe(res);

    // Agrega una página al documento
    doc.addPage();

    // Establece el tamaño y la fuente del texto
    doc.fontSize(25).text('Título del Documento', { align: 'center' });

    // Salto de línea
    doc.moveDown();

    // Agrega un párrafo de texto
    doc.fontSize(12).text('Este es un párrafo de ejemplo en el PDF. Aquí irian los distintos contenidos del libro.', {
      align: 'left',
      width: 410,
    });

    // Finaliza el documento
    doc.end();
  }
}

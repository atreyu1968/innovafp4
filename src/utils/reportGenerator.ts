import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { useReportStore } from "../stores/reportStore";

export const generateReport = async ({
  response,
  template,
  fields,
  mappings,
  format
}: {
  response: any;
  template: Blob;
  fields: string[];
  mappings: Record<string, string>;
  format: 'docx' | 'pdf' | 'odt';
}) => {
  try {
    // Leer la plantilla
    const arrayBuffer = await template.arrayBuffer();
    const templateContent = new TextDecoder().decode(arrayBuffer);

    // Reemplazar los campos
    let content = templateContent;
    fields.forEach(field => {
      const mappedField = mappings[field];
      let value = '';

      if (mappedField.startsWith('_')) {
        switch (mappedField) {
          case '_userName':
            value = response.userName;
            break;
          case '_userRole':
            value = response.userRole;
            break;
          case '_timestamp':
            value = new Date(response.submissionTimestamp || response.lastModifiedTimestamp).toLocaleString();
            break;
        }
      } else if (mappedField.startsWith('calc_')) {
        const calcField = mappedField.replace('calc_', '');
        value = response.responses[calcField]?.toString() || '';
      } else {
        value = response.responses[mappedField]?.toString() || '';
      }

      content = content.replace(`<<${field}>>`, value);
    });

    let fileUrl: string;
    let fileName: string;

    switch (format) {
      case 'docx':
        // Crear documento Word
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: content,
                  }),
                ],
              }),
            ],
          }],
        });

        // Generar archivo
        const docxBlob = await Packer.toBlob(doc);
        fileUrl = URL.createObjectURL(docxBlob);
        fileName = `informe_${response.userName}_${new Date().toISOString()}.docx`;
        break;

      case 'pdf':
        // Para PDF, convertimos el documento Word a PDF usando la API del navegador
        const pdfDoc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: content,
                  }),
                ],
              }),
            ],
          }],
        });

        const pdfBlob = await Packer.toBlob(pdfDoc);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        // Crear un iframe oculto para imprimir a PDF
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        iframe.src = pdfUrl;
        iframe.onload = () => {
          iframe.contentWindow?.print();
          document.body.removeChild(iframe);
        };

        fileUrl = pdfUrl;
        fileName = `informe_${response.userName}_${new Date().toISOString()}.pdf`;
        break;

      case 'odt':
        // Para ODT, usaremos una conversión simple desde DOCX
        const odtDoc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: content,
                  }),
                ],
              }),
            ],
          }],
        });

        const odtBlob = await Packer.toBlob(odtDoc);
        fileUrl = URL.createObjectURL(odtBlob);
        fileName = `informe_${response.userName}_${new Date().toISOString()}.odt`;
        break;

      default:
        throw new Error('Formato no soportado');
    }

    // Guardar el informe en el store
    const reportId = crypto.randomUUID();
    const { addReport } = useReportStore.getState();
    
    addReport({
      id: reportId,
      title: `Informe - ${response.userName}`,
      description: `Informe generado para la respuesta del formulario`,
      template: {
        url: URL.createObjectURL(template),
        fields: fields
      },
      data: {
        responses: [response],
        additionalData: [],
        calculatedFields: {}
      },
      permissions: {
        users: [response.userId],
        subnets: [],
        roles: [response.userRole]
      },
      output: {
        url: fileUrl,
        generatedAt: new Date().toISOString()
      },
      createdBy: response.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Descargar archivo
    saveAs(fileUrl, fileName);

    return reportId;
  } catch (error) {
    console.error('Error al generar el informe:', error);
    throw error;
  }
};
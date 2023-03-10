import imageToBase64 from "image-to-base64";
import PdfPrinter from "pdfmake";

export const getPDFReadableStream = async (media) => {
    const fonts = {
        Helvetica: {
            normal: "Helvetica",
            bold: "Helvetica-Bold",
            italics: "Helvetica-Oblique",
            bolditalics: "Helvetica-BoldOblique",
        },
    }

    const printer = new PdfPrinter(fonts)

    const coverBase64 = await imageToBase64(media.poster);

    const docDefinition = {
        content: [
            {
                image: `data:image/jpeg;base64,${coverBase64}`,
                width: 500,
                margin: [0, 20]
            },
            {
                text: media.title,
                style: 'header'
            },
            {
                text: media.imdbID,
                margin: [0, 20]
            },
            {
                text: media.year
            },
            {
                text: media.type
            }
        ],
        defaultStyle: {
            font: "Helvetica"
        },
        styles: {
            header: {
                fontSize: 18,
                bold: true
            }
        }
    }

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition)
    pdfReadableStream.end()
    return pdfReadableStream
}
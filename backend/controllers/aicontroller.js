const { GoogleGenAI } = require("@google/genai");
const Invoice = require("../models/Invoice");


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const parseInvoiceFromText = async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Please provide text" });
    }

    try {
        const prompt = `
You are an expert invoice extraction AI.

Extract structured data from this text and return ONLY valid JSON.

Format:
{
    "clientName": "string",
    "email": "string",
    "address": "string",
    "items": [
        {
            "name": "string",
            "quantity": number,
            "unitPrice": number
        }
    ]
}

Text:
${text}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let responseText = response.text;


        const cleanedJson = responseText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedData = JSON.parse(cleanedJson);

        res.status(200).json(parsedData);

    } catch (err) {
        console.error("Error in parsing invoice with AI", err);
        res.status(500).json({ message: "Server error" });
    }
};

const generateRemainderEmail = async (req, res) => {
    const { clientName, amount } = req.body;

    try {
        const prompt = `
Write a professional payment reminder email.

Client: ${clientName}
Amount Due: ₹${amount}

Keep it polite and professional.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        res.status(200).json({ email: response.text });

    } catch (err) {
        console.error("Error in generating email with AI", err);
        res.status(500).json({ message: "Server error" });
    }
};


const getDashboardSummary = async (req, res) => {
    try {
        const invoices = await Invoice.find();

        const totalInvoices = invoices.length;
        const totalAmount = invoices.reduce(
            (acc, inv) =>
                acc +
                inv.items.reduce(
                    (sum, item) => sum + item.quantity * item.unitPrice,
                    0
                ),
            0
        );

        res.status(200).json({
            totalInvoices,
            totalAmount
        });

    } catch (err) {
        console.error("Error in summary", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    parseInvoiceFromText,
    generateRemainderEmail,
    getDashboardSummary
};


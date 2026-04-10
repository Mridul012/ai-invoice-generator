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
    const {invoiceId} = req.body;

    if(!invoiceId){
        return res.status(400).json({message:"Please provide invoice ID"});
    }

    try{
      const invoice= await Invoice.findById(invoiceId);
      if(!invoice){
        return res.status(404).json({message:"Invoice not found"});
       }

       const prompt = `
You are an expert email writer. Write a polite and professional reminder email to the client for the following invoice details:
Client Name: ${invoice.billTo?.clientName || 'Client'}
Due Date: ${invoice.duedate ? new Date(invoice.duedate).toDateString() : 'N/A'}
Amount Due: ₹${(invoice.total || 0).toFixed(2)}
Invoice Number: ${invoice.invoiceNumber}

the tone should be polite and professional, reminding the client of the due date and amount, and requesting them to make the payment at their earliest convenience.
       
       `
       const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });

        res.status(200).json({ email: response.text });

    }
    catch (err) {
      console.error("Error in generating email with AI", err);
      res.status(500).json({ message: "Server error" });
  }
    
} 



const getDashboardSummary = async (req, res) => {
    try {
      const invoices = await Invoice.find({ user: req.user._id });

      if(invoices.length === 0){
        return res.status(200).json({insights:["no inovice to generate summary"]});
      }

      const totalInvoices = invoices.length;
      const paidArr = invoices.filter(invoice => invoice.status === "Paid");
      const unpaidArr = invoices.filter(invoice => invoice.status === "Unpaid");
      const paidInvoices = paidArr.length;
      const unpaidInvoices = unpaidArr.length;
      const totalAmount = paidArr.reduce((sum, invoice) => sum + (invoice.total || 0), 0);
      const totalOutstanding = unpaidArr.reduce((sum, invoice) => sum + (invoice.total || 0), 0);

      const dataSummary = `
Total Invoices: ${totalInvoices}
Paid Invoices: ${paidInvoices}
Unpaid Invoices: ${unpaidInvoices}
Total Amount Received: ₹${totalAmount.toFixed(2)}
Total Outstanding Amount: ₹${totalOutstanding.toFixed(2)}

      `
      const prompt = `
You are an expert business analyst. Based on the following invoice data summary, provide 3 key insights that can help the user understand their business performance and identify areas for improvement.
Return your response as a JSON array of insights, each insight should be a concise statement that provides actionable advice or highlights trends in the data, with a single 
key insights which is an array of strings.
Example response format:
{
  "insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3"
  ]
}
${dataSummary}
      `
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    const responseText = response.text
    const cleanedJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData = JSON.parse(cleanedJson);


        res.status(200).json(parsedData);
    }
    

    catch (err) {
        console.error("Error in summary", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    parseInvoiceFromText,
    generateRemainderEmail,
    getDashboardSummary
};


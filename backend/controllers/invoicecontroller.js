const Invoice = require("../models/Invoice");


exports.createInvoice = async (req, res) => {
    try {
        const user = req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billTo,
            billFrom,
            items,
            notes,
            paymentTerms,
        } = req.body;

        let subtotal = 0;
        let taxtotal = 0;
        items.forEach((item) => {
            subtotal = item.unitPrice * item.quantity;
            taxtotal = ((item.unitPrice * item.quantity))*((item.taxpercent || 0) / 100);
        });

        const total = subtotal + taxtotal;

        const invoice = new Invoice({
            user,
            invoiceNumber,
            invoiceDate,
            dueDate,
            billTo,
            billFrom,
            items,
            notes,
            paymentTerms,
            subtotal,
            taxtotal,
            total});
        
        await invoice.save();
        res.status(201).json(invoice);





    } catch (err) {
        console.error("Error creating invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("user", "name email");
        res.json(invoices);


    } catch (err) {
        console.error("Error getting invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("user", "name email");
        if (invoice) {
            res.json(invoice);
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }

    } catch (err) {
        console.error("Error getting invoice", err);
        res.status(500).json({ message: "Server error" });
    }
} 

exports.updateInvoice = async (req, res) => {
    try {
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billTo,
            billFrom,
            items,
            notes,
            paymentTerms,
            status
        } = req.body

        let subtotal = 0;
        let taxtotal = 0;
        items.forEach((item) => {
            subtotal = item.unitPrice * item.quantity;
            taxtotal = ((item.unitPrice * item.quantity))*((item.taxpercent || 0) / 100);
        });

        const total = subtotal + taxtotal;

        const updateInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                invoiceNumber,
                invoiceDate,
                dueDate,
                billTo,
                billFrom,
                items,
                notes,
                paymentTerms,
                status,
                subtotal,
                taxtotal,
                total
            },
            { new: true }
        );

        if(!updateInvoice){
            return res.status(404).json({message:"Invoice not found"});
        }


    } catch (err) {
        console.error("Error updating invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.deleteInvoice = async (req, res) => {
    try {
         const invoice = await Invoice.findByIdAndDelete(req.params.id);
         if(!invoice){
            return res.status(404).json({message:"Invoice not found"});
         }
         res.json({message:"Invoice deleted successfully"});

    } catch (err) {
        console.error("Error deleting invoice", err);
        res.status(500).json({ message: "Server error" });
    }
}
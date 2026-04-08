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
        let taxTotal = 0;
        items.forEach((item) => {
            const itemTotal = item.unitPrice * item.quantity;
            subtotal += itemTotal;
            taxTotal += itemTotal * ((item.taxpercent || 0) / 100);
        });

        const total = subtotal + taxTotal;

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
            taxTotal,
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
        const invoices = await Invoice.find({ user: req.user._id }).populate("user", "name email");
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
        } = req.body;

        const updateData = { status };

        // recalculate totals only if items are provided
        if (items && items.length > 0) {
            let subtotal = 0;
            let taxTotal = 0;
            items.forEach((item) => {
                const itemTotal = item.unitPrice * item.quantity;
                subtotal += itemTotal;
                taxTotal += itemTotal * ((item.taxpercent || 0) / 100);
            });
            const total = subtotal + taxTotal;

            Object.assign(updateData, {
                invoiceNumber, invoiceDate, dueDate, billTo, billFrom,
                items, notes, paymentTerms, subtotal, taxTotal, total
            });
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.json(updatedInvoice);

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
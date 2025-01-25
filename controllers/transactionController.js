// Admin Review Purchase Transaction
// const adminReviewPurchase = async (req, res) => {
//     const { transactionId } = req.params;
//     const { status, adminNote } = req.body;
  
//     // Validate the input status
//     if (!status || !['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status, must be "approved" or "rejected"' });
//     }
  
//     try {
//       // Find the transaction and check if the user is an admin
//       const transaction = await PurchaseTransaction.findById(transactionId);
  
//       if (!transaction) {
//         return res.status(404).json({ message: 'Transaction not found' });
//       }
  
//       // Update the transaction status and optionally add admin's note
//       transaction.status = status;
//       transaction.adminNote = adminNote || '';
  
//       await transaction.save();
  
//       res.json({
//         message: 'Transaction reviewed',
//         status: transaction.status,
//         adminNote: transaction.adminNote,
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Error reviewing purchase transaction' });
//     }
//   };
  
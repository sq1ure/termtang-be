// วิธี เจน qr code promptpay มียอดเงิน API:  https://www.youtube.com/watch?v=psBmEOIGF6c&pp=ygUeI3Fy4Lie4Lij4LmJ4Lit4Lih4LmA4Lie4Lii4LmM

const QRCode = require('qrcode');
const generatePayload = require("promptpay-qr");
const _ = require("lodash");
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const TopUp = require('../models/TopUp');
const PurchaseTransaction = require('../models/PurchaseTransaction');

const exportModule = {};

exportModule.generateQRCode = async (req, res) => {
    try {
        const amount = parseFloat(req.body.amount) || 0;
        let resStatus = 200;
        let resData = {};
        if (!amount) {
            return res.status(500).json({
                code: 500,
                message: 'Missing amount value'
            });
        }
        const mobileNumber = "0960030344";
        const payload = generatePayload(mobileNumber, { amount });
        const option = {
            color: {
                dark: '#000',
                light: '#fff'
            }
        };
        QRCode.toDataURL(payload, option, (err, url) => {
            if (err) {
                console.log('Generate fail', err);
                resStatus = 400;
                resData = {
                    code: 400,
                    message: 'Cannot Generate QR code'
                };
            } else {
                resData = {
                    code: 200,
                    message: 'Good!',
                    result: url
                };
            }
            return res.status(resStatus).json(resData)
        })

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exportModule.generateReceipt = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const thaiFontRegular = path.join('./fonts', 'NotoSansThai-Regular.ttf');
        const thaiFontBold = path.join('./fonts', 'NotoSansThai-Bold.ttf');
        const fileName = `${transactionId}-receipt.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);


        const doc = new PDFDocument();

        doc.pipe(res);

        doc.font(thaiFontBold).fontSize(20).text('ใบเสร็จรับเงิน / Receipt', { align: 'center' });

        doc.moveDown(0.5);

        doc.font(thaiFontRegular)
            .fontSize(12)
            .text(
                'บริษัท xxxx จำกัด\nxxxxxxxxxx\nเลขประจำตัวผู้เสียภาษี: xxx-xxx-xxxx-xxxx',
                { align: 'center' }
            );

        doc.moveDown(1);
        doc.font(thaiFontBold).text('วันที่ทำรายการ: ', { continued: true, align: 'center' });
        doc.font(thaiFontRegular).text('01/11/2024', { align: 'right' });
        doc.font(thaiFontBold).text('เลขที่รายการ: ', { continued: true, align: 'center' });
        doc.font(thaiFontRegular).text('2411011230', { align: 'right' });
        doc.font(thaiFontBold).text('ชื่อ: ', { continued: true });
        doc.font(thaiFontRegular).text('jittee.su@gmail.com');
        doc.font(thaiFontBold).text('รหัสผู้ใช้งาน (UID): ', { continued: true });
        doc.font(thaiFontRegular).text('XSQ5VWEKOS');



        doc.moveDown(1);
        doc.font(thaiFontBold).text('รายการ: ', { continued: true, });
        doc.font(thaiFontRegular).text('PUBG Mobile (Thai)', { align: 'right' });
        doc.font(thaiFontBold).text('แพ็กเกจ: ', { continued: true });
        doc.font(thaiFontRegular).text('60 UC', { align: 'right' });
        doc.font(thaiFontBold).text('ราคาทั้งหมด: ', { continued: true });
        doc.font(thaiFontRegular).text('33 บาท', { align: 'right' });
        doc.moveDown(1.5);
        doc.font(thaiFontBold).text('**********************************', { align: 'center' });
        doc.moveDown(1.5);
        doc.font(thaiFontBold).text('วันที่ชำระ: ', { continued: true });
        doc.font(thaiFontRegular).text('01/11/2024', { align: 'right' });
        doc.font(thaiFontBold).text('สำหรับ: ', { continued: true });
        doc.font(thaiFontRegular).text('01/11/2024', { align: 'right' });
        doc.font(thaiFontBold).text('รหัสแอคเค้าท์: ', { continued: true });
        doc.font(thaiFontRegular).text('01/11/2024', { align: 'right' });
        doc.font(thaiFontBold).text('ชื่อตัวละตร: ', { continued: true });
        doc.font(thaiFontRegular).text('01/11/2024', { align: 'right' });

        doc.moveDown(1);
        doc.font(thaiFontRegular).fontSize(10).text('ขอบคุณที่ใช้บริการของเรา!', { align: 'center' });


        doc.end();
    } catch (err) {
        console.error('Error generating the PDF:', err);
        res.status(500).send('Error generating the receipt.');
    }
};

exportModule.topUpAccount = async (req, res) => {
    const { amount, paymentMethod, cardId, gameId } = req.body;
    const userId = req.user.id;  // Assume user is authenticated and user ID is in the request

    try {
        const newTopUp = new PurchaseTransaction({
            userId,
            amount,
            paymentMethod,
            cardId,
            gameId,
            status: 'pending',  // Initially, the status will be pending
        });

        await newTopUp.save();

        res.status(201).json({
            message: 'Top-up initiated successfully. Awaiting admin confirmation.',
            transactionId: newTopUp._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error initiating top-up' });
    }
};

exportModule.getTopUpHistory = async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user.id;  // Assume user is authenticated and user ID is in the request

    try {
        const filter = { userId };
        if (status) {
            filter.status = status;
        }

        const topUps = await PurchaseTransaction.find(filter)
            .skip((page - 1) * limit)  // Pagination (skip records)
            .limit(limit)  // Limit the number of records per page
            .sort({ transactionDate: -1 });  // Sort by transaction date

        res.json({
            topups: topUps.map(topUp => ({
                amount: topUp.amount,
                paymentMethod: topUp.paymentMethod,
                status: topUp.status,
                transactionDate: topUp.transactionDate,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching top-up history' });
    }
};

exportModule.getTopUpDetails = async (req, res) => {
    const { topUpId } = req.params;
    const userId = req.user.id;  // Assume user is authenticated and user ID is in the request

    try {
        const topUp = await PurchaseTransaction.findOne({ _id: topUpId, userId });

        if (!topUp) {
            return res.status(404).json({ message: 'Top-up transaction not found' });
        }

        res.json({
            topup: {
                amount: topUp.amount,
                paymentMethod: topUp.paymentMethod,
                paymentReceipt: topUp.paymentReceipt,
                status: topUp.status,
                transactionDate: topUp.transactionDate,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching top-up details' });
    }
};



const upload = multer({
    dest: '/tmp', // Vercel-safe temporary storage
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

exportModule.sendProofOfPayment = [
    upload.single('file'), // make sure your frontend sends `file` as the field name
    async (req, res) => {
        const { topUpId } = req.params;
        const userId = req.user.id;

        try {
            const topUp = await TopUp.findOne({ _id: topUpId, userId });

            if (!topUp || topUp.status !== 'pending') {
                return res.status(404).json({ message: 'Top-up transaction not found or not in pending status' });
            }

            const proofUrl = `/tmp/${req.file.filename}`;
            topUp.paymentReceipt = proofUrl; // just for demo — store a real link in real use
            topUp.status = 'pending';

            await topUp.save();

            res.json({ message: 'Proof of payment submitted successfully.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error submitting proof of payment' });
        }
    }
];



module.exports = exportModule;
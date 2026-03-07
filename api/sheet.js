// Replace this URL with your LUMI Atelier Google Apps Script Web App URL
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxDYm6QuSJCn4o--2PxwkXLBJ8jj_Oz-2jzCjRpQFZ2Q_E_xoz5q0f7TyYlwk743Ggq/exec';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch(SHEET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body),
        });
        const text = await response.text();
        console.log('Sheet status:', response.status, 'body:', text.slice(0, 300));
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('Sheet error:', err);
        return res.status(500).json({ error: 'Failed to log to sheet' });
    }
}

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Database for Resin Codes & Sustainability Logic
const RESIN_DB = {
  '1': { name: 'PETE', instructions: 'High Value. Rinse and recycle in Blue Bin.', carbon: 15 },
  '2': { name: 'HDPE', instructions: 'Milk jugs/detergent. Rinse and recycle.', carbon: 12 },
  '3': { name: 'PVC', instructions: 'Not typically recycled curbside. Check local center.', carbon: 5 },
  '4': { name: 'LDPE', instructions: 'Grocery bags. Return to store collection point.', carbon: 8 },
  '5': { name: 'PP', instructions: 'Yogurt cups. Rinse and recycle in Blue Bin.', carbon: 10 },
  '6': { name: 'PS', instructions: 'Styrofoam. Usually landfill. Avoid in future.', carbon: 2 },
  '7': { name: 'Other', instructions: 'Mixed plastics. Check for "Compostable" label.', carbon: 4 }
};

let totalCarbonSaved = 0;

app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const { category } = req.body;
    let resinInfo = { code: "None", name: "N/A", instructions: "Place in bin.", carbon: 10 };

    if (category === 'Plastic' && req.file) {
      // Precise OCR to find Resin Codes 1-7
      const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');
      const match = text.match(/[1-7]/);
      
      if (match && RESIN_DB[match[0]]) {
        resinInfo = { ...RESIN_DB[match[0]], code: match[0] };
      } else {
        resinInfo.instructions = "Wash before putting in the Blue Bin.";
      }
    } else if (category === 'Paper') {
        resinInfo.instructions = "Flatten and ensure it is dry and unsoiled.";
    } else if (category === 'Metal') {
        resinInfo.instructions = "Rinse thoroughly; remove sharp lids.";
    } else if (category === 'Glass') {
        resinInfo.instructions = "Handle with care; place in Glass Bin.";
    }

    totalCarbonSaved += resinInfo.carbon;

    res.json({
      category,
      resinCode: resinInfo.code,
      instructions: resinInfo.instructions,
      carbonTotal: totalCarbonSaved
    });
  } catch (err) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

app.listen(8000, () => console.log('Backend live on Port 8000'));
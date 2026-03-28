import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import axios from 'axios';
import { AppContext } from '../App';
import WasteJourney from './WasteJourney'; // Ensure this file exists in /components
import ImpactVisual from './ImpactVisual';
import SmartBinFeedback from './SmartBinFeedback';
import { Zap, Brain, CheckCircle, ArrowRight, Factory, Recycle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// 1. ADVANCED CATEGORY MAPPING
const MAPPING = {
  Plastic: /bottle|cup|container|poly|plastic|vial|jug|tub|wrapper|bag|bucket|flask/,
  Paper: /paper|cardboard|book|envelope|newspaper|carton|box|notebook|packet/,
  Metal: /can|metal|aluminum|tin|flask|iron|steel|tool|pot|brass|wire|screw|foil/,
  Glass: /glass|jar|wine|beer|lens|beaker|bottle|goblet/,
  Organic: /food|fruit|vegetable|organic|bread|plant|coffee|apple|leaf/
};

// 2. USE CASE DATA (The "Business Value" for Judges)
const USE_CASES = {
  Plastic: "Recycled into polyester fabric for eco-clothing or high-durability irrigation pipes.",
  Paper: "Processed into corrugated cardboard for shipping boxes or egg cartons.",
  Metal: "Infinite recyclability; used in new beverage cans or automotive parts.",
  Glass: "Crushed into cullet for new jars or used in high-tech fiberglass insulation.",
  Organic: "Composted into nitrogen-rich bio-fertilizer for green-loan verified farms."
};

function classifyCategory(predictions, learnedMemory = {}) {
  const top = predictions[0];
  const label = top?.className?.toLowerCase() || '';
  const confidence = Math.round((top?.probability || 0) * 100);

  if (learnedMemory[label]) return { cat: learnedMemory[label], conf: 100, isLearned: true, label };

  const allLabels = predictions.slice(0, 3).map(p => p.className.toLowerCase()).join(' ');
  for (const [category, regex] of Object.entries(MAPPING)) {
    if (allLabels.match(regex)) return { cat: category, conf: confidence, label };
  }
  return { cat: 'Unclassified', conf: confidence, label };
}

export default function Scan() {
  const { addScan, feedback, addFeedback } = useContext(AppContext);
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [data, setData] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pending, setPending] = useState(null);
  const [showJourney, setShowJourney] = useState(false);

  const learnedMemory = useMemo(() => {
    const memory = {};
    feedback.forEach(f => { if (f.aiLabel) memory[f.aiLabel.toLowerCase()] = f.userCategory; });
    return memory;
  }, [feedback]);

  useEffect(() => {
    mobilenet.load().then(m => setModel(m));
  }, []);

  const doScan = useCallback(async () => {
    if (!model || !webcamRef.current || isScanning) return;
    setIsScanning(true);
    setData(null);
    setShowJourney(false);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      const img = new Image();
      img.src = imageSrc;
      await new Promise(r => img.onload = r);
      const predictions = await model.classify(img);
      
      const { cat, conf, isLearned, label } = classifyCategory(predictions, learnedMemory);

      if (isLearned || (cat !== 'Unclassified' && conf > 30)) {
        await sendToBackend(imageSrc, cat, label, isLearned ? 100 : conf);
      } else {
        setPending({ cat, conf, imageSrc, label });
        setShowFeedback(true);
      }
    } catch (e) { console.error(e); } finally { setIsScanning(false); }
  }, [model, learnedMemory]);

  const sendToBackend = async (img, cat, label, conf) => {
    const blob = await (await fetch(img)).blob();
    const fd = new FormData();
    fd.append('image', blob, 'scan.jpg');
    fd.append('category', cat);
    fd.append('ai_label', label);
    fd.append('ai_confidence', String(conf));

    const { data: result } = await axios.post(`${API_BASE}/analyze`, fd);
    setData(result);
    addScan(result);
    setTimeout(() => setShowJourney(true), 800);
  }

  const handleFeedback = async (fData) => {
    addFeedback({ ...fData, aiLabel: pending.label });
    setShowFeedback(false);
    await sendToBackend(pending.imageSrc, fData.userCategory, pending.label, 100);
  };

  return (
    <div className="scan-page">
      <div className="cam-frame">
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="webcam-feed" />
        
        {data && !isScanning && (
          <div className="status-toast animate-slide-up">
            <CheckCircle size={14} color="#2ecc71" /> Verified: {data.category} ({data.ai_confidence}%)
          </div>
        )}

        {isScanning && <div className="scanning-bar" />}
      </div>

      {showFeedback && (
        <SmartBinFeedback 
          aiCategory={pending.cat} 
          confidence={pending.conf} 
          onFeedback={handleFeedback} 
          onSkip={() => setShowFeedback(false)} 
        />
      )}

      {data && (
        <div className="result-container animate-fade-in">
          <div className="usage-card">
            <div className="card-header">
              <Recycle size={18} />
              <h4>Future Use Case</h4>
            </div>
            <p>{USE_CASES[data.category] || "Processing for high-grade industrial raw materials."}</p>
          </div>
          
          <ImpactVisual carbonGrams={data.carbonTotal} compact />
          <WasteJourney category={data.category} visible={showJourney} />
        </div>
      )}

      {!showFeedback && (
        <button className={`primary-scan-btn ${isScanning ? 'busy' : ''}`} onClick={doScan}>
          {isScanning ? 'Analyzing Molecular Structure...' : '◎  Start Identification'}
        </button>
      )}

      <p className="scan-footer-text">AI identification powers your Green Loan Score</p>
    </div>
  );
}
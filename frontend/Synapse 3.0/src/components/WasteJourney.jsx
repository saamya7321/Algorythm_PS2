import React, { useState, useEffect } from 'react';

const JOURNEYS = {
  Plastic: [
    { icon: '🚛', label: 'Collection',    desc: 'Picked up by recycling truck',         color: '#3b82f6' },
    { icon: '🏭', label: 'Sorting',       desc: 'Separated by material type & color',   color: '#8b5cf6' },
    { icon: '✂️', label: 'Shredding',     desc: 'Broken into small plastic flakes',     color: '#f59e0b' },
    { icon: '🔥', label: 'Melting',       desc: 'Flakes melted into pellets',           color: '#ef4444' },
    { icon: '✨', label: 'New Product',   desc: 'Reborn as a bottle, fabric, or toy',   color: '#10b981' },
  ],
  Paper: [
    { icon: '🚛', label: 'Collection',    desc: 'Collected from kerbside bins',         color: '#3b82f6' },
    { icon: '💧', label: 'Pulping',       desc: 'Mixed with water into pulp slurry',    color: '#06b6d4' },
    { icon: '🧹', label: 'Cleaning',      desc: 'Ink and contaminants removed',         color: '#8b5cf6' },
    { icon: '📄', label: 'Pressing',      desc: 'Dried and rolled into sheets',         color: '#f59e0b' },
    { icon: '✨', label: 'New Paper',     desc: 'Becomes newspapers, cardboard, tissue',color: '#10b981' },
  ],
  Metal: [
    { icon: '🚛', label: 'Collection',    desc: 'Collected and weighed at depot',       color: '#3b82f6' },
    { icon: '🧲', label: 'Separation',    desc: 'Magnets separate steel from aluminium',color: '#8b5cf6' },
    { icon: '🗜️', label: 'Shredding',    desc: 'Crushed into small fragments',         color: '#f59e0b' },
    { icon: '🔥', label: 'Smelting',      desc: 'Melted at 660°C in a furnace',        color: '#ef4444' },
    { icon: '✨', label: 'New Metal',     desc: 'Cast into cans, car parts, bikes',     color: '#10b981' },
  ],
  Glass: [
    { icon: '🚛', label: 'Collection',    desc: 'Collected in colour-sorted bins',      color: '#3b82f6' },
    { icon: '🔨', label: 'Crushing',      desc: 'Crushed into "cullet" fragments',      color: '#8b5cf6' },
    { icon: '🧹', label: 'Cleaning',      desc: 'Contaminants and labels removed',      color: '#f59e0b' },
    { icon: '🔥', label: 'Melting',       desc: 'Melted at 1,500°C with raw materials', color: '#ef4444' },
    { icon: '✨', label: 'New Glass',     desc: 'Blown into bottles, jars, fibre',      color: '#10b981' },
  ],
  Organic: [
    { icon: '🚛', label: 'Collection',    desc: 'Collected in food waste bin',          color: '#3b82f6' },
    { icon: '🦠', label: 'Processing',    desc: 'Microbes break down the material',     color: '#8b5cf6' },
    { icon: '♻️', label: 'Composting',   desc: 'Turned into rich humus compost',       color: '#f59e0b' },
    { icon: '🌾', label: 'Soil Health',   desc: 'Enriches farmland and gardens',        color: '#10b981' },
    { icon: '✨', label: 'New Growth',    desc: 'Grows the food you eat tomorrow',      color: '#22c55e' },
  ],
  Unclassified: [
    { icon: '🚛', label: 'Collection',    desc: 'General waste collection',             color: '#6b7280' },
    { icon: '🏭', label: 'Sorting',       desc: 'Manual and automated separation',      color: '#6b7280' },
    { icon: '⚡', label: 'Energy',        desc: 'Incinerated for electricity (WtE)',    color: '#f59e0b' },
    { icon: '🌿', label: 'Residue',       desc: 'Ash processed or landfilled',          color: '#6b7280' },
    { icon: '💡', label: 'End Result',    desc: 'Powers ~1 home for 30 minutes',        color: '#10b981' },
  ],
};

export default function WasteJourney({ category, visible }) {
  const [activeStep, setActiveStep] = useState(-1);
  const steps = JOURNEYS[category] || JOURNEYS['Unclassified'];

  useEffect(() => {
    if (!visible) { setActiveStep(-1); return; }
    setActiveStep(-1);
    let i = 0;
    const tick = () => {
      setActiveStep(i);
      i++;
      if (i < steps.length) setTimeout(tick, 520);
    };
    setTimeout(tick, 300);
  }, [visible, category]);

  if (!visible) return null;

  return (
    <div className="journey-wrapper">
      <div className="journey-title">
        <span className="journey-label">Waste Journey</span>
        <span className="journey-cat" style={{ color: steps[4]?.color }}>{category}</span>
      </div>

      <div className="journey-steps">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className={`journey-step ${i <= activeStep ? 'active' : ''} ${i === activeStep ? 'current' : ''}`}>
              <div
                className="step-icon-wrap"
                style={i <= activeStep ? { background: step.color + '22', borderColor: step.color } : {}}
              >
                <span className="step-icon">{step.icon}</span>
                {i <= activeStep && (
                  <div className="step-pulse" style={{ '--pc': step.color }} />
                )}
              </div>
              <div className="step-info">
                <span className="step-label" style={i <= activeStep ? { color: step.color } : {}}>
                  {step.label}
                </span>
                {i === activeStep && (
                  <span className="step-desc">{step.desc}</span>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`journey-connector ${i < activeStep ? 'filled' : ''}`}>
                <div className="connector-line" style={i < activeStep ? { background: steps[i + 1].color } : {}} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="journey-footer">
        Recycling this item correctly saves up to <strong>the equivalent</strong> of several new products.
      </p>
    </div>
  );
}

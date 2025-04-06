import React from 'react';

function ResultBox({ result }) {
  
  const labels = Array.isArray(result?.labels) ? result.labels : []; 
 
  const isDog = labels.length > 0 && labels[0]?.label?.toLowerCase() === 'dog';
  const confidence = isDog ? labels[0]?.confidence : 0;

  return (
    <div className="result-box">
      {isDog ? (
        <div className="result-message result-success">
          ✅ Dog! Confidence: {confidence?.toFixed(2)}%
        </div>
      ) : (
        <>
          <div className="result-message result-error">
             {labels.length > 0 ? '❌ Not a dog!' : '🤔 Could not detect labels.'}
          </div>
          {labels.length > 0 && (
            <ul>
              {labels.map((label, i) => (
                <li key={i}>
                  {label.label} — {label.confidence?.toFixed(2)}%
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default ResultBox;

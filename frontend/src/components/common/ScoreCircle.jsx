export default function ScoreCircle({ score = 0, size = 100, strokeWidth = 8, color = '#28a5fd', label = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize={size / 4} fontWeight="700" fontFamily="Space Grotesk">
          {score}
        </text>
      </svg>
      {label && <p className="text-xs text-gray-400 text-center">{label}</p>}
    </div>
  );
}

export default function Mountains() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 1 }}>
      <svg
        viewBox="0 0 1440 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full"
        style={{ height: '180px' }}
      >
        {/* Back mountains */}
        <polygon points="0,180 120,80 240,130 380,50 520,110 640,40 760,100 900,30 1040,90 1180,20 1320,80 1440,50 1440,180" fill="#050F1C" />
        {/* Snow caps */}
        <polygon points="380,50 360,90 400,90" fill="white" opacity="0.5" />
        <polygon points="640,40 618,85 662,85" fill="white" opacity="0.5" />
        <polygon points="900,30 876,78 924,78" fill="white" opacity="0.5" />
        <polygon points="1180,20 1154,72 1206,72" fill="white" opacity="0.5" />
        {/* Front mountains */}
        <polygon points="0,180 80,110 200,150 320,90 460,140 580,70 700,120 820,60 960,115 1100,55 1240,105 1360,75 1440,95 1440,180" fill="#071020" />
        {/* Snow caps front */}
        <polygon points="320,90 302,125 338,125" fill="white" opacity="0.4" />
        <polygon points="580,70 560,110 600,110" fill="white" opacity="0.4" />
        <polygon points="820,60 798,102 842,102" fill="white" opacity="0.4" />
        <polygon points="1100,55 1076,100 1124,100" fill="white" opacity="0.4" />
        {/* Teal glow line along mountain ridge */}
        <polyline points="0,180 80,110 200,150 320,90 460,140 580,70 700,120 820,60 960,115 1100,55 1240,105 1360,75 1440,95" fill="none" stroke="#00C4CC" strokeWidth="1.5" opacity="0.25" />
      </svg>
    </div>
  )
}

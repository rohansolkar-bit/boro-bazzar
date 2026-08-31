import Link from 'next/link';

const categories = [
  { id: 1,  label: 'Fruits &\nVegetables',    emoji: '🍎', bg: '#fff5f0', border: '#fde8dc' },
  { id: 2,  label: 'Meats &\nSeafood',        emoji: '🥩', bg: '#fff0f0', border: '#fdd8d8' },
  { id: 3,  label: 'Breaksfast\n& Dairy',     emoji: '🍳', bg: '#fffbf0', border: '#fef2cc' },
  { id: 4,  label: 'Breads &\nBakery',        emoji: '🍞', bg: '#fff8f0', border: '#fdecd8' },
  { id: 5,  label: 'Beverages',               emoji: '🧃', bg: '#f0fbff', border: '#d0eefa' },
  { id: 6,  label: 'Frozen\nFoods',           emoji: '🧊', bg: '#f0f6ff', border: '#d0e4fc' },
  { id: 7,  label: 'Biscuits &\nSnacks',      emoji: '🍪', bg: '#fdf5e6', border: '#fae3b0' },
  { id: 8,  label: 'Grocery &\nStaples',      emoji: '🛒', bg: '#f0fff4', border: '#c6f0d4' },
  { id: 9,  label: 'Baby &\nPregnancy',       emoji: '👶', bg: '#fdf0ff', border: '#f0d0fc' },
  { id: 10, label: 'Healthcare',              emoji: '💊', bg: '#f0f9ff', border: '#c7e9fc' },
];

export default function TopCategories() {
  return (
    <>
      <style>{`
        .tc-section {
          width: 100%;
          padding: 24px 0 8px;
          
        }

        .tc-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .tc-header-left {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }

        .tc-title {
          font-size: 20px;
          font-weight: 800;
          color: #111827;
          font-family: 'Outfit', sans-serif;
          line-height: 1;
        }

        .tc-subtitle {
          font-size: 13px;
          color: #9ca3af;
        }

        .tc-view-all {
          font-size: 13px;
          font-weight: 600;
          color: #22c55e;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transition: gap 0.2s ease;
        }
        .tc-view-all:hover { gap: 8px; }

        /* Scrollable row */
        .tc-row {
          display: flex;
          align-items: flex-start;
          gap: 19px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-top: 15px
        }
        .tc-row::-webkit-scrollbar { display: none; }

        /* Category card */
        .tc-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          text-decoration: none;
          flex: 0 0 auto;
          width: 110px;
          transition: transform 0.2s ease;
        }
        .tc-card:hover { transform: translateY(-4px); }

        .tc-icon-box {
          width: 90px;
          height: 90px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          transition: box-shadow 0.2s ease;
          flex-shrink: 0;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15)
        }
        .tc-card:hover .tc-icon-box {
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }

        .tc-label {
          font-size: 11.5px;
          font-weight: 500;
          color: #374151;
          text-align: center;
          line-height: 1.4;
          white-space: pre-line;
        }

        @media (max-width: 640px) {
          .tc-title  { font-size: 17px; }
          .tc-card   { width: 76px; }
          .tc-icon-box { width: 62px; height: 62px; font-size: 28px; }
        }
      `}</style>

      <section className="tc-section px-8">
        {/* Header */}
        <div className="tc-header px-3">
          <div className="tc-header-left">
            <span className="tc-title">Top Categories</span>
            <span className="tc-subtitle">New products with updated stocks.</span>
          </div>
          <Link href="/features" className="tc-view-all">
            View All
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Category cards row */}
        <div className="tc-row px-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/features`}
              id={`category-${cat.id}`}
              className="tc-card"
            >
              <div
                className="tc-icon-box"
                style={{ backgroundColor : "#FFFFFF" }}
              >
                {cat.emoji}
              </div>
              <span className="tc-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

"use client";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
     

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f5f5f5"
        }}
      >
        {children}
      </div>
    </div>
  );
}
import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import TopBar from "../../components/ui/TopBar";
import { Check } from "lucide-react";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col">
      <TopBar />

      {/* Hero */}
      <section className="flex-1 flex items-center px-8 pt-14 pb-10 max-w-6xl mx-auto w-full gap-16">
        {/* Left: headline */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full border text-[11px] font-medium uppercase tracking-widest bg-[#E8F0EB] border-[#B8D4C0] text-[#2A5A38]">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4A7C59", display: "inline-block" }}></span>
            New — AI-powered invoice parsing
          </div>
          <h1
            className="text-4xl md:text-5xl text-[#0F0F0D] leading-[1.1] mb-6"
            style={{ fontFamily: "Lora, Georgia, serif", fontWeight: 400, letterSpacing: "-0.03em" }}
          >
            Professional invoices,
            <br />
            written by AI.
          </h1>
          <p className="text-base text-[#5A5848] leading-relaxed mb-8 max-w-md">
            Paste any invoice text. Our AI reads it, extracts every detail, and
            builds a typeset document ready to send in seconds.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/signup")}
              className="bg-[#4A7C59] text-[#F0EDE4] text-sm font-medium rounded-[6px] h-11 px-6 hover:bg-[#3D6B4C] transition-colors"
            >
              start free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-[#5A5848] border border-[#D8D4C8] rounded-[6px] h-11 px-6 hover:bg-[#EFECE3] transition-colors"
            >
              sign in
            </button>
          </div>
          <p className="text-[12px] text-[#8A8778] flex items-center mt-3">
            <Check className="w-3 h-3 text-[#4A7C59] inline mr-1" />
            No credit card required
          </p>
        </div>

        {/* Right: split-pane demo */}
        <div className="flex-1 max-w-lg hidden lg:block">
          <div className="border border-[#2A2820] rounded-[10px] overflow-hidden shadow-[0_2px_24px_rgba(28,27,22,0.08)]">
            {/* Mock topbar */}
            <div className="bg-[#1C1B16] h-8 flex items-center px-3 gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3A3930]" />
              <div className="w-2 h-2 rounded-full bg-[#3A3930]" />
              <div className="w-2 h-2 rounded-full bg-[#3A3930]" />
            </div>
            {/* Mock workspace */}
            <div className="flex min-h-[320px]">
              {/* Left pane */}
              <div className="w-1/2 bg-[#F7F5EF] border-r border-[#D8D4C8] p-3">
                <div className="bg-[#EFECE3] rounded-[4px] px-2 py-1 mb-2 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#8A8778]" />
                  <span className="text-[9px] text-[#5A5848]">input.txt</span>
                  <span className="text-[8px] text-[#9A9888] bg-[#E8E4D8] px-1 rounded-[3px]">
                    plain text
                  </span>
                </div>
                <div className="space-y-1.5 px-1">
                  {[
                    "Client: Acme Corp",
                    "Email: billing@acme.com",
                    "",
                    "Items:",
                    "- Web Dev, 10hr @ ₹2000",
                    "- UI Design, 5hr @ ₹1500",
                  ].map((line, i) => (
                    <div key={i} className="flex items-center gap-1">
                      {line.startsWith("-") ? (
                        <span
                          className="text-[9px] font-['JetBrains_Mono','Fira_Code',monospace] text-[#5A5848] bg-[#EBE8DF] px-1 rounded-[3px]"
                        >
                          {line}
                        </span>
                      ) : (
                        <span className="text-[9px] font-['JetBrains_Mono','Fira_Code',monospace] text-[#8A8778]">
                          {line || " "}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Right pane */}
              <div className="w-1/2 bg-[#EFECD8]">
                <div style={{ background: '#FDFCF8', padding: '16px', height: '100%' }}>

                  {/* Invoice header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '18px', fontWeight: 400, color: '#1C1B16' }}>
                        Invoice
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#8A8778', marginTop: '2px' }}>
                        INV-20260506-4821
                      </div>
                    </div>
                    <div style={{ width: '24px', height: '24px', background: '#1C1B16', borderRadius: '4px' }} />
                  </div>

                  {/* Divider */}
                  <div style={{ height: '0.5px', background: '#D8D4C8', marginBottom: '10px' }} />

                  {/* Billed to */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9A9888', marginBottom: '4px' }}>
                      Billed to
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: '#1C1B16' }}>Acme Corp</div>
                    <div style={{ fontSize: '11px', color: '#7A7868' }}>billing@acme.com</div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '0.5px', background: '#D8D4C8', marginBottom: '10px' }} />

                  {/* Line items */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#2A2820' }}>Web Development</div>
                        <div style={{ fontSize: '10px', color: '#8A8778' }}>10 hrs × ₹2,000</div>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#2A2820', fontWeight: 500 }}>₹20,000</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#2A2820' }}>UI Design Review</div>
                        <div style={{ fontSize: '10px', color: '#8A8778' }}>5 hrs × ₹1,500</div>
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#2A2820', fontWeight: 500 }}>₹7,500</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '0.5px', background: '#D8D4C8', marginBottom: '8px' }} />

                  {/* Total */}
                  <div style={{ background: '#1C1B16', borderRadius: '5px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#8A8778' }}>Total due</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 500, color: '#F0EDE4' }}>₹27,500</span>
                  </div>

                </div>
              </div>
            </div>
            {/* Mock status bar */}
            <div className="bg-[#1C1B16] h-8 flex items-center px-3 gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4A7C59]" />
              <span className="text-[9px] text-[#8A8778]">
                AI extracted 2 items · GST auto-applied
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#EFECE3] px-8 py-14">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] font-medium uppercase tracking-widest text-[#6A6858] mb-8 text-center">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Paste your text",
                body: "Drop in any raw invoice copy — emails, notes, spreadsheet rows. No structure needed.",
              },
              {
                step: "02",
                title: "AI extracts everything",
                body: "Client details, line items, rates, and payment terms — all parsed and structured instantly.",
              },
              {
                step: "03",
                title: "Send a real document",
                body: "Review the typeset invoice, adjust any field, then save or download as PDF.",
              },
            ].map(({ step, title, body }) => (
              <div key={step}>
                <p className="text-sm font-medium font-['JetBrains_Mono','Fira_Code',monospace] text-[#6A6858] mb-3">
                  {step}
                </p>
                <h3 className="text-lg font-medium text-[#0F0F0D] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[#5A5848] leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1C1B16] py-16 px-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-widest text-[#4A7C59] mb-4">
          Get started today
        </p>
        <h2
          className="font-['Lora',Georgia,serif] font-medium text-white text-4xl mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Ready to send your first invoice?
        </h2>
        <p className="text-[#8A8778] text-base mb-8">
          Paste your text. AI does the rest.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-[#4A7C59] text-[#F0EDE4] text-sm font-medium h-11 px-8 rounded-[6px] hover:bg-[#3D6B4C] transition-colors"
        >
          start free
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D8D4C8] px-8 py-5 flex items-center justify-between">
        <p className="text-[11px] text-[#9A9888]">AI Invoice Generator</p>
        <p className="text-[11px] text-[#9A9888]">© 2026</p>
      </footer>
    </div>
  );
};

export default LandingPage;
